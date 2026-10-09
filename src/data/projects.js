import { projectDetailPages } from "./projectDetailPages";

const baseProjects = [
  {
    id: "robotpal",
    num: "01",
    title: "RobotPal",
    subtitle: "1232×832 영상 품질을 유지한 채 실제 병목을 재측정해 JPEG를 Simulation critical path에서 분리한 C++ 로봇 시뮬레이터",
    period: "2025.11 – 2025.12",
    team: "4인",
    role: "C++ 시뮬레이터의 스트리밍·통신·로봇 제어 기능 및 성능 검증",
    roleItems: ["카메라 프레임 스트리밍 파이프라인 개발", "Tracy 기반 구간별 병목 프로파일링", "PBO·JPEG 4 Worker 구조 비교 및 반복 검증", "TCP·WebSocket 전송 계층 분리", "네트워크 명령 기반 AGV 제어 연동"],
    metric: "66.70 → 96.01 FPS",
    metricLabel: "Streaming ON Simulation FPS",
    benchmark: "1232×832 · Sync/PBO/PBO+MT · OFF/ON 각 5회 · median",
    summary: [
      "JETANK 번호판 인식에 필요한 1232×832 해상도를 유지한 채 카메라 스트리밍 성능을 최적화했습니다.",
      "초기에는 GPU Readback을 주요 병목으로 예상했지만, Tracy 계측에서 Sync Readback p50 1.144ms보다 JPEG p50 16.406ms가 훨씬 큰 Main Thread 병목임을 확인했습니다.",
      "PBO-only가 성능을 높이지 못하자 가설을 수정하고 JPEG를 4 Worker로 분리해 Simulation critical path에서 제거했습니다.",
      "그 결과 Streaming ON Simulation FPS 66.70→96.01(+43.9%), Camera Send FPS 26.95→40.05(+48.6%), Streaming Penalty 34.84%→6.74%(-28.1%p)를 기록했습니다.",
    ],
    stack: ["C++17", "CMake", "OpenGL", "PBO", "JPEG", "Tracy", "TCP Socket", "WebSocket", "Multithreading", "WebAssembly", "Emscripten", "Python", "Git", "GitHub"],
    cover: "/project-robotpal-cover.png",
    highlights: [
      "가설과 달리 PBO-only가 개선되지 않은 결과를 그대로 받아들이고 Tracy로 병목을 다시 찾았습니다.",
      "JPEG 작업을 Main Thread에서 4 Worker로 분리해 Simulation FPS와 Camera Send FPS를 동시에 높였습니다.",
      "60 FPS 송신 목표에는 아직 도달하지 못했으며 JPEG 처리량·CPU 메모리 복사·Worker 구조를 다음 과제로 남겼습니다.",
    ],
    implementations: [
      {
        title: "AI 학습·추론용 가상 카메라 스트리밍",
        summary: "OpenGL로 생성한 1232×832 카메라 영상을 외부 AI가 사용할 수 있도록 JPEG 압축과 네트워크 전송 경로에 연결했습니다.",
        details: [
          "번호판 인식에 필요한 영상 품질을 유지하기 위해 해상도를 1232×832로 고정했습니다.",
          "Camera Streaming Send FPS와 Streaming ON Simulation FPS를 별도 지표로 두어 영상 전달과 시뮬레이션 성능을 함께 확인했습니다.",
          "수신·디코딩은 이번 최신 성능 측정 범위에서 제외해 주장 범위를 명확히 구분했습니다.",
        ],
      },
      {
        title: "가설 검증형 성능 프로파일링",
        summary: "GPU Readback을 첫 병목으로 예상했지만 PBO-only 결과가 개선되지 않아 Tracy로 처리 구간을 다시 측정했습니다.",
        details: [
          "Sync에서 Readback p50 1.144ms, JPEG p50 16.406ms를 확인해 초기 가설과 실제 병목이 다르다는 점을 확인했습니다.",
          "PBO-only는 Simulation FPS ON 65.60, Camera Send FPS 25.49로 기준보다 개선되지 않았습니다.",
          "특정 최적화 기법을 정답으로 두지 않고 측정값에 따라 원인과 우선순위를 다시 정했습니다.",
        ],
      },
      {
        title: "JPEG 4 Worker와 critical path 분리",
        summary: "JPEG 알고리즘 자체를 빠르게 만드는 대신 압축 작업을 Simulation Main Thread에서 분리했습니다.",
        details: [
          "PBO-MT에서 Main-thread enqueue p50은 0.017ms로 측정됐습니다.",
          "JPEG Worker 개별 p50은 27.075ms로 오히려 증가했으므로 'JPEG가 빨라졌다'고 해석하지 않았습니다.",
          "여러 worker가 병렬 처리하면서 Main Thread가 압축 완료를 기다리지 않게 된 것이 전체 성능 향상의 핵심이었습니다.",
        ],
      },
      {
        title: "반복 측정과 sanity gate",
        summary: "Sync / PBO / PBO+MT를 같은 환경에서 비교하고 Streaming OFF/ON을 각각 5회 측정해 median을 사용했습니다.",
        details: [
          "Streaming-OFF FPS의 브랜치 간 차이는 0.557%로 sanity gate 5%를 통과했습니다.",
          "해상도를 낮추지 않고 같은 품질 조건에서 구조 차이만 비교했습니다.",
        ],
      },
      {
        title: "Desktop·Web 전송 계층 분리",
        summary: "Desktop TCP와 WebAssembly WebSocket 차이를 상위 시뮬레이션·제어 로직에 노출하지 않도록 전송 경계를 분리했습니다.",
      },
    ],
    problems: [
      {
        title: "GPU Readback을 병목으로 본 초기 가설이 틀린 문제",
        problem: "카메라 스트리밍 시 Simulation FPS가 크게 떨어져 처음에는 GPU Readback을 주요 원인으로 예상했습니다.",
        process: [
          "동기 glReadPixels 기준과 Non-blocking PBO + Fence 구조를 같은 조건에서 비교했습니다.",
          "PBO-only에서도 Simulation FPS ON과 Camera Send FPS가 좋아지지 않는 것을 확인했습니다.",
          "Tracy로 Readback과 JPEG 압축을 다시 분리 계측했습니다.",
        ],
        solution: "Sync Readback p50 1.144ms에 비해 JPEG p50 16.406ms가 훨씬 크다는 데이터를 근거로 병목 가설을 JPEG Main Thread 처리로 수정했습니다.",
        result: "PBO를 성능 개선의 원인으로 포장하지 않고 실제 병목을 다시 정의했습니다.",
      },
      {
        title: "JPEG가 Simulation critical path를 점유한 문제",
        problem: "Main Thread가 매 프레임 JPEG 압축을 기다리면서 Streaming ON Simulation FPS가 66.70 FPS까지 떨어졌습니다.",
        decision: "개별 JPEG 연산을 미세 최적화하기보다 압축 완료 대기를 Simulation critical path에서 제거하는 것이 우선이라고 판단했습니다.",
        solution: "JPEG 작업을 4 Worker로 분리하고 Main Thread에서는 작업을 큐에 넣은 뒤 다음 Simulation frame으로 진행하도록 변경했습니다.",
        result: "Simulation FPS ON 96.01, Camera Send FPS 40.05로 증가했고 Streaming Penalty는 6.74%까지 낮아졌습니다.",
      },
      {
        title: "PBO-only의 제한과 남은 메모리 복사",
        problem: "PBO로 Readback을 비동기화해도 완료된 데이터를 CPU JPEG 입력으로 사용하려면 1232×832 RGB 기준 약 2.93MiB를 CPU 메모리로 복사해야 했습니다.",
        result: "현재 iGPU workload에서는 PBO-only 이점이 관측되지 않았으며, 이를 다른 GPU 환경에 일반화하지 않고 별도 측정이 필요하다고 정리했습니다.",
      },
      {
        title: "브라우저에서 pthreads 경로가 바로 실행되지 않는 문제",
        problem: "WebAssembly pthreads는 SharedArrayBuffer와 교차 출처 격리 조건이 필요해 정적 배포 환경의 제약을 함께 해결해야 했습니다.",
        solution: "브라우저 실행 조건을 확인하고 COI Service Worker 등을 이용해 멀티스레드 실행 경로를 검증했습니다.",
      },
    ],
    techChoice: [
      {
        tech: "PBO + Fence",
        feature: "GPU pixel transfer 비동기화",
        decision: "GPU Readback 병목 가설을 검증하기 위해 적용했지만, PBO-only 결과가 개선되지 않아 최종 성능 향상의 주원인으로 해석하지 않았습니다.",
        advantage: "GPU·CPU 작업 중첩 가능성을 실험할 수 있습니다.",
        comparison: "현재 workload에서는 PBO 관리·CPU 복사·JPEG 비용 때문에 단독 개선 효과가 관측되지 않았습니다.",
      },
      {
        tech: "JPEG 4 Worker",
        feature: "압축 작업을 Simulation Main Thread에서 분리",
        decision: "Tracy에서 JPEG가 실제 Main Thread 병목임을 확인한 뒤 적용했습니다.",
        advantage: "Main Thread enqueue p50 0.017ms로 압축 대기를 critical path에서 제거했습니다.",
        comparison: "개별 JPEG p50은 27.075ms로 증가했으므로 단일 job 자체가 빨라진 것은 아닙니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "처음 세운 병목 가설이 틀릴 수 있다는 전제에서 실제 데이터를 다시 측정하고, 결과가 예상과 다르면 원인과 해결 방향을 바꾸는 것이 성능 최적화의 핵심이라고 배웠습니다.",
      },
      {
        point: "남은 목표",
        detail: "Camera Send FPS는 40.05로 60 FPS 목표에 도달하지 못했습니다. 다음 우선순위는 JPEG 인코더 처리량, 불필요한 CPU 메모리 복사, 4 Worker 처리 구조입니다.",
      },
    ],
    links: {
      github: "https://github.com/cgantro/RobotPal",
    },
  },
  {
    id: "mausoleum",
    num: "02",
    title: "영묘",
    subtitle: "UE5 멀티플레이 환경에서 실시간 음성 통신과 방별 게임 진행을 처리하는 C++ 서버·클라이언트 프로젝트",
    period: "2026.02 – 2026.03",
    team: "6인",
    role: "C++ 음성 클라이언트·UDP 서버, 네트워크 계층 및 방별 게임 진행 로직",
    roleItems: ["UE5 음성 캡처·Opus 인코딩·디코딩·재생", "UDP 음성 서버와 RoomCode 워커 샤딩", "Dedicated·WebSocket·UDP 서버 역할 분리", "방별 인스턴스와 게임 페이즈·스폰 로직"],
    metric: "3 server roles",
    metricLabel: "Network Separation",
    benchmark: "Dedicated · WebSocket · UDP Voice",
    summary: [
      "UE5 클라이언트에서 16kHz·20ms 단위 음성을 Opus로 인코딩해 UDP 서버로 전송했습니다.",
      "서버는 패킷 유형과 크기를 확인한 뒤 같은 RoomCode 사용자에게 전달했습니다.",
      "앱 포커스 복귀 시 대기 패킷을 버리고 코덱 상태를 초기화했습니다.",
      "16-bit PCM 원본과 비교해 Opus 애플리케이션 페이로드를 약 90.3% 줄였습니다.",
    ],
    stack: ["C++", "Unreal Engine 5", "CMake", "uWebSockets", "UDP", "WebSocket", "Opus", "Multithreading", "Protobuf", "Windows Socket", "POSIX Socket", "Git"],
    cover: "/project-mausoleum-cover.png",
    highlights: [
      "마이크 캡처, Opus 인코딩, UDP 전송, 재생 단계를 책임별로 나눴습니다.",
      "20ms 프레임과 24kbps 설정으로 실시간 음성 경로를 구성했습니다.",
      "roomCode 처리와 생사 상태별 청취 규칙을 분리해 보이스 경로를 설명하기 쉽게 만들었습니다.",
    ],
    implementations: [
      {
        title: "UE5 보이스 클라이언트 파이프라인",
        summary: "캡처부터 재생까지 이어지는 음성 경로를 단계별 클래스로 나눠 어느 구간에서 문제가 생기는지 바로 추적할 수 있게 했습니다.",
        details: [
          "마이크 캡처, Opus 인코딩, UDP 전송, 방 라우팅 이후 수신·디코딩, 재생까지를 책임별 클래스로 나눠 보이스 런타임의 경로를 명확하게 만들었습니다.",
          "20ms 프레임, 24kbps, FEC/DTX 설정을 적용해 지연과 대역폭 사이의 균형을 맞췄고, 실시간 음성에 필요한 패킷 크기를 일정하게 유지했습니다.",
          "이 구조 덕분에 보이스 품질 문제가 생겼을 때 네트워크 지연인지, 코덱 상태인지, 캡처 버퍼 문제인지 단계별로 확인할 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Voice Client Flow",
          content: [
            { id: "capture", name: "Capture", desc: "마이크 입력" },
            { id: "encode", name: "Opus Encode", desc: "20ms 프레임 인코딩" },
            { id: "send", name: "UDP Send", desc: "음성 패킷 전송" },
            { id: "route", name: "Room Routing", desc: "roomCode 기준 전달" },
            { id: "receive", name: "Decode", desc: "수신 패킷 복구" },
            { id: "playback", name: "Playback / Policy", desc: "재생과 청취 조건 확인" },
          ],
        },
      },
      {
        title: "roomCode 기반 보이스 워커 큐",
        summary: "같은 방의 음성 처리가 다른 방 전체로 번지지 않도록 서버 처리 흐름을 roomCode 기준으로 나눴습니다.",
        details: [
          "UDP 패킷에서 roomCode를 추출한 뒤 해시 기준 워커 큐에 적재해, 방 하나의 패킷 몰림이 다른 방의 처리 지연으로 이어지지 않게 했습니다.",
          "서버 안에는 수신 패킷 처리 레이어를 두고 roomCode 추출, 큐 적재, 브로드캐스트 대상을 나누어 로직을 정리했습니다.",
          "브로드캐스트 시에는 같은 방의 클라이언트 목록을 기준으로 송신자를 제외한 대상에게만 음성 패킷을 전달해 방 단위 처리 경계를 분명하게 했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Voice Server Worker Queue",
          content: [
            { id: "room", name: "Room Code", desc: "방 식별" },
            { id: "queue", name: "Worker Queue", desc: "방 기준 큐 적재" },
            { id: "worker", name: "Worker", desc: "같은 방 대상에게 전달" },
          ],
        },
      },
      {
        title: "생사 상태별 청취 규칙 분리",
        summary: "보이스 파이프라인은 그대로 유지하고, 누가 누구를 들을 수 있는지는 규칙 레이어에서 바꾸는 구조로 정리했습니다.",
        details: [
          "살아있는 플레이어와 죽은 플레이어의 청취 가능 여부를 별도 전략으로 분리해, 거리 기반 청취와 생사 상태별 예외를 같은 조건문 안에 섞지 않았습니다.",
          "거리 기반 청취 규칙은 roomCode 안에서 대상 범위를 좁히는 기준으로 두고, 사망 이후 예외 규칙은 별도 전략 객체에서 판정하도록 구성했습니다.",
          "이 구조 덕분에 게임 규칙이 바뀌더라도 전송과 재생 파이프라인을 다시 건드리지 않고 청취 전략만 교체할 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Rule Separation",
          content: [
            { id: "alive", name: "Alive Rule", desc: "거리 기반 청취" },
            { id: "spirit", name: "Spirit Rule", desc: "생사 상태별 예외" },
            { id: "strategy", name: "Voice Strategy", desc: "청취 가능 여부 판정" },
          ],
        },
      },
    ],
    problems: [
      {
        title: "캡처 디바이스 초기화 실패로 보이스가 전송되지 않는 문제",
        problem:
          "처음에는 UDP 전송이나 Opus 인코딩 문제로 보였지만, 실제 원인은 UE5 캡처 API가 기대하는 입력 장치 식별 방식과 시스템 장치 이름이 맞지 않아 캡처 객체 자체가 생성되지 않는 데 있었습니다.",
        unexpected:
          "보이스가 들리지 않으면 네트워크나 코덱을 먼저 의심하기 쉽지만, 실제 문제는 캡처 초기화 단계에서 이미 시작되고 있었습니다.",
        background:
          "UE5 보이스 캡처 API는 OS가 표시하는 Friendly Name과 다른 장치 식별 기준을 사용할 수 있습니다. 장치 이름이 보인다고 바로 캡처 가능한 상태는 아닙니다.",
        process: [
          "전송 로그보다 먼저 입력 버퍼가 비어 있는지 확인해 캡처 경로부터 다시 봤습니다.",
          "UE5 캡처 API와 시스템 장치 이름이 일대일로 맞지 않는 점을 확인했습니다.",
          "특정 장치 이름을 계속 맞추기보다 OS 기본 입력 장치를 우선 사용하도록 경로를 정리했습니다.",
        ],
        solution:
          "CreateVoiceCapture에 빈 장치 식별자를 넘겨 OS 기본 입력 장치를 사용하도록 바꾸고, 캡처 초기화 경로를 다시 정리했습니다.",
        decision:
          "입력 장치 선택 로직보다 실제 음성 캡처가 안정적으로 시작되는 경로가 더 중요했기 때문에 기본 입력 장치를 기준으로 맞췄습니다.",
        result: "캡처 초기화 실패를 해결해 실제 음성 데이터가 송수신되는 상태로 복구했습니다.",
      },
      {
        title: "생사 상태별 청취 규칙이 보이스 파이프라인에 섞이는 문제",
        problem:
          "청취 조건을 if/else로 전송 경로 안에 직접 두기 시작하자, 게임 규칙이 늘어날수록 전송과 재생 코드까지 함께 수정해야 하는 구조가 됐습니다.",
        background:
          "보이스 런타임에서 바뀌는 것은 패킷 전달 경로가 아니라 청취 가능 여부 판단이었습니다. 두 책임이 한 경로에 섞이면 규칙 하나가 전송 계층 전체를 흔들게 됩니다.",
        process: [
          "규칙 변경이 캡처, 전송, 재생 경로 수정으로 이어지는 구조가 유지보수 비용을 키운다는 점을 먼저 확인했습니다.",
          "문제를 게임 규칙이 보이스 파이프라인에 들어와 있는 상태로 다시 정의했습니다.",
          "청취 가능 여부를 전략 레이어로 분리해 파이프라인과 규칙을 분리하는 방향을 선택했습니다.",
        ],
        solution:
          "청취 가능 여부를 전략 객체로 분리해 보이스 파이프라인은 유지하고, 생사 상태별 규칙만 교체할 수 있게 정리했습니다.",
        decision:
          "보이스 런타임의 안정성과 규칙 확장을 함께 가져가려면, 전송 경로보다 판정 레이어를 교체하는 구조가 더 적합했습니다.",
        result: "규칙 추가 시 기존 전송·재생 경로 수정 범위를 줄였습니다.",
        snippet: {
          type: "visual",
          label: "Voice Strategy",
          content: [
            { id: "alive", name: "Alive Rule", desc: "거리 기반 청취" },
            { id: "dead", name: "Spirit Rule", desc: "생사 상태별 예외" },
            { id: "judge", name: "Policy Check", desc: "청취 가능 여부 판정" },
          ],
        },
      },
      {
        title: "백그라운드 복귀 직후 깨짐과 지연이 누적되는 문제",
        problem:
          "복귀 직후 보이스가 끊기거나 밀리는 현상은 네트워크보다 캡처 버퍼와 코덱 상태가 이전 데이터를 계속 들고 있는 구조에서 시작됐습니다.",
        unexpected:
          "공간 음향이나 네트워크 지연처럼 보였지만, 실제 원인은 복귀 직후 오래된 PCM 데이터가 그대로 처리되는 데 있었습니다.",
        background:
          "실시간 오디오에서는 최신 데이터가 중요합니다. 오래된 버퍼가 남아 있으면 복귀 직후 시간축 자체가 밀리게 됩니다.",
        process: [
          "복귀 직후 입력 버퍼와 코덱 상태를 먼저 점검했습니다.",
          "문제를 네트워크만의 이슈가 아니라 캡처 버퍼와 코덱 상태가 함께 남아 있는 문제로 봤습니다.",
          "복귀 시점에 오래된 데이터를 비우고 현재 시점 오디오만 다시 처리하는 방향으로 정리했습니다.",
        ],
        solution:
          "백그라운드 복귀 시 누적된 캡처 데이터를 비우고 코덱 상태를 초기화해, 복귀 이후 데이터만 다시 처리하도록 바꿨습니다.",
        result: "백그라운드 복귀 직후 깨짐과 지연 누적 현상을 줄였습니다.",
      },
    ],
    techChoice: [
      {
        tech: "UDP",
        feature: "짧은 지연이 중요한 실시간 음성 전달 경로",
        decision: "음성 경로는 완전한 전달보다 짧은 지연이 중요해 UDP를 선택했습니다.",
        advantage: "패킷 하나의 지연이 전체 스트림을 막지 않습니다.",
        comparison: "TCP보다 손실 처리는 직접 고려해야 하지만, 실시간 음성에는 더 적합했습니다.",
      },
      {
        tech: "Opus",
        feature: "대역폭과 지연의 균형을 맞추는 실시간 음성 코덱",
        decision: "대역폭과 지연의 균형을 맞추기 위해 Opus를 사용했습니다.",
        advantage: "20ms 프레임, 24kbps, FEC/DTX 설정으로 실시간 음성에 맞는 전송 크기를 구성했습니다.",
        comparison: "RAW PCM보다 구현은 복잡하지만 패킷 크기와 손실 대응 측면에서 유리했습니다.",
      },
      {
        tech: "Voice Server Worker Queue",
        feature: "roomCode 기준으로 보이스 패킷 처리 흐름을 나누는 서버 구조",
        decision: "roomCode 기준으로 보이스 패킷 처리 흐름을 나누기 위해 사용했습니다.",
        advantage: "방 단위로 처리 간섭을 줄이고 병목 지점을 보기 쉬웠습니다.",
        comparison: "단일 큐보다 구조는 복잡하지만 방 단위 확장과 추적에는 더 유리했습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "실시간 오디오 문제는 네트워크만이 아니라 캡처 버퍼와 코덱 상태까지 함께 봐야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "보이스 품질을 직접 보여주는 계측 지표와 자동화된 검증 루프까지 확장하지 못한 점은 아쉽습니다.",
      },
    ],
    links: {},
  },
  {
    id: "autowing",
    num: "03",
    title: "오토잉카",
    subtitle: "모의 토잉카 클라이언트의 텔레메트리를 수집하고, 관제 명령과 장비 상태를 처리하는 실시간 관제 시스템",
    period: "2026.01 – 2026.02",
    team: "6인",
    role: "상태 전이, 실시간 메시지 처리 및 경로 정책 개발",
    roleItems: ["MQTT 장비 데이터 처리와 WebSocket 관제 전달", "장비 결과 이벤트 기반 상태 전이", "제어·영상·보조 데이터 채널 분리", "그래프 기반 경로 추천·우회 정책", "500대 장비 텔레메트리 부하 테스트"],
    metric: "8,935 msg/s",
    metricLabel: "Peak Throughput",
    benchmark: "500 simulated clients × 10Hz",
    summary: [
      "공항 토잉카의 위치와 상태를 실시간으로 수집하고 관제 명령과 경로 정보를 전달하는 실시간 관제 백엔드를 개발했습니다.",
      "명령 시점이 아닌 장비 결과 이벤트를 기준으로 상태를 확정하고, DB 트랜잭션 완료 뒤 외부 메시지를 발행했습니다.",
      "500대 장비가 초당 10회 텔레메트리를 전송하는 조건에서 E2E 지연 14~28ms와 처리량 8,935msg/s를 기록했습니다.",
    ],
    stack: ["Java", "Spring Boot", "MQTT", "STOMP", "WebSocket", "Redis", "PostgreSQL", "TimescaleDB", "AWS EC2", "Docker", "Git", "GitLab", "GitLab CI", "k6"],
    cover: "/project-autowing-cover.png",
    highlights: [
      "관리 화면과 차량 상태가 같은 순서로 보이도록 이벤트 흐름을 정리했습니다.",
      "MQTT 제어 채널과 WebRTC 영상 채널을 분리해 서로 다른 지연 요구사항을 나눴습니다.",
      "트랜잭션 커밋 이후 MQTT 이벤트가 시작되도록 바꿔 커밋 전 상태 노출을 줄였습니다.",
    ],
    implementations: [
      {
        title: "관제 명령과 상태 전이 흐름",
        summary: "관리 화면의 명령과 차량 상태 변화가 같은 문맥에서 설명되도록 상태 전이 기준과 이벤트 순서를 먼저 정리했습니다.",
        details: [
          "운영자 승인, 출발, 차단, 정지, 복귀 같은 명령이 들어올 때 화면 설명과 차량 상태가 같은 순서로 보이도록 백엔드 쪽 상태 전이 기준을 먼저 잡았습니다.",
          "차량 상태 보고와 관제 명령 전달은 HTTP 응답 안에서 한 번에 묶지 않고 MQTT 이벤트 흐름으로 분리해, 백엔드가 상태 변화 기준과 이벤트 시작 시점을 관리하도록 만들었습니다.",
          "이 구조 덕분에 트러블슈팅도 단순 통신 지연이 아니라 상태 전이와 이벤트 순서 문제로 설명할 수 있게 됐습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Control State Flow",
          content: [
            { id: "tower", name: "Control Center", desc: "승인과 정지 판단" },
            { id: "backend", name: "Backend + MQTT", desc: "명령과 상태 기준 관리" },
            { id: "car", name: "Towing Car", desc: "상태 보고와 명령 수행" },
          ],
        },
      },
      {
        title: "맵 그래프 기반 경로 추천",
        summary: "서버 메모리에 올린 노드·엣지 그래프를 기준으로 경로를 추천하고, 차단 구간이 생겼을 때 재계산 시작 기준을 정리했습니다.",
        details: [
          "서버에 저장된 맵 데이터를 애플리케이션 메모리에 올려두고, 노드와 엣지 관계를 기준으로 미션 경로를 추천했습니다.",
          "차단 구간이 생겼을 때는 단순히 전체 경로를 다시 계산하지 않고, 현재 위치와 이미 진행된 구간을 기준으로 어디서부터 다시 추천할지 정책을 정리했습니다.",
          "핵심은 알고리즘 이름보다 관리 화면 설명과 차량 상태 흐름이 어긋나지 않도록 재계산 기준을 명확히 하는 것이었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Rerouting Flow",
          content: [
            { id: "mission", name: "Mission Route", desc: "초기 경로 추천" },
            { id: "block", name: "Blocked Segment", desc: "차단 구간 반영" },
            { id: "planner", name: "Replan", desc: "현재 위치와 진행 구간 기준 재계산" },
          ],
        },
      },
      {
        title: "실시간 채널 분리",
        summary: "제어 메시지, 현장 영상, AI 판단 신호가 서로 다른 책임으로 보이도록 채널별 역할을 분리했습니다.",
        details: [
          "차량 상태와 관제 명령은 MQTT로, 현장 확인 영상은 WebRTC로, AI 서버에서 전달된 판단 결과는 보조 입력으로 나눠 채널별 책임을 구분했습니다.",
          "영상 확인 경로의 지연이 제어 메시지 흐름에 직접 영향을 주지 않도록 하고, 제어 메시지 흐름은 상태 전이 기준과 함께 설명할 수 있게 만들었습니다.",
          "이 구조 덕분에 영상 지연, 상태 이벤트, 경로 추천 정책을 같은 문제로 섞지 않고 각각 다른 레이어에서 설명할 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Channel Separation",
          content: [
            { id: "cmd", name: "MQTT Control", desc: "상태와 명령" },
            { id: "video", name: "WebRTC Feed", desc: "현장 확인 영상" },
            { id: "ai", name: "AI Signals", desc: "보조 판단 입력" },
          ],
        },
      },
    ],
    problems: [
      {
        title: "MQTT 이벤트를 받은 쪽이 아직 커밋 전 상태를 볼 수 있는 문제",
        problem:
          "상태 저장과 MQTT 발행을 같은 트랜잭션 안에서 처리하자, 이벤트를 받은 쪽이 DB 기준 최종 상태를 조회할 때 아직 커밋 전 상태를 보게 되는 경우가 있었습니다.",
        unexpected:
          "처음에는 메시지가 빨리 가는지가 더 중요해 보였지만, 실제 핵심은 전송 속도보다 상태 저장과 이벤트 시작 순서를 맞추는 것이었습니다.",
        background:
          "수신 측이 최종 상태를 DB 기준으로 다시 조회하는 구조에서는 메시지 발행 시점이 커밋 이후여야 화면 설명과 실제 상태가 같은 문맥으로 유지됩니다.",
        process: [
          "문제를 단순 통신 지연이 아니라 상태 저장과 이벤트 발행 순서의 어긋남으로 다시 정의했습니다.",
          "수신 측이 DB 기준 최종 상태를 조회하는 구조라면 발행 시점은 커밋 이후여야 한다고 판단했습니다.",
          "그래서 브로커를 바꾸기보다 트랜잭션 이후에만 후속 이벤트가 시작되도록 흐름을 분리했습니다.",
        ],
        solution:
          "트랜잭션이 활성화된 경우 커밋 이후에 MQTT 발행이 실행되도록 분리해, DB 반영이 끝난 뒤에만 이벤트와 화면 갱신 흐름이 이어지게 했습니다.",
        decision:
          "메시지 브로커 종류보다 상태 전이와 이벤트 순서를 먼저 맞추는 것이 현재 문제에 더 직접적인 해결이라고 판단했습니다.",
        result: "커밋 전 상태가 이벤트로 먼저 노출되는 상황을 줄였습니다.",
      },
      {
        title: "차단 구간 발생 시 어디서부터 경로를 다시 추천할지 불명확한 문제",
        problem:
          "맵 그래프 기반으로 경로를 추천하고 있었지만, 차단 구간이 생겼을 때 단순히 새 최단 경로를 계산하는 것만으로는 충분하지 않았습니다. 현재 위치와 이미 진행된 구간을 함께 보지 않으면 화면에서 경로 추천 이유를 설명하기 어려웠습니다.",
        unexpected:
          "처음에는 다시 최단 경로만 구하면 될 것 같았지만, 실제로는 재계산 시작 기준이 불명확하면 추천 결과를 같은 문맥으로 설명하기 어려웠습니다.",
        background:
          "관제형 프로토타입에서는 경로 계산 결과보다 왜 지금 이 경로가 다시 추천됐는지 설명 가능한 기준이 먼저 필요합니다.",
        process: [
          "이미 지나간 구간까지 다시 계산 대상에 포함하면 화면 설명과 차량 진행 상태가 맞지 않는다는 점을 확인했습니다.",
          "문제를 최단 경로 계산 그 자체보다 재계산 시작 기준 문제로 다시 정리했습니다.",
          "그래서 현재 위치와 이미 진행된 구간을 기준으로 탐색 시작점을 다시 잡는 방향을 선택했습니다.",
        ],
        solution:
          "차단 구간 발생 시 현재 위치와 이미 진행된 구간을 기준으로 그래프 탐색 시작점을 다시 잡고, 이후 경로를 재추천하는 정책을 명시했습니다.",
        decision:
          "알고리즘 이름보다 화면 설명과 차량 상태 흐름을 같은 문맥으로 유지하는 기준이 더 중요하다고 판단했습니다.",
        result: "경로 추천 결과가 차량의 진행 상태와 같은 문맥에서 설명되도록 정리됐습니다.",
      },
      {
        title: "WebSocket 연결 권한을 일반 API 토큰과 같은 방식으로 다루기 어려운 문제",
        problem:
          "오래 유지되는 WebSocket 연결 권한을 일반 API 인증과 같은 방식으로 처리하면 URL 노출과 만료 관리가 한 경로에 섞이게 됩니다.",
        process: [
          "짧은 REST 요청과 오래 유지되는 소켓 연결은 수명 주기가 다르다는 점을 먼저 정리했습니다.",
          "일반 Access Token을 그대로 연결 URL에 두는 방식은 권한 관리 책임을 흐리게 만든다고 판단했습니다.",
          "그래서 연결 전용 단기 토큰을 분리하는 방향을 선택했습니다.",
        ],
        solution:
          "WebSocket 연결에는 일반 Access Token과 분리된 단기 소켓 토큰을 사용해, 연결 권한을 별도 흐름으로 관리했습니다.",
        result: "일반 API 토큰이 WebSocket 연결에 그대로 쓰이는 상황을 막았습니다.",
      },
    ],
    techChoice: [
      {
        tech: "MQTT",
        feature: "상태와 명령을 빠르게 주고받는 제어 채널",
        decision: "빠르게 바뀌는 차량 상태와 관제 명령 흐름을 맞추기 위해 MQTT를 선택했습니다.",
        advantage: "상태 보고와 관제 명령을 HTTP 요청-응답 경로와 분리해 처리했습니다.",
        comparison: "일반 HTTP 요청-응답 구조만으로는 자주 바뀌는 차량 상태를 설명하기 어려웠습니다.",
      },
      {
        tech: "WebRTC",
        feature: "현장 확인 영상을 위한 별도 실시간 경로",
        decision: "영상 확인과 제어 메시지를 다른 책임으로 분리하기 위해 WebRTC 기반 스트림을 사용했습니다.",
        advantage: "제어 메시지 흐름과 섞지 않으면서 현장 확인 경로를 따로 유지할 수 있었습니다.",
        comparison: "영상과 제어를 같은 채널에서 다루면 지연 요구사항이 서로 영향을 주기 쉽습니다.",
      },
      {
        tech: "Map Graph",
        feature: "반복 조회되는 노드·엣지 관계를 메모리에서 참조하는 구조",
        decision:
          "서버에 저장된 맵 데이터를 메모리에 올려두고, 노드·엣지 관계를 기준으로 경로 추천과 재계산 기준을 일관되게 다루기 위해 사용했습니다.",
        advantage: "차단 구간과 현재 위치를 같은 구조 안에서 설명 가능한 재계산 정책으로 연결할 수 있었습니다.",
        comparison: "요청마다 맵 구조를 다시 읽는 방식보다 프로토타입 범위에서 빠른 조회와 설명 가능한 기준을 우선하기 좋았습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "관제형 프로토타입에서는 경로 알고리즘 자체보다 상태 전이와 이벤트 순서가 설명 가능해야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "상태 전이 시나리오를 코드 구조로 정리한 만큼, 다음 단계로는 상태 머신과 이벤트 리플레이 검증까지 더 명시적으로 연결하고 싶습니다.",
      },
    ],
    links: {},
  },
  {
    id: "sticker",
    num: "04",
    title: "STICKER",
    subtitle: "SQS, afterCommit, Redis 기준으로 긴 AI 추천 작업과 결과 정합성을 분리한 백엔드 서비스",
    period: "2026.04 - 2026.05",
    team: "6인",
    role: "추천 파이프라인 담당 · Redis 중복 방어 · 운영 정책 정리",
    stack: ["Spring Boot", "AWS SQS", "Redis", "Async Pipeline"],
    cover: "/Sticker.png",
    highlights: [
      "긴 AI 추천 작업을 SQS 기반 비동기 파이프라인으로 분리했습니다.",
      "Redis 기준으로 중복 실행과 중복 반영을 줄였습니다.",
      "afterCommit 발행과 실패 분류 기준으로 운영 흐름을 정리했습니다.",
    ],
    implementations: [
      {
        title: "비동기 추천 처리 흐름",
        summary: "긴 AI 추천 작업이 API 응답 경로를 점유하지 않도록 요청 검증과 추천 생성을 분리했습니다.",
        details: [
          "추천 요청 검증과 작업 적재는 Spring API가 맡고, 실제 추천 생성은 비동기 파이프라인으로 넘겨 요청 경로와 긴 작업의 책임을 나눴습니다.",
          "추천 요청을 즉시 결과 반환으로 연결하지 않고 SQS에 적재한 뒤 후속 작업 단계로 넘겨, 응답 경로가 AI 처리 시간과 직접 묶이지 않게 했습니다.",
          "이 구조 덕분에 추천 기능을 단순 기능 구현이 아니라 운영 가능한 작업 흐름으로 설명할 수 있게 됐습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Async Recommendation Flow",
          content: [
            { id: "app", name: "App", desc: "추천 요청" },
            { id: "api-ingest", name: "Spring API", desc: "검증과 작업 적재" },
            { id: "ai", name: "AI Server", desc: "추천 생성" },
            { id: "api-save", name: "Spring API", desc: "결과 검증과 저장" },
          ],
        },
      },
      {
        title: "중복 실행 방어와 결과 정합성",
        summary: "같은 추천 요청이 여러 번 들어와도 작업이 중복 실행되거나 결과가 두 번 반영되지 않도록 방어선을 나눴습니다.",
        details: [
          "같은 사용자와 같은 날짜의 추천 요청이 겹쳐도 작업 시작과 결과 저장 단계에서 중복을 다시 확인하도록 Redis 락과 최종 dedup 기준을 함께 사용했습니다.",
          "커밋 이후에만 외부 작업이 시작되도록 분리해, 사용자 화면에 보이는 상태와 내부 저장 상태가 다른 순서로 보이지 않게 정리했습니다.",
          "Redis 락은 1차 방어선이고, 최종 저장 직전에는 jobId/date 기준으로 다시 한 번 확인해 중복 반영을 줄였습니다.",
        ],
        snippet: {
          lang: "java",
          label: "Redis Distributed Lock",
          code: `public boolean tryLock(UUID userId, LocalDate date, String jobId, Duration ttl) {
    String key = "ai:daily-rec:lock:" + userId + ":" + date;
    Boolean locked = redisTemplate.opsForValue().setIfAbsent(key, jobId, ttl);
    return Boolean.TRUE.equals(locked);
}`,
          note: "Redis 락은 1차 방어선이며, 최종 저장 단계에서 jobId/date 기준으로 다시 중복 여부를 확인했습니다.",
        },
      },
      {
        title: "실패 분류와 운영 정책",
        summary: "재처리할 실패와 종료할 실패를 나누고, 인증 정책은 별도 흐름으로 분리해 운영 기준을 정리했습니다.",
        details: [
          "계약 위반 메시지와 일시 장애 메시지를 같은 방식으로 다루지 않도록 실패 유형을 분리해 재시도와 격리 기준을 정리했습니다.",
          "추천 파이프라인과 인증 정책을 한 경로에 섞지 않고, Refresh Token Rotation 기준은 별도 보안 정책으로 다뤄 권한 갱신 범위를 줄였습니다.",
          "이 구조 덕분에 운영 중 발생하는 실패를 단순 에러가 아니라 재처리 가능 여부와 추적 기준으로 나눠 설명할 수 있었습니다.",
        ],
        snippet: {
          type: "table",
          label: "운영 정책 예시",
          headers: ["주제", "정책", "의도"],
          rows: [
            ["Result Dedup", "jobId/date 기준 TTL", "중복 소비 차단"],
            ["Queue Error", "격리/재처리 분리", "실패 유형별 처리"],
            ["Token Rotation", "기존 토큰 즉시 폐기", "탈취 피해 최소화"],
          ],
        },
      },
    ],
    problems: [
      {
        title: "DB 커밋 전에 메시지가 먼저 소비되는 문제",
        problem:
          "SQS로 비동기 작업을 분리해도, DB가 롤백되거나 커밋 전 메시지가 소비되면 존재하지 않는 상태를 참조하는 작업이 먼저 시작될 수 있었습니다.",
        unexpected:
          "처음에는 메시지가 큐에만 잘 들어가면 된다고 생각했지만, 실제 핵심은 작업 분리보다 상태 저장과 메시지 시작 순서를 맞추는 것이었습니다.",
        background:
          "비동기 시스템에서는 작업 분리만으로 충분하지 않고, 저장 완료 시점과 후속 작업 시작 시점이 같은 순서를 따라야 합니다.",
        process: [
          "문제를 큐 적재 성공 여부가 아니라 상태 저장과 후속 작업 시작 시점의 불일치로 다시 정의했습니다.",
          "AI 서버가 결과적으로 DB 상태를 참조한다는 점을 확인했습니다.",
          "그래서 커밋 이후에만 외부 작업이 시작되도록 분리하는 방향을 선택했습니다.",
        ],
        solution:
          "afterCommit에 메시지 발행을 등록해, 트랜잭션 커밋 이후 SQS 메시지가 발행되도록 바꿨습니다.",
        decision:
          "메시지 브로커를 바꾸는 것보다 현재 문제에 더 직접적인 해결은 커밋 이후에만 외부 작업이 시작되게 만드는 것이었습니다.",
        result: "커밋 전 상태가 후속 작업으로 먼저 노출되는 상황을 줄였습니다.",
      },
      {
        title: "재처리할 실패와 종료할 실패를 구분해야 하는 문제",
        problem:
          "실패 메시지를 무조건 다시 처리하면 poison pill이 큐를 반복 점유하고, 무조건 버리면 일시 장애에서 복구할 기회를 잃게 됩니다.",
        unexpected:
          "처음에는 재시도 규칙 하나로 정리할 수 있을 것 같았지만, 실제로는 실패 유형을 나누지 않으면 운영 흐름이 바로 무너졌습니다.",
        background:
          "계약 위반 메시지와 일시 장애는 같은 정책으로 다루기 어렵습니다. 두 경우를 같은 재시도 규칙에 넣으면 반복 재처리나 과도한 폐기가 함께 생깁니다.",
        process: [
          "모든 실패를 같은 에러로 취급할수록 운영 리스크가 커진다는 점을 먼저 확인했습니다.",
          "재처리해도 성공 가능성이 낮은 메시지와 다시 처리해야 하는 메시지를 분리했습니다.",
          "그래서 운영 정책을 실패 유형 기준으로 다시 나누는 방향을 선택했습니다.",
        ],
        solution:
          "계약 위반 메시지는 격리와 수동 처리 대상으로 두고, DB·네트워크 같은 일시 장애 메시지는 visibility timeout 이후 다시 처리하도록 분리했습니다.",
        result: "반복 재처리되는 상황을 줄이고, 일시 장애 메시지에는 재처리 기회를 유지했습니다.",
      },
      {
        title: "Refresh Token 재사용 피해를 줄여야 하는 문제",
        problem:
          "리프레시 토큰이 탈취된 뒤에도 기존 토큰과 새 토큰이 함께 유효하면 공격 세션이 계속 이어질 수 있었습니다.",
        process: [
          "만료 시간만 보는 방식으로는 재사용 시도를 구분하기 어렵다는 점을 먼저 정리했습니다.",
          "새 토큰 발급보다 기존 토큰 즉시 폐기가 더 중요한 기준이라고 판단했습니다.",
          "그래서 재발급 시 기존 토큰을 바로 폐기하고 재사용 감지 시 세션 전체를 무효화하는 방향을 선택했습니다.",
        ],
        solution:
          "Refresh Token Rotation을 적용해 기존 토큰을 즉시 폐기하고, 재사용이 감지되면 해당 사용자의 세션 전체를 무효화했습니다.",
        result: "탈취된 토큰이 다시 사용되더라도 공격 세션이 이어지는 시간을 줄였습니다.",
        snippet: {
          lang: "java",
          label: "Refresh Token Rotation",
          code: `public TokenPair rotate(String refreshToken) {
    RefreshToken stored = repository.findByToken(refreshToken)
        .orElseThrow(TokenReusedException::new);
    repository.delete(stored);
    return issueNewPair(stored.getUserId());
}`,
        },
      },
    ],
    techChoice: [
      {
        tech: "AWS SQS",
        feature: "긴 추천 작업을 응답 경로 바깥으로 분리하는 메시지 큐",
        decision: "추천 생성이 오래 걸려도 사용자 요청 경로가 멈추지 않게 하기 위해 SQS를 사용했습니다.",
        advantage: "응답 경로와 추천 생성 흐름을 명확하게 분리할 수 있었습니다.",
        comparison: "Kafka 같은 스트리밍 인프라보다 현재 문제를 빠르게 분리해 보기 쉬웠습니다.",
      },
      {
        tech: "Transaction Boundary",
        feature: "저장 완료와 후속 작업 시작 순서를 맞추는 기준",
        decision: "트랜잭션 커밋 이후 SQS 메시지를 발행하도록 해 상태 설명과 작업 시작 순서를 맞췄습니다.",
        advantage: "커밋 전 상태가 후속 작업으로 먼저 노출되는 문제를 막기 좋았습니다.",
        comparison: "메시지 브로커를 바꾸기보다 현재 문제에 더 직접적인 해결이었습니다.",
      },
      {
        tech: "Redis Dedup / Idempotency",
        feature: "작업 시작과 결과 저장 직전에 중복을 줄이는 이중 방어선",
        decision: "중복 실행과 결과 중복 반영을 함께 줄이기 위해 Redis 락과 dedup 기준을 같이 사용했습니다.",
        advantage: "작업 시작 전과 결과 저장 직전에 각각 다른 중복 상황을 제어할 수 있었습니다.",
        comparison: "DB 저장 단계만 보는 것보다 저장 전 단계의 중복 실행도 함께 줄이기 좋았습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "AI 기능보다 먼저 중요한 것은 긴 작업을 분리하고, 실패와 중복을 추적 가능한 정책으로 나누는 백엔드 구조라는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "큐 처리 시간, 중복 차단 횟수, 재시도 횟수 같은 운영 지표를 더 분명한 수치로 남기고 싶습니다.",
      },
    ],
    links: {},
  },
  {
    id: "minibcg",
    num: "05",
    title: "MiniBCG",
    subtitle: "C++17 기반 로봇 시뮬레이터를 Emscripten과 WebAssembly pthreads로 브라우저에 제공하는 개인 프로젝트",
    period: "진행 중",
    team: "개인",
    teamLabel: "개인 프로젝트",
    role: "CMake 웹 빌드, WebGL 호환 렌더링과 정적 배포 구성",
    roleItems: ["Emscripten 기반 WebAssembly 빌드", "WebGL 2 렌더링과 브라우저 입력 연결", "pthreads와 Jolt Physics worker 구성", "COI Service Worker를 사용하는 정적 배포"],
    metric: "C++17 · WebAssembly · pthreads",
    metricLabel: "Browser Build",
    benchmark: "WebGL 2 · GitHub Pages · COI Service Worker",
    summary: [
      "기존 C++ 로봇 시뮬레이터를 브라우저에서 실행하도록 Emscripten 빌드 경로를 추가했습니다.",
      "Jolt 물리 작업과 비동기 Logger가 WebAssembly pthreads를 사용하도록 구성했습니다.",
      "포트폴리오 정적 배포 안에 데모를 포함하고, SharedArrayBuffer 실행 조건을 COI Service Worker로 맞춥니다.",
    ],
    stack: ["C++17", "CMake", "Emscripten", "WebAssembly", "WebGL 2", "pthreads", "Jolt Physics", "GitHub Actions"],
    highlights: [
      "데스크톱과 브라우저가 같은 시뮬레이션 코어를 사용합니다.",
      "브라우저의 WebGL 2 경로는 GLES 3 shader와 기본 canvas framebuffer를 사용합니다.",
      "정적 호스팅의 격리 헤더 문제를 COI Service Worker 방식으로 처리합니다.",
    ],
    implementations: [
      { title: "Emscripten CMake 빌드", summary: "브라우저 타깃 preset에서 테스트·벤치마크·Tracy를 제외하고 GLFW 브라우저 포트와 pthread 컴파일·링크 옵션을 설정합니다." },
      { title: "WebGL 2 렌더링", summary: "브라우저에서는 GLES 3 context와 GLSL ES shader를 사용하고, 기본 canvas에 직접 렌더링합니다." },
      { title: "정적 배포와 포트폴리오 임베드", summary: "MiniBCG 저장소에서 빌드한 단일 HTML 번들을 정적 자산으로 포함하고 프로젝트 상세 페이지의 iframe으로 제공합니다." },
    ],
    problems: [
      { title: "정적 호스팅에서 pthreads 실행 조건 확보", problem: "WebAssembly pthreads가 사용하는 SharedArrayBuffer는 교차 출처 격리된 문서에서만 사용할 수 있습니다.", solution: "포트폴리오의 전체 문서 체인에 COI Service Worker를 적용하고 iframe에 격리 권한을 선언합니다.", result: "정적 배포 환경에서 부모 페이지와 데모 iframe이 모두 격리 조건을 갖추도록 구성합니다." },
    ],
    retrospective: [
      { point: "브라우저 검증", detail: "배포 후 crossOriginIsolated, SharedArrayBuffer, pthread worker 생성, 렌더링과 조작 입력을 브라우저에서 확인합니다." },
      { point: "정적 리소스 호환성", detail: "COEP 적용 뒤 포트폴리오에서 사용하는 글꼴과 외부 이미지가 정상적으로 불러와지는지 확인합니다." },
    ],
    links: { github: "https://github.com/cgantro/GraspLink" },
  },
];

