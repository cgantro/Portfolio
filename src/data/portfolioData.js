export const portfolioData = {
  centralStar: {
    id: "about",
    label: "홍윤표",
    title: "Backend & System Engineer",
    subtitle:
      "고빈도 데이터 처리 환경에서 병목과 상태 불일치를 계측하고, 구조 재설계로 성능과 안정성을 개선해 온 엔지니어",
    techStack: [
      "Java 17",
      "Spring Boot",
      "PostgreSQL",
      "Redis",
      "MQTT",
      "WebSocket",
      "C++17",
      "OpenGL",
    ],
    highlights: [
      "AutowingCar 최대 처리량 8,935 msg/s",
      "500대 차량 환경 E2E 지연 14~28ms 유지",
      "RobotPal 프레임 드랍률 17.56% -> 0.78%",
    ],
    tabLabels: {
      overview: "Profile",
      architecture: "Tech Stack",
      troubleshooting: "Growth & Cert",
    },
    content: {
      overview: `렌더링 병목, 고빈도 텔레메트리 처리, 분산 환경의 상태 불일치 문제를 증상이 아닌 구조의 문제로 해석하고 개선해 온 개발자입니다.

- 목표: Throughput, Latency, Reliability 사이의 트레이드오프를 수치 기반으로 판단
- 강점: 재현 가능한 실험 환경 구성 -> 병목 계측 -> 구조 재설계 -> 결과 검증까지 End-to-End 수행
- 대표 성과: 500대 차량 부하 환경에서 E2E 지연 14~28ms 유지, 최대 8,935 msg/s 처리, RobotPal 프레임 드랍률 17.56% -> 0.78% 개선
- 지향점: 기술 스택보다 데이터 흐름과 책임 분리를 먼저 설계하고, 운영 환경에서 지속 가능한 시스템을 만드는 엔지니어`,

      architecture: `[Languages]
- C++17, Java 17, Python 3

[Backend & DB]
- Spring Boot, PostgreSQL (TimescaleDB), MySQL, Redis

[System & Architecture]
- MQTT, WebSocket(STOMP), Flecs(ECS), Qt

[DevOps & Tools]
- Docker, GitLab CI/CD, CMake, Git

[Engineering Focus]
- Producer-Consumer 패턴, 비동기 파이프라인, 배압 제어, 상태 기계(FSM), 데이터 생명주기 기반 저장소 분리`,

      troubleshooting: `[Education]
- 광운대학교 소프트웨어학부 (학사) | 2019.03 - 2025.08

[Certificate]
- 정보처리기사 | 2024.12
- OPIc IH | 2025.02

[SSAFY]
- 팀 단위 프로젝트 중심의 실무형 개발 프로세스 학습
- 이슈 분해 -> 구현 -> 코드리뷰 -> 리팩토링 사이클 반복
- 요구사항 변경 상황에서 작업 단위와 리뷰 기준을 정리하며 협업 효율 개선

[Leadership]
- 교내 밴드 동아리 마스터/합주 총괄(2019-2025)
- 15회 이상의 정기 및 외부 공연 운영 경험
- 실력 편차가 큰 팀에서 온보딩과 피드백 기준을 정리해 결과물 품질의 일관성을 높임`,
    },
  },
  planets: [
    {
      id: "autowingcar",
      label: "AutowingCar",
      title: "차세대 공항 스마트 토잉카 관제 시스템",
      subtitle:
        "Java 17, Spring Boot, MQTT, WebSocket, Redis, PostgreSQL(TimescaleDB)",
      techStack: [
        "Java 17",
        "Spring Boot",
        "MQTT",
        "WebSocket",
        "Redis",
        "PostgreSQL",
        "TimescaleDB",
        "RDP",
      ],
      highlights: [
        "500대 차량, 10Hz 환경 지연 14~28ms",
        "최대 8,935 msg/s 처리",
        "DB Write 분당 약 30만 -> 1만 수준 절감",
      ],
      tabLabels: {
        overview: "서비스 개요",
        architecture: "데이터 파이프라인",
        troubleshooting: "문제 해결 & 성과",
      },
      content: {
        overview: `자율주행 토잉카를 관제하는 백엔드 시스템을 개발했습니다.

- 해결한 문제: 다수 차량의 고빈도 텔레메트리 수집 환경에서 지연을 낮추고 상태 정합성을 유지하는 것
- 핵심 요구사항: 차량-서버-관제 UI 간 실시간 상태 동기화, 저장소 부하 제어, 운영 안정성 확보
- 도메인 당위성: 공항 견인 관제는 Safety-critical 환경이므로, 돌발 상황을 관제탑이 즉시 인지할 수 있는 저지연(목표 50ms 이하) 동기화가 필요
- 중점 설계: 데이터의 갱신 주기와 활용 목적에 따라 저장소 역할을 분리하고, 제어 흐름은 ACK 기반 상태 기계로 관리`,

        architecture: `[Protocol Relay]
- Inbound: MQTT 기반 차량 텔레메트리 수집
- Outbound: WebSocket/STOMP 기반 관제 UI 실시간 브로드캐스트

[Storage Strategy]
- Redis: 실시간 상태 캐시 + Write Buffer
- PostgreSQL(TimescaleDB): 시계열 주행 로그 저장
- MySQL: 미션/회원/정형 데이터 트랜잭션 처리

[Write-Behind Pattern]
- 텔레메트리를 Redis에 먼저 적재하고, 스케줄러/워커가 주기적으로 Batch Insert 수행
- 고빈도 동기식 DB Write를 줄여 Connection/WAL 부담 완화

[Optimization]
- RDP(Ramer-Douglas-Peucker) 적용으로 경로 포인트 수를 줄여 전송 페이로드와 저장 부하를 함께 감소
- MQTT ACK, Sequence Number, LWT를 이용해 중복 명령과 상태 불일치 방지

[Observability & Test]
- k6(load-and-stress.js) 기반으로 500대 동시 접속/10Hz 송신 부하 시나리오 구성
- AOP 실행시간 로깅(@LogExecutionTime, PerformanceAspect)으로 API/파이프라인 구간별 E2E 지연 계측

[Deployment]
- Docker Compose로 Spring Boot, Redis, PostgreSQL(TimescaleDB), MySQL 실행환경 컨테이너화
- GitLab CI/CD 파이프라인으로 빌드/기본 검증 후 동일 런타임 구성으로 배포 일관성 확보`,

        troubleshooting: `[문제 정의]
- 초기 구조에서는 텔레메트리를 DB에 동기 INSERT로 직접 저장해 트랜잭션 오버헤드, 디스크 I/O, WAL 업데이트가 병목이 되었고, 무선 네트워크 환경에서는 서버와 차량 간 상태 불일치도 반복적으로 발생

[해결 과정]
- Redis를 단순 조회 캐시가 아니라 Write Buffer로 재정의
- 실시간 상태 반영과 이력 저장을 분리해 읽기/쓰기 경합 감소
- DB afterCommit 이후에만 MQTT/WebSocket 이벤트를 발행하도록 파이프라인 순서 재설계
- 미션 단계는 ACK 기반 상태 기계(FSM)로 재구성하고, Sequence Number로 오래된 명령 무시

[정량 성과]
- 500대 차량, 10Hz 송신 환경에서 E2E 지연 14~28ms 유지
- 최대 처리량 8,935 msg/s 달성
- 500대 동시 연결 부하 테스트 환경에서 안정적 처리 검증
- 데이터 무결성 100%(측정 기준상 유실 0건) 확인
- 비임계 데이터 기준 DB Write를 분당 약 30만 건 수준에서 1만 건 수준으로 절감

[측정 방법]
- k6 부하 시나리오 + 서버 AOP 지연 로깅 + MQTT 송수신 타임스탬프 대조로 수치 검증
- 단일 API 평균이 아닌 수집 -> 버퍼 -> 저장 -> 브로드캐스트의 End-to-End 구간 기준으로 측정

[효과]
- 관제 UI의 상태 반영 지연 감소 및 피크 트래픽 구간의 DB 부하와 커넥션 고갈 위험 완화
- 실시간성, 상태 정합성, 저장 효율을 분리 설계해 운영 안정성과 확장성을 함께 확보

[Trade-off]
- Redis 버퍼 구간 장애 시 텔레메트리 로그 일부 유실 가능성이 존재
- 대신 관제에 치명적인 차량 미션/핵심 상태는 MySQL 동기 커밋으로 즉시 반영해 데이터 중요도별 영속성 이원화 정책 적용
- 즉, 비임계 로그는 처리량 중심, 임계 상태는 정합성 중심으로 분리 운영`,
      },
    },
    {
      id: "robotpal",
      label: "RobotPal",
      title: "크로스플랫폼 로봇 시뮬레이터",
      subtitle: "C++17, OpenGL, Flecs(ECS), WebSockets, Qt, CMake",
      techStack: [
        "C++17",
        "OpenGL",
        "Flecs ECS",
        "WebSocket",
        "Qt",
        "CMake",
        "PBO",
        "Multithreading",
      ],
      highlights: [
        "총 1,800프레임 기준 드랍 316 -> 14",
        "프레임 드랍률 17.56% -> 0.78%",
        "Single-worker -> Async Pipeline 전환",
      ],
      tabLabels: {
        overview: "프로젝트 개요",
        architecture: "시스템 아키텍처",
        troubleshooting: "문제 해결 & 성과",
      },
      content: {
        overview: `JETANK 로봇팔 제어·테스트를 위한 3D 시뮬레이션 및 스트리밍 엔진을 개발했습니다.

- 해결한 문제: 실제 하드웨어 실험의 반복 비용과 낮은 재현성을 가상 환경으로 대체
- 핵심 요구사항: 물리 연산의 실시간성을 유지하면서 원격 클라이언트에 프레임을 안정적으로 전송
- 도메인 당위성: 로봇 제어 화면의 프레임 끊김은 조작 오판으로 이어질 수 있어, 저지연보다 먼저 프레임 안정성을 우선 확보
- 접근 방식: 체감 품질이 아니라 프레임 드랍률과 처리 지연을 기준으로 병목을 계측하고 개선`,

        architecture: `[End-to-End Pipeline]
- Render(GPU) -> PBO Readback(VRAM->RAM) -> Network Queue -> JPEG Encode(CPU) -> WebSocket/TCP 송신

[Component]
- Main Thread: 물리 연산 및 렌더링
- Streaming Worker: 인코딩 및 네트워크 전송
- Network Queue: Producer-Consumer 패턴 기반 스레드 세이프 버퍼

[Design Choice]
- glReadPixels의 동기 블로킹을 줄이기 위해 PBO 더블 버퍼링(Ping-Pong) 적용
- 플랫폼 종속성을 줄이기 위해 NetworkTransport 인터페이스로 TCP/WebSocket 구현 분리

[Observability & Test]
- 커스텀 C++ 프로파일러로 메인 루프 단계별 실행시간(ms) 계측
- 고정 시나리오(총 1,800프레임) 반복 실험으로 개선 전/후 드랍률 비교

[Build & Delivery]
- CMake 기반 멀티 타깃 빌드 자동화
- GitLab CI/CD에서 빌드/기본 회귀 검증을 수행해 실행환경별 품질 편차 축소

[Trade-off]
- 비동기 파이프라인 도입으로 처리량과 안정성은 높였지만, 큐 버퍼링에 따른 메모리 사용 증가와 최소 1프레임 수준의 지연 발생`,

        troubleshooting: `[문제 정의]
- 초기 Single-worker 구조에서는 물리 연산 -> 렌더링 -> 인코딩 -> 전송이 하나의 흐름에 묶여 있었고, GPU-CPU Sync와 JPEG 인코딩 부하가 메인 루프를 직접 점유

[정량 측정]
- 동일한 재현 환경에서 총 1,800프레임 중 316프레임 드랍
- 프레임 드랍률 17.56% 계측

[측정 방법]
- 렌더링/인코딩/전송 구간별 소요시간을 커스텀 프로파일러로 로그화
- 평균값만 보지 않고 프레임별 분포를 확인해 스파이크 구간까지 추적

[해결 과정]
- 메인 스레드와 스트리밍 워커를 분리해 블로킹 작업 비동기화
- Queue 기반 파이프라인으로 단계 간 결합도 축소
- PBO 비동기 Readback으로 CPU 대기 시간 감소

[개선 결과]
- 프레임 드랍률 17.56% -> 0.78% (약 95.6% 개선)
- 시뮬레이션 연산 안정성과 스트리밍 처리량을 동시에 확보`,
      },
    },
    {
      id: "band",
      label: "Band",
      title: "조직 관리 및 리더십 (밴드 마스터)",
      subtitle: "다양한 성향과 실력을 가진 팀원들을 하나의 목표로 이끈 경험",
      techStack: [
        "Leadership",
        "Mentoring",
        "Feedback Loop",
        "Onboarding",
        "Coordination",
      ],
      highlights: [
        "2019-2025 마스터/합주 총괄",
        "15회 이상 정기/외부 공연 운영",
        "다양한 취향/실력의 팀원들을 한 무대로 정렬",
      ],
      tabLabels: {
        overview: "활동 이야기",
        architecture: "함께 만든 방식",
        troubleshooting: "소통과 조율",
      },
      content: {
        overview: `교내 밴드 동아리에서 마스터와 합주 총괄을 맡아 2019년부터 2025년까지 활동했습니다.

- 15회 이상의 정기/외부 공연을 기획하고, 파트 구성부터 합주 디렉팅까지 전체 흐름을 책임졌습니다.
- 목표는 단순히 "연주를 맞추는 것"이 아니라, 성향과 실력이 다른 팀원들이 같은 무대를 바라보게 만드는 것이었습니다.
- 활동을 통해 좋은 결과물은 개인의 완성도가 아니라 팀의 호흡에서 나온다는 걸 꾸준히 배웠습니다.`,

        architecture: `[신입이 소외되지 않게]
- 합주 경험이 적은 팀원도 자연스럽게 들어올 수 있도록, 눈높이에 맞는 연습 가이드와 곡을 매칭했습니다.
- 각자 어려워하는 구간을 같이 찾고, 어떤 순서로 연습하면 되는지 구체적으로 안내했습니다.

[시간을 아끼는 합주 운영]
- 기타, 베이스, 드럼, 키보드의 음역대가 겹치는 구간을 미리 체크하고 볼륨/톤 밸런스를 조율했습니다.
- 리허설 전에 "이번 합주에서 꼭 맞춰야 할 포인트"를 정해두어, 연습 시간이 흐트러지지 않게 운영했습니다.`,

        troubleshooting: `[의견이 갈릴 때]
- 곡 해석이나 연습 방식에서 의견 차이가 생기면, 누가 맞는지보다 "관객에게 어떤 무대를 보여줄지"를 기준으로 정리했습니다.
- 개인 취향을 존중하되, 무대 완성도라는 공동 목표 안에서 합의점을 찾는 방식을 유지했습니다.

[이 경험으로 얻은 것]
- 박자가 어긋나면 바로 맞추듯, 협업에서도 진행 상황을 자주 맞추는 Sync가 핵심이라는 걸 몸으로 익혔습니다.
- 개발에서도 다양한 성향의 팀원과 빠르게 합을 맞추고, 갈등을 생산적인 대화로 전환하는 힘이 제 강점이 되었습니다.`,
      },
    },
  ],
};

