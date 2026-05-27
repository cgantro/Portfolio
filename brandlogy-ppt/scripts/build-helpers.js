/**
 * Brandlogy PPT Design System v11 — Build Helpers
 *
 * 모든 데크 빌드에서 import하는 핵심 헬퍼 함수 모음.
 *
 * 사용:
 *   const PptxGenJS = require("pptxgenjs");
 *   const H = require("./build-helpers");
 *
 *   const pres = new PptxGenJS();
 *   pres.defineLayout({ name: "BRANDLOGY_169", width: 13.333, height: 7.5 });
 *   pres.layout = "BRANDLOGY_169";
 *
 *   const s = H.bodySlide5(pres);  // Pattern 5 (5:7 비대칭)
 *   H.addHeader(s, "CHAPTER", "Action Title", "Subtitle");
 *   // ... 콘텐츠 추가 ...
 *   H.addSoWhat(s, pres, "X 아닙니다. Y일 뿐입니다.");
 *   H.addBottomStrip(s, 3, "Source: ...");
 *
 *   await pres.writeFile({ fileName: "deck.pptx" });
 */

// ============================================================================
// 1. CONSTANTS — 절대 변경 금지
// ============================================================================

const FONT = "Pretendard";
const FONT_M = "Pretendard Medium";

const C = {
  // Brand (블루 스케일)
  brand: "4F6EF1",
  brandDeep: "0014D3",
  brandLight: "A8B7F8",
  brandPale: "F8F9FF",
  brandT1: "4F6EF1",
  brandT2: "7E94F5",
  brandT3: "A8B7F8",
  brandT4: "DDE3FB",
  // Neutral (그레이 스케일)
  black: "000000",
  ink: "222222",
  text: "404040",
  mute: "45515E",
  caption: "8E8E93",
  source: "5F5F5F",
  // Surface
  white: "FFFFFF",
  surface: "FAFAFA",
  surface2: "F0F0F0",
  surface3: "F2F3F5",
  border: "E5E7EB",
  containerLine: "EDEEF0",
  dark: "181E25",
};

// Logo 표준 좌표 (모든 본문 슬라이드 공통)
const LOGO = {
  path: "brandlogy_logo.png",
  x: 11.30,
  y: 0.28,
  w: 1.55,
  h: 0.55,
};

// ============================================================================
// 2. SHADOW FACTORIES — 호출마다 새 객체 (재사용 금지)
// ============================================================================

const sStandard = () => ({
  type: "outer",
  color: "000000",
  blur: 6,
  offset: 2,
  angle: 90,
  opacity: 0.08,
});

const sBrandGlow = () => ({
  type: "outer",
  color: "4F6EF1",
  blur: 15,
  offset: 0,
  angle: 90,
  opacity: 0.20,
});

const sContainer = () => ({
  type: "outer",
  color: "000000",
  blur: 12,
  offset: 2,
  angle: 90,
  opacity: 0.05,
});

// ============================================================================
// 3. BOX HELPER — 단일 박스 그리기
// ============================================================================

/**
 * Box System의 모든 박스는 이 함수로 그립니다.
 * @param {Slide} s - pptxgenjs slide
 * @param {Pres} pres - pptxgenjs presentation
 * @param {number} x, y, w, h - 좌표
 * @param {object} opts
 *   fill: 박스 채움색 (기본 white)
 *   line: 박스 라인색 (기본 containerLine = EDEEF0)
 *   lw: 라인 두께 (기본 1pt)
 *   r: rectRadius (기본 0.18 큰 박스용, 작은 박스는 0.14)
 *   shadow: false면 그림자 끄기 (기본 sContainer)
 */
function box(s, pres, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.white },
    line: { color: opts.line || C.containerLine, width: opts.lw || 1 },
    rectRadius: opts.r || 0.18,
    shadow: opts.shadow !== false ? sContainer() : undefined,
  });
}

// ============================================================================
// 4. BODY SLIDE FACTORIES — 7가지 Box 패턴
// ============================================================================

function _addLogo(s) {
  s.addImage({
    path: LOGO.path,
    x: LOGO.x, y: LOGO.y, w: LOGO.w, h: LOGO.h,
    sizing: { type: "contain", w: LOGO.w, h: LOGO.h },
  });
}

/** Pattern 1 — Single Container (단일 박스, 풀폭) */
function bodySlide1(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 12.49, 3.85);
  _addLogo(s);
  return s;
}

/** Pattern 2L — Vertical Split 2 (좌우 1:1) */
function bodySlide2L(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 6.145, 3.85);
  box(s, pres, 6.767, 2.20, 6.145, 3.85);
  _addLogo(s);
  return s;
}

/** Pattern 2H — Horizontal Split 2 (상하 1:1) */
function bodySlide2H(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 12.49, 1.85);
  box(s, pres, 0.422, 4.20, 12.49, 1.85);
  _addLogo(s);
  return s;
}

