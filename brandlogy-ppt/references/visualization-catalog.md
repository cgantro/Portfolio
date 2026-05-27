# Visualization Catalog — 200+ 타입 전수 카탈로그

8개 카테고리, 200+ 시각화 타입. 메시지에 맞는 시각화를 찾을 때 이 파일을
펼쳐서 사용합니다. 매트릭스 매핑은 `message-mapping.md`, 코드는
`charts.md` / `diagram-library.md` 참조.

## 사용법

1. 슬라이드 메시지가 어느 카테고리(Cat 1~8)에 속하는지 식별
2. 카탈로그에서 후보 시각화 3~5개 추리기
3. `message-mapping.md`로 최종 1개 결정
4. 다양성 룰 (§Diversity Rules) 위반 안 하는지 확인

## Diversity Rules (반복)

- 데크 9장+ 면 카테고리 6종 이상 혼합
- 동일 차트/다이어그램 4회 이상 반복 금지
- 인접 3장 슬라이드에 동일 카테고리 2개 이상 금지
- Cat 1·4·5 중 1개 + Cat 6·7·8 중 1개 데크에 반드시 포함
- pptxgenjs charts ≥ 2 + Shape 다이어그램 ≥ 2 혼합

---

## Cat 1 — Frameworks & Decision (전략·의사결정)

**언제**: 우선순위, 분류, 의사결정, 경쟁 포지셔닝, 전략 프레임워크.

```
구조·매트릭스:
  2x2 Matrix · Pyramid · MECE Tree · Issue Tree · Logic Tree
  Decision Tree · Fault Tree Analysis · Affinity Diagram · Matrix Diagram

경영·전략:
  SWOT · BCG Matrix · Boston Matrix · Porter's 5 Forces · VRIO
  Ansoff Matrix · Eisenhower Matrix · Impact-Effort Matrix
  Priority Matrix · RACI Matrix · Risk Matrix

시장·포지셔닝:
  Gartner Magic Quadrant · Perceptual Map · Positioning Map
  Strategy Canvas · Strategy Map (BSC) · Wardley Map
  TAM-SAM-SOM Diagram · Innovation Matrix · Technology Radar

비즈니스 모델:
  Business Model Canvas · Lean Canvas · Value Proposition Canvas
  JTBD Canvas · JTBD Map

채택·트렌드:
  Hype Cycle Chart · AI Adoption Curve · Diffusion of Innovation

엑제큐티브 차트:
  McKinsey-style Executive Chart · BCG-style Strategic Matrix
```

**자주 쓰는 5개**: 2x2 Matrix, SWOT, Pyramid, BMC, Strategy Canvas.

---

## Cat 2 — Quantitative Comparison (양적 비교)

**언제**: 항목 비교, KPI, 변화량, 순위, 분포 통계.

```
막대·기둥:
  Bar Chart · Column Chart · Stacked Bar · Stacked Column
  Grouped Column · 100% Stacked Bar · Marimekko (구성)

변화량 분해:
  Waterfall Chart · Bridge Chart · Revenue Bridge

KPI·라벨:
  KPI Card · KPI Strip · Bullet Chart · Gauge Chart

비교 차트:
  Slope Chart · Slopegraph · Dumbbell Chart · Comparison Table
  Bump Chart · Ribbon Chart

다차원·다각:
  Radar Chart · Spider Chart · Polar Area Chart
  Radial Bar Chart · Rose Chart

분포·통계:
  Histogram · Box Plot · Boxen Plot · Violin Plot
  Dot Plot · Lollipop Chart · Pareto Chart

순위:
  Race Bar Chart · Animated Ranking Chart

특수 시계열:
  Step Chart · OHLC Chart · Candlestick Chart
  Run Chart · Control Chart

피라미드·깔때기 (양적):
  Pyramid Chart · Funnel Chart (수량)
  Sparkline Dashboard
```

**자주 쓰는 5개**: Bar Chart, Slope Chart, Waterfall, KPI Card, Radar.

