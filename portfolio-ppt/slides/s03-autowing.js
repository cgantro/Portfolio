const path = require("path");
const { FONT, C, BOX_STYLE } = require("../constants");
const { addHeader, addSoWhat, addBottomStrip } = require("../helpers");

const ARCH_IMG = path.resolve(__dirname, "../../asset/project-robotpal-architecture.png");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "주요 프로젝트 01 · RobotPal",
    "로봇팔 시뮬레이션 & 실시간 스트리밍",
    "C++17 · Emscripten · libjpeg-turbo · TCP/WebSocket · ImGui · CMake");

  // ── Left box: 프로젝트 메타 ─────────────────────────────────────────
  sld.addShape("roundRect", { x:0.422, y:2.20, w:4.95, h:3.85, ...BOX_STYLE(0.18) });

  const lx = 0.622;

  // 기간·팀
  sld.addText("2025.11 – 2026.04", {
    x:lx, y:2.38, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9, color:C.fgDim,
  });
  sld.addText("2인 (엔진 + 스트리밍)  ·  핵심 제어 아키텍처 및 네트워크 엔진 설계", {
    x:lx, y:2.62, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9, color:C.fgDim,
  });

  sld.addShape("line", { x:lx, y:2.94, w:4.35, h:0.01, line:{ color:C.border, width:0.8 } });

  // 구현 제목 (웹 implementations[].title 그대로)
  sld.addText("구현", {
    x:lx, y:3.02, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.accent,
  });
  [
    "제어 시스템 다형성 설계 및 네트워크 엔진 구축",
    "스트리밍 파이프라인",
    "GPU 비동기 Readback (PBO)",
    "멀티 스레드 JPEG 인코딩",
    "웹 빌드 (Emscripten)",
  ].forEach((item, i) => {
    sld.addText("· " + item, {
      x:lx, y:3.30 + i * 0.42, w:4.55, h:0.38,
      fontFace:FONT, fontSize:9.5, color:C.fg, lineSpacingMultiple:1.25,
    });
  });

  // highlights (웹 OverviewSlide › ovHighlights)
  sld.addShape("line", { x:lx, y:5.44, w:4.35, h:0.01, line:{ color:C.border, width:0.8 } });
  [
    "실시간 스트리밍 파이프라인 설계",
    "GPU 비동기 readback(PBO) 최적화",
    "Emscripten 웹 빌드 · CI/CD",
  ].forEach((h, i) => {
    sld.addText("› " + h, {
      x:lx, y:5.52 + i * 0.22, w:4.55, h:0.20,
      fontFace:FONT, fontSize:8.5, color:C.accent,
    });
  });

  // ── Right: 아키텍처 이미지 ─────────────────────────────────────────
  sld.addText("아키텍처", {
    x:5.70, y:2.22, w:7.0, h:0.24,
    fontFace:FONT, fontSize:9.5, color:C.fgDim,
  });
  try {
    sld.addImage({ path: ARCH_IMG, x:5.572, y:2.50, w:7.34, h:3.55 });
  } catch(e) {
    sld.addShape("roundRect", { x:5.572, y:2.50, w:7.34, h:3.55, fill:{ color:C.bg3 }, line:{ color:C.border, width:1 }, rectRadius:0.10 });
    sld.addText("아키텍처 이미지를 찾을 수 없습니다", { x:5.572, y:3.90, w:7.34, h:0.40, fontFace:FONT, fontSize:10, color:C.fgDim, align:"center" });
  }

  addSoWhat(sld, "하나의 렌더 루프에서 출발해 인코딩·전송을 분리하고, WASM 크로스컴파일로 브라우저까지 배포하는 전체 파이프라인을 직접 설계했습니다.");
  addBottomStrip(sld, 3, "Source: RobotPal — C++17 · libjpeg-turbo · Emscripten WASM (2025.11 – 2026.04)");
};
