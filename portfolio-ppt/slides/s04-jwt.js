const { FONT, C } = require("../constants");
const { addBoxP6, addHeader, addSoWhat, addBottomStrip } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "주요 프로젝트 01 · RobotPal — 문제 해결",
    "렌더와 인코딩이 경쟁 중이었다 — 분리하자 iGPU 환경에서 +15.24% FPS 향상",
    "생산자-소비자 패턴 · PBO 더블버퍼 · libjpeg-turbo 워커 풀 · 1~19 워커 실측 벤치마킹");

  addBoxP6(sld);  // Left 7.34 / Right 4.95

  // ── Left: FPS 차트 ────────────────────────────────────────────────
  sld.addText("싱글 vs 멀티 워커 FPS 비교 (816×616, JPEG Q70, 디버그 빌드)", {
    x:0.622, y:2.40, w:6.94, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.ink,
  });

  const chartData = [
    { name:"Single Worker", labels:["dGPU 앱 FPS", "iGPU 앱 FPS"], values:[55.94, 58.10] },
    { name:"12 Workers",    labels:["dGPU 앱 FPS", "iGPU 앱 FPS"], values:[59.41, 66.95] },
  ];
  sld.addChart("bar", chartData, {
    x:0.622, y:2.72, w:6.94, h:2.72,
    chartColors:[ C.brandT3, C.brand ],
    barGrouping:"clustered", barDir:"col",
    showValue:true, dataLabelFontSize:9, dataLabelColor:C.fgBright,
    catAxisLabelFontSize:9, catAxisLabelColor:C.fgDim,
    valAxisLabelFontSize:9, valAxisLabelColor:C.fgDim,
    valAxisMinVal:45, valAxisMaxVal:75,
    showLegend:true, legendFontSize:9, legendFontColor:C.fg,
    catAxisLineShow:false, valAxisLineShow:false,
    showTitle:false,
    chartArea:{ fill:{ color:C.bg2 } },
    plotArea:{ fill:{ color:C.bg2 } },
  });
  sld.addText("dGPU: 55.94 → 59.41 (+6.20%)  ·  iGPU: 58.10 → 66.95 (+15.24%)  ·  릴리즈 빌드 별도 미측정", {
    x:0.622, y:5.52, w:6.94, h:0.26,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  // ── Right: 문제 → 해결 (웹 problem/solution/result 그대로) ─────────
  const rx = 8.162;
  const rw = 4.55;

  // Problem 1 — glReadPixels 렌더 루프 블로킹
  sld.addText("glReadPixels 렌더 루프 블로킹", {
    x:rx, y:2.40, w:rw, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("고해상도(816×616)에서 glReadPixels를 호출하면 GPU 렌더 완료까지 CPU가 멈춰 대기합니다. 렌더 루프가 이 구간에서 매 프레임 블로킹되어 FPS가 크게 하락했습니다.", {
    x:rx, y:2.72, w:rw, h:0.64,
    fontFace:FONT, fontSize:9, color:C.ink, lineSpacingMultiple:1.45,
  });
  sld.addText("PBO 더블 버퍼 ping-pong 구조로 전환했습니다. CPU는 이미 완료된 이전 프레임 데이터를 읽고, GPU에는 비동기 쓰기만 발행합니다.", {
    x:rx, y:3.40, w:rw, h:0.52,
    fontFace:FONT, fontSize:9, bold:true, color:C.brand, lineSpacingMultiple:1.45,
  });
  sld.addShape("roundRect", {
    x:rx, y:3.96, w:rw, h:0.26,
    fill:{ color:C.brandPale }, line:{ color:C.brandT3, width:1 }, rectRadius:0.05,
  });
  sld.addText("CPU-GPU 동기화 압력 감소, 렌더 루프 스톨 빈도 저하", {
    x:rx + 0.10, y:3.96, w:rw - 0.20, h:0.26,
    fontFace:FONT, fontSize:8.5, color:C.brand, valign:"middle",
  });

  sld.addShape("line", { x:rx, y:4.30, w:rw, h:0.01, line:{ color:C.containerLine, width:0.8 } });

  // Problem 2 — TCP 프레임 밀림 (지연 누적)
  sld.addText("TCP 프레임 밀림 (지연 누적)", {
    x:rx, y:4.38, w:rw, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("인코딩과 소켓 전송이 같은 스레드에서 순서대로 실행되었습니다. 큰 프레임을 인코딩하는 동안 다음 프레임 전송이 밀려나고, 그 지연이 계속 누적되어 스트리밍이 버벅거렸습니다.", {
    x:rx, y:4.70, w:rw, h:0.64,
    fontFace:FONT, fontSize:9, color:C.ink, lineSpacingMultiple:1.45,
  });
  sld.addText("인코딩이 끝난 데이터를 큐에 넣으면 전송 스레드가 독립적으로 소비하는 생산자-소비자 구조로 전환했습니다.", {
    x:rx, y:5.38, w:rw, h:0.40,
    fontFace:FONT, fontSize:9, bold:true, color:C.brand, lineSpacingMultiple:1.45,
  });
  sld.addShape("roundRect", {
    x:rx, y:5.82, w:rw, h:0.26,
    fill:{ color:C.brandPale }, line:{ color:C.brandT3, width:1 }, rectRadius:0.05,
  });
  sld.addText("프레임 밀림 해소, 스트리밍 FPS 안정화", {
    x:rx + 0.10, y:5.82, w:rw - 0.20, h:0.26,
    fontFace:FONT, fontSize:8.5, color:C.brand, valign:"middle",
  });

  addSoWhat(sld, "렌더링 자체가 느린 게 아니었습니다. 렌더와 인코딩이 같은 루프에서 서로 기다리는 구조가 문제였습니다.");
  addBottomStrip(sld, 4, "Source: RobotPal 병목분석.md — 디버그 빌드 b01af42, 릴리즈 빌드 미측정 (2026-04-09)");
};
