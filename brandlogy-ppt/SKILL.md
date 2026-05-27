---
name: brandlogy-ppt
description: "Brandlogy 브랜드 PPT 데크를 v11 디자인 시스템(Box System + 모노크롬 블루-그레이 + McKinsey storytelling)으로 빌드·수정·QA합니다. 사용자가 슬라이드, 덱, .pptx, 프레젠테이션, PPT 만들기, 기존 pptx 수정, 슬라이드 시각 검수 같은 표현을 쓰거나 한국어로 '데크 만들어줘', '슬라이드 짜줘', '발표자료', '제안서 PPT' 같은 요청을 할 때 무조건 이 스킬을 사용하세요. Brandlogy 외 일반 PPT 작업에서도 한국어 비즈니스 데크라면 이 시스템을 기본 적용합니다. pptxgenjs + sharp + LibreOffice 파이프라인 기반."
---

# Brandlogy PPT Design System v11

Brandlogy 브랜드와 페이퍼로지/와이즈라이온스타즈 산하 모든 데크의 표준
빌드 시스템입니다. v11은 Box System(7가지 분할 패턴) + 모노크롬 블루-그레이
컬러 + McKinsey 액션타이틀 + 한국어 타이포 디테일을 결합합니다.

## 1. When to use this skill

- 신규 데크를 처음부터 빌드 (Ghost Deck → 코드 → pptx)
- 기존 .pptx 수정·재빌드 (시각 오류 패치, 슬라이드 추가)
- 빌드된 데크 시각 QA (PDF·JPG 추출 후 검수)
- 데크 디자인 시스템·컬러·좌표 관련 질문 답변

## 2. Absolute rules — 위반 시 빌드 중단

이 규칙들을 어기면 데크가 망가지거나 Brandlogy 정체성이 사라집니다.

**컬러 정책**
- 블루 스케일(`brand` 4F6EF1 계열) + 그레이 스케일(`mute`, `caption` 등)만 사용
- 핑크(ea5ec1, FFEAF6 변형), 녹색(16a34a, 22c55e), 주황·빨강·노랑·보라 절대 금지
- 시멘틱: 상승·긍정 = `brand`/`brandDeep`, 하락·부정 = `mute`/`caption`
- 빌드 후 `scripts/color-grep.sh`로 자동 검출. 발견 시 재빌드.

**Hex 표기**
- 6자리만, `#` 접두사 없이 (예: `"4F6EF1"`)
- 8자리 알파 hex 금지 — 파일 손상 원인
- 투명도는 `opacity`/`transparency` 속성으로 처리

**좌표 강제**
- 슬라이드: 13.333" × 7.5" (`defineLayout` 명시 등록)
- 콘텐츠 max y ≤ 6.05 (위반 시 SO WHAT과 충돌)
- SO WHAT: y=6.20, Bottom Strip: y=6.85 고정
- 모든 본문 슬라이드에 Box System 적용 (표지 제외)

**헤드라인 한 줄 원칙**
- 헤드라인은 무조건 한 줄. 두 줄이 되면 자간 -0.5~-1로 압축
- Action Title 의무 — "사실 진술" 금지, "결론·인사이트"만 (§3 참조)

**pptxgenjs 안전**
- `addText`/`addShape` options 객체 재사용 금지 (in-place mutation 버그)
- shadow는 factory 함수로 호출마다 새 객체 생성
- 텍스트에 Unicode `•` 직접 삽입 금지 — `{bullet: true}` 또는 `{bullet: {code: "25CF"}}`

## 3. Action Title 원칙 (모든 헤드라인 의무)

헤드라인이 "사실"이면 데크 전체가 통째로 AI slop으로 보입니다.
"이게 So What?"에 답하는 결론만 헤드라인에 씁니다.

```
❌ "글로벌 출판 시장 매출"             (사실 진술 — 슬롭)
✅ "미국이 글로벌 25% 점유, 중국과 격차 1.4배"  (결론)

❌ "MZ 세대 소비 패턴 분석"
✅ "MZ는 가격이 아니라 '서사'에 지갑을 연다"
```

자세한 작성법·SCR·Pyramid Principle은 `references/storytelling.md` 참조.

## 4. Build workflow — 5단계 고정 시퀀스

### Phase 1: Ghost Deck (코드 작성 전 필수)
1. 핵심 질문 정의 + Pyramid (Governing Thought + Key Line 3)
2. 슬라이드별 Action Title 텍스트만 먼저 완성
3. 슬라이드 9~12장 표준. 그 이상이면 모듈 분할.

