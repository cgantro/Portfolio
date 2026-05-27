# Message → Visualization → Box Pattern Mapping

데크에서 가장 중요한 결정은 "이 메시지에 어떤 시각화가 맞는가"입니다.
이 파일은 메시지 타입을 100+ 행의 매트릭스로 분해해 권장 시각화와 Box
패턴을 매핑합니다. 슬라이드 단위 결정 시 이 파일을 펼쳐서 사용하세요.

## 사용법

1. 슬라이드의 Action Title을 먼저 확정
2. 메시지가 어느 "유형"인지 식별 (양적 비교? 시계열? 관계? 프레임워크?)
3. 아래 매트릭스에서 가장 가까운 행 찾기
4. 권장 시각화 + Box 패턴 그대로 적용
5. 매칭되는 행이 없으면 메시지를 다시 정의 (메시지가 모호한 신호)

## Diversity Rules (필수)

- 데크 9장 이상이면 카테고리 6종 이상 혼합
- Cat 1·4·5 중 1개 + Cat 6·7·8 중 1개는 데크에 반드시 포함
- 동일 차트/다이어그램 4회 이상 반복 금지 (3회까지 OK)
- 인접 3장 슬라이드에 동일 카테고리 2개 이상 금지

## 카테고리 약어

- **Cat 1** — Frameworks & Decision (전략·의사결정)
- **Cat 2** — Quantitative Comparison (양적 비교)
- **Cat 3** — Temporal & Roadmap (시간·로드맵)
- **Cat 4** — Composition & Distribution (구성·분포)
- **Cat 5** — Relationship & Network (관계·네트워크)
- **Cat 6** — Process & Flow (프로세스·흐름)
- **Cat 7** — Architecture & System (아키텍처·시스템·지리)
- **Cat 8** — Concept & Illustration (개념·일러스트·대시보드)

Box 패턴: **P1** 단일 / **P2L** 좌우 / **P2H** 상하 / **P3** 3분할 /
**P4** 2x2 / **P5** 5:7 / **P6** 7:5 / **P7** 혼합

---

## ▼ 양적 비교 (Cat 2)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 항목 간 단순 비교 (≤8개) | Bar chart (가로, 자체 오름차순) | 2 | P1 |
| 항목 간 비교 (>8개) | Column chart 또는 Heatmap | 2/4 | P1 |
| 여러 항목·여러 차원 동시 | Radar / Spider chart | 2 | P5 |
| Before/After 단순 비교 | Bullet Chart 또는 Dumbbell Chart | 2 | P1/P2L |
| 여러 옵션 장단점 | Comparison Table | 2 | P1 |
| 변화량 분해 (시작→끝) | Waterfall / Bridge / Revenue Bridge | 2 | P1 |
| KPI 강조 (1~4개) | KPI Card strip | 2 | P2H 상단 |
| 순위 변화 (시간축) | Bump Chart / Animated Ranking | 2 | P1 |
| 분포 + 중간값 | Box Plot / Violin Plot | 2 | P1 |
| 두 그룹 분포 비교 | Dot Plot / Lollipop Chart | 2 | P2L |
| 단일 KPI 큰 강조 | KPI Big Number + desc | 2 | P5 좌 |
| 누적 + 개별 동시 | Stacked Bar / Stacked Column | 2 | P1 |

## ▼ 시계열·시간 (Cat 3)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 시간 추이 (1 변수) | Line chart | 3 | P1 |
| 시간 추이 (다변수 비교) | Slope chart 또는 Bump Chart | 3 | P5 |
| 누적 추이 | Area chart 또는 Stacked Area | 3 | P1 |
| 여러 시리즈 흐름 | Streamgraph | 3 | P1 |
| 주요 사건 milestone | Timeline / Milestone Timeline | 3 | P1 |
| 프로젝트 일정 | Gantt chart | 3 | P1 |
| 다중 트랙 계획 | Multi-track Roadmap | 3 | P1 |
| 반복되는 주기 | Cycle / Loop Diagram | 3 | P1 |
| 고객 행동 단계 + 감정 | Customer Journey Map | 3 | P1/P2H |
| 스토리·시나리오 흐름 | Storyboard / Storyboard Layout | 3 | P1 |
| 코호트 잔존율 | Cohort Retention Chart | 3 | P1 |
| 이탈률 추이 | Churn Curve / Retention Curve | 3 | P5 |
| 인구 구조 | Population Pyramid | 3 | P5 |
| 두 시점 점프 (전후) | Slope chart 2점 | 3 | P5 |
| 시간축 + 핵심 KPI 동시 | Timeline + KPI Hybrid | 3 | P2H |

