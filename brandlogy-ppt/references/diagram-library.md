# Diagram Library — Shape 기반 다이어그램 좌표·헬퍼

pptxgenjs는 native 다이어그램이 없으므로 Shape + Line + Text 조합으로
직접 그립니다. 이 파일은 14가지 다이어그램 타입의 좌표 사양과 코드
패턴을 모았습니다.

## 0. 공통 규칙

**한 슬라이드 = 다이어그램 1개**. 두 개 이상은 슬롭 신호 (`§14-G` 룰).

**노드 색상 위계**:
```
강조 노드 (키 단계):     brandT1 (4F6EF1) — fill, white text
보통 노드:               white fill, brand line 1pt, ink text
배경 노드 (보조):        brandT4 (DDE3FB) fill, mute text
약 노드:                 surface (FAFAFA), caption text
```

**노드 라벨 글자 수**:
- 노드 너비 ≤ 1.5" → 8자 이내
- 노드 너비 ≤ 2.0" → 12자 이내
- 노드 너비 > 2.0" → 자유 (단, wrap 발생 시 폰트 -1pt)

**화살표·연결선**:
- 색상: `brand` 1~1.25pt 또는 `mute` 0.75pt (약 연결)
- 끝 화살표: `endArrowType: "triangle"`
- L자(엘보) 연결은 두 LINE으로 분리 (pptxgenjs 자동 라우팅 X)

---

## 1. Flowchart (BPMN-light) — Cat 6

영역: 분할 박스 안 padding 0.20 차감 후 사용 (Pattern 1 기준 x=0.622~12.712).

### 노드 타입

| 타입       | Shape              | Fill        | Line          | Radius     | 용도              |
| ---------- | ------------------ | ----------- | ------------- | ---------- | ----------------- |
| Start/End  | OVAL               | brandT3     | brand 1pt     | -          | 시작·종료         |
| Process    | ROUNDED_RECTANGLE  | white       | brand 1pt     | 0.10       | 일반 작업         |
| Decision   | RHOMBUS            | brandPale   | brand 1.2pt   | -          | 분기 (Yes/No)     |
| Subprocess | RECTANGLE          | white       | brand 1pt 이중| -          | 하위 프로세스     |
| Data/IO    | PARALLELOGRAM      | brandT4     | mute 0.75pt   | -          | 데이터 입출력     |

### 좌표 사양

```
노드 크기: w=1.6, h=0.65 (가로 흐름)
        또는 w=2.0, h=0.60 (긴 라벨)
간격: 가로 0.35", 세로 0.20"
화살표 길이: 0.35" (간격과 동일)
```

### 코드 패턴

```javascript
// Process 노드
s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.62, y: 3.50, w: 1.6, h: 0.65,
  fill: { color: C.white },
  line: { color: C.brand, width: 1 },
  rectRadius: 0.10,
});
s.addText("요구 분석", {
  x: 0.62, y: 3.50, w: 1.6, h: 0.65,
  fontFace: FONT, fontSize: 10, bold: true,
  color: C.ink, align: "center", valign: "middle", margin: 0,
});

// 화살표 (수평)
s.addShape(pres.shapes.LINE, {
  x: 2.22, y: 3.825, w: 0.35, h: 0,
  line: { color: C.brand, width: 1.25, endArrowType: "triangle" },
});

// Decision (다이아몬드)
s.addShape(pres.shapes.RHOMBUS, {
  x: 5.50, y: 3.40, w: 1.4, h: 0.85,
  fill: { color: C.brandPale },
  line: { color: C.brand, width: 1.2 },
});
s.addText("승인?", {
  x: 5.50, y: 3.40, w: 1.4, h: 0.85,
  fontFace: FONT, fontSize: 10, bold: true,
  color: C.brand, align: "center", valign: "middle", margin: 0,
});
```

---

## 2. Cycle Diagram (순환) — Cat 3/6

```
중심: cx=6.666, cy=4.05
반지름: r=1.5" (4단계) / r=1.7" (6단계) / r=1.85" (8단계)
노드 위치: angle = 360°/n × i + (-90°)   ← -90°로 12시 시작
```

