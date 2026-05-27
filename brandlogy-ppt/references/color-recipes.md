# Color Recipes — 자주 쓰는 컬러 조합

Brandlogy 컬러는 블루 + 그레이 모노크롬. 변주는 채도 차이가 아니라 **위계**로
만듭니다. 이 파일은 슬라이드 단위에서 자주 쓰는 9가지 컬러 조합을 정리.

## 컬러 상수 빠른 참조

```javascript
// Brand (블루 스케일)
brand:     "4F6EF1"   // 메인 액센트
brandDeep: "0014D3"   // 최강조 (브랜드 점)
brandT1:   "4F6EF1"   // = brand (강조 노드)
brandT2:   "7E94F5"   // 중간 노드
brandT3:   "A8B7F8"   // 옅은 노드
brandT4:   "DDE3FB"   // 가장 옅은 (배경 강조)
brandPale: "F8F9FF"   // 강조 카드 배경

// Neutral (그레이 스케일)
ink:       "222222"   // 본문 텍스트
text:      "404040"   // 서브 텍스트
mute:      "45515E"   // 약 강조 / 하락 시멘틱
caption:   "8E8E93"   // 캡션 / 일반 시멘틱
border:    "E5E7EB"   // 차트 그리드
containerLine: "EDEEF0"  // Box 라인
surface:   "FAFAFA"   // 매트릭스 BG
surface2:  "F0F0F0"   // SO WHAT BG, 약 카드 BG
```

---

## Recipe 1: 단일 강조 카드

KPI 4개 중 1개만 핵심일 때.

```
강조 카드:
  fill:   brandPale (F8F9FF)
  line:   brand (4F6EF1) 1.4pt
  shadow: brandGlow (opacity 0.20)
  big number color: brand
  label color: caption

일반 카드 (×3):
  fill:   white
  line:   containerLine (EDEEF0) 1pt
  shadow: standard (opacity 0.08)
  big number color: ink
  label color: caption
```

**원칙**: 한 슬라이드 = 강조 1개. 둘 이상이면 강조가 사라진다.

---

## Recipe 2: 2가지 비교 (대등)

자사 vs 경쟁사, before vs after.

```
시리즈 A (강조 / 자사 / after):
  brand (4F6EF1)

시리즈 B (비교 / 경쟁사 / before):
  mute (45515E)
```

**대비 방식**: 채도 있는 색 vs 무채도 (둘 다 채도 있으면 충돌).

---

## Recipe 3: 3~4단계 위계 (점진적)

피라미드 단, 분류 트리, 영향력 수준.

```
Level 1 (최강조): brandT1 (4F6EF1)
Level 2:          brandT2 (7E94F5)
Level 3:          brandT3 (A8B7F8)
Level 4 (배경):   brandT4 (DDE3FB)
```

옅어질수록 단계 낮음. 차트 시리즈 4개 위계 표현에 자주 사용.

---

## Recipe 4: 5단계+ 위계 (드물게)

5단계는 시각적 한계 — 가능하면 4단계 이하로.

```
Level 1: brandDeep (0014D3)
Level 2: brand     (4F6EF1)
Level 3: brandT2   (7E94F5)
Level 4: brandT3   (A8B7F8)
Level 5: brandT4   (DDE3FB)
Level 6+ (가능 시): caption (8E8E93)
```

---

## Recipe 5: 카드 grid 구분 (위계 없음)

4-up 카드 카테고리 구분. 모두 동등.

```
모든 카드:
  fill:   white
  line:   containerLine (EDEEF0) 1pt
  Big number: brand (4F6EF1)
  Label:  caption (8E8E93) charSpacing 2
```

핵심은 **모든 카드 동일 styling**. 데이터 차이로만 구분.

---

## Recipe 6: 시계열 변화

상승·하락·정체를 색으로.

```
상승 (긍정):  brand (4F6EF1)    ↑
하락 (부정):  mute (45515E)     ↓
정체 (보합):  caption (8E8E93)  →

화살표 기호 병행:
  ▲ +12%   color: brand
  ▼ -8%    color: mute
  ▬  0%    color: caption
```

