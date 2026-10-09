import coverImage from "../../../asset/영묘.png";
import architectureImage from "../../../asset/mausoleum-system-architecture.svg";

export default {
  id: "mausoleum",
  sectionOrder: ["architecture", "implementation", "case-studies", "results", "sources"],
  title: "영묘 (Mausoleum)",
  category: "C++ 실시간 음성과 온라인 게임 서버",
  period: "2026.02 – 2026.03",
  team: "6인",
  role: [
    "언리얼 엔진 5 음성 기능에서 마이크 입력, 화자별 압축, 음성 전송과 재생 구현",
    "C++ 음성 서버의 데이터 검사, 방 식별 코드별 작업 분배와 음성 중계 구현",
    "웹소켓 로비와 화면 출력 없이 게임을 진행하는 전용 서버를 연결하고 단계별 아이템 생성 연동",
    "Linux와 Windows 네트워크 처리를 구성하고 백그라운드 복귀 뒤 음성 지연 처리",
  ],
  cardRole: "음성 입력과 중계 서버, 게임 세션 연결",
  summary: [
    "웹소켓은 로비와 연결을 유지해 방 정보를 주고받는 방식입니다. UDP는 전송 순서를 기다리지 않아 지연을 줄일 수 있어 음성 전달에 사용했습니다. 언리얼 전용 서버가 게임을 진행하는 동안 C++ 음성 서버는 방별 음성을 중계합니다.",
    "방 식별 코드를 기준으로 로비, 게임 세션, 음성 서버를 연결하고 마이크 입력부터 음성 전달과 재생까지 구현했습니다.",
  ],
  cover: coverImage,
  stack: ["C++", "언리얼 엔진 5 게임 개발 도구", "UDP 음성 데이터 전송", "WebSocket 지속 연결", "uWebSockets 통신 라이브러리", "Opus 음성 압축", "Protocol Buffers 메시지 형식", "CMake 빌드 설정", "여러 작업 흐름 동시 실행"],
  architecture: {
    image: architectureImage,
    alt: "언리얼 엔진 5 게임 클라이언트가 방을 관리하는 로비, 게임 진행 서버, 음성 전달 서버에 각각 연결되는 구성도",
    mobileFlows: [
      { title: "로비 연결", steps: [
        { title: "게임 로비 화면", detail: "방 생성과 참가, 게임 연결 정보 조회" },
        { title: "웹소켓 로비 서버", detail: "방 식별 코드와 참가자 목록 관리" },
      ] },
      { title: "음성 연결", steps: [
        { title: "게임 음성 기능", detail: "마이크 입력, Opus 음성 압축, 재생" },
        { title: "C++ 음성 서버", detail: "방 식별 코드별 음성 데이터 전달과 작업 분배" },
      ] },
      { title: "게임 진행", steps: [
        { title: "게임 클라이언트", detail: "화면 출력 없이 게임 상태를 관리하는 서버에 접속" },
        { title: "언리얼 전용 서버", detail: "게임 세션, 진행 단계, 아이템 생성 관리" },
      ] },
    ],
    summary: [
      "웹소켓 로비 서버는 방 생성과 참가자 정보 동기화를 처리합니다.",
      "언리얼 전용 서버는 화면을 그리지 않고 게임 공간과 진행 단계를 관리합니다.",
      "C++ 음성 서버는 게임 진행과 별도로 방마다 음성 데이터를 중계합니다.",
      "게임 화면에서는 마이크 입력을 음성 압축, 송수신, 재생으로 이어지게 구현했습니다.",
    ],
  },
  implementations: [
    { title: "언리얼 엔진 5 마이크 입력과 Opus 음성 처리", body: ["마이크 입력부터 Opus 압축과 복원, UDP 전송, 스피커 재생까지 한 흐름으로 연결했습니다. Opus는 실시간 음성의 데이터 크기를 줄이는 압축 방식입니다.", "화자마다 압축 상태를 따로 두고, 한 채널 음성을 초당 16,000번 읽어 0.02초 조각으로 나눈 뒤 초당 24킬로비트로 압축했습니다. FEC는 음성 데이터가 빠졌을 때 복구 정보를 보내는 기능이고, DTX는 말하지 않을 때 전송량을 줄이는 기능입니다."] },
    { title: "방마다 음성 작업을 나눠 처리", body: ["각 방을 식별하는 코드로 작업 담당자를 정해 같은 방의 음성 데이터는 늘 같은 작업 흐름으로 보냈습니다.", "같은 방에서는 먼저 들어온 데이터부터 처리하고, 다른 방은 여러 작업 흐름에 나눠 맡깁니다.", "한 번 받은 음성 데이터를 여러 참가자에게 보낼 때는 같은 데이터를 공유해 불필요한 복사를 줄였습니다."] },
    { title: "음성 데이터 확인과 참가자 전달", body: ["Protocol Buffers는 데이터를 정해진 항목과 형식으로 묶어 서로 다른 프로그램이 함께 읽게 하는 메시지 형식입니다.", "받은 데이터의 길이와 방, 보낸 사람을 나타내는 표식을 확인하고 해당 방의 대기열로 전달합니다.", "담당 작업 흐름은 방의 음성 참가자에게 데이터를 중계하고, 여러 명에게 보낼 때 같은 데이터를 공유합니다."] },
    { title: "Linux와 Windows의 네트워크 대기 방식 분리", body: ["운영체제마다 다른 네트워크 대기 방식을 공통 인터페이스 뒤에 나눠 구현했습니다.", "서버가 받을 주소와 포트를 먼저 등록하고, 운영체제에 맞게 통신 통로의 생성과 설정, 종료를 처리하도록 구성했습니다."] },
    { title: "로비 방 정보와 게임 단계 연결", body: ["방 식별 코드를 기준으로 방 생성과 참가, 퇴장, 참가자 목록을 게임 세션과 연결했습니다.", "언리얼 전용 서버의 진행 단계에 맞춰 방별 아이템 생성 기능이 아이템을 배치하고 교체하도록 연결했습니다."] },
  ],
  caseStudies: [
    {
      title: "앱 복귀 뒤 오래된 음성이 재생되는 문제",
      flow: [
        { title: "게임 화면을 벗어남", detail: "백그라운드에서 마이크 입력이 쌓임" },
        { title: "밀린 음성 비우기", detail: "오래된 마이크 입력을 폐기" },
        { title: "압축 상태 초기화", detail: "Opus 음성 압축을 초기화한 뒤 처리 종료" },
        { title: "현재 음성으로 복귀", detail: "밀린 음성을 재생하지 않고 새 입력부터 전송" },
      ],
      narrative: [
        "게임 창을 백그라운드로 전환했다 돌아오면 압축 전의 오래된 음성 데이터까지 한꺼번에 처리돼 재생이 늦어지거나 소리가 깨졌습니다.",
        "밀린 음성을 재생하는 대신 입력 대기 공간과 Opus 압축 상태를 비우고, 복귀 뒤에도 오래된 데이터부터 버려 현재 음성의 지연을 줄였습니다.",
      ],
      pseudocodeLabel: "의사 코드, 화면 복귀 뒤 밀린 마이크 입력 처리",
      pseudocode: `processCapture(hasFocus, bufferedBytes):
  // 화면이 보이지 않을 때 쌓인 음성과 압축 상태를 비웁니다
  if not hasFocus:
    discardCaptureBuffer()
    resetOpusEncoder()
    return

  // 복귀 시 입력 대기 공간이 너무 크면 오래된 음성이므로 전체를 버립니다
  if bufferedBytes > 8192:
    discardCaptureBuffer()
    resetOpusEncoder()
    return

  // 4KB를 넘으면 오래된 부분부터 버려 가장 최근 음성만 남깁니다
  if bufferedBytes > 4096:
    discardOldest(bufferedBytes - 4096)

  // 압축 전 음성을 최대 4KB만 읽어 인코더로 전달합니다
  rawVoice = readAtMost(4096)
  encodeAndSend(rawVoice)`,
    },
  ],
  links: { github: "https://github.com/cgantro/Mausoleum", demo: null },
  theme: { accent: "#9A7B54" },
};