```javascript
// 4단계 순환
const n = 4, r = 1.5, cx = 6.666, cy = 4.05;
const labels = ["계획", "실행", "측정", "개선"];

labels.forEach((label, i) => {
  const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
  const x = cx + r * Math.cos(angle) - 0.75;   // 노드 w=1.5
  const y = cy + r * Math.sin(angle) - 0.30;   // 노드 h=0.60

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 1.5, h: 0.6,
    fill: { color: i === 0 ? C.brand : C.white },
    line: { color: C.brand, width: 1 },
    rectRadius: 0.30,                          // 둥글게
  });
  s.addText(label, {
    x, y, w: 1.5, h: 0.6,
    fontFace: FONT, fontSize: 10, bold: true,
    color: i === 0 ? C.white : C.ink,
    align: "center", valign: "middle", margin: 0,
  });
});

// 곡선 화살표는 CURVED_CONNECTOR 사용 (또는 OVAL 가이드 + LINE)
```

---

## 3. Hub & Spoke — Cat 5/7

중심 노드 + 둘레 6~8개 노드.

```
중심 노드:  x=5.665, y=3.55, w=2.0, h=1.5
spoke r=2.05" (콘텐츠 max y 6.05 안 들어옴)
spoke 노드: w=1.7, h=0.65
```

```javascript
// 중심 (브랜드 강조)
s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 5.665, y: 3.55, w: 2.0, h: 1.5,
  fill: { color: C.brand },
  line: { type: "none" },
  rectRadius: 0.15,
  shadow: H.sBrandGlow(),
});
s.addText("Brandlogy", {
  x: 5.665, y: 3.55, w: 2.0, h: 1.5,
  fontFace: FONT, fontSize: 14, bold: true,
  color: C.white, align: "center", valign: "middle", margin: 0,
});

// 6개 spoke
const n = 6, r = 2.05, cx = 6.666, cy = 4.30;
const spokes = ["고객","파트너","채널","제품","팀","데이터"];

spokes.forEach((label, i) => {
  const angle = (Math.PI * 2 / n) * i - Math.PI / 2;
  const x = cx + r * Math.cos(angle) - 0.85;
  const y = cy + r * Math.sin(angle) - 0.325;

  // 라인 (중심 → spoke)
  s.addShape(pres.shapes.LINE, {
    x: cx - 0.01, y: cy - 0.01, w: x + 0.85 - cx, h: y + 0.325 - cy,
    line: { color: C.brandT3, width: 1 },
  });
  // spoke 노드
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w: 1.7, h: 0.65,
    fill: { color: C.white },
    line: { color: C.brand, width: 1 },
    rectRadius: 0.10,
  });
  s.addText(label, {
    x, y, w: 1.7, h: 0.65,
    fontFace: FONT, fontSize: 10, bold: true,
    color: C.ink, align: "center", valign: "middle", margin: 0,
  });
});
```

---

## 4. Org Chart / Tree — Cat 7

```
Root:    x=5.665, y=2.45, w=2.0, h=0.6
Level 1: y=3.35, 자식 균등 분포
Level 2: y=4.25
Level 3: y=5.15 (max y 5.85 — Box 안 5.85 한계)
```

레벨 4 이상은 슬라이드 분할 또는 Hierarchy Chart로 전환.

---

## 5. Pyramid — Cat 1

`pptxgenjs`는 진짜 trapezoid 미지원 → RECTANGLE의 `wRatio` 점진 변화로
시뮬레이션.

```javascript
// 3단 피라미드
const layers = [
  { label: "Vision",   wRatio: 0.40, color: C.brand,    y: 2.45 },
  { label: "Strategy", wRatio: 0.65, color: C.brandT2, y: 3.40 },
  { label: "Tactics",  wRatio: 0.95, color: C.brandT3, y: 4.35 },
];

layers.forEach((L) => {
  const w = 12.09 * L.wRatio;
  const x = 0.622 + (12.09 - w) / 2;   // 중앙 정렬

  s.addShape(pres.shapes.RECTANGLE, {
    x, y: L.y, w, h: 0.85,
    fill: { color: L.color },
    line: { type: "none" },
  });
  s.addText(L.label, {
    x, y: L.y, w, h: 0.85,
    fontFace: FONT, fontSize: 14, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });
});
```

5단 피라미드: wRatio = `[0.30, 0.45, 0.60, 0.80, 1.00]`.

---

## 6. Funnel (깔때기) — Cat 6

피라미드와 동일 원리, 단 위→아래 wRatio 증가가 아니라 **감소** (전환 분해).

```
5단계 wRatio: [1.0, 0.85, 0.65, 0.45, 0.30]
영역: x=0.622, y=2.45, w=12.09, h=3.55
```

각 단계마다 단계명 + 숫자 + % 라벨을 우측에 따로 표시 권장.

---

## 7. Heatmap — Cat 4

