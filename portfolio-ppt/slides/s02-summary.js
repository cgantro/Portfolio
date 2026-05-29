const { FONT, C } = require("../constants");
const { addBoxP3, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "EXECUTIVE SUMMARY",
    "계측하고, 분리하고, 정합성을 지켰다",
    "RobotPal · 영묘 (Mausoleum) · STICKER");

  addBoxP3(sld);

  // ── Card 1 — RobotPal (emphasis) ──────────────────────────────────
  addEmphasisCard(sld, 0.442, 2.22, 4.003, 3.81);
  sld.addText("TCP 프레임 밀림\n(지연 누적)", {
    x:0.622, y:2.38, w:3.643, h:0.64,
    fontFace:FONT, fontSize:13, bold:true, color:C.brand, lineSpacingMultiple:1.2,
  });
  sld.addText("인코딩과 소켓 전송이 같은 스레드에서 순서대로 실행되었습니다. 큰 프레임을 인코딩하는 동안 다음 프레임 전송이 밀려나고, 그 지연이 계속 누적되어 스트리밍이 버벅거렸습니다.", {
    x:0.622, y:3.08, w:3.643, h:1.00,
    fontFace:FONT, fontSize:9.5, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("→ 생산자-소비자 구조로 분리\n→ dGPU +6.20% · iGPU +15.24% FPS 향상", {
    x:0.622, y:4.14, w:3.643, h:0.60,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.brand, lineSpacingMultiple:1.4,
  });
  sld.addText("RobotPal  ·  C++17 · libjpeg-turbo", {
    x:0.622, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.brand,
  });

  // ── Card 2 — Mausoleum ────────────────────────────────────────────
  sld.addText("캡처 디바이스 null —\n보이스 전혀 전송 안 됨", {
    x:4.825, y:2.38, w:3.643, h:0.64,
    fontFace:FONT, fontSize:13, bold:true, color:C.ink, lineSpacingMultiple:1.2,
  });
  sld.addText("마이크의 표시 이름을 그대로 UE5 캡처 API에 전달했더니 null을 반환했습니다. 내부에서 DirectSound 디바이스 ID와 매칭을 시도하는데, Friendly Name은 매칭에 실패합니다.", {
    x:4.825, y:3.08, w:3.643, h:0.80,
    fontFace:FONT, fontSize:9.5, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("→ 빈 문자열 전달 → OS 기본 장치 자동 매칭\n→ IListenStrategy로 생존자·영혼 청취 규칙 분리", {
    x:4.825, y:3.94, w:3.643, h:0.60,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.ink, lineSpacingMultiple:1.4,
  });
  sld.addText("영묘 (Mausoleum)  ·  UE5 · UDP · Opus", {
    x:4.825, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  // ── Card 3 — STICKER ──────────────────────────────────────────────
  sld.addText("DB 커밋 전 SQS 발행\n→ 데이터 불일치", {
    x:9.048, y:2.38, w:3.643, h:0.64,
    fontFace:FONT, fontSize:13, bold:true, color:C.ink, lineSpacingMultiple:1.2,
  });
  sld.addText("트랜잭션 안에서 SQS 메시지를 발행했더니 DB가 롤백되어도 메시지는 이미 큐에 들어간 상태가 됩니다. AI 서버가 메시지를 소비해 DB에 없는 데이터를 참조하면서 오류가 발생했습니다.", {
    x:9.048, y:3.08, w:3.643, h:0.80,
    fontFace:FONT, fontSize:9.5, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("→ afterCommit() 훅 — DB 커밋 후에만 발행\n→ DB 상태와 메시지 큐 상태의 일관성 보장", {
    x:9.048, y:3.94, w:3.643, h:0.60,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.ink, lineSpacingMultiple:1.4,
  });
  sld.addText("STICKER  ·  Spring Boot · SQS · Redis", {
    x:9.048, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  addSoWhat(sld, "도메인이 달라도 같은 구조적 결함이 반복됩니다 — 같은 스레드에서 경쟁하거나, 순서를 지키지 않거나, 상태가 분리되지 않거나.");
  addBottomStrip(sld, 2, "");
};
