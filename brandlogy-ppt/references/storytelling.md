# Storytelling — McKinsey-style 데크 구조

데크는 디자인 전에 **이야기**입니다. 좌표·컬러가 아무리 완벽해도 메시지
구조가 무너지면 AI 슬롭이 됩니다. 이 파일은 Ghost Deck 단계에서 펼쳐서
사용합니다.

## 1. Action Title — 모든 헤드라인 의무

데크에서 가장 비싼 한 줄은 헤드라인입니다. 청중은 헤드라인만 읽고
슬라이드를 넘기기도 합니다. 그 한 줄이 "사실"이면 시간 낭비, "결론"이면
설득이 시작됩니다.

### 판별 테스트

> "이게 So What?"에 답하면 Action Title.
> 답하지 못하면 사실 진술 — 다시 쓴다.

### 예시

```
❌ "글로벌 출판 시장 매출"
✅ "미국이 글로벌 25% 점유, 중국과 격차 1.4배"

❌ "MZ 세대 소비 패턴 분석"
✅ "MZ는 가격이 아니라 '서사'에 지갑을 연다"

❌ "디지털 전환 추진 현황"
✅ "디지털 전환은 IT 프로젝트가 아니라 조직 재설계다"

❌ "2024년 매출 성과"
✅ "신제품 라인이 전체 성장의 73%를 이끌었다"

❌ "고객 만족도 조사 결과"
✅ "재구매 의향은 NPS가 아니라 '응답 속도'와 가장 강하게 묶인다"
```

### 작성 규칙

- 한 줄로 끝낸다 (두 줄 시 자간 -0.5~-1 압축, 그래도 두 줄이면 메시지 단순화)
- 마침표 사용 X (Action Title은 선언)
- 숫자·고유명사로 구체화 ("매출 성장" → "매출 73% 성장")
- 비교·대조 동사 활용 ("X 아니라 Y", "X 1.4배", "X보다 Y가 먼저")
- 추상어 금지 — 페이퍼로지 룰 "알려진 사람 → 퍼스널브랜딩"처럼 직접어

---

## 2. Pyramid Principle (Barbara Minto)

전체 데크는 피라미드 구조여야 합니다. 청중이 위에서 아래로 읽어도, 한
층만 읽어도 메시지가 완결돼야 합니다.

```
            [Governing Thought]
                     │
        ┌────────────┼────────────┐
        │            │            │
   [Key Line 1] [Key Line 2] [Key Line 3]
        │            │            │
     [evidence]   [evidence]   [evidence]
     [evidence]   [evidence]   [evidence]
```

### Governing Thought (지배 메시지)

데크 전체를 한 문장으로 압축. 표지·Executive Summary·마지막 슬라이드에
반복 등장.

```
예: "Brandlogy는 1년 안에 한국 PB 시장 1위로 올라간다.
     이유는 셋: ① 차별화된 시각 시스템 ② 운영 자동화 ③ 채널 분산."
```

### Key Line (지지 메시지 3개)

Governing Thought를 지지하는 **MECE한** 3개 (드물게 4개). 이 셋이 데크의
중간 챕터를 구성.

**MECE 점검**:
- **ME** (Mutually Exclusive): 키 라인끼리 겹치지 않는가?
- **CE** (Collectively Exhaustive): 이 셋이 다 모이면 Governing Thought가
  완성되는가?

겹치거나 빠지면 다시 쓴다.

### Evidence (각 Key Line당 2~3개)

각 Key Line을 지지하는 데이터·사례·차트. 슬라이드 1장당 evidence 1개가 표준.

---

## 3. SCR / SCQA — 데크 흐름 구조

피라미드는 정적 구조, SCR은 **시간 순서** 구조입니다. 둘 다 만족해야
청중이 따라옵니다.

### SCR (Situation - Complication - Resolution)

```
Situation     현재 상황 (청중이 다 아는 사실)
Complication  문제 발생 (예상이 깨지는 지점)
Resolution    해결 (Governing Thought)
```

### SCQA (질문형 변형)

```
Situation     현재 상황
Complication  문제 발생
Question      그래서 무엇을 할 것인가?
Answer        답 (Governing Thought)
```

### 표준 데크 (10장) 매핑

```
S1   Cover                              표지
S2   Executive Summary                  Governing Thought + 3 Key Lines
S3   Situation                          현재 상황
S4-5 Complication 1 (Key Line 1)        문제 #1 + 데이터
S6-7 Complication 2 (Key Line 2)        문제 #2 + 데이터
S8-9 Resolution (Key Line 3 + 실행안)   해법 + 로드맵
S10  Final Takeaway                     단일 메시지 + Call-to-Action
```