## ▼ 구성·분포 (Cat 4)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 구성 비율 (≤3 항목) | Pie / Doughnut | 4 | P5 |
| 구성 비율 (>3 항목) | 100% Stacked Bar | 4 | P1 |
| 카테고리 강도 분포 | Heatmap | 4 | P1 |
| 연·월·일 집계 패턴 | Calendar Heatmap | 4 | P1 |
| 계층적 구성 + 면적 비례 | Treemap / Sunburst / Icicle | 4 | P1 |
| 2차원 + 크기 차원 | Bubble chart | 4/5 | P1 |
| 카테고리 × 카테고리 분포 | Marimekko / Mosaic Plot | 4 | P1 |
| 단어 빈도 | Word Cloud / Tag Cloud | 4 | P5 |
| 변수 간 상관 | Correlation Matrix | 4 | P1 |
| 분류기 성능 | Confusion Matrix | 4 | P5 |
| 분포 비교 (다중) | Ridgeline Plot | 4 | P1 |
| 포트폴리오 자산 분포 | Investment Sunburst | 4 | P1 |
| 시장 점유율 (상위 + 기타) | Doughnut + 상세 카드 | 4 | P5 |

## ▼ 관계·인과·네트워크 (Cat 5)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 두 변수 관계 | Scatter Plot | 5 | P1 |
| 여러 변수 쌍 관계 | Scatter Matrix | 5 | P1 |
| 두 변수 + 분류 + 크기 | Bubble Chart | 5 | P1 |
| 여러 항목 간 연결 | Network / Force-Directed Graph | 5 | P1 |
| 중심-둘레 관계 | Hub-and-Spoke Diagram | 5 | P1 |
| 집합 간 교집합 | Venn / Euler Diagram | 5 | P5 |
| 엔티티 간 관계 (DB) | ERD | 5 | P1 |
| 자원·금액·트래픽 흐름 | Sankey / Alluvial Diagram | 5 | P1 |
| 순환 관계 (다대다) | Chord Diagram / Dependency Wheel | 5 | P1 |
| 원인·결과 분해 | Fishbone (Ishikawa) | 5 | P1 |
| 복합 인과 루프 | Causal Loop Diagram | 5 | P1 |
| 중심 개념 + 방사형 분기 | Mind Map | 5 | P1 |
| 개념 간 의미 연결 | Concept Map / Knowledge Graph | 5 | P1 |
| 사용자 공감 | Empathy Map | 5 | P4 |
| 이해관계자 매핑 | Stakeholder Map | 5 | P1 |
| 영향력 네트워크 | Influencer Constellation Map | 5 | P1 |
| 거래·자금 흐름 | M&A Network / Token Flow Sankey | 5 | P1 |
| 보안 위협 | Cybersecurity Attack Map | 5 | P1 |

## ▼ 프레임워크·전략·의사결정 (Cat 1)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 우선순위 분류 (2축) | 2x2 Matrix / Priority Matrix | 1 | P1 |
| 우선순위 위계 (단계) | Pyramid | 1 | P5 |
| 분류 트리 (가설 분해) | Issue Tree / Logic Tree | 1 | P1 |
| 의사결정 분기 (Yes/No) | Decision Tree | 1 | P1 |
| 실패 원인 트리 | Fault Tree Analysis | 1 | P1 |
| 비즈니스 모델 9블록 | Business Model Canvas | 1 | P4 변형 |
| 스타트업 BMC 변형 | Lean Canvas | 1 | P4 변형 |
| 고객 가치 명제 | Value Proposition Canvas | 1 | P2L |
| 고객 작업·욕구 분석 | JTBD Canvas / JTBD Map | 1 | P2L |
| 경쟁 요소 비교 곡선 | Strategy Canvas | 1 | P1 |
| 시장 포지셔닝 (2축+점) | Positioning Map / Perceptual Map | 1 | P6 |
| 전략 인과 지도 | Strategy Map (BSC) | 1 | P1 |
| 내부·외부 4사분면 | SWOT (모노크롬) | 1 | P4 |
| 성장-점유 매트릭스 | BCG Matrix / Boston Matrix | 1 | P1 |
| IT 솔루션 평가 | Gartner Magic Quadrant | 1 | P1 |
| 산업 경쟁력 5요인 | Porter's 5 Forces | 1 | P1 |
| 자원 경쟁우위 평가 | VRIO | 1 | P1 |
| 제품-시장 성장 전략 | Ansoff Matrix | 1 | P4 |
| 업무 긴급-중요 분류 | Eisenhower Matrix | 1 | P4 |
| 영향-노력 우선순위 | Impact-Effort Matrix | 1 | P1 |
| 책임 분장 | RACI Matrix | 1 | P1 |
| 리스크 평가 | Risk Matrix | 1 | P1 |
| 시장 규모 (계층) | TAM-SAM-SOM Diagram | 1 | P5 |
| 기술 채택 곡선 | AI Adoption Curve / Hype Cycle | 1 | P1 |
| 진화 단계 매핑 | Wardley Map | 1 | P1 |

