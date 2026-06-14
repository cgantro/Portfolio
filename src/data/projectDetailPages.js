import robotpalHero from "../../asset/로봇팔 시연.webp";
import mausoleumHero from "../../asset/영묘.png";
import autowingHero from "../../asset/오토잉카_실물.png";
import stickerHero from "../../asset/Sticker.png";
import stickerCamera from "../../portfolio/assets/camera.jpg";
import stickerWardrobe from "../../portfolio/assets/wardrobe.jpg";
import stickerRecommend from "../../portfolio/assets/recommend.jpg";
import stickerSaved from "../../portfolio/assets/saved.jpg";

const stickerPortfolioHref = `${import.meta.env.BASE_URL}sticker-portfolio/index.html`;

const FORMAL_SECTIONS = [
  { id: "implementation", label: "구현" },
  { id: "troubleshooting", label: "트러블슈팅" },
  { id: "architecture", label: "아키텍처" },
  { id: "retrospective", label: "회고" },
];

export const projectDetailPages = {
  robotpal: {
    theme: {
      accent: "#7dd3fc",
      accentSoft: "rgba(125, 211, 252, 0.16)",
      surface: "linear-gradient(160deg, rgba(56, 189, 248, 0.18), rgba(14, 116, 144, 0.03))",
      glow: "rgba(56, 189, 248, 0.28)",
    },
    hero: {
      eyebrow: "Simulation · Streaming · Web Build",
      title: "RobotPal",
      subtitle: "",
      description:
        "C++ 시뮬레이션 런타임에서 렌더링, readback, 인코딩, 전송 경계를 분리해 스트리밍 병목을 개선했습니다.",
      media: {
        src: robotpalHero,
        alt: "RobotPal preview",
      },
    },
    spotlight: [
      { label: "역할", value: "C++ 런타임 설계 · 스트리밍 최적화" },
      { label: "문제", value: "readback·인코딩·전달 병목" },
      { label: "결과", value: "APP FPS 58.10→66.95 · SINK FPS 18.30→21.91" },
    ],
    context: {
      body: [
        "C++ 기반 로봇팔 시뮬레이션·스트리밍 프로젝트입니다. 저는 렌더링 이후 프레임 전달 경로에서 발생하는 병목을 readback, 인코딩, 전달 단계로 나눠 확인하고 개선했습니다.",
      ],
      facts: [
        { label: "프로젝트", value: "C++ 기반 로봇팔 시뮬레이션 · 실시간 스트리밍 플랫폼" },
        { label: "내 역할", value: "런타임 경계 설계 · 스트리밍 최적화 · 웹 빌드 대응" },
        { label: "핵심 포인트", value: "파이프라인 병목을 계측하고 단계 분리로 해결" },
      ],
    },
    architectureNotes: [
      "시뮬레이터 루프는 상태 계산과 렌더링에 집중하고, 프레임 전달은 별도 단계로 분리했습니다.",
      "GPU readback은 PBO ping-pong 구조로 비동기화했습니다.",
      "인코딩과 전달 단계는 큐 기반 워커 구조로 분리했습니다.",
    ],
    benchmarkTable: {
      title: "워커 수별 스트리밍 실험 요약",
      headers: ["조건", "APP FPS (앱 루프)", "SINK FPS (수신 측)", "해석"],
      rows: [
        ["Single Worker", "58.10", "18.30", "단일 워커 조건에서 인코딩 처리량이 프레임 생산 속도를 따라가지 못함"],
        ["12 Workers", "66.95", "21.91", "동일 시나리오에서 처리량 개선 확인"],
      ],
      note: "APP FPS는 시뮬레이터 앱 루프 FPS, SINK FPS는 수신 측 스트리밍 FPS입니다. 측정은 같은 장비, 해상도, 입력 FPS, JPEG 품질 기준에서 Single Worker 대비 12 Workers 조건을 비교했고, APP FPS 58.10→66.95, SINK FPS 18.30→21.91 개선을 확인했습니다.",
    },
    evidenceNotes: [
      "병목 설명은 벤치마크 문서에서 수치가 확인되는 항목만 사용했습니다.",
      "웹 대응 설명은 Emscripten 빌드와 COI Service Worker 적용처럼 소스에서 검증 가능한 구조만 남겼습니다.",
      "주장보다 경계와 측정값을 우선해, C++ 시스템 설계 역량이 드러나도록 정리했습니다.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Junwoo-Seo-1998/RobotPal" },
      { label: "Live Demo", href: "https://junwoo-seo-1998.github.io/RobotPal/" },
    ],
    sections: FORMAL_SECTIONS,
  },
  autowing: {
    theme: {
      accent: "#4ade80",
      accentSoft: "rgba(74, 222, 128, 0.15)",
      surface: "linear-gradient(160deg, rgba(16, 185, 129, 0.18), rgba(20, 83, 45, 0.03))",
      glow: "rgba(16, 185, 129, 0.26)",
    },
    hero: {
      eyebrow: "Control Center · Route Planning · Vehicle Ops",
      title: "오토잉카",
      subtitle: "",
      description:
        "관제형 프로토타입에서 미션 상태, MQTT 명령, WebRTC 영상, 인메모리 맵 그래프 기반 경로 추천을 분리해 상태 설명력을 높인 백엔드 프로젝트입니다.",
      media: {
        src: autowingHero,
        alt: "Autowing towing car",
      },
    },
    spotlight: [
      { label: "역할", value: "백엔드 관제 연동 · 맵 그래프 경로 추천" },
      { label: "문제", value: "상태 전이와 이벤트 순서 어긋남" },
      { label: "결과", value: "커밋 전 상태 노출 감소 · 채널 분리" },
    ],
    context: {
      body: [
        "공항 토잉카 관제 상황을 가정한 프로토타입 프로젝트입니다. 저는 백엔드 관제 연동, 인메모리 맵 그래프 기반 경로 추천, 실시간 채널 분리를 맡았고, 핵심은 관리 화면의 명령, 저장 순서, 우회 기준, 채널 책임이 같은 문맥으로 보이게 만드는 것이었습니다.",
      ],
      facts: [
        { label: "프로젝트", value: "공항 토잉카 관제 상황을 가정한 맵 그래프 기반 경로 추천 프로토타입" },
        { label: "내 역할", value: "백엔드 관제 연동 · 맵 그래프 기반 경로 추천 · 실시간 채널 분리" },
        { label: "핵심 포인트", value: "상태 전이, 이벤트 순서, 채널 책임을 설명 가능한 규칙으로 정리" },
      ],
    },
    architectureNotes: [
      "관리 UI는 승인과 모니터링에 집중하고, 백엔드는 명령 라우팅과 인메모리 맵 그래프 기반 경로 추천을 담당합니다.",
      "즉시성이 중요한 제어 메시지는 MQTT로, 현장 확인용 영상은 WebRTC 기반 스트림으로 분리해 같은 지연 기준으로 다루지 않도록 했습니다.",
      "우회와 재출발은 현재 위치와 이미 진행된 구간을 기준으로 그래프 탐색 시작점을 다시 잡아 시나리오 흐름과 맞췄습니다.",
    ],
    designMetrics: {
      title: "프로토타입 기준 파라미터",
      headers: ["항목", "값", "이유"],
      rows: [
        ["카메라 스트림", "640x480 @ 30fps", "현장 확인이 가능하면서도 통신 부담을 과하게 키우지 않는 데모 기준" ],
        ["AI 처리 주기", "PROCESS_INTERVAL=4", "모든 프레임을 처리하지 않고도 판단 결과 연동 흐름을 확인할 수 있도록 절충" ],
        ["Mock Telemetry", "100ms = 10Hz", "상태 갱신과 제어 피드백의 균형을 맞추기 위한 기준" ],
        ["MQTT Keepalive", "30s", "차량-서버 연결 상태와 재연결 비용의 균형" ],
      ],
      note: "정량 성능 개선보다 관제 흐름이 끊기지 않도록 각 데이터의 갱신 주기와 채널 책임을 정리하는 데 초점을 맞췄습니다.",
    },
    evidenceNotes: [
      "설계 근거는 프로토타입 환경에서 사용한 파라미터와 코드 설정값 기준으로만 남겼습니다.",
      "영상 품질, AI 처리 주기, 텔레메트리 주파수는 각각 다른 병목과 책임을 가진다는 점을 분리해 설명했습니다.",
      "오토잉카는 알고리즘 자랑보다 상태 전이, 이벤트 순서, 채널 책임을 구조화한 점이 더 잘 보여야 한다고 판단했습니다.",
    ],
    sections: FORMAL_SECTIONS,
  },
  mausoleum: {
    theme: {
      accent: "#f59e0b",
      accentSoft: "rgba(245, 158, 11, 0.15)",
      surface: "linear-gradient(160deg, rgba(245, 158, 11, 0.16), rgba(120, 53, 15, 0.04))",
      glow: "rgba(245, 158, 11, 0.24)",
    },
    hero: {
      eyebrow: "UE5 Multiplayer · Voice Runtime",
      title: "영묘",
      subtitle: "",
      description:
        "UE5 환경에서 roomCode 기반 보이스 워커 큐, Opus 음성 처리, 생사 상태별 청취 규칙을 분리한 실시간 오디오 프로젝트입니다.",
      media: {
        src: mausoleumHero,
        alt: "Mausoleum preview",
      },
    },
    spotlight: [
      { label: "역할", value: "보이스 클라이언트·서버 · roomCode 처리" },
      { label: "문제", value: "저지연 보이스와 게임 규칙 결합" },
      { label: "결과", value: "실제 음성 데이터 송수신 복구 · roomCode 워커 큐 분리" },
    ],
    context: {
      body: [
        "UE5 멀티플레이 환경에서 UDP/Opus 기반 보이스 채팅 흐름을 구성한 프로젝트입니다.",
        "저는 보이스 클라이언트 파이프라인, UDP 보이스 서버 처리 구조, 생사 상태별 청취 규칙을 담당했습니다.",
      ],
      facts: [
        { label: "프로젝트", value: "UE5 멀티플레이 · UDP/Opus 보이스 파이프라인 · 청취 규칙 분리" },
        { label: "내 역할", value: "보이스 채팅 전담 · roomCode 기반 보이스 처리 구조 개선 · 규칙 분리" },
        { label: "핵심 포인트", value: "보이스 파이프라인, 워커 큐, 청취 규칙을 다른 경계로 분리" },
      ],
    },
    architectureNotes: [
      "보이스 클라이언트는 캡처, 코덱, UDP 전송, 재생 단계로 나눴습니다.",
      "보이스 서버는 roomCode 기준으로 패킷을 워커 큐에 분산했습니다.",
      "청취 가능 여부는 생사 상태별 전략으로 분리해 보이스 파이프라인과 게임 규칙을 분리했습니다.",
    ],
    evidenceNotes: [
      "보이스 관련 설명은 UE5 캡처/코덱/네트워크 구조에서 직접 확인 가능한 항목 위주로 남겼습니다.",
      "보이스 서버 쪽은 UDP endpoint, roomCode 기반 워커 큐, 청취 규칙 분리를 중심으로 정리했습니다.",
      "이 프로젝트는 수치보다도 왜 UDP/Opus 파이프라인과 분리된 규칙 구조가 필요했는지를 보여주는 쪽이 더 중요했습니다.",
    ],
    sections: FORMAL_SECTIONS,
  },
  sticker: {
    theme: {
      accent: "#fb7185",
      accentSoft: "rgba(251, 113, 133, 0.16)",
      surface: "linear-gradient(160deg, rgba(251, 113, 133, 0.16), rgba(136, 19, 55, 0.03))",
      glow: "rgba(251, 113, 133, 0.24)",
    },
    hero: {
      eyebrow: "Digital Wardrobe · Async AI Pipeline",
      title: "STICKER",
      subtitle: "",
      description:
        "긴 AI 추천 작업을 API 응답 경로에서 분리하고, 커밋 이후 발행·중복 방어·실패 분류 기준을 정리한 비동기 백엔드 프로젝트입니다.",
      media: {
        src: stickerHero,
        alt: "Sticker preview",
      },
    },
    spotlight: [
      { label: "역할", value: "SQS 추천 파이프라인 · Redis 정책" },
      { label: "문제", value: "긴 AI 작업과 결과 상태 어긋남" },
      { label: "결과", value: "커밋 이후 발행 · 중복 방지 · 실패 분류" },
    ],
    context: {
      body: [
        "비동기 AI 추천 백엔드 프로젝트입니다. 저는 SQS 추천 파이프라인, Redis 락·dedup, 인증과 토큰 정책을 맡았고, 핵심은 긴 작업을 앱 응답과 분리하고 커밋 이후 발행, 중복 실행 방어, 실패 분류 기준을 구조로 남기는 것이었습니다.",
      ],
      facts: [
        { label: "프로젝트", value: "비동기 AI 추천 · 운영 중심 백엔드 서비스" },
        { label: "내 역할", value: "추천 파이프라인 담당 · 정합성 설계 · 인증 정책 정리" },
        { label: "핵심 포인트", value: "afterCommit 발행, 중복 방지, 실패 분류 기준 정리" },
      ],
    },
    userFlows: [
      {
        kicker: "Upload",
        title: "의류 등록",
        description: "업로드된 의류 데이터를 추천 입력으로 사용할 수 있도록 저장 흐름을 구성했습니다.",
        image: stickerCamera,
      },
      {
        kicker: "Request",
        title: "추천 요청",
        description: "사용자 입력과 저장된 옷장 데이터를 검증한 뒤, 긴 AI 작업이 앱 응답 경로를 막지 않도록 큐 적재 단계로 넘겼습니다.",
        image: stickerWardrobe,
      },
      {
        kicker: "Recommendation",
        title: "비동기 추천 생성",
        description: "앱 응답과 긴 AI 작업을 분리해, 사용자는 막히지 않고 추천 작업은 큐 기반으로 분리 처리되도록 만들었습니다.",
        image: stickerRecommend,
      },
      {
        kicker: "Retention",
        title: "저장과 알림",
        description: "결과 저장과 알림 흐름을 분리해, 사용자에게 보이는 상태와 내부 상태가 어긋나지 않게 했습니다.",
        image: stickerSaved,
      },
    ],
    architectureNotes: [
      "앱 요청은 Spring Boot API에서 검증하고, 긴 AI 작업은 큐를 통해 분리해 같은 요청 경로에 묶지 않았습니다.",
      "중복 실행, 재시도, 결과 저장 기준을 각각 분리해 한 종류의 실패가 전체 추천 흐름을 무너뜨리지 않게 했습니다.",
      "인증/토큰 정책은 별도 책임으로 두어, 비동기 작업 정합성과 사용자 세션 관리가 직접 섞이지 않도록 했습니다.",
    ],
    evidenceNotes: [
      "정량 수치가 없는 영역은 억지 성능 수치 대신 TTL, 락, 메시지 삭제/재처리 정책, 토큰 회전 전략 같은 코드 경계로 설명했습니다.",
      "AI 기능 소개보다도 비동기 소비기, 중복 방지, 운영 파이프라인 분리를 중심으로 백엔드 강점이 드러나게 정리했습니다.",
      "추천 품질보다 먼저 운영 품질을 보장하는 구조를 설계했다는 점이 이 프로젝트의 핵심이라고 판단했습니다.",
    ],
    designConsiderations: [
      null,
      null,
      {
        title: "탈취 이후의 피해 최소화",
        body: "리프레시 토큰은 한 번 유출되면 조용히 오래 악용될 수 있습니다. 기존 토큰을 즉시 폐기하고 재사용 시 전체 세션을 무효화하는 쪽이 서비스 보안 경계에 더 적합하다고 판단했습니다.",
      },
    ],
    links: [],
    sections: FORMAL_SECTIONS,
  },
};
