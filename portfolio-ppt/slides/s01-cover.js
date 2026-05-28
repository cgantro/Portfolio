const { FONT, C } = require("../constants");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.dark };

  sld.addShape("rect", { x:0, y:0, w:13.333, h:0.06, fill:{ color:C.brand }, line: false });

  sld.addText("BACKEND DEVELOPER  ·  SPRING BOOT  ·  C++", {
    x:0.70, y:2.95, w:10.0, h:0.35,
    fontFace:FONT, fontSize:11, color:C.brandT3, bold:false, charSpacing:3,
  });

  sld.addText("상태 정합성과\n운영 안정성을 먼저 생각하는\n백엔드 개발자", {
    x:0.70, y:3.30, w:10.5, h:2.0,
    fontFace:FONT, fontSize:40, bold:true, color:C.white,
    lineSpacingMultiple:1.15, charSpacing:-1,
  });

  sld.addText("yoonpyo", {
    x:0.70, y:5.40, w:10.0, h:0.40,
    fontFace:FONT, fontSize:14, color:C.brandLight,
  });

  sld.addShape("ellipse", { x:11.8, y:5.8, w:0.9, h:0.9, fill:{ color:C.brand }, line: false });
  sld.addShape("ellipse", { x:12.4, y:5.5, w:0.5, h:0.5, fill:{ color:C.brandT3 }, line: false });
};
