# Charts — pptxgenjs 차트 옵션과 코드 패턴

`build-helpers.js`의 `chartOpts()` 헬퍼가 universal options을 반환하지만,
차트 타입별로 추가 옵션과 컬러 정책이 다릅니다. 이 파일은 차트 코드를
짤 때 펼쳐서 사용합니다.

## 1. Universal options (모든 차트 공통)

```javascript
// build-helpers.js의 chartOpts() 호출
const opts = H.chartOpts({
  chartColors: [C.brand],   // 컬러는 override
  // 차트별 추가 옵션
});
```

`chartOpts()`가 자동 적용하는 항목:

- `chartArea.fill = white`, border 없음
- `plotArea.fill = white`
- `catAxisLabelColor = ink (222222)`, `valAxisLabelColor = mute (45515E)`
- 폰트 `Pretendard`, 카테고리 11pt, 값 9pt
- `valGridLine = border (E5E7EB)` 0.5pt 실선
- `catGridLine = none`
- `showLegend = false` (대부분 단일 시리즈)
- 데이터 라벨 `Pretendard` 10pt Bold
- 기본 `chartColors = [brand]`

---

## 2. 컬러 정책 (블루 + 그레이 모노크롬)

```javascript
// 단일 시리즈
chartColors: [C.brand]

// 2 시리즈 (강조 vs 비교)
chartColors: [C.brand, C.mute]

// 2 시리즈 (before vs after)
chartColors: [C.caption, C.brand]   // before가 약, after가 강

// 3~4 시리즈 (위계)
chartColors: [C.brandT1, C.brandT2, C.brandT3, C.brandT4]

// 3~4 시리즈 (구분 — 위계 없음)
chartColors: [C.brand, C.mute, C.caption, C.brandT3]

// 상승/하락 표시
chartColors: [C.brand, C.mute]      // 양수=brand, 음수=mute

// 5단계+ (드물게)
chartColors: [C.brandDeep, C.brand, C.brandT2, C.brandT3, C.brandT4]
```

**절대 금지**: 무지개·녹색·핑크·주황·빨강 어떤 변형도 사용 금지.
빌드 후 `color-grep.sh`가 자동 검출.

---

## 3. Bar Chart (가로 막대) — Cat 2

가장 자주 쓰는 차트. 항목 ≤ 8개일 때.

```javascript
const dataBar = [{
  name: "점유율",
  labels: ["미국", "중국", "독일", "일본", "영국"],
  values: [25, 18, 12, 10, 8],
}];

s.addChart(pres.charts.BAR, dataBar, {
  ...H.chartOpts({ chartColors: [C.brand] }),
  x: 0.622, y: 2.40, w: 12.09, h: 3.55,
  barDir: "bar",                    // 가로
  barGapWidthPct: 50,
  showValue: true,
  dataLabelPosition: "outEnd",
  dataLabelColor: C.ink,
  valAxisHidden: true,              // 값 축 숨김 (라벨이 대체)
  catAxisLabelFontSize: 11,
});
```

**규칙**:
- 가로 막대는 데이터 자체를 오름차순/내림차순 정렬 후 입력 (자동 정렬 없음)
- 항목명이 길면 가로 막대 (세로 막대는 라벨 회전 발생)
- 강조 항목 1개만 다른 색? → 다중 시리즈로 분리 (`null` 활용)

```javascript
// 미국만 강조하고 싶을 때
const dataEmphasis = [
  { name: "미국", labels: ["미국","중국","독일"], values: [25, null, null] },
  { name: "기타", labels: ["미국","중국","독일"], values: [null, 18, 12] },
];
// chartColors: [C.brand, C.caption]
```

---

## 4. Column Chart (세로 막대) — Cat 2

항목 > 8개이거나 시간 순서일 때.

```javascript
s.addChart(pres.charts.BAR, data, {
  ...H.chartOpts({ chartColors: [C.brand] }),
  x: 0.622, y: 2.40, w: 12.09, h: 3.55,
  barDir: "col",                    // 세로
  barGapWidthPct: 40,
  showValue: true,
  dataLabelPosition: "outEnd",
  catAxisLabelRotate: 0,            // 회전 금지 (라벨 회전은 슬롭 신호)
});
```

