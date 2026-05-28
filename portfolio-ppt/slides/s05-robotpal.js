const { FONT, C } = require("../constants");
const { addBoxP6, addHeader, addSoWhat, addBottomStrip } = require("../helpers");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 02 · RobotPal",
    "렌더와 인코딩을 분리하자 GPU 환경에 따라 앱 FPS +6~15% 개선을 수치로 확인했다",
    "C++17 · OpenGL · libjpeg · 생산자-소비자 패턴 · 벤치마킹");

  addBoxP6(sld);

  sld.addText("싱글 vs 멀티 워커 FPS 비교 (816×616, JPEG Q70, 디버그 빌드)", {
    x:0.622, y:2.40, w:6.94, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.ink,
  });

  const chartData = [
    { name:"Single Worker", labels:["dGPU 앱 FPS", "iGPU 앱 FPS"], values:[55.94, 58.10] },
    { name:"Multi Worker",  labels:["dGPU 앱 FPS", "iGPU 앱 FPS"], values:[59.41, 66.95] },
  ];
  sld.addChart("bar", chartData, {
    x:0.622, y:2.72, w:6.94, h:2.80,
    chartColors:[ C.brandT3, C.brand ],
    barGrouping:"clustered", barDir:"col",
    showValue:true, dataLabelFontSize:9, dataLabelColor:"FFFFFF",
    catAxisLabelFontSize:9, valAxisLabelFontSize:9,
    valAxisMinVal:45, valAxisMaxVal:75,
    showLegend:true, legendFontSize:9,
    catAxisLineShow:false, valAxisLineShow:false,
    showTitle:false,
  });

  sld.addText("dGPU: 55.94 → 59.41 (+6.20%)  ·  iGPU: 58.10 → 66.95 (+15.24%)  ·  릴리즈 빌드 별도 미측정", {
    x:0.622, y:5.60, w:6.94, h:0.28,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  sld.addText("문제 → 해결", {
    x:8.162, y:2.45, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });

  const items = [
    { t:"렌더 루프와 인코딩이 경쟁",     d:"압축 작업이 메인 루프 FPS를 점유",   c:C.mute  },
    { t:"생산자-소비자로 루프 분리",      d:"렌더와 인코딩이 서로 방해하지 않음", c:C.brand },
    { t:"멀티 워커로 인코딩 분산",        d:"압축 부하를 워커에 나눔",            c:C.brand },
    { t:"iGPU 환경에서 더 큰 개선 확인",  d:"외장 GPU 없는 환경일수록 효과 컸음", c:C.brand },
  ];
  items.forEach((it, i) => {
    const iy = 2.87 + i * 0.76;
    sld.addShape("ellipse", {
      x:8.162, y:iy + 0.07, w:0.13, h:0.13,
      fill:{ color:it.c }, line: false,
    });
    sld.addText(it.t, {
      x:8.33, y:iy, w:4.4, h:0.28,
      fontFace:FONT, fontSize:10, bold:(it.c === C.brand), color:it.c,
    });
    sld.addText(it.d, {
      x:8.33, y:iy + 0.28, w:4.4, h:0.28,
      fontFace:FONT, fontSize:9, color:C.caption,
    });
  });

  addSoWhat(sld, "렌더링 자체가 느린 게 아니었습니다. 렌더와 인코딩이 같은 루프에서 서로 기다리는 구조가 문제였습니다.");
  addBottomStrip(sld, 5, "Source: RobotPal 병목분석.md — 디버그 빌드 b01af42, 릴리즈 빌드 미측정 (2026-04-09)");
};