---

## Cat 3 — Temporal & Roadmap (시간·로드맵·시계열)

**언제**: 시간 흐름, 추이, 일정, 마일스톤, 코호트.

```
시계열 차트:
  Line Chart · Area Chart · Stacked Area · Streamgraph
  Horizon Chart · Cumulative Line · Slope Chart (시계열)

순위·시간 결합:
  Bump Chart · Animated Ranking Chart

마일스톤·로드맵:
  Timeline Chart · Timeline + KPI Hybrid
  Milestone Timeline · Spiral Timeline

프로젝트 일정:
  Gantt Chart · Roadmap Chart · Multi-track Roadmap

순환·반복:
  Cycle Diagram · Loop Diagram · Circular Process Diagram

스토리·여정:
  Storyboard · Storyboard Layout · Storyline Diagram
  Customer Journey Map

코호트·잔존:
  Cohort Retention Chart · Retention Curve · Churn Curve

인구·전환:
  Population Pyramid · Demographic Transition Chart

특수 분야:
  Sankey Timeline Hybrid · Pandemic Spread Map
  Epidemiological Curve · Climate Spiral Visualization
  Space Mission Timeline · War Timeline Dashboard
  Esports Match Timeline · Patent Landscape Map
  Music Genre Evolution Map · Film Revenue Waterfall (시간축)
  Streaming Platform Share Chart
```

**자주 쓰는 5개**: Line Chart, Slope Chart, Timeline, Roadmap, Customer Journey.

---

## Cat 4 — Composition & Distribution (구성·분포·밀도)

**언제**: 전체 대비 비율, 카테고리 분포, 밀도, 강도 매트릭스.

```
히트맵:
  Heatmap · Calendar Heatmap · Density Heatmap
  Cluster Heatmap · Cohort Heatmap · Funnel Cohort Heatmap
  Correlation Matrix · Confusion Matrix
  Sentiment Heatmap · Topic Cluster Map
  Risk Exposure Heatmap · Eye-Tracking Heatmap
  Tennis Shot Heatmap · Retail Shelf Heatmap

100% 구성:
  Stacked 100% Bar · Marimekko Chart · Mosaic Plot · Mekko Chart

계층 면적:
  Treemap · Radial Treemap · Sunburst Chart · Icicle Chart
  Circle Packing · Voronoi Diagram

버블 (구성용):
  Bubble Chart (구성) · Packed Bubble Chart · Hexbin Chart

원형 분할:
  Pie Chart · Doughnut Chart

텍스트 빈도:
  Word Cloud · Packed Word Cloud · Tag Cloud

기타 분포:
  Pattern Map · Density Map · Ridgeline Plot

도메인 특화:
  NFT Market Heatmap · Cryptocurrency Treemap
  Investment Portfolio Sunburst · Slide Density Heatmap
```

**자주 쓰는 5개**: Heatmap, 100% Stacked Bar, Treemap, Doughnut (≤3 항목),
Correlation Matrix.

---

## Cat 5 — Relationship & Network (관계·네트워크·인과)

**언제**: 두 변수 관계, 노드 간 연결, 인과 구조, 영향력.

```
산점·버블:
  Scatter Plot · Scatter Matrix · Bubble Chart (관계)
  Connected Scatter · CAC vs LTV Bubble

네트워크:
  Network Graph · Force-Directed Graph · Node-Link Diagram
  Mind Map · Hub-and-Spoke Diagram

집합·교집합:
  Venn Diagram · Euler Diagram

엔티티 관계:
  Entity Relationship Diagram (ERD)

흐름·매핑:
  Sankey Diagram · Alluvial Diagram
  Chord Diagram · Arc Diagram · Dependency Wheel

인과 분석:
  Fishbone (Ishikawa) · Causal Loop · 5-Whys Tree

개념·지식:
  Concept Map · Knowledge Graph

이해관계자·공감:
  Stakeholder Map · Empathy Map · Affinity Diagram (관계)

특수 분야:
  Brain Connectivity Diagram · Genome Map · Protein Interaction Network
  Social Network Graph · Influencer Constellation Map
  Viral Spread Diagram · Meme Diffusion Map
  M&A Network Map · Blockchain Network Visualization
  Token Flow Sankey · Geopolitical Influence Network
  Cybersecurity Attack Map · Threat Intelligence Graph
  Fraud Detection Network · Football Pass Network
  Attribution Flow Diagram · Clickstream Sankey · SEO Visibility Graph
```

