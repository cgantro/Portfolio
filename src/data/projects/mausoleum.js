import coverImage from "../../../asset/영묘.png";
import architectureImage from "../../../asset/mausoleum-system-architecture.svg";

export default {
  id: "mausoleum",
  sectionOrder: ["architecture", "implementation", "case-studies", "results", "verification", "sources"],
  title: "영묘 (Mausoleum)",
  category: "실시간 C++ 음성·게임 네트워크",
  period: "2026.02 – 2026.03",
  team: "6인",
  role: "UE5 음성 클라이언트·C++ UDP VoiceServer 전담, C++ 서버 네트워크 구조 리팩터링 주도, 로비·게임 세션과 페이즈별 아이템 스폰 연동",
  cardRole: "음성 클라이언트·UDP 서버·게임 세션 연동",
  summary: "UE5 멀티플레이 협동 게임에서 WebSocket 로비, Unreal Dedicated Server 게임 세션, C++ UDP 음성 서버의 역할을 나눠 구현했습니다. 음성 클라이언트와 룸별 음성 분배를 맡고, 게임 서버의 네트워크 구조와 페이즈별 아이템 스폰도 개선했습니다.",
  cover: coverImage,
  stack: ["C++", "Unreal Engine 5", "UDP", "WebSocket", "uWebSockets", "Opus", "Protobuf", "CMake", "Multithreading"],
  metrics: [{ label: "Opus 애플리케이션 페이로드 감소", value: "약 90.3%", context: "16-bit PCM 원본과 Opus 애플리케이션 페이로드 크기 비교입니다. IP·UDP 헤더를 포함한 전체 네트워크 사용량이 아닙니다." }],
  architecture: {
    image: architectureImage,
    alt: "UE5 클라이언트가 WebSocket 로비·게임 서버와 UDP 음성 서버에 각각 연결되는 구성도",
    summary: "WebSocket 로비 서버는 방과 세션을 관리하고, Unreal Dedicated Server는 게임 진행을 맡습니다. 별도 C++ 음성 서버는 UDP 패킷을 중계합니다. 클라이언트 음성 경로는 캡처·코덱·전송·수신·재생 단계로 나눴습니다.",
  },
  implementations: [
    { title: "음성 클라이언트 처리 단계 분리", body: "UPrivateVoiceChatComponent에서 마이크 캡처, Opus 인코딩·디코딩, UDP 송신·수신, 재생을 전용 구성 요소로 나눴습니다. 화자별 코덱 상태를 관리하며, 음성은 16kHz 모노·20ms 프레임·24kbps로 인코딩하고 FEC·DTX를 설정했습니다." },
    { title: "RoomCode 기준 음성 워커 샤딩", body: "C++ VoiceServer에서 RoomCode를 해시해 같은 방의 패킷을 같은 ConcurrentQueue와 워커로 보냈습니다. 이 구조로 방 안의 처리 순서를 유지하면서 여러 방의 작업을 나눴습니다. 브로드캐스트에는 공유 페이로드를 사용했습니다. 샤딩 전후 처리량이나 지연 비교 자료는 없어 성능 향상 수치로 제시하지 않습니다." },
    { title: "게임 서버 소켓과 이벤트 루프 분리", body: "네트워크 이벤트 루프 인터페이스와 Linux epoll·Windows select 구현을 분리했습니다. 서버 시작 전에 엔드포인트를 등록하도록 하고, SocketPlatform으로 POSIX·Winsock 소켓의 생성·설정·종료를 추상화했습니다." },
    { title: "로비 세션과 페이즈별 게임 진행 연결", body: "로비에서 방 생성·입장·퇴장과 참가자 목록 동기화를 처리하고, 방별 RoomCode를 게임 세션과 연결했습니다. Unreal Dedicated Server가 게임 페이즈를 판단하며, 아이템 스폰 오케스트레이터가 레벨 준비와 페이즈 전환에 맞춰 방별 아이템을 생성·교체하도록 연동했습니다." },
  ],
  caseStudies: [
    {
      title: "앱 복귀 뒤 오래된 음성이 재생되는 문제",
      situation: "앱을 백그라운드로 보냈다가 복귀하면 음성이 지직거리거나 끊겼습니다.",
      analysis: "앱이 백그라운드에 있는 동안 캡처 버퍼와 Opus 링 버퍼에 PCM이 쌓여, 복귀한 뒤 오래된 데이터까지 처리됐습니다.",
      decision: "실시간 음성은 밀린 데이터를 재생하지 않고 버린 뒤 코덱 상태를 새로 시작하도록 했습니다.",
      implementation: "앱 오디오 포커스를 잃으면 캡처 데이터를 비우고 코덱을 초기화했습니다. 버퍼가 8KB를 넘으면 모두 버리고, 한 번에 읽는 양은 최대 4096B로 제한했습니다.",
      verification: "백그라운드에서 복귀한 뒤 오래된 캡처 데이터가 재생되지 않도록 처리했습니다.",
      limitations: "포커스 전환을 반복했을 때의 성공률이나 음질은 수치로 측정하지 않았습니다.",
      codeLanguage: "cpp",
      codeLabel: "VoiceCaptureProcessor.cpp · ProcessCapture 일부 발췌 (138–149행)",
      codeSource: "https://github.com/cgantro/Mausoleum/blob/main/A302/Source/A302Client/Voice/Capture/VoiceCaptureProcessor.cpp#L138-L149",
      code: `void UVoiceCaptureProcessor::ProcessCapture()
{
    VOICE_PROFILE_CAPTURE();
    if (!bIsMicActive || !VoiceCapture.IsValid()) return;
    // 백그라운드 동안 쌓인 음성을 복귀 직후 전송하면 지연/지지직의 원인이 됩니다.
    // 포커스가 없을 때는 캡처 버퍼를 비우고 코덱 상태를 리셋하여 실시간성만 유지합니다.
    if (!FApp::HasFocus())
    {
        DrainAllCaptureData();
        ResetCodecForRealtime();
        return;
    }
}`,
    },
  ],
  verification: {
    summary: "음성 수치에는 별도 음질 벤치마크가 없습니다. 워커 샤딩 성능도 정량 비교하지 않았습니다.",
    items: [
      "백그라운드 복귀 때 버퍼와 코덱 상태를 초기화하도록 수정했습니다. 반복 재현 횟수와 지연 수치는 없습니다.",
      "게임 서버 네트워크 경로는 Linux epoll과 Windows select 이벤트 루프를 지원합니다.",
    ],
  },
  links: { github: "https://github.com/cgantro/Mausoleum", demo: null },
  theme: { accent: "#9A7B54" },
};
