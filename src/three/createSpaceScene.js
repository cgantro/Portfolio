import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import {
  atmosphereFragmentShader,
  atmosphereVertexShader,
  starfieldFragmentShader,
  starfieldVertexShader,
  sunFragmentShader,
  sunVertexShader,
} from "./shaders";

const planetVertexShader = `
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPos = worldPos.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const planetFragmentShader = `
uniform vec3 uSunWorldPos;
uniform vec3 uBaseColor;

varying vec3 vWorldPos;
varying vec3 vWorldNormal;

void main() {
  vec3 N = normalize(vWorldNormal);
  vec3 L = normalize(uSunWorldPos - vWorldPos);
  vec3 V = normalize(cameraPosition - vWorldPos);
  vec3 R = reflect(-L, N);

  float diffuse = max(dot(N, L), 0.0);
  float specular = pow(max(dot(R, V), 0.0), 24.0) * 0.18;

  vec3 day = uBaseColor * (0.1 + diffuse * 0.95);
  vec3 night = uBaseColor * 0.05;
  vec3 color = mix(night, day, diffuse) + vec3(specular);

  gl_FragColor = vec4(color, 1.0);
}
`;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function createSpaceCursor({
  size = 40,
  ringColor = "#9edfff",
  centerColor = "#eaffff",
  lineColor = "#84cfff",
  ringRadius = 9,
  lineOuter = 17,
  lineInner = 11,
} = {}) {
  if (typeof document === "undefined") return "crosshair";

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "crosshair";

  const c = size / 2;
  ctx.clearRect(0, 0, size, size);

  ctx.shadowColor = ringColor;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(c, c, ringRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(c, c - lineOuter);
  ctx.lineTo(c, c - lineInner);
  ctx.moveTo(c, c + lineInner);
  ctx.lineTo(c, c + lineOuter);
  ctx.moveTo(c - lineOuter, c);
  ctx.lineTo(c - lineInner, c);
  ctx.moveTo(c + lineInner, c);
  ctx.lineTo(c + lineOuter, c);
  ctx.stroke();

  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(c, c, 2.4, 0, Math.PI * 2);
  ctx.fill();

  const hotspot = Math.floor(c);
  return `url("${canvas.toDataURL("image/png")}") ${hotspot} ${hotspot}, crosshair`;
}

function createTextSprite(text, color = "#d8f1ff") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const fontSize = 44;
  ctx.font = `600 ${fontSize}px Pretendard, Noto Sans KR, sans-serif`;

  const width = Math.ceil(ctx.measureText(text).width + 48);
  const height = Math.ceil(fontSize + 30);
  canvas.width = width;
  canvas.height = height;

  ctx.font = `600 ${fontSize}px Pretendard, Noto Sans KR, sans-serif`;
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 12, height / 2 + 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set((width / height) * 2.05, 2.05, 1);
  return sprite;
}

function buildStarfield(renderer) {
  const count = 3200;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const radius = 90 + Math.random() * 220;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    sizes[i] = 0.85 + Math.random() * 2.2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(renderer.getPixelRatio(), 2) },
    },
    vertexShader: starfieldVertexShader,
    fragmentShader: starfieldFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function buildSun() {
  const group = new THREE.Group();

  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(0xffd180) },
      uColorB: { value: new THREE.Color(0xff7b37) },
    },
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
  });

  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.85, 64, 64), sunMaterial);
  group.add(sun);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(3.25, 64, 64),
    new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    })
  );
  group.add(atmosphere);

  return { group, sun, sunMaterial };
}

function createOrbitRing(distance) {
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: 0x2b537e,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(distance - 0.03, distance + 0.03, 140),
    baseMaterial
  );

  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x8fd1ff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowRing = new THREE.Mesh(
    new THREE.RingGeometry(distance - 0.1, distance + 0.1, 160),
    glowMaterial
  );
  ring.add(glowRing);

  ring.userData.baseMaterial = baseMaterial;
  ring.userData.glowMaterial = glowMaterial;

  ring.rotation.x = Math.PI / 2;
  glowRing.rotation.x = 0;
  return ring;
}

function setOrbitRingState(ring, isActive) {
  if (!ring) return;
  const baseMaterial = ring.userData.baseMaterial;
  const glowMaterial = ring.userData.glowMaterial;
  if (!baseMaterial || !glowMaterial) return;

  if (isActive) {
    baseMaterial.color.setHex(0x76beff);
    baseMaterial.opacity = 0.78;
    glowMaterial.opacity = 0.6;
    ring.renderOrder = 2;
  } else {
    baseMaterial.color.setHex(0x2b537e);
    baseMaterial.opacity = 0.35;
    glowMaterial.opacity = 0;
    ring.renderOrder = 0;
  }
}

function createPlanetMaterial(colorHex, sunWorldPosUniform) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uSunWorldPos: { value: sunWorldPosUniform },
      uBaseColor: { value: new THREE.Color(colorHex) },
    },
    vertexShader: planetVertexShader,
    fragmentShader: planetFragmentShader,
  });
}

function createHoverOutline(baseMesh, colorHex) {
  const outline = new THREE.Mesh(
    baseMesh.geometry.clone(),
    new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.9,
      side: THREE.BackSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  outline.visible = false;
  outline.renderOrder = 3;
  outline.scale.set(1.14, 1.14, 1.14);
  // Prevent the decorative outline from being picked by raycaster.
  outline.raycast = () => null;
  return outline;
}

export function createSpaceScene({ mountEl, projects, onSelect, centralInfo }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020611);
  scene.fog = new THREE.FogExp2(0x030916, 0.0075);
  const baseFocusOffset = new THREE.Vector3(8.2, 0, 0);
  const screenOffsetDistance = 2.9;
  const defaultCameraPosition = new THREE.Vector3(8.2, 11, 35);

  const camera = new THREE.PerspectiveCamera(58, mountEl.clientWidth / mountEl.clientHeight, 0.1, 800);
  camera.position.copy(defaultCameraPosition);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const idleCursor = createSpaceCursor({
    size: 40,
    ringColor: "#9edfff",
    centerColor: "#f0feff",
    lineColor: "#82ccff",
    ringRadius: 9,
    lineOuter: 17,
    lineInner: 11,
  });
  const hoverCursor = createSpaceCursor({
    size: 44,
    ringColor: "#ffe8a9",
    centerColor: "#fff8de",
    lineColor: "#ffd579",
    ringRadius: 10,
    lineOuter: 19,
    lineInner: 12,
  });
  renderer.domElement.style.cursor = idleCursor;
  mountEl.appendChild(renderer.domElement);

  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(mountEl.clientWidth, mountEl.clientHeight),
    1.2,
    0.5,
    0.22
  );
  bloomPass.threshold = 0.2;
  bloomPass.strength = 1.28;
  bloomPass.radius = 0.52;
  composer.addPass(renderPass);
  composer.addPass(bloomPass);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.35;
  controls.minDistance = 7;
  controls.maxDistance = 120;
  controls.target.copy(baseFocusOffset);
  controls.update();

  const starfield = buildStarfield(renderer);
  scene.add(starfield);

  const { group: sunGroup, sun, sunMaterial } = buildSun();
  scene.add(sunGroup);

  const sunLabel = createTextSprite("홍윤표", "#ffe6bf");
  sunLabel.position.set(0, 5.2, 0);
  scene.add(sunLabel);

  const rotators = [];
  const pickables = [];
  const targetById = new Map();
  const hoverScales = new Map();
  const sunWorldPos = new THREE.Vector3(0, 0, 0);
  const planetMaterials = [];
  const followTargetPos = new THREE.Vector3();
  const followTargetWithOffset = new THREE.Vector3();
  const followDestination = new THREE.Vector3();
  const followDelta = new THREE.Vector3();
  const liftOffset = new THREE.Vector3(0, 0.95, 0);
  const followAimOffset = new THREE.Vector3();

  const registerPickable = (
    mesh,
    payload,
    focusDistance = 8.2,
    entityId = null,
    outlineColor = 0x8fd1ff
  ) => {
    mesh.userData.payload = payload;
    mesh.userData.focusDistance = focusDistance;
    const outline = createHoverOutline(mesh, outlineColor);
    mesh.userData.outline = outline;
    mesh.add(outline);
    if (entityId) {
      mesh.userData.entityId = entityId;
      targetById.set(entityId, mesh);
    }
    pickables.push(mesh);
    hoverScales.set(mesh.uuid, mesh.scale.clone());
  };

  const centralPayload = centralInfo || {
    id: "about",
    kind: "항성",
    title: "Backend & System Engineer",
    subtitle: "Core Profile",
    fullText: "중앙 항성 프로필 정보가 설정되지 않았습니다.",
  };
  const centralEntityId = centralPayload.id || "about";
  registerPickable(
    sun,
    centralPayload,
    9.8,
    centralEntityId,
    0xffc173
  );

  projects.forEach((project, projectIndex) => {
    const pivot = new THREE.Object3D();
    scene.add(pivot);
    const orbitRing = createOrbitRing(project.orbitDistance);
    scene.add(orbitRing);

    const planet = new THREE.Mesh(
      new THREE.IcosahedronGeometry(project.radius, 4),
      createPlanetMaterial(project.color, sunWorldPos)
    );
    planetMaterials.push(planet.material);

    const angle = (Math.PI * 2 * projectIndex) / projects.length;
    planet.position.set(
      Math.cos(angle) * project.orbitDistance,
      (projectIndex - 0.5) * 0.75,
      Math.sin(angle) * project.orbitDistance
    );
    planet.userData.orbitRing = orbitRing;
    pivot.add(planet);

    const planetLabel = createTextSprite(project.name);
    planetLabel.position.set(
      planet.position.x * 1.05,
      planet.position.y + project.radius + 0.95,
      planet.position.z * 1.05
    );
    pivot.add(planetLabel);

    rotators.push({ pivot, speed: project.orbitSpeed });

    registerPickable(
      planet,
      {
        id: project.id,
        kind: "행성",
        title: project.name,
        subtitle: project.subtitle,
        tabLabels: project.tabLabels,
        fullText: project.fullText,
      },
      9,
      project.id,
      0x8fd1ff
    );
  });

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const worldPosition = new THREE.Vector3();

  let highlighted = null;
  let hovered = null;
  let frameId = 0;
  let destroyed = false;
  let followTarget = null;
  let activeOrbitRing = null;

  let transition = null;
  const transitionDuration = 900;

  const applyScaleByFactor = (mesh, factor) => {
    if (!mesh) return;
    const base = hoverScales.get(mesh.uuid);
    if (!base) return;
    mesh.scale.set(base.x * factor, base.y * factor, base.z * factor);
  };

  const refreshVisualState = (mesh) => {
    if (!mesh) return;
    const isSelected = mesh === highlighted;
    const isHovered = mesh === hovered;

    if (isSelected) applyScaleByFactor(mesh, 1.2);
    else if (isHovered) applyScaleByFactor(mesh, 1.1);
    else applyScaleByFactor(mesh, 1);

    if (mesh.userData.outline) {
      mesh.userData.outline.visible = isHovered;
    }
  };

  const setActiveOrbitRing = (nextRing) => {
    if (activeOrbitRing === nextRing) return;
    if (activeOrbitRing) setOrbitRingState(activeOrbitRing, false);
    activeOrbitRing = nextRing || null;
    if (activeOrbitRing) setOrbitRingState(activeOrbitRing, true);
  };

  const startCameraTransition = (targetObject) => {
    controls.autoRotate = false;
    controls.enabled = false;
    followTarget = null;

    targetObject.getWorldPosition(worldPosition);
    const direction = camera.position.clone().sub(worldPosition);
    if (direction.lengthSq() < 0.0001) {
      direction.set(1, 0.35, 1);
    }
    direction.normalize();

    const focusDistance = targetObject.userData.focusDistance || 8;
    const viewRight = new THREE.Vector3(1, 0, 0)
      .applyQuaternion(camera.quaternion)
      .normalize();
    const aimOffset = viewRight.multiplyScalar(screenOffsetDistance);
    const destinationPosition = worldPosition
      .clone()
      .addScaledVector(direction, focusDistance)
      .add(liftOffset);

    transition = {
      startedAt: performance.now(),
      duration: transitionDuration,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      toPosition: destinationPosition,
      toTarget: worldPosition.clone().add(aimOffset),
      targetObject,
      focusDistance,
      direction: direction.clone(),
      aimOffset,
      reset: false,
    };
  };

  const clearFocusTarget = ({ selectCentral = true } = {}) => {
    const previousHighlighted = highlighted;
    highlighted = null;
    refreshVisualState(previousHighlighted);
    setActiveOrbitRing(null);

    followTarget = null;
    followAimOffset.set(0, 0, 0);
    controls.autoRotate = false;
    controls.enabled = false;

    transition = {
      startedAt: performance.now(),
      duration: transitionDuration,
      fromPosition: camera.position.clone(),
      fromTarget: controls.target.clone(),
      toPosition: defaultCameraPosition.clone(),
      toTarget: baseFocusOffset.clone(),
      targetObject: null,
      focusDistance: 0,
      direction: new THREE.Vector3(),
      aimOffset: new THREE.Vector3(),
      reset: true,
    };

    if (selectCentral) {
      onSelect(centralPayload);
    }
  };

  const focusObject = (targetObject) => {
    if (!targetObject?.userData?.payload) return false;

    const previous = highlighted;
    highlighted = targetObject;

    refreshVisualState(previous);
    refreshVisualState(targetObject);
    setActiveOrbitRing(targetObject.userData.orbitRing || null);

    onSelect(targetObject.userData.payload);
    startCameraTransition(targetObject);
    return true;
  };

  const findPickTarget = (hits) =>
    hits.find((entry) => entry.object?.userData?.payload)?.object ?? null;

  const setHoveredObject = (nextTarget) => {
    if (hovered === nextTarget) return;
    const previous = hovered;
    hovered = nextTarget;
    refreshVisualState(previous);
    refreshVisualState(nextTarget);
    renderer.domElement.style.cursor = hovered ? hoverCursor : idleCursor;
  };

  const updatePointerPick = (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    return findPickTarget(raycaster.intersectObjects(pickables, true));
  };

  const onPointerMove = (event) => {
    const target = updatePointerPick(event);
    setHoveredObject(target);
  };

  const onPointerLeave = () => {
    setHoveredObject(null);
  };

  const onPointerDown = (event) => {
    const target = updatePointerPick(event);

    if (!target) return;
    setHoveredObject(target);
    if (target === highlighted && (followTarget === target || transition?.targetObject === target)) {
      clearFocusTarget({ selectCentral: true });
      return;
    }
    focusObject(target);
  };

  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);

  const resize = () => {
    if (destroyed) return;
    camera.aspect = mountEl.clientWidth / mountEl.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    composer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    bloomPass.setSize(mountEl.clientWidth, mountEl.clientHeight);

    const material = starfield.material;
    if (material.uniforms?.uPixelRatio) {
      material.uniforms.uPixelRatio.value = Math.min(renderer.getPixelRatio(), 2);
    }
  };

  window.addEventListener("resize", resize);

  const clock = new THREE.Clock();

  const animate = () => {
    frameId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    sunMaterial.uniforms.uTime.value = elapsed;
    starfield.material.uniforms.uTime.value = elapsed;

    sun.rotation.y += 0.0012;
    const pulse = 1 + Math.sin(elapsed * 1.45) * 0.06;
    sun.scale.setScalar(pulse);
    sun.getWorldPosition(sunWorldPos);
    planetMaterials.forEach((material) => {
      material.uniforms.uSunWorldPos.value.copy(sunWorldPos);
    });

    rotators.forEach((node) => {
      node.pivot.rotation.y += node.speed;
    });

    if (transition) {
      const now = performance.now();
      const elapsedMs = now - transition.startedAt;
      const t = Math.min(elapsedMs / transition.duration, 1);
      const eased = easeInOutCubic(t);

      if (!transition.reset && transition.targetObject) {
        transition.targetObject.getWorldPosition(followTargetPos);
        transition.toTarget.copy(followTargetPos).add(transition.aimOffset);
        followDestination
          .copy(transition.direction)
          .multiplyScalar(transition.focusDistance)
          .add(liftOffset);
        transition.toPosition.copy(followTargetPos).add(followDestination);
      }

      camera.position.lerpVectors(transition.fromPosition, transition.toPosition, eased);
      controls.target.lerpVectors(transition.fromTarget, transition.toTarget, eased);

      if (t >= 1) {
        if (transition.reset) {
          followTarget = null;
          followAimOffset.set(0, 0, 0);
          controls.autoRotate = true;
        } else {
          followTarget = transition.targetObject;
          followAimOffset.copy(transition.aimOffset);
        }
        controls.enabled = true;
        transition = null;
      }
    }

    if (followTarget && !transition) {
      followTarget.getWorldPosition(followTargetPos);
      followTargetWithOffset.copy(followTargetPos).add(followAimOffset);
      followDelta.copy(followTargetWithOffset).sub(controls.target);
      controls.target.add(followDelta);
      camera.position.add(followDelta);
    }

    controls.update();
    composer.render();
  };

  animate();

  return {
    focusById(entityId) {
      const target = targetById.get(entityId);
      if (!target) return false;
      if (target === highlighted && (followTarget === target || transition?.targetObject === target)) {
        clearFocusTarget({ selectCentral: true });
        return true;
      }
      return focusObject(target);
    },
    clearFocus() {
      clearFocusTarget({ selectCentral: true });
      return true;
    },
    dispose() {
      destroyed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      controls.dispose();

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();

        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              mat.dispose();
            });
          } else {
            if (obj.material.map) obj.material.map.dispose();
            obj.material.dispose();
          }
        }
      });

      if (typeof composer.dispose === "function") composer.dispose();
      renderer.dispose();
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    },
  };
}
