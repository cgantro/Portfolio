const pptx = require("pptxgenjs");

const pres = new pptx();
pres.defineLayout({ name:"WIDESCREEN_16_9", width:13.333, height:7.5 });
pres.layout = "WIDESCREEN_16_9";
pres.author = "yoonpyo";
pres.title  = "yoonpyo Portfolio";

// ── Slide 01: Cover ──────────────────────────────────────────────────
require("./slides/s01-cover")(pres);

// ── Slide 02: Executive Summary ──────────────────────────────────────
require("./slides/s02-summary")(pres);

// ── Slide 03: RobotPal 개요 + 파이프라인 아키텍처 ────────────────────
require("./slides/s03-autowing")(pres);

// ── Slide 04: RobotPal 병목 계측 + FPS 차트 ─────────────────────────
require("./slides/s04-jwt")(pres);

// ── Slide 05: Mausoleum 개요 + 보이스 채팅 아키텍처 ──────────────────
require("./slides/s05-robotpal")(pres);

// ── Slide 06: Mausoleum 트러블슈팅 + 생사 분리 전략 패턴 ────────────
require("./slides/s06-mausoleum")(pres);

// ── Slide 07: STICKER 개요 + SQS 비동기 파이프라인 ───────────────────
require("./slides/s07-sticker")(pres);

// ── Slide 08: STICKER 신뢰성 설계 (afterCommit · RTR · SmartLifecycle) ─
require("./slides/s08-subprojects")(pres);

// ── Slide 09: 기술 선택 근거 (SQS · 가상 스레드 · Opus+UDP) ──────────
require("./slides/s09-techstack")(pres);

// ── Slide 10: Other Projects (AutoWing · SSAFY BOB · Korean Snack Shop) ─
require("./slides/s10-final")(pres);

// ── Slide 11: Tech Stack ─────────────────────────────────────────────
require("./slides/s11-techstack")(pres);

// ── Slide 12: Final ──────────────────────────────────────────────────
require("./slides/s12-final")(pres);

pres.writeFile({ fileName:"yoonpyo-portfolio.pptx" })
  .then(() => console.log("✅  yoonpyo-portfolio.pptx 생성 완료 (12 slides)"))
  .catch(e => console.error("❌  에러:", e));
