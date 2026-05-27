### 1. 프로젝트 한 줄 요약

**"LLM 기반의 AI 에이전트가 SSAFY 서울 캠퍼스의 실시간 식단 정보를 조회하고 답변할 수 있도록 돕는 MCP(Model Context Protocol) 서버 개발"**

### 2. 기술 스택 (Tech Stack)

- **Language:** Python 3.13
- **Core Framework:** **FastMCP** (mcp.server.fastmcp) - AI 모델과 도구 연결
- **Deployment & Management:** **Smithery** - AI 에이전트 배포 및 관리
- **Dependency Management:** **uv** (Rust 기반의 초고속 파이썬 패키지 매니저 사용)
- **Data Parsing:** Requests, Pydantic (데이터 검증 및 스키마 정의)
- **Environment:** python-dotenv (환경 변수 관리)

### 3. 주요 기능 및 로직

- **MCP 도구(Tool) 구현:** `get_meal_menu`라는 도구를 정의하여 AI가 필요할 때 함수를 호출(Tool Calling)할 수 있도록 함.
- **실시간 데이터 페칭:** GitHub Pages에 호스팅 된 외부 JSON 데이터(`DATA_SOURCE_URL`)를 실시간으로 받아와 처리.
- **스마트한 파라미터 처리:**
    - 사용자의 자연어 질문(예: "오늘 20층 메뉴 뭐야?")에서 `date`(날짜)와 `floor`(층수) 정보를 추출.
    - LLM이 날짜 형식을 잘못 보낼 경우에 대한 예외 처리 및 피드백 로직 구현.
- **데이터 필터링 및 포맷팅:** JSON 데이터를 파싱하여 특정 층(10F, 20F)이나 날짜에 맞는 메뉴만 필터링하고, 가독성 좋은 문자열로 포맷팅하여 LLM에게 반환.

---

## 📝 자소서/포트폴리오 작성을 위한 핵심 포인트 (Deep Dive)

자소서 작성 시 **'문제 해결 과정'**이나 **'기술적 의사결정'** 항목에 활용할 수 있는 내용들입니다.

### A. 최신 기술 도입 및 학습 능력 (MCP, uv)

> "기존의 정적인 챗봇을 넘어, LLM이 실시간 외부 데이터와 상호작용하는 표준 프로토콜인 MCP(Model Context Protocol)를 빠르게 학습하고 적용했습니다. 또한, Python 생태계의 최신 패키지 매니저인 uv를 도입하여 빌드 및 의존성 관리 속도를 최적화했습니다."
> 
- **근거:** `pyproject.toml`의 빌드 시스템 설정, `server.py`의 `FastMCP` 사용.

### B. 데이터 파이프라인의 유연성 확보

> "초기에는 로컬 캐싱 방식(data_fetcher.py)을 고려했으나, 식단 정보의 실시간성 보장과 서버 상태 비의존성(Stateless)을 위해 요청 시마다 외부 URL에서 데이터를 검증하고 가져오는 방식(server.py)으로 아키텍처를 개선했습니다."
> 
- **근거:** `data_fetcher.py` 코드(파일 저장 로직)와 `server.py` 코드(URL 직접 호출 로직)의 차이점.

### C. LLM과의 상호작용을 고려한 설계 (Prompt Engineering & Schema)

> "AI 모델이 도구를 정확하게 호출할 수 있도록 Pydantic을 활용해 명확한 입력 스키마를 정의했습니다. 특히 날짜(YYYY-MM-DD)와 층(Floor) 정보에 대한 명세(Description)를 구체적으로 작성하여, 모호한 사용자 발화에서도 AI가 정확한 파라미터를 추출하도록 유도했습니다."
> 
- **근거:** `server.py` 내 `get_meal_menu` 함수의 `Field` description 설정 (예: *"사용자의 질문에서 '오늘', '내일' 등 날짜 관련 언급이 있다면..."* 부분).

### D. 안정적인 서비스 운영을 위한 예외 처리

> "외부 데이터 소스 의존성이 높은 서비스 특성상, 네트워크 타임아웃이나 JSON 디코딩 에러, 날짜 형식 불일치 등 다양한 실패 시나리오에 대한 방어 코드를 작성하여 챗봇이 멈추지 않고 적절한 에러 메시지를 반환하도록 구현했습니다."
> 
- **근거:** `server.py`의 `try-except` 블록 및 날짜 파싱 오류 처리 로직.

---

## 🚀 코드 구조 리마인드 (참고용)

- **`src/bob_server/server.py`**: 핵심 파일입니다. `FastMCP` 객체를 생성하고 `@mcp.tool` 데코레이터를 사용해 AI가 사용할 함수를 등록했습니다.
- **`smithery.yaml`**: 이 서버가 어떤 런타임(Python)을 쓰고 진입점(Entrypoint)이 어디인지(`bob_server/server.py`) 정의하여 Smithery 플랫폼에 배포 가능하게 했습니다.
- **`pyproject.toml` & `uv.lock`**: 프로젝트 메타데이터와 의존성 라이브러리(Anthropic, OpenAI, FastMCP 등) 버전을 엄격하게 관리했습니다.