라벨이 회전돼야 한다면 가로 막대로 전환.

---

## 5. Line Chart — Cat 3 (시계열)

```javascript
const dataLine = [{
  name: "매출",
  labels: ["2020","2021","2022","2023","2024","2025"],
  values: [100, 118, 135, 162, 195, 240],
}];

s.addChart(pres.charts.LINE, dataLine, {
  ...H.chartOpts({ chartColors: [C.brand] }),
  x: 0.622, y: 2.40, w: 12.09, h: 3.55,
  lineSize: 2.5,
  lineDataSymbol: "circle",
  lineDataSymbolSize: 7,
  lineDataSymbolLineSize: 0,
  showValue: true,
  dataLabelPosition: "t",
  dataLabelColor: C.ink,
});
```

다변수 비교 시 → Slope Chart 또는 Bump Chart 검토 (Line 시리즈 4개 초과면 가독성 급락).

---

## 6. Area Chart — Cat 3 (누적 추이)

```javascript
s.addChart(pres.charts.AREA, data, {
  ...H.chartOpts({ chartColors: [C.brand] }),
  x: 0.622, y: 2.40, w: 12.09, h: 3.55,
  lineSize: 1.5,
  // Area는 fill opacity가 자동 — chartColors만 신경
});
```

Stacked Area는 시리즈 4개 이하 권장.

---

## 7. Doughnut / Pie — Cat 4 (구성)

```javascript
// 항목 3개 이하만 사용. 그 이상은 100% Stacked Bar로 전환.
const dataDonut = [{
  name: "점유율",
  labels: ["당사","경쟁A","기타"],
  values: [42, 33, 25],
}];

s.addChart(pres.charts.DOUGHNUT, dataDonut, {
  ...H.chartOpts({ chartColors: [C.brand, C.mute, C.caption] }),
  x: 4.0, y: 2.50, w: 5.5, h: 3.30,
  holeSize: 60,                     // 도넛 구멍 크기 (%)
  showValue: true,
  dataLabelFormatCode: "0%",
  dataLabelPosition: "outEnd",
  dataLabelColor: C.ink,
});
```

**규칙**: pie/doughnut은 **5조각 이상 절대 금지** — 슬롭 신호.

---

## 8. Stacked Bar (100%) — Cat 4 (구성, 항목 > 3)

```javascript
const dataStacked = [
  { name: "당사",   labels: ["2023","2024","2025"], values: [30, 38, 42] },
  { name: "경쟁A", labels: ["2023","2024","2025"], values: [40, 35, 33] },
  { name: "경쟁B", labels: ["2023","2024","2025"], values: [20, 18, 16] },
  { name: "기타",   labels: ["2023","2024","2025"], values: [10, 9, 9] },
];

s.addChart(pres.charts.BAR, dataStacked, {
  ...H.chartOpts({
    chartColors: [C.brand, C.brandT2, C.brandT3, C.brandT4],
  }),
  x: 0.622, y: 2.40, w: 12.09, h: 3.55,
  barDir: "bar",
  barGrouping: "percentStacked",    // 100% 스택
  showValue: false,                 // 값 표시 시 복잡 — 라벨로 따로
  showLegend: true,
  legendPos: "b",
  legendFontFace: FONT,
  legendFontSize: 9,
  legendColor: C.mute,
});
```

---

## 9. Waterfall / Bridge Chart — Cat 2

pptxgenjs는 native waterfall이 없어 stacked bar로 시뮬레이션.

```javascript
// 시작 100 → +30 → -15 → +20 → 끝 135
// 가시 막대(visible)와 보이지 않는 받침(invisible)으로 분리
const dataWF = [
  { name: "invisible", labels: ["시작","+영업","+마케팅","-운영","끝"],
    values: [0, 100, 115, 130, 0] },
  { name: "visible", labels: ["시작","+영업","+마케팅","-운영","끝"],
    values: [100, 30, 20, -15, 135] },
];

s.addChart(pres.charts.BAR, dataWF, {
  ...H.chartOpts({ chartColors: ["FFFFFF", C.brand] }),  // invisible은 흰색
  x: 0.622, y: 2.40, w: 12.09, h: 3.55,
  barDir: "col",
  barGrouping: "stacked",
  showValue: false,
});
```

