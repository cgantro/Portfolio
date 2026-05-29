const path = require("path");
const { FONT, C, BOX_STYLE } = require("../constants");
const { addHeader, addSoWhat, addBottomStrip } = require("../helpers");

const ARCH_IMG = path.resolve(__dirname, "../../asset/project-mausoleum-architecture.png");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "주요 프로젝트 02 · 영묘 (Mausoleum)",
    "UE5 멀티플레이어 던전 탈출 게임",
    "Unreal Engine 5 (C++) · C++ GameServer · uWebSockets · UDP · Opus · HRTF · Docker");

  // ── Left box: 프로젝트 메타 ─────────────────────────────────────────
  sld.addShape("roundRect", { x:0.422, y:2.20, w:4.95, h:3.85, ...BOX_STYLE(0.18) });

  const lx = 0.622;

  sld.addText("2026.02 – 2026.03", {
    x:lx, y:2.38, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9, color:C.fgDim,
  });
  sld.addText("6인 (UE5 클라이언트 + C++ 서버 + 인프라)  ·  보이스 채팅 클라이언트 & 서버 · 게임 서버 구조 개선", {
    x:lx, y:2.62, w:4.55, h:0.36,
    fontFace:FONT, fontSize:9, color:C.fgDim, lineSpacingMultiple:1.3,
  });

  sld.addShape("line", { x:lx, y:3.06, w:4.35, h:0.01, line:{ color:C.border, width:0.8 } });

  sld.addText("구현", {
    x:lx, y:3.14, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.accent,
  });
  // 웹 implementations[].title 그대로
  [
    "보이스 채팅 클라이언트 (UE5 C++)",
    "보이스 채팅 서버 (C++)",
    "생사 분리 전략 패턴",
    "C++ 게임 서버 구조 개선",
    "페이즈 시스템",
  ].forEach((item, i) => {
    sld.addText("· " + item, {
      x:lx, y:3.42 + i * 0.40, w:4.55, h:0.36,
      fontFace:FONT, fontSize:9.5, color:C.fg, lineSpacingMultiple:1.25,
    });
  });

  sld.addShape("line", { x:lx, y:5.44, w:4.35, h:0.01, line:{ color:C.border, width:0.8 } });
  [
    "보이스 채팅 클라이언트·서버 전담",
    "생사 분리 전략 패턴 설계",
    "C++ 게임 서버 OOP 리팩토링",
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

  addSoWhat(sld, "마이크 캡처부터 3D 공간음향 재생까지 전체 보이스 파이프라인을 직접 설계하고, 게임 상태에 따른 청취 규칙을 전략 패턴으로 분리했습니다.");
  addBottomStrip(sld, 5, "Source: Mausoleum — UVoiceCaptureProcessor · IListenStrategy · uWebSockets 서버 (2026.02 – 2026.03)");
};
