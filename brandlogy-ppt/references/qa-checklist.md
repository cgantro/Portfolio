# QA Checklist — 빌드 후 60항목

빌드 → PDF 변환 → JPG 추출 후 슬라이드별로 다음 60항목을 점검합니다.
하나라도 실패하면 코드 수정 → 재빌드. 페이퍼로지 표준 연속 루프.

## 사용법

1. `scripts/build-pipeline.sh`로 PDF + JPG 추출
2. JPG 이미지 시각 검수하며 아래 체크리스트 통과 확인
3. 실패 항목은 코드 수정 후 재빌드
4. 빠른 점검만 원하면 §17 "최종 7항목"만

---

## A. 좌표·정렬 (6항목)

- [ ] 1. Chapter Strip이 brand 컬러 10pt charSpacing 2~4?
- [ ] 2. 모든 본문 슬라이드(표지 제외)에 Box System 적용?
- [ ] 3. Headline 24pt Bold black charSpacing -0.5?
- [ ] 4. Subtitle 12pt Medium text?
- [ ] 5. Bottom Strip Source/Page만, Copyright 없음?
- [ ] 6. Bottom Strip y=6.85 (균형 위치)?

## B. 콘텐츠 영역 (4항목)

- [ ] 7. 모든 콘텐츠 카드 끝 y ≤ 6.05?
- [ ] 8. SO WHAT 콜아웃 y=6.20~6.55?
- [ ] 9. 콘텐츠 카드와 SO WHAT 사이 ≥ 0.15" 간격?
- [ ] 10. 카드 좌측 마진 0.622" (Box 안쪽 정렬)?

## C. 색상·배경 (7항목)

- [ ] 11. brand 4F6EF1만 메인 액센트?
- [ ] 12. 따뜻한 베이지/크림 배경 없음?
- [ ] 13. 카드 BG가 white 또는 brandPale?
- [ ] 14. 녹색(16a34a, 22c55e, 10b981) 사용 없음?
- [ ] 15. 핑크(ea5ec1, FFEAF6, ec4899, f472b6) 사용 없음?
- [ ] 16. 시멘틱은 brand(상승) + mute/caption(하락)만?
- [ ] 17. 데크 전체 컬러 인벤토리에서 블루+그레이 외 채도 색 0개?

## D. Box System (6항목)

- [ ] 18. Box 패턴(1/2L/2H/3/4/5/6/7) 중 메시지 구조에 맞는 것 선택?
- [ ] 19. 분할 박스 fill=white, line=EDEEF0 1pt 동일 styling?
- [ ] 20. 분할 박스 rectRadius=0.18(큰) / 0.14(작은) 일관?
- [ ] 21. 분할 박스 shadow opacity=0.05 매우 약하게?
- [ ] 22. 박스 가로 gap=0.20", 세로 gap=0.15" 표준 준수?
- [ ] 23. 박스 안 콘텐츠 padding 0.20" 준수?

## E. 타이포 (4항목)

- [ ] 24. fontFace="Pretendard" 또는 "Pretendard Medium"?
- [ ] 25. 본문 14pt 이상 + 충분한 대비? (또는 caption은 8pt+)
- [ ] 26. italic 한글 없음?
- [ ] 27. 한글 본문이 영문 대비 1pt 작게 조정?

## F. 차트·시각화 (6항목)

- [ ] 28. catGridLine: "none", valGridLine: e5e7eb 0.5pt?
- [ ] 29. 차트 chartArea border 없음?
- [ ] 30. 단일 시리즈 차트는 showLegend false?
- [ ] 31. 데이터 라벨 폰트 Pretendard?
- [ ] 32. 가로 막대는 데이터 자체 오름차순/내림차순 정렬?
- [ ] 33. 차트 비교 시리즈 색상이 brand + mute/brandT 단계 외 사용 없음?

## G. 다양성 (6항목)

- [ ] 34. 데크 9장+ 면 카테고리 6종 이상?
- [ ] 35. 동일 차트/다이어그램 4회 이상 반복 없음?
- [ ] 36. Cat 1·4·5 중 1개 이상 포함?
- [ ] 37. Cat 6·7·8 중 1개 이상 포함?
- [ ] 38. pptxgenjs charts ≥ 2 + Shape 다이어그램 ≥ 2 혼합?
- [ ] 39. 한 슬라이드에 다이어그램 1개만?

## H. AI Slop 회피 (3항목)

- [ ] 40. 좌측 세로 액센트 바 없음?
- [ ] 41. 풀폭 컬러 헤더/푸터 바 없음?
- [ ] 42. 제목 아래 액센트 라인 없음?

## I. 기존 룰 누적 (4항목)

- [ ] 43. 라벨 5개+ 차트(Slope, Scatter, 2x2)에 anti-collision + leader line?
- [ ] 44. Pyramid는 wRatio 점진 변화 (0.40/0.65/0.95 등)?
- [ ] 45. 카드 본문 텍스트 박스 안전 여유 0.10"?
- [ ] 46. Pretendard 설치 환경에서 시각 QA?

## J. McKinsey Storytelling (8항목)

- [ ] 47. 모든 슬라이드 헤드라인이 Action Title (사실 진술 0)?
- [ ] 48. 데크 전체가 Pyramid Principle 구조?
- [ ] 49. SCR 또는 SCQA 시퀀스 적용?
- [ ] 50. Ghost Deck 단계에서 메시지·차트·데이터 사전 매핑?
- [ ] 51. 메시지 → 시각화 매핑이 Selection Matrix 따름?
- [ ] 52. 분류·옵션·트리 노드가 MECE?
- [ ] 53. 모든 차트에 Source 라인 표시?
- [ ] 54. 추정·가정·제외 항목은 Note 또는 Footnote로 명시?

## K. 디자인 미학 (6항목)

- [ ] 55. 12 미학 원칙 통과 — 특히 Whitespace, Quiet sophistication?
- [ ] 56. polish-checklist.md 32항목 통과?
- [ ] 57. 슬라이드별 강조 카드 1개만 (One emphasis)?
- [ ] 58. fill 색 5개 이내, line 두께 3단계 이내, rectRadius 3단계 이내?
- [ ] 59. 한국어 타이포 디테일 준수 (자간·행간·줄바꿈)?
- [ ] 60. 12 컬럼 그리드 정렬 준수?

---

## 자동화 가능 항목 (수동 체크 불필요)

다음 항목은 `scripts/color-grep.sh`가 자동 검출합니다.

- 14, 15: 핑크·녹색 hex 검출
- 17 일부: 금지 컬러 grep

다음은 수동 시각 확인 권장:

- 7, 8, 9: 콘텐츠 max y 확인 (JPG 슬라이드 픽셀 측정)
- 22, 23: gap·padding 시각 확인
- 47: Action Title 검수 (헤드라인 텍스트 grep)

---

## 빌드 후 최종 7항목 (1분 점검)

시간 없을 때는 이것만:

1. 모든 슬라이드 헤드라인이 **한 줄**에 끝나는가?
2. 컬러 인벤토리에 **핑크·녹색·주황 0개**?
3. 모든 본문 슬라이드에 **Box System** 적용?
4. 콘텐츠가 **SO WHAT(y=6.20)과 안 겹치는가**?
5. 각 슬라이드 **강조 카드 1개만**?
6. 카드 간 **gap이 한 슬라이드에서 통일**?
7. Action Title — **사실 진술 0개**?

문제 발견 시 코드 수정 → 재빌드 → 재검수 루프 1회. 그 이상이면 Ghost
Deck로 돌아가 메시지 재정의가 더 빠릅니다.
