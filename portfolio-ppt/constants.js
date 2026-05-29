// 웹 포폴 globals.css 디자인 토큰 기준
const FONT = "Malgun Gothic";
const MONO = "Courier New";

const C = {
  // ── Backgrounds (web: --bg, --bg2, --bg3)
  bg:         "090A0F",
  bg2:        "10121B",
  bg3:        "181A26",
  bg4:        "1E2433",

  // ── Borders (web: --border, --border2)
  border:     "2A2F42",
  border2:    "39415C",

  // ── Text (web: --fg, --fg-dim, --fg-bright)
  fg:         "E2E8F0",
  fgDim:      "94A3B8",
  fgBright:   "FFFFFF",
  fgSubtle:   "64748B",

  // ── Accent blue (web: --accent = #60a5fa)
  accent:     "60A5FA",
  accentDim:  "3B82F6",
  accentBg:   "0D1A2D",
  accentLine: "1E3A5F",

  // ── Status (web: --green, --purple, --yellow)
  green:      "4ADE80",
  greenBg:    "0A2010",
  purple:     "A78BFA",
  yellow:     "FBBF24",

  // ── Legacy aliases ─────────────────────────────────────────────
  brand:        "60A5FA",
  brandDeep:    "3B82F6",
  brandLight:   "93C5FD",
  brandPale:    "0D1A2D",   // ← 어두운 액센트 bg
  brandT2:      "93C5FD",
  brandT3:      "BFDBFE",
  brandT4:      "1E3A5F",
  black:        "090A0F",
  ink:          "E2E8F0",   // ← 밝은 텍스트
  text:         "CBD5E1",
  mute:         "94A3B8",   // ← dim 텍스트
  caption:      "94A3B8",
  white:        "FFFFFF",
  surface:      "10121B",
  surface2:     "181A26",
  surface3:     "1E2433",
  containerLine:"2A2F42",
  dark:         "090A0F",
};

const sContainer = () => ({ type:"outer", color:"000000", blur:20, offset:4, angle:90, opacity:0.40 });
const sBrandGlow  = () => ({ type:"outer", color:"60A5FA", blur:20, offset:0, angle:90, opacity:0.30 });

const BOX_STYLE = (radius = 0.18) => ({
  fill: { color: C.bg2 },
  line: { color: C.border, width: 1 },
  rectRadius: radius,
  shadow: sContainer(),
});

module.exports = { FONT, MONO, C, sContainer, sBrandGlow, BOX_STYLE };
