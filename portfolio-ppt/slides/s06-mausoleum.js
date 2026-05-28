const { FONT, C } = require("../constants");
const { addBoxP5, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 03 · mausoleum",
    "Alt-Tab 복귀 후 쌓인 음성이 한꺼번에 재생되는 문제, 버퍼 폐기로 해결했다",
    "Unreal Engine 5 · C++ · 전용 서버 · UDP 음성 서버");

  addBoxP5(sld);

  // Left — 문제
  sld.addText("문제", {
    x:0.622, y:2.45, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("Alt-Tab 복귀 직후 대기 중 누적된\n음성 버퍼가 한꺼번에 재생 →\n잡음 섞인 음성이 한꺼번에 쏟아짐.", {
    x:0.622, y:2.78, w:4.55, h:1.10,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("추가로 해결한 문제", {
    x:0.622, y:3.95, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("사망자/생존자/관전자 청취 권한 미분리\n→ 사망 후에도 생존자 정보 노출.\n\n게임 세션 생명주기를 대기/인게임\n단계로 분리 → 상태 충돌 감소.", {
    x:0.622, y:4.26, w:4.55, h:1.50,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.5,
  });

  // Right — 해결
  addEmphasisCard(sld, 5.592, 2.22, 7.30, 1.60);
  sld.addText("해결 1 — 버퍼 폐기 + 코덱 리셋", {
    x:5.772, y:2.32, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("백그라운드 복귀 시 누적된 캡처 버퍼\n폐기 + 코덱 리셋 → 복귀 직후\n한꺼번에 재생되는 현상 제거.", {
    x:5.772, y:2.63, w:6.90, h:0.80,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("해결 2 — 상태별 청취 규칙 분리", {
    x:5.772, y:4.00, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("생존/사망/관전 상태에 따라 수신\n가능한 음성 채널을 별도 분리 →\n사망자 정보 노출 완화.", {
    x:5.772, y:4.30, w:6.90, h:0.75,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("해결 3 — 룸 코드 기반 세션 격리", {
    x:5.772, y:5.12, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("방 단위로 이벤트·음성 경로를 격리해\n다른 방 세션과의 간섭 차단.", {
    x:5.772, y:5.43, w:6.90, h:0.50,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  addSoWhat(sld, "대기 중 쌓인 버퍼를 그대로 재생하면 사용자가 가장 먼저 체감합니다. 복귀 시 폐기가 기본값이어야 합니다.");
  addBottomStrip(sld, 6, "Source: mausoleum — VoiceCapture 코덱 리셋 커밋 (2026-03)");
};
