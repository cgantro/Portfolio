const { FONT, C } = require("../constants");
const { addBoxP3, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "EXECUTIVE SUMMARY",
    "비동기 실시간 환경에서 측정하고, 단계를 나누고, 구조로 해결했다",
    "Autowing_car · RobotPal · mausoleum · STICKER");

  addBoxP3(sld);

  // Card 1 — emphasis
  addEmphasisCard(sld, 0.442, 2.22, 4.003, 3.81);
  sld.addText("관제 상태 불일치 원인을\n찾아 전송량 90% 줄였다", {
    x:0.622, y:2.42, w:3.643, h:0.72,
    fontFace:FONT, fontSize:12, bold:true, color:C.brand, lineSpacingMultiple:1.3,
  });
  sld.addText("MQTT 발행이 DB 커밋 전에\n나가면서 관제 상태가 오염됨.\nafterCommit() 훅으로 순서 고정\n→ write points 90% 감소 (Redis\n배치화), payload 90.36% 감소\n(RDP 압축).", {
    x:0.622, y:3.22, w:3.643, h:2.00,
    fontFace:FONT, fontSize:10, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("Autowing_car · STICKER", {
    x:0.622, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.brand,
  });

  // Card 2
  sld.addText("처리·전파·저장 단계를 나누자\n부하와 지연이 함께 줄었다", {
    x:4.825, y:2.42, w:3.643, h:0.72,
    fontFace:FONT, fontSize:12, bold:true, color:C.ink, lineSpacingMultiple:1.3,
  });
  sld.addText("렌더 루프와 인코딩 루프가\n같은 스레드에서 경쟁했었음.\n생산자-소비자로 분리 후\nGPU 환경에 따라 +6~15%\nFPS 개선을 수치로 확인.", {
    x:4.825, y:3.22, w:3.643, h:2.00,
    fontFace:FONT, fontSize:10, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("RobotPal · Autowing_car", {
    x:4.825, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  // Card 3
  sld.addText("코드를 건드리지 않고\n어느 레이어가 느린지 찾아냈다", {
    x:9.048, y:2.42, w:3.643, h:0.72,
    fontFace:FONT, fontSize:12, bold:true, color:C.ink, lineSpacingMultiple:1.3,
  });
  sld.addText("AOP로 Service / Repository /\nExternal 레이어별 응답 시간을\n자동 수집. 코드 수정 없이\n어느 구간이 느린지 Grafana\np95·p99로 확인했다.", {
    x:9.048, y:3.22, w:3.643, h:2.00,
    fontFace:FONT, fontSize:10, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("STICKER", {
    x:9.048, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  addSoWhat(sld, "도메인이 달라도 같은 문제가 돌아왔습니다 — 상태 정합성, 처리 단계 분리, 병목 계측.");
  addBottomStrip(sld, 2, "");
};
