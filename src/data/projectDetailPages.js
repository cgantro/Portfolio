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
      eyebrow: "시뮬레이션 · 실시간 화면 전달 · 웹 실행",
      title: "RobotPal",
      subtitle: "",
      description:
        "C++ 시뮬레이터에서 렌더링 이후 readback, JPEG 인코딩, 전달 단계를 나눠 스트리밍 병목을 줄였습니다.",
      media: {
        src: robotpalHero,
        alt: "RobotPal preview",
      },
    },
    spotlight: [
      { label: "역할", value: "C++ 런타임 설계 · 스트리밍 경계 분리" },
      { label: "문제", value: "readback·JPEG 인코딩·전달 병목" },
      { label: "결과", value: "APP FPS 58.10→66.95 · SINK FPS 18.30→21.91" },
    ],
    context: {
      body: [
        "C++ 기반 로봇팔 시뮬레이션 프로젝트입니다. 저는 렌더링 뒤 프레임을 readback하고 JPEG로 인코딩해 전달하는 과정에서 어디서 병목이 생기는지 나눠 확인하고 개선했습니다.",
      ],
    },
    architectureNotes: [
      "시뮬레이터 본체는 동작 계산과 화면 출력에 집중하고, 화면 전달은 따로 분리했습니다.",
      "화면 데이터를 꺼내오는 단계는 PBO 구조로 나눠 한 번에 기다리는 시간을 줄였습니다.",
      "압축과 전달은 작업 큐로 나눠 한 단계가 느려져도 전체가 같이 멈추지 않게 했습니다.",
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
      "성능 설명은 실제 실험 문서에서 확인된 수치만 사용했습니다.",
      "웹 실행 설명도 코드와 빌드 설정에서 확인되는 내용만 남겼습니다.",
      "과장보다 실제로 나눈 단계와 측정 결과가 먼저 보이도록 정리했습니다.",
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
      eyebrow: "관제 화면 · 차량 제어 · 경로 안내",
      title: "오토잉카",
      subtitle: "",
      description:
        "관제형 프로토타입에서 MQTT 명령, WebRTC 영상, 인메모리 맵 그래프 기반 경로 안내가 서로 엇갈리지 않도록 백엔드 흐름을 정리한 프로젝트입니다.",
      media: {
        src: autowingHero,
        alt: "Autowing towing car",
      },
    },
    spotlight: [
      { label: "역할", value: "관제 화면 연동 · 맵 그래프 경로 추천" },
      { label: "문제", value: "상태 전이와 MQTT 이벤트 순서 어긋남" },
      { label: "결과", value: "커밋 전 상태 노출 감소 · MQTT/WebRTC 분리" },
    ],
    context: {
      body: [
        "공항 토잉카 관제 상황을 가정한 프로토타입 프로젝트입니다. 저는 관제 화면 연동, 인메모리 맵 그래프 기반 경로 추천, MQTT·WebRTC 채널 분리를 맡았고, 관리 화면의 명령과 실제 차량 상태가 같은 흐름으로 보이게 만드는 데 집중했습니다.",
      ],
    },
    architectureNotes: [
      "관리 화면은 승인과 모니터링에 집중하고, 백엔드는 MQTT 명령 전달과 맵 그래프 기반 경로 안내를 담당합니다.",
      "차량 제어 메시지는 MQTT, 현장 확인 영상은 WebRTC로 분리해 같은 기준으로 처리하지 않게 했습니다.",
      "길이 막히면 현재 위치와 마지막으로 지난 노드를 기준으로 다시 안내를 시작하게 했습니다.",
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
      "설명은 실제 프로토타입 설정값과 코드에서 확인되는 내용만 남겼습니다.",
      "영상, AI 판단, 차량 상태는 용도와 속도가 다르다는 점이 보이도록 나눠 설명했습니다.",
      "복잡한 알고리즘보다 상태와 알림 순서를 맞춘 구조가 먼저 보이도록 정리했습니다.",
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
      eyebrow: "UE5 멀티플레이 · 실시간 음성",
      title: "영묘",
      subtitle: "",
      description:
        "UE5 환경에서 UDP/Opus 보이스 파이프라인과 roomCode 기반 서버 처리, 생사 상태별 청취 규칙을 나눠 정리한 프로젝트입니다.",
      media: {
        src: mausoleumHero,
        alt: "Mausoleum preview",
      },
    },
    spotlight: [
      { label: "역할", value: "보이스 파이프라인 설계 · roomCode 서버 처리" },
      { label: "문제", value: "UDP/Opus 처리와 게임 규칙이 섞이는 문제" },
      { label: "결과", value: "실제 음성 송수신 복구 · roomCode 워커 큐 분리" },
    ],
    context: {
      body: [
        "UE5 멀티플레이 환경에서 UDP/Opus 기반 실시간 보이스 채팅 흐름을 구성한 프로젝트입니다.",
        "저는 음성 입력부터 재생까지의 파이프라인, roomCode 기준 서버 처리 순서, 생사 상태에 따른 청취 규칙을 맡았습니다.",
      ],
    },
    architectureNotes: [
      "클라이언트는 캡처, Opus 인코딩, UDP 전송, 재생 단계를 나눴습니다.",
      "서버는 roomCode 기준으로 같은 방의 음성이 섞이지 않도록 처리 흐름을 나눴습니다.",
      "누가 누구의 음성을 들을 수 있는지는 별도 전략 규칙으로 분리했습니다.",
    ],
    evidenceNotes: [
      "음성 설명은 실제 코드에서 확인되는 입력, 압축, 전송, 재생 흐름만 남겼습니다.",
      "서버는 방 단위 처리와 청취 규칙 분리가 보이도록 정리했습니다.",
      "이 프로젝트는 성능 수치보다 역할 분리가 왜 필요했는지가 먼저 읽히도록 다듬었습니다.",
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
      eyebrow: "디지털 옷장 · 비동기 추천 처리",
      title: "STICKER",
      subtitle: "",
      description:
        "오래 걸리는 AI 추천 작업을 SQS로 분리하고, afterCommit 발행과 Redis 중복 방지 기준으로 저장 순서가 엇갈리지 않게 정리한 백엔드 프로젝트입니다.",
      media: {
        src: stickerHero,
        alt: "Sticker preview",
      },
    },
    spotlight: [
      { label: "역할", value: "SQS 추천 파이프라인 · Redis 정책 정리" },
      { label: "문제", value: "긴 AI 작업과 저장 결과 어긋남" },
      { label: "결과", value: "afterCommit 발행 · Redis 중복 방지 · 실패 구분" },
    ],
    context: {
      body: [
        "비동기 AI 추천 백엔드 프로젝트입니다. 저는 SQS 기반 추천 작업 흐름, Redis 중복 실행 방지, 인증 정책을 맡았고, 오래 걸리는 작업이 사용자 요청과 섞이지 않도록 정리하는 데 집중했습니다.",
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
      "사용자 요청을 받는 API와 SQS 기반 추천 작업을 분리했습니다.",
      "Redis 중복 방지, 재시도, 결과 저장 기준을 따로 두어 한 번의 실패가 전체 흐름을 망치지 않게 했습니다.",
      "인증 정책도 별도 책임으로 두어 추천 처리와 직접 섞이지 않게 했습니다.",
    ],
    evidenceNotes: [
      "수치가 없는 부분은 과장하지 않고, 실제 정책과 처리 기준 중심으로 설명했습니다.",
      "AI 기능 자체보다 오래 걸리는 작업을 어떻게 운영 가능한 흐름으로 바꿨는지가 보이도록 정리했습니다.",
      "추천 정확도보다 먼저 서비스 흐름이 꼬이지 않게 만든 점이 드러나도록 다듬었습니다.",
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
