const { FONT, C } = require("../constants");
const { addBoxP5, addHeader, addSoWhat, addBottomStrip } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "OTHER PROJECTS",
    "AutoWing Car · SSAFY BOB · Korean Snack Shop",
    "Spring Boot · MQTT · A* 경로탐색 · Python FastMCP · JWT · Google OAuth2");

  addBoxP5(sld);

  // ── Left (larger): AutoWing Car ───────────────────────────────────
  const lx = 0.622;

  sld.addText("오토잉카 (AutoWing Car)", {
    x:lx, y:2.42, w:4.55, h:0.30,
    fontFace:FONT, fontSize:12, bold:true, color:C.brand,
  });
  sld.addText("공항 스마트 토잉카 관제 시스템  ·  Spring Boot 3.5 · Java 17 · MQTT · WebSocket/STOMP · A* · Redis · JWT", {
    x:lx, y:2.76, w:4.55, h:0.26,
    fontFace:FONT, fontSize:8.5, color:C.caption,
  });
  sld.addShape("line", { x:lx, y:3.08, w:4.35, h:0.01, line:{ color:C.containerLine, width:0.8 } });

  sld.addText("2026.01 – 2026.02  ·  6인  ·  백엔드 전담", {
    x:lx, y:3.16, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9, color:C.caption,
  });

  sld.addText("핵심 이슈 & 해결", {
    x:lx, y:3.46, w:4.55, h:0.26,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.brand,
  });

  const awItems = [
    {
      issue: "DB 커밋 전 MQTT 발행 → 관제 상태 불일치",
      fix: "afterCommit() 훅으로 이벤트 전파 순서 고정",
    },
    {
      issue: "텔레메트리 빈도만큼 DB 쓰기 요청 선형 증가",
      fix: "Redis 쓰기 버퍼 배치화 → write points -90%",
    },
    {
      issue: "GPS 좌표 과다 → payload 크기 과대",
      fix: "RDP 알고리즘 경로 단순화 → payload -90.36%",
    },
    {
      issue: "WebSocket 토큰이 URL에 노출",
      fix: "SOCKET 토큰 1분 수명 → 탈취 피해 범위 최소화",
    },
  ];
  awItems.forEach((it, i) => {
    const iy = 3.78 + i * 0.42;
    sld.addText("· " + it.issue, {
      x:lx, y:iy, w:4.55, h:0.20,
      fontFace:FONT, fontSize:8.5, color:C.caption,
    });
    sld.addText("  → " + it.fix, {
      x:lx, y:iy + 0.20, w:4.55, h:0.20,
      fontFace:FONT, fontSize:8.5, color:C.ink, bold:true,
    });
  });

  // ── Right (smaller): SSAFY BOB + Korean Snack Shop ───────────────
  const rx = 5.792;
  const rw = 6.90;

  // SSAFY BOB
  sld.addText("SSAFY BOB  ·  MCP 서버", {
    x:rx, y:2.42, w:rw, h:0.30,
    fontFace:FONT, fontSize:11, bold:true, color:C.brand,
  });
  sld.addText("Python · FastMCP · Smithery · uv", {
    x:rx, y:2.76, w:rw, h:0.24,
    fontFace:FONT, fontSize:9, color:C.caption,
  });
  sld.addShape("line", { x:rx, y:3.06, w:rw - 0.2, h:0.01, line:{ color:C.containerLine, width:0.8 } });
  sld.addText("LLM 에이전트가 SSAFY 식단 정보를 조회할 수 있는 MCP 서버 개발.\n@mcp.tool로 도구 등록. Pydantic 입력 스키마로 날짜·층수 파라미터 추출.\n요청 시점에 외부 JSON 페칭하는 stateless 구조 → Smithery 배포.", {
    x:rx, y:3.14, w:rw, h:0.80,
    fontFace:FONT, fontSize:9.5, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addShape("line", { x:rx, y:4.06, w:rw - 0.2, h:0.01, line:{ color:C.containerLine, width:0.8 } });

  // Korean Snack Shop
  sld.addText("Korean Snack Shop", {
    x:rx, y:4.14, w:rw, h:0.30,
    fontFace:FONT, fontSize:11, bold:true, color:C.mute,
  });
  sld.addText("Java 17 · Spring Boot · Spring Security · JWT · Google OAuth2 · AWS RDS · MySQL", {
    x:rx, y:4.48, w:rw, h:0.24,
    fontFace:FONT, fontSize:9, color:C.caption,
  });
  sld.addShape("line", { x:rx, y:4.78, w:rw - 0.2, h:0.01, line:{ color:C.containerLine, width:0.8 } });
  sld.addText("해외 대상 한국 간식 소개 쇼핑 플랫폼 백엔드.\nJWT + Spring Security 회원 인증 구현. Google OAuth2 소셜 로그인 연동.\nAWS RDS MySQL 직접 구축 및 EC2 배포.", {
    x:rx, y:4.86, w:rw, h:0.80,
    fontFace:FONT, fontSize:9.5, color:C.ink, lineSpacingMultiple:1.5,
  });

  addSoWhat(sld, "AutoWing의 afterCommit() 설계 경험이 STICKER의 SQS 정합성 설계로 이어졌습니다. 같은 문제가 다른 도메인에서 반복됩니다.");
  addBottomStrip(sld, 10, "");
};
