const { FONT, C } = require("../constants");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.dark };

  sld.addShape("rect", { x:0, y:0, w:13.333, h:0.06, fill:{ color:C.brand }, line: false });

  sld.addText("기능 구현보다\n시스템 문제를 분석하고\n구조적으로 해결합니다", {
    x:0.70, y:1.30, w:11.0, h:2.20,
    fontFace:FONT, fontSize:40, bold:true, color:C.white,
    lineSpacingMultiple:1.15, charSpacing:-1, align:"center",
  });

  const principles = [
    { v:"계측한다",        d:"병목이 어디인지 수치로 확인한다" },
    { v:"단계를 나눈다",   d:"처리·전파·저장 순서를 지킨다" },
    { v:"정합성을 지킨다", d:"상태 역전과 중복 발행을 구조로 막는다" },
  ];
  principles.forEach((p, i) => {
    sld.addShape("roundRect", {
      x:0.90 + i * 3.90, y:3.80, w:3.40, h:1.10,
      fill:{ color:C.dark, transparency:70 },
      line:{ color:C.brandT3, width:1 },
      rectRadius:0.12,
    });
    sld.addText(p.v, {
      x:0.90 + i * 3.90, y:3.90, w:3.40, h:0.42,
      fontFace:FONT, fontSize:15, bold:true, color:C.white, align:"center",
    });
    sld.addText(p.d, {
      x:0.90 + i * 3.90, y:4.36, w:3.40, h:0.38,
      fontFace:FONT, fontSize:9, color:C.brandLight, align:"center",
    });
  });

  sld.addText("yoonpyo  ·  cgantro@gmail.com  ·  광운대학교  ·  정보처리기사  ·  OPIc IH", {
    x:0.70, y:5.60, w:12.0, h:0.35,
    fontFace:FONT, fontSize:10, color:C.brandLight, align:"center",
  });

  sld.addText("12", {
    x:12.45, y:6.85, w:0.47, h:0.30,
    fontFace:FONT, fontSize:8, color:C.caption, align:"right", valign:"middle",
  });
};
