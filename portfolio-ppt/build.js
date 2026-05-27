/**
 * yoonpyo 개발자 포트폴리오 PPT
 * Brandlogy PPT Design System v11
 * Box System + 모노크롬 블루-그레이 + McKinsey Action Title
 *
 * 웹 포트폴리오 내용 기반으로 재구성 (2026-05-27)
 * S1  Cover
 * S2  Executive Summary (3 core strengths)
 * S3  Autowing_car — 상태 불일치 해결
 * S4  Autowing_car — JWT 3토큰 인증 설계
 * S5  RobotPal — 스트리밍 최적화
 * S6  mausoleum — 보이스 + 세션 분리
 * S7  STICKER — SQS 파이프라인 + AOP
 * S8  서브 프로젝트 (BOB · 코리안스낵샵)
 * S9  기술 스택
 * S10 Final Takeaway
 */
const pptx = require("pptxgenjs");

// ─── Core Constants ────────────────────────────────────────────────────────────
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

const sStandard  = () => ({ type:"outer", color:"000000", blur:6,  offset:2, angle:90, opacity:0.08 });
const sContainer = () => ({ type:"outer", color:"000000", blur:12, offset:2, angle:90, opacity:0.05 });
const sBrandGlow = () => ({ type:"outer", color:"4F6EF1", blur:15, offset:0, angle:90, opacity:0.20 });

// ─── Box System Helpers ────────────────────────────────────────────────────────
const BOX_STYLE = (radius = 0.18) => ({
  fill: { color: C.white },
  line: { color: C.containerLine, width: 1 },
  rectRadius: radius,
  shadow: sContainer(),
});

