import coverImage from "../../../asset/영묘.png";
import architectureImage from "../../../asset/mausoleum-system-architecture.svg";

export default {
  id: "mausoleum",
  sectionOrder: ["architecture", "implementation", "case-studies", "results", "verification", "sources"],
  title: "영묘 (Mausoleum)",
  category: "실시간 C++ 음성·게임 네트워크",
  period: "2026.02 – 2026.03",
  team: "6인",
  role: "WebSocket 로비·다중 룸 관리, C++ 게임 서버, UE5 음성 클라이언트·UDP 서버, 페이즈·아이템 스폰 구현",
  summary: "UE5 멀티플레이어 게임의 로비 방 관리와 게임 진행 페이즈·아이템 스폰, Opus 음성의 UDP 전송을 구현했습니다. C++ 서버에서 룸별 음성 처리와 다중 룸 상태를 관리하고, 앱 복귀 때 오래된 음성을 처리하는 방식도 정리했습니다.",
  cover: coverImage,
  stack: ["C++", "Unreal Engine 5", "UDP", "WebSocket", "uWebSockets", "Opus", "Protobuf", "CMake", "Multithreading", "HRTF"],
  metrics: [{ label: "Opus 음성 페이로드 감소", value: "약 90.3%", context: "16-bit PCM 원본과 Opus 페이로드 비교. IP·UDP 헤더는 제외했습니다." }],
  architecture: {
    image: architectureImage,
    alt: "UE5 클라이언트가 WebSocket 로비·게임 서버와 UDP 음성 서버에 각각 연결되는 구성도",
    summary: "로비·매치메이킹은 WebSocket, 음성 패킷 전송은 UDP, 게임 상태 관리는 Unreal Dedicated Server가 맡습니다. 클라이언트 음성 경로는 캡처·코덱·전송·수신·재생 단계로 나눴습니다.",
  },
  implementations: [
    { title: "실시간 음성 캡처와 코덱 경계", body: "UPrivateVoiceChatComponent에서 캡처, Opus 인코딩, UDP 송신, 수신 디코딩과 재생 책임을 분리했습니다. 화자별 코덱 상태를 두어 수신 오디오가 서로 간섭하지 않게 했습니다. 음성은 16kHz 모노, 20ms 프레임, 24kbps Opus로 처리하고 FEC·DTX를 설정했습니다." },
    { title: "룸별 음성 패킷 분배", body: "C++ VoiceServer가 UDP 패킷을 룸 코드별 작업 큐에 넣습니다. 같은 룸의 패킷은 같은 워커에서 처리해 순서를 유지하도록 구성했습니다. 브로드캐스트에는 공유 페이로드를 사용했습니다." },
    { title: "소켓과 이벤트 루프 분리", body: "게임 서버의 네트워크 이벤트 루프를 인터페이스로 분리하고 Linux epoll과 Windows select 구현을 두었습니다. UDP·TCP 엔드포인트 등록 시점을 서버 시작 전으로 제한하고, SocketPlatform으로 플랫폼별 소켓 생성·설정·종료 책임을 분리했습니다." },
    { title: "로비·다중 룸과 페이즈별 진행 관리", body: "C++ 로비 서버에서 방 생성·입장·퇴장을 처리하고 늦게 입장한 사용자에게 기존 참가자 목록을 전달했습니다. 방장이 나가면 호스트 변경을 알리고 끊긴 연결은 방에서 정리했습니다. 게임 진행 페이즈는 Dedicated Server가 판단하며, 레벨 준비·페이즈 변경 시 아이템 스폰 오케스트레이터가 방별 아이템을 생성·교체하도록 연결했습니다." },
  ],
  caseStudies: [
    {
      title: "앱 복귀 뒤 오래된 음성이 재생되는 문제",
      situation: "앱을 백그라운드로 보냈다가 복귀하면 음성이 지직거리거나 끊겼습니다.",
      analysis: "앱이 백그라운드에 있는 동안 캡처 버퍼와 Opus 링 버퍼에 PCM이 쌓여, 복귀한 뒤 오래된 데이터까지 처리됐습니다.",
      decision: "실시간 음성은 밀린 데이터를 재생하지 않고 버린 뒤 코덱 상태를 새로 시작하도록 했습니다.",
      implementation: "앱 오디오 포커스를 잃으면 캡처 데이터를 비우고 코덱을 초기화했습니다. 버퍼가 8KB를 넘으면 모두 버리고, 한 번에 읽는 양은 최대 4096B로 제한했습니다.",
      verification: "백그라운드에서 복귀한 뒤 정상 재생되는 수정 결과를 확인했습니다.",
      limitations: "반복 전환 시험의 횟수와 재생 품질 지표는 제시되지 않았습니다.",
      codeLanguage: "cpp",
      codeLabel: "ProcessCapture 실제 구현 발췌",
      code: `void UVoiceCaptureProcessor::ProcessCapture()
{
    if (!FApp::HasFocus())
    {
        DrainAllCaptureData();
        ResetCodecForRealtime();
        return;
    }
    // 정상 캡처 처리
}`,
    },
    {
      title: "룸별 패킷 순서를 유지하는 큐 분배",
      situation: "모든 룸의 패킷을 단일 큐에서 처리하면 룸별 작업 분리와 순서 관리가 어려웠습니다.",
      analysis: "워커 수만 늘리는 방식은 단일 큐에서 경합할 수 있어, 룸별 처리 순서를 보존하면서 작업을 나눌 기준이 필요했습니다.",
      decision: "RoomCode를 해시해 방마다 담당 워커와 큐를 고정하는 샤딩 방식을 적용했습니다.",
      implementation: "같은 RoomCode의 패킷은 항상 같은 샤드로 보내고, 각 워커는 자신에게 배정된 ConcurrentQueue를 독립적으로 소비하도록 구성했습니다. 방 안 브로드캐스트에서는 공유 페이로드를 사용했습니다.",
      verification: "룸별 큐 분리와 공유 페이로드 브로드캐스트를 적용했습니다.",
      limitations: "샤딩 전후의 큐 대기 시간, 처리량, 지연 비교 수치는 측정 자료에서 확인되지 않아 성능 개선량으로 표현하지 않습니다.",
    },
  ],
  verification: {
    summary: "음성 수치에는 별도 음질 벤치마크가 없습니다. 워커 샤딩 성능도 정량 비교하지 않았습니다.",
    items: [
      "백그라운드 복귀 때 버퍼와 코덱 상태를 초기화하도록 수정했습니다. 반복 재현 횟수와 지연 수치는 없습니다.",
      "게임 서버 네트워크 경로는 Linux epoll과 Windows select 이벤트 루프를 지원합니다.",
    ],
  },
  links: { github: null, demo: null },
  theme: { accent: "#9A7B54" },
};