## ▼ 프로세스·플로우 (Cat 6)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 단계별 흐름 (분기 포함) | Flowchart (BPMN-light) | 6 | P1 |
| 전환 분해 (깔때기) | Funnel Chart / Funnel Flow | 6 | P1 |
| 복잡한 비즈니스 프로세스 | BPMN | 6 | P1 |
| 여러 역할 동시 작업 | Swimlane Diagram | 6 | P1 |
| 서비스 전체 가치 흐름 | Value Chain Diagram | 6 | P1 |
| 서비스 프론트·백 동시 | Service Blueprint | 6 | P1 |
| 사용자 인터페이스 흐름 | User Flow / UI Flow | 6 | P1 |
| 객체 간 메시지 순서 | UML Sequence Diagram | 6 | P1 |
| 데이터 흐름 표현 | Data Flow Diagram (DFD) | 6 | P1 |
| 상태 전이 | State Machine Diagram | 6 | P1 |
| AI 모델 학습 흐름 | AI Workflow Diagram | 6 | P1 |
| 데이터 처리 파이프라인 | Data Pipeline Diagram | 6 | P1 |
| 업무 진행 상태 | Kanban Flow Diagram | 6 | P1 |
| 공급망 | Supply Chain Network Map | 6 | P1/P7 |
| 순환 경제 | Circular Economy Diagram | 6 | P1 |
| 탄소 배출 흐름 | Carbon Footprint Flow | 6 | P1 |
| Chevron 단계 프로세스 | Chevron Process Diagram | 6 | P1 |

## ▼ 아키텍처·시스템·구조·지리 (Cat 7)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 시스템 모듈 + 인터페이스 | Block Diagram | 7 | P1 |
| 계층 구조 | Layered Architecture | 7 | P1 |
| 클라우드 시스템 | Cloud Architecture Diagram | 7 | P1 |
| 마이크로서비스 | Microservice Architecture Map | 7 | P1 |
| 사이트·정보 구조 | Information Architecture (IA) | 7 | P1 |
| 네트워크 토폴로지 | Topology Map | 7 | P1 |
| 조직 구조 | Org Chart / Hierarchy Chart | 7 | P1 |
| 멘탈 모델 매핑 | Mental Model Diagram | 7 | P1 |
| 카테고리·분류 트리 | Tree Diagram | 7 | P1 |
| 브랜드 위계 (마스터·서브) | Brand Architecture | 7 | P1 |
| 배포·인프라 | Deployment Diagram | 7 | P1 |
| 컴포넌트 구조 | Component Diagram | 7 | P1 |
| 지리 데이터 (지역 통계) | Geographic Choropleth / Cartogram | 7 | P1 |
| 지리 데이터 (위치 + 크기) | Geo Bubble Map / Symbol Map | 7 | P1 |
| 지리 데이터 (이동 흐름) | Flow Map (지리) | 7 | P1 |
| 도시 디지털 트윈 | Smart City Digital Map | 7 | P1 |
| AI 모델 구조 | Neural Network Visualization | 7 | P1 |
| 양자 회로 | Quantum Circuit Diagram | 7 | P1 |

## ▼ 개념·일러스트·인포그래픽·대시보드 (Cat 8)