---

## 4. Ghost Deck — 코드 작성 전 필수 단계

좌표·코드를 짜기 전에 텍스트만으로 데크를 완성합니다. 시각화 결정은
메시지가 확정된 후에만.

### Ghost Deck 템플릿

```
[S1] 표지
  Title: <Governing Thought 단축형>
  Subtitle: <한 줄 설명>

[S2] Executive Summary
  Headline: <Governing Thought 풀버전>
  Body: Key Line 1 / 2 / 3

[S3] Situation
  Headline: <현재 상황 결론형>
  Visualization: ?
  Data Source: ?

[S4] Complication 1 — Key Line 1
  Headline: <문제 #1을 결론으로>
  Visualization: ?
  Data Source: ?

... (반복)

[S10] Final Takeaway
  Headline: <Governing Thought 변주>
  Body: 3 action items
```

### Ghost Deck 통과 기준

- 모든 Headline이 Action Title인가? (사실 진술 0개)
- Key Line 3개가 MECE인가?
- Situation → Complication → Resolution이 자연스럽게 흐르는가?
- 데이터 출처가 슬라이드마다 명시됐는가?

이 4개를 통과하기 전엔 코드 한 줄도 짜지 않습니다.

---

## 5. 페이퍼로지 고유 규칙

페이퍼로지(주식회사 와이즈라이온스타즈) 데크는 위 McKinsey 표준 위에
다음을 추가로 따릅니다.

### SO WHAT 두 마디 단순체

```
패턴: "X 아닙니다. Y일 뿐입니다."

예:
- "MZ는 변덕스럽지 않습니다. 검증에 빠를 뿐입니다."
- "PB는 자랑이 아닙니다. 신뢰 자산일 뿐입니다."
- "PPT는 디자인이 아닙니다. 의사결정 도구일 뿐입니다."
```

곁가지·수식어 제거. 청중이 1초 안에 이해해야 SO WHAT이다.

### 거대 그래픽 통합

라벨 + 숫자를 분리하지 않고 한 덩어리 텍스트 블록으로 처리.

```
❌ [라벨: "GAP"]  [숫자: "13X"]   ← 분리됨
✅ [한 덩어리: "THE GAP 13X"]      ← 통합
```

### 추상어 금지, 직접어 사용

청중이 즉시 이해하는 단어만. 추상화를 한 단계 낮춥니다.

```
❌ "인지 자산"   → ✅ "PB" 또는 "퍼스널 브랜드"
❌ "알려진 사람" → ✅ "퍼스널 브랜딩"
❌ "고객 여정"   → ✅ "구매 직전 3단계"
❌ "온보딩"      → ✅ "첫 7일 사용 경험"
```

### 불필요한 정의 라인 제거

그래픽 자체가 메시지를 다 전달하면 추가 설명문은 삭제. 시각이 곧 의미.

---

## 6. Source / Note / Footnote 위계

모든 데이터 시각화에는 출처가 필요합니다. 위계가 다음 3단계.

| 레벨        | 용도                                 | 표기                          |
| ----------- | ------------------------------------ | ----------------------------- |
| Source 필수 | 1차 출처 (보고서명, 기관, 연도)     | "Source: 페이퍼로지 자체조사 (2026)" |
| Note 선택   | 방법론·정의·제외 항목                | "Note: 응답자 N=312, 가중치 미적용" |
| Footnote    | 데이터 보조 설명, ¹ ² ³ 슈퍼스크립트 | "¹ 2024년 12월 환율 기준"     |

배치: Bottom Strip (y=6.85) 좌측에 인라인. 길면 줄임표 후 다음 슬라이드.

---

## 7. Action Title 빠른 변환표

사실 진술을 결론으로 바꾸는 동사 사전.

| 사실 진술 동사 | 결론 동사 (Action Title)              |
| -------------- | ------------------------------------- |
| 보여준다       | ~로 드러난다 / ~가 핵심이다           |
| 분석한다       | ~가 ~를 설명한다                      |
| 측정한다       | ~가 ~를 능가한다 / ~배 차이가 난다    |
| 비교한다       | ~가 ~보다 X배 / ~ 아니라 ~다          |
| 검토한다       | ~여야 한다 / ~는 작동하지 않는다      |
| 정리한다       | 결국 ~로 수렴한다 / 본질은 ~다        |
| 추세를 본다    | ~로 가속한다 / ~로 역전된다           |

---

## 참고

- Barbara Minto, *The Pyramid Principle*
- Gene Zelazny, *Say It with Charts*
- McKinsey & Company 내부 communication standards
- 페이퍼로지 작업 메모리 (실전 빌드 60+ 슬라이드 검증)
