import { projectDetailPages } from "./projectDetailPages";

const baseProjects = [
  {
    id: "robotpal",
    num: "01",
    title: "RobotPal",
    subtitle: "C++ 기반 AGV 시뮬레이터의 카메라 프레임 스트리밍 기능을 개발하고, 렌더링 흐름의 병목을 개선한 프로젝트",
    period: "2025.11 – 2025.12",
    team: "2인",
    role: "카메라 프레임 스트리밍 · 네트워크 모듈 · 성능 측정 및 병목 개선",
    roleItems: ["카메라 프레임 스트리밍 기능 개발", "인코딩·전송 병목 측정 및 개선", "TCP·WebSocket 전송 인터페이스 분리"],
    metric: "17.6% → 0.8%",
    metricLabel: "Frame Drop Rate",
    benchmark: "1,800-frame fixed benchmark",
    summary: [
      "카메라 프레임을 캡처해 JPEG로 인코딩하고 외부 클라이언트로 전송했다.",
      "스트리밍을 켜면 JPEG 인코딩과 전송이 렌더링 프레임을 막았다.",
      "PBO readback, 작업 큐, 멀티 워커, 프레임 폐기 정책을 적용했다.",
      "1,800프레임 고정 조건에서 드랍률을 17.6%에서 0.8%로 낮췄다.",
    ],
    stack: ["C++17", "CMake", "Qt", "OpenGL", "libjpeg-turbo", "TCP", "WebSocket", "Multithreading", "Emscripten"],
    cover: "/project-robotpal-cover.png",
    highlights: [
      "고정된 1,800프레임 조건에서 프레임 드랍률 17.6%를 확인했습니다.",
      "같은 C++ 코어를 데스크톱과 WebAssembly 실행 경로로 확장했습니다.",
      "워커 수 실험으로 처리량 변화가 실제로 어떻게 달라지는지 비교했습니다.",
    ],
    implementations: [
      {
        title: "시뮬레이션 제어 런타임 구성",
        summary: "입력 처리, 제어 계산, 렌더링 결과를 같은 런타임 안에서 추적할 수 있도록 C++ 루프를 먼저 정리했습니다.",
        details: [
          "실물 장비 없이도 상위 제어 로직이 어떻게 반응하는지 확인할 수 있도록 시뮬레이션 루프와 제어 계층을 분리했습니다.",
          "Controller Layer를 두어 상위 조작 로직과 렌더링 루프의 호출 경로를 분리했습니다.",
          "이 구조 덕분에 데스크톱 경로와 WebAssembly 경로가 같은 코어 로직을 공유하면서도 실행 환경별 차이는 별도 계층에서 다룰 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Runtime Flow",
          content: [
            { id: "sim", name: "Simulation Loop", desc: "입력과 상태 계산" },
            { id: "ctrl", name: "Controller Layer", desc: "제어 책임 분리" },
            { id: "delivery", name: "Desktop / Web", desc: "같은 코어를 다른 실행 경로로 연결" },
          ],
        },
      },
      {
        title: "실시간 스트리밍 파이프라인",
        summary: "렌더링 이후 프레임 전달 경로를 readback, JPEG 인코딩, 전달 단계로 나눠 각 단계의 점유 시간을 확인했습니다.",
        details: [
          "프레임을 만든 직후 바로 보내는 구조 대신, 어느 단계가 메인 루프를 오래 점유하는지 볼 수 있도록 readback, 인코딩, 전달 단계를 명시적으로 분리했습니다.",
          "이 구조에서는 프레임 생산 속도와 인코딩 소비 속도가 맞지 않을 때 어디에서 큐가 쌓이는지 바로 확인할 수 있어 벤치마크 결과를 해석하기 쉬웠습니다.",
          "핵심은 함수 하나의 미세 최적화보다 단계 간 결합을 줄여 병목을 드러내는 것이었고, 이후 실험도 같은 파이프라인 기준으로 비교할 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Render -> Encode Queue -> Delivery",
          content: [
            { id: "render", name: "Render", desc: "프레임 생성" },
            { id: "encode", name: "JPEG Encode", desc: "큐 기반 인코딩 처리" },
            { id: "send", name: "Delivery", desc: "분리된 전달 단계" },
          ],
        },
      },
      {
        title: "웹 빌드와 실행 환경 대응",
        summary: "같은 C++ 코어를 브라우저에서도 검증할 수 있도록 WebAssembly 실행 경로와 스레드 조건을 정리했습니다.",
        details: [
          "데스크톱과 별도로 웹 빌드 경로를 두고, 같은 C++ 코어가 브라우저에서 어떻게 실행되는지 확인할 수 있게 구성했습니다.",
          "Emscripten pthreads는 SharedArrayBuffer, COOP/COEP 같은 브라우저 실행 조건이 맞아야 동작하므로, 코드뿐 아니라 배포 조건까지 함께 정리했습니다.",
          "정적 배포 환경에서도 실행 조건을 맞출 수 있도록 COI Service Worker를 포함해 웹 멀티스레드 경로를 직접 검증했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Web Thread Enablement",
          content: [
            { id: "pthreads", name: "Emscripten pthreads", desc: "웹 멀티스레드 실행" },
            { id: "sab", name: "SharedArrayBuffer", desc: "공유 메모리 조건" },
            { id: "coi", name: "COI Service Worker", desc: "정적 배포에서 실행 조건 보완" },
          ],
        },
      },
    ],
    problems: [
      {
        title: "glReadPixels 기반 readback 구간이 렌더 루프를 멈추게 하는 문제",
        problem:
          "처음에는 GPU 렌더링 자체가 느린 줄 알았지만, 실제 병목은 프레임을 읽어오는 순간 CPU가 GPU 완료를 기다리는 구조에 있었습니다. 프레임 수가 올라갈수록 이 대기 시간이 메인 루프를 직접 흔들었습니다.",
        unexpected:
          "문제는 렌더 계산량보다 glReadPixels 호출 시점에 더 분명하게 보였습니다. 그 지점에서 프레임 밀림이 먼저 누적됐습니다.",
        background:
          "동기식 readback은 GPU가 해당 프레임 작업을 마칠 때까지 CPU를 기다리게 만듭니다. 이 구간이 길어지면 이후 인코딩과 전달 단계도 같은 프레임 지연을 따라가게 됩니다.",
        process: [
          "프레임 생성 시간과 readback 시간을 따로 관찰해 보니 렌더 계산보다 readback 지점에서 메인 루프 정지가 먼저 커졌습니다.",
          "문제는 GPU가 아직 다 쓰지 않은 프레임을 CPU가 바로 읽으려는 구조라고 판단했습니다.",
          "그래서 GPU는 현재 프레임을 쓰고 CPU는 이전 프레임을 읽는 방향으로 버퍼를 나누기로 했습니다.",
        ],
        solution:
          "PBO ping-pong 구조를 적용해 GPU는 현재 프레임을 비동기로 기록하고 CPU는 이전 프레임 버퍼를 읽도록 바꿨습니다.",
        decision:
          "readback 시점을 구조적으로 분리해야 다음 단계 병목도 따로 볼 수 있었기 때문에, 함수 최적화보다 GPU-CPU 경계 재구성이 더 직접적인 해결이라고 판단했습니다.",
        result:
          "readback 대기 구간이 줄어들면서 이후 JPEG 인코딩과 전달 단계 병목을 별도로 확인할 수 있는 상태가 됐습니다.",
        snippet: {
          type: "visual",
          label: "PBO Ping-Pong Readback",
          content: [
            { id: "gpu-write", name: "GPU Write", desc: "현재 프레임 기록" },
            { id: "cpu-read", name: "CPU Read", desc: "이전 프레임 읽기" },
            { id: "swap", name: "Swap", desc: "버퍼 교체" },
          ],
        },
      },
      {
        title: "인코딩과 전달 단계가 같은 흐름에 묶여 전체 처리량이 밀리는 문제",
        problem:
          "프레임을 만들자마자 JPEG 인코딩과 전달 단계까지 한 번에 처리하자, 한 프레임이 늦어질 때 다음 프레임도 연쇄적으로 밀렸습니다. 메인 루프는 인코딩이 끝날 때까지 오래 점유됐습니다.",
        unexpected:
          "처음에는 전달 단계 비용이 더 클 것으로 봤지만, 실제로는 인코딩 완료를 기다리는 시간이 전체 처리량을 더 많이 흔들었습니다.",
        background:
          "생산 속도와 소비 속도가 다른 단계를 같은 루프에 묶으면 가장 느린 단계가 전체 속도를 결정합니다. 실시간 스트리밍에서는 이 결합이 곧 프레임 밀림으로 이어집니다.",
        process: [
          "지연이 커지는 시점을 따라가 보니 전달 단계보다 먼저 JPEG 인코딩이 메인 루프를 오래 점유하고 있었습니다.",
          "병목은 특정 전송 함수보다 인코딩과 전달 단계가 같은 소비 흐름에 묶여 있는 구조에 있다고 판단했습니다.",
          "그래서 인코딩 결과를 큐에 적재하고, 전달 단계는 별도 워커가 소비하도록 바꾸기로 했습니다.",
        ],
        solution:
          "프레임 작업을 큐에 넣고, JPEG 워커가 인코딩한 결과를 전송 경로에서 처리하도록 분리했습니다.",
        decision:
          "압축과 전달 단계를 따로 조정할 수 있어야 워커 수 변화와 처리량 차이를 실험으로 비교할 수 있었기 때문에, 큐 기반 분리가 가장 적합했습니다.",
        result:
          "단일 워커를 멀티 워커 풀로 바꾼 뒤, 같은 조건에서 드랍률을 별도로 비교했습니다.",
        snippet: {
          type: "visual",
          label: "Queue-based Separation",
          content: [
            { id: "enc", name: "Encode Worker", desc: "인코딩만 담당" },
            { id: "queue", name: "Concurrent Queue", desc: "생산/소비 속도 차이 흡수" },
            { id: "tx", name: "Delivery Worker", desc: "전달 단계 소비" },
          ],
        },
      },
      {
        title: "브라우저에서 pthreads 경로가 바로 실행되지 않는 문제",
        problem:
          "Emscripten pthreads 설정만 맞추면 될 것 같았지만, 실제로는 브라우저가 SharedArrayBuffer 조건을 만족하지 않아 멀티스레드 경로가 막혀 있었습니다. 문제는 코드보다 배포 환경에 있었습니다.",
        background:
          "Emscripten pthreads는 SharedArrayBuffer가 필요하고, 이 조건은 COOP/COEP 헤더가 맞지 않으면 성립하지 않습니다.",
        process: [
          "브라우저 보안 헤더 조건이 맞지 않아 스레드 경로가 열리지 않는 점을 먼저 확인했습니다.",
          "정적 배포 환경에서는 서버 헤더를 직접 제어하기 어렵기 때문에 배포 경로 보완이 먼저 필요하다고 판단했습니다.",
          "그래서 COI Service Worker로 실행 조건을 맞추는 방향으로 정리했습니다.",
        ],
        solution:
          "COI Service Worker를 포함해 SharedArrayBuffer 실행 조건을 보완하고, 웹 멀티스레드 경로를 직접 검증할 수 있게 만들었습니다.",
        result:
          "웹 빌드에서도 스레드 기반 실행 경로를 확인할 수 있는 배포 조건을 마련했습니다.",
        snippet: {
          type: "visual",
          label: "Web Thread Enablement",
          content: [
            { id: "static", name: "Static Assets", desc: "기본 파일 제공" },
            { id: "coi", name: "COI Service Worker", desc: "브라우저 실행 조건 보완" },
            { id: "wasm", name: "WASM Threads", desc: "멀티스레드 실행" },
          ],
        },
      },
    ],
    techChoice: [
      {
        tech: "JPEG",
        feature: "네트워크 대역폭 절감을 위해 선택함",
        decision:
          "비디오 파이프라인 완성보다 인코딩 단계 병목을 먼저 분리해 확인하는 것이 목표여서 JPEG을 선택했습니다.",
        advantage: "워커 수 변화에 따라 인코딩 처리량이 어떻게 달라지는지 비교하기 좋았습니다.",
        comparison: "H.264/WebRTC 같은 비디오 파이프라인보다 구현하기 쉬웠습니다.",
      },
      {
        tech: "Emscripten",
        feature: "같은 C++ 코어를 웹에서도 검증하는 빌드 경로",
        decision:
          "같은 C++ 코어를 데스크톱과 WebAssembly 실행 경로로 확장해 검증하기 위해 사용했습니다.",
        advantage: "데스크톱 전용 코드를 따로 만들지 않고 같은 코어 로직을 검증할 수 있었습니다.",
        comparison: "웹 전용 구현을 새로 만드는 방식보다 데스크톱과 웹의 실행 차이를 비교하기 쉬웠습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "실시간 화면 전송에서는 오래된 프레임을 폐기하고 최신 프레임을 유지하는 방식을 적용했습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "Release 빌드와 해상도·JPEG 품질별 CPU 사용량을 반복 측정하지 못했습니다.",
      },
    ],
    links: {
      github: "https://github.com/cgantro/RobotPal",
    },
  },
  {
    id: "mausoleum",
    num: "02",
    title: "UE5 Multiplayer Voice Communication",
    subtitle: "UE5 클라이언트에서 음성을 캡처하고 Opus로 처리하며, UDP 서버가 같은 방 사용자에게 음성 패킷을 중계하는 시스템",
    period: "2026.02 – 2026.03",
    team: "6인",
    role: "음성 캡처·인코딩·재생 · UDP 음성 서버 · 패킷 검증 및 중계",
    roleItems: ["UE5 음성 캡처·Opus 인코딩·재생", "UDP 음성 중계 서버 구현", "패킷 유형·크기 검증 및 RoomCode 라우팅"],
    metric: "−90.3%",
    metricLabel: "Application Voice Payload",
    benchmark: "16-bit PCM 대비 Opus payload",
    summary: [
      "UE5 클라이언트에서 16kHz·20ms 단위 음성을 Opus로 인코딩해 UDP 서버로 전송했습니다.",
      "서버는 패킷 유형과 크기를 확인한 뒤 같은 RoomCode 사용자에게 전달했습니다.",
      "앱 포커스 복귀 시 대기 패킷을 버리고 코덱 상태를 초기화했습니다.",
      "16-bit PCM 원본과 비교해 Opus 애플리케이션 페이로드를 약 90.3% 줄였습니다.",
    ],
    stack: ["C++", "Unreal Engine 5", "UDP", "Opus", "Protobuf", "Multithreading", "CMake"],
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
    role: "상태 전이 · 실시간 채널 분리 · 경로 추천 · 부하 테스트",
    roleItems: ["상태 전이와 실제 장비 상태 이벤트 분리", "실시간 채널 분리 및 경로 추천 구현", "500개 모의 차량 클라이언트 부하 테스트"],
    metric: "8,935 msg/s",
    metricLabel: "Peak Throughput",
    benchmark: "500 simulated clients × 10Hz",
    summary: [
      "관제 명령 요청과 장비 상태 이벤트를 분리해 상태를 반영했습니다.",
      "DB 트랜잭션이 끝난 뒤 MQTT와 WebSocket 메시지를 발행했습니다.",
      "500개 모의 차량 클라이언트가 각각 10Hz로 텔레메트리를 전송하는 환경을 구성했습니다.",
      "5분 부하 테스트에서 132만 메시지를 처리했고 유실 0건, 최대 8,935msg/s를 기록했습니다.",
    ],
    stack: ["Spring Boot", "MQTT", "WebRTC", "Map Graph"],
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
];

// Sticker는 보조 프로젝트로 유지하며, 주력 3개 뒤에 배치한다.
const portfolioContent = {
  robotpal: {
    roleItems: ["카메라 프레임 스트리밍 기능 개발", "PBO 기반 readback 구현", "인코딩·전송 병목 측정 및 개선", "벤치마크 환경 구성 및 드랍률 측정", "TCP·WebSocket 전송 인터페이스 분리"],
    metricDefinition: "생성 프레임 중 원본 프레임 큐 적체로 폐기된 프레임 비율",
    benchmark: "1,800-frame fixed benchmark · single vs multi worker",
    summary: [
      "카메라 프레임을 캡처해 JPEG로 인코딩하고 외부 클라이언트로 전송했습니다.",
      "JPEG 인코딩과 전송이 렌더링 루프를 지연시켰습니다.",
      "PBO readback, 작업 큐, 멀티 워커, 프레임 폐기 정책을 적용했습니다. 동일 조건에서 단일·멀티 워커를 비교해 드랍률을 17.6%에서 0.8%로 낮췄습니다.",
    ],
    outcomes: [
      { label: "Frame Drop Rate", value: "17.6% → 0.8%", detail: "1,800프레임 · 단일/멀티 워커 비교" },
      { label: "Frame Queue", value: "6 frames", detail: "가득 차면 원본 프레임 중 가장 오래된 항목 폐기" },
      { label: "Transport", value: "TCP / WebSocket", detail: "네이티브와 WebAssembly 빌드에 다른 구현체 적용" },
    ],
    highlights: ["PBO readback과 JPEG 인코딩을 분리했다.", "큐가 가득 차면 가장 오래된 프레임을 폐기했다.", "드랍률을 17.6%에서 0.8%로 낮췄다."],
    implementations: [
      { title: "프레임 캡처와 readback", summary: "OpenGL PBO 두 개를 번갈아 사용했습니다. GPU는 현재 프레임을 기록하고 CPU는 이전 프레임을 읽었습니다." },
      { title: "인코딩과 전송", summary: "캡처한 프레임을 크기 6의 원본 프레임 큐에 넣었습니다. JPEG 워커가 libjpeg-turbo로 인코딩한 뒤 NetworkEngine을 호출했습니다." },
      { title: "WebAssembly 빌드", summary: "C++ 코어를 Emscripten으로 빌드했습니다. 브라우저에서는 TCP 대신 WebSocket을 사용했고, pthreads 실행에는 SharedArrayBuffer 조건이 필요했습니다." },
    ],
    problems: [
      { title: "동기식 readback으로 렌더링 루프가 대기한 문제", problem: "glReadPixels 호출에서 렌더링 루프가 대기했습니다.", background: "CPU가 현재 프레임의 GPU 작업 완료를 기다렸습니다.", solution: "PBO 두 개를 번갈아 사용해 GPU는 현재 프레임을 기록하고 CPU는 이전 프레임을 읽도록 변경했습니다.", result: "CPU가 현재 프레임의 GPU 작업 완료를 기다리는 구간을 줄이고, readback과 인코딩 시간을 별도로 측정했습니다." },
      { title: "인코딩 적체로 오래된 프레임이 쌓인 문제", problem: "단일 인코딩 워커가 프레임 생산 속도를 따라가지 못했습니다.", background: "원본 프레임 큐에 작업이 쌓이고 오래된 프레임이 최신 화면 전달을 늦췄습니다.", solution: "원본 프레임 큐의 크기를 6으로 제한하고, 가득 차면 가장 오래된 프레임을 폐기했습니다. 멀티 워커가 JPEG 인코딩을 처리했습니다.", result: "같은 입력·JPEG 품질·큐 크기·실행 시간 조건에서 단일·멀티 워커를 비교해 드랍률을 17.6%에서 0.8%로 낮췄습니다." },
      { title: "WebAssembly pthreads 실행 조건", problem: "브라우저에서 SharedArrayBuffer 조건이 맞지 않아 pthreads 경로가 실행되지 않았습니다.", background: "SharedArrayBuffer에는 COOP·COEP 교차 출처 격리 조건이 필요했고, GitHub Pages에서는 응답 헤더를 직접 설정할 수 없었습니다.", solution: "데모 환경에 COI Service Worker를 적용했습니다.", result: "정적 배포 환경에서 pthreads 실행 조건을 보완했습니다." },
    ],
    techChoice: [
      { tech: "libjpeg-turbo", feature: "프레임 단위 JPEG 인코딩", decision: "프레임마다 독립적으로 압축하고 데스크톱과 WebAssembly 빌드에서 같은 처리 방식을 사용하기 위해 선택했다.", advantage: "카메라 프레임 압축과 TCP·WebSocket 전송에 적용했다.", comparison: "연속 영상 코덱보다 대역폭 효율이 낮고 고해상도에서는 CPU 인코딩 비용이 커진다." },
      { tech: "Emscripten", feature: "C++ 코어의 WebAssembly 빌드", decision: "데스크톱과 브라우저에서 같은 C++ 코어를 실행하기 위해 사용했다.", advantage: "브라우저 빌드에서는 WebSocket 구현체를 연결했다.", comparison: "pthreads에는 SharedArrayBuffer와 교차 출처 격리 조건이 필요하다." },
    ],
    retrospective: [
      { point: "현재 한계", detail: "워커 수별 CPU 사용률과 실제 네트워크 지연·패킷 손실 조건을 함께 기록하지 않았습니다." },
      { point: "추가 검증", detail: "Release 빌드 반복 측정\n해상도별 CPU 사용량 비교\nJPEG 품질별 처리량 비교\n네트워크 지연·손실 조건 검증" },
    ],
  },
  mausoleum: {
    roleItems: ["UPrivateVoiceChatComponent 기반 보이스 모듈 구현", "UDP VoiceServer와 RoomCode 해시 샤딩 구현", "화자별 Opus 코덱과 포커스 복귀 처리 구현"],
    metric: "2 shards",
    metricLabel: "Voice Worker Queues",
    benchmark: "RoomCode hash routing",
    summary: [
      "UE5 클라이언트에서 캡처·코덱·네트워크·재생 모듈을 분리했습니다.",
      "UDP VoiceServer가 RoomCode 해시로 패킷을 두 개의 워커 큐에 분배했습니다.",
      "포커스 복귀 시 남은 PCM을 폐기하고 Opus 상태를 초기화해 오래된 음성 재생을 막았습니다.",
    ],
    outcomes: [
      { label: "Voice Routing", value: "2 shards", detail: "RoomCode 해시로 같은 방 패킷을 같은 워커 큐에 전달" },
      { label: "Audio Frame", value: "20 ms", detail: "16kHz 모노 PCM 640B를 Opus로 인코딩" },
      { label: "Realtime Guard", value: "8 KB", detail: "포커스 복귀 후 오래된 캡처 데이터 hard drop 기준" },
    ],
    highlights: ["캡처·코덱·네트워크·재생 모듈을 분리했습니다.", "RoomCode 해시로 두 개의 보이스 워커 큐에 분배했습니다.", "포커스 복귀 시 오래된 PCM을 폐기했습니다."],
    implementations: [
      { title: "보이스 클라이언트", summary: "UPrivateVoiceChatComponent 아래에 캡처, 코덱, 네트워크, 재생 클래스를 나눴습니다. 화자별 Opus 코덱을 관리해 디코드 상태가 섞이지 않도록 했습니다." },
      { title: "UDP VoiceServer", summary: "패킷 유형과 크기를 확인했습니다. RoomCode 해시로 두 개의 워커 큐 중 하나를 선택하고, 같은 방의 송신자 외 사용자에게 공유 페이로드를 전송했습니다." },
      { title: "오디오 프레임", summary: "16kHz 모노 PCM을 20ms 단위로 모아 24kbps Opus로 인코딩했습니다. FEC와 DTX를 적용하고 패킷은 길이 2바이트와 Opus 데이터로 구성했습니다." },
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
      { point: "현재 한계", detail: "샤드 수별 패킷 처리 지연, CPU 사용률, 손실 복원률을 수치로 기록하지 않았습니다." },
      { point: "추가 검증", detail: "패킷 손실률별 FEC 복원률 측정\n샤드 수별 큐 적체량과 CPU 사용률 비교\n지연·손실 조건의 음성 품질 기록" },
    ],
  },
  autowing: {
    highlights: ["명령 요청과 장비 상태 이벤트를 분리했다.", "500개 모의 차량 클라이언트 부하 환경을 구성했다.", "최대 처리량 8,935msg/s를 측정했다."],
    implementations: [
      { title: "상태 전이", summary: "관제 명령만으로 상태를 확정하지 않았다. 장비가 보낸 상태 이벤트를 기준으로 최종 상태를 반영했다." },
      { title: "메시지 채널", summary: "DB 트랜잭션이 끝난 뒤 MQTT와 WebSocket 메시지를 발행했다. 제어·영상·보조 데이터를 다른 채널로 나눴다." },
      { title: "경로 추천", summary: "공항 이동 경로를 노드와 간선 그래프로 관리했다. 현재 위치와 통제 조건을 반영해 경로 추천과 우회 정책을 구현했다." },
    ],
    problems: [
      { title: "명령과 실제 상태가 달라진 문제", problem: "명령 요청만으로 서버 상태를 바꾸면 실제 장비 상태와 화면 상태가 달라질 수 있었다.", background: "명령 요청과 장비 상태 이벤트의 의미가 달랐다.", solution: "장비 상태 이벤트를 기준으로 최종 상태를 반영하고, 트랜잭션이 끝난 뒤 외부 메시지를 발행했다.", result: "명령 처리와 상태 반영의 기준을 분리했다." },
      { title: "고빈도 텔레메트리 부하", problem: "여러 모의 차량이 동시에 텔레메트리를 전송하는 상황을 확인해야 했다.", background: "제어·영상·보조 데이터가 같은 경로를 사용하면 한 종류의 트래픽이 다른 처리에 영향을 줄 수 있었다.", solution: "데이터 채널을 분리하고 500개 모의 차량 클라이언트가 각각 10Hz로 전송하는 부하 환경을 구성했다.", result: "5분간 132만 메시지를 처리했고, 이 테스트에서 E2E 지연 14~28ms와 유실 0건을 기록했다." },
    ],
    techChoice: [
      { tech: "MQTT와 WebSocket", feature: "상태 이벤트와 관제 화면 갱신", decision: "DB 트랜잭션이 끝난 뒤 상태 이벤트를 발행하고 관제 화면에 전달하기 위해 사용했다.", advantage: "명령 요청과 장비 상태 이벤트를 분리하는 흐름에 적용했다.", comparison: "부하 결과는 500개 모의 클라이언트가 10Hz로 전송한 5분 테스트 기준이다." },
      { tech: "그래프 기반 경로", feature: "경로 추천과 우회", decision: "이동 경로와 통제 조건을 노드·간선 관계로 처리하기 위해 사용했다.", advantage: "현재 위치와 통제 조건을 반영한 추천과 우회 경로에 적용했다.", comparison: "실제 공항 운영 환경에서의 검증은 수행하지 않았다." },
    ],
    retrospective: [
      { point: "판단 기준", detail: "관제 명령과 장비 상태 이벤트는 같은 값으로 취급하지 않고, 장비 이벤트를 최종 상태 기준으로 사용했다." },
      { point: "추가 검증", detail: "실제 차량, 네트워크 장애, WebSocket 연결 수 증가 조건은 검증하지 않았다." },
    ],
  },
  sticker: {
    metric: "2-stage",
    metricLabel: "Duplicate Check",
    benchmark: "before enqueue / before persist",
    summary: ["AI 추천 작업을 요청 처리 경로에서 분리했다.", "추천 작업 시작과 결과 저장에서 중복 실행을 확인했다."],
    outcomes: [
      { label: "Job Start", value: "afterCommit", detail: "DB 저장이 끝난 뒤 외부 작업을 시작" },
      { label: "Duplicate Check", value: "2-stage", detail: "작업 적재 전과 결과 저장 전 중복 여부 확인" },
      { label: "Failure Path", value: "Queue", detail: "긴 추천 작업을 API 응답 경로와 분리" },
    ],
    roleItems: ["추천 작업 큐와 결과 저장 흐름 구현", "Redis 기반 중복 실행 방어", "트랜잭션 이후 작업 시작 순서 적용"],
    highlights: ["추천 작업을 비동기 경로로 분리했다.", "afterCommit 이후 작업을 시작했다.", "Redis 기준으로 중복 실행을 확인했다."],
    implementations: [
      { title: "작업 시작 순서", summary: "요청 데이터를 저장한 뒤 afterCommit에서 SQS 메시지를 발행했습니다. 추천 작업은 API 응답과 다른 경로에서 시작했습니다." },
      { title: "두 단계 중복 확인", summary: "작업 적재 전 Redis 락으로 중복 실행을 확인했습니다. 결과 저장 전에는 jobId와 날짜 기준으로 다시 확인했습니다." },
    ],
    problems: [
      { title: "저장 전 추천 작업이 시작된 문제", problem: "DB 상태가 저장되기 전에 후속 추천 작업이 시작될 수 있었습니다.", background: "트랜잭션 완료와 메시지 발행 순서가 맞지 않았습니다.", solution: "커밋 이후에만 SQS 메시지를 발행하도록 변경했습니다.", result: "저장 완료 상태를 기준으로 추천 작업을 시작했습니다." },
      { title: "같은 추천 작업이 중복 실행된 문제", problem: "같은 사용자와 날짜의 추천 요청이 겹칠 수 있었습니다.", background: "작업 시작과 결과 저장이 서로 다른 시간에 처리됐습니다.", solution: "Redis 락과 결과 저장 전 jobId·날짜 확인을 적용했습니다.", result: "작업 시작과 결과 반영에서 중복 여부를 확인하는 기준을 두었습니다." },
    ],
    techChoice: [
      { tech: "SQS", feature: "추천 작업 비동기 처리", decision: "추천 생성이 오래 걸려도 요청 응답을 막지 않도록 사용했다.", advantage: "추천 생성 작업을 API 요청 경로 밖에서 처리했다.", comparison: "처리 지연과 실패는 별도 상태 확인이 필요하다." },
      { tech: "Redis", feature: "중복 작업 확인", decision: "동일 요청이 겹칠 때 작업 시작과 결과 저장을 확인하기 위해 사용했다.", advantage: "추천 작업 시작과 결과 반영 전에 중복 여부를 확인했다.", comparison: "Redis 락만으로 저장 단계의 중복을 모두 막을 수 없어 저장 전 확인을 함께 사용했다." },
    ],
    retrospective: [
      { point: "판단 기준", detail: "긴 작업의 시작 시점은 저장 완료 상태와 맞춰야 했다." },
      { point: "추가 검증", detail: "큐 처리 시간과 중복 차단 횟수는 수치로 기록하지 못했다." },
    ],
  },
};

const stickerAccurateContent = {
  subtitle: "AI 추천 비동기 파이프라인과 캐시·관측·배포를 설계한 백엔드·인프라 프로젝트",
  stack: ["Spring Boot", "AWS SQS", "Redis", "Caffeine", "Virtual Threads", "Prometheus", "Grafana", "GitLab CI"],
  role: "Backend · Infra Lead",
  roleItems: [
    "SQS 기반 추천·보정 작업 비동기 파이프라인 구현",
    "Virtual Thread 기반 20초 long-poll 결과 조회 구현",
    "Redis·Caffeine 계층별 캐시와 HikariCP 설정 설계",
    "Prometheus·Grafana 메트릭, 알림 규칙, GitLab CI 구성",
    "이메일 인증 코드의 만료·시도·재발송 제한 구현",
  ],
  implementations: [
    { title: "추천 작업 비동기화", summary: "무거운 AI 추천·보정 작업을 SQS에 적재하고 API는 즉시 응답하도록 분리했습니다. poison 메시지는 즉시 ack·삭제하고, 일시 실패는 SQS visibility timeout으로 재처리했습니다." },
    { title: "Virtual Thread long-poll", summary: "결과 조회를 Virtual Thread에서 20초 long-poll로 처리해 대기 중 OS 스레드를 점유하지 않도록 했고, SmartLifecycle로 수신 워커의 생명주기를 관리했습니다." },
    { title: "계층별 캐시", summary: "옷장·코디 목록과 상세는 Redis에 10분 캐시했습니다. S3 presigned URL은 공유 캐시 대신 인스턴스 로컬 Caffeine에 55분·최대 2만 건으로 캐시했습니다." },
    { title: "관측과 알림", summary: "AOP로 서비스 실행 시간을 app_operation_seconds로 수집하고 Prometheus 15초 scrape, Grafana 대시보드와 p95·5xx·DB 대기 커넥션 알림 규칙을 구성했습니다." },
    { title: "이메일 인증 가드레일", summary: "SecureRandom 기반 6자리 코드에 TTL 5분, 최대 5회 시도, 재발송 60초, 분당 30건 제한을 적용했습니다." },
  ],
  problems: [
    { title: "AI 추천 연산이 API 응답을 막은 문제", problem: "무거운 AI 연산을 백엔드 요청 스레드에서 직접 호출하면 일반 API 요청까지 지연됐습니다.", solution: "추천·보정 작업을 SQS로 분리하고, 결과는 별도 long-poll 경로로 조회하게 했습니다.", result: "API 응답 경로와 AI 처리 경로를 분리하고 재처리 가능한 작업 흐름을 만들었습니다." },
    { title: "반복 조회가 DB 부하로 이어진 문제", problem: "옷장과 코디 목록처럼 자주 열리는 화면이 매번 DB를 조회했습니다.", solution: "목록·상세는 Redis에, presigned URL은 인스턴스 로컬 Caffeine에 캐시했습니다.", result: "데이터 성격과 공유 필요성에 따라 캐시 위치와 TTL을 분리했습니다." },
    { title: "운영 이상을 늦게 발견하는 문제", problem: "API·DB 상태를 요청 로그만으로 확인해 임계치 초과를 즉시 알기 어려웠습니다.", solution: "AOP 메트릭, Prometheus scrape, Grafana 대시보드와 p95·5xx·DB pending 알림을 구성했습니다.", result: "지연과 오류, DB 대기 증가를 지표와 알림으로 먼저 확인할 수 있게 했습니다." },
    { title: "이메일 인증의 무차별 시도와 스팸 발송", problem: "인증 코드 발급과 검증에 만료·시도·재발송 제한이 필요했습니다.", solution: "6자리 코드 TTL 5분, 최대 5회 검증, 재발송 60초, 분당 30건 제한을 적용했습니다.", result: "인증 검증과 메일 발송 경로에 기본적인 남용 방어를 적용했습니다." },
  ],
  techChoice: [
    { tech: "AWS SQS + Virtual Threads", feature: "추천 작업 비동기화와 long-poll", decision: "AI 처리와 결과 대기를 요청 스레드에서 분리했습니다.", advantage: "즉시 응답과 대기 스레드 비용 제어를 함께 달성했습니다.", comparison: "DLQ 운영 기준과 실제 부하 조건은 추가 검증이 필요합니다." },
    { tech: "Redis + Caffeine", feature: "공유 목록과 presigned URL 캐시", decision: "공유가 필요한 목록은 Redis, 인스턴스 종속 URL은 로컬 Caffeine으로 구분했습니다.", advantage: "S3 URL을 불필요하게 분산 공유하지 않고 반복 조회를 줄였습니다.", comparison: "TTL과 최대 크기는 실사용 트래픽 기준으로 조정이 필요합니다." },
    { tech: "Prometheus + Grafana", feature: "서비스 실행 시간과 운영 알림", decision: "AOP 메트릭과 Spring 기본 HTTP 지표를 함께 수집했습니다.", advantage: "p95·5xx·DB pending을 대시보드와 알림으로 확인했습니다.", comparison: "알림 임계치는 운영 데이터로 계속 보정해야 합니다." },
  ],
  retrospective: [
    { point: "캐시 위치는 데이터 성격으로 결정했습니다.", detail: "공유가 필요한 목록은 Redis, 짧은 수명과 인스턴스 종속성이 있는 presigned URL은 Caffeine으로 분리했습니다." },
    { point: "추가 검증", detail: "SQS 재처리·DLQ, long-poll 동시 연결, 캐시 hit ratio, p95·DB pending 알림 임계치를 운영 부하에서 추가 검증해야 합니다." },
  ],
};

const projectOrder = ["robotpal", "mausoleum", "autowing", "sticker"];

export const projects = projectOrder.map((id) => {
  const project = baseProjects.find((item) => item.id === id);

  return {
    ...project,
    ...portfolioContent[project.id],
    ...(project.id === "sticker" ? stickerAccurateContent : {}),
    detailPage: projectDetailPages[project.id],
  };
});