### Phase 2: 시각화·Box 매핑
4. 메시지 → 시각화 매핑 (`references/message-mapping.md` 참조 — 100+ 행 매트릭스)
5. 슬라이드별 Box 분할 패턴 결정 (`references/box-system.md` — 7가지 패턴)
6. 다양성 룰 검증: 카테고리 6종 이상, 동일 차트 4회 이상 반복 금지

### Phase 3: 빌드
7. `scripts/build-helpers.js` import — `box()`, `bodySlide1~7()`, `addHeader()`, `addSoWhat()`, `addBottomStrip()` 헬퍼 사용
8. pptxgenjs 빌드 실행

### Phase 4: 변환·검수
9. `scripts/build-pipeline.sh` 실행 — pptx → pdf → jpg 추출 3단계
10. JPG 슬라이드 시각 검수

### Phase 5: QA
11. `references/qa-checklist.md` 60항목 점검
12. `references/polish-checklist.md` 32항목 미세조정
13. 컬러 grep 자동 검사

## 5. Core constants — 절대 변경 금지

이 상수들은 모든 빌드에서 동일하게 사용됩니다. 변경하면 데크 일관성이 깨집니다.

```javascript
const FONT = "Pretendard";
const FONT_M = "Pretendard Medium";

const C = {
  // Brand (블루 스케일)
  brand: "4F6EF1", brandDeep: "0014D3",
  brandLight: "A8B7F8", brandPale: "F8F9FF",
  brandT1: "4F6EF1", brandT2: "7E94F5",
  brandT3: "A8B7F8", brandT4: "DDE3FB",
  // Neutral (그레이 스케일)
  black: "000000", ink: "222222", text: "404040",
  mute: "45515E", caption: "8E8E93", source: "5F5F5F",
  // Surface
  white: "FFFFFF", surface: "FAFAFA",
  surface2: "F0F0F0", surface3: "F2F3F5",
  border: "E5E7EB", containerLine: "EDEEF0",
  dark: "181E25",
};

// Shadow factory (재사용 금지 — 매번 새 객체)
const sStandard  = () => ({ type: "outer", color: "000000", blur: 6,  offset: 2, angle: 90, opacity: 0.08 });
const sBrandGlow = () => ({ type: "outer", color: "4F6EF1", blur: 15, offset: 0, angle: 90, opacity: 0.20 });
const sContainer = () => ({ type: "outer", color: "000000", blur: 12, offset: 2, angle: 90, opacity: 0.05 });
```

## 6. Standard coordinates — 좌표 치트시트

### 헤더 영역
```
Chapter Strip:  x=0.422  y=0.306  w=5.5     h=0.269   10pt brand
Logo:           x=11.30  y=0.28   w=1.55    h=0.55
Headline:       x=0.422  y=0.851  w=12.262  h=0.505   24pt black, charSpacing -0.5
Subtitle:       x=0.422  y=1.472  w=12.262  h=0.303   12pt text
```

### Box System (본문 영역)
```
부모 영역:      x=0.422  y=2.20   w=12.49   h=3.85
공통 styling:   fill=white, line=EDEEF0 1pt
                rectRadius=0.18 (큰) / 0.14 (작은 = 4분할)
                shadow blur=12 offset=2 opacity=0.05
가로 gap=0.20", 세로 gap=0.15", 박스 안 padding=0.20"
```

### 7가지 Box 패턴 좌표
```
P1 단일:      x=0.422 y=2.20 w=12.49  h=3.85
P2L 좌우:     L: x=0.422 w=6.145   R: x=6.767 w=6.145   h=3.85
P2H 상하:     T: y=2.20  h=1.85    B: y=4.20  h=1.85    w=12.49
P3 3분할:     L:0.422  M:4.645  R:8.868   w=4.043 h=3.85
P4 2x2:       TL/BL: x=0.422 / TR/BR: x=6.767   w=6.145 h=1.85
              T: y=2.20 / B: y=4.20   rectRadius=0.14
P5 5:7:       L: x=0.422 w=4.95   R: x=5.572 w=7.34    h=3.85
P6 7:5:       L: x=0.422 w=7.34   R: x=7.962 w=4.95    h=3.85
P7 혼합:      L: x=0.422 w=7.34 h=3.85
              TR: x=7.962 y=2.20 w=4.95 h=1.85
              BR: x=7.962 y=4.20 w=4.95 h=1.85
```

