export const sunVertexShader = `
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const sunFragmentShader = `
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec2 vUv;
varying vec3 vNormal;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv * 4.8;
  float n = noise(uv + vec2(uTime * 0.09, -uTime * 0.07));
  float n2 = noise(uv * 1.8 - vec2(uTime * 0.06, uTime * 0.05));
  float plasma = n * 0.65 + n2 * 0.35;

  float fresnel = pow(1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 2.3);
  vec3 base = mix(uColorA, uColorB, plasma);
  vec3 color = base + fresnel * vec3(1.0, 0.7, 0.3) * 0.35;

  gl_FragColor = vec4(color, 1.0);
}
`;

export const starfieldVertexShader = `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
varying float vAlpha;

void main() {
  vec3 p = position;
  float twinkle = sin(uTime * 0.9 + p.x * 0.01 + p.y * 0.015 + p.z * 0.01) * 0.5 + 0.5;
  vAlpha = 0.25 + twinkle * 0.75;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float scale = 280.0 / max(10.0, -mvPosition.z);
  gl_PointSize = aSize * uPixelRatio * scale;
}
`;

export const starfieldFragmentShader = `
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - vec2(0.5);
  float d = length(c);
  float glow = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vec3(0.62, 0.83, 1.0), glow * vAlpha);
}
`;

export const atmosphereVertexShader = `
varying vec3 vNormal;
void main() {
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const atmosphereFragmentShader = `
varying vec3 vNormal;
void main() {
  float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
  gl_FragColor = vec4(0.36, 0.68, 1.0, intensity * 0.35);
}
`;