// Sticker는 보조 프로젝트로 유지하며, 주력 3개 뒤에 배치한다.
const portfolioContent = {
  robotpal: {
    subtitle: "1232×832 영상 품질을 유지하면서 초기 가설을 계측으로 수정하고 JPEG를 Simulation critical path에서 분리한 C++ 시뮬레이터 프로젝트",
    roleItems: ["OpenGL 기반 카메라 스트리밍 파이프라인 개발", "Tracy 기반 Readback·JPEG 병목 분석", "PBO/Fence 및 JPEG 4 Worker 구조 비교", "네이티브 TCP·WebAssembly WebSocket 전송 계층 분리", "네트워크 명령 기반 AGV 제어 연동"],
    metric: "66.70 → 96.01 FPS",
    metricLabel: "Streaming ON Simulation FPS",
    metricDefinition: "1232×832 · Streaming OFF/ON 각 5회 측정 후 median · Sync 대비 PBO+4Worker",
    benchmark: "1232×832 · Sync/PBO/PBO+MT · 5 runs each · median · 60 FPS cap",
    summary: [
      "AI 학습·추론에 사용할 가상 카메라 영상을 1232×832 해상도로 생성·전송하는 스트리밍 기능을 개발했습니다.",
      "초기 GPU Readback 병목 가설과 달리 Tracy에서 Sync Readback p50 1.144ms, JPEG p50 16.406ms를 확인해 실제 병목을 JPEG Main Thread 처리로 수정했습니다.",
      "JPEG를 4 Worker로 분리해 Simulation FPS ON 66.70→96.01(+43.9%), Camera Send FPS 26.95→40.05(+48.6%), Streaming Penalty 34.84%→6.74%(-28.1%p)를 기록했습니다.",
    ],
    outcomes: [
      { label: "Simulation FPS ON", value: "66.70 → 96.01", detail: "Sync 대비 PBO+4Worker · 약 43.9% 향상" },
      { label: "Camera Send FPS", value: "26.95 → 40.05", detail: "약 48.6% 향상 · 60 FPS 목표는 미달" },
      { label: "Streaming Penalty", value: "34.84% → 6.74%", detail: "28.1%p 감소" },
    ],
    highlights: [
      "PBO-only가 개선되지 않은 결과를 근거로 GPU Readback 중심 가설을 폐기하고 Tracy로 다시 프로파일링했습니다.",
      "JPEG 작업을 Simulation critical path에서 분리해 Main-thread enqueue p50 0.017ms로 줄였습니다.",
      "개별 JPEG Worker p50은 27.075ms로 늘었기 때문에 JPEG 자체가 빨라졌다고 표현하지 않습니다.",
    ],
    implementations: [
      {
        title: "1232×832 카메라 스트리밍 파이프라인",
        summary: "번호판 인식에 필요한 영상 품질을 유지한 채 가상 카메라 프레임을 JPEG로 처리해 외부 클라이언트로 전달하는 경로를 구현했습니다.",
      },
      {
        title: "PBO + Fence 비교 실험",
        summary: "GPU Readback 병목 가설을 검증하기 위해 Non-blocking PBO + Fence를 적용했지만, PBO-only는 Simulation FPS ON 65.60, Camera Send FPS 25.49로 전체 성능을 개선하지 못했습니다.",
      },
      {
        title: "Tracy 기반 실제 병목 특정",
        summary: "Sync에서 Readback p50 1.144ms와 JPEG p50 16.406ms를 비교해 실제 Main Thread 병목이 JPEG 압축임을 확인했습니다.",
      },
      {
        title: "JPEG 4 Worker와 critical path 분리",
        summary: "Main Thread는 압축 완료를 기다리지 않고 p50 0.017ms의 enqueue 후 다음 Simulation frame으로 진행하도록 변경했습니다. JPEG Worker 개별 p50은 27.075ms로 증가했지만 병렬 처리로 전체 처리량을 높였습니다.",
      },
      {
        title: "반복 측정과 sanity gate",
        summary: "세 구조에서 Streaming OFF/ON을 각각 5회 측정해 median을 사용했고, OFF FPS 브랜치 간 차이 0.557%로 5% sanity gate를 통과했습니다.",
      },
      {
        title: "TCP·WebSocket 전송 계층 분리",
        summary: "Desktop TCP와 WebAssembly WebSocket의 차이를 상위 기능에서 분리해 같은 제어·스트리밍 흐름을 유지했습니다.",
      },
    ],
    problems: [
      {
        title: "초기 GPU Readback 가설이 실제 결과와 맞지 않았던 문제",
        problem: "Simulation 성능 저하의 주원인을 GPU Readback으로 예상했지만 PBO-only가 전체 성능을 높이지 못했습니다.",
        background: "PBO 경로에서도 완료된 데이터를 CPU JPEG 입력으로 사용하려면 map과 약 2.93MiB의 CPU 메모리 복사가 필요했습니다.",
        solution: "Tracy로 Readback과 JPEG 시간을 분리해 다시 측정하고, 실제 비용이 더 큰 JPEG Main Thread 처리를 병목으로 재정의했습니다.",
        result: "특정 기술을 적용한 사실보다 가설을 측정으로 반박하고 원인을 바꾼 과정을 성능 개선의 기준으로 삼았습니다.",
      },
      {
        title: "JPEG가 Simulation critical path를 점유한 문제",
        problem: "Sync 조건에서 JPEG p50 16.406ms가 Main Thread에서 수행돼 다음 Simulation frame을 지연시켰습니다.",
        solution: "JPEG를 4 Worker로 분리하고 Main Thread는 enqueue만 수행하도록 구조를 변경했습니다.",
        result: "Simulation FPS ON 96.01, Camera Send FPS 40.05, Streaming Penalty 6.74%를 기록했습니다.",
      },
      {
        title: "60 FPS 송신 목표 미달",
        problem: "최종 Camera Send FPS는 40.05로 목표 60 FPS에 도달하지 못했습니다.",
        solution: "다음 최적화 순위를 JPEG 인코더 처리량, 불필요한 CPU 메모리 복사, 4 Worker 처리 구조로 정리했습니다.",
        result: "달성하지 못한 목표와 남은 병목을 성과와 함께 명시했습니다.",
      },
    ],
    techChoice: [
      { tech: "PBO + Fence", feature: "비동기 pixel transfer 실험", decision: "GPU Readback 병목 가설을 검증하기 위해 적용했습니다.", advantage: "GPU/CPU 작업 중첩 가능성을 확인할 수 있습니다.", comparison: "현재 workload에서는 단독 개선 효과가 관측되지 않았습니다." },
      { tech: "4 JPEG Workers", feature: "Main Thread 압축 대기 제거", decision: "Tracy에서 JPEG가 실제 병목임을 확인한 뒤 적용했습니다.", advantage: "Simulation critical path에서 JPEG를 분리했습니다.", comparison: "개별 JPEG latency는 증가했으므로 알고리즘 자체가 빨라진 것은 아닙니다." },
    ],
    retrospective: [
      { point: "검증 방식", detail: "Streaming OFF/ON을 각각 5회 측정하고 median을 사용했으며 OFF FPS 차이 0.557%로 branch sanity gate를 확인했습니다." },
      { point: "측정 범위", detail: "수신·디코딩은 이번 최신 성능 측정 범위에서 제외했습니다." },
      { point: "남은 과제", detail: "60 FPS 목표 달성을 위해 JPEG encoder throughput, CPU memory copy, worker 구조를 추가로 검증해야 합니다." },
    ],
  },
  mausoleum: {
    subtitle: "UE5 멀티플레이 환경에서 실시간 음성 통신과 방별 게임 진행을 처리하는 C++ 서버·클라이언트 프로젝트",
    role: "C++ 음성 클라이언트·UDP 서버, 네트워크 계층 및 방별 게임 진행 로직",
    roleItems: ["UE5 음성 캡처·Opus 인코딩·디코딩·재생", "UDP VoiceServer 패킷 검증·중계와 RoomCode 워커 샤딩", "로비·인게임 상태 기반 음성 청취 정책", "Dedicated Server·WebSocket 로비 서버·UDP 음성 서버 역할 분리", "Windows·Linux 소켓 생명주기 구현", "방별 인스턴스·게임 페이즈·스폰 오케스트레이터 구현"],
    metric: "3 server roles",
    metricLabel: "Network Separation",
    benchmark: "Dedicated · WebSocket · UDP Voice",
    summary: [
      "UE5 멀티플레이 환경에서 로비, 방별 게임 진행과 실시간 음성 통신을 처리하는 C++ 서버·클라이언트 기능을 개발했습니다.",
      "Dedicated Server, WebSocket 로비 서버와 UDP 음성 서버의 역할을 분리하고 Windows·Linux 네트워크 계층을 구현했습니다.",
      "Room Code로 음성 라우팅과 게임 인스턴스·페이즈·이벤트 범위를 구분하고, 포커스 복귀 시 오래된 음성 버퍼를 폐기했습니다.",
    ],
    outcomes: [
      { label: "Voice Processing", value: "2 workers", detail: "RoomCode 기준으로 UDP 패킷 작업 분배" },
      { label: "Opus Profile", value: "16kHz · 20ms · 24kbps", detail: "FEC·DTX 적용" },
      { label: "Server Roles", value: "3 paths", detail: "Dedicated · WebSocket Lobby · UDP Voice" },
    ],
    highlights: ["음성 클라이언트와 UDP 중계 서버를 구현했습니다.", "네트워크 처리와 게임 로직, 서버별 책임을 분리했습니다.", "Room Code를 음성·게임 진행의 방 단위 경계로 사용했습니다."],
    implementations: [
      { title: "UE5 실시간 음성 클라이언트", summary: "마이크 입력을 캡처하고 Opus로 인코딩해 UDP로 전송했습니다. 수신 패킷은 화자별 코덱으로 디코딩해 재생하도록 캡처·코덱·네트워크·재생 책임을 분리했습니다." },
      { title: "Opus 음성 프로파일", summary: "16kHz 모노 PCM을 20ms 프레임으로 처리하고 24kbps Opus에 FEC와 DTX를 적용했습니다. 실시간 재생에 필요한 지연, 음성 품질과 전송량을 설정값으로 조정했습니다." },
      { title: "UDP VoiceServer와 패킷 검증", summary: "수신한 Protobuf 패킷의 유형과 크기를 검증하고 Room Code로 같은 방 사용자를 조회해 송신자 외 대상에게 음성 페이로드를 중계했습니다." },
      { title: "RoomCode 기반 음성 워커 샤딩", summary: "네트워크 수신과 패킷 처리를 큐로 분리했습니다. Room Code 해시로 두 개의 워커 큐 중 하나를 선택해 같은 방 패킷의 처리 순서를 유지하면서 다른 방의 작업을 분산했습니다." },
      { title: "로비·인게임 음성 청취 정책", summary: "로비에서는 같은 방 전체에 음성을 재생하고, 인게임에서는 거리와 생존·탈출 상태에 따라 청취 가능 여부를 판단했습니다. 전송 경로와 게임별 재생 규칙을 분리했습니다." },
      { title: "역할별 서버와 크로스플랫폼 소켓 계층", summary: "게임 진행은 Dedicated Server, 로비 요청은 uWebSockets 기반 WebSocket 서버, 음성 중계는 UDP 서버가 담당하도록 분리했습니다. Windows Socket과 POSIX Socket의 생성·송수신·종료 과정을 플랫폼별 구현으로 나눴습니다." },
      { title: "Room Code 기반 방별 게임 인스턴스", summary: "하나의 Dedicated Server에서 방별 인스턴스를 서로 다른 Offset에 배치했습니다. Room Code를 기준으로 페이즈, 이벤트와 상호작용 범위를 격리해 여러 방의 진행 상태가 섞이지 않도록 구성했습니다." },
      { title: "게임 페이즈와 스폰 오케스트레이터", summary: "게임 페이즈별 상태 전이와 요청 가능 조건을 정의했습니다. 현재 방과 페이즈에 맞는 아이템 배치를 스폰 오케스트레이터가 수행하도록 게임 진행과 배치 책임을 분리했습니다." },
    ],
    problems: [
      { title: "포커스 복귀 후 누적 음성이 재생된 문제", problem: "포그라운드 복귀 뒤 캡처 버퍼와 Opus 링버퍼에 남은 PCM이 한꺼번에 처리됐습니다.", background: "백그라운드에서도 캡처 데이터가 쌓였고, 이전 오디오가 다음 전송 프레임에 섞였습니다.", solution: "포커스가 없을 때 캡처 데이터를 비우고 코덱을 다시 초기화했습니다. 복귀 뒤 8KB를 넘는 데이터도 전량 폐기했습니다.", result: "복귀 시점 이전의 PCM을 전송·재생 경로에서 제외했습니다." },
      { title: "방이 많은 경우 단일 큐에 패킷이 쌓인 문제", problem: "한 개의 ConcurrentQueue에서 모든 방의 UDP 패킷을 처리하면 큰 방의 패킷이 다른 방 처리를 막았습니다.", background: "워커 수만 늘리면 단일 큐 경쟁이 커졌습니다.", solution: "RoomCode 해시로 두 개의 워커 큐를 선택하도록 변경했습니다.", result: "같은 방 패킷은 같은 워커가 순서대로 처리하고, 다른 방 패킷은 별도 큐에서 처리했습니다." },
      { title: "음성 캡처 객체가 생성되지 않은 문제", problem: "장치 이름을 전달했을 때 캡처 객체가 생성되지 않았습니다.", background: "UE5 캡처 API가 운영체제 Friendly Name과 다른 DirectSound 장치 ID를 사용했습니다.", solution: "빈 장치 식별자로 OS 기본 입력 장치를 사용했습니다.", result: "마이크 입력을 캡처해 UDP 전송 경로로 전달했습니다." },
    ],
    techChoice: [
      { tech: "RoomCode Sharding", feature: "방 단위 UDP 패킷 처리", decision: "큰 방의 패킷이 다른 방 처리 지연으로 이어지지 않도록 RoomCode 해시로 워커 큐를 선택했습니다.", advantage: "두 개의 ConcurrentQueue와 워커가 방 단위 패킷을 처리했습니다.", comparison: "워커 수와 샤드 수를 늘릴 때의 CPU 사용률과 지연은 추가 측정이 필요합니다." },
      { tech: "Opus", feature: "20ms 음성 프레임 인코딩", decision: "16-bit PCM 640B 프레임을 압축하고, 패킷 손실 상황에서 FEC를 적용하기 위해 사용했습니다.", advantage: "16kHz·24kbps·FEC·DTX 설정으로 음성 전송에 적용했습니다.", comparison: "90.3%는 IP·UDP 헤더를 포함하지 않은 애플리케이션 페이로드 비교값입니다." },
    ],
    retrospective: [
      { point: "협업 방식", detail: "음성, 로비와 게임 진행 서버의 책임 및 Room Code 경계를 명확히 나눠 팀원이 각 경로를 독립적으로 구현하고 통합할 수 있도록 인터페이스를 맞췄습니다." },
      { point: "현재 한계", detail: "샤드 수별 패킷 처리 지연, CPU 사용률, 손실 복원률과 동시 방 수 증가 조건을 수치로 기록하지 않았습니다." },
      { point: "추가 검증", detail: "패킷 손실률별 FEC 복원률 측정\n샤드 수별 큐 적체량과 CPU 사용률 비교\n지연·손실 조건의 음성 품질 기록" },
    ],
  },
  autowing: {
    subtitle: "공항 토잉카의 위치·상태를 수집하고 관제 명령과 경로 정보를 전달하는 실시간 관제 백엔드",
    role: "상태 전이, 실시간 메시지 처리 및 경로 정책 개발",
    roleItems: ["MQTT 장비 데이터 처리와 WebSocket 관제 전달", "장비 결과 이벤트 기반 상태 전이", "제어·영상·보조 데이터 채널 분리", "그래프 기반 경로 추천·우회 정책", "DB 트랜잭션 완료 이후 외부 이벤트 발행", "500대 장비 × 10Hz 부하 테스트"],
    metric: "8,935 msg/s",
    metricLabel: "Peak Throughput",
    benchmark: "500 devices × 10Hz telemetry",
    summary: [
      "공항 토잉카의 위치와 상태를 실시간으로 수집하고 관제 명령과 경로 정보를 전달하는 실시간 관제 백엔드를 개발했습니다.",
      "MQTT 장비 데이터를 도메인별로 처리해 WebSocket 관제 클라이언트에 전달하고, 장비 결과 이벤트를 기준으로 최종 상태를 반영했습니다.",
      "500대 장비가 초당 10회 텔레메트리를 보내는 조건에서 E2E 지연 14~28ms와 처리량 8,935msg/s를 기록했습니다.",
    ],
    outcomes: [
      { label: "Peak Throughput", value: "8,935 msg/s", detail: "500대 장비 · 각 10Hz 텔레메트리" },
      { label: "E2E Latency", value: "14–28 ms", detail: "동일 부하 테스트 조건" },
      { label: "Traffic Channels", value: "3 paths", detail: "제어 · 영상 · 보조 데이터 분리" },
    ],
    highlights: ["명령 요청과 장비 결과 이벤트의 상태 의미를 분리했습니다.", "장비 위치와 통제 조건을 반영한 경로 추천·우회 정책을 구현했습니다.", "500대 × 10Hz 조건에서 최대 8,935msg/s를 측정했습니다."],
    implementations: [
      { title: "MQTT·WebSocket 실시간 메시지 파이프라인", summary: "MQTT로 수신한 위치·상태 데이터를 도메인별로 처리한 뒤 STOMP WebSocket을 통해 관제 클라이언트에 전달했습니다. 장비 입력과 화면 갱신 경로의 책임을 분리했습니다." },
      { title: "장비 결과 이벤트 기반 상태 전이", summary: "관제 명령을 전송한 시점에는 요청 상태만 기록하고, 장비가 전달한 결과 이벤트를 기준으로 최종 상태를 확정했습니다. 명령 성공 여부와 실제 장비 상태가 어긋나는 상황을 고려한 전이 흐름을 구성했습니다." },
      { title: "트래픽 목적별 채널 분리", summary: "제어 데이터, 영상 데이터와 보조 데이터를 별도 채널로 분리했습니다. 각 데이터의 목적과 지연 특성에 맞는 경로로 처리해 한 종류의 트래픽이 다른 흐름에 미치는 영향을 줄였습니다." },
      { title: "그래프 기반 경로 추천", summary: "공항 이동 구간을 노드와 간선 그래프로 모델링하고 장비의 현재 위치와 통제 조건을 반영해 이동 경로를 추천했습니다." },
      { title: "통제 구간 우회 정책", summary: "특정 구간의 통행이 제한되면 해당 간선을 경로 탐색에서 제외하고 대체 경로를 계산하도록 구성했습니다. 경로 데이터와 운영 통제 조건을 분리해 우회 정책을 적용했습니다." },
      { title: "트랜잭션 완료 이후 이벤트 발행", summary: "데이터베이스 트랜잭션이 완료된 뒤 MQTT·WebSocket 외부 이벤트를 발행하도록 순서를 제어했습니다. 롤백된 DB 상태가 외부 메시지로 먼저 노출될 가능성을 줄였습니다." },
      { title: "500대 텔레메트리 부하 테스트", summary: "k6 기반으로 500대 장비가 각각 초당 10회 텔레메트리를 전송하는 조건을 구성했습니다. 이 조건에서 E2E 지연 14~28ms와 최대 처리량 8,935msg/s를 확인했습니다." },
    ],
    problems: [
      { title: "명령 시점과 실제 장비 상태가 달라질 수 있는 문제", problem: "관제 명령을 보낸 즉시 서버 상태를 확정하면 장비가 명령을 수행하지 못했을 때 DB와 실제 장비 상태가 달라질 수 있었습니다.", background: "명령 요청은 수행 의도이고 장비 결과 이벤트는 실제 상태이므로 두 메시지의 의미와 확정 시점이 달랐습니다.", solution: "명령 시점에는 요청 상태만 관리하고 장비가 MQTT로 전달한 결과 이벤트를 기준으로 최종 상태를 반영했습니다.", result: "관제 요청과 실제 상태 반영의 기준을 분리해 상태 전이 흐름을 명확히 했습니다." },
      { title: "DB 상태와 외부 메시지의 발행 순서 문제", problem: "트랜잭션이 완료되기 전에 외부 이벤트를 발행하면 DB 롤백 이후에도 관제 화면과 다른 서비스에는 변경된 상태가 전달될 수 있었습니다.", background: "데이터베이스 커밋과 메시지 브로커·WebSocket 발행은 서로 다른 실행 경계를 가집니다.", solution: "DB 트랜잭션 완료 이후에만 MQTT·WebSocket 이벤트를 발행하도록 처리 순서를 변경했습니다.", result: "커밋되지 않은 상태가 외부 시스템에 먼저 노출될 가능성을 줄였습니다." },
      { title: "통제 구간이 포함된 경로를 추천하는 문제", problem: "최단 경로만 계산하면 운영상 통행이 제한된 구간을 포함한 경로가 선택될 수 있었습니다.", background: "정적인 그래프 연결 관계 외에 현재 장비 위치와 실시간 통제 조건을 함께 반영해야 했습니다.", solution: "통제된 구간을 탐색 대상에서 제외하고 현재 위치에서 목적지까지 대체 경로를 다시 계산하는 우회 정책을 적용했습니다.", result: "운영 통제 조건을 반영한 경로 추천과 우회 탐색 흐름을 구성했습니다." },
      { title: "고빈도 텔레메트리 처리 검증", problem: "다수 장비가 동시에 위치·상태 데이터를 전송할 때 실시간 메시지 경로가 감당할 수 있는 처리량과 지연을 확인해야 했습니다.", background: "실시간 관제에서는 평균 응답뿐 아니라 동시 장비 수와 전송 주기가 고정된 조건이 필요했습니다.", solution: "500대 장비가 각각 초당 10회 텔레메트리를 전송하는 부하 테스트를 구성했습니다.", result: "해당 조건에서 E2E 지연 14~28ms와 최대 처리량 8,935msg/s를 기록했습니다." },
    ],
    techChoice: [
      { tech: "MQTT + STOMP WebSocket", feature: "장비 데이터 수신과 관제 화면 전달", decision: "장비의 위치·상태 이벤트와 관제 클라이언트의 실시간 갱신 경로를 분리하기 위해 사용했습니다.", advantage: "MQTT 입력을 도메인별로 처리한 뒤 WebSocket 구독자에게 전달했습니다.", comparison: "브로커 장애와 재연결 상황의 장시간 검증은 추가로 필요합니다." },
      { tech: "PostgreSQL + TimescaleDB", feature: "상태 데이터와 시계열 텔레메트리 저장", decision: "관계형 상태와 시간 순서로 누적되는 장비 데이터를 목적에 맞게 관리하기 위해 사용했습니다.", advantage: "장비의 현재 상태와 위치 이력을 구분해 저장할 수 있습니다.", comparison: "장기 보관량에 따른 압축·보존 정책은 추가 조정이 필요합니다." },
      { tech: "그래프 기반 경로 모델", feature: "경로 추천과 통제 구간 우회", decision: "공항의 이동 구간과 연결 관계를 노드·간선으로 표현하고 운영 조건을 탐색에 반영하기 위해 사용했습니다.", advantage: "현재 위치와 통제된 간선을 반영해 대체 경로를 계산할 수 있습니다.", comparison: "실제 공항 운영 환경에서의 경로 검증은 수행하지 않았습니다." },
    ],
    retrospective: [
      { point: "판단 기준", detail: "관제 명령과 장비 상태 이벤트를 같은 값으로 취급하지 않고, 장비 이벤트를 최종 상태 판단 기준으로 사용했습니다." },
      { point: "추가 검증", detail: "실제 장비 환경\nMQTT 재연결과 브로커 장애\nWebSocket 동시 연결 증가\n장시간 텔레메트리 저장 부하" },
    ],
  },
  sticker: {
    metric: "2-stage",
    metricLabel: "Duplicate Check",
    benchmark: "before enqueue / before persist",
    summary: ["AI 추천 작업을 요청 처리 경로에서 분리했습니다.", "추천 작업 시작과 결과 저장 단계에서 중복 여부를 확인했습니다."],
    outcomes: [
      { label: "Job Start", value: "afterCommit", detail: "DB 저장이 끝난 뒤 외부 작업을 시작" },
      { label: "Duplicate Check", value: "2-stage", detail: "작업 적재 전과 결과 저장 전 중복 여부 확인" },
      { label: "Failure Path", value: "Queue", detail: "긴 추천 작업을 API 응답 경로와 분리" },
    ],
    roleItems: ["추천 작업 큐와 결과 저장 흐름 구현", "Redis 기반 중복 실행 방어", "트랜잭션 이후 작업 시작 순서 적용"],
    highlights: ["추천 작업을 비동기 경로로 분리했습니다.", "트랜잭션 커밋 이후 추천 작업을 시작했습니다.", "Redis를 기준으로 중복 실행 여부를 확인했습니다."],
    implementations: [
      { title: "작업 시작 순서", summary: "요청 데이터를 저장한 뒤 afterCommit에서 SQS 메시지를 발행했습니다. 추천 작업은 API 응답과 다른 경로에서 시작했습니다." },
      { title: "두 단계 중복 확인", summary: "작업 적재 전 Redis 락으로 중복 실행을 확인했습니다. 결과 저장 전에는 jobId와 날짜 기준으로 다시 확인했습니다." },
    ],
    problems: [
      { title: "저장 전 추천 작업이 시작된 문제", problem: "DB 상태가 저장되기 전에 후속 추천 작업이 시작될 수 있었습니다.", background: "트랜잭션 완료와 메시지 발행 순서가 맞지 않았습니다.", solution: "커밋 이후에만 SQS 메시지를 발행하도록 변경했습니다.", result: "저장 완료 상태를 기준으로 추천 작업을 시작했습니다." },
      { title: "같은 추천 작업이 중복 실행된 문제", problem: "같은 사용자와 날짜의 추천 요청이 겹칠 수 있었습니다.", background: "작업 시작과 결과 저장이 서로 다른 시간에 처리됐습니다.", solution: "Redis 락과 결과 저장 전 jobId·날짜 확인을 적용했습니다.", result: "작업 시작과 결과 반영에서 중복 여부를 확인하는 기준을 두었습니다." },
    ],
    techChoice: [
      { tech: "SQS", feature: "추천 작업 비동기 처리", decision: "추천 생성 시간이 길어져도 API 응답을 지연시키지 않기 위해 사용했습니다.", advantage: "추천 생성 작업을 API 요청 경로 밖에서 처리했습니다.", comparison: "처리 지연과 실패 상태를 별도로 확인해야 합니다." },
      { tech: "Redis", feature: "중복 작업 확인", decision: "동일한 요청이 겹칠 때 작업 시작과 결과 저장 단계의 중복 여부를 확인하기 위해 사용했습니다.", advantage: "추천 작업 시작과 결과 반영 전에 중복 여부를 확인했습니다.", comparison: "Redis 락만으로 저장 단계의 중복을 모두 방지할 수 없어 저장 전 검증을 함께 적용했습니다." },
    ],
    retrospective: [
      { point: "판단 기준", detail: "긴 작업의 시작 시점은 데이터 저장이 완료된 시점과 일치시켜야 했습니다." },
      { point: "추가 검증", detail: "큐 처리 시간과 중복 차단 횟수는 수치로 기록하지 못했습니다." },
    ],
  },
};

