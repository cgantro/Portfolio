import coverImage from "../../../asset/영묘.png";
import architectureImage from "../../../asset/mausoleum-system-architecture.svg";

export default {
  id: "mausoleum",
  title: "영묘 (Mausoleum)",
  category: "실시간 C++ 음성·게임 네트워크",
  period: "2026.02.24 – 2026.03.27",
  team: "6인",
  role: "UE5 음성 클라이언트와 C++ UDP 음성 서버, 게임 서버 네트워크 구조 개발",
  summary: "UE5 멀티플레이어 게임에서 Opus(음성 압축 코덱)로 압축한 음성을 UDP(비연결형 전송 프로토콜)로 보냈습니다. 로비·게임·음성 서버의 연결 구조와 앱이 다시 활성화될 때의 오디오 버퍼 처리도 정리했습니다.",
  cover: coverImage,
  stack: ["C++", "Unreal Engine 5", "UDP", "WebSocket", "uWebSockets", "Opus", "Protobuf", "CMake", "Multithreading", "HRTF"],
  metrics: [
    { label: "Opus 페이로드 감소", value: "약 90.3%", context: "비압축 음성인 16-bit PCM(펄스 부호 변조) 원본과 Opus 애플리케이션 페이로드(전송 데이터 본문) 크기를 비교했습니다. IP·UDP 헤더를 포함한 전체 네트워크 사용량은 아닙니다." },
    { label: "음성 프레임 설정", value: "16kHz · 20ms · 24kbps", context: "모노 음성, OPUS_APPLICATION_VOIP 설정. PCM 640B 프레임 기준." },
  ],
  architecture: {
    image: architectureImage,
    alt: "UE5 클라이언트가 WebSocket 로비·게임 서버와 UDP 음성 서버에 각각 연결되는 구성도",
    summary: "로비·매치메이킹은 WebSocket(양방향 실시간 통신 방식), 음성 패킷 전송은 UDP, 게임 플레이 상태 관리는 Unreal Dedicated Server가 맡습니다. 클라이언트 음성 경로는 캡처·코덱·전송·수신·재생 단계로 나눴습니다.",
  },
  implementations: [
    { title: "실시간 음성 캡처와 코덱 경계", body: "UPrivateVoiceChatComponent에서 캡처, Opus 인코딩, UDP 송신, 수신 디코딩과 재생 책임을 분리했습니다. 화자별 코덱 상태를 두어 수신 오디오가 서로 간섭하지 않게 했습니다. 음성은 16kHz 모노, 20ms 프레임, 24kbps Opus로 처리하고 FEC·DTX를 설정했습니다." },
    { title: "룸별 음성 패킷 분배", body: "C++ VoiceServer가 UDP 음성 패킷을 받은 뒤 룸 코드를 기준으로 작업 큐에 나눠 넣습니다. 같은 룸의 작업은 같은 샤드(분할 처리 단위)로 보내 순서를 유지하도록 설계했습니다. 공유 페이로드를 이용한 브로드캐스트도 구현했지만, 처리 지연이 얼마나 줄었는지 측정한 자료는 확인되지 않았습니다." },
    { title: "소켓과 이벤트 루프 분리", body: "게임 서버의 네트워크 이벤트 루프를 인터페이스로 분리하고 Linux epoll과 Windows select 구현을 두었습니다. UDP·TCP 엔드포인트 등록 시점을 서버 시작 전으로 제한하고, SocketPlatform으로 플랫폼별 소켓 생성·설정·종료 책임을 분리했습니다." },
  ],
  caseStudies: [
    {
      title: "앱 복귀 뒤 오래된 음성이 재생되는 문제",
      situation: "앱을 백그라운드로 보냈다가 복귀하면 음성이 지직거리거나 끊겼습니다.",
      analysis: "앱이 백그라운드에 있는 동안 캡처 버퍼와 Opus 링 버퍼(원형으로 재사용하는 임시 저장 공간)에 PCM이 쌓여, 복귀한 뒤 오래된 데이터까지 처리됐습니다.",
      decision: "실시간 음성은 밀린 데이터를 재생하지 않고 버린 뒤 코덱 상태를 새로 시작하도록 했습니다.",
      implementation: "앱 오디오 포커스(음성 입력을 처리할 수 있는 활성 상태)를 잃으면 캡처 데이터를 비우고 코덱을 초기화했습니다. 버퍼가 8KB를 넘으면 모두 버리고, 한 번에 읽는 양은 최대 4096B로 제한했습니다.",
      verification: "프로젝트 기록에는 백그라운드에서 포그라운드로 전환한 뒤 정상 재생되는 수정 결과가 기재되어 있습니다.",
      limitations: "장시간·반복 전환 시험의 횟수와 재생 품질의 정량 지표는 기록에서 확인되지 않습니다.",
    },
    {
      title: "음성 캡처 객체가 생성되지 않는 문제",
      situation: "UDP 전송은 이루어졌지만 수신 음성이 비거나 잡음이 발생했습니다.",
      analysis: "Unreal Engine(UE)의 캡처 API에 전달한 시스템 장치 이름(Friendly Name)이 DirectSound의 장치 식별자와 맞지 않아 캡처 생성이 실패할 수 있었습니다. 캡처·전송·재생 책임도 한 클래스에 섞여 있어 원인을 나누기 어려웠습니다.",
      decision: "운영체제 기본 입력 장치를 사용하고, 음성 경로를 기능별 클래스로 나눴습니다.",
      implementation: "CreateVoiceCapture에 빈 장치 이름을 전달해 운영체제 기본 입력 장치를 선택하도록 했습니다. 캡처, 코덱, 전송, 수신·재생 역할도 별도 클래스로 나눴습니다.",
      verification: "3월 5일 프로토타입 완료 기록과 캡처 장치 선택 변경이 프로젝트 문서에 남아 있습니다.",
      limitations: "지원 장치별 호환성 표와 음질 측정 결과는 확인되지 않습니다.",
    },
    {
      title: "네트워크 기능을 추가할 때 커지던 변경 범위",
      situation: "초기 WebSocketManager 하나가 연결, 룸 상태, 브로드캐스트를 모두 맡아 기능을 바꿀 때 영향 범위가 컸습니다.",
      analysis: "이벤트 루프, 통신 주소 등록, 운영체제별 소켓 처리가 한 구현 안에 묶여 있었습니다.",
      decision: "이벤트 루프와 소켓의 생성·종료를 분리하고, 통신 주소는 서버를 시작하기 전에만 등록하도록 했습니다.",
      implementation: "INetworkEventLoop 인터페이스와 Linux epoll·Windows select 구현을 분리했습니다. SocketPlatform을 통해 POSIX와 Winsock 동작을 추상화했습니다.",
      verification: "관련 단계별 커밋 S14P21A302-68, -74, -192~-194가 문서에 기재되어 있습니다.",
      limitations: "플랫폼별 자동화 테스트 결과나 성능 비교 수치는 제공된 프로젝트 노트에 없습니다.",
    },
  ],
  verification: {
    summary: "수치 성과는 PCM과 Opus 애플리케이션 페이로드 크기 비교로 한정했습니다. 워커 샤딩의 지연 개선량은 측정값으로 제시하지 않습니다.",
    items: [
      "비교 기준: 16-bit PCM 모노 16kHz·20ms 프레임 640B와 Opus 애플리케이션 페이로드. 문서상 감소율은 약 90.3%이며 전송 헤더는 제외합니다.",
      "Opus 설정: 24kbps, 20ms, FEC·DTX 적용. 설정값은 프로젝트 기록 기준이며 별도 음질 벤치마크는 확인되지 않습니다.",
      "백그라운드 복귀 수정은 정상 재생으로 기록되어 있으나, 재현 횟수·지연·오디오 품질 지표는 없습니다.",
      "게임 서버는 Linux epoll 및 Windows select 이벤트 루프와 POSIX·Winsock 소켓 추상화를 문서에 명시합니다.",
    ],
  },
  decisionVisual: {
    title: "앱 복귀 때 오래된 음성을 버리는 판단",
    code: `// 판단 흐름을 설명하는 의사 코드입니다. 실제 구현 코드가 아닙니다.\nif (!hasAudioFocus) {\n  discard(captureBuffer);\n  reset(opusEncoder);\n  return;\n}\nif (captureBuffer.size > MAX_BUFFER_SIZE) {\n  discard(captureBuffer);\n  reset(opusEncoder);\n}\nframe = captureBuffer.read(maxBytes = 4096);\nencode(opusEncoder, frame);`,
    steps: [
      { label: "앱 비활성화", detail: "캡처를 이어 쌓지 않고 버퍼에 남은 오디오를 비웁니다." },
      { label: "복귀 시 점검", detail: "오래된 데이터가 남았는지 버퍼 크기를 확인합니다." },
      { label: "오래된 데이터 폐기", detail: "8KB 초과 버퍼는 전량 비우고 코덱 상태를 초기화합니다." },
      { label: "새 음성 처리", detail: "틱당 최대 4096B만 읽어 새 프레임부터 인코딩합니다." },
    ],
    note: "프로젝트 기록에 적힌 앱 복귀 처리의 요약입니다. 반복 시험 횟수나 음질 측정 결과를 뜻하지 않습니다.",
  },
  links: { github: null, demo: null },
  theme: { accent: "#9A7B54" },
};
