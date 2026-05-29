const { FONT, C } = require("../constants");
const { addBoxP3, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "기술 선택 근거",
    "대안을 검토하고 트레이드오프로 결정했다",
    "AWS SQS · Java 21 가상 스레드 · UDP + Opus");

  addBoxP3(sld);

  // ── Card 1: AWS SQS ───────────────────────────────────────────────
  // 웹 techChoice.reason 그대로 (STICKER)
  addEmphasisCard(sld, 0.442, 2.22, 4.003, 3.81);
  sld.addText("AWS SQS", {
    x:0.622, y:2.38, w:3.643, h:0.34,
    fontFace:FONT, fontSize:13, bold:true, color:C.brand,
  });
  sld.addText("vs Kafka · RabbitMQ  ·  STICKER 기술 선택", {
    x:0.622, y:2.74, w:3.643, h:0.22,
    fontFace:FONT, fontSize:9, color:C.brandT2,
  });
  sld.addShape("line", { x:0.622, y:3.02, w:3.443, h:0.01, line:{ color:C.brandT4, width:0.8 } });

  // 웹 techChoice[{ tech:"AWS SQS" }].reason 배열 그대로
  [
    "AI 추천 처리 수십 초 소요 → 동기 HTTP 호출 불가",
    "at-least-once 보장 + visibility timeout 재처리 기본 내장",
    "RabbitMQ는 직접 운영 필요, Kafka는 파티션·컨슈머 설정 과다",
  ].forEach((r, i) => {
    sld.addText("· " + r, {
      x:0.622, y:3.12 + i * 0.48, w:3.643, h:0.42,
      fontFace:FONT, fontSize:9.5, color:C.ink, lineSpacingMultiple:1.4,
    });
  });

  // ── Card 2: Java 21 가상 스레드 ──────────────────────────────────
  // 웹 techChoice[{ tech:"Java 21 가상 스레드" }].reason 배열 그대로
  sld.addText("Java 21 가상 스레드", {
    x:4.825, y:2.38, w:3.643, h:0.34,
    fontFace:FONT, fontSize:13, bold:true, color:C.ink,
  });
  sld.addText("vs ThreadPoolExecutor · Coroutine  ·  STICKER 기술 선택", {
    x:4.825, y:2.74, w:3.643, h:0.22,
    fontFace:FONT, fontSize:9, color:C.caption,
  });
  sld.addShape("line", { x:4.825, y:3.02, w:3.443, h:0.01, line:{ color:C.containerLine, width:0.8 } });

  [
    "SQS long-polling(20s) 블로킹 구간에서 OS 스레드 미점유",
    "기존 블로킹 코드 그대로 유지 — 코드 변경 없이 스레드 비용 제거",
    "ThreadPoolExecutor는 OS 스레드 수 한도, 코루틴은 스택 전환 필요",
  ].forEach((r, i) => {
    sld.addText("· " + r, {
      x:4.825, y:3.12 + i * 0.48, w:3.643, h:0.42,
      fontFace:FONT, fontSize:9.5, color:C.ink, lineSpacingMultiple:1.4,
    });
  });

  // ── Card 3: UDP + Opus ────────────────────────────────────────────
  // 웹 techChoice[UDP].reason + techChoice[Opus Codec].reason 그대로 (Mausoleum)
  sld.addText("UDP + Opus Codec", {
    x:9.048, y:2.38, w:3.643, h:0.34,
    fontFace:FONT, fontSize:13, bold:true, color:C.ink,
  });
  sld.addText("영묘 (Mausoleum) 보이스 채팅 기술 선택", {
    x:9.048, y:2.74, w:3.643, h:0.22,
    fontFace:FONT, fontSize:9, color:C.caption,
  });
  sld.addShape("line", { x:9.048, y:3.02, w:3.443, h:0.01, line:{ color:C.containerLine, width:0.8 } });

  sld.addText("UDP", {
    x:9.048, y:3.10, w:3.643, h:0.22,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.brand,
  });
  // 웹 UDP reason 배열
  [
    "TCP의 고질적인 Head-of-line Blocking 방지: 패킷 하나 지연 시 전체 스트림이 막히는 현상을 원천 차단",
    "실시간 음성 채팅에서는 데이터 무결성(패킷 손실)보다 '지연시간 최소화'가 압도적으로 중요하기 때문에 채택",
  ].forEach((r, i) => {
    sld.addText("· " + r, {
      x:9.048, y:3.34 + i * 0.46, w:3.643, h:0.42,
      fontFace:FONT, fontSize:9, color:C.ink, lineSpacingMultiple:1.4,
    });
  });

  sld.addText("Opus", {
    x:9.048, y:4.30, w:3.643, h:0.22,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.brand,
  });
  // 웹 Opus Codec reason 배열
  [
    "20ms 프레임 단위의 실시간 대화에 최적화된 저지연 고효율 오디오 코덱",
    "무음 구간 대역폭을 아끼는 DTX와, 패킷 유실을 복구하는 FEC 기능이 자체 내장되어 있어 UDP의 불안정성을 완벽히 상쇄",
  ].forEach((r, i) => {
    sld.addText("· " + r, {
      x:9.048, y:4.54 + i * 0.52, w:3.643, h:0.48,
      fontFace:FONT, fontSize:9, color:C.ink, lineSpacingMultiple:1.4,
    });
  });

  addSoWhat(sld, "기술 선택은 트레이드오프입니다. 운영 비용, 코드 변경 범위, 프로젝트 규모를 기준으로 대안을 검토하고 결정했습니다.");
  addBottomStrip(sld, 9, "");
};