**주의**: 녹색(상승)·빨강(하락)은 절대 금지. 시멘틱은 채도 차로만.

---

## Recipe 7: SWOT 4 분면

핑크·녹색 없이 모노크롬으로.

```
S (Strengths — 내부 강점):
  fill: brandPale (F8F9FF)
  icon/accent: brand (4F6EF1)
  text: ink

W (Weaknesses — 내부 약점):
  fill: surface2 (F0F0F0)
  icon/accent: mute (45515E)
  text: ink

O (Opportunities — 외부 기회):
  fill: brandT4 (DDE3FB)
  icon/accent: brand (4F6EF1)
  text: ink

T (Threats — 외부 위협):
  fill: surface2 (F0F0F0)
  icon/accent: mute (45515E)
  text: ink
```

**구조**: 내부=좌측 / 외부=우측, 긍정=brand 계열 / 부정=mute+surface2.

---

## Recipe 8: 카테고리 구분 (3가지 다른 그룹)

위계 없는 3 그룹 — 페르소나 비교, 옵션 비교.

**방식 A**: brand 단일 + 라벨로만 구분
```
모든 그룹: brand (4F6EF1)
구분: 카드 라벨 (caption charSpacing 2)
```

**방식 B**: 그레이 단계로 구분 (drop-in)
```
그룹 1: ink (222222)
그룹 2: mute (45515E)
그룹 3: caption (8E8E93)
```

**방식 C**: brand 위계 (구분 + 위계)
```
그룹 1: brand
그룹 2: brandT2
그룹 3: brandT3
```

가능하면 방식 A. 위계가 있을 때만 C.

---

## Recipe 9: 감정·상태 시각화

Customer Journey, NPS, 만족도.

```
긍정 (만족 / 좋음 / 높음):  brand    (4F6EF1)
중립 (보통 / 평균):         caption  (8E8E93)
부정 (불만 / 낮음):         mute     (45515E)
```

녹색·빨강 절대 금지. 채도(brand) vs 무채도(mute/caption) 대비로만 표현.

---

## Surface 활용 (배경 컬러)

```
slide 기본 BG:        white (FFFFFF)
Box System 내부:      white
매트릭스 BG:          surface  (FAFAFA)
약 카드 BG:           surface2 (F0F0F0)
SO WHAT BG:           surface2 (F0F0F0)
강조 카드 BG:         brandPale (F8F9FF)
다크 슬라이드 BG:     dark (181E25)  ← 드물게 표지/섹션 구분용
```

surface 계열은 모두 회색 톤. 따뜻한 베이지·크림 절대 금지 (AI 슬롭 신호).

---

## 컬러 인벤토리 점검

빌드 후 사용된 hex 코드를 모두 grep해 다음 외 컬러가 있는지 확인:

```bash
# 허용 컬러만 grep
grep -oE '"[0-9A-Fa-f]{6}"' build_deck.js | sort -u
```

허용 리스트:
```
0014D3 brandDeep
4F6EF1 brand / brandT1
7E94F5 brandT2
A8B7F8 brandLight / brandT3
DDE3FB brandT4
F8F9FF brandPale
000000 black
181E25 dark
222222 ink
404040 text
45515E mute
5F5F5F source
8E8E93 caption
E5E7EB border
EDEEF0 containerLine
F0F0F0 surface2
F2F3F5 surface3
FAFAFA surface
FFFFFF white
```

이 외 컬러가 검출되면 **즉시 수정**. 빌드 통과 금지.

---

## 자주 하는 실수

1. **그라디언트 남용** — 표지(hero) 외 본문에 그라디언트 금지
2. **opacity로 색 만들기** — `4F6EF180` 같은 8자리 hex 금지, brandT3로 대체
3. **brand line + brand fill** — 같은 색 line/fill은 line 무의미. line은 containerLine 또는 mute로
4. **brandPale fill + brand text** — 대비 부족. brandPale 위는 brand가 아니라 brandDeep/ink로 텍스트
5. **3개 이상 액센트 컬러** — brand + brandDeep까지가 액센트 한계, brandT 계열은 위계 도구일 뿐