/** Pattern 3 — Vertical Split 3 (3분할 1:1:1) */
function bodySlide3(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 4.043, 3.85);
  box(s, pres, 4.645, 2.20, 4.043, 3.85);
  box(s, pres, 8.868, 2.20, 4.043, 3.85);
  _addLogo(s);
  return s;
}

/** Pattern 4 — Quadrant Split (2x2) */
function bodySlide4(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 6.145, 1.85, { r: 0.14 });
  box(s, pres, 6.767, 2.20, 6.145, 1.85, { r: 0.14 });
  box(s, pres, 0.422, 4.20, 6.145, 1.85, { r: 0.14 });
  box(s, pres, 6.767, 4.20, 6.145, 1.85, { r: 0.14 });
  _addLogo(s);
  return s;
}

/** Pattern 5 — Asymmetric 5:7 (좌소 우대) */
function bodySlide5(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 4.95, 3.85);
  box(s, pres, 5.572, 2.20, 7.34, 3.85);
  _addLogo(s);
  return s;
}

/** Pattern 6 — Asymmetric 7:5 (좌대 우소) */
function bodySlide6(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 7.34, 3.85);
  box(s, pres, 7.962, 2.20, 4.95, 3.85);
  _addLogo(s);
  return s;
}

/** Pattern 7 — Mixed Grid (좌 큰 박스 + 우 상하 2) */
function bodySlide7(pres) {
  const s = pres.addSlide();
  s.background = { color: C.white };
  box(s, pres, 0.422, 2.20, 7.34, 3.85);
  box(s, pres, 7.962, 2.20, 4.95, 1.85, { r: 0.14 });
  box(s, pres, 7.962, 4.20, 4.95, 1.85, { r: 0.14 });
  _addLogo(s);
  return s;
}

// ============================================================================
// 5. COVER SLIDE — Hero Gradient (Box System 미사용)
// ============================================================================

/**
 * 표지 슬라이드. hero_gradient.png를 background로 사용.
 * scripts/hero-gradient.js로 사전 생성 필요 (≥ 2400×1350).
 */
function coverSlide(pres, opts = {}) {
  const s = pres.addSlide();
  s.background = {
    path: opts.gradient || "hero_gradient.png",
  };

  // 좌상단 white logo
  if (opts.logo !== false) {
    s.addImage({
      path: opts.whiteLogo || "brandlogy_logo_white.png",
      x: 0.70, y: 0.50, w: 1.80, h: 0.55,
      sizing: { type: "contain", w: 1.80, h: 0.55 },
    });
  }

  if (opts.eyebrow) {
    s.addText(opts.eyebrow, {
      x: 0.70, y: 2.95, w: 9.0, h: 0.35,
      fontFace: FONT, fontSize: 11, bold: true,
      color: C.white, charSpacing: 4, margin: 0, valign: "middle",
    });
  }

  if (opts.title) {
    s.addText(opts.title, {
      x: 0.70, y: 3.40, w: 12.0, h: 1.0,
      fontFace: FONT, fontSize: opts.titleSize || 46, bold: true,
      color: C.white, charSpacing: -1, margin: 0, valign: "middle",
    });
  }

  if (opts.subtitle) {
    s.addText(opts.subtitle, {
      x: 0.70, y: 4.55, w: 12.0, h: 0.40,
      fontFace: FONT_M, fontSize: 16,
      color: C.white, margin: 0, valign: "middle",
    });
  }

  return s;
}

// ============================================================================
// 6. HEADER — Chapter Strip + Headline + Subtitle
// ============================================================================

/**
 * 모든 본문 슬라이드의 헤더. 세 영역 좌표는 절대 변경 금지.
 * headline은 한 줄 원칙 — 두 줄이면 charSpacing -0.5 ~ -1로 압축.
 */
function addHeader(s, chapter, headline, subtitle, opts = {}) {
  // Chapter Strip
  if (chapter) {
    s.addText(chapter, {
      x: 0.422, y: 0.306, w: 5.5, h: 0.269,
      fontFace: FONT, fontSize: 10, bold: true,
      color: C.brand, charSpacing: opts.chapterSpacing || 3,
      margin: 0, valign: "middle",
    });
  }

  // Headline (Action Title — 사실 진술 금지)
  s.addText(headline, {
    x: 0.422, y: 0.851, w: 12.262, h: 0.505,
    fontFace: FONT, fontSize: opts.headlineSize || 24, bold: true,
    color: C.black, charSpacing: opts.headlineSpacing || -0.5,
    margin: 0, valign: "middle",
  });

  // Subtitle
  if (subtitle) {
    s.addText(subtitle, {
      x: 0.422, y: 1.472, w: 12.262, h: 0.303,
      fontFace: FONT_M, fontSize: 12,
      color: C.text, margin: 0, valign: "middle",
    });
  }
}

// ============================================================================
// 7. SO WHAT 콜아웃
// ============================================================================

