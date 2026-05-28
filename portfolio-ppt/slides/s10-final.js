const { FONT, C } = require("../constants");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.dark };

  sld.addShape("rect", { x:0, y:0, w:13.333, h:0.06, fill:{ color:C.brand }, line: false });

  sld.addText("상태 정합성과\n운영 안정성을 먼저 생각하는\n백엔드 개발자", {
    x:0.70, y:1.60, w:11.0, h:2.20,
    fontFace:FONT, fontSize:40, bold:true, color:C.white,
    lineSpacingMultiple:1.15, charSpacing:-1, align:"center",
  });

  const verbs = [
    { v:"계측한다",       d:"어느 레이어가 얼마나 걸리는가" },
    { v:"단계를 나눈다",  d:"처리·전파·저장 순서부터" },
    { v:"신뢰성을 높인다", d:"순서 고정, 중복 방지, 안전 종료" },
  ];
  verbs.forEach((vb, i) => {
    sld.addShape("roundRect", {
      x:1.0 + i * 3.85, y:3.95, w:3.3, h:1.10,
      fill:{ color:C.dark, transparency:70 },
      line:{ color:C.brandT3, width:1 },
      rectRadius:0.12,
    });
    sld.addText(vb.v, {
      x:1.0 + i * 3.85, y:4.05, w:3.3, h:0.40,
      fontFace:FONT, fontSize:15, bold:true, color:C.white, align:"center",
    });
    sld.addText(vb.d, {
      x:1.0 + i * 3.85, y:4.50, w:3.3, h:0.38,
      fontFace:FONT, fontSize:9.5, color:C.brandLight, align:"center",
    });
  });

  sld.addText("yoonpyo  ·  cgantro@gmail.com  ·  광운대학교  ·  정보처리기사  ·  OPIc IH", {
    x:0.70, y:5.85, w:12.0, h:0.35,
    fontFace:FONT, fontSize:10, color:C.brandLight, align:"center",
  });

  sld.addText("10", {
    x:12.45, y:6.85, w:0.47, h:0.30,
    fontFace:FONT, fontSize:8, color:C.caption, align:"right", valign:"middle",
  });
};
