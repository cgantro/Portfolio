import autowingArchitectureImage from "../../asset/오토잉카_아키텍처.png";

import autowingCardImage from "../../asset/project-autowing-cover.png";
import robotpalCardImage from "../../asset/project-robotpal-cover.png";
import mausoleumCardImage from "../../asset/project-mausoleum-cover.png";

export const featuredProjectDecks = [
  {
    id: "autowing",
    name: "Autowing_car",
    oneLine: "자율주행 토잉카 관제 서버에서 MQTT 텔레메트리와 명령 신뢰성을 설계한 프로젝트",
    cardImage: {
      src: autowingCardImage,
      alt: "Autowing 대표 포스터 이미지",
    },
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
              "공항 견인 작업을 자율주행 토잉카, 관제 UI, 메시징 서버로 연결한 실시간 관제 플랫폼입니다.",
              "저는 MQTT 텔레메트리와 제어 명령 신뢰성 설계를 맡았습니다.",
              "6인 팀에서 백엔드, 메시징, 배포를 담당하며 서버 구조를 주도했습니다.",
            ],
          },
          {
            title: "핵심 기여",
            bullets: [
              "MQTT 수신 파이프라인과 ACK 매칭 흐름을 설계했습니다.",
              "Redis 최신 상태 캐시와 PostgreSQL 이력 저장 경로를 분리했습니다.",
              "Docker와 GitLab CI 기반 배포 파이프라인을 구성했습니다.",
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
              "Spring Boot로 명령 처리, 트랜잭션, 실시간 전파 경계를 관리했습니다.",
              "MQTT 토픽 분리로 차량 텔레메트리와 제어 명령 경로를 나눴습니다.",
              "Redis와 PostgreSQL로 조회용 상태와 이력 저장 책임을 분리했습니다.",
            ],
          },
          {
            title: "부 기술 스택",
            bullets: [
              "STOMP/WebSocket으로 관제 화면에 상태 변화를 실시간 반영했습니다.",
              "Docker와 GitLab CI로 서버 배포 과정을 자동화했습니다.",
              "JWT와 핸드셰이크 토큰으로 HTTP/WS 인증 경로를 분리했습니다.",
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
            title: "문제상황",
            bullets: [
              "저장 결과와 실시간 전파 타이밍이 한 흐름에 묶여 상태 불일치 위험이 있었습니다.",
              "고주파 텔레메트리를 수신할 때마다 즉시 DB에 저장해 쓰기 부담이 빠르게 커졌습니다.",
            ],
          },
          {
            title: "해결",
            bullets: [
              "처리 단계를 분리하고 DB 커밋 이후에만 MQTT/WS 이벤트를 전파하도록 바꿨습니다.",
              "Redis를 쓰기 버퍼로 사용해 DB 저장을 배치화하고 RDP 단순화로 데이터량을 줄였습니다.",
            ],
          },
        ],
        rightBlocks: [
          {
            type: "metrics",
            title: "핵심 수치",
            items: [
              "평균 E2E 지연 14.16ms~28.7ms",
              "payload bytes 90.36% 감소",
              "points(write) 90.00% 감소",
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
              "아쉬운 점: 동시 관제 대수가 늘면 WebSocket fan-out 구간이 먼저 무거워질 수 있습니다. 개선 방향: 외부 브로커 릴레이 구조로 브로드캐스트 병목을 분산할 수 있습니다.",
              "아쉬운 점: 텔레메트리 적재량이 더 늘면 단일 적재 구간의 부담이 커집니다. 개선 방향: TimescaleDB hypertable 또는 Kafka 비동기 적재로 흡수할 수 있습니다.",
              "아쉬운 점: 지도·경로 조회는 데이터 규모가 커질수록 응답 편차가 생길 수 있습니다. 개선 방향: 공간 인덱스와 캐시 무효화 전략을 함께 적용할 수 있습니다.",
            ],
          },
        ],
        rightBlocks: [],
      },
    ],
  },
  {
    id: "robotpal",
    name: "RobotPal",
    oneLine: "카메라 스트리밍 JPEG 병목을 측정하고 멀티 워커 인코딩으로 개선한 C++ 시뮬레이터",
    cardImage: {
      src: robotpalCardImage,
      alt: "RobotPal 대표 포스터 이미지",
    },
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
              "하드웨어 없이 로봇팔 동작과 카메라 스트리밍 경로를 검증하는 C++ 시뮬레이터입니다.",
              "저는 JPEG 인코딩 병목을 측정하고 멀티 워커 구조로 개선했습니다.",
              "4인 팀에서 스트리밍, 인코딩, 벤치마크 모듈을 담당했습니다.",
            ],
          },
          {
            title: "핵심 기여",
            bullets: [
              "libjpeg 기반 JPEG 인코더를 구현했습니다.",
              "워커 수 제어로 싱글/멀티 인코딩 A/B 측정을 설계했습니다.",
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
              "C++17로 프레임 버퍼와 워커 수명 관리를 명시적으로 제어했습니다.",
              "OpenGL 렌더 타겟을 스트리밍 입력으로 직접 연결했습니다.",
              "libjpeg를 사용해 실제 압축 비용을 성능 측정에 포함했습니다.",
            ],
          },
          {
            title: "부 기술 스택",
            bullets: [
              "TCP 수신기로 인코딩 성능과 수신 처리량을 분리 측정했습니다.",
              "워커 수 제어 옵션으로 동일 조건 A/B 테스트를 재현 가능하게 만들었습니다.",
              "iGPU 강제 측정으로 그래픽 환경 편차를 별도로 확인했습니다.",
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
            title: "문제상황",
            bullets: [
              "렌더 프레임 압축과 전송이 메인 루프를 점유해 앱 FPS가 흔들렸습니다.",
              "단일 인코딩 경로에서는 프레임 생성과 압축 작업이 서로 경쟁했습니다.",
            ],
          },
          {
            title: "해결",
            bullets: [
              "생산자-소비자 구조로 렌더 루프와 인코딩 작업을 분리했습니다.",
              "멀티 워커 인코딩으로 압축 작업을 분산해 메인 루프 경쟁을 줄였습니다.",
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
              "아쉬운 점: TCP+JPEG 경로는 네트워크 혼잡 시 지연이 누적됩니다. 개선 방향: UDP 기반 저지연 전송으로 바꾸고 필요 시 FEC/지터 버퍼를 함께 검토할 수 있습니다.",
              "아쉬운 점: JPEG는 동일 화질 대비 대역폭 효율이 제한적입니다. 개선 방향: H.264(가능하면 HW 인코더)로 전환해 압축 효율과 전송량을 개선할 수 있습니다.",
              "아쉬운 점: 프레임 읽기와 인코딩 타이밍이 겹치면 순간 FPS 스파이크가 발생합니다. 개선 방향: PBO 비동기 readback과 더블 버퍼링으로 부하를 평탄화할 수 있습니다.",
            ],
          },
        ],
        rightBlocks: [],
      },
    ],
  },
  {
    id: "mausoleum",
    name: "mausoleum",
    oneLine: "UE5 멀티플레이 게임에서 로비, 게임, 보이스 서버 책임을 분리하고 음성 UX를 개선한 프로젝트",
    cardImage: {
      src: mausoleumCardImage,
      alt: "mausoleum 대표 포스터 이미지",
    },
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
              "UE5 클라이언트, 전용 서버, 로비 서버, UDP 음성 서버를 분리한 멀티플레이 프로젝트입니다.",
              "저는 보이스 UX 개선과 음성 규칙 설계를 담당했습니다.",
              "6인 팀에서 음성 처리, 규칙 설계, 서버 연동 로직을 구현했습니다.",
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
              "UE 전용 서버로 플레이어 상태와 이벤트 판정을 서버 권위로 유지했습니다.",
              "WebSocket으로 방 생성, 입장, 준비 같은 순서 민감 로비 이벤트를 처리했습니다.",
              "UDP로 최신성 우선 음성 전송 경로를 구성했습니다.",
            ],
          },
          {
            title: "부 기술 스택",
            bullets: [
              "C++ RAII 프로파일러로 음성 처리 구간 시간을 자동 기록했습니다.",
              "로비/음성 서버 분리로 게임 월드 부하와 음성 부하를 분산했습니다.",
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
            title: "문제상황",
            bullets: [
              "Alt-Tab 복귀 직후 누적 음성이 한꺼번에 재생돼 지연과 잡음이 생겼습니다.",
              "사망자와 생존자 음성 규칙이 단순하면 정보 노출로 게임성이 무너질 수 있었습니다.",
            ],
          },
          {
            title: "해결",
            bullets: [
              "백그라운드 복귀 시 오래된 캡처 버퍼를 폐기하고 코덱을 리셋했습니다.",
              "상태 기반 청취 규칙을 분리해 정보 과노출을 완화했습니다.",
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
              "아쉬운 점: 네트워크 상태가 급격히 흔들릴 때 UDP 음성 품질 편차가 발생합니다. 개선 방향: 지터 버퍼와 적응형 재생 지연으로 청취 안정성을 높일 수 있습니다.",
              "아쉬운 점: 패킷 유실이 큰 환경에서는 단순 전달만으로 품질 유지가 어렵습니다. 개선 방향: FEC 또는 짧은 구간 재전송 정책을 검토할 수 있습니다.",
              "아쉬운 점: 특정 방에 트래픽이 몰리면 워커 편중이 생길 수 있습니다. 개선 방향: 방 단위 샤딩 수를 동적으로 조절해 부하를 완화할 수 있습니다.",
            ],
          },
        ],
        rightBlocks: [],
      },
    ],
  },
];