const stickerAccurateContent = {
  subtitle: "인증·추천·날씨 API와 캐시·관측·CI 환경을 구축한 백엔드 프로젝트",
  stack: ["Java 21", "Spring Boot", "Spring Security", "JPA", "PostgreSQL", "Redis", "AWS SQS", "JWT", "Swagger UI", "Spring REST Docs", "Prometheus", "Grafana", "Docker", "Traefik", "GitLab CI"],
  role: "백엔드 API·인증, 성능 개선 및 모니터링 환경 개발",
  roleItems: [
    "이메일 인증·JWT 로그인 API와 Refresh Token Rotation",
    "ApiResponse·전역 예외 처리·REST Docs 기반 API 계약 검증",
    "기상청 격자 변환과 위치 기반 날씨 요약 API",
    "AWS SQS 기반 AI 추천 요청·결과 소비 및 저장",
    "Redis 캐시와 주요 조회 쿼리 DB 인덱스 적용",
    "Prometheus·Grafana 모니터링과 GitLab CI 파이프라인",
  ],
  metric: "p95 · p99",
  metricLabel: "Latency Observability",
  benchmark: "API · Service · DB metrics",
  summary: [
    "이메일 인증·JWT 기반 사용자 API와 위치 기반 날씨, AI 추천 비동기 처리 기능을 개발했습니다.",
    "옷장·코디·날씨·S3 URL을 Redis에 캐시하고 주요 조회 쿼리에 DB 인덱스를 적용했습니다.",
    "API·서비스·DB 처리 시간을 계측해 Prometheus·Grafana에서 요청량, 지연 백분위, 오류율과 DB 커넥션 상태를 확인하도록 구성했습니다.",
  ],
  outcomes: [
    { label: "API Contract", value: "Test + Docs", detail: "컨트롤러 테스트 · Spring REST Docs · Swagger UI" },
    { label: "Observability", value: "Avg · p95 · p99", detail: "API · 서비스 · DB 처리시간과 오류율" },
    { label: "MR Quality Gate", value: "Build · Test · AI Review", detail: "GitLab Merge Request 자동 검증" },
  ],
  highlights: ["인증·추천·날씨 API를 개발했습니다.", "캐시·인덱스로 반복 조회 경로를 개선했습니다.", "메트릭·대시보드·CI로 운영과 변경 검증 환경을 구축했습니다."],
  implementations: [
    { title: "이메일 인증과 JWT 로그인", summary: "이메일 인증 기반 회원가입·로그인 API를 개발하고 Spring Security와 JWT 인증 흐름을 구성했습니다. Redis에 Refresh Token 상태를 저장하고 재발급 시 기존 토큰을 폐기하는 Rotation 정책을 적용했습니다." },
    { title: "일관된 API 응답과 계약 검증", summary: "공통 ApiResponse와 전역 예외 처리로 성공·실패 응답 형식을 통일했습니다. 컨트롤러 테스트와 Spring REST Docs로 요청·응답 계약을 검증하고 문서를 테스트 결과에서 생성했습니다." },
    { title: "Swagger 기반 API 협업", summary: "OpenAPI·Swagger UI에 JWT Bearer 인증을 설정했습니다. 프론트엔드가 변경된 API 명세를 확인하고 인증이 필요한 요청을 UI에서 직접 호출해 검증할 수 있도록 구성했습니다." },
    { title: "위치 기반 날씨 요약 API", summary: "사용자 위치를 기상청 격자 좌표로 변환하고 예보 데이터를 서비스에 필요한 형태로 가공했습니다. 위치 입력부터 외부 예보 조회와 요약 응답까지 하나의 API 흐름으로 구현했습니다." },
    { title: "AWS SQS 기반 AI 추천 파이프라인", summary: "AI 추천 요청을 AWS SQS에 적재해 API 응답 경로와 추천 작업을 분리했습니다. 결과 메시지를 소비하고 검증한 뒤 추천 결과를 저장하는 흐름을 구현했습니다." },
    { title: "Redis 캐시와 DB 인덱스", summary: "반복 조회되는 옷장·코디·날씨·S3 URL 데이터를 Redis에 캐시했습니다. 주요 조회 조건을 분석해 PostgreSQL 인덱스를 적용하고 애플리케이션과 DB 양쪽의 반복 비용을 줄였습니다." },
    { title: "Prometheus·Grafana 모니터링", summary: "Actuator·Micrometer로 API·서비스·DB 처리 시간을 계측했습니다. Prometheus와 Grafana에서 요청량, 평균·p95·p99 지연, 오류율과 DB 커넥션 상태를 확인할 수 있도록 대시보드를 구성했습니다." },
    { title: "배포·검증·AI 리뷰 파이프라인", summary: "모니터링 배포와 상태 검증 단계를 분리했습니다. GitLab Merge Request마다 빌드·테스트와 AI 코드 리뷰가 실행되도록 GitLab CI 파이프라인을 구축했습니다." },
  ],
  problems: [
    { title: "Refresh Token 재사용 위험", problem: "재발급 이후에도 기존 Refresh Token이 유효하면 탈취된 토큰으로 세션을 계속 갱신할 수 있었습니다.", background: "Access Token 만료만으로는 장기 세션 토큰의 재사용을 통제하기 어려웠습니다.", solution: "Refresh Token Rotation을 적용하고 Redis에서 현재 유효한 토큰을 관리해 재발급 시 기존 토큰을 폐기했습니다.", result: "사용자별 Refresh Token의 유효 상태와 폐기 시점을 서버에서 통제할 수 있게 했습니다." },
    { title: "반복 조회와 외부 데이터 처리 비용", problem: "옷장·코디·날씨·S3 URL의 반복 조회가 DB와 외부 데이터 처리 비용으로 이어졌습니다.", background: "변경 빈도와 조회 조건이 다른 데이터를 매 요청마다 동일하게 처리하고 있었습니다.", solution: "반복 데이터는 Redis에 캐시하고 주요 조회 쿼리에는 조건에 맞는 DB 인덱스를 적용했습니다.", result: "반복 조회 경로에서 애플리케이션 처리와 데이터베이스 탐색 비용을 줄이는 구조를 마련했습니다." },
    { title: "로그만으로 성능 저하 지점을 찾기 어려운 문제", problem: "요청 로그만으로는 지연이 API, 서비스 로직과 DB 중 어디에서 발생했는지 구분하기 어려웠습니다.", background: "전체 응답시간 외에 계층별 처리시간과 지연 분포, DB 커넥션 상태가 필요했습니다.", solution: "Actuator·Micrometer로 계층별 시간을 계측하고 Prometheus·Grafana에서 평균·p95·p99, 오류율과 DB 커넥션을 함께 시각화했습니다.", result: "성능 저하와 오류를 계층 및 지표별로 확인할 수 있는 모니터링 기준을 만들었습니다." },
    { title: "MR 변경을 사람의 확인에만 의존한 문제", problem: "Merge Request마다 빌드·테스트와 코드 검토를 수동으로 수행하면 누락되거나 결과 공유가 늦어질 수 있었습니다.", background: "애플리케이션 검증과 모니터링 배포 상태 확인도 서로 다른 실패 원인을 가졌습니다.", solution: "GitLab MR 빌드·테스트와 AI 코드 리뷰를 자동화하고 모니터링 배포·상태 검증 단계를 분리했습니다.", result: "코드 변경과 배포 상태를 단계별 결과로 확인할 수 있는 파이프라인을 구성했습니다." },
  ],
  techChoice: [
    { tech: "Spring Security + JWT + Redis", feature: "인증과 토큰 수명주기", decision: "무상태 Access Token과 서버에서 폐기 가능한 Refresh Token 정책을 함께 구성하기 위해 사용했습니다.", advantage: "Rotation 시 기존 Refresh Token을 즉시 폐기할 수 있습니다.", comparison: "Redis 장애 시 토큰 갱신 정책과 복구 기준이 필요합니다." },
    { tech: "AWS SQS", feature: "AI 추천 작업 비동기화", decision: "추천 처리시간을 API 응답 경로에서 분리하고 요청과 결과 소비를 독립적으로 처리하기 위해 사용했습니다.", advantage: "추천 요청 적재와 결과 저장 흐름을 분리할 수 있습니다.", comparison: "재처리·중복 소비와 실패 메시지 운영 정책이 필요합니다." },
    { tech: "Redis + PostgreSQL Index", feature: "반복 조회 경로 개선", decision: "재사용 가능한 결과는 캐시하고 DB에서 필요한 탐색은 인덱스로 줄이기 위해 함께 적용했습니다.", advantage: "데이터 특성에 따라 애플리케이션과 DB 계층의 비용을 나눠 줄일 수 있습니다.", comparison: "캐시 무효화와 인덱스 유지 비용을 함께 관리해야 합니다." },
    { tech: "Actuator + Micrometer + Prometheus", feature: "계층별 성능 관측", decision: "평균값뿐 아니라 지연 분포와 오류·DB 상태를 시계열로 확인하기 위해 사용했습니다.", advantage: "Grafana에서 요청량과 평균·p95·p99 지연을 함께 확인할 수 있습니다.", comparison: "메트릭 카디널리티와 보존 기간을 운영 환경에 맞게 조정해야 합니다." },
  ],
  retrospective: [
    { point: "협업과 API 계약", detail: "컨트롤러 테스트, REST Docs와 JWT가 설정된 Swagger UI를 함께 사용해 백엔드 변경을 프론트엔드가 빠르게 확인하고 직접 검증할 수 있도록 했습니다." },
    { point: "추가 검증", detail: "Refresh Token 재사용 탐지 시나리오\nSQS 재처리·중복 소비\nRedis 캐시 hit ratio와 무효화\n인덱스 적용 전후 쿼리 실행계획\n모니터링 알림 임계치" },
  ],
};

const projectOrder = ["robotpal", "mausoleum", "autowing", "sticker", "minibcg"];

export const projects = projectOrder.map((id) => {
  const project = baseProjects.find((item) => item.id === id);

  return {
    ...project,
    ...portfolioContent[project.id],
    ...(project.id === "sticker" ? stickerAccurateContent : {}),
    detailPage: projectDetailPages[project.id],
  };
});
