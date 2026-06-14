import { projectDetailPages } from "./projectDetailPages";

const baseProjects = [
  {
    id: "robotpal",
    num: "01",
    title: "RobotPal",
    subtitle:
      "rendering, readback, JPEG 인코딩, 전달 단계를 나눠 병목을 줄인 C++ 시뮬레이터",
    period: "2025.11 - 2025.12",
    team: "2인",
    role: "C++ 런타임 구조 설계 · 스트리밍 파이프라인 개선 · 웹 실행 대응",
    stack: ["C++17", "OpenGL", "Emscripten", "JPEG Encoder", "PBO"],
    cover: "/project-robotpal-cover.png",
    highlights: [
      "readback, JPEG 인코딩, 전달 단계를 분리해 병목 지점을 따로 확인했습니다.",
      "데스크톱과 WebAssembly 실행 경로를 같은 C++ 코어로 유지했습니다.",
      "워커 수를 바꿔가며 처리량이 실제로 어떻게 달라지는지 비교했습니다.",
    ],
    implementations: [
      {
        title: "시뮬레이션 제어 런타임 구성",
        summary: "제어 입력, 관절 계산, 렌더링 결과를 한 런타임 안에서 추적할 수 있게 구성했습니다.",
        details: [
          "실물 장비 없이도 조작 로직이 어떻게 반응하는지 확인할 수 있도록 C++ 시뮬레이터 루프를 먼저 만들었습니다.",
          "Controller Layer를 따로 두어 상위 제어 로직이 렌더링 루프와 직접 섞이지 않게 했고, 이후 기능 확장 시 책임 경계가 흐려지지 않도록 정리했습니다.",
          "이 구조 덕분에 같은 코어 로직을 데스크톱과 웹 실행 경로로 연결할 때도 제어 코드와 렌더링 코드의 변경 범위를 분리할 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Runtime Flow",
          content: [
            { id: "sim", name: "Simulation Loop", desc: "조작 계산과 화면 출력" },
            { id: "ctrl", name: "Controller Layer", desc: "제어 책임 분리" },
            { id: "delivery", name: "Desktop / Web", desc: "같은 코어를 다른 경로로 실행" },
          ],
        },
      },
      {
        title: "실시간 스트리밍 파이프라인",
        summary: "렌더링 이후 프레임 전달 경로를 readback, JPEG 인코딩, 전달 단계로 나눴습니다.",
        details: [
          "프레임을 만든 뒤 바로 보내지 않고 어느 단계가 메인 루프를 오래 점유하는지 추적할 수 있도록 readback, 인코딩, 전달 단계를 분리했습니다.",
          "워커 수와 큐 구조를 바꿔가며 단일 워커가 막히는지, 인코딩 처리량이 부족한지, 전달 단계가 뒤따르지 못하는지를 실험할 수 있도록 파이프라인을 열어뒀습니다.",
          "결과적으로 성능 문제를 단계 간 결합 문제로 다룰 수 있었고, 벤치마크 표도 그 구조 위에서 비교할 수 있게 됐습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Render -> Encode Queue -> Delivery",
          content: [
            { id: "render", name: "Render", desc: "프레임 생성" },
            { id: "encode", name: "JPEG Encode", desc: "압축 작업 처리" },
            { id: "send", name: "Delivery", desc: "분리된 전달 단계" },
          ],
        },
      },
      {
        title: "웹 빌드와 실행 환경 대응",
        summary: "같은 C++ 코어를 브라우저에서도 검증할 수 있도록 WebAssembly 실행 경로를 구성했습니다.",
        details: [
          "데스크톱과 별도로 웹 빌드 경로를 두고, 같은 C++ 코어가 브라우저에서도 실행되는지 확인할 수 있도록 정리했습니다.",
          "Emscripten pthreads가 실제로 동작하려면 코드뿐 아니라 SharedArrayBuffer, COOP/COEP 같은 브라우저 조건도 맞아야 했기 때문에 실행 환경 대응까지 함께 다뤘습니다.",
          "정적 배포 환경에서도 스레드 기반 경로를 검증할 수 있도록 COI Service Worker를 포함해 웹 실행 조건을 끝까지 맞췄습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Web Thread Enablement",
          content: [
            { id: "pthreads", name: "Emscripten pthreads", desc: "웹 멀티스레드 실행" },
            { id: "sab", name: "SharedArrayBuffer", desc: "공유 메모리 조건" },
            { id: "coi", name: "COI Service Worker", desc: "브라우저 실행 조건 보완" },
          ],
        },
      },
    ],
    problems: [
      {
        title: "glReadPixels 기반 readback 구간이 렌더 루프를 멈추게 하는 문제",
        problem:
          "처음에는 GPU 렌더링 성능 자체가 부족한 줄 알았지만, 실제 병목은 화면을 읽어오면서 CPU가 GPU 완료를 기다리는 동기 readback 구간에 있었습니다. 해상도가 올라갈수록 이 대기 시간이 메인 루프 전체를 멈추게 만들었습니다.",
        unexpected:
          "처음 예상은 렌더 계산량이 문제라는 쪽에 가까웠지만, 실제로는 프레임을 그린 뒤 glReadPixels로 읽어오는 시점에서 프레임 밀림이 먼저 나타났습니다.",
        background:
          "glReadPixels는 GPU가 해당 프레임 작업을 끝낼 때까지 CPU를 기다리게 만들 수 있습니다. 프레임마다 이 대기가 반복되면 이후 인코딩과 전달 단계까지 연쇄적으로 밀리게 됩니다.",
        process: [
          "프레임 생성 구간과 readback 구간을 따로 관찰해 보니 렌더 계산보다 readback 시점에서 메인 루프 정지가 먼저 커진다는 점을 확인했습니다.",
          "문제는 GPU가 아직 작업 중인 프레임을 CPU가 바로 읽으려 했기 때문이라고 판단했습니다.",
          "그래서 GPU는 현재 프레임을 계속 처리하고, CPU는 이전 프레임을 읽도록 읽기 대상과 쓰기 대상을 분리하는 방향으로 구조를 바꿨습니다.",
        ],
        solution:
          "PBO ping-pong 구조를 적용해 GPU는 현재 프레임을 비동기로 기록하고, CPU는 이전 프레임 버퍼를 읽도록 분리했습니다.",
        decision:
          "동일 프레임을 CPU와 GPU가 동시에 붙잡는 구조 자체가 문제였기 때문에, 미세 최적화보다 readback 시점을 구조적으로 분리하는 쪽이 더 직접적인 해결이라고 판단했습니다.",
        result:
          "readback 대기 구간을 줄여 이후 JPEG 인코딩과 전달 단계 병목을 별도로 확인할 수 있는 상태를 만들었습니다.",
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
        title: "인코딩과 전달 단계가 한 흐름에 묶여 전체 처리량이 밀리는 문제",
        problem:
          "렌더링이 끝난 프레임을 같은 흐름에서 JPEG 인코딩하고 바로 전달 단계까지 처리하자, 한 프레임이 늦어질 때 다음 프레임도 연쇄적으로 밀렸습니다. 전달 단계보다 먼저 인코딩 처리량이 메인 루프를 오래 점유하는 구조가 문제였습니다.",
        unexpected:
          "처음에는 전달 단계 비용이 더 클 것이라 생각했지만, 실제로는 인코딩이 끝나기 전까지 다음 단계가 시작조차 못하는 구조가 더 큰 병목이었습니다.",
        background:
          "생산 속도와 소비 속도가 다른 단계를 하나의 흐름에 묶으면 가장 느린 단계가 전체 처리량을 결정합니다. 실시간 스트리밍에서는 이 결합이 곧바로 프레임 밀림으로 드러납니다.",
        process: [
          "지연이 누적되는 시점을 따라가 보니 전달 단계보다 먼저 JPEG 인코딩 완료를 기다리는 구간에서 큐 적체가 시작됐습니다.",
          "핵심은 인코딩과 전달 단계가 같은 소비 흐름으로 묶여 있다는 점이라고 봤습니다.",
          "그래서 인코딩 결과를 큐에 쌓고, 전달 단계는 별도 소비 흐름에서 처리하도록 바꿨습니다.",
        ],
        solution:
          "Queue 기반으로 JPEG 인코딩 결과를 적재하고, Delivery Worker가 별도 소비 흐름에서 전달 단계를 처리하도록 분리했습니다.",
        decision:
          "문제는 특정 함수 속도보다 단계 간 결합이 강한 데 있었기 때문에, 인코딩과 전달 단계를 따로 조정할 수 있는 파이프라인 구조를 선택했습니다.",
        result:
          "동일 벤치마크 조건에서 Single Worker 대비 12 Workers 조건의 APP FPS와 SINK FPS가 모두 개선됐습니다.",
        snippet: {
          type: "visual",
          label: "Queue-based Separation",
          content: [
            { id: "enc", name: "Encode Worker", desc: "인코딩만 담당" },
            { id: "queue", name: "Concurrent Queue", desc: "처리 속도 차이 흡수" },
            { id: "tx", name: "Delivery Worker", desc: "전달 단계 소비" },
          ],
        },
      },
      {
        title: "브라우저에서 pthreads 경로가 바로 실행되지 않는 문제",
        problem:
          "처음에는 Emscripten pthreads 설정만 맞추면 된다고 봤지만, 실제로는 브라우저가 SharedArrayBuffer 조건을 만족하지 못해 웹 멀티스레드 경로가 막혀 있었습니다. 문제는 코드보다 실행 환경 헤더에 있었습니다.",
        background:
          "Emscripten pthreads는 SharedArrayBuffer를 전제로 하고, 이 조건은 COOP/COEP 헤더가 맞지 않으면 성립하지 않습니다.",
        process: [
          "브라우저 보안 헤더 부족으로 스레드가 열리지 않는다는 점을 먼저 확인했습니다.",
          "정적 배포 환경에서는 헤더 제어가 어렵기 때문에 빌드 옵션보다 배포 경로 보완이 먼저 필요하다고 판단했습니다.",
          "그래서 COI Service Worker로 실행 조건을 맞추는 방향으로 정리했습니다.",
        ],
        solution:
          "COI Service Worker를 배포 결과물에 포함해 SharedArrayBuffer 사용 조건을 보완하고, 웹 멀티스레드 실행 경로를 검증할 수 있게 만들었습니다.",
        result: "웹 빌드에서도 스레드 기반 실행 경로를 확인할 수 있는 배포 조건을 마련했습니다.",
        snippet: {
          type: "visual",
          label: "Web Thread Enablement",
          content: [
            { id: "static", name: "Static Assets", desc: "기본 파일 제공" },
            { id: "coi", name: "COI Service Worker", desc: "브라우저 조건 보완" },
            { id: "wasm", name: "WASM Threads", desc: "멀티스레드 실행" },
          ],
        },
      },
    ],
    techChoice: [
      {
        tech: "OpenGL + PBO",
        feature: "readback 병목을 직접 제어하기 위한 GPU-CPU 데이터 이동 경로",
        advantage: "렌더링 이후 어느 지점에서 CPU가 기다리는지 분리해 확인하기 좋았습니다.",
        comparison: "더 높은 수준의 추상화보다 readback 병목을 직접 다루기 쉬웠습니다.",
        decision:
          "화면 품질보다 readback 병목을 직접 확인하는 것이 중요했기 때문에 OpenGL과 PBO를 사용해 데이터 이동 지점을 명시적으로 제어했습니다.",
      },
      {
        tech: "JPEG Encoder",
        feature: "프레임 압축 처리량을 비교하기 쉬운 이미지 인코딩 경로",
        advantage: "워커 수를 바꿨을 때 인코딩 처리량 차이가 어떻게 드러나는지 확인하기 좋았습니다.",
        comparison: "H.264/WebRTC 같은 비디오 파이프라인보다 현재 병목을 더 단순하게 분리해 볼 수 있었습니다.",
        decision:
          "비디오 전송 완성도보다 인코딩 단계 병목을 먼저 분리해 확인하는 것이 목표여서 JPEG Encoder 경로를 선택했습니다.",
      },
      {
        tech: "Emscripten",
        feature: "같은 C++ 코어를 브라우저에서도 실행할 수 있게 하는 빌드 경로",
        advantage: "데스크톱 전용 코드를 따로 다시 만들지 않고 동일한 코어 로직을 검증할 수 있었습니다.",
        comparison: "웹 전용 구현을 새로 만드는 것보다 데스크톱 경로와의 차이를 비교하기 쉬웠습니다.",
        decision:
          "같은 C++ 코어를 데스크톱과 WebAssembly 실행 경로로 확장해 검증하기 위해 사용했습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "성능 문제를 단일 함수 최적화가 아니라 단계 간 결합 문제로 봐야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "다음 단계로는 릴리즈 빌드와 다양한 씬 복잡도 조건까지 벤치마크 범위를 넓히고 싶습니다.",
      },
    ],
    links: {
      github: "https://github.com/Junwoo-Seo-1998/RobotPal",
      demo: "https://junwoo-seo-1998.github.io/RobotPal/",
    },
  },
  {
    id: "mausoleum",
    num: "02",
    title: "영묘",
    subtitle: "UDP/Opus 보이스 파이프라인과 roomCode 처리, 청취 규칙을 나눠 정리한 UE5 프로젝트",
    period: "2026.02 - 2026.03",
    team: "6인",
    role: "보이스 파이프라인 설계 · roomCode 서버 처리 · 규칙 분리",
    stack: ["UE5 C++", "UDP", "Opus", "Voice Runtime"],
    cover: "/project-mausoleum-cover.png",
    highlights: [
      "마이크 캡처, Opus 인코딩, UDP 전송, 재생 단계를 책임별로 분리했습니다.",
      "20ms 프레임과 24kbps 설정으로 실시간 음성 경로를 맞췄습니다.",
      "roomCode 기준 처리와 청취 규칙을 분리해 구조를 단순하게 유지했습니다.",
    ],
    implementations: [
      {
        title: "UE5 보이스 클라이언트 파이프라인",
        summary: "마이크 입력부터 재생까지의 음성 경로를 단계별로 분리해 추적할 수 있게 만들었습니다.",
        details: [
          "마이크 캡처, Opus 인코딩, UDP 전송, 재생을 책임별 클래스로 나눠 어느 단계에서 지연이나 깨짐이 생기는지 바로 추적할 수 있게 했습니다.",
          "20ms 프레임, 24kbps, FEC/DTX 설정을 적용해 대역폭과 지연 사이의 균형을 맞추고, 실시간 보이스에 맞는 패킷 크기로 정리했습니다.",
          "이 구조 덕분에 전송 문제가 생겼을 때도 네트워크, 코덱, 캡처 버퍼 중 어디를 먼저 봐야 하는지가 더 분명해졌습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Voice Client Flow",
          content: [
            { id: "capture", name: "Capture", desc: "마이크 입력" },
            { id: "codec", name: "Opus Codec", desc: "음성 인코딩" },
            { id: "network", name: "UDP Client", desc: "저지연 전달" },
          ],
        },
      },
      {
        title: "roomCode 기반 보이스 워커 큐",
        summary: "같은 방의 음성 처리가 다른 방 전체로 번지지 않도록 서버 처리 흐름을 roomCode 기준으로 나눴습니다.",
        details: [
          "UDP 패킷에서 roomCode를 추출하고 해시 기준으로 워커 큐에 적재해, 한 방의 처리 지연이 다른 방 전체로 번지지 않도록 서버 흐름을 나눴습니다.",
          "브로드캐스트 시 같은 방의 클라이언트 목록을 기준으로 송신자를 제외한 대상에게만 음성 패킷을 전달해 방 단위 전달 경로를 명확히 했습니다.",
          "이렇게 나누고 나니 보이스 서버 문제를 전체 지연으로 보지 않고 방 단위 처리 문제로 좁혀서 볼 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Voice Server Worker Queue",
          content: [
            { id: "room", name: "Room Code", desc: "방 구분" },
            { id: "queue", name: "Worker Queue", desc: "방 단위 처리 분리" },
            { id: "worker", name: "Worker", desc: "같은 방에만 전달" },
          ],
        },
      },
      {
        title: "생사 상태별 청취 규칙 분리",
        summary: "보이스 파이프라인은 유지한 채, 누가 누구를 들을 수 있는지는 규칙 전략으로 분리했습니다.",
        details: [
          "살아있는 플레이어와 죽은 플레이어의 청취 가능 여부를 별도 전략으로 분리해, 게임 상태가 바뀌어도 보이스 파이프라인 자체는 그대로 유지되도록 정리했습니다.",
          "거리 기반 청취와 생사 상태별 예외 규칙을 보이스 처리 코드에 직접 섞지 않고 전략 객체로 분리해 규칙 변경 범위를 좁혔습니다.",
          "덕분에 게임 규칙이 늘어나더라도 전송과 재생 경로 전체를 다시 건드리지 않고, 청취 정책만 교체하는 방향으로 유지보수할 수 있게 됐습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Rule Separation",
          content: [
            { id: "alive", name: "Alive Rule", desc: "거리 기반 청취" },
            { id: "spirit", name: "Spirit Rule", desc: "생사 상태별 예외" },
            { id: "phase", name: "Voice Strategy", desc: "청취 가능 여부 판단" },
          ],
        },
      },
    ],
    problems: [
      {
        title: "캡처 디바이스 초기화 실패로 보이스가 전송되지 않는 문제",
        problem:
          "처음에는 UDP 전송이나 Opus 인코딩 문제라고 생각했지만, 실제 원인은 마이크 장치 이름과 UE5 캡처 API가 기대하는 장치 식별 방식이 맞지 않아 캡처 객체가 만들어지지 않는 데 있었습니다. 입력이 시작되지 않으니 이후 파이프라인 전체가 비어 있었습니다.",
        unexpected:
          "보이스가 안 들리면 보통 네트워크나 코덱을 먼저 의심하기 쉽지만, 실제로는 캡처 초기화 단계에서 이미 실패하고 있었습니다.",
        background:
          "UE5 보이스 캡처 API는 OS가 보여주는 Friendly Name과 다른 장치 식별 기준을 사용할 수 있습니다. 이름이 보인다고 바로 캡처 가능한 것은 아니었습니다.",
        process: [
          "전송 로그보다 먼저 입력 단계 버퍼가 비어 있다는 점을 확인했습니다.",
          "UE5 캡처 API와 OS 장치 이름이 일대일로 대응하지 않는다는 점을 다시 확인했습니다.",
          "특정 장치 이름을 직접 매핑하기보다 OS 기본 입력 장치를 사용하는 쪽이 구현 복잡도와 유지보수 측면에서 더 안전하다고 판단했습니다.",
        ],
        solution:
          "CreateVoiceCapture에 빈 장치 식별자를 전달해 OS 기본 입력 장치를 사용하도록 바꾸고, 캡처 초기화 경로를 다시 정리했습니다.",
        decision:
          "특정 마이크 이름을 계속 맞추는 방식보다 기본 장치를 안정적으로 잡는 방식이 보이스 프로토타입 단계에 더 적합하다고 판단했습니다.",
        result: "캡처 초기화 실패를 해결해 실제 음성 데이터가 송수신되는 상태로 복구했습니다.",
      },
      {
        title: "백그라운드 복귀 직후 깨짐과 지연이 누적되는 문제",
        problem:
          "사용자 체감은 보이스가 끊기거나 밀리는 현상이었지만, 실제 원인은 백그라운드 동안 캡처 버퍼와 코덱 상태에 남은 오래된 PCM 데이터가 복귀 직후 한꺼번에 처리되는 구조였습니다.",
        unexpected:
          "처음에는 공간 음향 파라미터나 HRTF 문제처럼 보였지만, 실제로는 복귀 시점에 낡은 오디오 데이터가 파이프라인에 다시 유입되는 것이 원인이었습니다.",
        background:
          "실시간 오디오는 최신 데이터가 중요합니다. 오래된 PCM 버퍼와 코덱 상태가 남아 있으면 복귀 직후 시간축 자체가 밀려버립니다.",
        process: [
          "오디오 품질 조정보다 먼저 백그라운드 동안 입력 버퍼가 계속 쌓이고 있는지 확인했습니다.",
          "문제를 네트워크 지연으로만 보면 해결되지 않고, 캡처 버퍼와 코덱 상태를 함께 봐야 한다고 판단했습니다.",
          "복귀 후에는 과거 데이터를 최대한 빨리 버리고 현재 시점의 오디오만 다시 처리하는 쪽이 사용자 체감에 더 낫다고 정리했습니다.",
        ],
        solution:
          "백그라운드 복귀 시 누적된 캡처 데이터를 비우고 코덱 상태를 초기화해, 복귀 이후부터의 실시간 음성만 다시 처리하도록 변경했습니다.",
        decision:
          "오래된 데이터를 끝까지 살리는 것보다 실시간성을 우선하는 쪽이 보이스 채팅 사용자 경험에 더 적합하다고 판단했습니다.",
        result: "백그라운드 복귀 직후 깨짐과 지연 누적 현상을 줄였습니다.",
      },
      {
        title: "생사 상태별 청취 규칙이 보이스 파이프라인에 섞이는 문제",
        problem:
          "처음에는 보이스 전송 조건을 if/else로 늘리면 될 것 같았지만, 생사 상태와 거리 규칙이 추가될수록 전송과 재생 코드 전체가 규칙 변경에 같이 흔들리기 시작했습니다.",
        process: [
          "규칙 변경이 캡처, 전송, 재생 경로 수정으로 이어지는 구조가 유지보수 비용을 크게 만든다는 점을 확인했습니다.",
          "핵심은 청취 가능 여부 판단 규칙이 보이스 파이프라인에 섞여 있다는 데 있다고 봤습니다.",
          "그래서 청취 가능 여부를 전략으로 분리해 게임 규칙과 보이스 처리 경로를 나누는 방향을 선택했습니다.",
        ],
        solution:
          "청취 가능 여부를 전략 객체로 분리해 보이스 파이프라인은 유지한 채 생사 상태별 규칙만 교체할 수 있도록 정리했습니다.",
        result: "규칙 추가 시 기존 전송·재생 경로 수정 범위를 줄였습니다.",
      },
    ],
    techChoice: [
      {
        tech: "UDP",
        feature: "짧은 지연이 중요한 실시간 음성 전달 경로",
        advantage: "패킷 하나의 지연이 전체 스트림을 막지 않습니다.",
        comparison: "TCP보다 손실 처리는 직접 고려해야 하지만, 저지연 음성에는 더 적합했습니다.",
        decision: "음성 경로는 완전한 전달보다 짧은 지연이 중요해 UDP를 선택했습니다.",
      },
      {
        tech: "Opus",
        feature: "실시간 음성에 맞는 압축과 손실 대응을 제공하는 코덱",
        advantage: "20ms 프레임, 24kbps, FEC/DTX 설정으로 실시간 음성에 맞는 전송 크기를 구성할 수 있었습니다.",
        comparison: "RAW PCM보다 구현은 복잡하지만 패킷 크기와 손실 대응 측면에서 유리했습니다.",
        decision: "대역폭과 지연의 균형을 맞추기 위해 Opus를 사용했습니다.",
      },
      {
        tech: "Voice Server Worker Queue",
        feature: "roomCode 기준으로 보이스 패킷 처리 흐름을 나누는 서버 구조",
        advantage: "방 단위로 처리 간섭을 줄이고 병목 지점을 보기 쉬웠습니다.",
        comparison: "단일 큐보다 구조는 복잡하지만 방 단위 확장과 추적에는 더 유리했습니다.",
        decision: "roomCode 기준으로 보이스 패킷 처리 흐름을 나누기 위해 사용했습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "실시간 오디오 문제는 네트워크와 함께 캡처 버퍼, 코덱 상태까지 함께 봐야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "다음 단계로는 보이스 품질을 직접 보여주는 계측 지표와 자동화된 검증 루프까지 확장하고 싶습니다.",
      },
    ],
    links: {},
  },
  {
    id: "autowing",
    num: "03",
    title: "오토잉카",
    subtitle:
      "MQTT, WebRTC, 맵 그래프 기반 경로 추천을 분리해 관제 흐름을 정리한 백엔드 프로토타입",
    period: "2026.01 - 2026.02",
    team: "6인",
    role: "관제 화면 연동 · 맵 그래프 경로 추천 · 실시간 채널 분리",
    stack: ["Spring Boot", "MQTT", "WebRTC", "Route Planning"],
    cover: "/project-autowing-cover.png",
    highlights: [
      "관제 화면과 차량 상태가 같은 순서로 보이도록 MQTT 이벤트 흐름을 정리했습니다.",
      "MQTT 제어 채널과 WebRTC 영상 채널을 분리해 서로 다른 지연 요구사항을 나눴습니다.",
      "afterCommit 기준으로 저장 순서와 알림 순서를 먼저 맞췄습니다.",
    ],
    implementations: [
      {
        title: "관제 명령과 상태 전이 흐름",
        summary: "관제 화면에서 보는 명령 흐름과 차량 상태 변화가 같은 순서로 보이도록 상태 전이를 정리했습니다.",
        details: [
          "운영자가 승인, 정지, 복귀 같은 명령을 내렸을 때 관리 화면 설명과 차량 상태가 같은 순서로 보이도록 상태 전이 흐름을 먼저 정리했습니다.",
          "차량 상태 보고와 관제 명령 전달을 같은 API 응답 흐름에 섞지 않고 MQTT 이벤트 기반으로 분리해, 백엔드가 상태 변화의 기준점을 관리하도록 만들었습니다.",
          "이렇게 정리하고 나니 트러블슈팅도 상태 저장과 이벤트 순서 문제로 좁혀서 볼 수 있었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Control State Flow",
          content: [
            { id: "tower", name: "Control Center", desc: "승인과 정지 결정" },
            { id: "backend", name: "Backend + MQTT", desc: "명령과 상태 중계" },
            { id: "car", name: "Towing Car", desc: "상태 보고와 명령 수행" },
          ],
        },
      },
      {
        title: "맵 그래프 기반 경로 추천",
        summary: "서버 메모리에 올린 맵 그래프를 기준으로 경로 추천과 우회 기준을 함께 관리했습니다.",
        details: [
          "서버에 저장된 맵 데이터를 애플리케이션 메모리에 올려두고, 노드와 엣지 관계를 기준으로 미션 경로를 추천했습니다.",
          "차단 구간이 생기면 무조건 처음부터 다시 계산하지 않고, 현재 위치와 이미 진행된 구간을 기준으로 어디서부터 다시 추천할지 정책을 정리해 관리 화면 설명과 차량 상태 흐름이 어긋나지 않게 했습니다.",
          "핵심은 알고리즘 이름보다 같은 상황을 운영자와 시스템이 같은 문맥으로 설명할 수 있는 재계산 기준을 만드는 데 있었습니다.",
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
        summary: "제어 메시지, 현장 영상, AI 판단 신호가 서로의 지연 기준을 오염시키지 않게 분리했습니다.",
        details: [
          "차량 상태와 제어 메시지는 MQTT로, 현장 확인 영상은 WebRTC로, AI 서버의 판단 결과는 보조 입력으로 나눠 각 채널이 맡는 책임을 분리했습니다.",
          "영상 확인 경로의 지연이 제어 메시지 흐름과 직접 섞이지 않도록 하고, AI 결과도 출발 가능 여부를 판단하는 참고 신호로만 사용했습니다.",
          "덕분에 문제를 볼 때도 영상 지연, 상태 이벤트, 경로 추천 기준을 같은 종류의 장애로 묶지 않고 따로 설명할 수 있게 됐습니다.",
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
        title: "MQTT 이벤트를 받은 쪽이 커밋 전 상태를 볼 수 있는 문제",
        problem:
          "상태 저장과 MQTT 발행을 같은 트랜잭션 안에서 처리하자, 이벤트를 받은 쪽이 DB 기준 최종 상태를 조회할 때 아직 커밋 전 상태를 보게 되는 경우가 있었습니다. 관리 화면 설명과 실제 상태가 어긋나는 핵심 원인이었습니다.",
        unexpected:
          "처음에는 메시지가 빠르게 도착하는지만 중요하다고 봤지만, 실제로는 도착 속도보다 저장 완료와 발행 순서가 더 중요한 문제였습니다.",
        background:
          "수신 측이 최종 상태를 DB 기준으로 읽는 구조에서는 메시지가 먼저 가고 저장이 늦으면 화면과 상태가 다른 문맥으로 보이게 됩니다.",
        process: [
          "문제를 단순한 전송 지연이 아니라 상태 저장과 이벤트 발행 순서의 불일치로 다시 정의했습니다.",
          "수신 측이 DB 기준 최종 상태를 조회하는 구조라면 발행 시점은 반드시 커밋 이후여야 한다고 판단했습니다.",
          "그래서 브로커를 바꾸기보다 트랜잭션 이후에만 외부 이벤트가 시작되도록 흐름을 분리했습니다.",
        ],
        solution:
          "afterCommit 훅으로 메시지 발행 시점을 뒤로 미뤄, DB 반영이 끝난 뒤에만 MQTT 이벤트와 관리 화면 갱신 흐름이 이어지도록 했습니다.",
        decision:
          "메시지 브로커 종류보다 상태 저장과 이벤트 순서를 먼저 맞추는 것이 더 직접적인 해결이라고 봤습니다. 트랜잭션이 활성화된 경우 커밋 이후 발행되도록 분리했습니다.",
        result: "커밋 전 상태가 이벤트로 먼저 노출되는 상황을 줄였습니다.",
      },
      {
        title: "차단 구간 발생 시 어디서부터 경로를 다시 추천할지 불명확한 문제",
        problem:
          "맵 그래프 기반으로 경로를 추천하고 있었지만, 차단 구간이 생겼을 때 단순히 새 최단 경로를 계산하는 것만으로는 충분하지 않았습니다. 현재 위치와 이미 진행된 구간을 함께 보지 않으면 관리 화면에서 경로 추천 이유를 설명하기 어려웠습니다.",
        unexpected:
          "처음에는 다시 최단 경로만 구하면 된다고 생각했지만, 실제로는 현재 위치 기준이 빠지면 추천 결과를 같은 문맥으로 설명하기 어려웠습니다.",
        background:
          "프로토타입에서는 경로 계산 결과가 맞는 것만으로는 부족하고, 왜 이 시점에 이 경로가 다시 추천됐는지가 상태 흐름과 함께 설명되어야 했습니다.",
        process: [
          "이미 지난 구간까지 다시 계산 대상에 포함하면 관리 화면 설명과 차량 진행 흐름이 섞인다는 점을 먼저 확인했습니다.",
          "문제를 최단 경로 계산 자체보다 재추천 시작점 정책 문제로 다시 정리했습니다.",
          "그래서 현재 위치와 이미 진행된 구간을 기준으로 그래프 탐색 시작점을 다시 잡는 쪽이 맞다고 판단했습니다.",
        ],
        solution:
          "차단 구간 발생 시 현재 위치와 이미 진행된 구간을 기준으로 그래프 탐색 시작점을 다시 잡고, 이후 경로를 재추천하는 정책을 명시했습니다.",
        decision:
          "알고리즘 이름보다 관리 화면과 차량 상태를 같은 문맥으로 설명할 수 있는 재계산 기준을 먼저 분명하게 만드는 것이 중요하다고 봤습니다.",
        result: "경로 추천 결과가 현재 차량 상태와 같은 문맥에서 설명되도록 정리됐습니다.",
      },
      {
        title: "WebSocket 연결 권한을 일반 API 토큰과 같이 다루기 어려운 문제",
        problem:
          "장시간 유지되는 WebSocket 연결 권한을 일반 API 인증과 같은 방식으로 다루면 URL 노출과 만료 관리 기준이 뒤섞였습니다. 문제는 인증 성공 여부보다 연결 성격이 다르다는 점이었습니다.",
        process: [
          "짧게 끝나는 REST 요청과 오래 유지되는 소켓 연결은 같은 수명 주기로 다루기 어렵다는 점을 먼저 정리했습니다.",
          "일반 Access Token을 그대로 연결에 노출하면 만료와 재연결, 노출 경로를 함께 관리해야 해 책임이 모호해진다고 봤습니다.",
          "그래서 연결 전용 단기 토큰을 분리하는 쪽이 더 안전하다고 판단했습니다.",
        ],
        solution:
          "WebSocket 연결은 일반 API 요청보다 오래 유지되므로, 일반 Access Token과 분리된 단기 소켓 토큰을 사용했습니다.",
        result: "일반 API 토큰이 WebSocket 연결에 그대로 쓰이는 상황을 막았습니다.",
      },
    ],
    techChoice: [
      {
        tech: "MQTT",
        feature: "차량 상태와 제어 명령을 빠르게 주고받는 메시지 채널",
        advantage: "상태 보고와 관제 명령을 HTTP 요청-응답 구조보다 더 자연스럽게 분리할 수 있었습니다.",
        comparison: "일반 요청-응답 구조만으로는 자주 바뀌는 차량 상태를 다루기 불편했습니다.",
        decision: "빠르게 바뀌는 차량 상태와 관제 명령 흐름을 맞추기 위해 MQTT를 선택했습니다.",
      },
      {
        tech: "WebRTC",
        feature: "현장 확인 영상을 위한 별도 실시간 경로",
        advantage: "제어 메시지 흐름과 섞지 않으면서 영상 확인 책임을 따로 둘 수 있었습니다.",
        comparison: "영상과 제어를 같은 채널에서 다루면 지연 기준과 장애 영향 범위가 한데 섞입니다.",
        decision: "영상 확인과 제어 메시지를 다른 책임으로 분리하기 위해 WebRTC 기반 스트림을 사용했습니다.",
      },
      {
        tech: "Map Graph",
        feature: "반복 조회되는 노드·엣지 관계를 메모리에서 빠르게 참조하는 구조",
        advantage: "차단 구간이 생겼을 때 현재 위치 기준 재추천과 우회 정책을 같은 구조에서 다룰 수 있었습니다.",
        comparison: "매 요청마다 맵 구조를 다시 읽는 방식보다 프로토타입 범위에서는 더 단순하고 빠르게 설명할 수 있었습니다.",
        decision:
          "서버에 저장된 맵 데이터를 메모리에 올려두고, 노드·엣지 관계를 기준으로 경로 추천과 우회 기준을 일관되게 다루기 위해 사용했습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail:
          "관제형 프로토타입에서는 경로 알고리즘 자체보다 상태 전이와 이벤트 순서가 설명 가능해야 하며, 같은 실시간 데이터라도 책임이 다르면 채널을 분리해야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail:
          "관제 시나리오를 코드 구조로 정리했고, 다음 단계로는 상태 머신과 이벤트 리플레이 검증까지 더 명시적으로 연결하고 싶습니다.",
      },
    ],
    links: {},
  },
  {
    id: "sticker",
    num: "04",
    title: "STICKER",
    subtitle: "SQS, afterCommit, Redis 기준으로 긴 AI 추천 작업과 저장 순서를 분리한 백엔드 서비스",
    period: "2026.04 - 2026.05",
    team: "6인",
    role: "SQS 추천 파이프라인 · Redis 중복 방지 · 운영 정책 정리",
    stack: ["Spring Boot", "AWS SQS", "Redis", "Async Pipeline"],
    cover: "/Sticker.png",
    highlights: [
      "긴 AI 추천 작업을 SQS 기반 비동기 파이프라인으로 분리했습니다.",
      "Redis 기준으로 중복 실행과 중복 반영을 줄였습니다.",
      "afterCommit 발행과 실패 분류 기준으로 흐름이 꼬이지 않게 했습니다.",
    ],
    implementations: [
      {
        title: "비동기 추천 처리 흐름",
        summary: "긴 AI 추천 작업이 앱 응답 경로를 막지 않도록 요청 처리와 추천 생성을 분리했습니다.",
        details: [
          "추천 요청 검증과 작업 적재는 Spring API가 맡고, 실제 추천 생성은 비동기 파이프라인으로 넘겨 사용자 요청과 긴 작업의 책임을 나눴습니다.",
          "추천 요청을 바로 결과 반환으로 연결하지 않고 SQS에 적재한 뒤 후속 저장 단계로 넘겨, 앱 응답 경로가 AI 처리 시간에 묶이지 않게 했습니다.",
          "이 구조 덕분에 추천 기능을 운영 가능한 작업 흐름으로 다룰 수 있게 됐습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Async Recommendation Flow",
          content: [
            { id: "app", name: "App", desc: "추천 요청" },
            { id: "api-ingest", name: "Spring API", desc: "검증 후 작업 적재" },
            { id: "ai", name: "AI Server", desc: "추천 생성" },
            { id: "api-save", name: "Spring API", desc: "결과 검증 후 저장" },
          ],
        },
      },
      {
        title: "중복 실행 방어와 결과 정합성",
        summary: "같은 추천 요청이 여러 번 들어와도 작업과 결과가 중복 반영되지 않게 막았습니다.",
        details: [
          "같은 사용자의 같은 날짜 추천 요청이 여러 번 들어와도 작업이 중복 실행되거나 결과가 두 번 반영되지 않도록 Redis 락과 최종 저장 단계의 dedup 기준을 함께 사용했습니다.",
          "커밋 이후에만 외부 작업이 시작되도록 흐름을 분리해, 사용자 화면에 보이는 상태와 내부 저장 상태가 다른 순서로 보이지 않게 정리했습니다.",
          "결국 한 번의 방어선으로 끝내기보다 작업 시작 전과 결과 저장 직전에 각각 중복 여부를 다시 보는 식으로 구조를 쌓았습니다.",
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
        title: "실패 분류와 토큰 정책 정리",
        summary: "재시도할 실패와 버려야 할 실패를 나누고, 인증 문제는 별도 정책으로 분리했습니다.",
        details: [
          "재시도해도 의미 없는 메시지와 잠시 후 다시 처리해야 하는 메시지를 같은 방식으로 다루지 않도록 실패 분류 기준과 운영 로그를 정리했습니다.",
          "추천 파이프라인과 인증 문제를 한데 묶지 않고, Refresh Token Rotation 기준을 별도 정책으로 두어 재사용 공격 대응 범위를 줄였습니다.",
          "이렇게 분리하고 나니 운영 정책도 재처리 가능성과 추적 가능성 중심으로 설명할 수 있게 됐습니다.",
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
        title: "DB 커밋 전 메시지가 먼저 소비되는 문제",
        problem:
          "처음에는 SQS로만 분리하면 비동기 처리가 끝난다고 봤지만, 실제로는 DB가 롤백되거나 커밋 전 메시지가 소비되면 존재하지 않는 상태를 참조하게 되는 것이 더 큰 문제였습니다. 비동기화 자체보다 커밋 전 상태 노출을 막는 것이 핵심이었습니다.",
        unexpected:
          "처음에는 메시지가 큐에 잘 들어가기만 하면 된다고 생각했지만, 실제로는 메시지가 너무 빨리 소비되는 것이 정합성을 무너뜨리고 있었습니다.",
        background:
          "비동기 시스템에서는 작업 분리만으로 충분하지 않고, 저장 완료 시점과 후속 작업 시작 시점도 같은 순서를 따라야 합니다.",
        process: [
          "문제를 상태 저장과 후속 작업 시작 시점의 불일치로 다시 정의했습니다.",
          "AI 서버가 결국 DB 상태를 참조한다는 점을 확인했습니다.",
          "그래서 메시지 브로커 선택보다 먼저 커밋 이후에만 후속 작업이 시작되도록 만드는 것이 필요하다고 판단했습니다.",
        ],
        solution:
          "afterCommit 훅에 메시지 발행을 등록해, DB 커밋이 끝난 뒤에만 SQS로 작업이 나가도록 변경했습니다.",
        result:
          "커밋 전 상태가 후속 작업으로 먼저 노출돼 AI 작업이 DB에 없는 추천 요청을 참조하는 상황을 줄였습니다.",
      },
      {
        title: "재시도해야 하는 실패와 버려야 하는 실패를 구분해야 하는 문제",
        problem:
          "실패 메시지를 무조건 재시도하면 poison pill이 큐를 계속 점유하고, 무조건 버리면 일시 장애에서 복구할 기회를 잃습니다. 추천 로직보다 실패 분류 정책이 먼저 필요했습니다.",
        unexpected:
          "처음에는 재시도 규칙 하나로 정리할 수 있을 것 같았지만, 실제로는 실패 유형을 나누지 않으면 운영 흐름이 바로 무너졌습니다.",
        background:
          "계약 위반 메시지는 시간이 지나도 성공하지 않지만, DB 연결 문제나 네트워크 오류는 시간이 지나면 복구될 수 있습니다. 두 경우를 같은 정책으로 다루면 무한 반복이나 과도한 폐기가 발생합니다.",
        process: [
          "모든 실패를 같은 에러로 취급할수록 운영 리스크가 커진다는 점을 먼저 확인했습니다.",
          "재시도해도 성공하지 않는 메시지와 잠시 후 다시 시도하면 되는 메시지는 운영 의도가 다르다고 정리했습니다.",
          "그래서 예외를 운영 정책 분류 기준으로 다시 나누는 방향을 선택했습니다.",
        ],
        solution:
          "계약 위반 메시지는 실패 로그로 격리해 재처리 대상에서 제외하고, DB나 네트워크 같은 일시 장애 메시지는 visibility timeout 이후 다시 처리되도록 분리했습니다.",
        result: "반복 재처리되는 상황을 줄이고, 일시 장애 메시지는 재처리 기회를 유지했습니다.",
      },
      {
        title: "Refresh Token 재사용 피해를 줄여야 하는 문제",
        problem:
          "리프레시 토큰이 탈취된 뒤에도 서버가 기존 토큰과 새 토큰을 모두 유효하게 두면 공격자가 세션을 계속 이어갈 수 있습니다. 로그인 성공 여부보다 재사용 이후 피해 범위를 얼마나 빨리 줄이느냐가 더 중요했습니다.",
        process: [
          "만료 시간만 보는 방식으로는 탈취 뒤 재사용을 구분할 수 없다는 점을 먼저 확인했습니다.",
          "토큰 저장소가 재사용 여부를 판별하는 근거가 되어야 한다고 봤습니다.",
          "그래서 새 토큰 발급보다 먼저 기존 토큰을 즉시 폐기하고 재사용 세션을 무효화하는 정책이 필요하다고 판단했습니다.",
        ],
        solution:
          "Refresh Token Rotation을 적용해 기존 토큰을 즉시 폐기하고, 재사용이 감지되면 해당 사용자의 전체 세션을 무효화했습니다.",
        result: "탈취 토큰이 다시 사용되더라도 공격자의 지속 사용 시간을 줄였습니다.",
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
        feature: "긴 작업을 응답 경로 밖으로 분리하는 메시지 큐",
        advantage: "추천 생성이 오래 걸려도 앱 요청이 그대로 막히지 않게 할 수 있었습니다.",
        comparison: "Kafka 같은 스트리밍 인프라보다 현재 문제를 빠르게 분리해 보기 쉬웠습니다.",
        decision: "긴 추천 작업이 사용자 요청을 멈추지 않게 하려는 목적에 맞춰 SQS를 사용했습니다.",
      },
      {
        tech: "Transaction Boundary",
        feature: "저장 완료와 후속 작업 시작 순서를 맞추는 기준",
        advantage: "커밋 전 상태가 다음 작업으로 먼저 노출되는 문제를 막기 좋았습니다.",
        comparison: "메시지 브로커를 바꾸는 것보다 현재 문제에 더 직접적인 해결이었습니다.",
        decision: "트랜잭션 커밋 이후 SQS 메시지를 발행하도록 분리해 상태 순서를 먼저 맞췄습니다.",
      },
      {
        tech: "Redis Dedup / Idempotency",
        feature: "중복 실행과 중복 반영을 여러 단계에서 줄이는 장치",
        advantage: "작업 시작 전과 결과 저장 직전에 각각 한 번 더 중복 여부를 확인할 수 있었습니다.",
        comparison: "DB 저장 전 단계에서도 중복 실행을 줄이기 위해 Redis 기준을 함께 두는 편이 운영상 더 안정적이었습니다.",
        decision: "중복 실행과 중복 반영을 함께 줄이기 위해 Redis 락과 dedup 기준을 같이 사용했습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail:
          "AI 서비스에서 먼저 중요한 것은 모델보다 긴 작업을 분리하고, 실패와 중복을 추적 가능한 정책으로 나누는 백엔드 구조라는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail:
          "다음 단계로는 큐 처리 시간, 중복 차단 횟수, 재시도 횟수 같은 운영 지표를 더 분명한 수치로 남기고 싶습니다.",
      },
    ],
    links: {},
  },
];

const projectOrder = ["robotpal", "mausoleum", "autowing", "sticker"];

export const projects = projectOrder.map((id) => {
  const project = baseProjects.find((item) => item.id === id);

  return {
    ...project,
    detailPage: projectDetailPages[project.id],
  };
});
