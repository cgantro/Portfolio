const FONT = "Malgun Gothic";

const C = {
  brand:        "4F6EF1", brandDeep:  "0014D3",
  brandLight:   "A8B7F8", brandPale:  "F8F9FF",
  brandT1:      "4F6EF1", brandT2:    "7E94F5",
  brandT3:      "A8B7F8", brandT4:    "DDE3FB",
  black:        "000000", ink:        "222222",
  text:         "404040", mute:       "45515E",
  caption:      "8E8E93", source:     "5F5F5F",
  white:        "FFFFFF", surface:    "FAFAFA",
  surface2:     "F0F0F0", surface3:   "F2F3F5",
  border:       "E5E7EB", containerLine: "EDEEF0",
  dark:         "181E25",
};

const sContainer = () => ({ type:"outer", color:"000000", blur:12, offset:2, angle:90, opacity:0.05 });
const sBrandGlow = () => ({ type:"outer", color:"4F6EF1", blur:15, offset:0, angle:90, opacity:0.20 });

const BOX_STYLE = (radius = 0.18) => ({
  fill: { color: C.white },
  line: { color: C.containerLine, width: 1 },
  rectRadius: radius,
  shadow: sContainer(),
});

module.exports = { FONT, C, sContainer, sBrandGlow, BOX_STYLE };
