import coverImage from "../../../asset/영묘.png";
import architectureImage from "../../../asset/mausoleum-system-architecture.svg";

export default {
  id: "mausoleum",
  sectionOrder: ["architecture", "implementation", "case-studies", "results", "sources"],
  title: "영묘 (Mausoleum)",
  category: "실시간 C++ 음성·게임 네트워크",
  period: "2026.02 – 2026.03",
  team: "6인",
  role: "UE5 음성 클라이언트와 C++ UDP 음성 서버를 전담하고 C++ 게임 서버 네트워크 구조를 리팩터링했습니다. 로비·게임 세션 연결과 페이즈별 아이템 스폰도 연동했습니다.",
  cardRole: "음성 클라이언트·UDP 서버·게임 세션 연동",
  summary: [
    "UE5 멀티플레이 협동 게임에서 WebSocket 로비는 방·세션을 관리하고, Unreal Dedicated Server는 게임 진행을 맡으며, 별도 C++ UDP 서버는 실시간 음성을 중계합니다.",
    "담당: 음성 클라이언트와 음성 서버, 게임 서버 네트워크 구조 개선, 로비 세션 및 페이즈별 아이템 스폰 연동.",
  ],
  cover: coverImage,
  stack: ["C++", "Unreal Engine 5", "UDP", "WebSocket", "uWebSockets", "Opus", "Protobuf", "CMake", "Multithreading"],
  metrics: [{ label: "Opus 애플리케이션 페이로드 감소", value: "약 90.3%", context: "16-bit PCM 원본과 Opus 애플리케이션 페이로드 크기 비교입니다. IP·UDP 헤더를 포함한 전체 네트워크 사용량이 아닙니다." }],
  architecture: {
    image: architectureImage,
    alt: "UE5 클라이언트가 WebSocket 로비·게임 서버와 UDP 음성 서버에 각각 연결되는 구성도",
    mobileFlows: [
      { title: "로비 연결", steps: [
        { title: "UE5 로비 클라이언트", detail: "방 생성 · 참가 · 세션 조회" },
        { title: "WebSocket 로비 서버", detail: "RoomCode와 참가자 목록 관리" },
      ] },
      { title: "음성 연결", steps: [
        { title: "UE5 음성 클라이언트", detail: "캡처 · Opus · 재생" },
        { title: "C++ UDP 음성 서버", detail: "RoomCode별 패킷 중계와 워커 분배" },
      ] },
      { title: "게임 진행", steps: [
        { title: "게임 클라이언트", detail: "Dedicated Server 접속" },
        { title: "UE Dedicated Server", detail: "게임 세션 · 페이즈 · 아이템 스폰" },
      ] },
    ],
    summary: [
      "WebSocket 로비 서버: 방 생성·입장과 세션 정보 관리.",
      "Unreal Dedicated Server: 게임 월드와 진행 상태 처리.",
      "C++ UDP 음성 서버: 게임 진행과 분리해 방별 음성 패킷 중계.",
      "담당한 클라이언트 음성 경로: 캡처·코덱·송수신·재생.",
    ],
  },
  implementations: [
    { title: "음성 클라이언트 처리 단계 분리", body: ["UPrivateVoiceChatComponent에서 마이크 캡처, Opus 인코딩·디코딩, UDP 송수신, 재생을 전용 구성 요소로 나눴습니다.", "화자별 코덱 상태를 관리하고, 음성은 16kHz 모노·20ms 프레임·24kbps로 인코딩하며 FEC·DTX를 설정했습니다."] },
    { title: "RoomCode 기준 음성 워커 샤딩", body: ["방별로 음성 작업을 분리하고 패킷의 RoomCode를 해시해 같은 방을 같은 워커에 배정합니다.", "같은 방 패킷은 동일 FIFO 큐에서 큐 입력 순서대로 처리되고, 서로 다른 방은 여러 워커로 나뉩니다.", "브로드캐스트에는 공유 페이로드를 사용합니다."] },
    { title: "게임 서버 소켓과 이벤트 루프 분리", body: ["네트워크 이벤트 루프 인터페이스와 Linux·Windows의 select 구현을 분리했습니다.", "서버 시작 전에 엔드포인트를 등록하고, SocketPlatform으로 POSIX·Winsock 소켓 생성·설정·종료를 추상화했습니다."] },
    { title: "로비 세션과 페이즈별 게임 진행 연결", body: ["로비의 방 생성·입장·퇴장과 참가자 목록 동기화를 처리하고 RoomCode를 게임 세션과 연결했습니다.", "Unreal Dedicated Server의 페이즈 판단에 맞춰 아이템 스폰 오케스트레이터가 방별 아이템을 생성·교체하도록 연동했습니다."] },
  ],
  caseStudies: [
    {
      title: "앱 복귀 뒤 오래된 음성이 재생되는 문제",
      flow: [
        { title: "포커스 상실", detail: "백그라운드에서 캡처 버퍼에 음성이 누적" },
        { title: "버퍼 비우기", detail: "DrainAllCaptureData()로 밀린 음성 폐기" },
        { title: "코덱 초기화", detail: "ResetCodecForRealtime() 후 처리 종료" },
        { title: "실시간 음성 재개", detail: "오래된 음성 재생보다 현재 음성의 신선도 선택" },
      ],
      narrative: [
        "게임 창이 백그라운드인 동안 마이크 캡처 버퍼에 PCM이 쌓였고, 복귀 뒤 오래된 데이터까지 처리되면서 음성이 지연되거나 지직거렸습니다.",
        "`ProcessCapture()`는 포커스가 없으면 `DrainAllCaptureData()`로 캡처 버퍼를 비우고 `ResetCodecForRealtime()`으로 코덱을 초기화한 뒤 반환합니다. 늦은 음성을 모두 처리하기보다 현재 음성을 낮은 지연으로 전달하려는 선택입니다.",
        "포커스 복귀 뒤에는 8KB 초과 데이터를 전부 버리고 코덱을 초기화합니다. 4096B 초과 8KB 이하이면 오래된 초과분을 버리고 최대 4096B를 읽습니다.",
      ],
      codeLanguage: "cpp",
      codeLabel: "ProcessCapture() 포커스 분기",
      code: `    // 백그라운드 동안 쌓인 음성을 복귀 직후 전송하면 지연/지지직의 원인이 됩니다.
    // 포커스가 없을 때는 캡처 버퍼를 비우고 코덱 상태를 리셋하여 실시간성만 유지합니다.
    if (!FApp::HasFocus())
    {
        DrainAllCaptureData();
        ResetCodecForRealtime();
        return;
    }`,
    },
  ],
  links: { github: "https://github.com/cgantro/Mausoleum", demo: null },
  theme: { accent: "#9A7B54" },
};