```
셀 그리드: rows × cols
영역: x=2.0, y=2.45, w=10.0, h=2.85 (셀 끝 y ≤ 5.30)
범례: y=5.40 ~ 5.65 (max y 5.50)
셀 크기: w = (10.0 - rowLabelW) / cols
        h = 2.85 / rows
```

```javascript
// 5x5 Heatmap
const rows = ["A","B","C","D","E"];
const cols = ["Q1","Q2","Q3","Q4","Q5"];
const data = [[0.2,0.5,0.8,0.3,0.6], /* ... */];

const tints = [C.brandT4, C.brandT3, C.brandT2, C.brand, C.brandDeep];
const rowLabelW = 1.2;
const cellW = (10.0 - rowLabelW) / cols.length;
const cellH = 2.85 / rows.length;

rows.forEach((r, ri) => {
  // 행 라벨
  s.addText(r, {
    x: 2.0, y: 2.45 + ri * cellH, w: rowLabelW, h: cellH,
    fontFace: FONT, fontSize: 10, bold: true,
    color: C.mute, align: "left", valign: "middle", margin: 0,
  });
  cols.forEach((c, ci) => {
    const v = data[ri][ci];
    const tintIdx = Math.min(Math.floor(v * 5), 4);

    s.addShape(pres.shapes.RECTANGLE, {
      x: 2.0 + rowLabelW + ci * cellW,
      y: 2.45 + ri * cellH,
      w: cellW - 0.04, h: cellH - 0.04,
      fill: { color: tints[tintIdx] },
      line: { type: "none" },
    });
    s.addText((v * 100).toFixed(0), {
      x: 2.0 + rowLabelW + ci * cellW,
      y: 2.45 + ri * cellH,
      w: cellW, h: cellH,
      fontFace: FONT, fontSize: 9, bold: true,
      color: v > 0.5 ? C.white : C.ink,
      align: "center", valign: "middle", margin: 0,
    });
  });
});
```

---

## 8. 2x2 Matrix / Quadrant — Cat 1/4

```
영역: x=2.0, y=2.45, w=9.33, h=3.30
중심: (6.665, 4.10)
```

축 선:
- 수평: y=4.10, x=2.0~11.33, brand 1pt
- 수직: x=6.665, y=2.45~5.75, brand 1pt
- 화살촉 끝 (오른쪽·위쪽)

분면 라벨: 각 사분면 안쪽 코너에 9pt caps charSpacing 2.

데이터 점: 위치 + 라벨. 라벨 5개 이상이면 anti-collision 필수.

---

## 9. Swimlane — Cat 6

```
영역: x=0.622, y=2.45, w=12.09, h=3.55
Lane 3~5개. 좌측 라벨 영역 w=1.2.
각 lane height: (3.55 - 0.10*(N-1)) / N
```

라벨 영역: `fill: surface2, color: mute`.
Lane 본문: `fill: white, line: containerLine`.

---

## 10. Customer Journey Map — Cat 3

```
단계 strip: y=2.45, h=0.40 (5~7 단계 가로 배치)
행동:       y=2.90, h=1.20
터치포인트: y=4.20, h=0.65
감정 라인:  y=4.95~5.85 (라인 차트로 그리거나 Shape로 그리기)
```

감정 라인은 5단계 ↑/→/↓ 화살표 + 점수 (만족=brand, 중립=caption, 불만=mute).

---

## 11. Timeline — Cat 3

```
중심선: y=4.05, x=0.62 ~ 12.71 (brand 1.5pt)
milestone: OVAL w=h=0.20", fill=brand
라벨: 위·아래 교대 (z 패턴)
  위 라벨: y=3.50, fontSize 11, bold
  아래 라벨: y=4.30, fontSize 10
```

---

## 12. Layered Architecture — Cat 7

```
영역: x=0.622, y=2.45, w=12.09, h=3.55
4~6 레이어. 각 레이어 height = (3.55 - 0.08*(N-1)) / N
위→아래 진하기: brand → brandT2 → brandT3 → brandT4
```

라벨: 좌측 안쪽 0.20 padding, 14pt Bold, white (밝은 layer는 ink).

---

## 13. Fishbone (이시카와) — Cat 5

```
중심선:   x=0.622 ~ 10.8, y=4.20 (brand 2pt)
결과 박스: x=10.8, y=3.85, w=1.85, h=0.7 (brand fill, white text)
가지 (6개): 3 위 + 3 아래
  위 가지:  y=2.60~4.10 (60도 각)
  아래 가지: y=4.30~5.80
```

각 가지 끝에 카테고리 라벨 (Bold), 가지 위에 sub-cause 작은 라벨.

---

## 14. SWOT — Cat 1 (모노크롬)