/**
 * 하단 SO WHAT 메시지. "X 아닙니다. Y일 뿐입니다" 패턴 권장.
 */
function addSoWhat(s, pres, msg, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.622, y: 6.20, w: 12.09, h: 0.35,
    fill: { color: C.surface2 },
    line: { type: "none" },
    rectRadius: 0.06,
  });

  s.addText(
    [
      {
        text: opts.label || "SO WHAT  ·  ",
        options: { bold: true, color: C.brand, charSpacing: 2 },
      },
      { text: msg, options: { color: C.ink } },
    ],
    {
      x: 0.622 + 0.18, y: 6.20, w: 12.09 - 0.36, h: 0.35,
      fontFace: FONT, fontSize: 10.5, margin: 0, valign: "middle",
    }
  );
}

// ============================================================================
// 8. BOTTOM STRIP — Source(좌) + Page Num(우), Copyright 없음
// ============================================================================

function addBottomStrip(s, pageNum, source) {
  if (source) {
    s.addText(source, {
      x: 0.535, y: 6.85, w: 11.0, h: 0.30,
      fontFace: FONT, fontSize: 8, color: C.caption,
      align: "left", margin: 0, valign: "middle",
    });
  }

  s.addText(String(pageNum), {
    x: 12.45, y: 6.85, w: 0.47, h: 0.30,
    fontFace: FONT, fontSize: 8, color: C.caption,
    align: "right", margin: 0, valign: "middle",
  });
}

// ============================================================================
// 9. CARD HELPER — Box 안 카드 빠른 생성
// ============================================================================

/**
 * Box 안에 카드 1개. 강조 카드는 emphasis=true.
 * 한 슬라이드에 emphasis=true는 1개만 (One emphasis 원칙).
 */
function card(s, pres, x, y, w, h, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.emphasis ? C.brandPale : (opts.fill || C.white) },
    line: {
      color: opts.emphasis ? C.brand : (opts.line || C.surface3),
      width: opts.emphasis ? 1.4 : (opts.lw || 1),
    },
    rectRadius: opts.r || 0.10,
    shadow: opts.emphasis ? sBrandGlow() : sStandard(),
  });
}

/**
 * KPI 빅 넘버 텍스트 박스. 라벨 + 숫자를 한 덩어리로 처리.
 */
function kpiText(s, label, big, desc, x, y, w, opts = {}) {
  const baseY = y;

  if (label) {
    s.addText(label, {
      x, y: baseY, w, h: 0.25,
      fontFace: FONT, fontSize: 9, bold: true,
      color: C.caption, charSpacing: 2,
      margin: 0, valign: "middle",
    });
  }

  s.addText(big, {
    x, y: baseY + 0.25, w, h: 0.65,
    fontFace: FONT, fontSize: opts.bigSize || 30, bold: true,
    color: opts.bigColor || C.brand,
    charSpacing: -0.5, margin: 0, valign: "middle",
  });

  if (desc) {
    s.addText(desc, {
      x, y: baseY + 0.95, w, h: 0.35,
      fontFace: FONT_M, fontSize: 9.5,
      color: C.mute, margin: 0, valign: "top",
    });
  }
}

// ============================================================================
// 10. CHART OPTIONS — pptxgenjs 차트 공통 옵션
// ============================================================================

/**
 * 모든 차트에 공통 적용. chartColors는 작업별 override.
 */
function chartOpts(overrides = {}) {
  return {
    chartArea: { fill: { color: C.white }, border: { pt: 0, color: C.white } },
    plotArea: { fill: { color: C.white } },
    catAxisLabelColor: C.ink,
    catAxisLabelFontFace: FONT,
    catAxisLabelFontSize: 11,
    valAxisLabelColor: C.mute,
    valAxisLabelFontFace: FONT,
    valAxisLabelFontSize: 9,
    valGridLine: { color: C.border, size: 0.5, style: "solid" },
    catGridLine: { style: "none" },
    showLegend: false,
    dataLabelFontFace: FONT,
    dataLabelFontSize: 10,
    dataLabelFontBold: true,
    chartColors: [C.brand],
    ...overrides,
  };
}

// ============================================================================
// 11. LAYOUT REGISTRATION — 모든 빌드 첫 줄에 호출
// ============================================================================

function initLayout(pres) {
  pres.defineLayout({ name: "BRANDLOGY_169", width: 13.333, height: 7.5 });
  pres.layout = "BRANDLOGY_169";
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Constants
  FONT, FONT_M, C, LOGO,
  // Shadows
  sStandard, sBrandGlow, sContainer,
  // Box
  box,
  // Body slides (7 patterns)
  bodySlide1, bodySlide2L, bodySlide2H,
  bodySlide3, bodySlide4, bodySlide5,
  bodySlide6, bodySlide7,
  // Cover
  coverSlide,
  // Slide elements
  addHeader, addSoWhat, addBottomStrip,
  // Cards
  card, kpiText,
  // Charts
  chartOpts,
  // Init
  initLayout,
};