// ============================================================================
// 아래는 App.jsx 및 Three.js 씬 구성을 위한 기본 세팅값입니다. (그대로 유지)
// ============================================================================

export const DEFAULT_SELECTION = {
  id: portfolioData.centralStar.id,
  label: portfolioData.centralStar.label,
  kind: "항성",
  title: portfolioData.centralStar.title,
  subtitle: portfolioData.centralStar.subtitle,
  techStack: portfolioData.centralStar.techStack,
  highlights: portfolioData.centralStar.highlights,
  tabLabels: portfolioData.centralStar.tabLabels,
  fullText: portfolioData.centralStar.content,
};

export const PROJECTS = portfolioData.planets.map((planet, index) => ({
  id: planet.id,
  name: planet.label,
  subtitle: planet.subtitle,
  // 행성들의 색상을 모던하게 조정 (블루/퍼플/에메랄드 톤)
  color: [0x4ea8ff, 0xa782ff, 0x62d8a5][index % 3],
  orbitDistance: 14 + index * 6, // 궤도 간격을 약간 넓혀서 겹침 방지
  orbitSpeed: 0.0024 - index * 0.0003,
  radius: 1.35 - index * 0.08,
  satellites: [],
  techStack: planet.techStack,
  highlights: planet.highlights,
  tabLabels: planet.tabLabels,
  fullText: planet.content,
}));