```
2x2 박스 배치. Box Pattern 4 활용 가능.
S (Strengths):     좌상  fill=brandPale,  아이콘=brand
W (Weaknesses):    우상  fill=surface2,   아이콘=mute
O (Opportunities): 좌하  fill=brandT4,    아이콘=brand
T (Threats):       우하  fill=surface2,   아이콘=mute
```

핑크·녹색 금지 — 강·약은 채도(brand 계열) vs 무채도(surface2)로 표현.

---

## 15. 코드 헬퍼 패턴 — Node Factory

자주 쓰는 노드 생성을 함수로 묶어 두면 일관성 유지에 좋습니다.

```javascript
// scripts/build-helpers.js에 추가하거나 빌드 스크립트 내 정의

function node(s, pres, opts) {
  const {
    x, y, w = 1.6, h = 0.65,
    label,
    variant = "process",   // process | start | decision | data | emphasis
  } = opts;

  const styles = {
    process:   { shape: "ROUNDED_RECTANGLE", fill: C.white,    line: C.brand,   lw: 1,   r: 0.10, color: C.ink   },
    start:     { shape: "OVAL",              fill: C.brandT3,  line: C.brand,   lw: 1,             color: C.ink   },
    decision:  { shape: "RHOMBUS",           fill: C.brandPale, line: C.brand,  lw: 1.2,           color: C.brand },
    data:      { shape: "PARALLELOGRAM",     fill: C.brandT4,  line: C.mute,    lw: 0.75,          color: C.ink   },
    emphasis:  { shape: "ROUNDED_RECTANGLE", fill: C.brand,    line: "none",    lw: 0,   r: 0.10, color: C.white },
  };
  const st = styles[variant];

  s.addShape(pres.shapes[st.shape], {
    x, y, w, h,
    fill: { color: st.fill },
    line: st.line === "none" ? { type: "none" } : { color: st.line, width: st.lw },
    ...(st.r != null ? { rectRadius: st.r } : {}),
    shadow: variant === "emphasis" ? H.sBrandGlow() : undefined,
  });

  if (label) {
    s.addText(label, {
      x, y, w, h,
      fontFace: FONT, fontSize: 10, bold: true,
      color: st.color, align: "center", valign: "middle", margin: 0,
    });
  }
}

function arrow(s, pres, x1, y1, x2, y2, opts = {}) {
  const w = x2 - x1, h = y2 - y1;
  s.addShape(pres.shapes.LINE, {
    x: x1, y: y1, w, h,
    line: {
      color: opts.color || C.brand,
      width: opts.width || 1.25,
      endArrowType: opts.end !== false ? "triangle" : "none",
      beginArrowType: opts.begin ? "triangle" : "none",
    },
  });
}
```

---

## 16. 다이어그램 사용 금지 신호 (AI Slop)

- 한 슬라이드에 다이어그램 2개 이상 배치
- 노드 12개 초과 (어떤 다이어그램이든)
- 엣지·화살표 25개 초과
- 무지개 색상 (브랜드 팔레트 외)
- 의미 없는 장식 화살표
- "SmartArt 룩" 흉내 (톱니바퀴, 라이트닝볼트, 3D)
- 노드 사이 간격 < 0.20"
- 노드 텍스트 wrap된 채 잘림
- 다이어그램 안 5종 이상 도형 혼용 (3종 권장)
- 곡선 화살표 과용 (직선 우선, 곡선은 cycle/loop만)
- 모든 노드 동일 색상 (강조 없음 = 위계 없음)
- 다이어그램이 슬라이드 경계 침범 (max y 6.05 침범)
- 화살표 끝과 노드 라벨 겹침

---

## 17. 결정 휴리스틱

| "어떻게 작동하는가?"          | Flowchart, BPMN              |
| "왜 이런 결과인가?"           | Fishbone, Causal Loop        |
| "구성 요소는 무엇인가?"       | Tree, Block, Layered, Org    |
| "어디에 위치하는가?"          | 2x2, Positioning, Quadrant   |
| "언제 무엇을 하는가?"         | Timeline, Gantt, Roadmap     |
| "고객·이해관계자는 어떻게?"   | Journey Map, Stakeholder Map |
| "얼마나 큰가? 어떻게 분포?"   | Heatmap, Treemap (Cat 4)     |
| "어떻게 흐르는가?"            | Sankey, Funnel, DFD          |
| "어떻게 연결돼 있는가?"       | Network, Hub&Spoke, Venn     |

자세한 100+ 행 매트릭스는 `message-mapping.md`.
