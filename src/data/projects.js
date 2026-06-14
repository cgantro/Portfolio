import { projectDetailPages } from "./projectDetailPages";

const baseProjects = [
  {
    id: "robotpal",
    num: "01",
    title: "RobotPal",
    subtitle: "렌더링, readback, 인코딩, 전송 파이프라인을 나눠 스트리밍 병목을 줄인 C++ 시뮬레이션 런타임",
    period: "2025.11 - 2025.12",
    team: "2인",
    role: "C++ 런타임 · 스트리밍 파이프라인 · 웹 빌드 대응",
    stack: ["C++17", "OpenGL", "Emscripten", "JPEG Encoder", "PBO"],
    cover: "/project-robotpal-cover.png",
    highlights: [
      "렌더, readback, 인코딩, 전송 경계를 다시 나눠 병목을 구조적으로 해소",
      "데스크톱과 WebAssembly 경로를 같은 C++ 코어로 유지",
      "단일 워커 대비 병렬 처리 효과를 별도 벤치마크로 비교",
    ],
    implementations: [
      {
        title: "시뮬레이션 제어 런타임 구성",
        items: [
          "실물 장비를 바로 연결하지 않아도 제어 로직과 화면 흐름을 먼저 검증할 수 있도록 시뮬레이션 중심 런타임을 구성했습니다.",
          "상위 조작 로직이 실제 장비 연동을 고려해 시뮬레이터를 같은 방식으로 다룰 수 있도록 제어 계층의 역할을 분리했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Runtime Flow",
          content: [
            { id: "sim", name: "Simulation Loop", desc: "상태 계산과 렌더링에 집중" },
            { id: "ctrl", name: "Controller Layer", desc: "실물 연동 가능성을 고려한 제어 책임 분리" },
            { id: "delivery", name: "Desktop / Web", desc: "동일 코어를 다른 실행 경로로 연결" },
          ],
        },
      },
      {
        title: "실시간 스트리밍 파이프라인",
        items: [
          "렌더링 결과를 바로 전달하지 않고 readback 이후 인코딩, 전달 단계를 각각 분리했습니다.",
          "JPEG 인코더 워커 수를 바꿔가며 단일 워커 대비 병렬 처리 이득이 실제로 나타나는지 측정했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Render -> Encode Queue -> Delivery",
          content: [
            { id: "render", name: "Render", desc: "메인 루프에서 프레임 생성" },
            { id: "encode", name: "JPEG Encode", desc: "워커 풀에서 압축 처리" },
            { id: "send", name: "Delivery", desc: "전달 단계가 별도 소비" },
          ],
        },
      },
      {
        title: "웹 빌드와 실행 환경 대응",
        items: [
          "Emscripten 경로를 별도 관리해 같은 C++ 코어를 WebAssembly로 실행할 수 있게 했습니다.",
          "브라우저 멀티스레드 실행에 필요한 SharedArrayBuffer 조건을 맞추기 위해 COI Service Worker 기반 대응 경로를 정리했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Web Thread Enablement",
          content: [
            { id: "pthreads", name: "Emscripten pthreads", desc: "웹 멀티스레드 실행 경로" },
            { id: "sab", name: "SharedArrayBuffer", desc: "브라우저 스레드 공유 메모리 조건" },
            { id: "coi", name: "COI Service Worker", desc: "정적 배포 환경에서 COOP/COEP 조건 보완" },
          ],
        },
      },
    ],
    problems: [
      {
        title: "glReadPixels가 렌더 루프를 막는 문제",
        problem:
          "처음에는 GPU 성능 자체가 부족한 줄 알았지만, 실제 원인은 고해상도 프레임을 읽어올 때 CPU가 GPU 완료를 기다리는 동기 호출 구조에 있었습니다. 해상도가 올라갈수록 이 대기 구간이 메인 루프 전체를 멈추게 했습니다.",
        unexpected:
          "처음 예상은 렌더링 연산량 자체가 문제라는 쪽이었지만, 실제 병목은 화면을 그린 뒤 데이터를 읽어오는 순간의 동기화였습니다.",
        background:
          "glReadPixels는 GPU가 해당 프레임을 끝낼 때까지 CPU를 기다리게 만들 수 있습니다. 해상도가 높을수록 이 구조적 대기가 더 크게 드러납니다.",
        process: [
          "프레임 캡처 구간만 따로 분리해 보면서 렌더링 자체보다 readback 시점에서 스톨이 발생한다는 사실을 먼저 확인했습니다.",
          "문제는 한 프레임의 속도보다 현재 프레임을 읽으려는 CPU와 아직 작업 중인 GPU가 같은 시점을 공유한다는 데 있었습니다.",
          "그래서 지금 프레임은 GPU가 쓰고, CPU는 이전 프레임을 읽는 구조로 타이밍을 어긋나게 만들어야 한다고 판단했습니다.",
        ],
        solution:
          "PBO 더블 버퍼 ping-pong 구조를 적용해 GPU는 현재 프레임을 비동기로 기록하고, CPU는 이전 프레임 버퍼만 읽도록 분리했습니다.",
        decision:
          "같은 프레임을 CPU와 GPU가 동시에 바라보는 구조 자체가 문제였기 때문에, 연산 최적화보다 읽는 시점을 어긋나게 만드는 비동기 구조를 택했습니다.",
        result:
          "정량 수치를 별도로 남기지는 못했지만, readback 대기 구간을 줄여 이후 인코딩·전달 단계 병목을 따로 확인할 수 있는 상태를 만들었습니다.",
        snippet: {
          type: "visual",
          label: "PBO Ping-Pong Readback",
          content: [
            { id: "gpu-write", name: "GPU Write", desc: "현재 프레임을 write buffer에 기록" },
            { id: "cpu-read", name: "CPU Read", desc: "이전 프레임을 read buffer에서 소비" },
            { id: "swap", name: "Swap", desc: "프레임마다 read/write 버퍼 교체" },
          ],
        },
      },
      {
        title: "인코딩과 전달 단계가 같은 속도로 묶인 문제",
        problem:
          "렌더링이 끝난 프레임을 같은 스레드에서 인코딩하고 바로 전달 단계까지 처리하자, 큰 프레임 하나가 밀릴 때 다음 프레임도 연쇄적으로 늦어졌습니다. 예상과 달리 전달 단계보다 먼저 파이프라인 경계가 병목이었습니다.",
        unexpected:
          "처음에는 전달 단계 비용을 더 의심했지만, 실제로는 인코딩이 끝날 때까지 전달 단계가 시작조차 못 하는 구조가 먼저 문제였습니다.",
        background:
          "생산과 소비 속도가 다른 단계를 같은 스레드로 묶으면 가장 느린 단계의 속도가 전체 처리량을 결정합니다. 실시간 스트리밍에서는 이런 지연이 누적되기 쉽습니다.",
        process: [
          "지연이 누적되는 시점을 추적해 보니 전달 단계보다 먼저 인코딩 완료를 기다리는 구간에서 프레임 큐가 쌓이고 있었습니다.",
          "전달 단계 자체가 느린 문제가 아니라, 인코딩과 전달 단계가 같은 리듬으로 강제되어 더 느린 쪽의 속도를 전체가 따라가고 있었습니다.",
          "그래서 단계별 소비 속도를 다르게 유지할 수 있도록 생산자-소비자 구조로 분리하는 쪽이 더 근본적인 해결이라고 봤습니다.",
        ],
        solution:
          "인코딩 결과를 큐에 적재하고 전달 단계가 별도 소비되도록 바꿔, 한 단계의 지연이 다음 단계의 시작 자체를 막지 않게 했습니다.",
        decision:
          "문제는 단일 함수의 속도보다 단계 간 결합이었기 때문에, 압축과 전달 단계를 따로 조정할 수 있도록 생산자-소비자 구조를 선택했습니다.",
        result:
          "동일 벤치마크 조건에서 Single Worker 대비 12 Workers 조건의 APP FPS와 SINK FPS가 모두 개선됐습니다.",
        snippet: {
          type: "visual",
          label: "Queue-based Separation",
          content: [
            { id: "enc", name: "Encode Worker", desc: "압축 처리만 담당" },
            { id: "queue", name: "Concurrent Queue", desc: "단계 사이의 속도 차이를 흡수" },
            { id: "tx", name: "Delivery Worker", desc: "전달 단계 소비" },
          ],
        },
      },
      {
        title: "브라우저 멀티스레드가 바로 동작하지 않는 문제",
        problem:
          "처음에는 Emscripten pthreads 설정만 맞추면 될 줄 알았지만, 실제로는 브라우저가 SharedArrayBuffer 조건을 만족하지 못해 멀티스레드 경로가 막히고 있었습니다. 문제는 코드보다 실행 환경 헤더였습니다.",
        process: [
          "빌드 옵션보다 먼저 브라우저 실행 조건을 다시 확인해, 런타임 에러가 WebAssembly 코드가 아니라 보안 헤더 부족에서 발생한다는 점을 확인했습니다.",
          "COOP/COEP 없이 SharedArrayBuffer가 막히면 멀티스레드 자체가 성립하지 않는다는 백그라운드를 다시 정리했습니다.",
          "그래서 앱 코드 수정이 아니라 배포 경로에서 COI Service Worker로 실행 조건을 보완하는 편이 맞다고 판단했습니다.",
        ],
        solution:
          "COI Service Worker를 빌드 결과물에 포함해 SharedArrayBuffer 사용 조건을 맞추는 경로를 마련했습니다.",
        result: "웹 빌드에서도 스레드 기반 실행 경로를 검증할 수 있는 기반을 마련했습니다.",
        snippet: {
          type: "visual",
          label: "Web Thread Enablement",
          content: [
            { id: "static", name: "Static Assets", desc: "기본 응답만 제공" },
            { id: "coi", name: "COI Service Worker", desc: "브라우저 실행 조건 보완" },
            { id: "wasm", name: "WASM Threads", desc: "SharedArrayBuffer 조건 충족" },
          ],
        },
      },
    ],
    techChoice: [
      {
        tech: "OpenGL + PBO",
        feature: "렌더링과 readback 경계를 직접 다룰 수 있는 저수준 그래픽 경로",
        advantage: "readback 병목을 직접 확인하고 제어할 수 있었습니다.",
        comparison: "엔진 추상화 위에서는 같은 readback 지점을 이렇게 직접 다루기 어렵습니다.",
        decision: "readback 병목을 직접 제어하기 위해 OpenGL과 PBO를 선택했습니다.",
      },
      {
        tech: "JPEG Encoder",
        feature: "프레임 압축 경로와 워커 수 비교에 집중할 수 있는 JPEG 인코딩 경로",
        advantage: "워커 수에 따른 처리 차이를 비교하기 좋았습니다.",
        comparison: "H.264/WebRTC 같은 비디오 파이프라인보다 프로젝트 범위 안에서 병목을 빠르게 드러내기에 적절했습니다.",
        decision: "파이프라인 구조와 워커 수 비교를 명확히 보기 위해 JPEG Encoder 경로를 선택했습니다.",
      },
      {
        tech: "Emscripten",
        feature: "같은 C++ 코어를 WebAssembly 경로로 재사용할 수 있는 브리지",
        advantage: "같은 C++ 코어를 웹에서도 바로 검증할 수 있었습니다.",
        comparison: "웹용을 별도로 다시 구현하면 실행 경로 검증이 분리됩니다.",
        decision: "같은 C++ 코어를 웹에서 검증하기 위해 Emscripten을 사용했습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "성능 문제를 단일 함수 최적화가 아니라 단계 간 결합 문제로 봐야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "벤치마크는 남겼지만, 릴리즈 빌드와 다양한 씬 복잡도 조건까지 확장하지 못한 점은 아쉽습니다.",
      },
    ],
    links: {
      github: "https://github.com/Junwoo-Seo-1998/RobotPal",
      demo: "https://junwoo-seo-1998.github.io/RobotPal/",
    },
  },
  {
    id: "autowing",
    num: "02",
    title: "오토잉카",
    subtitle: "미션 상태, 이벤트 순서, 맵 그래프 기반 경로 추천을 맞춰 관제 설명력을 높인 백엔드 프로토타입",
    period: "2026.01 - 2026.02",
    team: "6인",
    role: "백엔드 관제 연동 · 맵 그래프 기반 경로 추천 · 실시간 통신 구조 정리",
    stack: ["Spring Boot", "MQTT", "WebRTC", "Route Planning"],
    cover: "/project-autowing-cover.png",
    highlights: [
      "관제 상황을 메시지, 상태, 경로 재계산 흐름으로 모델링",
      "명령 채널과 영상 채널을 분리해 운영 책임을 명확화",
      "정합성, 보안, 페이로드 경량화까지 운영 리스크 중심으로 개선",
    ],
    implementations: [
      {
        title: "관제 명령과 상태 전이 설계",
        items: [
          "운영자가 승인, 정지, 재출발 같은 상태 전이를 설명 가능하게 만들기 위해 명령과 상태 이벤트 흐름을 먼저 정리했습니다.",
          "MQTT를 차량-서버 간 제어 메시지 채널로 사용해 즉시성이 필요한 상태 보고를 분리했습니다.",
          "관제 상황을 가정한 프로토타입에서도 흐름이 끊기지 않도록 비상 정지, 승인 해제, 재출발 조건까지 상태 전이로 정리했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Control Flow",
          content: [
            { id: "tower", name: "Control Center", desc: "승인 · 정지 · 재출발 결정" },
            { id: "backend", name: "Backend + MQTT", desc: "명령과 상태 이벤트 중계" },
            { id: "car", name: "Towing Car", desc: "주행 상태 보고와 명령 수행" },
          ],
        },
      },
      {
        title: "맵 그래프 기반 경로 추천과 우회 기준 정리",
        items: [
          "서버에 저장된 맵 데이터를 애플리케이션 메모리에 올려두고, 노드와 엣지로 구성된 그래프를 기준으로 미션 경로를 추천했습니다.",
          "차단 구간이 생겼을 때는 단순히 전체 경로를 다시 계산하는 대신, 현재 위치와 이미 진행된 구간을 기준으로 어디서부터 다시 추천할지 정책을 정리했습니다.",
          "핵심은 알고리즘 이름보다 관리 화면 설명과 차량 상태 흐름이 어긋나지 않도록 재계산 기준을 명확히 하는 것이었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Rerouting Flow",
          content: [
            { id: "mission", name: "Mission Route", desc: "초기 경로 계산" },
            { id: "block", name: "Blocked Segment", desc: "차단 구간 반영" },
            { id: "planner", name: "Replan", desc: "현재 위치와 진행 구간 기준 재계산" },
          ],
        },
      },
      {
        title: "현장 영상과 AI 보조 신호 분리",
        items: [
          "영상 확인 경로는 WebRTC 기반 스트림으로, 제어 메시지는 MQTT 경로로 분리해 서로 다른 지연 허용치를 반영했습니다.",
          "AI 서버에서 전달된 도킹·수신호 판단 결과는 제어 명령이 아니라 출발 가능 여부를 판단하는 보조 입력으로만 다뤘습니다.",
          "영상 확인 경로의 지연이 제어 메시지 흐름에 직접 영향을 주지 않도록 채널 책임을 분리한 점이 핵심입니다.",
        ],
        snippet: {
          type: "visual",
          label: "Channel Separation",
          content: [
            { id: "cmd", name: "MQTT Control", desc: "상태 · 명령 · 이벤트" },
            { id: "video", name: "WebRTC Feed", desc: "현장 확인용 영상" },
            { id: "ai", name: "AI Signals", desc: "출발 조건 판단 보조" },
          ],
        },
      },
    ],
    problems: [
      {
        title: "DB 커밋 전 MQTT 발행으로 상태가 어긋나는 문제",
        problem:
          "상태 저장과 메시지 발행을 같은 트랜잭션 안에서 처리하자, MQTT 이벤트를 받은 쪽이 DB 기준 최종 상태를 조회할 때 아직 커밋 전 상태를 볼 수 있는 문제가 생겼습니다. 이런 순서 어긋남은 관리 화면과 실제 저장 상태를 다르게 보이게 만들었습니다.",
        unexpected:
          "처음에는 메시지가 잘 전달되는지만 중요하다고 봤지만, 실제로는 전달 성공보다 저장과 발행의 순서가 더 큰 문제였습니다.",
        background:
          "수신 측이 최종 상태를 DB 기준으로 읽는 구조에서는 메시지가 먼저 가고 저장이 늦어지면 화면과 실제 상태가 쉽게 어긋납니다.",
        process: [
          "문제를 단순 전송 지연이 아니라 저장 순서와 발행 순서의 불일치로 다시 정의했습니다.",
          "수신 측이 DB 기준으로 상태를 읽는 구조라면, 발행 시점은 반드시 커밋 이후여야 한다는 점을 확인했습니다.",
          "그래서 메시지 브로커 선택보다 먼저 데이터와 이벤트의 순서를 맞추는 것이 핵심이라고 판단했습니다.",
        ],
        solution:
          "afterCommit 훅으로 메시지 발행 시점을 뒤로 미뤄, DB 반영이 끝난 뒤에만 MQTT 이벤트와 관리 화면 갱신 흐름이 이어지도록 했습니다.",
        decision:
          "브로커를 바꾸는 것보다 데이터와 이벤트의 순서를 맞추는 편이 더 근본적인 해결이어서, 트랜잭션이 활성화된 경우 커밋 이후에 MQTT 발행이 이어지도록 분리했습니다.",
        result: "커밋 전 상태가 이벤트로 먼저 노출되는 상황을 줄였습니다.",
      },
      {
        title: "인메모리 맵 그래프에서 차단 구간 발생 시 어디서부터 경로를 다시 추천할지 불명확한 문제",
        problem:
          "서버는 맵 데이터를 메모리에 올려두고 노드·엣지 기반으로 경로를 추천했지만, 차단 구간이 생겼을 때 단순히 새 최단 경로를 계산하는 것만으로는 충분하지 않았습니다. 이미 통과한 노드와 차량의 현재 위치를 고려하지 않으면 관리 화면의 설명과 차량 상태 흐름이 어긋날 수 있었습니다.",
        unexpected:
          "처음 예상은 '다시 최단 경로를 구하면 된다'였지만, 실제로는 현재 위치 기준이 빠지면 경로 추천 결과를 같은 문맥으로 설명하기 어려웠습니다.",
        background:
          "이 프로젝트에서는 경로 계산 결과만 맞는다고 충분하지 않고, 차량이 지금 어떤 상태에서 왜 그 추천 경로가 나왔는지가 함께 설명되어야 했습니다.",
        process: [
          "차량이 이미 지나간 노드까지 다시 계산에 넣으면 관리 화면에서 추천 경로를 설명하기 어려워지는 상황을 먼저 확인했습니다.",
          "우회는 단순 최단 경로 재계산이 아니라, 현재 상황에서 다시 설명 가능한 경로 추천 정책을 만드는 문제라고 정리했습니다.",
          "그래서 현재 위치와 이미 진행된 구간을 기준점으로 삼아 그래프 탐색 시작점을 다시 잡는 규칙을 시나리오와 함께 묶었습니다.",
        ],
        solution:
          "차단 구간 발생 시 현재 위치와 이미 진행된 구간을 기준으로 그래프 탐색 시작점을 다시 잡고, 이후 경로를 재추천하는 정책을 명시했습니다.",
        decision:
          "수학적으로 가장 짧은 경로보다 관리 화면과 차량 상태 흐름을 같은 문맥으로 설명할 수 있는 추천 기준이 더 중요했기 때문에, 재계산 시작점을 명시하는 쪽을 택했습니다.",
        result: "경로 추천 결과를 현재 차량 상태와 함께 설명할 수 있는 기준이 정리됐습니다.",
      },
      {
        title: "WebSocket 토큰을 일반 Access Token으로 처리하기 어려운 문제",
        problem:
          "장시간 연결 권한을 일반 API 인증과 같이 다루면 URL 노출과 연결 유지 정책이 섞이게 됩니다. 예상보다 문제는 인증 성공 여부가 아니라 연결 성격이 다르다는 데 있었습니다.",
        process: [
          "REST 요청과 장시간 유지되는 소켓 연결이 같은 토큰 수명 정책을 쓰면 위험 구간이 넓어진다는 점을 먼저 봤습니다.",
          "토큰을 하나로 단순화할수록 편해 보이지만, 노출 경로와 만료 전략까지 같이 묶여 버린다는 점이 문제였습니다.",
          "그래서 권한 모델을 단순화하기보다 연결 전용 토큰을 따로 두는 편이 더 안전하다고 판단했습니다.",
        ],
        solution:
          "WebSocket 연결은 일반 API 요청보다 오래 유지되므로, 일반 Access Token과 분리된 단기 소켓 토큰으로 관리했습니다.",
        result: "일반 API 토큰이 WebSocket 연결에 그대로 쓰이는 상황을 막았습니다.",
      },
    ],
    techChoice: [
      {
        tech: "MQTT",
        feature: "차량 상태와 제어 이벤트를 경량 메시지로 주고받기 좋은 채널",
        advantage: "관제 명령과 상태 보고를 빠르게 분리하고 추적하기 좋았습니다.",
        comparison: "HTTP 요청-응답 구조로는 상태 보고 빈도와 제어 흐름을 동시에 다루기 부담이 컸습니다.",
        decision: "오토잉카의 핵심은 제어 이벤트와 상태 갱신의 흐름을 또렷하게 유지하는 것이어서 MQTT가 가장 잘 맞았습니다.",
      },
      {
        tech: "WebRTC",
        feature: "현장 확인용 영상 흐름을 제어 메시지와 분리하기 위한 미디어 채널",
        advantage: "명령 채널과 분리해 제어 메시지 흐름과 섞지 않으면서 영상 확인 경로를 유지할 수 있었습니다.",
        comparison: "제어 메시지 채널과 영상을 같은 방식으로 처리하면 각기 다른 지연 요구사항을 만족시키기 어렵습니다.",
        decision: "영상 경로는 WebRTC 기반 스트림으로 두고, 백엔드는 제어 메시지와 영상 확인 흐름이 섞이지 않도록 책임을 나눴습니다.",
      },
      {
        tech: "인메모리 맵 그래프",
        feature: "서버 메모리에 올린 노드·엣지 그래프를 기준으로 경로를 추천하는 구조",
        advantage: "맵 구조를 그래프 형태로 관리해 출발지, 목적지, 차단 구간에 따른 경로 추천과 재계산 기준을 일관되게 다룰 수 있었습니다.",
        comparison: "맵 변경이 잦은 환경에서는 메모리 갱신 정책이 추가로 필요하지만, 고정된 시나리오 기반 프로토타입에서는 빠른 경로 조회와 설명 가능한 재계산 기준을 우선했습니다.",
        decision: "서버에 저장된 맵 데이터를 메모리에 올려두고 노드·엣지 관계를 기준으로 경로를 추천했습니다. 매 요청마다 맵 구조를 새로 읽기보다, 프로토타입 환경에서 반복 조회되는 노드·엣지 관계를 서버 메모리에서 빠르게 참조하도록 구성했습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "관제형 프로토타입에서는 경로 알고리즘 자체보다 상태 전이와 이벤트 순서가 설명 가능해야 하며, 같은 실시간 데이터라도 지연 허용치와 책임이 다르면 채널을 분리해야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "관제 시나리오를 코드 구조로 정리하는 데는 성공했지만, 이후 단계에서 상태 머신과 이벤트 리플레이 수준까지 더 명시화하지 못한 점은 남았습니다.",
      },
    ],
    links: {},
  },
  {
    id: "mausoleum",
    num: "03",
    title: "영묘",
    subtitle: "UDP/Opus 기반 실시간 오디오 파이프라인과 청취 규칙을 분리한 UE5 보이스 런타임",
    period: "2026.02 - 2026.03",
    team: "6인",
    role: "보이스 채팅 클라이언트·서버 · roomCode 기반 보이스 처리 구조 개선",
    stack: ["UE5 C++", "UDP", "Opus", "Voice Runtime"],
    cover: "/project-mausoleum-cover.png",
    highlights: [
      "캡처, 코덱, 네트워크, 재생을 분리한 UE5 보이스 파이프라인",
      "20ms 프레임, 24kbps, FEC/DTX 설정으로 저지연 음성 경로 구성",
      "roomCode 기반 워커 큐 분리와 생사 상태별 청취 규칙 정리",
    ],
    implementations: [
      {
        title: "UE5 보이스 클라이언트 파이프라인",
        items: [
          "마이크 캡처, Opus 인코딩, UDP 전송, 재생을 책임별 클래스로 나눠 단계별로 추적할 수 있게 했습니다.",
          "20ms 프레임, 24kbps, FEC/DTX 설정을 적용해 지연과 대역폭 사이의 균형을 맞췄습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Voice Client Flow",
          content: [
            { id: "capture", name: "Capture", desc: "마이크 입력 수집" },
            { id: "codec", name: "Opus Codec", desc: "20ms 프레임 인코딩" },
            { id: "network", name: "UDP Client", desc: "저지연 전송" },
          ],
        },
      },
      {
        title: "roomCode 기반 보이스 워커 큐 분리",
        items: [
          "UDP 패킷에서 roomCode를 추출하고, 해시 기준으로 워커 큐에 적재해 방 간 처리 간섭을 줄였습니다.",
          "브로드캐스트 시 같은 방의 클라이언트 목록을 기준으로 송신자를 제외한 대상에게 음성 패킷을 전달했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Voice Server Worker Queue",
          content: [
            { id: "room", name: "Room Code", desc: "워커 큐 선택 기준" },
            { id: "queue", name: "Worker Queue", desc: "방 간 간섭 분리" },
            { id: "worker", name: "Worker", desc: "자기 큐만 독립 소비" },
          ],
        },
      },
      {
        title: "생사 상태별 청취 규칙 분리",
        items: [
          "죽은 플레이어와 살아있는 플레이어의 청취 가능 여부를 별도 전략으로 분리했습니다.",
          "보이스 파이프라인은 유지한 채 게임 상태별 청취 규칙만 교체할 수 있도록 정리했습니다.",
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
          "처음에는 네트워크나 코덱이 문제일 거라고 생각했지만, 실제 원인은 표시 이름으로 보이는 마이크 장치명과 UE5 캡처 API가 실제로 요구하는 장치 식별자가 다르다는 점이었습니다. 표시 이름을 그대로 넘기니 캡처 객체 자체가 생성되지 않았습니다.",
        unexpected:
          "보이스가 안 들리면 보통 패킷이나 코덱을 먼저 의심하기 쉽지만, 실제로는 입력 장치 초기화 단계에서 이미 실패하고 있었습니다.",
        background:
          "UE5 내부 오디오 레이어와 OS 장치 식별 방식은 같지 않습니다. Friendly Name이 보이더라도 캡처 API가 원하는 식별자와 다를 수 있습니다.",
        process: [
          "패킷 구조를 먼저 의심했지만, 실제로는 입력 단계에서부터 비어 있는 데이터를 보내고 있다는 점을 확인했습니다.",
          "UE5 내부 오디오 레이어와 OS 장치 식별 방식이 다르다는 백그라운드를 다시 확인했습니다.",
          "그래서 디바이스 이름을 더 정확히 넘기는 방향이 아니라, OS 기본 장치를 사용해 초기화를 안정화하는 쪽으로 방향을 바꿨습니다.",
        ],
        solution:
          "CreateVoiceCapture에 빈 문자열을 전달해 OS 기본 입력 장치를 사용하도록 바꾸고, 캡처 파이프라인을 정상 초기화했습니다.",
        decision:
          "특정 장치 이름을 더 정교하게 매핑하는 것보다 OS 기본 장치를 안정적으로 사용하는 편이 구현 복잡도와 유지보수 측면에서 더 낫다고 판단했습니다.",
        result: "캡처 초기화 실패를 해결해 실제 음성 데이터가 송수신되는 상태로 복구했습니다.",
      },
      {
        title: "백그라운드 복귀 후 오래된 음성이 한꺼번에 재생되는 문제",
        problem:
          "사용자 체감상은 지지직거림이었지만, 실제 원인은 백그라운드 동안 캡처 버퍼와 코덱 상태에 오래된 PCM이 누적되는 것이었습니다. 복귀 직후 이를 한꺼번에 처리하면서 타임라인이 무너졌습니다.",
        unexpected:
          "처음에는 재생 파라미터나 HRTF 품질 문제처럼 보였지만, 실제로는 복귀 시점에 오래된 오디오 상태가 한꺼번에 흘러나오는 구조가 문제였습니다.",
        background:
          "실시간 오디오는 최신 데이터가 더 중요합니다. 오래된 PCM이 버퍼와 코덱 상태에 남아 있으면 복귀 직후 시간축 자체가 틀어집니다.",
        process: [
          "단순 오디오 품질 조정보다 먼저, 포커스가 없는 동안에도 입력 버퍼가 계속 쌓이는지 확인했습니다.",
          "보이스 문제를 네트워크 지연으로만 보면 해결되지 않고, 캡처와 코덱 상태까지 함께 봐야 한다는 점을 확인했습니다.",
          "그래서 복귀 시 더 잘 재생하는 방향이 아니라, 오래된 데이터를 과감히 버리고 실시간성만 유지하는 쪽이 더 적절하다고 판단했습니다.",
        ],
        solution:
          "포커스가 없을 때 누적 캡처 데이터를 비우고 코덱 상태를 초기화해, 복귀 후에는 새 음성만 처리하도록 만들었습니다.",
        decision:
          "오래된 데이터를 최대한 살리는 것보다, 실시간성 유지를 위해 과감히 버리는 쪽이 사용자 체감 품질에 더 유리하다고 판단했습니다.",
        result: "백그라운드 복귀 직후 깨짐과 지연 누적 현상을 줄였습니다.",
      },
      {
        title: "생사 상태별 청취 규칙이 보이스 파이프라인에 섞이는 문제",
        problem:
          "처음에는 수신 조건에 if/else를 계속 덧붙이면 될 것 같았지만, 생사 상태와 관전 규칙이 늘어나자 보이스 재생 로직 전체가 규칙 변경에 흔들리기 시작했습니다.",
        process: [
          "지연 문제와 규칙 문제를 같은 파일에서 같이 다루면서 변경 비용이 빠르게 커진다는 점을 확인했습니다.",
          "산 사람, 죽은 사람, 관전 대상이라는 개념이 조건문으로만 존재하면 규칙 변경이 곧 파이프라인 변경이 된다는 것이 문제였습니다.",
          "그래서 규칙을 전략 객체로 끌어내 파이프라인과 게임 규칙을 분리하는 방향이 더 적절하다고 판단했습니다.",
        ],
        solution:
          "청취 가능 여부를 전략으로 분리해, 보이스 파이프라인은 그대로 두고 게임 규칙만 교체할 수 있게 했습니다.",
        result: "규칙 추가 시 기존 전송·재생 경로 수정 범위를 줄였습니다.",
      },
    ],
    techChoice: [
      {
        tech: "UDP",
        feature: "음성처럼 지연이 가장 중요한 데이터에 적합한 전송 경로",
        advantage: "패킷 하나의 지연이 전체 스트림을 막지 않습니다.",
        comparison: "TCP보다 손실 처리를 직접 고려해야 합니다.",
        decision: "음성 경로는 완전한 전달보다 짧은 지연이 중요해 UDP를 선택했습니다.",
      },
      {
        tech: "Opus",
        feature: "20ms 프레임, 24kbps, FEC/DTX 설정을 적용할 수 있는 저지연 음성 코덱",
        advantage: "20ms 프레임, 24kbps, FEC/DTX 설정으로 실시간 음성에 맞는 전송 크기를 구성했습니다.",
        comparison: "RAW PCM보다 구현은 복잡하지만 패킷 크기와 손실 대응 측면에서 유리했습니다.",
        decision: "대역폭과 지연의 균형을 맞추기 위해 Opus를 사용했습니다.",
      },
      {
        tech: "Voice Server Worker Queue",
        feature: "roomCode를 기준으로 보이스 패킷을 워커 큐에 분리하는 구조",
        advantage: "방 단위로 처리 간섭을 줄이고 병목 지점을 보기 쉬웠습니다.",
        comparison: "단일 큐보다 구조는 복잡하지만 방 단위 확장에 유리했습니다.",
        decision: "roomCode 기준으로 보이스 패킷 처리 흐름을 나누기 위해 사용했습니다.",
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
    id: "sticker",
    num: "04",
    title: "STICKER",
    subtitle: "긴 AI 추천 작업의 커밋 이후 발행, 중복 방어, 실패 분류 기준을 정리한 비동기 백엔드 서비스",
    period: "2026.04 - 2026.05",
    team: "6인",
    role: "추천 파이프라인 담당 · 비동기 추천 파이프라인 · 정합성/인증 정책",
    stack: ["Spring Boot", "AWS SQS", "Redis", "Async Pipeline"],
    cover: "/Sticker.png",
    highlights: [
      "SQS와 afterCommit으로 긴 AI 작업과 API 응답 경계 분리",
      "중복 실행, 중복 저장, 재시도 기준을 운영 정책으로 방어",
      "커밋 이후 발행, 실패 분류, 결과 반영 기준을 분리해 정합성 유지",
    ],
    implementations: [
      {
        title: "SQS 기반 비동기 추천 파이프라인",
        items: [
          "AI 추천처럼 오래 걸리는 작업을 앱 응답 경로에 붙이지 않고, 큐 중심 비동기 파이프라인으로 분리했습니다.",
          "Spring Boot API는 요청 검증, 큐 적재, 결과 검증과 저장 기준에 집중하고, AI 서버는 추천 생성을 담당하도록 경계를 나눴습니다.",
          "핵심은 기능 나열보다 긴 작업을 앱 응답, 결과 저장, 후속 처리와 분리해 백엔드 구조로 통제하는 것이었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Async Recommendation Flow",
          content: [
            { id: "app", name: "App", desc: "추천 요청 생성" },
            { id: "api-ingest", name: "Spring API", desc: "검증 후 SQS 작업 적재" },
            { id: "ai", name: "AI Server", desc: "추천 생성 후 결과 응답" },
            { id: "api-save", name: "Spring API", desc: "결과 검증 후 저장" },
          ],
        },
      },
      {
        title: "중복 실행 방어와 결과 중복 반영 방지",
        items: [
          "Redis 락과 결과 dedup을 함께 사용해 같은 날짜의 추천 작업이 중복 실행되거나 중복 저장되는 상황을 방어했습니다.",
          "커밋 이후에만 외부 작업이 시작되도록 해, 사용자에게 보이는 상태와 DB 상태가 어긋나지 않게 했습니다.",
          "Redis 락은 1차 방어선으로 두고, 결과 저장 단계에서는 jobId와 날짜 기준으로 한 번 더 중복 반영을 막았습니다.",
        ],
        snippet: {
          lang: "java",
          label: "Redis Distributed Lock",
          code: `public boolean tryLock(UUID userId, LocalDate date, String jobId, Duration ttl) {
    String key = "ai:daily-rec:lock:" + userId + ":" + date;
    Boolean locked = redisTemplate.opsForValue().setIfAbsent(key, jobId, ttl);
    return Boolean.TRUE.equals(locked);
}`,
          note: "Redis 락은 1차 방어선이며, 최종 저장 단계에서 jobId/date 기준으로 다시 중복 확인했습니다.",
        },
      },
      {
        title: "실패 분류와 토큰 정책 정리",
        items: [
          "Redis 캐시, 토큰 정책, 실패 로그를 분리해 긴 작업의 실패 원인과 재처리 여부를 추적할 수 있도록 정리했습니다.",
          "재시도해도 성공하지 않는 메시지와 일시 장애 메시지를 같은 방식으로 다루지 않도록 실패 분류 기준을 나눴습니다.",
          "핵심은 운영 기능을 많이 붙이는 것이 아니라, 긴 작업의 실패 원인과 재처리 경로를 구분해두는 것이었습니다.",
        ],
        snippet: {
          type: "table",
          label: "운영 정책 예시",
          headers: ["주제", "정책", "의도"],
          rows: [
            ["Result Dedup", "jobId/date 기준 TTL", "중복 소비 차단"],
            ["Queue Error", "삭제/재처리 분리", "실패 유형별 처리"],
            ["Token Rotation", "기존 토큰 즉시 폐기", "탈취 피해 최소화"],
          ],
        },
      },
    ],
    problems: [
      {
        title: "DB 커밋 전 메시지 발행으로 정합성이 깨지는 문제",
        problem:
          "처음에는 SQS만 붙이면 비동기 처리가 끝날 줄 알았지만, 실제로는 DB가 롤백되거나 커밋 전 메시지가 소비되면 존재하지 않는 상태를 참조하게 되는 것이 더 큰 문제였습니다. 비동기화 자체보다 커밋 이전 상태 노출을 막는 것이 핵심이었습니다.",
        unexpected:
          "처음에는 큐 적재만 성공하면 된다고 생각했지만, 실제로는 메시지가 너무 빨리 소비되는 것이 정합성을 더 크게 흔들었습니다.",
        background:
          "비동기 시스템에서는 작업을 분리하는 것만으로 충분하지 않고, 저장 상태와 후속 작업 시작 시점이 같은 순서를 따라야 합니다.",
        process: [
          "문제를 큐 소비 실패가 아니라 저장 상태와 외부 작업 시작 시점의 불일치로 다시 정의했습니다.",
          "AI 서버가 보는 데이터 기준은 메시지가 아니라 결국 DB 상태라는 점을 확인했습니다.",
          "그래서 메시지 브로커 선택보다 먼저, 커밋 이후에만 외부 작업이 시작되게 만드는 것이 필요하다고 판단했습니다.",
        ],
        solution:
          "afterCommit 훅에 메시지 발행을 등록해, DB 커밋이 끝난 뒤에만 SQS로 작업이 나가도록 변경했습니다.",
        decision: "",
        result: "커밋되지 않은 상태가 외부 작업에 노출되어 AI 작업이 DB에 없는 추천 요청을 참조하는 상황을 줄였습니다.",
      },
      {
        title: "재처리해도 성공하지 않는 메시지와 일시 장애를 구분해야 하는 문제",
        problem:
          "실패 메시지를 무조건 재시도하면 계약이 잘못된 메시지, 즉 poison pill이 큐를 계속 점유하고, 무조건 삭제하면 일시 장애에서 복구할 기회를 잃습니다. 예상보다 핵심은 소비 로직보다 실패 분류 정책이었습니다.",
        unexpected:
          "처음에는 재시도 전략 하나로 정리할 수 있을 것 같았지만, 실제로는 실패의 종류를 나누지 않으면 운영 품질이 바로 무너졌습니다.",
        background:
          "계약 위반 메시지는 시간이 지나도 성공하지 않지만, DB 연결 문제처럼 일시 장애는 시간이 지나면 복구될 수 있습니다. 둘을 같은 큐 정책으로 다루면 손실이나 무한 반복이 생깁니다.",
        process: [
          "모든 실패를 하나의 에러로 취급할수록 소비기는 단순해지지만 운영 품질은 오히려 악화된다는 점을 확인했습니다.",
          "재시도해도 성공하지 않는 메시지와 시간이 지나면 성공할 수 있는 메시지는 운영 의미가 다르다는 점을 분리했습니다.",
          "그래서 예외를 기술 분류가 아니라 운영 정책 분류로 다시 나누는 방향을 택했습니다.",
        ],
        solution:
          "계약 위반 메시지는 실패 로그를 남긴 뒤 재처리 대상에서 제외하고, DB나 네트워크 같은 일시 장애는 메시지를 삭제하지 않아 visibility timeout 이후 다시 처리되도록 분리했습니다.",
        decision: "",
        result: "재시도해도 성공하지 않는 메시지가 반복 재처리되는 상황을 줄이고, 일시 장애 메시지는 재처리 기회를 유지했습니다.",
      },
      {
        title: "리프레시 토큰 재사용을 탐지해야 하는 문제",
        problem:
          "토큰이 탈취된 뒤에도 서버가 기존 토큰과 새 토큰을 함께 유효하게 두면, 공격자는 조용히 세션을 계속 유지할 수 있습니다. 로그인 성공 여부보다 탈취 이후 피해 범위를 얼마나 빨리 줄이느냐가 더 중요했습니다.",
        process: [
          "만료 시간만 보는 방식으로는 이미 탈취된 토큰의 재사용을 구분할 수 없다는 점을 먼저 확인했습니다.",
          "토큰 저장소가 단순 캐시가 아니라 재사용 탐지의 근거가 되어야 한다는 관점으로 문제를 다시 봤습니다.",
          "그래서 새 토큰 발급보다 먼저 기존 토큰을 즉시 무효화하고, 재사용 시 전체 세션을 끊는 정책이 필요하다고 판단했습니다.",
        ],
        solution:
          "Refresh Token Rotation을 적용해 기존 토큰을 즉시 폐기하고, 저장소에 없는 토큰 재사용이 감지되면 해당 사용자 세션을 전체 무효화했습니다.",
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
        feature: "긴 AI 작업을 앱 응답 경로에서 분리하기 좋은 관리형 큐",
        advantage: "추천 생성이 오래 걸려도 앱 요청을 막지 않고, 재시도와 적재를 운영 정책으로 다룰 수 있었습니다.",
        comparison: "Kafka 같은 스트리밍 인프라보다 프로젝트 기간 안에서 운영 부담을 줄이며 핵심 정합성 문제에 집중하기 좋았습니다.",
        decision: "추천 생성이 오래 걸려도 API 응답 경로를 막지 않도록 SQS로 작업을 분리했습니다. 큐 도입 자체보다 메시지가 DB 커밋 이후에만 발행되고, 중복 소비 가능성을 전제로 결과 반영 단계에서 한 번 더 중복 여부를 확인하도록 만드는 데 초점을 맞췄습니다.",
      },
      {
        tech: "Transaction Boundary",
        feature: "DB 저장과 외부 메시지 발행의 선후관계를 분리하는 기준",
        advantage: "커밋 전 메시지 소비로 인해 외부 작업이 아직 저장되지 않은 추천 요청을 참조하는 문제를 막을 수 있었습니다.",
        comparison: "메시지 브로커만 바꾸거나 재시도 정책만 손보는 것보다, 외부 작업 시작 시점을 트랜잭션 이후로 미루는 편이 현재 문제에 더 직접적인 해결이었습니다.",
        decision: "DB 저장과 외부 메시지 발행은 서로 다른 시스템에 걸친 작업이기 때문에, 트랜잭션 커밋 이후 SQS 메시지를 발행하도록 분리했습니다.",
      },
      {
        tech: "Redis Dedup / Idempotency",
        feature: "중복 실행과 중복 저장을 줄이기 위한 1차 방어선",
        advantage: "SQS의 중복 소비 가능성을 전제로 두고, 같은 사용자·같은 날짜 작업의 중복 실행을 줄이며 결과 반영도 한 번 더 점검할 수 있었습니다.",
        comparison: "DB 저장 전 단계에서도 중복 실행을 줄이기 위해, Redis 락과 jobId 기반 dedup을 함께 두는 편이 운영 비용과 정합성 균형이 좋았습니다.",
        decision: "Redis는 최종 정합성을 단독으로 보장하는 장치라기보다 중복 작업을 줄이는 운영 경계로 두고, 결과 저장 단계에서도 jobId 기준으로 한 번 더 dedup을 걸었습니다.",
      },
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "AI 서비스에서 먼저 중요한 것은 모델이 아니라 긴 작업을 분리하고, 실패와 중복을 추적 가능한 정책으로 다루는 백엔드 구조라는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "운영 경계는 잘 정리했지만, 큐 처리 시간, 중복 차단 횟수, 재시도 횟수 같은 운영 지표를 더 분명한 수치로 남기지 못한 점은 다음 단계의 과제로 남습니다.",
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
