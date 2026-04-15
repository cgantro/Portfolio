import autowingArchitectureImage from "../../asset/오토잉카_아키텍처.png";

export const featuredProjectDecks = [
  {
    id: "autowing",
    name: "Autowing_car",
    oneLine: "자율주행 토잉카 관제 서버에서 MQTT 텔레메트리와 명령 신뢰성을 설계한 프로젝트",
    stackTags: ["Spring Boot", "MQTT", "STOMP", "Redis", "PostgreSQL", "Docker", "GitLab CI"],
    repo: "https://github.com/cgantro/Autowing_car",
    links: [{ label: "깃허브", href: "https://github.com/cgantro/Autowing_car" }],
    slides: [
      {
        key: "overview",
        label: "Overview",
        title: "실시간 토잉카 관제 백엔드",
        leftBlocks: [
          {
            title: "프로젝트 소개",
            bullets: [
              "공항 내 항공기 견인 작업을 자율주행 토잉카, 관제 UI, MQTT 통신, AI/임베디드 제어로 연결한 실시간 관제 플랫폼입니다.",
              "자율주행 토잉카 관제 서버에서 MQTT 텔레메트리와 명령 신뢰성을 설계한 프로젝트입니다.",
              "6인 팀 프로젝트에서 백엔드, 메시징, 배포를 담당했고 담당 모듈 설계와 구현을 주도했습니다.",
            ],
          },
          {
            title: "핵심 기여",
            bullets: [
              "MQTT 수신, ACK 매칭, 차량 상태 전이 로직을 설계했습니다.",
              "Redis 최신 상태 캐시와 PostgreSQL 이력 저장 경로를 분리했습니다.",
              "Docker와 GitLab CI 기반 배포 흐름을 구성했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "figure",
            title: "Autowing_car 아키텍처",
            caption: "사용자 영역, AWS EC2 Docker 네트워크, 로봇 엣지 영역으로 분리한 관제 통신 구조",
            image: {
              src: autowingArchitectureImage,
              alt: "Autowing_car 시스템 아키텍처 구조도",
            },
            bullets: ["HTTPS/WSS 관제 UI", "MQTT 명령·텔레메트리", "WebRTC 영상 스트림"],
          },
        ],
      },
      {
        key: "tech",
        label: "Tech Stack",
        title: "기술 스택",
        leftBlocks: [
          {
            title: "주요 기술 스택",
            bullets: [
              "Spring Boot: 명령 처리, 트랜잭션, WebSocket 브로드캐스트를 한 서비스 경계 안에서 관리했습니다.",
              "MQTT: 차량 텔레메트리와 서버 명령을 토픽 단위로 분리해 실시간 메시징 경로를 구성했습니다.",
              "Redis + PostgreSQL: 최신 상태 조회와 관제 이력 저장 책임을 분리했습니다.",
            ],
          },
          {
            title: "부 기술 스택",
            bullets: [
              "STOMP/WebSocket으로 관제 화면에 상태 변화를 실시간 반영했습니다.",
              "Docker와 GitLab CI로 서버 배포 절차를 자동화했습니다.",
              "JWT와 WebSocket 핸드셰이크 토큰으로 HTTP/WS 인증 경로를 분리했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "stack",
            title: "기술 스택",
            items: ["Spring Boot", "MQTT", "STOMP", "Redis", "PostgreSQL", "Docker", "GitLab CI"],
          },
          {
            type: "metrics",
            title: "선정 이유",
            items: [
              "실시간 명령과 상태 변경을 안정적으로 처리할 수 있는 서버 프레임워크가 필요했습니다.",
              "차량의 짧고 빈번한 메시지는 HTTP 폴링보다 MQTT 토픽 기반 통신이 적합했습니다.",
              "관제 화면의 최신 상태 조회는 Redis로, 감사 가능한 이력은 PostgreSQL로 분리했습니다.",
            ],
          },
        ],
      },
      {
        key: "problem-solving",
        label: "Problem Solving",
        title: "문제 상황 / 해결 / 결과",
        leftBlocks: [
          {
            title: "문제 상황 + 해결 + 결과",
            bullets: [
              "문제: 고주파 텔레메트리, ACK 중복·유실·순서 역전, DB 저장과 실시간 전파가 한 경로에 섞여 있었습니다.",
              "해결: MQTT 수신을 파서 -> 라우터 -> 핸들러 -> 도메인 계층으로 분리하고 ACK를 명령 ID/시퀀스로 매칭했습니다.",
              "해결: DB 커밋 이후에만 MQTT/WS 이벤트를 발행하고 Redis 인덱스 세트와 일괄 조회로 전체 키 스캔을 제거했습니다.",
              "결과: 종단 간 텔레메트리 평균 14ms~28ms를 달성했고, RDP 단순화로 페이로드와 저장 포인트를 약 90% 줄였습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "핵심 수치",
            items: [
              "종단 간 텔레메트리 평균 14ms~28ms",
              "페이로드 바이트 90.36% 감소",
              "저장 포인트 90.00% 감소",
              "5회 반복 검증 손실 0건",
            ],
          },
        ],
      },
      {
        key: "improvement",
        label: "Improvement",
        title: "개선 방향",
        leftBlocks: [
          {
            title: "성능 개선 방향",
            bullets: [
              "대규모 WebSocket fan-out은 Spring simple broker에서 외부 브로커 릴레이 구조로 확장할 수 있습니다.",
              "텔레메트리 저장량이 더 커질 경우 TimescaleDB hypertable 또는 Kafka 기반 비동기 적재를 검토할 수 있습니다.",
              "지도·경로 조회 병목은 공간 인덱스와 캐시 무효화 전략을 결합해 개선할 수 있습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "추가 검증 포인트",
            items: [
              "Java 서비스 + Redis + DB 통합 장기 부하 테스트",
              "ACK/상태 전이 예외 케이스 회귀 테스트",
              "로그인 병목과 실시간 관제 병목 분리 측정",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "robotpal",
    name: "RobotPal",
    oneLine: "카메라 스트리밍 JPEG 병목을 측정하고 멀티 워커 인코딩으로 개선한 C++ 시뮬레이터",
    stackTags: ["C++17", "OpenGL", "libjpeg", "TCP", "벤치마킹"],
    repo: "https://github.com/cgantro/RobotPal",
    links: [{ label: "깃허브", href: "https://github.com/cgantro/RobotPal" }],
    slides: [
      {
        key: "overview",
        label: "Overview",
        title: "카메라 스트리밍 병목 분석",
        leftBlocks: [
          {
            title: "프로젝트 소개",
            bullets: [
              "하드웨어 없이 로봇팔 동작과 카메라 스트리밍 경로를 검증할 수 있는 C++ 시뮬레이터입니다.",
              "카메라 스트리밍 JPEG 병목을 측정하고 멀티 워커 인코딩으로 개선한 프로젝트입니다.",
              "4인 프로젝트에서 스트리밍, 인코딩, 벤치마크 모듈 설계와 구현을 담당했습니다.",
            ],
          },
          {
            title: "핵심 기여",
            bullets: [
              "libjpeg 기반 JPEG 인코더를 구현했습니다.",
              "인코딩 워커 수를 제어해 싱글/멀티 A/B 측정을 수행했습니다.",
              "앱 FPS와 TCP 수신 FPS를 함께 수집해 병목 위치를 분리했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "아키텍처",
            items: [
              "렌더 프레임 -> 프레임 읽기",
              "프레임 큐 -> 인코딩 워커",
              "JPEG 버퍼 -> TCP 전송",
              "TCP 수신기 -> FPS 측정",
            ],
          },
        ],
      },
      {
        key: "tech",
        label: "Tech Stack",
        title: "기술 스택",
        leftBlocks: [
          {
            title: "주요 기술 스택",
            bullets: [
              "C++17: 프레임 버퍼, 인코딩 워커, 큐 수명 관리를 명시적으로 제어했습니다.",
              "OpenGL: 시뮬레이터 렌더 타겟을 스트리밍 입력으로 직접 연결했습니다.",
              "libjpeg: 실제 JPEG 압축 비용을 벤치마크에 포함했습니다.",
            ],
          },
          {
            title: "부 기술 스택",
            bullets: [
              "TCP 수신기로 인코딩 성능과 수신 처리량을 분리 측정했습니다.",
              "워커 수 제어 옵션으로 동일 조건 A/B 테스트를 재현 가능하게 만들었습니다.",
              "iGPU 강제 측정으로 그래픽 환경 편차를 별도 확인했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "stack",
            title: "기술 스택",
            items: ["C++17", "OpenGL", "libjpeg", "TCP", "벤치마킹"],
          },
          {
            type: "metrics",
            title: "측정 조건",
            items: [
              "816 x 616 렌더 타겟",
              "JPEG 품질 70",
              "워커 1개 vs 19개",
              "디버그 빌드, 리비전 b01af42",
            ],
          },
        ],
      },
      {
        key: "problem-solving",
        label: "Problem Solving",
        title: "문제 상황 / 해결 / 결과",
        leftBlocks: [
          {
            title: "문제 상황 + 해결 + 결과",
            bullets: [
              "문제: 렌더 프레임을 JPEG로 압축해 TCP로 보내는 과정에서 앱 FPS가 흔들렸습니다.",
              "해결: 생산자-소비자 구조로 렌더 루프와 인코딩 작업을 분리했습니다.",
              "해결: 멀티 워커 인코딩으로 JPEG 처리와 메인 루프의 경쟁을 줄였습니다.",
              "결과: 앱 FPS는 6.20%, 내장 GPU 환경 앱 FPS는 15.24% 개선됐습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "핵심 수치",
            items: [
              "앱 FPS 55.94 -> 59.41 (+6.20%)",
              "수신 FPS 16.47 -> 17.10 (+3.83%)",
              "내장 GPU 앱 FPS 58.10 -> 66.95 (+15.24%)",
              "내장 GPU 수신 FPS 18.30 -> 21.91 (+19.69%)",
            ],
          },
        ],
      },
      {
        key: "improvement",
        label: "Improvement",
        title: "개선 방향",
        leftBlocks: [
          {
            title: "성능 개선 방향",
            bullets: [
              "프레임 읽기 병목은 PBO 기반 비동기 readback과 더블 버퍼링으로 줄일 수 있습니다.",
              "전송 FPS는 JPEG 품질 동적 조절과 프레임 드롭 정책을 결합해 안정화할 수 있습니다.",
              "반복 측정은 릴리즈 빌드와 해상도별 매트릭스로 확장해 신뢰구간을 좁힐 수 있습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "추가 검증 포인트",
            items: [
              "릴리즈 빌드 3~5회 반복 측정",
              "해상도와 씬 복잡도별 처리량 비교",
              "큐 대기 시간과 프레임 드롭률 추적",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "mausoleum",
    name: "mausoleum",
    oneLine: "UE5 멀티플레이 게임에서 로비, 게임, 보이스 서버 책임을 분리하고 음성 UX를 개선한 프로젝트",
    stackTags: ["Unreal Engine 5", "C++", "전용 서버", "WebSocket", "UDP"],
    slides: [
      {
        key: "overview",
        label: "Overview",
        title: "멀티플레이 보이스 시스템 개선",
        leftBlocks: [
          {
            title: "프로젝트 소개",
            bullets: [
              "UE5 클라이언트, 전용 서버, C++ 로비 서버, UDP 음성 서버를 분리한 멀티플레이 게임 프로젝트입니다.",
              "로비, 게임, 보이스 서버 책임을 분리하고 음성 UX를 개선한 프로젝트입니다.",
              "6인 팀 프로젝트에서 보이스 UX, 음성 규칙, 서버 연동 로직을 담당했습니다.",
            ],
          },
          {
            title: "핵심 기여",
            bullets: [
              "클라이언트 음성 캡처 처리와 코덱 리셋 정책을 구현했습니다.",
              "생존, 사망, 관전 상태에 따른 음성 청취 규칙을 재설계했습니다.",
              "음성 처리 구간을 측정하는 RAII 기반 프로파일러를 추가했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "아키텍처",
            items: [
              "UE 클라이언트 -> 전용 서버",
              "UE 클라이언트 -> 로비 서버(WebSocket)",
              "UE 클라이언트 -> 음성 서버(UDP)",
            ],
          },
        ],
      },
      {
        key: "tech",
        label: "Tech Stack",
        title: "기술 스택",
        leftBlocks: [
          {
            title: "주요 기술 스택",
            bullets: [
              "UE 전용 서버: 플레이어 위치, 상태, 이벤트 판정을 서버 권위로 유지했습니다.",
              "WebSocket: 방 생성, 입장, 준비 상태처럼 순서가 중요한 로비 이벤트에 사용했습니다.",
              "UDP: 오래된 패킷의 완전성보다 최신 음성 프레임 도착이 중요한 경로에 사용했습니다.",
            ],
          },
          {
            title: "부 기술 스택",
            bullets: [
              "C++ RAII 프로파일러로 음성 처리 구간 시간을 자동 기록했습니다.",
              "전용 로비/음성 서버 분리로 게임 월드 부하와 음성 부하를 나눴습니다.",
              "공간화 제어로 로비/인게임 상황에 맞는 재생 방식을 분리했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "stack",
            title: "기술 스택",
            items: ["Unreal Engine 5", "C++", "전용 서버", "WebSocket", "UDP"],
          },
          {
            type: "metrics",
            title: "선정 이유",
            items: [
              "게임 상태는 전용 서버가 권위적으로 관리해야 했습니다.",
              "로비 이벤트는 연결 유지와 순서 보장이 중요했습니다.",
              "음성은 손실 없는 보존보다 최신성 유지가 중요했습니다.",
            ],
          },
        ],
      },
      {
        key: "problem-solving",
        label: "Problem Solving",
        title: "문제 상황 / 해결 / 결과",
        leftBlocks: [
          {
            title: "문제 상황 + 해결 + 결과",
            bullets: [
              "문제: Alt-Tab 이후 누적 음성이 한 번에 재생되어 지연과 잡음이 발생했습니다.",
              "문제: 사망자와 생존자 음성 규칙이 단순하면 정보 노출로 게임성이 깨질 수 있었습니다.",
              "해결: 백그라운드 복귀 시 오래된 캡처 버퍼를 폐기하고 코덱을 리셋했습니다.",
              "결과: 복귀 직후 지연 음성 재생을 제거하고 사망자 정보 과노출을 완화했습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "핵심 결과",
            items: [
              "백그라운드 복귀 직후 지연 음성 재생 제거",
              "사망자 정보 과노출 완화",
              "릴리즈 오버헤드 없는 음성 구간 계측",
            ],
          },
        ],
      },
      {
        key: "improvement",
        label: "Improvement",
        title: "개선 방향",
        leftBlocks: [
          {
            title: "성능 개선 방향",
            bullets: [
              "UDP 음성 품질은 지터 버퍼와 적응형 재생 지연으로 더 안정화할 수 있습니다.",
              "패킷 유실이 큰 환경에서는 FEC 또는 짧은 구간 재전송 정책을 검토할 수 있습니다.",
              "VoiceServer는 방 단위 샤딩 수를 동적으로 조절해 특정 방 트래픽 집중을 완화할 수 있습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "추가 검증 포인트",
            items: [
              "NAT/방화벽 환경별 UDP 품질 테스트",
              "지터와 패킷 유실 조건별 정량 지표 수집",
              "전용 서버 패키징과 LFS 자산 절차 자동화",
            ],
          },
        ],
      },
    ],
  },
];
