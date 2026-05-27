/**
 * Hero Gradient PNG Generator
 *
 * 표지 슬라이드용 그라디언트 배경 PNG를 생성합니다.
 * Brandlogy 표준: linear-gradient(135deg, #4F6EF1 → #7E94F5 → #A8B7F8)
 * 해상도: 2400×1350 (180 DPI, 권장 표준)
 *
 * 사용: node hero-gradient.js [output_path]
 *       기본 output: ./hero_gradient.png
 */

const sharp = require("sharp");
const path = require("path");

const OUTPUT = process.argv[2] || "./hero_gradient.png";
const W = 2400;
const H = 1350;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#4F6EF1"/>
      <stop offset="50%"  stop-color="#7E94F5"/>
      <stop offset="100%" stop-color="#A8B7F8"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
</svg>`;

(async () => {
  try {
    await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .toFile(OUTPUT);
    console.log(`✓ Hero gradient generated: ${path.resolve(OUTPUT)} (${W}×${H})`);
  } catch (err) {
    console.error("✗ Generation failed:", err.message);
    process.exit(1);
  }
})();