| 메시지 타입 | 권장 시각화 | Cat | Box |
|---|---|---|---|
| 3D 아이소매트릭 시점 | Isometric Illustration / Explainer | 8 | P1 |
| 분해된 부품·구조 | Exploded View Diagram | 8 | P1 |
| 내부 단면 | Cutaway Diagram | 8 | P1 |
| 설계 도면 | Blueprint Diagram | 8 | P1 |
| 업계 플레이어 생태계 | Ecosystem Map | 8 | P1 |
| 추상 개념 시각화 | Concept Visual / Framework | 8 | P5 |
| 아이콘 + 짧은 설명 | Icon-based Explainer | 8 | P4 |
| UI 와이어프레임 | Wireframe / Layout Schema | 8 | P1 |
| 사용자 페르소나 (3명) | Persona Card | 8 | P3 |
| 잡지·에디토리얼 톤 | Magazine Editorial Layout | 8 | P1 |
| 스위스 그리드 인포그래픽 | Swiss Grid Infographic | 8 | P1 |
| 벤토 그리드 (모듈) | Bento Grid Infographic | 8 | P7 |
| 실무 대시보드 | Bento Dashboard / Modular Dashboard | 8 | P7 |
| 애플 스타일 분석 | Apple-style Bento Analytics | 8 | P7 |
| 미션 컨트롤 | Command Center / Mission Control | 8 | P1 |
| 블룸버그 터미널 | Bloomberg Terminal-style | 8 | P1 |
| 실행 KPI 대시보드 | OKR / North Star Metric Dashboard | 8 | P7 |
| 지속가능성 | ESG / SDG Mapping Chart | 8 | P1 |
| 단위 경제 | Unit Economics Dashboard | 8 | P7 |
| 스타트업 생태계 | Startup Ecosystem Map | 8 | P1 |
| 브랜드 디자인 시스템 | Color Harmony Matrix / Token Board | 8 | P1 |

---

## 9가지 결정 휴리스틱 (메시지 → 카테고리)

매트릭스에서 헷갈리면 이 9가지 질문으로 카테고리부터 좁히세요.

| 질문 | 권장 카테고리 |
|---|---|
| H1. 어떻게 작동하는가? | Cat 6 (Flowchart, BPMN, UML Sequence) |
| H2. 왜 이런 결과인가? | Cat 5 (Fishbone, Causal Loop, 5-Whys) |
| H3. 구성 요소는 무엇인가? | Cat 7 (Tree, Block, Layered, Org Chart) |
| H4. 어디에 위치하는가? | Cat 1 (2x2, Strategy Canvas, Magic Quadrant) |
| H5. 언제 무엇을 하는가? | Cat 3 (Timeline, Gantt, Roadmap) |
| H6. 고객·이해관계자는 어떻게 연결되는가? | Cat 3/5 (Journey Map, Stakeholder) |
| H7. 얼마나 큰가? 어떻게 분포하는가? | Cat 2/4 (Bar, Heatmap, Treemap, Bubble) |
| H8. 어떻게 흐르는가? 어떻게 변환되는가? | Cat 6 (Sankey, Funnel, DFD, Alluvial) |
| H9. 어떻게 연결되어 있는가? | Cat 5 (Network, Hub & Spoke, Mind Map, ERD, Venn) |

---

## Box 패턴 선택 룰 (시각화 → Box)

같은 시각화도 메시지 구조에 따라 Box 패턴이 달라집니다.

| 메시지 구조 | Box 패턴 |
|---|---|
| 풀폭 시각화 1개 | P1 (단일) |
| 두 개념 대비/비교 | P2L (좌우 1:1) |
| 데이터 위 + 인사이트 아래 | P2H (상하 1:1) |
| 3가지 동등 카테고리 | P3 (3분할) |
| 4가지 동등 항목 | P4 (2x2) |
| 핵심 메시지 좌 + 디테일 우 | P5 (5:7 비대칭) |
| 메인 차트 좌 + 인사이트 우 | P6 (7:5 비대칭) |
| 메인 시각화 + 보조 정보 다수 | P7 (혼합) |

---

## 매칭이 안 될 때

매트릭스에 없는 메시지면 두 가지 중 하나입니다.

1. **메시지가 모호함** — Action Title이 사실 진술이거나, 한 슬라이드에 메시지 2개 이상이 섞임. Ghost Deck로 돌아가서 메시지 재정의.
2. **데이터를 잘못 가져옴** — 메시지에 맞는 데이터가 아니라 데이터에 맞춰 메시지를 만든 상태. 결론을 먼저 정하고 데이터를 다시 정리.

매칭 안 된다고 새 시각화를 발명하지 마세요. 매트릭스에 없는 시각화는
대부분 Brandlogy v11 컬러 정책을 못 지키거나 다이어그램 슬롭 패턴으로 빠집니다.
