const { FONT, C } = require("../constants");
const { addBoxP2L, addHeader, addSoWhat, addBottomStrip } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "OTHER PROJECTS",
    "SSAFY BOB과 코리안스낵샵에서 MCP 서버 구조와 Spring 인증 흐름을 직접 구현했다",
    "Python FastMCP · Smithery · Spring Boot · AWS RDS · JWT · Google OAuth2");

  addBoxP2L(sld);

  // Left — SSAFY BOB
  sld.addText("SSAFY BOB  ·  MCP 서버", {
    x:0.622, y:2.42, w:5.745, h:0.30,
    fontFace:FONT, fontSize:12, bold:true, color:C.brand,
  });
  sld.addText("Python · FastMCP · Smithery · uv", {
    x:0.622, y:2.76, w:5.745, h:0.25,
    fontFace:FONT, fontSize:9.5, color:C.caption,
  });
  sld.addShape("line", {
    x:0.622, y:3.08, w:5.545, h:0.01,
    line:{ color:C.containerLine, width:0.8 },
  });
  sld.addText("LLM 에이전트가 SSAFY 식단 정보를\n조회할 수 있는 MCP 서버 개발.\n\n@mcp.tool로 도구 등록. 자연어에서\n날짜·층수 파라미터를 추출하도록\nPydantic 입력 스키마 정의.\n\n요청 시점에 외부 JSON을 페칭하는\nstateless 구조. Smithery 배포.", {
    x:0.622, y:3.18, w:5.745, h:2.60,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.55,
  });

  // Right — 코리안스낵샵
  sld.addText("코리안스낵샵", {
    x:6.967, y:2.42, w:5.745, h:0.30,
    fontFace:FONT, fontSize:12, bold:true, color:C.mute,
  });
  sld.addText("Java 17 · Spring Boot · AWS RDS · MySQL · JWT · Google OAuth2", {
    x:6.967, y:2.76, w:5.745, h:0.25,
    fontFace:FONT, fontSize:9.5, color:C.caption,
  });
  sld.addShape("line", {
    x:6.967, y:3.08, w:5.545, h:0.01,
    line:{ color:C.containerLine, width:0.8 },
  });
  sld.addText("해외 대상 한국 간식 소개 플랫폼\n백엔드.\n\nJWT + Spring Security로 회원\n인증 구현. Google OAuth2 소셜\n로그인 연동. AWS RDS MySQL\n직접 구축 및 EC2 배포.", {
    x:6.967, y:3.18, w:5.745, h:2.60,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.55,
  });

  addSoWhat(sld, "MCP와 OAuth2 모두 외부 시스템과 연결하는 인터페이스 경계를 어떻게 정의하느냐가 핵심이었습니다.");
  addBottomStrip(sld, 8, "");
};
