# 03 · Timeline Builder

## 역할

커밋 히스토리를 개발 단계로 묶어 "무엇이 언제 추가됐는가"를 복원한다.
최종 상태가 아니라 성장 과정이 보여야 한다.

## Input

- 01의 전체 커밋 로그
- 02의 PROJECT_BRIEF (기간, 팀 구조)

## Process

```
1. 커밋을 날짜 기준으로 3~4 단계로 묶기
   - 기준: 기능 추가 → 통합 → 버그 수렴 패턴
2. 각 단계에서 주요 Feat 커밋 추출
3. 단계별 "무엇을 만들려 했는가 → 무엇이 추가됐는가 → 어떤 구조가 완성됐는가" 서술
4. 브랜치 패턴(feature/, fix/, refactor/)으로 흐름 보완
```

## Output → 09-portfolio-writer

```
TIMELINE:
[초기] YYYY-MM-DD ~ YYYY-MM-DD
  - 목표:
  - 주요 커밋: (해시 + 메시지)
  - 결과:

[중간] YYYY-MM-DD ~ YYYY-MM-DD
  ...

[후반] YYYY-MM-DD ~ YYYY-MM-DD
  ...
```

## 주의

- Chore/Merge 커밋은 흐름 파악에만 사용, 직접 서술 금지
- "~를 개발했습니다" 형식 금지 → "~가 추가됨", "~로 전환됨"
