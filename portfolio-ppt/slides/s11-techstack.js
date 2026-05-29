const { FONT, C } = require("../constants");
const { addBoxP7, addHeader, addSoWhat, addBottomStrip } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "TECH STACK",
    "4개 프로젝트에서 직접 사용하며 검증한 기술 스택",
    "Spring Boot · AWS · C++ · UE5 · 인프라");

  addBoxP7(sld);

  // ── Left: Core Backend ────────────────────────────────────────────
  sld.addText("Core Backend", {
    x:0.622, y:2.40, w:6.94, h:0.30,
    fontFace:FONT, fontSize:11, bold:true, color:C.brand,
  });

  const coreItems = [
    { cat:"Spring Boot 3.x",   items:"Java 17/21 · Spring Security · JWT · AOP  (STICKER · AutoWing · Korean Snack Shop)" },
    { cat:"AWS SQS / S3",      items:"비동기 AI 파이프라인 · SmartLifecycle 소비기  (STICKER)" },
    { cat:"Redis",             items:"Refresh Token · 분산 락 · dedup · 날씨 캐시 · 쓰기 버퍼  (STICKER · AutoWing)" },
    { cat:"MQTT / WebSocket",  items:"STOMP Broker · 역할 기반 채널 · 1분 핸드셰이크 토큰  (AutoWing)" },
    { cat:"PostgreSQL / MySQL", items:"시계열 이력 저장 · Redis 배치 후 적재 · AWS RDS  (AutoWing · Korean Snack Shop)" },
    { cat:"Prometheus · Grafana", items:"Micrometer AOP 계층별 자동 수집 · p95/p99 SLO 시각화  (STICKER)" },
  ];
  coreItems.forEach((it, i) => {
    sld.addText(it.cat, {
      x:0.622, y:2.80 + i * 0.48, w:2.60, h:0.28,
      fontFace:FONT, fontSize:9.5, bold:true, color:C.ink,
    });
    sld.addText(it.items, {
      x:3.30, y:2.80 + i * 0.48, w:4.12, h:0.28,
      fontFace:FONT, fontSize:9, color:C.mute,
    });
  });

  // ── Right Top: C++ / Game Systems ─────────────────────────────────
  sld.addText("C++ / Game Systems", {
    x:8.162, y:2.40, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  [
    "C++17 · OpenGL · libjpeg-turbo  (RobotPal)",
    "Emscripten WASM · COI Service Worker  (RobotPal)",
    "UE5 (C++) · UDP · Opus · HRTF  (Mausoleum)",
    "uWebSockets · Protobuf · CMake  (Mausoleum)",
  ].forEach((it, i) => {
    sld.addText("· " + it, {
      x:8.262, y:2.72 + i * 0.30, w:4.35, h:0.26,
      fontFace:FONT, fontSize:8.5, color:C.mute,
    });
  });

  // ── Right Bottom: Infra / DevOps ──────────────────────────────────
  sld.addText("Infra / DevOps", {
    x:8.162, y:4.24, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  [
    "GitLab CI/CD · Docker Buildx · Traefik  (STICKER)",
    "Docker · Jenkins · AWS EC2  (Mausoleum · AutoWing)",
    "Micrometer AOP · p95/p99 메트릭  (STICKER)",
    "Python · FastMCP · Smithery  (SSAFY BOB)",
  ].forEach((it, i) => {
    sld.addText("· " + it, {
      x:8.262, y:4.56 + i * 0.30, w:4.35, h:0.26,
      fontFace:FONT, fontSize:8.5, color:C.mute,
    });
  });

  addSoWhat(sld, "백엔드 구조 설계가 중심이지만, C++ 시스템 프로그래밍부터 AI 서버 연동까지 직접 다뤄보며 시야를 넓혔습니다.");
  addBottomStrip(sld, 11, "");
};
