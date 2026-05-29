const path = require("path");
const { FONT, C, BOX_STYLE } = require("../constants");
const { addHeader, addSoWhat, addBottomStrip } = require("../helpers");

const ARCH_IMG = path.resolve(__dirname, "../../asset/스티커_아키텍처.png");

module.exports = function(pres) {
  const sld = pres.addSlide();
  sld.background = { color: C.bg };

  addHeader(sld, "주요 프로젝트 03 · STICKER",
    "AI 날씨·일정 기반 패션 코디 추천 앱",
    "Spring Boot 3.5 · Java 21 · AWS SQS/S3 · Redis · Prometheus · Grafana · Traefik · GitLab CI/CD");

  // ── Left box: 프로젝트 메타 ─────────────────────────────────────────
  sld.addShape("roundRect", { x:0.422, y:2.20, w:4.95, h:3.85, ...BOX_STYLE(0.18) });

  const lx = 0.622;

  sld.addText("2026.04 – 2026.05", {
    x:lx, y:2.38, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9, color:C.fgDim,
  });
  sld.addText("6인 (React Native + Spring Boot + FastAPI)  ·  백엔드 전담 · DevOps", {
    x:lx, y:2.62, w:4.55, h:0.36,
    fontFace:FONT, fontSize:9, color:C.fgDim, lineSpacingMultiple:1.3,
  });

  sld.addShape("line", { x:lx, y:3.06, w:4.35, h:0.01, line:{ color:C.border, width:0.8 } });

  sld.addText("구현", {
    x:lx, y:3.14, w:4.55, h:0.24,
    fontFace:FONT, fontSize:9.5, bold:true, color:C.accent,
  });
  // 웹 implementations[].title 그대로
  [
    "SQS 비동기 AI 파이프라인",
    "중복 실행 방어 (dedup + 분산 락)",
    "인증 시스템",
    "Redis 다층 캐시",
    "CI/CD 파이프라인",
  ].forEach((item, i) => {
    sld.addText("· " + item, {
      x:lx, y:3.42 + i * 0.40, w:4.55, h:0.36,
      fontFace:FONT, fontSize:9.5, color:C.fg, lineSpacingMultiple:1.25,
    });
  });

  sld.addShape("line", { x:lx, y:5.44, w:4.35, h:0.01, line:{ color:C.border, width:0.8 } });
  [
    "Spring Boot 백엔드 전담",
    "SQS 비동기 AI 파이프라인 설계",
    "DevOps (CI/CD · 모니터링)",
  ].forEach((h, i) => {
    sld.addText("› " + h, {
      x:lx, y:5.52 + i * 0.22, w:4.55, h:0.20,
      fontFace:FONT, fontSize:8.5, color:C.accent,
    });
  });

  // ── Right: 아키텍처 이미지 ─────────────────────────────────────────
  sld.addText("아키텍처", {
    x:5.70, y:2.22, w:7.0, h:0.24,
    fontFace:FONT, fontSize:9.5, color:C.fgDim,
  });
  try {
    sld.addImage({ path: ARCH_IMG, x:5.572, y:2.50, w:7.34, h:3.55 });
  } catch(e) {
    sld.addShape("roundRect", { x:5.572, y:2.50, w:7.34, h:3.55, fill:{ color:C.bg3 }, line:{ color:C.border, width:1 }, rectRadius:0.10 });
    sld.addText("아키텍처 이미지를 찾을 수 없습니다", { x:5.572, y:3.90, w:7.34, h:0.40, fontFace:FONT, fontSize:10, color:C.fgDim, align:"center" });
  }

  addSoWhat(sld, "AI 추천은 수십 초가 걸립니다. 동기 호출 대신 SQS로 분리하고, 상태 정합성과 중복 방지를 함께 설계했습니다.");
  addBottomStrip(sld, 7, "Source: STICKER — SQS 소비기 · afterCommit · Redis 분산 락 (2026-05-17)");
};
