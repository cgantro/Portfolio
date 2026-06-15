import robotpalHero from "../../asset/project-robotpal-cover.png";
import mausoleumHero from "../../asset/project-mausoleum-cover.png";
import autowingHero from "../../asset/project-autowing-cover.png";
import stickerHero from "../../asset/Sticker.png";
import stickerCamera from "../../portfolio/assets/camera.jpg";
import stickerWardrobe from "../../portfolio/assets/wardrobe.jpg";
import stickerRecommend from "../../portfolio/assets/recommend.jpg";
import stickerSaved from "../../portfolio/assets/saved.jpg";

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
        "C++ 시뮬레이션 런타임에서 렌더링 이후 readback, JPEG 인코딩, 전달 단계를 분리해 스트리밍 병목을 확인하고 개선한 프로젝트입니다.",
      media: {
        src: robotpalHero,
        alt: "RobotPal preview",
      },
    },
    spotlight: [
      { label: "문제", value: "readback · JPEG 인코딩 · 전달 단계 병목" },
      { label: "역할", value: "C++ 런타임 구조 설계 · 스트리밍 파이프라인 분리" },
      { label: "결과", value: "APP FPS 58.10→66.95 · SINK FPS 18.30→21.91" },
    ],
    context: {
      body: [
        "특히 렌더링 이후 프레임 전달 경로에서 발생하는 병목을 readback, 인코딩, 전달 단계로 나눠 확인했고, 같은 C++ 코어를 데스크톱과 WebAssembly 실행 경로로 확장했습니다.",
      ],
    },
    architectureNotes: [
      "시뮬레이션 루프와 프레임 전달 경로를 나눠 병목 단계를 따로 볼 수 있게 했습니다.",
      "PBO readback 이후 인코딩과 전달 단계는 큐 기반 워커 구조로 분리했습니다.",
      "같은 C++ 코어를 데스크톱과 WebAssembly 경로로 연결하고 웹 실행 조건은 별도 계층에서 맞췄습니다.",
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
      "성능 설명은 실제 실험 문서와 코드에 남은 처리 경로 기준으로 정리했습니다.",
      "과장보다 단계 분리와 측정 조건이 먼저 보이도록 구성했습니다.",
    ],
    links: [
      { label: "GitHub", href: "https://github.com/Junwoo-Seo-1998/RobotPal" },
      { label: "Live Demo", href: "https://junwoo-seo-1998.github.io/RobotPal/" },
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
      eyebrow: "UE5 Multiplayer · Real-time Voice",
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
      { label: "문제", value: "저지연 보이스와 게임 규칙이 같은 흐름에 섞이는 구조" },
      { label: "역할", value: "보이스 클라이언트·서버 파이프라인 구성 · roomCode 워커 큐" },
      { label: "결과", value: "실제 음성 데이터 송수신 복구 · roomCode 워커 큐 분리" },
    ],
    context: {
      body: [
        "UE5 멀티플레이 환경에서 UDP/Opus 기반 보이스 채팅 흐름을 구성했고, 보이스 클라이언트 파이프라인, UDP 보이스 서버 처리 구조, 생사 상태별 청취 규칙을 담당했습니다.",
      ],
    },
    architectureNotes: [
      "보이스 클라이언트는 캡처, 코덱, UDP 전송, 재생 단계로 나눴습니다.",
      "보이스 서버는 roomCode 기준으로 패킷을 워커 큐에 분산했습니다.",
      "청취 가능 여부는 생사 상태별 전략으로 분리해 보이스 파이프라인과 게임 규칙을 분리했습니다.",
    ],
    evidenceNotes: [
      "코드 기준으로 확인 가능한 캡처, 코덱, 전송, 규칙 레이어만 전면에 남겼습니다.",
      "보이스 프로젝트의 핵심이 런타임 구조로 보이도록 시각 흐름을 정리했습니다.",
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
      eyebrow: "Control Backend · State Transition · Route Guidance",
      title: "오토잉카",
      subtitle: "",
      description:
        "관제형 프로토타입에서 미션 상태, MQTT 명령, WebRTC 영상, 맵 그래프 기반 경로 추천을 분리해 상태 설명력을 높인 백엔드 프로젝트입니다.",
      media: {
        src: autowingHero,
        alt: "Autowing towing car",
      },
    },
    spotlight: [
      { label: "문제", value: "상태 전이와 MQTT 이벤트 순서 어긋남" },
      { label: "역할", value: "백엔드 관제 연동 · 상태 전이 기준 · 맵 그래프 경로 추천" },
      { label: "결과", value: "커밋 전 상태 노출 감소 · MQTT/WebRTC 채널 분리" },
    ],
    context: {
      body: [
        "관리 화면의 명령, 차량 상태 보고, 경로 재계산 기준이 서로 다른 문맥으로 보이지 않도록 백엔드 기준 상태 흐름을 정리했고, 영상 확인 경로와 제어 메시지 경로를 분리했습니다.",
      ],
    },
    architectureNotes: [
      "상태 전이의 기준은 백엔드와 DB가 잡고, 화면과 차량 이벤트는 그 흐름을 따라가도록 정리했습니다.",
      "MQTT는 상태와 명령, WebRTC는 영상 확인, AI 결과는 보조 입력으로 나눴습니다.",
      "맵 그래프 기반 경로 추천은 현재 위치와 이미 진행된 구간 기준 재계산 정책과 함께 설명되도록 구성했습니다.",
    ],
    designMetrics: {
      title: "데모 기준 파라미터",
      headers: ["항목", "값", "이유"],
      rows: [
        ["카메라 스트림", "640x480 @ 30fps", "현장 확인이 가능하면서도 네트워크 부담을 크게 키우지 않는 데모 기준"],
        ["AI 처리 주기", "PROCESS_INTERVAL=4", "모든 프레임을 처리하지 않고도 보조 판단 흐름을 확인할 수 있는 기준"],
        ["Mock Telemetry", "100ms = 10Hz", "상태 갱신과 제어 피드백의 균형을 맞춘 기준"],
        ["MQTT Keepalive", "30s", "차량-서버 연결 상태와 재연결 비용의 균형"],
      ],
      note: "정량 성능 개선보다 상태 전이와 채널 책임이 섞이지 않도록 데모 기준 파라미터를 정리하는 데 초점을 맞췄습니다.",
    },
    scenarios: [
      {
        title: "차량 연결 요청",
        items: [
          "관리 화면은 차량 상태와 관제 조건을 먼저 확인합니다.",
          "AI 서버에서 전달된 판단 결과는 보조 입력으로만 사용합니다.",
        ],
      },
      {
        title: "미션 승인과 출발",
        items: [
          "백엔드는 경로를 추천하고, 차량은 상태 보고를 MQTT로 전달합니다.",
          "승인 이후에만 출발 상태로 넘어가도록 상태 전이를 맞춥니다.",
        ],
      },
      {
        title: "차단 구간과 재계산",
        items: [
          "차단 구간이 생기면 현재 위치와 이미 진행된 구간을 기준으로 경로를 다시 추천합니다.",
          "운영자는 영상 피드로 현장 상황을 확인하고, 시스템은 재추천 기준에 따라 이후 상태 흐름을 갱신합니다.",
        ],
      },
      {
        title: "정지와 복귀",
        items: [
          "긴급 정지 이후에는 수동 확인과 해제 조건을 다시 통과해야 합니다.",
          "정지와 복귀도 별도 상태 전이 기준으로 관리해 설명 가능한 흐름을 유지합니다.",
        ],
      },
    ],
    evidenceNotes: [
      "MQTT, WebRTC, 맵 그래프를 각각 다른 책임으로 설명할 수 있도록 구조를 정리했습니다.",
      "실제 운영 시스템처럼 과장하기보다 관제형 프로토타입의 상태 정합성 문제를 중심에 두었습니다.",
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
      eyebrow: "Backend Pipeline · Async Recommendation",
      title: "STICKER",
      subtitle: "",
      description:
        "긴 AI 추천 작업을 SQS로 분리하고, afterCommit 발행과 Redis 중복 방어 기준으로 결과 정합성을 정리한 비동기 백엔드 프로젝트입니다.",
      media: {
        src: stickerHero,
        alt: "Sticker preview",
      },
    },
    spotlight: [
      { label: "문제", value: "긴 AI 작업과 결과 저장 흐름이 한 경로에 섞이는 문제" },
      { label: "역할", value: "SQS 추천 파이프라인 · Redis 중복 방어 · 운영 정책 정리" },
      { label: "결과", value: "afterCommit 발행 · Redis dedup · 실패 유형 분리" },
    ],
    context: {
      body: [
        "추천 생성, 결과 저장, 사용자 알림이 서로 다른 시간축으로 움직이더라도 화면에서 보이는 상태와 내부 저장 상태가 어긋나지 않도록 백엔드 흐름을 정리했습니다.",
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
        description: "입력값 검증과 작업 적재를 먼저 처리해, 긴 AI 작업이 API 응답 경로를 막지 않도록 했습니다.",
        image: stickerWardrobe,
      },
      {
        kicker: "Recommendation",
        title: "비동기 추천 생성",
        description: "추천 생성은 큐 기반으로 분리 처리해 응답 경로와 긴 작업의 책임을 나눴습니다.",
        image: stickerRecommend,
      },
      {
        kicker: "Retention",
        title: "결과 저장과 알림",
        description: "결과 저장과 알림 흐름을 분리해 사용자 화면과 내부 저장 상태가 같은 순서로 보이게 했습니다.",
        image: stickerSaved,
      },
    ],
    architectureNotes: [
      "API 응답 경로와 SQS 기반 추천 작업 흐름을 분리했습니다.",
      "Redis 중복 방어와 저장 직전 dedup 기준을 함께 두어 결과 중복 반영을 줄였습니다.",
      "인증 정책은 추천 파이프라인과 다른 책임으로 두고 별도 흐름에서 관리했습니다.",
    ],
    evidenceNotes: [
      "서비스 기능 소개보다 긴 작업과 결과 정합성을 어떻게 운영 가능한 구조로 바꿨는지를 먼저 보여주도록 정리했습니다.",
      "과장된 성능 수치 대신 실제 정책과 경계 기준을 중심으로 설명했습니다.",
    ],
    designConsiderations: [
      null,
      null,
      {
        title: "토큰 재사용 피해 최소화",
        body: "리프레시 토큰 재사용 문제는 추천 파이프라인과 별개 보안 정책으로 다뤘습니다. 기존 토큰 즉시 폐기와 재사용 감지 시 세션 무효화를 연결해 공격 범위를 줄이는 쪽에 초점을 맞췄습니다.",
      },
    ],
    links: [],
    sections: FORMAL_SECTIONS,
  },
};
