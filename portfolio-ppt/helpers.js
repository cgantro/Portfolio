const { FONT, C, BOX_STYLE, sBrandGlow } = require("./constants");

function addBoxP1(sld) {
  sld.addShape("roundRect", { x:0.422, y:2.20, w:12.49, h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP2L(sld) {
  sld.addShape("roundRect", { x:0.422, y:2.20, w:6.145, h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape("roundRect", { x:6.767, y:2.20, w:6.145, h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP3(sld) {
  sld.addShape("roundRect", { x:0.422, y:2.20, w:4.043, h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape("roundRect", { x:4.645, y:2.20, w:4.043, h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape("roundRect", { x:8.868, y:2.20, w:4.043, h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP5(sld) {
  sld.addShape("roundRect", { x:0.422, y:2.20, w:4.95,  h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape("roundRect", { x:5.572, y:2.20, w:7.34,  h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP6(sld) {
  sld.addShape("roundRect", { x:0.422, y:2.20, w:7.34,  h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape("roundRect", { x:7.962, y:2.20, w:4.95,  h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP7(sld) {
  sld.addShape("roundRect", { x:0.422, y:2.20, w:7.34,  h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape("roundRect", { x:7.962, y:2.20, w:4.95,  h:1.85, ...BOX_STYLE(0.14) });
  sld.addShape("roundRect", { x:7.962, y:4.20, w:4.95,  h:1.85, ...BOX_STYLE(0.14) });
}

function addHeader(sld, chapter, headline, subtitle) {
  if (chapter) {
    sld.addText(chapter, {
      x:0.422, y:0.306, w:12.0, h:0.269,
      fontFace:FONT, fontSize:10, color:C.brand, bold:false, valign:"middle",
    });
  }
  sld.addText(headline, {
    x:0.422, y:0.851, w:12.262, h:0.505,
    fontFace:FONT, fontSize:24, color:C.black, bold:true,
    charSpacing:-0.5, valign:"middle",
  });
  if (subtitle) {
    sld.addText(subtitle, {
      x:0.422, y:1.472, w:12.262, h:0.303,
      fontFace:FONT, fontSize:12, color:C.text, valign:"middle",
    });
  }
}

function addSoWhat(sld, text) {
  sld.addShape("roundRect", {
    x:0.622, y:6.20, w:12.09, h:0.35,
    fill:{ color:C.surface2 }, line: false, rectRadius:0.06,
  });
  sld.addText(text, {
    x:0.722, y:6.20, w:11.89, h:0.35,
    fontFace:FONT, fontSize:9, color:C.mute, valign:"middle",
  });
}

function addBottomStrip(sld, pageNum, sourceText) {
  if (sourceText) {
    sld.addText(sourceText, {
      x:0.535, y:6.85, w:11.0, h:0.30,
      fontFace:FONT, fontSize:8, color:C.caption, valign:"middle", align:"left",
    });
  }
  sld.addText(String(pageNum), {
    x:12.45, y:6.85, w:0.47, h:0.30,
    fontFace:FONT, fontSize:8, color:C.caption, valign:"middle", align:"right",
  });
}

function addEmphasisCard(sld, x, y, w, h) {
  sld.addShape("roundRect", {
    x, y, w, h,
    fill: { color: C.brandPale },
    line: { color: C.brandT3, width: 1.4 },
    rectRadius: 0.14,
    shadow: sBrandGlow(),
  });
}

module.exports = {
  addBoxP1, addBoxP2L, addBoxP3, addBoxP5, addBoxP6, addBoxP7,
  addHeader, addSoWhat, addBottomStrip, addEmphasisCard,
};
