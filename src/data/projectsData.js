export const featuredProjectDecks = [
  {
    id: "autowing",
    name: "Autowing_car",
    oneLine: "상태 정합성과 메시징 분리를 중심으로 실시간 관제 서버와 배포 운영을 담당한 프로젝트",
    roleLabel: "서버 + 서버 배포",
    stackTags: ["Spring Boot", "MQTT", "WebSocket/STOMP", "Redis", "PostgreSQL/TimescaleDB", "Docker", "Nginx", "GitLab CI"],
    repo: "https://github.com/cgantro/Autowing_car",
    slides: [
      {
        key: "overview",
        label: "Overview",
        title: "실시간 관제 백엔드와 배포 운영을 함께 맡은 프로젝트",
        summary:
          "상태 정합성, 메시징 경계, 저장소 분리, 배포 경로를 하나의 시스템으로 설계하고 운영한 경험입니다.",
        leftBlocks: [
          {
            title: "문제 상황",
            bullets: [
              "고빈도 텔레메트리 입력에서 DB 경합과 지연 누적이 발생했습니다.",
              "명령 재전송/네트워크 흔들림 상황에서 상태 불일치 리스크가 있었습니다.",
              "실시간 반영과 이력 저장이 같은 경로에 묶여 책임이 불명확했습니다.",
            ],
          },
          {
            title: "내 역할",
            bullets: [
              "Spring Boot 서버 설계/구현과 ACK 기반 상태 제어를 담당했습니다.",
              "Redis-RDB 분리, MQTT-STOMP 경계 설계, 운영 로그 체계를 구성했습니다.",
              "GitLab CI + Docker + Nginx 기반 배포 경로를 구축했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "핵심 메시지",
            caption: "실시간 상태 제어와 배포 운영을 분리된 책임으로 설계",
            bullets: ["정합성 제어", "저지연 전파", "운영 재현성"],
          },
          {
            type: "metrics",
            title: "핵심 기술 스택",
            items: [
              "Spring Boot + MQTT/STOMP",
              "Redis + PostgreSQL/TimescaleDB",
              "GitLab CI + Docker + Nginx",
            ],
          },
        ],
      },
      {
        key: "architecture",
        label: "Architecture",
        title: "수집-처리-전파-저장 경계를 분리한 구조",
        summary: "운영 안정성과 상태 정합성을 위해 책임 단위를 명확하게 쪼갠 아키텍처입니다.",
        leftBlocks: [
          {
            title: "설계 의도",
            bullets: [
              "실시간 반영 경로와 이력 저장 경로를 분리해 병목 전파를 줄였습니다.",
              "ACK/FSM 기반 상태 전이로 명령 처리 순서를 강제했습니다.",
              "배포/운영 단계에서도 동일한 구조를 재현할 수 있도록 환경을 표준화했습니다.",
            ],
          },
          {
            title: "책임 분리 방식",
            bullets: [
              "Ingress: MQTT 수신/파싱",
              "Domain: 미션/차량 상태 전이",
              "State Cache: Redis",
              "History Store: PostgreSQL/TimescaleDB",
              "Realtime Fan-out: WebSocket(STOMP)",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "구조도 배치",
            caption: "전체 시스템 구조도 삽입 영역",
            bullets: ["Component boundary", "State transition path", "Realtime broadcast path"],
          },
          {
            type: "figure",
            title: "데이터 흐름",
            caption: "MQTT -> Domain -> Cache/DB -> STOMP 흐름도 삽입 영역",
            bullets: ["입력 검증", "상태 전이", "커밋 후 이벤트 발행"],
          },
        ],
      },
      {
        key: "implementation",
        label: "Implementation",
        title: "구현 디테일과 배포 경로를 함께 설계",
        summary: "기능 구현과 운영 배포를 분리하지 않고 하나의 전달 흐름으로 정리했습니다.",
        leftBlocks: [
          {
            title: "실제 구현 내용",
            bullets: [
              "ACK 매칭 키(vehicleId/commandType/sequence/commandId) 기반 상태 추적 구현",
              "Mission/TowingCar 상태 기계로 허용 전이만 통과",
              "트랜잭션 커밋 이후 이벤트 발행으로 순서 보장",
              "부하 시나리오와 로그/AOP 기반 추적 포인트 구성",
            ],
          },
          {
            title: "기술 선택 이유",
            bullets: [
              "Redis: 실시간 조회와 DB 영속화 경로 분리",
              "TimescaleDB: 시계열 로그 저장/조회 경로 확장",
              "GitLab CI + Docker + Nginx: 배포 재현성과 운영 진입점 표준화",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "배포 흐름",
            caption: "CI -> Image Build -> Container Deploy -> Nginx Routing",
            bullets: ["Pipeline stage", "Runtime topology", "Rollback point"],
          },
          {
            type: "metrics",
            title: "운영 안정성 포인트",
            items: [
              "로그 기반 장애 추적",
              "부하 테스트 시나리오 재현",
              "배포 후 동작 검증 체크리스트",
            ],
          },
        ],
      },
      {
        key: "results",
        label: "Results",
        title: "정합성 중심 설계와 운영 관점 개선 결과",
        summary: "수치와 운영 경험을 분리해 설명 가능한 성과로 정리했습니다.",
        leftBlocks: [
          {
            title: "결과",
            bullets: [
              "상태 정합성 제어(ACK/FSM) 기반으로 명령 처리 안정성 강화",
              "실시간 경로와 저장 경로 분리로 병목 관리 포인트 명확화",
              "서버 구현부터 배포까지 연결된 역할 범위 수행",
            ],
          },
          {
            title: "배운 점 / 한계",
            bullets: [
              "실시간 시스템은 기능보다 정합성/운영 추적 설계가 우선",
              "측정 수치는 실험 조건과 함께 제시해야 설득력 확보",
              "확장 단계에서는 보안 정책과 브로커 구조 고도화 필요",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "증빙 자료",
            items: [
              "성능 수치 카드(자기소개서 기준)",
              "로그 캡처 / 부하 테스트 결과",
              "관제 화면 캡처",
            ],
          },
          {
            type: "figure",
            title: "Before / After",
            caption: "개선 전후 수치 카드 배치 영역",
            bullets: ["지연", "처리 안정성", "운영 재현성"],
          },
        ],
      },
    ],
  },
  {
    id: "robotpal",
    name: "RobotPal",
    oneLine: "실시간 스트리밍 병목을 구조적으로 개선하고 네트워크 전송과 시뮬레이션 움직임을 연결한 프로젝트",
    roleLabel: "네트워크 + 스트리밍 + 시뮬레이션 움직임",
    stackTags: ["C++", "Producer-Consumer", "Queue Policy", "PBO Async Readback", "JPEG Encoding"],
    repo: "https://github.com/cgantro/RobotPal",
    slides: [
      {
        key: "overview",
        label: "Overview",
        title: "스트리밍 병목 개선과 시뮬레이션 연동을 함께 수행",
        summary: "병목 원인 분석부터 구조 개선, 검증까지 실시간 파이프라인 전체를 다뤘습니다.",
        leftBlocks: [
          {
            title: "문제 상황",
            bullets: [
              "렌더-인코딩-전송이 단일 루프에 묶여 프레임 드랍이 발생했습니다.",
              "GPU readback/JPEG 인코딩 구간에서 지연이 집중되었습니다.",
              "스트리밍 처리와 시뮬레이션 객체 업데이트가 상호 간섭했습니다.",
            ],
          },
          {
            title: "내 역할",
            bullets: [
              "네트워크 전송 경로와 스트리밍 파이프라인 재설계를 담당했습니다.",
              "producer-consumer 구조와 drop-oldest queue policy를 적용했습니다.",
              "시뮬레이션 이동 객체 움직임 연동과 검증 루프를 구현했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "핵심 기술 스택",
            items: ["C++", "PBO Async Readback", "Bounded Queue", "Multi Worker Encode"],
          },
          {
            type: "figure",
            title: "문제 구간",
            caption: "기존 단일 루프 병목 지점 표시 다이어그램",
            bullets: ["Render blocking", "Encode queue wait", "Network send lag"],
          },
        ],
      },
      {
        key: "pipeline",
        label: "Streaming Pipeline Redesign",
        title: "렌더 루프와 스트리밍 루프 분리",
        summary: "실시간성을 위해 처리량보다 지연 누적 제어를 우선하는 정책으로 전환했습니다.",
        leftBlocks: [
          {
            title: "설계 의도",
            bullets: [
              "메인 루프에서 인코딩/전송 작업을 분리해 프레임 안정성 확보",
              "큐 포화 시 drop-oldest 정책으로 지연 폭증 방지",
              "네트워크 전송과 시뮬레이션 상태 갱신 경계 분리",
            ],
          },
          {
            title: "책임 분리",
            bullets: [
              "RenderSystem: 프레임 생성",
              "StreamingPipeline: 큐/워커 기반 인코딩",
              "Network transport: 패킷 전송",
              "Simulation update: 이동 객체 상태 반영",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "파이프라인 구조도",
            caption: "Render -> Readback -> Queue -> Encode Worker -> Network",
            bullets: ["thread boundary", "queue policy", "handoff point"],
          },
          {
            type: "metrics",
            title: "정책 기준",
            items: ["실시간성 우선", "지연 누적 억제", "재현 가능한 측정"],
          },
        ],
      },
      {
        key: "implementation",
        label: "Implementation",
        title: "구현과 측정을 함께 설계한 개선 과정",
        summary: "코드 변경과 벤치마크를 분리하지 않고 같은 루프로 검증했습니다.",
        leftBlocks: [
          {
            title: "실제 구현 내용",
            bullets: [
              "StreamingSystemModule에서 렌더 이후 프레임 전달 주기 분리",
              "StreamingWorker 멀티 워커 제어 및 큐 처리 정책 적용",
              "PBO 기반 비동기 readback으로 GPU-CPU sync 대기 완화",
            ],
          },
          {
            title: "기술 선택 이유",
            bullets: [
              "Producer-Consumer: 메인 루프 블로킹 완화",
              "Drop-oldest: 큐 정체 시 지연 확산 방지",
              "A/B Benchmark: 개선 전후 비교 재현성 확보",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "코드 흐름",
            caption: "핵심 처리 흐름(enqueue/dequeue/encode/send) 설명 도식",
            bullets: ["producer", "worker", "consumer"],
          },
          {
            type: "metrics",
            title: "검증 자료",
            items: ["벤치마크 결과 카드", "환경별 반복 측정 로그", "프레임 드랍 추이"],
          },
        ],
      },
      {
        key: "results",
        label: "Results",
        title: "프레임 안정성과 실시간성 중심 개선 결과",
        summary: "평균 성능보다 지연 분포/드랍률을 기준으로 개선 효과를 평가했습니다.",
        leftBlocks: [
          {
            title: "결과",
            bullets: [
              "실시간성 우선 파이프라인으로 프레임 안정성 개선",
              "네트워크 전송-시뮬레이션 연동 경계가 명확해져 디버깅 효율 향상",
              "측정 기반 구조 개선으로 팀 내 설명 가능성 강화",
            ],
          },
          {
            title: "배운 점 / 한계",
            bullets: [
              "정책 선택 근거와 실험 조건을 함께 제시해야 신뢰도 확보",
              "환경 편차가 커 반복 실험과 로그 정리가 필수",
              "추가 개선 시 지연 상한 목표를 더 명확히 정의할 필요",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "결과 수치 카드",
            caption: "FPS/드랍률/지연 지표 전후 비교 영역",
            bullets: ["before", "after", "confidence"],
          },
          {
            type: "metrics",
            title: "증빙 자료",
            items: ["스트리밍 화면 캡처", "병목 분석 리포트", "벤치마크 로그"],
          },
        ],
      },
    ],
  },
  {
    id: "mausoleum",
    name: "mausoleum",
    oneLine: "전용 서버 구조와 보이스 서버, 맵 로딩, 로직 레이어 분리로 멀티플레이 서버 책임을 설계한 프로젝트",
    roleLabel: "서버 + 보이스 서버 + 맵 로딩 + 로직 레이어",
    stackTags: ["Unreal Engine 5", "C++", "Dedicated Server", "WebSocket/UDP", "Room Isolation"],
    repo: "",
    slides: [
      {
        key: "overview",
        label: "Overview",
        title: "멀티플레이 협동 게임 서버 책임을 분리 설계",
        summary: "전용 서버 구조와 룸 단위 분리를 중심으로 게임/보이스/로직 경계를 정리했습니다.",
        leftBlocks: [
          {
            title: "문제 상황",
            bullets: [
              "게임/보이스/맵/로직 경계가 섞이면 운영 복잡도가 빠르게 증가합니다.",
              "룸 단위 세션 분리 없이 동시성 처리를 하면 상태 안정성이 떨어집니다.",
            ],
          },
          {
            title: "내 역할",
            bullets: [
              "UE5 + C++ 전용 서버 구조 설계 및 구현",
              "사설 보이스 서버, 물리 기반 맵 로딩 경로 구성",
              "논리 기반 게임 로직 레이어 분리",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "핵심 기술 스택",
            items: ["UE5/C++", "Dedicated Server", "WebSocket/UDP", "Room Isolation"],
          },
          {
            type: "figure",
            title: "구조 개요",
            caption: "게임 서버-보이스 서버-룸 세션 관리자 관계도",
            bullets: ["session isolation", "server responsibility", "logic boundary"],
          },
        ],
      },
      {
        key: "architecture",
        label: "Server Architecture",
        title: "서버 책임 분리와 룸 단위 격리 구조",
        summary: "장애 전파 범위를 줄이고 유지보수성을 높이는 방향으로 설계했습니다.",
        leftBlocks: [
          {
            title: "설계 의도",
            bullets: [
              "게임 상태 처리와 음성 통신을 분리해 장애 영향 범위 축소",
              "물리 기반 맵 로딩과 게임 규칙 로직 경계 분리",
              "룸 단위 세션 격리로 동시 사용자 처리 안정성 확보",
            ],
          },
          {
            title: "시스템 경계",
            bullets: [
              "Dedicated Game Server",
              "Private Voice Server",
              "Room Session Manager",
              "Map Loading Layer / Logic Layer",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "아키텍처 다이어그램",
            caption: "컴포넌트 경계와 통신 경로(WS/UDP) 시각화 영역",
            bullets: ["join flow", "room mapping", "voice channel"],
          },
          {
            type: "figure",
            title: "시퀀스 흐름",
            caption: "입장 -> 룸 매핑 -> 게임/보이스 경로 흐름도 삽입 영역",
            bullets: ["entry", "state update", "voice routing"],
          },
        ],
      },
      {
        key: "results",
        label: "Results",
        title: "서버 역할 분리 중심의 구현 성과",
        summary: "구조적 기준을 먼저 확립해 이후 기능 확장의 위험을 낮췄습니다.",
        leftBlocks: [
          {
            title: "결과",
            bullets: [
              "서버/보이스/로직/맵 로딩 책임 경계 명확화",
              "룸 단위 세션 분리 기준 정립",
              "멀티 서버 구조의 운영 관점 설명 가능성 확보",
            ],
          },
          {
            title: "배운 점 / 한계",
            bullets: [
              "서버 책임 분리는 성능뿐 아니라 장애 격리 효과가 큼",
              "공개 가능한 코드/수치 근거 연결 시 설득력 추가 확보 가능",
              "추가 검증 단계에서 정량 로그 축적이 필요",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "증빙 자료",
            items: ["서버 구조도", "플레이 화면 캡처", "세션 분리 로그"],
          },
          {
            type: "figure",
            title: "확장 포인트",
            caption: "추가 검증 항목(부하/장애/지연) 배치 영역",
            bullets: ["load", "failure isolation", "latency"],
          },
        ],
      },
    ],
  },
];

export const inProgressDeck = {
  id: "tempolink",
  name: "TempoLink",
  oneLine: "저지연 온라인 합주를 위해 데이터 플레인과 컨트롤 플레인을 분리 설계 중인 진행형 프로젝트",
  roleLabel: "In Progress",
  stackTags: ["C++ Realtime Core", "Spring Boot Control Plane", "P2P", "Jitter Buffer", "Clock Sync"],
  repo: "https://github.com/cgantro/TempoLink",
  slides: [
    {
      key: "motivation",
      label: "Why This Project",
      title: "저지연 온라인 합주를 위한 진행형 프로젝트",
      summary: "완성 성과를 포장하지 않고, 검증 가능한 범위를 단계적으로 좁혀가고 있습니다.",
      leftBlocks: [
        {
          title: "왜 시작했는지",
          bullets: [
            "Syncroom과 같은 저지연 합주 플랫폼을 구축하고 싶었습니다.",
            "또한 앱을 사용하면서 불편했던 기능들에 대하여 개선해보고 싶습니다."
          ],
        },
      ],
      rightBlocks: [
        {
          type: "metrics",
          title: "현재 목표",
          items: ["낮은 지연", "안정적 동기화", "재현 가능한 검증"],
        },
        {
          type: "figure",
          title: "구조 방향",
          caption: "Data Plane / Control Plane 분리 개념도",
          bullets: ["audio path", "signaling path", "fallback path"],
        },
      ],
    },
    {
      key: "scope",
      label: "Current Scope / Next Validation",
      title: "현재 구현 범위와 다음 검증 범위",
      summary: "진행형 프로젝트이므로 구현 범위와 검증 계획을 분리해 관리합니다.",
      leftBlocks: [
        {
          title: "현재 구현 범위",
          bullets: [
            "Clock sync / RTT 추정 및 지터 버퍼 핵심 로직 구현",
            "Room/Signaling 중심 컨트롤 플레인 API 정의",
            "로컬 P2P 연결 및 fallback 전환 시나리오 정리",
          ],
        },
        {
          title: "앞으로 검증할 항목",
          bullets: [
            "2인/4인 세션 지연·손실·지터 자동 수집",
            "P2P 실패 감지와 relay 전환 안정성",
            "플랫폼별 저지연 오디오 경로 실측 데이터 확보",
          ],
        },
      ],
      rightBlocks: [
        {
          type: "metrics",
          title: "검증 산출물",
          items: ["runbook", "session metrics", "network condition report"],
        },
        {
          type: "figure",
          title: "테스트 플랜",
          caption: "실험 조건/측정 항목/판정 기준 표 배치 영역",
          bullets: ["latency", "loss", "jitter"],
        },
      ],
    },
  ],
};