자세한 패턴 선택 기준은 `references/box-system.md` 참조.

### SO WHAT + Bottom Strip
```
SO WHAT:    x=0.622  y=6.20   w=12.09  h=0.35   fill=surface2 rectRadius=0.06
Source:     x=0.535  y=6.85   w=11.0   h=0.30   align=left  8pt caption
Page Num:   x=12.45  y=6.85   w=0.47   h=0.30   align=right 8pt caption
※ Copyright 표기 없음 (불필요 노이즈)
```

### 표지 슬라이드 (Box System 미사용)
```
background:  hero_gradient.png (≥ 2400×1350)
white logo:  x=0.70  y=0.50  w=1.80  h=0.55
Eyebrow:     x=0.70  y=2.95  w=9.0   h=0.35   11pt white charSpacing=4
Title:       x=0.70  y=3.40  w=12.0  h=1.0    44~48pt white bold
Subtitle:    x=0.70  y=4.55  w=12.0  h=0.40   16pt white medium
```

## 7. Module routing — 작업별 참조 파일

전체를 매번 다 읽으면 토큰 낭비입니다. 작업에 맞는 파일만 펼치세요.

| 작업                              | 펼칠 파일                                |
| --------------------------------- | ---------------------------------------- |
| Box 분할 패턴 선택·이유          | `references/box-system.md`              |
| 시각화 카탈로그 200+ 타입         | `references/visualization-catalog.md`   |
| "이 메시지엔 어떤 차트?"         | `references/message-mapping.md`         |
| pptxgenjs 차트 옵션·코드          | `references/charts.md`                  |
| 다이어그램 좌표·헬퍼              | `references/diagram-library.md`         |
| Action Title·Pyramid·SCR 작성법   | `references/storytelling.md`            |
| 한글 자간·행간·줄바꿈             | `references/korean-typography.md`       |
| 12 컬럼 그리드 정렬               | `references/grid-system.md`             |
| 컬러 조합 레시피                  | `references/color-recipes.md`           |
| 빌드 후 60항목 QA                 | `references/qa-checklist.md`            |
| 미세조정 32항목                   | `references/polish-checklist.md`        |

## 8. 12 디자인 미학 원칙 (모든 결정의 기준)

극도로 아름다운 데크는 더하는 게 아니라 정밀하게 조율하는 것입니다.
모든 시각적 결정은 다음 12원칙을 통과해야 합니다.

