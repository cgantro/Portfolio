const { FONT, C } = require("../constants");
const { addBoxP1, addHeader, addSoWhat, addBottomStrip } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 04 · STICKER",
    "SQS 소비기에 graceful shutdown과 재처리 불가 메시지 차단을 함께 구현했다",
    "Spring Boot 3.5 · Java 21 가상 스레드 · AWS SQS/S3 · Micrometer · Prometheus · Grafana");

  addBoxP1(sld);

  const layers = [
    {
      name:"Job 발행기", y:2.52,
      fill:C.surface3,  line:C.containerLine,
      text:"Redis 원자적 락으로 동시 중복 발행 차단 → SQS에 AI 추천 요청 전달",
      color:C.mute,
    },
    {
      name:"SQS 소비기", y:3.10,
      fill:C.brandPale, line:C.brandT3,
      text:"SmartLifecycle 구현: 서버 종료 시 루프 중단 대기 후 안전 종료 → 메시지 유실 없음",
      color:C.brand,
    },
    {
      name:"오류 처리",  y:3.68,
      fill:C.brandPale, line:C.brandT3,
      text:"포맷 위반 메시지: 즉시 삭제(재시도해도 안 됨) · 일시 장애: 삭제 보류 → SQS 자동 재처리",
      color:C.brand,
    },
    {
      name:"중복 방지",  y:4.26,
      fill:C.surface3,  line:C.containerLine,
      text:"SQS는 같은 메시지를 두 번 전달할 수 있음 → Redis에 jobId 기록해 중복 처리 차단",
      color:C.mute,
    },
    {
      name:"AOP 계측",   y:4.84,
      fill:C.surface3,  line:C.containerLine,
      text:"Service/Repository/External 레이어별 응답 시간 자동 수집 · p95·p99 Grafana 시각화",
      color:C.mute,
    },
  ];

  layers.forEach(l => {
    sld.addShape("roundRect", {
      x:0.622, y:l.y, w:11.89, h:0.46,
      fill:{ color:l.fill }, line:{ color:l.line, width:1 }, rectRadius:0.07,
    });
    sld.addText(l.name, {
      x:0.822, y:l.y, w:1.7, h:0.46,
      fontFace:FONT, fontSize:10, bold:true, color:l.color, valign:"middle",
    });
    sld.addText(l.text, {
      x:2.722, y:l.y, w:9.3, h:0.46,
      fontFace:FONT, fontSize:9.5, color:C.mute, valign:"middle",
    });
  });

  addSoWhat(sld, "SQS는 같은 메시지를 두 번 이상 전달할 수 있습니다. 언제 삭제하고 언제 보류할지 오류 분류가 핵심입니다.");
  addBottomStrip(sld, 7, "Source: STICKER — SmartLifecycle · ExecutionTimeAspect.java (2026-05-17)");
};
