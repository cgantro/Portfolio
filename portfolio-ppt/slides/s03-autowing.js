const { FONT, C } = require("../constants");
const { addBoxP5, addHeader, addSoWhat, addBottomStrip, addEmphasisCard } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 01 · Autowing_car",
    "DB 커밋 전 MQTT 발행이 관제 상태를 오염시켰다 — 순서 고정으로 해결했다",
    "Spring Boot · MQTT · STOMP · Redis · PostgreSQL · Docker · GitLab CI");

  addBoxP5(sld);

  // Left — 문제 + 원인
  sld.addText("문제", {
    x:0.622, y:2.45, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("DB 저장과 MQTT/WebSocket 이벤트\n전파가 같은 흐름에 묶여 있어\n관제 화면과 DB 상태가 달라지는\n불일치 발생.", {
    x:0.622, y:2.78, w:4.55, h:1.20,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("↓", {
    x:1.40, y:3.95, w:1.5, h:0.35,
    fontFace:FONT, fontSize:18, color:C.brandT3, align:"center", valign:"middle",
  });

  sld.addText("원인", {
    x:0.622, y:4.12, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("커밋 완료 전에 이벤트가 전파됨.\nDB 롤백 시에도 메시지는 이미\n나간 상태 → 상태 역전.\n매 수신마다 DB에 쓰면 쓰기\n요청이 텔레메트리 빈도만큼\n선형으로 증가.", {
    x:0.622, y:4.45, w:4.55, h:1.45,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.5,
  });

  // Right — 해결
  addEmphasisCard(sld, 5.592, 2.22, 7.30, 1.65);
  sld.addText("해결 1 — 전파 순서 고정", {
    x:5.772, y:2.32, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("Spring Transaction afterCommit() 훅 적용.\nDB 커밋이 확정된 이후에만\nMQTT/WebSocket으로 이벤트 발행.", {
    x:5.772, y:2.63, w:6.90, h:0.90,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("해결 2 — 쓰기 부하 감소", {
    x:5.772, y:4.00, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("Redis를 쓰기 버퍼로 사용해 DB\n저장을 배치화. RDP 알고리즘(경로\n단순화)으로 텔레메트리 포인트 수 압축.", {
    x:5.772, y:4.30, w:6.90, h:0.80,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  // 결과 칩
  const results = [
    { label:"Redis 배치화 후", val:"write points  −90%" },
    { label:"RDP 압축 후",     val:"payload bytes  −90.36%" },
  ];
  results.forEach((r, i) => {
    sld.addShape("roundRect", {
      x:5.772 + i * 3.6, y:5.22, w:3.3, h:0.56,
      fill:{ color:C.brandPale }, line:{ color:C.brandT3, width:1 }, rectRadius:0.08,
    });
    sld.addText(r.label, {
      x:5.772 + i * 3.6, y:5.22, w:3.3, h:0.28,
      fontFace:FONT, fontSize:8.5, color:C.mute, align:"center", valign:"bottom",
    });
    sld.addText(r.val, {
      x:5.772 + i * 3.6, y:5.50, w:3.3, h:0.28,
      fontFace:FONT, fontSize:10.5, bold:true, color:C.brand, align:"center", valign:"top",
    });
  });

  addSoWhat(sld, "커밋과 외부 이벤트 전파는 순서를 지켜야 합니다. DB가 롤백돼도 한 번 나간 메시지는 되돌아오지 않습니다.");
  addBottomStrip(sld, 3, "Source: Autowing_car — afterCommit() 적용 커밋 (2026-02)");
};