1. **Whitespace as architecture** — 여백은 "비어있는" 게 아니라 "쉴 곳"
2. **Hierarchy by contrast, not size alone** — 글자만 키우지 말고 색·여백·위치 다중 변수로
3. **Quiet sophistication** — 디자인이 "디자인했다"고 외치지 않게
4. **Silent rhythm** — 카드 gap이 통일돼야 리듬이 산다 (0.10/0.10/0.10)
5. **Optical alignment** — 수학적 정렬과 시각적 정렬은 다르다
6. **Reduce, don't add** — "이거 빠져도 메시지 전달되나?" 답이 yes면 빼라
7. **One emphasis per slide** — 강조가 둘 이상이면 강조가 사라진다
8. **Generous breathing room** — 카드 안 padding 작게 잡지 말 것 (≥ 0.20")
9. **Calculated asymmetry** — 5:7, 3:9 같은 의도된 비대칭이 인간적 균형
10. **Material restraint** — fill 5색·line 3단계·rectRadius 3단계 이내
11. **Tonal harmony** — 한 슬라이드 모든 색은 같은 톤 안에
12. **Detail respect** — 1pt·0.05" 차이가 결과를 바꾼다

## 9. AI slop 회피 — 절대 금지 패턴

이 신호가 하나라도 보이면 즉시 AI 산출물로 분류됩니다.

**전형적 AI 슬롭**
- 좌측 세로 액센트 바, 풀폭 컬러 헤더·푸터 바, 제목 아래 액센트 라인
- 따뜻한 베이지/크림 배경, 카드 4개 동일 컬러(강조 없음)
- 모든 텍스트 중앙 정렬, 텍스트 박스 overflow, italic 한글
- pie chart 5조각 이상, 모든 헤더 옆 아이콘, 이모지
- 한 슬라이드에 폰트 굵기 3개 이상, 헤드라인이 사실 진술
- 노드 12개 초과 다이어그램, 무지개 색상, "SmartArt 룩"

**Brandlogy 고유 금지**
- 핑크(ea5ec1, FFEAF6 변형) 또는 옅은 핑크 사용
- 시멘틱에 채도 색 (주황·빨강·녹색·보라 등) 도입
- Box System 누락 (표지 제외 모든 본문 슬라이드 의무)
- Box line을 진하게 (옅은 EDEEF0가 표준)
- 콘텐츠가 Box 침범 (max y > 6.05)
- Bottom Strip이 Box 안에 있음
- Copyright 표기

**v11 신규 금지**
- 분할 박스 사이 gap이 들쑥날쑥 (가로 0.20, 세로 0.15 표준)
- 분할 박스에 서로 다른 styling 적용
- 분할 박스 안 padding 미준수 (0.20" 필수)
- 분할 패턴이 메시지 구조와 불일치 (동등 비교에 비대칭 분할 등)
- 여백 부족 — Whitespace as architecture 위반
- 강조 카드 2개 이상 — One emphasis 위반
- 재료 과다 (fill 6색+, line 4단계+, rectRadius 4단계+)

자세한 다이어그램별 슬롭 회피는 `references/diagram-library.md` §14-H 참조.

## 10. 페이퍼로지님 작업 패턴 — 고정 기준

페이퍼로지(주식회사 와이즈라이온스타즈) 데크는 다음 기준을 추가로 따릅니다.

**PPT 디자인 룰 (페이퍼로지 고정)**
- 헤드라인 한 줄 원칙 (두 줄 시 자간 -0.5~-1로 압축 후 한 줄)
- 거대 그래픽 통합 — 라벨+숫자 분리 금지, 한 덩어리 텍스트 블록 ("THE GAP 13X")
- 추상어 금지, 직접어 사용 — "알려진 사람" → "퍼스널브랜딩"
- SO WHAT 두 마디 단순체 — "X 아닙니다. Y일 뿐입니다" 패턴
- 불필요한 정의 라인 제거 — 그래픽 자체가 메시지면 추가 설명문 삭제

**작업 흐름**
- 확인 대기 없이 빌드 → PDF 변환 → JPG 추출 → 시각 검수 → 코드 수정 → 재빌드 연속 루프
- 작업 디렉토리: `/home/claude/<deck_name>/`
- 최종 출력: `/mnt/user-data/outputs/`

## 11. Build pipeline — 표준 3단계

```bash
# 1. PPTX 생성
cd /home/claude/<deck_name> && export NODE_PATH=$(npm root -g) && node index.js

# 2. PDF 변환
python3 /mnt/skills/public/pptx/scripts/office/soffice.py \
  --headless --convert-to pdf <pptx-path> --outdir <dir>

# 3. 슬라이드별 JPG 추출 (시각 검수용)
rm -f slide-*.jpg && pdftoppm -jpeg -r 100 <pdf-name>.pdf slide

# 4. 컬러 grep (선택, 빌드 후 자동)
bash scripts/color-grep.sh build_deck.js
```

`scripts/build-pipeline.sh`로 묶어두면 한 줄 실행 가능합니다.

## 12. Pre-build checklist — 빌드 시작 전 13항목

빌드 시작 전 다음 13항목을 확정하지 않으면 재작업이 필연입니다.

1. Pretendard 9 weights 설치 + `fc-cache -fv` 갱신 완료
2. 배경 옵션 결정 (옵션 A: 흰 배경 + 로고 PNG / 옵션 B: 통합 배경 PNG ≥ 2400×1350)
3. Hero gradient PNG ≥ 2400×1350 (표지용, `scripts/hero-gradient.js`로 생성)
4. Ghost Deck 완성 (슬라이드별 Action Title + 시각화 카테고리 + 데이터 출처)
5. 시각화 매핑 — Cat 6종 이상, Cat 1·4·5 중 1개 + Cat 6·7·8 중 1개
6. 슬라이드별 Box 분할 패턴 결정 (7가지 중)
7. 콘텐츠 max y ≤ 6.05 + SO WHAT y=6.20 + Bottom Strip y=6.85 강제
8. 12 컬럼 그리드 정렬 적용
9. 다이어그램 사용 한계 — 한 슬라이드 1개만
10. 시멘틱 컬러 가이드 — 녹색·핑크 0개, 상승=brand, 하락=mute
11. 자산 해상도 ≥ 150 DPI (≥ 2000×1125 PNG)
12. 데크 전체 컬러 인벤토리 — 브랜드 외 색 0개 검증
13. 디자인 폴리시 32항목 사전 검토

## 13. Examples — 메시지 → 시각화 → Box 패턴

| 슬라이드 메시지                          | Cat | 시각화                | Box 패턴 |
| ---------------------------------------- | --- | --------------------- | -------- |
| 글로벌 5개국 시장 규모 비교              | 2   | Bar chart (가로)      | P1       |
| 자사 vs 경쟁사 4축 비교                  | 2   | Slope chart           | P5       |
| 2020-2025 매출 추이 + 인사이트           | 3   | Line + KPI 카드       | P6       |
| 우선순위 4 사분면 (긴급·중요)            | 1   | Eisenhower Matrix     | P4       |
| 3 페르소나 비교                          | 8   | Persona Card          | P3       |
| 디지털 전환 7단계 프로세스               | 6   | Flowchart             | P1       |
| 비즈니스 모델                            | 1   | BMC (9블록)           | P4 변형  |
| 시스템 아키텍처 4 레이어                 | 7   | Layered Architecture  | P1       |
| KPI 4개 + Takeaway 3개                   | 2   | KPI strip + Insight   | P2H      |
| 핵심 메시지 + 풀 차트                    | 2   | Bar chart             | P5       |

자세한 100+ 행 매트릭스는 `references/message-mapping.md` 참조.

## 14. 컬러 시멘틱 빠른 참조

```
단일 강조:     brand fill + white text + caption desc
2가지 비교:    brand vs mute (채도 vs 무채도)
3~4단계 위계:  brandT1 → T2 → T3 → T4
강조 카드 1개: brandPale fill + brand 1.4pt line + brandGlow shadow
시계열:        상승=brand, 하락=mute, 정체=caption
SWOT:          S=brandPale+brand / W=surface2+mute /
               O=brandT4+brand / T=surface2+mute
```

자세한 9가지 레시피는 `references/color-recipes.md` 참조.

## 15. 한글 타이포 핵심 (디테일은 reference)

- 한글 본문은 영문 대비 1pt 작게 (영문 11 → 한글 10)
- 헤드라인은 동일 (24pt 한글이 시각적 무게 충분)
- 한글 본문 charSpacing: 0 또는 -0.3 (양수 금지)
- 한글 헤드라인 24pt+: charSpacing -0.5
- 가운뎃점 "·" 권장 ("가치·경험·표현")
- 헤드라인 마침표 사용 X
- 한글 따옴표 「」 『』 금지 (영문 ' ' " " 사용)

자세한 한글 타이포는 `references/korean-typography.md` 참조.

## 16. 정상 실패 처리

빌드 중 다음 상황은 정상이며, 명시된 방법으로 처리하세요.

| 상황                              | 처리                                          |
| --------------------------------- | --------------------------------------------- |
| 폰트 미설치 환경에서 빌드         | 사용자에게 알리고 fc-cache 실행 안내          |
| 색상 hex 8자리 입력됨             | 6자리로 분리, 투명도는 opacity 속성으로       |
| 헤드라인이 두 줄                  | 자간 -0.5~-1 적용해 한 줄로 압축              |
| 콘텐츠가 y=6.05 침범              | 카드 height 축소 또는 슬라이드 분할           |
| 다이어그램 노드 12개 초과         | 슬라이드 2장으로 분할 또는 그룹화             |
| pie chart 5조각 이상              | 100% Stacked Bar로 대체                       |
| 슬라이드 13장 초과                | 모듈 단위로 데크 분할                         |

## 17. 빌드 후 최종 체크 (1분)

PDF 변환 + JPG 추출 후 다음 7가지만 빠르게 확인:

1. 모든 슬라이드 헤드라인이 한 줄에 끝나는가?
2. 컬러 인벤토리에 핑크·녹색·주황 0개?
3. 모든 본문 슬라이드에 Box System 적용?
4. 콘텐츠가 SO WHAT(y=6.20)과 안 겹치는가?
5. 각 슬라이드 강조 카드 1개만?
6. 카드 간 gap이 한 슬라이드에서 통일?
7. Action Title — 사실 진술 0개?

문제 발견 시 코드 수정 → 재빌드 → 재검수 루프 1회. 그 이상이면 Ghost Deck로 돌아가서 메시지 재정의가 더 빠릅니다.

---

**Source**: 페이퍼로지(주식회사 와이즈라이온스타즈) Brandlogy PPT Design System
Unified v11 — Box System & Beauty Edition. 모든 룰은 실제 데크 빌드 후
시각 QA를 통해 검증된 결과입니다.
