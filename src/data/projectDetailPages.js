import robotpalHero from "../../asset/로봇팔 시연.webp";
import mausoleumHero from "../../asset/영묘.png";
import autowingHero from "../../asset/오토잉카_실물.png";
import stickerHero from "../../asset/Sticker.png";
import stickerCamera from "../../portfolio/assets/camera.jpg";
import stickerWardrobe from "../../portfolio/assets/wardrobe.jpg";
import stickerRecommend from "../../portfolio/assets/recommend.jpg";
import stickerVoice from "../../portfolio/assets/voice.jpg";
import stickerCodimaker from "../../portfolio/assets/codimaker.jpg";
import stickerSaved from "../../portfolio/assets/saved.jpg";

const stickerPortfolioHref = `${import.meta.env.BASE_URL}sticker-portfolio/index.html`;

const FORMAL_SECTIONS = [
  { id: "overview", label: "개요" },
  { id: "architecture", label: "아키텍처" },
  { id: "implementation", label: "구현" },
  { id: "troubleshooting", label: "트러블슈팅" },
  { id: "evidence", label: "근거" },
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
      subtitle: "JETANK 후배들이 더 빠르게 실험과 연동을 시작할 수 있게 만든 플랫폼",
      description:
        "JETANK 로봇팔을 사용하는 후배들이 데이터 수집, 학습, 연동을 더 빠르고 간편하게 시작할 수 있도록 시뮬레이터와 스트리밍, 웹 배포 경로를 하나의 플랫폼으로 묶은 프로젝트입니다.",
      media: {
        src: robotpalHero,
        alt: "RobotPal preview",
      },
    },
    context: {
      body: [
        "RobotPal의 출발점은 JETANK를 사용하는 후배들이 데이터 수집과 학습, 실제 연동을 시작할 때 준비 비용이 너무 크다는 점이었습니다. 실물을 바로 붙이기 전에 반복 실험을 돌릴 수 있는 공통 플랫폼이 필요했습니다.",
        "그래서 이 프로젝트는 단순 시뮬레이터가 아니라, 가상 실험 환경과 스트리밍 경로, 웹 접근성을 묶어 후배들이 더 빠르고 간편하게 실험 흐름을 시작하도록 돕는 기반으로 설계했습니다.",
      ],
      facts: [
        { label: "목적", value: "JETANK 후속 실험/연동 진입 비용 절감" },
        { label: "핵심 범위", value: "시뮬레이터 + 스트리밍 + 웹 접근성" },
        { label: "역할", value: "공통 실험 플랫폼과 성능 경로 정리" },
      ],
    },
    architectureNotes: [
      "시뮬레이터 본체는 렌더 루프와 상태 갱신을 담당하고, 프레임 전달은 별도 단계로 분리했습니다.",
      "GPU readback은 PBO 기반 비동기 구조로 옮겨 렌더 루프가 즉시 멈추지 않도록 했습니다.",
      "데스크톱 전달 경로와 웹 전달 경로를 함께 유지해, 후배들이 설치형과 브라우저형 접근을 모두 쓸 수 있게 했습니다.",
    ],
    benchmarkTable: {
      title: "카메라 스트리밍 병목 분석 문서 기준 통합 평균",
      headers: ["구성", "APP FPS", "SINK FPS", "해석"],
      rows: [
        ["싱글 인코딩", "58.10", "18.30", "메인 루프와 인코딩 경쟁이 큼"],
        ["멀티 인코딩", "66.95", "21.91", "APP +8.85 FPS / SINK +3.61 FPS"],
      ],
      note: "문서 `카메라스트리밍 병목분석.md`의 통합 평균 기준",
    },
    evidenceNotes: [
      "README의 Overview와 Performance Note를 기준으로 시뮬레이터 목적과 PBO readback 구조를 정리했습니다.",
      "웹 경로는 Emscripten 빌드와 COI(Service Worker) 대응을 기준으로 설명했습니다.",
      "수치 근거는 병목 분석 문서에서 확인 가능한 값만 사용했습니다.",
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
      subtitle: "공항 지상에서 토잉카와 항공기 이동을 다루는 관제 시스템",
      description:
        "관제탑, 토잉카, 기장, 마샬러가 얽힌 공항 지상 이동 시나리오를 기준으로, 명령 채널, 라이브 피드, 경로 재탐색, 수동 전환 절차를 정리한 프로젝트입니다.",
      media: {
        src: autowingHero,
        alt: "Autowing towing car",
      },
    },
    context: {
      body: [
        "오토잉카는 단순 자율주행 차량 데모보다 관제 상황판에 가깝습니다. 연결 요청, 이동 승인, 마샬러 신호, 비상 정지, 차단 구간 우회 같은 실제 운용 절차를 먼저 정하고 그 절차를 시스템 경로에 매핑합니다.",
        "이 프로젝트에서 중요한 것은 한 기술의 화려함보다 역할 분리였습니다. 명령과 상태는 MQTT로, 현장 영상은 WebRTC로, 경로 탐색은 백엔드와 온보드 플래너가 다른 층에서 나눠 맡도록 정리했습니다.",
      ],
      facts: [
        { label: "도메인", value: "공항 스마트 토잉카 관제" },
        { label: "중심 흐름", value: "도킹 · 승인 · 주행 · 비상 · 재탐색" },
        { label: "역할", value: "백엔드 관제 연동과 시나리오 정리" },
      ],
    },
    architectureNotes: [
      "관제실은 운영 UI와 라이브 피드 확인을 담당하고, 백엔드는 명령 라우팅과 경로 계산을 맡습니다.",
      "차량 제어 메시지는 MQTT 경로를 통해 전달하고, 영상은 WebRTC 경로로 분리해 지연 특성이 다른 데이터를 섞지 않도록 했습니다.",
      "AI 모듈은 도킹과 마샬러 수신호를 보조 판단하는 역할로 연결됩니다.",
    ],
    designMetrics: {
      title: "코드와 설정에서 확인되는 설계 기준",
      headers: ["항목", "값", "설계 이유"],
      rows: [
        ["카메라 스트림 기본값", "640x480 @ 30fps", "관제 화면에서 확인 가능한 해상도와 장치 부하의 균형"],
        ["도킹 AI 처리 간격", "PROCESS_INTERVAL=4", "30fps 입력을 유효 약 7.5fps 처리로 낮춰 CPU 부하 절감"],
        ["Mock Telemetry", "100ms = 10Hz", "UI 상태 갱신과 제어 피드백을 과도한 부하 없이 확인"],
        ["STOMP 요청 타임아웃", "10s", "응답 대기와 오류 처리 경계를 명확히 하기 위한 기준"],
        ["MQTT Keepalive / Reconnect", "30s / 최대 30s", "연결 유지와 재시도 폭주 방지의 균형"],
      ],
      note: "성과 수치가 아니라 설계 파라미터와 운영 기준값",
    },
    evidenceNotes: [
      "WebRTC 스트림 기본값은 `embedded/videos/webRTC.py`의 `width=640, height=480, fps=30` 기준입니다.",
      "도킹 AI의 `PROCESS_INTERVAL=4`는 주석에 CPU 부하 감소 목적이 명시되어 있습니다.",
      "프론트 mock telemetry는 `100ms (10Hz)` 주기로, STOMP request 기본 타임아웃은 `10000ms`, 재연결 상한은 `30000ms`입니다.",
      "MQTT keepalive는 `30s`로 설정되어 있어 차량-서버 연결 유지 기준을 확인할 수 있습니다.",
    ],
    designConsiderations: [
      {
        title: "명령과 영상 채널 분리",
        body: "제어 메시지는 작고 즉시 처리되어야 하지만 영상은 대역폭과 지연 특성이 다르기 때문에, MQTT와 WebRTC를 분리해 운영 책임을 선명하게 뒀습니다.",
      },
      {
        title: "재탐색 기준점 명확화",
        body: "차단 구간 이후에는 처음부터 전체 경로를 다시 계산하는 것보다 현재 위치와 마지막 통과 노드를 기준으로 다시 계산해야 실제 운영 절차에 맞았습니다.",
      },
      {
        title: "부하를 고려한 AI 처리 간격",
        body: "도킹 AI는 모든 프레임을 다 처리하는 대신 프레임 스킵을 통해 CPU 부하를 낮추고, 그 대신 운영에 필요한 최소 판단 빈도를 확보하는 쪽으로 설계됐습니다.",
      },
    ],
    links: [],
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
      subtitle: "게임 규칙과 실시간 음성을 동시에 다룬 멀티플레이 프로젝트",
      description:
        "UE5 클라이언트, WebSocket 기반 로비 서버, UDP 기반 보이스 서버를 나눠 멀티플레이 게임의 규칙과 음성 채팅 품질을 함께 맞춘 프로젝트입니다.",
      media: {
        src: mausoleumHero,
        alt: "Mausoleum preview",
      },
    },
    context: {
      body: [
        "영묘는 게임 플레이 로직과 실시간 보이스가 동시에 중요한 프로젝트였습니다. 둘은 지연 허용치와 데이터 성격이 달라서, 같은 방식으로 풀려고 하면 한쪽 품질이 쉽게 무너집니다.",
        "그래서 로비/상태 동기화와 음성 전달 경로를 분리하고, UE5 클라이언트 안에서는 보이스 캡처와 재생을 직접 제어하는 구조를 선택했습니다.",
      ],
      facts: [
        { label: "장르", value: "UE5 멀티플레이 던전 탈출" },
        { label: "중점", value: "보이스 채팅 + 상태 규칙" },
        { label: "역할", value: "보이스 경로와 서버 구조 개선" },
      ],
    },
    architectureNotes: [
      "로비와 상태 동기화는 WebSocket 경로로, 음성은 UDP + Protobuf 경로로 분리했습니다.",
      "UE5 클라이언트 안에서는 캡처, 코덱, 네트워크, 재생 계층을 나눠 음성 흐름을 직접 제어했습니다.",
      "생존/사망 상태 규칙은 보이스 규칙과 강하게 연결되어 있기 때문에 전략 패턴으로 분리해 다뤘습니다.",
    ],
    evidenceNotes: [
      "Server/README를 기준으로 WebSocket 로비와 UDP + Protobuf 보이스 서버 역할을 정리했습니다.",
      "UE5 소스의 Voice 디렉터리 구조를 기준으로 캡처, 코덱, 네트워크, 재생 경로를 묶었습니다.",
      "측정된 성능 수치 대신, 왜 UDP/Opus/상태 분리를 선택했는지의 설계 판단 과정을 근거로 제시합니다.",
    ],
    designConsiderations: [
      {
        title: "낮은 지연 우선",
        body: "게임 상태는 신뢰성이 중요하지만 보이스는 낮은 지연이 우선이기 때문에, TCP 계열보다 UDP가 더 적합한 선택이었습니다.",
      },
      {
        title: "상태 규칙을 코드 구조로 분리",
        body: "생존자와 사망자가 같은 청취 규칙을 쓰면 게임 디자인이 무너지기 때문에, 규칙 차이를 객체 구조로 분리해 유지보수성을 확보했습니다.",
      },
      {
        title: "보이스와 게임 서버 책임 분리",
        body: "디버깅과 운영 포인트를 분명히 하기 위해 로비/상태 동기화와 실시간 음성 릴레이를 같은 채널로 섞지 않았습니다.",
      },
    ],
    links: [],
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
      subtitle: "옷장 데이터를 추천 가능한 자산으로 바꾸는 코디 서비스",
      description:
        "내 옷을 디지털 옷장으로 정리하고, 날씨·일정·무드에 맞는 코디를 비동기 AI 파이프라인으로 생성하는 서비스입니다. 저는 백엔드와 운영 경로를 중심으로 맡았습니다.",
      media: {
        src: stickerHero,
        alt: "Sticker preview",
      },
    },
    context: {
      body: [
        "STICKER는 사용자의 옷장에 이미 있는 옷을 추천 가능한 자산으로 바꾸는 서비스입니다. 사용자는 옷을 등록하고, 시스템은 날씨·일정·무드 같은 문맥과 함께 오늘의 코디를 제안합니다.",
        "핵심은 AI 기능 자체보다 흐름입니다. 업로드, 디지털 옷장, 추천, 조정, 저장, 푸시 알림이 한 번에 이어져야 매일 쓰는 서비스가 됩니다.",
      ],
      facts: [
        { label: "중심 가치", value: "디지털 옷장 + 추천 파이프라인" },
        { label: "역할", value: "백엔드 전담 · 운영/배포" },
        { label: "중점", value: "비동기 처리와 운영 안정성" },
      ],
    },
    userFlows: [
      {
        kicker: "Upload",
        title: "의류 등록",
        description: "사진 촬영 또는 갤러리 선택으로 의류를 등록하고, 이미지 업로드 경로를 서비스 흐름에 연결합니다.",
        image: stickerCamera,
      },
      {
        kicker: "Wardrobe",
        title: "디지털 옷장",
        description: "의류 이미지를 자산화하고 메타데이터를 붙여 추천 가능한 개인 옷장으로 바꿉니다.",
        image: stickerWardrobe,
      },
      {
        kicker: "Recommendation",
        title: "일별 코디 추천",
        description: "날씨, 일정, 무드를 바탕으로 코디 후보를 만들고 결과를 사용자에게 돌려줍니다.",
        image: stickerRecommend,
      },
      {
        kicker: "Adjustment",
        title: "상황별 보정",
        description: "자연어 입력과 추가 조건을 반영해 추천 결과를 다시 조정합니다.",
        image: stickerVoice,
      },
      {
        kicker: "Composition",
        title: "직접 조합",
        description: "추천만이 아니라 사용자가 원하는 조합을 직접 만들고 관리할 수 있게 합니다.",
        image: stickerCodimaker,
      },
      {
        kicker: "Retention",
        title: "저장과 알림",
        description: "생성한 코디를 저장하고, 필요한 시점에 푸시 알림으로 다시 꺼낼 수 있게 합니다.",
        image: stickerSaved,
      },
    ],
    architectureNotes: [
      "앱 요청은 Spring Boot API를 거쳐 큐로 분리되고, AI 생성은 FastAPI가 비동기로 처리합니다.",
      "추천과 조정 작업은 앱 응답과 분리해 긴 처리 시간이 사용자 경험을 막지 않도록 했습니다.",
      "저장, 캐시, 인증, 푸시 알림까지 운영 흐름을 같은 서비스 체계 안에서 정리했습니다.",
    ],
    evidenceNotes: [
      "README의 서비스 소개, 주요 기능, 외부 서비스 표를 기준으로 기능 흐름을 정리했습니다.",
      "이메일 인증은 Gmail SMTP가 아니라 Gmail API(OAuth2) 기준으로 수정했습니다.",
      "측정된 p95/p99 수치 대신, TTL 정책, 큐 분리, 토큰 회전 같은 설계 기준을 근거로 제시합니다.",
    ],
    designConsiderations: [
      {
        title: "비동기 처리 우선",
        body: "추천과 보정 작업은 사용자 응답과 분리되어야 했기 때문에 SQS 기반 비동기 구조가 핵심이었습니다.",
      },
      {
        title: "중복 실행 방지",
        body: "일별 추천은 한 번만 생성되어야 하므로 Redis 락과 dedup 키를 함께 사용해 큐 소비 중복을 제어했습니다.",
      },
      {
        title: "운영 경계 분리",
        body: "짧은 수명의 ACCESS/REFRESH/SOCKET 토큰 분리와 ACK 전략 분리로 인증과 큐 운영 경계를 명확히 했습니다.",
      },
    ],
    links: [
      { label: "팀 포트폴리오 원본", href: stickerPortfolioHref },
    ],
    sections: FORMAL_SECTIONS,
  },
};