function addBoxP1(sld) {
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:2.20, w:12.49, h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP2L(sld) {
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:2.20, w:6.145, h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape(pres.ShapeType.roundRect, { x:6.767, y:2.20, w:6.145, h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP3(sld) {
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:2.20, w:4.043, h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape(pres.ShapeType.roundRect, { x:4.645, y:2.20, w:4.043, h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape(pres.ShapeType.roundRect, { x:8.868, y:2.20, w:4.043, h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP4(sld) {
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:2.20, w:6.145, h:1.85, ...BOX_STYLE(0.14) });
  sld.addShape(pres.ShapeType.roundRect, { x:6.767, y:2.20, w:6.145, h:1.85, ...BOX_STYLE(0.14) });
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:4.20, w:6.145, h:1.85, ...BOX_STYLE(0.14) });
  sld.addShape(pres.ShapeType.roundRect, { x:6.767, y:4.20, w:6.145, h:1.85, ...BOX_STYLE(0.14) });
}
function addBoxP5(sld) {
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:2.20, w:4.95,  h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape(pres.ShapeType.roundRect, { x:5.572, y:2.20, w:7.34,  h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP6(sld) {
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:2.20, w:7.34,  h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape(pres.ShapeType.roundRect, { x:7.962, y:2.20, w:4.95,  h:3.85, ...BOX_STYLE(0.18) });
}
function addBoxP7(sld) {
  sld.addShape(pres.ShapeType.roundRect, { x:0.422, y:2.20, w:7.34,  h:3.85, ...BOX_STYLE(0.18) });
  sld.addShape(pres.ShapeType.roundRect, { x:7.962, y:2.20, w:4.95,  h:1.85, ...BOX_STYLE(0.14) });
  sld.addShape(pres.ShapeType.roundRect, { x:7.962, y:4.20, w:4.95,  h:1.85, ...BOX_STYLE(0.14) });
}

// ─── Header / Footer Helpers ───────────────────────────────────────────────────
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
  sld.addShape(pres.ShapeType.roundRect, {
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
  sld.addShape(pres.ShapeType.roundRect, {
    x, y, w, h,
    fill: { color: C.brandPale },
    line: { color: C.brandT3, width: 1.4 },
    rectRadius: 0.14,
    shadow: sBrandGlow(),
  });
}

// ─── Init ──────────────────────────────────────────────────────────────────────
const pres = new pptx();
pres.defineLayout({ name:"WIDESCREEN_16_9", width:13.333, height:7.5 });
pres.layout = "WIDESCREEN_16_9";
pres.author = "yoonpyo";
pres.title  = "yoonpyo Portfolio";

// ═══════════════════════════════════════════════════════════════════════════════
// S1 — COVER
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.dark };

  // Top accent bar
  sld.addShape(pres.ShapeType.rect, {
    x:0, y:0, w:13.333, h:0.06,
    fill:{ color:C.brand }, line: false,
  });

  // Eyebrow
  sld.addText("BACKEND DEVELOPER  ·  REALTIME SYSTEMS", {
    x:0.70, y:2.95, w:10.0, h:0.35,
    fontFace:FONT, fontSize:11, color:C.brandT3, bold:false, charSpacing:3,
  });

  // Title — 웹 포폴 포지셔닝 기반
  sld.addText("상태 정합성과\n운영 안정성을 설계한다", {
    x:0.70, y:3.42, w:10.5, h:1.55,
    fontFace:FONT, fontSize:48, bold:true, color:C.white,
    lineSpacingMultiple:1.1, charSpacing:-1,
  });

  // Name
  sld.addText("yoonpyo", {
    x:0.70, y:5.10, w:10.0, h:0.40,
    fontFace:FONT, fontSize:14, color:C.brandLight,
  });

  // Accent dots
  sld.addShape(pres.ShapeType.ellipse, {
    x:11.8, y:5.8, w:0.9, h:0.9,
    fill:{ color:C.brand }, line: false,
  });
  sld.addShape(pres.ShapeType.ellipse, {
    x:12.4, y:5.5, w:0.5, h:0.5,
    fill:{ color:C.brandT3 }, line: false,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// S2 — Executive Summary  (P3 3분할)
// 웹 포폴 3대 강점: 상태 정합성 / 실시간 구조 설계 / 병목 분석
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "EXECUTIVE SUMMARY",
    "비동기 실시간 환경에서 측정하고, 단계를 나누고, 구조로 해결했다",
    "Autowing_car · RobotPal · mausoleum · STICKER");

  addBoxP3(sld);

  // ── Card 1 — 상태 정합성 (emphasis) ──
  addEmphasisCard(sld, 0.442, 2.22, 4.003, 3.81);
  sld.addText("커밋 이후에만 외부로 알려야\n상태가 안 꼬인다", {
    x:0.622, y:2.42, w:3.643, h:0.72,
    fontFace:FONT, fontSize:12, bold:true, color:C.brand, lineSpacingMultiple:1.3,
  });
  sld.addText("DB 커밋 전 MQTT 이벤트 전파로\n상태 불일치 발생. afterCommit()\n훅으로 전파 타이밍을 분리하자\npayload bytes 90.36% 감소,\nwrite points 90% 감소.", {
    x:0.622, y:3.22, w:3.643, h:1.75,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("Autowing_car · STICKER", {
    x:0.622, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.brand,
  });

  // ── Card 2 — 실시간 구조 설계 ──
  sld.addText("처리·전파·저장을 나누면\n성능은 자연히 따라온다", {
    x:4.825, y:2.42, w:3.643, h:0.72,
    fontFace:FONT, fontSize:12, bold:true, color:C.ink, lineSpacingMultiple:1.3,
  });
  sld.addText("렌더 루프와 인코딩을 분리하자\niGPU 기준 +15.24% FPS.\n수집·처리·전파·저장 단계를 나누자\n전송량과 쓰기 부하가 동시에\n90% 줄었다.", {
    x:4.825, y:3.22, w:3.643, h:1.75,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("RobotPal · Autowing_car", {
    x:4.825, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  // ── Card 3 — 병목 분석 ──
  sld.addText("측정 없이는 어느 레이어가\n병목인지 알 수 없다", {
    x:9.048, y:2.42, w:3.643, h:0.72,
    fontFace:FONT, fontSize:12, bold:true, color:C.ink, lineSpacingMultiple:1.3,
  });
  sld.addText("Micrometer AOP로\nendpoint/layer/operation 태그\n메트릭 수집. 코드 변경 없이\n어느 레이어가 얼마나 걸리는지\np95/p99로 확인했다.", {
    x:9.048, y:3.22, w:3.643, h:1.75,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.5,
  });
  sld.addText("STICKER", {
    x:9.048, y:5.58, w:3.643, h:0.27,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  addSoWhat(sld, "상태 정합성 설계 · 실시간 데이터 처리 구조 · 병목 분석 — 이 세 축이 반복됩니다.");
  addBottomStrip(sld, 2, "");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S3 — Autowing_car 상태 불일치 해결  (P5 5:7)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 01 · Autowing_car",
    "커밋 전 이벤트 전파 버그, 처리 단계 분리로 payload 90% 줄이고 상태 불일치 차단했다",
    "Spring Boot · MQTT · STOMP · Redis · PostgreSQL · Docker · GitLab CI");

  addBoxP5(sld);

  // Left box — 문제 + 원인
  sld.addText("문제", {
    x:0.622, y:2.45, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("DB 저장과 MQTT/WebSocket 이벤트 전파가\n같은 트랜잭션 흐름에 묶여 상태 불일치.\n고주파 텔레메트리 매 수신마다\nDB 직접 저장으로 쓰기 부담 급증.", {
    x:0.622, y:2.78, w:4.55, h:1.30,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("↓", {
    x:1.40, y:4.05, w:1.5, h:0.35,
    fontFace:FONT, fontSize:18, color:C.brandT3, align:"center", valign:"middle",
  });

  sld.addText("원인", {
    x:0.622, y:4.22, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("커밋 완료 전에 외부로 이벤트 전파.\nDB 롤백 시 메시지는 이미 나간 상태.\n텔레메트리 포인트 원본을 그대로 적재.", {
    x:0.622, y:4.55, w:4.55, h:1.00,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  // Right box — 해결 + 결과
  addEmphasisCard(sld, 5.592, 2.22, 7.30, 1.65);
  sld.addText("해결 1 — afterCommit() 훅", {
    x:5.772, y:2.32, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("DB 커밋 이후에만 MQTT/WS 이벤트 발행.\nTransactionSynchronizationManager\nregisterSynchronization().afterCommit()", {
    x:5.772, y:2.63, w:6.90, h:0.90,
    fontFace:"Consolas", fontSize:9.5, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("해결 2 — Redis 버퍼 + RDP 단순화", {
    x:5.772, y:4.00, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("Redis를 쓰기 버퍼로 사용해 DB 저장 배치화.\nRDP 알고리즘으로 텔레메트리 포인트 압축.", {
    x:5.772, y:4.30, w:6.90, h:0.65,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  // Result chips
  const results = [
    { label:"payload bytes", val:"90.36% 감소" },
    { label:"write points",  val:"90.00% 감소" },
    { label:"E2E 지연",      val:"14~28.7ms" },
  ];
  results.forEach((r, i) => {
    sld.addShape(pres.ShapeType.roundRect, {
      x:5.772 + i * 2.4, y:5.05, w:2.2, h:0.56,
      fill:{ color:C.brandPale }, line:{ color:C.brandT3, width:1 }, rectRadius:0.08,
    });
    sld.addText(r.label, {
      x:5.772 + i * 2.4, y:5.05, w:2.2, h:0.28,
      fontFace:FONT, fontSize:8.5, color:C.mute, align:"center", valign:"bottom",
    });
    sld.addText(r.val, {
      x:5.772 + i * 2.4, y:5.33, w:2.2, h:0.28,
      fontFace:FONT, fontSize:11, bold:true, color:C.brand, align:"center", valign:"top",
    });
  });

  addSoWhat(sld, "DB 커밋과 외부 이벤트 전파는 반드시 순서를 지켜야 합니다. 순서를 잘못 잡으면 롤백해도 메시지는 이미 나갔습니다.");
  addBottomStrip(sld, 3, "Source: Autowing_car 프로젝트 — afterCommit() 커밋 이력 (2026-02)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S4 — Autowing_car JWT 3토큰 설계  (P1 단일)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 01 · Autowing_car — 인증 설계",
    "WebSocket 핸드셰이크 전용 1분 토큰으로 URL 노출 위험을 최소화했다",
    "JWT 3종 분리 · Spring Security · Redis Refresh Token Rotation");

  addBoxP1(sld);

  const tokens = [
    {
      name:"ACCESS TOKEN",  life:"15분",
      use:"REST API 인증",
      desc:"Authorization 헤더\n일반 API 요청 전용",
      color:C.brand,  emphasis:false,
    },
    {
      name:"SOCKET TOKEN",  life:"1분",
      use:"WebSocket 핸드셰이크",
      desc:"socket_token 쿼리 파라미터\n짧은 TTL로 URL 노출 위험 최소화",
      color:C.brandDeep, emphasis:true,
    },
    {
      name:"REFRESH TOKEN", life:"7일",
      use:"토큰 갱신 + 재사용 감지",
      desc:"Redis TTL 저장\n재사용 감지 시 전체 세션 무효화",
      color:C.mute, emphasis:false,
    },
  ];

  tokens.forEach((t, i) => {
    const bx = 0.722 + i * 4.1;
    if (t.emphasis) addEmphasisCard(sld, bx - 0.10, 2.42, 3.95, 3.35);

    sld.addText(t.name, {
      x:bx, y:2.60, w:3.75, h:0.32,
      fontFace:FONT, fontSize:10, bold:true, color:t.color,
    });
    sld.addShape(pres.ShapeType.roundRect, {
      x:bx, y:3.00, w:0.85, h:0.28,
      fill:{ color: t.emphasis ? C.brandPale : C.surface2 },
      line:{ color: t.emphasis ? C.brandT3 : C.containerLine, width:1 },
      rectRadius:0.05,
    });
    sld.addText(t.life, {
      x:bx, y:3.00, w:0.85, h:0.28,
      fontFace:FONT, fontSize:9, bold:true, color:t.color,
      align:"center", valign:"middle",
    });
    sld.addText(t.use, {
      x:bx, y:3.35, w:3.75, h:0.30,
      fontFace:FONT, fontSize:10, color:C.ink,
    });
    sld.addText(t.desc, {
      x:bx, y:3.75, w:3.75, h:0.72,
      fontFace:FONT, fontSize:10, color:C.mute, lineSpacingMultiple:1.5,
    });
  });

  sld.addText("로그인 → ACCESS + SOCKET + REFRESH 동시 발급  ·  SOCKET은 WebSocket 연결에만 사용·검증", {
    x:0.722, y:5.38, w:11.89, h:0.30,
    fontFace:FONT, fontSize:9.5, color:C.mute, align:"center",
  });

  addSoWhat(sld, "WebSocket 연결은 헤더를 쓸 수 없어 토큰이 URL에 드러납니다. 수명 1분짜리 전용 토큰이 유일한 방어선입니다.");
  addBottomStrip(sld, 4, "Source: Autowing_car — JWT 토큰 설계 커밋 (2026-01)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S5 — RobotPal 스트리밍 최적화  (P6 7:5)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 02 · RobotPal",
    "렌더 루프와 인코딩을 분리하자 iGPU 기준 +15.24% FPS가 따라왔다",
    "C++17 · OpenGL · libjpeg-turbo · 생산자-소비자 패턴 · 벤치마킹");

  addBoxP6(sld);

  // Left — Chart
  sld.addText("싱글 vs 멀티 워커 FPS 비교 (816×616, JPEG Q70)", {
    x:0.622, y:2.40, w:6.94, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.ink,
  });

  // Grouped bar: Single vs Multi
  const chartData = [
    {
      name:"Single Worker",
      labels:["dGPU 앱", "dGPU 수신", "iGPU 앱", "iGPU 수신"],
      values:[55.94, 16.47, 58.10, 18.30],
    },
    {
      name:"Multi Worker",
      labels:["dGPU 앱", "dGPU 수신", "iGPU 앱", "iGPU 수신"],
      values:[59.41, 17.10, 66.95, 21.91],
    },
  ];
  sld.addChart(pres.ChartType.bar, chartData, {
    x:0.622, y:2.72, w:6.94, h:2.80,
    chartColors:[ C.brandT3, C.brand ],
    barGrouping:"clustered",
    barDir:"bar",
    showValue:true, dataLabelFontSize:8.5, dataLabelColor:"FFFFFF",
    catAxisLabelFontSize:9, valAxisLabelFontSize:9,
    valAxisMinVal:0, valAxisMaxVal:80,
    showLegend:true, legendFontSize:9,
    catAxisLineShow:false, valAxisLineShow:false,
    showTitle:false,
  });

  sld.addText("+15.24% (iGPU 앱 FPS)  ·  +19.69% (iGPU 수신)  ·  디버그 빌드 기준", {
    x:0.622, y:5.60, w:6.94, h:0.28,
    fontFace:FONT, fontSize:9, color:C.mute,
  });

  // Right — 병목 원인 & 해결
  sld.addText("문제 → 해결 흐름", {
    x:8.162, y:2.45, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });

  const items = [
    { t:"렌더 루프 + 인코딩 경쟁",     d:"메인 루프가 FPS를 잡아먹는 구조",    c:C.mute  },
    { t:"생산자-소비자로 루프 분리",    d:"렌더와 압축이 서로 방해 안 함",       c:C.brand },
    { t:"멀티 워커 인코딩",             d:"압축 작업을 워커에 분산",             c:C.brand },
    { t:"iGPU 환경 추가 검증",          d:"외장 GPU 없는 환경에서 더 큰 개선",  c:C.brand },
  ];
  items.forEach((it, i) => {
    const iy = 2.87 + i * 0.76;
    sld.addShape(pres.ShapeType.ellipse, {
      x:8.162, y:iy + 0.07, w:0.13, h:0.13,
      fill:{ color:it.c }, line: false,
    });
    sld.addText(it.t, {
      x:8.33, y:iy, w:4.4, h:0.28,
      fontFace:FONT, fontSize:10, bold:(it.c === C.brand), color:it.c,
    });
    sld.addText(it.d, {
      x:8.33, y:iy + 0.28, w:4.4, h:0.28,
      fontFace:FONT, fontSize:9, color:C.caption,
    });
  });

  addSoWhat(sld, "렌더링이 느린 게 아닙니다. 렌더와 인코딩이 같은 루프에서 경쟁했을 뿐입니다.");
  addBottomStrip(sld, 5, "Source: RobotPal 카메라스트리밍 병목분석.md — 디버그 빌드 b01af42 (2026-04-09)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S6 — mausoleum 보이스 + 세션 설계  (P5 5:7)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 03 · mausoleum",
    "Alt-Tab 복귀 시 누적 음성 재생, 버퍼 폐기 + 코덱 리셋으로 즉시 제거했다",
    "Unreal Engine 5 · C++ · 전용 서버 · UDP 음성 서버 · 룸 코드 세션 분리");

  addBoxP5(sld);

  // Left — 문제
  sld.addText("문제", {
    x:0.622, y:2.45, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("Alt-Tab 복귀 직후 대기 중 누적된\n음성 버퍼가 한꺼번에 재생 →\n지연 + 잡음으로 UX 파괴.\n\n사망자/생존자 음성 규칙 미분리 →\n게임 정보가 음성으로 새어나감.", {
    x:0.622, y:2.78, w:4.55, h:1.90,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("추가 기여", {
    x:0.622, y:4.72, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("물리 기반 게임 세션을 대기/인게임\n흐름과 분리 → 상태 충돌 감소", {
    x:0.622, y:5.05, w:4.55, h:0.60,
    fontFace:FONT, fontSize:10, color:C.mute, lineSpacingMultiple:1.4,
  });

  // Right — 해결 + 결과
  addEmphasisCard(sld, 5.592, 2.22, 7.30, 1.60);
  sld.addText("해결 1 — 코덱 리셋 정책", {
    x:5.772, y:2.32, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.brand,
  });
  sld.addText("백그라운드 복귀 시 오래된 캡처 버퍼\n폐기 + 코덱 리셋 → 지연 음성 즉시 제거", {
    x:5.772, y:2.63, w:6.90, h:0.70,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("해결 2 — 상태 기반 청취 규칙", {
    x:5.772, y:4.00, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("생존/사망/관전 상태별 청취 권한을 분리\n→ 사망자 정보 과노출 완화", {
    x:5.772, y:4.30, w:6.90, h:0.65,
    fontFace:FONT, fontSize:11, color:C.ink, lineSpacingMultiple:1.5,
  });

  sld.addText("해결 3 — 룸 코드 기반 논리 분리", {
    x:5.772, y:5.05, w:7.0, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  sld.addText("세션 간 이벤트/음성 간섭 완전 차단", {
    x:5.772, y:5.36, w:6.90, h:0.35,
    fontFace:FONT, fontSize:11, color:C.ink,
  });

  addSoWhat(sld, "오래된 버퍼를 재생하면 UX가 망가집니다. 복귀 시 폐기 정책은 선택이 아니라 기본값이어야 합니다.");
  addBottomStrip(sld, 6, "Source: mausoleum 프로젝트 — VoiceCapture 코덱 리셋 커밋 (2026-03)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S7 — STICKER SQS 파이프라인 + AOP  (P1 단일)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "주요 프로젝트 04 · STICKER",
    "SmartLifecycle + 이중 오류 처리로 graceful shutdown과 독성 메시지를 동시에 잡았다",
    "Spring Boot 3.5 · Java 21 가상 스레드 · AWS SQS/S3 · Micrometer · Prometheus · Grafana");

  addBoxP1(sld);

  // SQS pipeline layers
  const layers = [
    {
      name:"Job 발행기",
      y:2.52,
      fill:C.surface3,  line:C.containerLine,
      text:"Redis 분산 락 (setIfAbsent) → SQS 발행 — 동시 중복 요청 차단",
      color:C.mute,
    },
    {
      name:"SQS 소비기",
      y:3.12,
      fill:C.brandPale,  line:C.brandT3,
      text:"SmartLifecycle + 가상 스레드 long-polling — graceful shutdown 보장",
      color:C.brand,
    },
    {
      name:"오류 처리",
      y:3.72,
      fill:C.brandPale,  line:C.brandT3,
      text:"계약 위반 메시지 → 즉시 ack (poison pill 차단) · 일시 장애 → ack 보류 (SQS 재처리)",
      color:C.brand,
    },
    {
      name:"결과 dedup",
      y:4.32,
      fill:C.brandPale,  line:C.brandT3,
      text:"Redis setIfAbsent(jobId, 7일 TTL) — SQS at-least-once 중복 소비 방지",
      color:C.brand,
    },
    {
      name:"AOP 계측",
      y:4.92,
      fill:C.surface3,  line:C.containerLine,
      text:"app_operation_seconds: endpoint/layer/operation/result 태그 · p95·p99 SLO",
      color:C.mute,
    },
  ];

  layers.forEach(l => {
    sld.addShape(pres.ShapeType.roundRect, {
      x:0.622, y:l.y, w:11.89, h:0.48,
      fill:{ color:l.fill }, line:{ color:l.line, width:1 }, rectRadius:0.07,
    });
    sld.addText(l.name, {
      x:0.822, y:l.y, w:1.8, h:0.48,
      fontFace:FONT, fontSize:10, bold:true, color:l.color, valign:"middle",
    });
    sld.addText(l.text, {
      x:2.822, y:l.y, w:9.2, h:0.48,
      fontFace:FONT, fontSize:9.5, color:C.mute, valign:"middle",
    });
  });

  addSoWhat(sld, "SQS at-least-once delivery에서 신뢰성은 소비기 설계가 전부입니다. ack 타이밍과 오류 분류가 핵심입니다.");
  addBottomStrip(sld, 7, "Source: STICKER — SmartLifecycle · ExecutionTimeAspect.java (2026-05-17)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S8 — 서브 프로젝트  (P2L 좌우)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "OTHER PROJECTS",
    "SSAFY BOB과 코리안스낵샵에서 MCP 서버 설계와 Spring 백엔드 기반을 쌓았다",
    "Python FastMCP · Smithery · Spring Boot · AWS RDS · JWT · OAuth2");

  addBoxP2L(sld);

  // Left — SSAFY BOB
  sld.addText("SSAFY BOB  ·  MCP 서버", {
    x:0.622, y:2.42, w:5.745, h:0.30,
    fontFace:FONT, fontSize:12, bold:true, color:C.brand,
  });
  sld.addText("Python · FastMCP · Smithery · uv", {
    x:0.622, y:2.76, w:5.745, h:0.25,
    fontFace:FONT, fontSize:9.5, color:C.caption,
  });
  sld.addShape(pres.ShapeType.line, {
    x:0.622, y:3.08, w:5.545, h:0.01,
    line:{ color:C.containerLine, width:0.8 },
  });
  sld.addText("LLM 에이전트가 SSAFY 식단 정보를 실시간으로 조회할 수 있는 MCP 서버 개발.\n\n@mcp.tool 데코레이터로 get_meal_menu 도구 등록. 자연어 날짜/층수 파라미터 추출, Pydantic 스키마로 LLM 입력 명세 정의.\n\n요청마다 외부 GitHub Pages JSON을 페칭하는 stateless 구조로 설계. Smithery 배포.", {
    x:0.622, y:3.18, w:5.745, h:2.20,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.55,
  });

  // Right — 코리안스낵샵
  sld.addText("코리안스낵샵  ·  초기 프로젝트", {
    x:6.967, y:2.42, w:5.745, h:0.30,
    fontFace:FONT, fontSize:12, bold:true, color:C.mute,
  });
  sld.addText("Java 17 · Spring Boot · AWS RDS · MySQL · JWT · Google OAuth2", {
    x:6.967, y:2.76, w:5.745, h:0.25,
    fontFace:FONT, fontSize:9.5, color:C.caption,
  });
  sld.addShape(pres.ShapeType.line, {
    x:6.967, y:3.08, w:5.545, h:0.01,
    line:{ color:C.containerLine, width:0.8 },
  });
  sld.addText("해외 대상 한국 간식 소개 플랫폼 백엔드.\n\n회원가입·로그인 인증 구현 (JWT + Spring Security). Google OAuth2 소셜 로그인. AWS RDS MySQL 구축.\n\n첫 Spring Boot 프로젝트. AWS EC2 단일 서버 배포. 기본 CRUD + 인증 흐름 직접 설계하며 백엔드 기반을 쌓음.", {
    x:6.967, y:3.18, w:5.745, h:2.20,
    fontFace:FONT, fontSize:10.5, color:C.ink, lineSpacingMultiple:1.55,
  });

  addSoWhat(sld, "MCP와 OAuth2 모두 인터페이스 경계를 명확히 설계해야 하는 구조였습니다.");
  addBottomStrip(sld, 8, "");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S9 — 기술 스택  (P7 혼합)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.white };

  addHeader(sld, "RESOLUTION · 기술 스택",
    "실물 하드웨어부터 AI 파이프라인까지 연결하며 검증한 백엔드 기술 스택",
    "Spring Boot · AWS · C++ · UE5 · 인프라 — 도메인 무관 구조 설계");

  addBoxP7(sld);

  // Left big — Core Backend
  sld.addText("Core Backend", {
    x:0.622, y:2.40, w:6.94, h:0.30,
    fontFace:FONT, fontSize:11, bold:true, color:C.brand,
  });

  const coreItems = [
    { cat:"Spring Boot 3.x",     items:"Java 17/21 · Spring Security · JWT · AOP" },
    { cat:"Redis",                items:"Lettuce · Refresh Token · Cache · 분산 락 · dedup" },
    { cat:"MQTT",                 items:"Eclipse Paho · Spring Integration · 상태 머신" },
    { cat:"WebSocket / STOMP",   items:"STOMP Broker · 역할 기반 채널 · 핸드셰이크 토큰" },
    { cat:"AWS SQS / S3",        items:"비동기 파이프라인 · SmartLifecycle 소비기" },
    { cat:"PostgreSQL / TimescaleDB", items:"시계열 이력 저장 · 배치 적재 · RDP 단순화" },
  ];
  coreItems.forEach((it, i) => {
    sld.addText(it.cat, {
      x:0.622, y:2.80 + i * 0.51, w:2.8, h:0.30,
      fontFace:FONT, fontSize:9.5, bold:true, color:C.ink,
    });
    sld.addText(it.items, {
      x:3.50, y:2.80 + i * 0.51, w:3.82, h:0.30,
      fontFace:FONT, fontSize:9.5, color:C.mute,
    });
  });

  // Right top — Infra
  sld.addText("Infra / DevOps", {
    x:8.162, y:2.40, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  const infraItems = [
    "GitLab CI/CD · Docker Buildx",
    "Prometheus · Grafana · Traefik",
    "Micrometer AOP · p95/p99 SLO",
    "Redis 분산 락",
  ];
  infraItems.forEach((it, i) => {
    sld.addText("· " + it, {
      x:8.262, y:2.72 + i * 0.30, w:4.35, h:0.28,
      fontFace:FONT, fontSize:9, color:C.mute,
    });
  });

  // Right bottom — Other domains
  sld.addText("기타 도메인", {
    x:8.162, y:4.40, w:4.55, h:0.28,
    fontFace:FONT, fontSize:10, bold:true, color:C.mute,
  });
  const otherItems = [
    "C++17 · OpenGL · libjpeg (RobotPal)",
    "UE5 · C++ · UDP (mausoleum)",
    "Python · FastMCP · Smithery (BOB)",
  ];
  otherItems.forEach((it, i) => {
    sld.addText("· " + it, {
      x:8.262, y:4.72 + i * 0.30, w:4.35, h:0.28,
      fontFace:FONT, fontSize:9, color:C.mute,
    });
  });

  addSoWhat(sld, "백엔드 구조 설계가 핵심이지만, 하드웨어부터 AI 서버까지 연결한 경험이 시야를 넓혔습니다.");
  addBottomStrip(sld, 9, "");
}

// ═══════════════════════════════════════════════════════════════════════════════
// S10 — Final Takeaway  (dark)
// ═══════════════════════════════════════════════════════════════════════════════
{
  const sld = pres.addSlide();
  sld.background = { color: C.dark };

  sld.addShape(pres.ShapeType.rect, {
    x:0, y:0, w:13.333, h:0.06,
    fill:{ color:C.brand }, line: false,
  });

  sld.addText("상태 정합성과\n운영 안정성을 설계한다", {
    x:0.70, y:1.80, w:11.0, h:2.0,
    fontFace:FONT, fontSize:48, bold:true, color:C.white,
    lineSpacingMultiple:1.1, charSpacing:-1, align:"center",
  });

  const verbs = [
    { v:"계측한다",   d:"어디서 얼마나 걸리는가" },
    { v:"분리한다",   d:"처리·전파·저장 단계부터" },
    { v:"보장한다",   d:"graceful shutdown, 정합성" },
  ];
  verbs.forEach((vb, i) => {
    sld.addShape(pres.ShapeType.roundRect, {
      x:1.2 + i * 3.85, y:3.95, w:3.3, h:1.0,
      fill:{ color:C.dark, transparency:70 },
      line:{ color:C.brandT3, width:1 },
      rectRadius:0.12,
    });
    sld.addText(vb.v, {
      x:1.2 + i * 3.85, y:4.05, w:3.3, h:0.38,
      fontFace:FONT, fontSize:16, bold:true, color:C.white, align:"center",
    });
    sld.addText(vb.d, {
      x:1.2 + i * 3.85, y:4.45, w:3.3, h:0.30,
      fontFace:FONT, fontSize:10, color:C.brandLight, align:"center",
    });
  });

  sld.addText("yoonpyo  ·  cgantro@gmail.com  ·  광운대학교  ·  정보처리기사  ·  OPIc IH", {
    x:0.70, y:5.80, w:12.0, h:0.35,
    fontFace:FONT, fontSize:10, color:C.brandLight, align:"center",
  });

  sld.addText("10", {
    x:12.45, y:6.85, w:0.47, h:0.30,
    fontFace:FONT, fontSize:8, color:C.caption, align:"right", valign:"middle",
  });
}

// ─── Output ────────────────────────────────────────────────────────────────────
pres.writeFile({ fileName:"yoonpyo-portfolio.pptx" })
  .then(() => console.log("✅  yoonpyo-portfolio.pptx 생성 완료"))
  .catch(e => console.error("❌  에러:", e));
