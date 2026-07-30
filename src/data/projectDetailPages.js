import robotpalHero from "../../asset/로봇팔 시연.webp";
import mausoleumHero from "../../asset/영묘.png";
import autowingHero from "../../asset/오토잉카_실물.png";
import stickerHero from "../../asset/Sticker.png";

const FORMAL_SECTIONS = [
  { id: "implementation", label: "구현 내용" },
  { id: "troubleshooting", label: "문제 해결" },
  { id: "architecture", label: "시스템 구성" },
  { id: "retrospective", label: "한계와 추가 검증" },
];

export const projectDetailPages = {
  robotpal: {
    theme: { accent: "#7dd3fc", accentSoft: "rgba(125, 211, 252, 0.16)", surface: "linear-gradient(160deg, rgba(56, 189, 248, 0.18), rgba(14, 116, 144, 0.03))", glow: "rgba(56, 189, 248, 0.28)" },
    hero: {
      eyebrow: "Simulation · Streaming · Web Build", title: "RobotPal", subtitle: "",
      description: "카메라 스트리밍에서 JPEG 인코딩과 네트워크 전송이 렌더링 루프를 지연시킨 문제를 측정하고 분리했습니다.",
      media: { src: robotpalHero, alt: "RobotPal AGV 시뮬레이터와 카메라 프레임 스트리밍 화면", caption: "RobotPal AGV 시뮬레이터와 카메라 프레임 스트리밍 화면" },
    },
    spotlight: [
      { label: "문제", value: "readback 대기와 JPEG 인코딩이 렌더링 루프를 지연" },
      { label: "역할", value: "프레임 스트리밍 · 네트워크 모듈 · 병목 개선" },
      { label: "결과", value: "Frame Drop Rate 17.6% → 0.8%" },
    ],
    context: { body: [] },
    architectureNotes: [
      "Render Thread → PBO Readback → Bounded Frame Queue → JPEG Worker Pool → NetworkTransport",
      "JPEG 워커가 프레임을 인코딩한 뒤 NetworkEngine을 호출했습니다. 네이티브 TCP는 내부 송신 큐와 송신 스레드로, WebAssembly는 WebSocket 구현체로 보냈습니다.",
    ],
    benchmarkTable: {
      title: "프레임 드랍 개선 결과", headers: ["항목", "값", "설명"],
      rows: [
        ["비교", "단일 인코딩 워커 → 멀티 인코딩 워커", "워커 전략만 변경"],
        ["공통 조건", "1632×1232 · 60 FPS · 30초 · JPEG 품질 70 · 큐 크기 6", "총 1,800프레임"],
        ["빌드", "C++17 · -O2 · libjpeg", "벤치마크 문서의 재현 명령 기준"],
        ["전송", "JPEG 인코딩 벤치마크", "TCP·WebSocket 실제 전송은 비교에 포함하지 않음"],
        ["Frame Drop Rate", "17.6% → 0.8%", "생성 프레임 중 원본 프레임 큐가 포화되어 폐기된 비율"],
      ],
      note: "PBO 적용 효과는 최종 드랍률과 같은 수치로 연결하지 않았습니다. PBO는 CPU가 현재 프레임의 GPU 작업 완료를 기다리는 구간을 줄이고, readback과 인코딩 시간을 별도로 측정하기 위한 변경이었습니다.",
    },
    links: [{ label: "Repository", href: "https://github.com/cgantro/RobotPal" }],
    sections: FORMAL_SECTIONS,
  },
  mausoleum: {
    theme: { accent: "#f59e0b", accentSoft: "rgba(245, 158, 11, 0.15)", surface: "linear-gradient(160deg, rgba(245, 158, 11, 0.16), rgba(120, 53, 15, 0.04))", glow: "rgba(245, 158, 11, 0.24)" },
    hero: {
      eyebrow: "UE5 Multiplayer · Real-time Voice", title: "UE5 Multiplayer Voice Communication", subtitle: "",
      description: "UE5 클라이언트에서 캡처·화자별 Opus 코덱·UDP 전송·재생을 분리하고, VoiceServer는 RoomCode 해시로 패킷을 워커 큐에 분배하도록 구현했습니다.",
      media: { src: mausoleumHero, alt: "UE5 멀티플레이 음성 통신 프로젝트 실행 화면", caption: "UE5 멀티플레이 음성 통신 프로젝트 실행 화면" },
    },
    spotlight: [
      { label: "문제", value: "포커스 복귀 후 오래된 PCM 재생과 방별 패킷의 단일 큐 집중" },
      { label: "역할", value: "보이스 모듈 · 화자별 Opus 코덱 · UDP VoiceServer 샤딩" },
      { label: "결과", value: "RoomCode 해시 2개 워커 큐 · 8KB stale PCM hard drop" },
    ],
    context: { body: [] },
    architectureNotes: [
      "Capture → Per-speaker Opus Codec → UDP → VoiceServer → RoomCode Hash → 2 Worker Queues → Room Peers",
      "클라이언트는 UPrivateVoiceChatComponent 아래에서 캡처·코덱·네트워크·재생을 분리했습니다. 서버는 같은 방의 송신자 외 사용자에게 공유 페이로드를 중계했습니다.",
    ],
    sections: FORMAL_SECTIONS,
  },
  autowing: {
    theme: { accent: "#4ade80", accentSoft: "rgba(74, 222, 128, 0.15)", surface: "linear-gradient(160deg, rgba(16, 185, 129, 0.18), rgba(20, 83, 45, 0.03))", glow: "rgba(16, 185, 129, 0.26)" },
    hero: {
      eyebrow: "Control Backend · State Transition · Route Guidance", title: "오토윙카", subtitle: "",
      description: "공항 견인차의 텔레메트리와 관제 명령을 처리하고, 실제 장비 상태와 요청 상태를 분리해 고빈도 이벤트 환경에서 검증했습니다.",
      media: { src: autowingHero, alt: "Autowing 견인차" },
    },
    spotlight: [{ label: "문제", value: "상태 전이와 MQTT 이벤트 순서 충돌" }, { label: "역할", value: "상태 전이 · 채널 분리 · 경로 추천 · 부하 테스트" }, { label: "결과", value: "8,935 msg/s · E2E 지연 14 → 8ms" }],
    context: { body: [] },
    architectureNotes: ["관제 명령 → DB 트랜잭션 → MQTT·WebSocket 메시지 발행", "장비가 보낸 상태 이벤트를 기준으로 최종 상태를 반영했고, 제어·영상·보조 데이터를 다른 채널로 분리했습니다."],
    designMetrics: { title: "부하 테스트 결과", headers: ["항목", "값", "이유"], rows: [["부하 환경", "500개 모의 차량 · 각 10Hz", "텔레메트리 동시 전송"], ["E2E 지연", "14 → 8ms", "명령·상태 반영 경로 측정"], ["최대 처리량", "8,935 msg/s", "서버 처리량"], ["안정성", "5분 · 132만 메시지 · 유실 0건", "동일 부하 환경"]], note: "500개 모의 차량 클라이언트가 각각 10Hz로 텔레메트리를 전송하는 조건에서 측정했습니다." },
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