음수 막대는 별도 시리즈로 분리하고 색을 `mute`로 override.

---

## 10. Scatter Plot — Cat 5 (관계)

```javascript
const dataScatter = [{
  name: "Series",
  values: [
    { x: 12, y: 45 }, { x: 8, y: 32 }, { x: 15, y: 58 },
    // ...
  ],
}];

s.addChart(pres.charts.SCATTER, dataScatter, {
  ...H.chartOpts({ chartColors: [C.brand] }),
  x: 0.622, y: 2.40, w: 12.09, h: 3.55,
  lineSize: 0,                      // 점만 (라인 없음)
  lineDataSymbol: "circle",
  lineDataSymbolSize: 9,
});
```

**규칙**: 라벨이 5개 이상이면 anti-collision + leader line 직접 그려야 함
(pptxgenjs 자동 X). `diagram-library.md` 참조.

---

## 11. Radar Chart — Cat 2 (다차원 비교)

```javascript
const dataRadar = [
  { name: "당사",   labels: ["디자인","속도","가격","서비스","품질"],
    values: [4, 5, 3, 4, 5] },
  { name: "경쟁A", labels: ["디자인","속도","가격","서비스","품질"],
    values: [3, 3, 5, 3, 3] },
];

s.addChart(pres.charts.RADAR, dataRadar, {
  ...H.chartOpts({ chartColors: [C.brand, C.mute] }),
  x: 2.5, y: 2.40, w: 8.0, h: 3.55,
  radarStyle: "marker",
  lineSize: 2,
  showLegend: true,
  legendPos: "b",
});
```

축 5~7개가 적정. 4개 이하면 Bullet Chart, 8개 이상이면 Heatmap 검토.

---

## 12. 차트 결정 빠른 체크

| 메시지                | 차트                       | Cat |
| --------------------- | -------------------------- | --- |
| 항목 ≤ 8 비교        | Bar (가로)                 | 2   |
| 항목 > 8 비교         | Column (세로) or Heatmap   | 2/4 |
| 다차원 비교 (5축)     | Radar                      | 2   |
| 시간 추이 단일 변수   | Line                       | 3   |
| 시간 추이 다변수      | Slope or Bump              | 3   |
| 누적 시간 추이        | Area                       | 3   |
| 구성 비율 ≤ 3 항목   | Doughnut                   | 4   |
| 구성 비율 > 3 항목    | 100% Stacked Bar           | 4   |
| 변화량 분해           | Waterfall                  | 2   |
| 두 변수 관계          | Scatter                    | 5   |
| 카테고리 강도 분포    | Heatmap (shape로 직접)     | 4   |

자세한 100+ 매트릭스는 `message-mapping.md` 참조.

---

## 13. 차트 작업 시 자주 하는 실수

1. **자동 컬러 사용** — pptxgenjs 기본 컬러는 무지개 → `chartColors` 항상 명시
2. **legend 켠 채로 단일 시리즈** — `showLegend: false` 명시
3. **데이터 정렬 안 함** — 가로 막대는 데이터 자체를 정렬
4. **데이터 라벨 회전** — 회전 라벨은 슬롭 신호, 차트 방향 바꾸기
5. **gridline 진하게** — `valGridLine` 0.5pt 이상 금지
6. **plot area 배경 다른 색** — 항상 white로
7. **chartArea border 노출** — `border: { pt: 0 }` 명시
8. **chartColors 객체 재사용** — 매번 새 배열 (mutation 방지)
9. **데이터 라벨 폰트 미지정** — `dataLabelFontFace = "Pretendard"`
10. **0pt 막대 라벨 표시** — null/undefined 처리해서 숨김
