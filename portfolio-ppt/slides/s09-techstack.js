const { FONT, C } = require("../constants");
const { addBoxP7, addHeader, addSoWhat, addBottomStrip } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "TECH STACK",
    "4개 프로젝트에서 직접 사용하며 검증한 기술 스택",
    "Spring Boot · AWS · C++ · UE5 · 인프라");

  addBoxP7(sld);

  sld.addText("Core Backend", {
    x:0.622, y:2.40, w:6.94, h:0.30,
    fontFace:FONT, fontSize:11, bold:true, color:C.brand,
  });

  const coreItems = [
    { cat:"Spring Boot 3.x",   items:"Java 17/21 · Spring Security · JWT · AOP" },
    { cat:"Redis",             items:"Refresh Token · 쓰기 버퍼 · 분산 락 · 중복 방지" },
    { cat:"MQTT",              items:"Eclipse Paho · 토픽별 텔레메트리/명령 경로 분리" },
    { cat:"WebSocket / STOMP", items:"STOMP Broker · 역할 기반 채널 · 1분 핸드셰이크 토큰" },
    { cat:"AWS SQS / S3",      items:"비동기 AI 파이프라인 · SmartLifecycle 소비기" },
    { cat:"PostgreSQL",        items:"시계열 이력 저장 · Redis 배치 후 적재" },
  ];
  coreItems.forEach((it, i) => {
    sld.addText(it.cat, {
      x:0.622, y:2.80 + i * 0.51, w:2.8, h:0.30,
      fontFace:FONT, fontSize:9.5, bold:true, color:C.ink,
    });
    sld.addText(it.items, {
      x:3.50, y:2.80 + i * 0.51, w:3.82, h:0.30,
      fontFace:FONT, fontSize:9.5, color:C.mute,
    });
  });

  sld.addText("Infra / DevOps", {
    x:8.162, y:2.40, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  ["GitLab CI/CD · Docker Buildx", "Prometheus · Grafana · Traefik", "Micrometer AOP · p95/p99"]
    .forEach((it, i) => {
      sld.addText("· " + it, {
        x:8.262, y:2.72 + i * 0.32, w:4.35, h:0.28,
        fontFace:FONT, fontSize:9, color:C.mute,
      });
    });

  sld.addText("기타 도메인", {
    x:8.162, y:4.40, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  ["C++17 · OpenGL · libjpeg (RobotPal)", "UE5 · C++ · UDP (mausoleum)", "Python · FastMCP · Smithery (BOB)"]
    .forEach((it, i) => {
      sld.addText("· " + it, {
        x:8.262, y:4.72 + i * 0.32, w:4.35, h:0.28,
        fontFace:FONT, fontSize:9, color:C.mute,
      });
    });

  addSoWhat(sld, "백엔드 구조 설계가 중심이지만, 하드웨어 연동부터 AI 서버 연결까지 직접 다뤄보며 시야를 넓혔습니다.");
  addBottomStrip(sld, 9, "");
};