**자주 쓰는 5개**: Scatter Plot, Network Graph, Venn, Sankey, Fishbone.

---

## Cat 6 — Process & Flow (프로세스·흐름·여정)

**언제**: 단계별 진행, 워크플로, 전환 분해, 시스템 흐름.

```
플로우차트:
  Flowchart (BPMN-light) · BPMN · UML Sequence Diagram
  State Machine Diagram · Workflow Diagram

전환·깔때기:
  Funnel Chart · Funnel Flow Diagram

흐름·이동:
  Sankey Flow · Migration Flow Map · Supply Chain Network Map
  Logistics Route Optimization Map

가치·서비스:
  Value Chain Diagram · Service Blueprint
  Customer Journey Map (프로세스)

협업·역할:
  Swimlane Diagram · Kanban Flow Diagram · RACI Diagram

UI·인터페이스:
  Wireframe Flowchart · User Flow · UI Flow

데이터·기술:
  Data Pipeline Diagram · AI Workflow Diagram
  Data Flow Diagram (DFD) · Interaction Diagram

분기·의사결정:
  Decision Flow · Chevron Process Diagram

지속가능성·산업:
  Carbon Footprint Flow Diagram · Circular Economy Diagram
  Manufacturing Process Flowchart · Healthcare Patient Journey Map

비즈니스 흐름:
  Media Mix Modeling Chart · Revenue Bridge (프로세스)
```

**자주 쓰는 5개**: Flowchart, Funnel, Swimlane, Customer Journey, Service Blueprint.

---

## Cat 7 — Architecture & System (아키텍처·시스템·구조·지리)

**언제**: 시스템 구조, 계층, 모듈, 위치, 지리적 분포.

```
아키텍처:
  System Diagram · Block Diagram · Layered Architecture
  Cloud Architecture Diagram · Microservice Architecture Map
  Component Diagram · Module Diagram · Deployment Diagram

정보·UI 구조:
  Information Architecture (IA) · Site Map · Topology Map

조직·계층:
  Org Chart · Hierarchy Chart · Tree Diagram
  Brand Architecture · Category Structure
  Mental Model Diagram · Functional Map

지리·지도:
  Geographic Choropleth · Cartogram · Geo Bubble Map
  Symbol Map · Topographic Map · 3D Terrain Map
  Election Swing Map · Flow Map (지리)
  Isometric Data Map · Ocean Current Flow Map
  Military Situation Map

스마트·IoT:
  Smart City Digital Map · Digital Twin Visualization
  Energy Grid Network Diagram · Industrial IoT Dashboard
  Factory Digital Twin Layout · Tile Grid Map
  Autonomous Vehicle Sensor Visualization
  Airport Network Map · Satellite Coverage Map

과학·기술:
  Quantum Circuit Diagram · Neural Network Visualization
```

**자주 쓰는 5개**: Org Chart, Layered Architecture, Block Diagram,
Choropleth, Tree Diagram.

---

## Cat 8 — Concept & Illustration (개념·일러스트·인포그래픽·대시보드)

**언제**: 추상 개념 시각화, 페르소나, 인포그래픽, 대시보드.

