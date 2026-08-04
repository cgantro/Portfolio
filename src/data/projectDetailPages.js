import robotpalHero from "../../asset/로봇팔 시연.webp";
import robotpalArchitecture from "../../asset/robotpal-system-architecture.svg?raw";
import mausoleumHero from "../../asset/영묘.png";
import mausoleumArchitecture from "../../asset/mausoleum-system-architecture.svg?raw";
import autowingHero from "../../asset/오토잉카_실물.png";
import autowingArchitecture from "../../asset/autowing-system-architecture.svg?raw";
import stickerHero from "../../asset/Sticker.png";
import stickerArchitecture from "../../asset/sticker-system-architecture.svg?raw";

const FORMAL_SECTIONS = [
  { id: "implementation", label: "구현 내용" },
  { id: "troubleshooting", label: "문제 해결" },
  { id: "architecture", label: "아키텍처" },
  { id: "retrospective", label: "한계와 추가 검증" },
];

export const projectDetailPages = {
  robotpal: {
    theme: { accent: "#7dd3fc", accentSoft: "rgba(125, 211, 252, 0.16)", surface: "linear-gradient(160deg, rgba(56, 189, 248, 0.18), rgba(14, 116, 144, 0.03))", glow: "rgba(56, 189, 248, 0.28)" },
    hero: {
      eyebrow: "Simulation · Streaming · Web Build", title: "RobotPal", subtitle: "",
      description: "AGV와 로봇팔의 이동·조작을 가상 환경에서 시험하고, 카메라 스트리밍의 실제 종단 간 경로를 계측해 GPU Readback과 JPEG 인코딩 병목을 개선하고 검증했습니다.",
      media: { src: robotpalHero, alt: "RobotPal AGV 시뮬레이터와 카메라 프레임 스트리밍 화면", caption: "RobotPal AGV 시뮬레이터와 카메라 프레임 스트리밍 화면" },
    },
    spotlight: [
      { label: "문제", value: "동기 Readback 병목과 PBO 적용 후 JPEG 처리 적체" },
      { label: "역할", value: "스트리밍 · 통신 · 로봇 제어 · 성능 검증" },
      { label: "결과", value: "최종 처리량 34.857 → 37.328fps · 지연 증가 확인" },
    ],
    context: { body: [] },
    architectureNotes: [
      "네이티브 TCP와 WebAssembly WebSocket은 동일한 메시지 구조를 사용합니다. 수신한 네트워크 명령은 AGV 제어 계층에 연결했고, frame_id와 생성 시각으로 C++ 송신 로그와 Python 수신 로그를 연결했습니다.",
    ],
    architectureImage: { markup: robotpalArchitecture, alt: "RobotPal 카메라 스트리밍, 멀티플랫폼 통신과 AGV 제어 시스템 아키텍처 구조도" },
    benchmarkTable: {
      title: "실제 종단 간 스트리밍 측정 결과", headers: ["조건", "최종 처리량", "Readback p50", "큐 대기 p50", "큐 폐기율", "종단 간 p50"],
      rows: [
        ["동기 + worker1", "34.857fps", "24.459ms", "0.165ms", "0%", "73.382ms"],
        ["PBO + worker1", "32.889fps", "20.728ms", "141.157ms", "15.33%", "240.824ms"],
        ["PBO + worker4", "37.328fps", "20.680ms", "0.073ms", "0%", "101.802ms"],
      ],
      note: "x64 Release · 1232×832 RGBA · JPEG 품질 70 · 큐 크기 6 · localhost TCP · 약 60초 실행(최초 10초 제외) 조건입니다. 조건별 1회 탐색 측정이므로 확정 개선률이 아니라 병목의 위치와 변화 방향을 보여주는 값입니다.",
    },
    links: [{ label: "Repository", href: "https://github.com/cgantro/RobotPal" }],
    sections: FORMAL_SECTIONS,
  },
  mausoleum: {
    theme: { accent: "#f59e0b", accentSoft: "rgba(245, 158, 11, 0.15)", surface: "linear-gradient(160deg, rgba(245, 158, 11, 0.16), rgba(120, 53, 15, 0.04))", glow: "rgba(245, 158, 11, 0.24)" },
    hero: {
      eyebrow: "UE5 Multiplayer · Game Server · Real-time Voice", title: "영묘", subtitle: "",
      description: "UE5 멀티플레이 환경에서 음성 클라이언트와 UDP 서버, 크로스플랫폼 네트워크 계층, Room Code 기반 방별 게임 진행 로직을 구현했습니다.",
      media: { src: mausoleumHero, alt: "UE5 멀티플레이 음성 통신 프로젝트 실행 화면", caption: "UE5 멀티플레이 음성 통신 프로젝트 실행 화면" },
    },
    spotlight: [
      { label: "문제", value: "실시간 음성 처리와 여러 방의 게임 상태·네트워크 경계 분리" },
      { label: "역할", value: "음성 클라이언트·UDP 서버 · 네트워크 계층 · 방별 게임 로직" },
      { label: "결과", value: "3개 서버 역할 분리 · RoomCode 기반 2개 음성 워커" },
    ],
    context: { body: [] },
    architectureNotes: [
      "Room Code는 로비 요청, 음성 중계와 Dedicated Server의 방별 인스턴스를 연결하는 공통 경계입니다. 게임 진행, 로비와 음성 경로는 각각 독립된 서버 역할로 분리했습니다.",
    ],
    architectureImage: { markup: mausoleumArchitecture, alt: "영묘 UE5 클라이언트, 로비 서버, UDP 음성 서버와 Dedicated 게임 서버 아키텍처 구조도" },
    sections: FORMAL_SECTIONS,
  },
  autowing: {
    theme: { accent: "#4ade80", accentSoft: "rgba(74, 222, 128, 0.15)", surface: "linear-gradient(160deg, rgba(16, 185, 129, 0.18), rgba(20, 83, 45, 0.03))", glow: "rgba(16, 185, 129, 0.26)" },
    hero: {
      eyebrow: "Control Backend · State Transition · Route Guidance", title: "오토윙카", subtitle: "",
      description: "공항 토잉카의 위치·상태를 MQTT로 수집하고 관제 명령과 경로 정보를 전달하며, 장비 결과 이벤트 기반 상태 전이와 그래프 경로 정책을 구현했습니다.",
      media: { src: autowingHero, alt: "Autowing 견인차" },
    },
    spotlight: [{ label: "문제", value: "명령 상태와 실제 장비 결과의 불일치 가능성" }, { label: "역할", value: "상태 전이 · 실시간 메시지 처리 · 경로 정책" }, { label: "결과", value: "8,935msg/s · E2E 지연 14~28ms" }],
    context: { body: [] },
    architectureNotes: ["관제 명령은 요청 상태로 관리하고 장비 결과 이벤트를 기준으로 최종 상태를 반영했습니다. 제어·영상·보조 데이터는 목적별 채널로 분리했습니다."],
    architectureImage: { markup: autowingArchitecture, alt: "오토잉카 사용자, AWS 클라우드와 로봇 엣지 사이의 관제·텔레메트리·영상 아키텍처 구조도" },
    designMetrics: { title: "부하 테스트 결과", headers: ["항목", "값", "측정 조건"], rows: [["부하 환경", "500대 장비 · 각 10Hz", "텔레메트리 동시 전송"], ["E2E 지연", "14~28ms", "동일 부하 조건"], ["최대 처리량", "8,935 msg/s", "서버 처리량"]], note: "500대 장비가 각각 초당 10회 텔레메트리를 전송하는 조건에서 측정했습니다." },
    sections: FORMAL_SECTIONS,
  },
  sticker: {
    theme: { accent: "#fb7185", accentSoft: "rgba(251, 113, 133, 0.16)", surface: "linear-gradient(160deg, rgba(251, 113, 133, 0.16), rgba(136, 19, 55, 0.03))", glow: "rgba(251, 113, 133, 0.24)" },
    hero: {
      eyebrow: "Backend Pipeline · Async Recommendation", title: "STICKER", subtitle: "",
      description: "긴 추천 작업을 API 응답 경로에서 분리하고, DB 커밋 이후 시작과 결과 반영 직전의 두 단계 중복 확인으로 작업 정합성을 보장했습니다.",
      media: { src: stickerHero, alt: "STICKER 패션 코디 추천 서비스 화면", caption: "STICKER 패션 코디 추천 서비스 화면" },
    },
    spotlight: [
      { label: "문제", value: "트랜잭션 커밋 전 외부 작업 시작과 재시도의 중복 결과 반영" },
      { label: "역할", value: "SQS 작업 분리 · Redis 락 · 결과 저장 전 idempotency 검증" },
      { label: "결과", value: "afterCommit 발행 · 적재/저장 전 2단계 중복 방어" },
    ],
    context: { body: [] },
    architectureNotes: [
      "API → DB Transaction → afterCommit → SQS → Recommendation Worker → Result Persist",
      "작업 적재 전에는 Redis 락으로 실행을 방어하고, 결과 저장 전에는 jobId·날짜 기준으로 다시 확인해 재시도 경로를 멱등하게 처리했습니다.",
    ],
    designConsiderations: [],
    links: [],
    sections: FORMAL_SECTIONS,
  },
};

Object.assign(projectDetailPages.sticker, {
  hero: {
    ...projectDetailPages.sticker.hero,
    eyebrow: "Backend API · Security · Performance · Observability",
    description: "이메일·JWT 인증과 날씨·AI 추천 API를 개발하고, Redis 캐시·DB 인덱스·계층별 메트릭·GitLab CI로 성능과 변경 검증 환경을 구축했습니다.",
  },
  spotlight: [
    { label: "범위", value: "API · 인증 · 성능 개선 · 모니터링" },
    { label: "역할", value: "백엔드 API와 인증 · 캐시·인덱스 · 관측·CI" },
    { label: "결과", value: "평균·p95·p99 관측 · MR 빌드·테스트·AI 리뷰" },
  ],
  architectureNotes: [
    "Actuator·Micrometer 메트릭은 Prometheus가 수집하고 Grafana에서 API·서비스·DB 지연과 오류율을 확인했습니다. GitLab MR에서는 빌드·테스트와 AI 코드 리뷰를 실행했습니다.",
  ],
  architectureImage: { markup: stickerArchitecture, alt: "STICKER 인증, API, 데이터, AI 추천, 모니터링과 CI 시스템 아키텍처 구조도" },
});