```
일러스트:
  Isometric Illustration · Isometric Explainer
  Exploded View Diagram · Cutaway Diagram · Blueprint Diagram
  Icon-based Explainer · Concept Visual

생태계·맵:
  Ecosystem Map · Communication Map · Stakeholder Map
  Empathy Map · Insight Map · Persona Card

UI·와이어프레임:
  Wireframe · Layout Schema · Storyboard

특수 일러스트:
  DNA Helix Infographic · Activist Poster Infographic
  Brutalist Data Poster · Magazine Editorial Layout
  Swiss Grid Infographic

대시보드 (모던):
  Bento Grid Infographic · Bento Dashboard Layout
  Modular Dashboard · Glassmorphism Dashboard
  Apple-style Bento Analytics · Liquid Glass UI Chart
  Neumorphism Dashboard · Cyberpunk HUD Visualization
  Glass Panel Analytics UI

대시보드 (전문):
  Command Center Dashboard · Mission Control Interface
  Bloomberg Terminal-style Visualization · Executive Dashboard
  Infographic Dashboard · Scorecard Dashboard

KPI 대시보드:
  OKR Dashboard · ESG Dashboard · North Star Metric Dashboard
  Unit Economics Dashboard · SDG Mapping Chart

생태계·스타트업:
  Startup Ecosystem Map · Venture Funnel Dashboard
  Creator Economy Dashboard · YouTube Analytics Bento Grid

스포츠·운영:
  Sports Analytics Dashboard · Crisis Monitoring Dashboard
  F1 Telemetry Visualization · Baseball Spray Chart
  Store Traffic Flow Diagram

디자인 도구:
  Visual Hierarchy Map · Typography Scale System
  Color Harmony Matrix · Design Token Dashboard
  PPT Structure Map · Presentation Narrative Flow Diagram
  Emotion Wheel Visualization
```

**자주 쓰는 5개**: Persona Card, Bento Dashboard, Ecosystem Map,
Icon-based Explainer, OKR Dashboard.

---

## 카테고리 선택 빠른 가이드

```
메시지 끝나는 단어가...               선택할 Cat

"~를 비교"                            Cat 2
"~로 변화", "~까지의 추이"            Cat 3
"~의 비율", "~ 구성"                  Cat 4
"~와 ~의 관계", "~ 연결"              Cat 5
"~ 과정", "~ 단계", "~ 흐름"          Cat 6
"~ 구조", "~ 위치", "~ 분포 (지리)"   Cat 7
"~ 페르소나", "~ 대시보드"            Cat 8
"~ 우선순위", "~ 분류", "~ 전략"      Cat 1
```

---

## 카테고리 혼합 권장 데크 구조 (9~12장)

```
S1  표지                              (카테고리 없음)
S2  Executive Summary (KPI strip)     Cat 2
S3  Situation (시장 추이)             Cat 3
S4  Complication 1 (분포 / 구성)      Cat 4
S5  Complication 2 (관계 / 인과)      Cat 5
S6  Complication 3 (프레임워크)       Cat 1
S7  Solution (프로세스)               Cat 6
S8  Solution (아키텍처)               Cat 7
S9  Solution (페르소나·대시보드)      Cat 8
S10 Final Takeaway (KPI 또는 PB)     Cat 2 / Cat 8
```

이 구조면 Cat 6종 이상 사용·동일 카테고리 인접 X·필수 카테고리 모두 포함.

---

## 시각화 카탈로그 사용 시 주의

1. **카탈로그를 한꺼번에 다 검토하지 말 것** — 카테고리 식별 후 그 안에서만
2. **이름이 어려운 시각화는 검색해서 확인** — 모르는 타입 함부로 선택 X
3. **`message-mapping.md`와 cross-check** — 메시지 → 시각화 매핑 정합 확인
4. **빌드 가능성 점검** — pptxgenjs로 그릴 수 있는가? Native 미지원이면
   Shape + Line + Text로 시뮬레이션 가능한가?
5. **데이터 양 점검** — 노드 12개 초과, 라벨 30개 초과면 단순화 또는 다른 시각화

---

## 참고

- Brandlogy 데크 60+ 슬라이드 실전 빌드 기반
- IBCS · Few · Tufte · McKinsey 시각화 표준 참조
- 페이퍼로지 작업 메모리 누적
