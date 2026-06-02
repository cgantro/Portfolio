import { projectDetailPages } from "./projectDetailPages";

const baseProjects = [
  {
    id: "robotpal",
    num: "01",
    title: "RobotPal",
    subtitle: "JETANK 후배들을 위한 시뮬레이션 · 연동 플랫폼",
    period: "2025.11 – 2025.12",
    team: "2인",
    role: "시뮬레이션 런타임, 스트리밍 경로, 웹 빌드 대응",
    stack: ["C++17", "OpenGL", "Emscripten", "libjpeg-turbo", "TCP/WebSocket", "CMake"],
    cover: "/project-robotpal-cover.png",
    highlights: [
      "JETANK 후속 실험을 위한 공통 플랫폼 구성",
      "렌더, 캡처, 인코딩, 전송 파이프라인 분리",
      "데스크톱과 웹을 함께 가져가는 크로스플랫폼 구조",
    ],
    implementations: [
      {
        title: "시뮬레이터 중심 제어 런타임",
        items: [
          "JETANK 로봇팔의 반복 실험을 위한 가상 환경을 구성하고, 움직임 검증이 가능한 시뮬레이션 루프를 설계했습니다.",
          "현실 장비 의존도를 낮추는 것이 목표였기 때문에, 실험 시나리오를 빠르게 바꿀 수 있는 구조에 집중했습니다.",
          "데스크톱 실행과 웹 배포를 모두 고려해 코어 로직을 C++ 중심으로 유지했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "RobotPal 런타임 구성",
          content: [
            { id: "sim", name: "Simulation Loop", desc: "로봇팔 상태 계산 및 렌더링" },
            { id: "capture", name: "Frame Capture", desc: "스트리밍용 프레임 추출" },
            { id: "delivery", name: "Desktop / Web", desc: "플랫폼별 출력 경로 분리" }
          ]
        }
      },
      {
        title: "실시간 스트리밍 파이프라인",
        items: [
          "프레임 생성, JPEG 인코딩, 네트워크 전송을 큐 기반 단계로 나눠 한 단계의 지연이 전체 루프를 막지 않게 했습니다.",
          "데스크톱 클라이언트와 브라우저 클라이언트를 모두 고려해 TCP와 WebSocket 전달 경로를 함께 유지했습니다.",
          "libjpeg-turbo 기반 병렬 인코딩 실험으로 프레임 처리량을 비교하고 워커 수를 조정했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "Render -> Encode -> Send",
          content: [
            { id: "render", name: "Render", desc: "시뮬레이터가 프레임 생성" },
            { id: "encode", name: "JPEG Encode", desc: "워커가 병렬 압축" },
            { id: "send", name: "Network Delivery", desc: "TCP / WebSocket 송신" }
          ]
        }
      },
      {
        title: "웹 배포 대응",
        items: [
          "Emscripten 빌드 경로를 별도로 두고 브라우저에서 실행 가능한 WebAssembly 결과물을 유지했습니다.",
          "브라우저 멀티스레드 제약을 풀기 위해 COOP/COEP 대응과 Service Worker 기반 헤더 주입을 적용했습니다.",
          "동일한 C++ 코어를 유지하면서 데스크톱과 웹을 함께 운영하는 방향으로 정리했습니다.",
        ],
        snippet: {
          lang: "javascript",
          label: "COI Service Worker 헤더 주입",
          code: `self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      const headers = new Headers(response.headers);
      headers.set("Cross-Origin-Embedder-Policy", "require-corp");
      headers.set("Cross-Origin-Opener-Policy", "same-origin");
      return new Response(response.body, { status: response.status, headers });
    })
  );
});`
        }
      }
    ],
    problems: [
      {
        title: "glReadPixels로 인한 렌더 루프 정지",
        problem:
          "렌더링된 프레임을 스트리밍으로 보내기 위해 픽셀 데이터를 읽어올 때 CPU가 GPU 완료를 기다리며 멈추는 구간이 생겼습니다.",
        process: [
          "먼저 프레임 캡처 지점에서 메인 루프가 끊기는 구간을 분리해서 봤습니다.",
          "동기식 readback이 GPU 완료를 기다리게 만들고 있다는 점을 확인했습니다.",
          "readback 시점을 현재 프레임이 아니라 이전 프레임 버퍼로 밀어내는 구조가 필요했습니다.",
        ],
        solution:
          "README와 구현 노트에 맞춰 PBO 더블 버퍼 ping-pong 구조를 적용했습니다. 현재 프레임은 GPU가 버퍼에 쓰고, CPU는 이전 프레임 버퍼를 읽도록 분리했습니다.",
        result: "CPU-GPU 동기화 압력을 줄이고 프레임 스톨 빈도를 낮췄습니다.",
        snippet: {
          type: "visual",
          label: "PBO Ping-Pong Readback",
          content: [
            { id: "gpu-write", name: "GPU Write", desc: "이번 프레임을 write buffer에 기록" },
            { id: "cpu-read", name: "CPU Read", desc: "이전 프레임을 read buffer에서 복사" },
            { id: "swap", name: "Swap", desc: "프레임마다 read/write 인덱스 교체" }
          ]
        }
      },
      {
        title: "인코딩과 전송이 같은 속도로 묶인 문제",
        problem:
          "프레임 인코딩과 소켓 전송이 서로 같은 타이밍에 묶이면, 큰 프레임 하나가 뒤따르는 프레임의 지연을 연쇄적으로 키웠습니다.",
        process: [
          "한 프레임 처리 시간이 길어질 때 뒤 프레임까지 연쇄 지연되는 구간을 먼저 확인했습니다.",
          "압축과 송신을 같은 리듬으로 돌리는 구조가 병목을 전체 루프로 전파하고 있었습니다.",
          "그래서 생성, 인코딩, 전송을 단계별 큐로 끊어 각 단계의 속도 차이를 흡수하도록 바꿨습니다.",
        ],
        solution:
          "생성자-소비자 구조로 인코딩 단계와 전송 단계를 분리하고 큐로 속도 차이를 흡수했습니다.",
        result: "스트리밍 지연 누적을 줄이고 전달 경로를 디버깅하기 쉬운 구조로 만들었습니다.",
        snippet: {
          type: "visual",
          label: "Queue 기반 단계 분리",
          content: [
            { id: "enc", name: "Encode Worker", desc: "압축 처리 전담" },
            { id: "queue", name: "Concurrent Queue", desc: "단계 간 버퍼링" },
            { id: "tx", name: "Send Worker", desc: "소켓 송신 전담" }
          ]
        }
      },
      {
        title: "브라우저 멀티스레드가 바로 동작하지 않는 문제",
        problem:
          "웹 빌드에서는 SharedArrayBuffer와 Cross-Origin Isolation 제약 때문에 데스크톱과 같은 멀티스레드 구성이 바로 실행되지 않았습니다.",
        process: [
          "Emscripten pthreads가 브라우저에서 막히는 원인을 실행 환경 조건부터 다시 확인했습니다.",
          "문제는 코드보다도 COOP/COEP 헤더가 빠져 SharedArrayBuffer 조건을 만족하지 못하는 데 있었습니다.",
          "배포 환경에서 헤더를 안정적으로 주입할 수 있는 Service Worker 경로를 선택했습니다.",
        ],
        solution:
          "COI Service Worker를 추가해 필요한 헤더를 강제 주입하고, Emscripten pthreads 실행 조건을 맞췄습니다.",
        result: "웹 배포에서도 멀티스레드 인코딩 실험을 이어갈 수 있는 기반을 만들었습니다.",
        snippet: {
          type: "visual",
          label: "Web Thread Enablement",
          content: [
            { id: "static", name: "Static Assets", desc: "기본 응답만 제공" },
            { id: "coi", name: "COI Service Worker", desc: "COOP / COEP 헤더 삽입" },
            { id: "wasm", name: "WASM Threads", desc: "SharedArrayBuffer 활성화" }
          ]
        }
      }
    ],
    techChoice: [
      {
        tech: "C++17",
        feature: "저수준 메모리 제어와 플랫폼별 빌드 대응이 쉬운 네이티브 언어",
        advantage: "렌더 루프, readback, 인코딩 경로를 한 코드베이스에서 직접 제어하기 좋았습니다.",
        comparison: "Python이나 엔진 스크립트 계층보다 프레임 파이프라인 제어와 Emscripten 연계가 더 직접적이었습니다.",
        decision: "시뮬레이터 코어와 웹 빌드를 함께 가져가야 해서 구현 난이도 대비 가장 현실적인 선택이었습니다.",
      },
      {
        tech: "Emscripten",
        feature: "C++ 코드를 WebAssembly로 옮길 수 있는 툴체인",
        advantage: "데스크톱용 코어를 크게 갈아엎지 않고 브라우저 실행 경로를 만들 수 있었습니다.",
        comparison: "웹 전용으로 다시 구현하는 방식보다 실험 속도가 빨랐고, 동일 로직 검증에도 유리했습니다.",
        decision: "후배들이 설치 없이 바로 확인할 수 있는 경로가 필요해서 다시 구현보다 Emscripten 경로를 택했습니다.",
      },
      {
        tech: "libjpeg-turbo",
        feature: "JPEG 인코딩 성능에 강점이 있는 경량 라이브러리",
        advantage: "프레임 압축 비용을 직접 비교하면서 워커 분리 실험을 하기 좋았습니다.",
        comparison: "영상 전체 파이프라인이 큰 라이브러리보다 현재 프로젝트 범위에 필요한 JPEG 압축만 가볍게 붙일 수 있었습니다.",
        decision: "프로토타입 단계에서 의존성을 크게 늘리지 않고 인코딩 병목을 확인하는 데 적합했습니다.",
      },
      {
        tech: "TCP / WebSocket",
        feature: "데스크톱 소켓과 브라우저 전송 경로를 각각 단순하게 붙이기 쉬운 조합",
        advantage: "신뢰성 있는 전달과 빠른 디버깅이 쉬웠고, 브라우저 클라이언트도 바로 대응할 수 있었습니다.",
        comparison: "UDP가 최신 프레임 우선 전달에는 더 맞을 수 있었지만, 이 단계에서는 전송 제어와 디버깅 난도가 더 높았습니다.",
        decision: "실험 초기에는 구현 속도와 관찰 가능성이 더 중요해서 TCP/WebSocket으로 먼저 고정했습니다.",
      },
      {
        tech: "OpenGL",
        feature: "렌더링과 픽셀 readback 경로를 직접 제어할 수 있는 그래픽 API",
        advantage: "PBO, glReadPixels 같은 병목 지점을 직접 건드리며 실험할 수 있었습니다.",
        comparison: "엔진 기반 추상화보다 프레임 캡처와 readback 병목을 더 직접적으로 확인할 수 있었습니다.",
        decision: "이번 프로젝트는 장면 제작보다 파이프라인 제어가 중요해서 OpenGL이 더 맞았습니다.",
      }
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "성능 문제는 한 함수 최적화보다 렌더, readback, 인코딩, 전송 경계를 다시 자를 때 더 잘 풀린다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "전송 프로토콜과 벤치마크 자동화를 더 밀어붙이지 못해 최신 프레임 우선 전달 비교까지는 남기지 못했습니다.",
      }
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
    subtitle: "공항 스마트 토잉카 관제 시스템",
    period: "2026.01 – 2026.02",
    team: "6인",
    role: "백엔드 관제 연동, 경로 제어, 실시간 통신 구조 정리",
    stack: ["Spring Boot", "React", "MQTT", "WebRTC", "A*", "Yen's Algorithm"],
    cover: "/project-autowing-cover.png",
    highlights: [
      "관제탑, 토잉카, 기장, 마샬러 시나리오 기반 설계",
      "명령 채널과 라이브 피드를 분리한 관제 구조",
      "경로 탐색과 재탐색을 포함한 공항 이동 시나리오 정리",
    ],
    implementations: [
      {
        title: "관제 명령 채널과 상태 전달",
        items: [
          "관제 화면과 백엔드에서 토잉카 상태, 미션 진행, 승인 흐름을 다룰 수 있도록 명령과 상태 이벤트 경로를 정리했습니다.",
          "소스 구조상 MQTT를 명령/상태 전달 채널로 사용해 차량과 서버 간 메시지 기반 제어를 구성했습니다.",
          "긴급 정지, 이동 승인, 수동 전환 같은 이벤트를 실시간 제어 흐름에 맞춰 나눴습니다.",
        ],
        snippet: {
          type: "visual",
          label: "관제 명령 채널",
          content: [
            { id: "tower", name: "Control Center", desc: "승인, 재탐색, 비상 명령" },
            { id: "backend", name: "Backend + MQTT", desc: "명령/상태 메시지 중계" },
            { id: "car", name: "Towing Car", desc: "주행 및 상태 보고" }
          ]
        }
      },
      {
        title: "경로 계획과 재탐색",
        items: [
          "백엔드 `MapService`에서 A*와 Yen's Algorithm 기반 경로 탐색 로직을 확인하고, 관제 시나리오에 맞는 우회 경로 구성을 정리했습니다.",
          "임베디드 경로 계획 디렉터리에는 grid A*와 trailer hybrid A* 구현이 있어, 차량 제약을 고려한 주행 계획 실험이 분리되어 있습니다.",
          "막힌 구간이 생기면 마지막 통과 노드를 기준으로 재탐색하는 흐름을 시나리오 문서와 맞춰 정리했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "경로 탐색 계층",
          content: [
            { id: "mission", name: "Mission Route", desc: "A* / Yen 기반 후보 계산" },
            { id: "block", name: "Blocked Segment", desc: "차단 구역 반영" },
            { id: "planner", name: "Vehicle Planner", desc: "Hybrid A* 계열 주행 계획" }
          ]
        }
      },
      {
        title: "현장 피드와 AI 보조",
        items: [
          "관제 화면은 WebRTC 라이브 피드를 통해 현장 영상을 확인하고, 명령 채널과는 분리된 경로로 시야를 확보합니다.",
          "저장소에는 `gesture_ai.py`, `docking_ai.py`가 포함되어 있어 마샬러 수신호와 도킹 보조 인식을 별도 AI 모듈로 다룹니다.",
          "수동/자동 전환과 AI 판단 신호를 관제 시나리오와 연결해 실제 운용 절차를 설명 가능한 구조로 만들었습니다.",
        ],
        snippet: {
          type: "visual",
          label: "명령과 피드 분리",
          content: [
            { id: "cmd", name: "MQTT Control", desc: "상태/명령 메시지" },
            { id: "video", name: "WebRTC Feed", desc: "현장 영상 확인" },
            { id: "ai", name: "AI Signals", desc: "도킹·수신호 인식" }
          ]
        }
      }
    ],
    problems: [
      {
        title: "제어 메시지와 영상 피드를 같은 경로로 다루기 어려운 문제",
        problem:
          "실시간 제어 명령은 작고 즉시 처리되어야 하지만, 영상 피드는 대역폭과 지연 특성이 전혀 다릅니다. 둘을 같은 성격으로 다루면 운영 포인트가 흐려집니다.",
        process: [
          "먼저 관제 화면에서 어떤 데이터가 즉시 반응해야 하는지와 어떤 데이터가 대역폭을 크게 쓰는지를 분리해서 봤습니다.",
          "명령과 영상이 한 흐름에 섞이면 장애 원인과 지연 특성을 같이 추적해야 해서 운영이 복잡해졌습니다.",
          "그래서 제어 경로와 시야 확보 경로를 아예 다른 채널로 분리하는 쪽으로 정리했습니다.",
        ],
        solution:
          "제어와 상태는 MQTT 메시지 경로로, 현장 영상은 WebRTC 피드로 나눠 각 채널의 책임을 분리했습니다.",
        result: "관제 지시와 현장 확인 흐름을 분리해 디버깅 포인트가 선명해졌습니다.",
        snippet: {
          type: "visual",
          label: "채널 책임 분리",
          content: [
            { id: "mqtt", name: "MQTT", desc: "명령 / 상태 / 이벤트" },
            { id: "webrtc", name: "WebRTC", desc: "실시간 현장 영상" }
          ]
        }
      },
      {
        title: "경로 차단 시 우회 기준점이 필요한 문제",
        problem:
          "활주로 일부가 막히면 현재 미션을 처음부터 다시 계산하는 것보다, 실제 차량 위치와 마지막 통과 노드를 기준으로 다시 계산해야 운영 흐름에 맞습니다.",
        process: [
          "처음부터 다시 경로를 계산하면 관제 화면 설명과 차량 실제 위치가 쉽게 어긋난다는 점을 먼저 확인했습니다.",
          "운영 시나리오 기준으로는 현재 위치와 마지막 통과 노드를 함께 기준점으로 삼아야 설명과 제어가 맞았습니다.",
          "그래서 차단 구간 반영 절차와 재탐색 시작점을 시나리오 문서와 같이 묶어 정리했습니다.",
        ],
        solution:
          "시나리오 문서 기준으로 차단 구간을 반영하고 마지막 통과 노드부터 목적지까지 재탐색하는 절차를 정리했습니다.",
        result: "관제 시나리오와 경로 계산 설명이 한 문맥으로 연결됐습니다.",
        snippet: {
          type: "visual",
          label: "재탐색 기준점",
          content: [
            { id: "current", name: "Current Position", desc: "현재 차량 위치 확인" },
            { id: "last", name: "Last Passed Node", desc: "재탐색 시작점" },
            { id: "new", name: "New Route", desc: "차단 구간 우회" }
          ]
        }
      },
      {
        title: "출발 조건이 사람과 AI 신호에 따라 달라지는 문제",
        problem:
          "마샬러가 있는 경우와 없는 경우, 그리고 긴급 정지 후 복귀 흐름은 출발 조건이 서로 다릅니다.",
        process: [
          "출발 조건을 하나의 규칙으로 뭉치면 실제 운영 절차를 설명할 때 예외가 계속 생겼습니다.",
          "기장 승인, 수신호, 비상 개입은 트리거도 다르고 해제 조건도 달랐습니다.",
          "그래서 상황별 분기를 따로 나누고 상태 전이 표로 정리하는 쪽이 더 맞았습니다.",
        ],
        solution:
          "기장 승인, 마샬러 수신호, 비상 운전수 개입을 시나리오 단위로 나눠 상태 전이 관점에서 설명 가능한 구조로 정리했습니다.",
        result: "운영 절차 설명과 시스템 책임 분리가 쉬워졌습니다.",
        snippet: {
          type: "table",
          label: "출발 조건 분기",
          headers: ["상황", "트리거", "동작"],
          rows: [
            ["마샬러 있음", "출발 수신호 인식", "토잉카 출발"],
            ["마샬러 없음", "기장 이동 승인", "토잉카 출발"],
            ["비상 상황 후", "수동 해제 + 재승인", "주행 재개"]
          ]
        }
      }
    ],
    techChoice: [
      {
        tech: "MQTT",
        feature: "경량 publish/subscribe 기반 메시지 프로토콜",
        advantage: "차량별 명령과 상태 이벤트를 토픽 단위로 나누기 쉬웠습니다.",
        comparison: "HTTP polling보다 실시간 상태 반영이 자연스럽고, WebRTC처럼 영상까지 같이 책임지지 않아 제어 채널에 집중할 수 있었습니다.",
        decision: "차량 제어와 상태 전달을 빠르게 묶어야 했고, 운영 흐름 설명도 명확해서 MQTT를 택했습니다.",
      },
      {
        tech: "WebRTC",
        feature: "저지연 실시간 미디어 전달에 맞는 브라우저 친화적 프로토콜 스택",
        advantage: "관제 화면에서 현장 영상을 지연을 줄여 확인할 수 있었습니다.",
        comparison: "MJPEG나 일반 HTTP 스트리밍보다 실시간 확인 목적에 더 맞았고, MQTT보다 영상 전송 책임이 분명했습니다.",
        decision: "영상은 명령과 다른 지연 특성을 가져서 별도 채널이 필요했고, 브라우저 관제 화면과도 잘 맞았습니다.",
      },
      {
        tech: "A* / Yen's Algorithm",
        feature: "최단 경로 계산과 대안 경로 후보 생성을 다루기 쉬운 조합",
        advantage: "기본 경로와 우회 후보를 함께 설명할 수 있어 관제 시나리오와 잘 맞았습니다.",
        comparison: "단일 최단 경로만 보는 방식보다 차단 구간 대응 설명이 쉬웠습니다.",
        decision: "운영 절차상 우회 후보를 설명해야 해서 단순 A* 하나보다 A*와 Yen 조합이 더 적합했습니다.",
      },
      {
        tech: "Hybrid A* 계열 플래너",
        feature: "차량의 회전 반경과 연결 제약을 고려한 주행 계획 방식",
        advantage: "토잉카와 트레일러 제약을 단순 격자 경로보다 더 현실적으로 반영할 수 있습니다.",
        comparison: "일반 grid A*만으로는 차량 제약이 약했고, 온보드 계층에서는 더 구체적인 주행 계획이 필요했습니다.",
        decision: "백엔드 미션 경로와 차량 로컬 플래너의 역할을 나누기 위해 선택했습니다.",
      },
      {
        tech: "React + Vite",
        feature: "빠른 개발 서버와 컴포넌트 단위 UI 반복이 쉬운 프론트 조합",
        advantage: "관제 패널과 실시간 상태 UI를 빠르게 수정하며 흐름을 검증할 수 있었습니다.",
        comparison: "SSR이나 무거운 설정 대신, 이번 프로젝트에는 빠른 시나리오 반복이 더 중요했습니다.",
        decision: "관제 화면은 빠른 반복과 mock 연동이 핵심이라 구현 속도가 빠른 조합을 택했습니다.",
      }
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "관제 시스템은 알고리즘보다도 상태 전이와 채널 책임을 먼저 분리해야 설명과 구현이 같이 정리된다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "실주행 텔레메트리와 상태 머신을 끝까지 같은 계약으로 묶지 못해 mock 기반 설명이 일부 남았습니다.",
      }
    ],
    links: {},
  },
  {
    id: "mausoleum",
    num: "03",
    title: "영묘 (Mausoleum)",
    subtitle: "UE5 멀티플레이 게임과 C++ 보이스 서버",
    period: "2026.02 – 2026.03",
    team: "6인",
    role: "보이스 채팅 클라이언트·서버, 게임 서버 구조 개선",
    stack: ["Unreal Engine 5", "C++", "uWebSockets", "UDP", "Opus", "Protobuf"],
    cover: "/project-mausoleum-cover.png",
    highlights: [
      "UE5 클라이언트와 별도 C++ 음성 서버 분리",
      "UDP + Opus 기반 실시간 보이스 채팅 처리",
      "페이즈 시스템과 상태 전략 정리",
    ],
    implementations: [
      {
        title: "UE5 보이스 클라이언트",
        items: [
          "클라이언트 소스에는 캡처, 코덱, 네트워크, 재생, 프로파일링, 전략 계층이 분리되어 있어 보이스 흐름의 책임이 비교적 명확합니다.",
          "마이크 캡처부터 인코딩, UDP 전송, 수신 재생까지 런타임 경로를 UE5 C++ 안에서 직접 제어했습니다.",
          "상태에 따라 들을 수 있는 대상을 바꾸는 전략 계층으로 게임 규칙을 음성 로직과 연결했습니다.",
        ],
        snippet: {
          type: "visual",
          label: "UE5 보이스 클라이언트 흐름",
          content: [
            { id: "capture", name: "Capture", desc: "마이크 입력 수집" },
            { id: "codec", name: "Opus Codec", desc: "실시간 인코딩 / 디코딩" },
            { id: "network", name: "UDP Network", desc: "보이스 패킷 송수신" }
          ]
        }
      },
      {
        title: "별도 C++ 보이스 / 로비 서버",
        items: [
          "서버 README 기준으로 로비는 WebSocket, 보이스는 UDP + Protobuf 경로로 분리되어 있습니다.",
          "uWebSockets, protobuf, JSON 파싱 의존성을 기준으로 룸/세션과 음성 중계 책임을 나눴습니다.",
          "게임 로직과 음성 전송 요구사항이 다른 만큼 서버 경로를 나눠 다룬 점이 핵심입니다.",
        ],
        snippet: {
          type: "visual",
          label: "게임 서버와 보이스 서버 역할 분리",
          content: [
            { id: "lobby", name: "WebSocket Lobby", desc: "방 입장 및 상태 동기화" },
            { id: "voice", name: "UDP Voice", desc: "실시간 음성 중계" },
            { id: "room", name: "Room Logic", desc: "플레이어 세션 관리" }
          ]
        }
      },
      {
        title: "게임 규칙과 페이즈 관리",
        items: [
          "플레이어 생존 상태에 따라 청취 규칙을 나누는 전략 패턴을 적용해 규칙 분기를 객체 구조로 정리했습니다.",
          "페이즈 매니저와 서버 페이즈 구조를 기준으로 게임 진행 상태 전환 책임을 중앙화했습니다.",
          "타이머와 상호작용 이벤트가 섞이는 구간을 줄이기 위해 게임 규칙 단위를 분리해 접근했습니다.",
        ],
        snippet: {
          type: "table",
          label: "상태별 청취 규칙",
          headers: ["상태", "청취 대상", "처리 방식"],
          rows: [
            ["생존자", "주변 생존자", "거리 및 상태 기반 제한"],
            ["사망자", "다른 영혼", "별도 규칙으로 허용"],
            ["특수 상황", "선별된 대상", "전략 구현체에서 결정"]
          ]
        }
      }
    ],
    problems: [
      {
        title: "게임 상태 동기화와 음성 전송의 요구사항 차이",
        problem:
          "게임 상태는 신뢰성과 구조화가 중요하고, 음성은 손실보다 지연이 더 중요합니다. 둘을 같은 채널 성격으로 취급하기 어렵습니다.",
        process: [
          "먼저 어떤 데이터가 늦으면 안 되고, 어떤 데이터는 일부 손실보다 구조 보존이 중요한지 나눠 봤습니다.",
          "게임 상태와 보이스를 같은 방식으로 보내면 한쪽 품질을 위해 다른 쪽이 손해를 보는 구조였습니다.",
          "그래서 로비/상태와 보이스를 서버 경로부터 분리하는 쪽으로 정리했습니다.",
        ],
        solution:
          "로비/상태 동기화는 WebSocket 경로, 음성은 UDP + Opus 경로로 분리해 각자의 목적에 맞게 처리했습니다.",
        result: "게임 규칙과 실시간 보이스의 운영 포인트를 따로 볼 수 있게 됐습니다.",
        snippet: {
          type: "visual",
          label: "서버 경로 분리",
          content: [
            { id: "sync", name: "Reliable Sync", desc: "WebSocket 기반 상태 동기화" },
            { id: "voice", name: "Low-latency Voice", desc: "UDP 기반 음성 전송" }
          ]
        }
      },
      {
        title: "생존/사망 상태에 따라 보이스 규칙이 달라지는 문제",
        problem:
          "게임 특성상 살아 있는 플레이어와 죽은 플레이어가 같은 음성 규칙을 쓰면 플레이 감각과 정보 흐름이 무너집니다.",
        process: [
          "조건문으로 청취 규칙을 계속 추가하면 상태가 늘어날수록 관리가 어려워졌습니다.",
          "생존자와 사망자는 규칙 자체가 다르기 때문에 단순 분기보다 구조 분리가 더 필요했습니다.",
          "그래서 청취 판정을 전략 인터페이스로 분리하고 상태별 구현체로 나눴습니다.",
        ],
        solution:
          "청취 전략을 인터페이스로 분리하고 상태별 구현체로 규칙을 나눴습니다.",
        result: "게임 디자인 요구사항을 코드 구조로 연결할 수 있었습니다.",
        snippet: {
          type: "visual",
          label: "전략 패턴 적용",
          content: [
            { id: "interface", name: "Listen Strategy", desc: "공통 판정 인터페이스" },
            { id: "alive", name: "Survivor Rule", desc: "생존자 청취 규칙" },
            { id: "dead", name: "Ghost Rule", desc: "사망자 청취 규칙" }
          ]
        }
      },
      {
        title: "게임 진행 전환을 시간 기반으로만 처리하기 어려운 문제",
        problem:
          "멀티플레이 환경에서는 일시정지, 이벤트 순서, 클라이언트 상태 차이 때문에 시간만으로 페이즈를 전환하면 흔들리는 구간이 생깁니다.",
        process: [
          "시간 기준 전환은 클라이언트 상태 차이나 이벤트 순서에 따라 엇갈릴 수 있다는 점을 먼저 확인했습니다.",
          "특정 이벤트가 확정돼야 넘어가는 구간은 타이머보다 명시적인 트리거가 더 적합했습니다.",
          "그래서 조각상 완료 같은 확정 이벤트를 중심으로 전환 책임을 모으는 방향으로 정리했습니다.",
        ],
        solution:
          "조각상 완료와 같은 확정 이벤트를 기준으로 페이즈 전환 책임을 중앙화하는 방향으로 정리했습니다.",
        result: "상태 전환 근거를 더 명확하게 만들었습니다.",
        snippet: {
          type: "table",
          label: "페이즈 전환 기준",
          headers: ["이전 방식", "개선 방향", "효과"],
          rows: [
            ["시간 중심", "확정 이벤트 중심", "전환 근거 명확화"],
            ["분산 판단", "매니저 중앙화", "디버깅 단순화"]
          ]
        }
      }
    ],
    techChoice: [
      {
        tech: "UDP",
        feature: "연결 지향 보장보다 낮은 지연 전달에 유리한 전송 방식",
        advantage: "보이스 채팅에서 대화 감각을 해치지 않도록 지연을 낮게 가져가기 좋았습니다.",
        comparison: "TCP는 재전송으로 구조는 안정적이지만, 음성에는 늦게 도착한 패킷의 가치가 낮았습니다.",
        decision: "보이스 품질에서 완전한 보존보다 지연 감소가 더 중요해서 UDP를 택했습니다.",
      },
      {
        tech: "Opus",
        feature: "실시간 통화에 적합한 저지연 오디오 코덱",
        advantage: "낮은 대역폭과 실시간 품질 사이 균형을 맞추기 좋았습니다.",
        comparison: "PCM처럼 무압축 전송하는 방식보다 네트워크 부담이 적고, 실시간 보이스 목적에 더 맞았습니다.",
        decision: "멀티플레이 환경에서 대역폭과 지연을 함께 고려해야 해서 Opus가 적합했습니다.",
      },
      {
        tech: "uWebSockets",
        feature: "C++ 환경에서 WebSocket 서버를 비교적 가볍게 구성할 수 있는 라이브러리",
        advantage: "로비와 상태 이벤트를 C++ 서버 코드와 같은 언어에서 다루기 쉬웠습니다.",
        comparison: "별도 런타임을 늘리는 것보다 현재 C++ 서버 구조와 더 자연스럽게 연결됐습니다.",
        decision: "서버 책임을 분리하되 구현 복잡도를 크게 늘리지 않기 위해 선택했습니다.",
      },
      {
        tech: "Protobuf",
        feature: "이진 메시지 구조를 명확하게 정의할 수 있는 직렬화 포맷",
        advantage: "보이스 패킷과 메타데이터 형식을 코드로 고정하기 좋았습니다.",
        comparison: "JSON보다 페이로드가 가볍고, 음성 데이터와 함께 보내는 메타 정보 정리가 쉬웠습니다.",
        decision: "패킷 구조를 명시적으로 유지하는 편이 C++ 서버/클라이언트 양쪽 관리에 유리했습니다.",
      },
      {
        tech: "Unreal Engine 5 C++",
        feature: "게임 로직과 저수준 오디오/네트워크 제어를 함께 다룰 수 있는 엔진 환경",
        advantage: "보이스 캡처, 재생, 상태 규칙을 엔진 내부 C++ 코드에서 직접 제어할 수 있었습니다.",
        comparison: "블루프린트만으로는 저수준 오디오 경로 제어와 구조 분리가 제한적이었습니다.",
        decision: "보이스 런타임을 세밀하게 다뤄야 해서 C++ 계층 비중을 높였습니다.",
      }
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "실시간 보이스와 게임 상태는 같은 실시간이라도 요구사항이 달라서 서버 경로부터 분리해야 한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "jitter buffer나 품질 지표 수집까지는 못 가서 보이스 체감 품질을 수치로 남기지 못했습니다.",
      }
    ],
    links: {},
  },
  {
    id: "sticker",
    num: "04",
    title: "STICKER",
    subtitle: "디지털 옷장과 AI 코디 추천 서비스",
    period: "2026.04 – 2026.05",
    team: "6인",
    role: "백엔드 전담, 비동기 추천 파이프라인, 운영/배포",
    stack: ["Spring Boot 3.5", "Java 21", "AWS SQS", "Redis", "FastAPI", "React Native"],
    cover: "/Sticker.png",
    highlights: [
      "옷장 데이터를 추천 가능한 자산으로 바꾸는 서비스 설계",
      "SQS 기반 AI 비동기 추천 파이프라인",
      "인증, 캐시, 모니터링, 배포까지 백엔드 운영 전담",
    ],
    implementations: [
      {
        title: "AI 추천 비동기 파이프라인",
        items: [
          "앱 요청과 AI 추천 생성을 직접 동기로 묶지 않고, SQS를 중심으로 백엔드와 AI 서버를 분리했습니다.",
          "일별 추천, 조정, 결과 처리를 큐 단위로 나눠 긴 작업이 사용자 응답을 막지 않도록 했습니다.",
          "Java 21 가상 스레드로 long polling 소비자를 운영해 대기 비용을 줄였습니다.",
        ],
        snippet: {
          type: "visual",
          label: "STICKER 추천 흐름",
          content: [
            { id: "app", name: "App", desc: "추천 요청 전송" },
            { id: "api", name: "Spring API", desc: "검증 후 큐 적재" },
            { id: "queue", name: "AWS SQS", desc: "비동기 작업 버퍼" },
            { id: "ai", name: "FastAPI AI", desc: "추천 / 조정 / 결과 생성" },
            { id: "result", name: "Save + Notify", desc: "결과 저장 및 알림" }
          ]
        }
      },
      {
        title: "중복 실행 방어와 인증 경계",
        items: [
          "같은 사용자와 날짜 조합의 추천이 동시에 여러 번 돌지 않도록 Redis 분산 락과 결과 dedup 키를 함께 사용했습니다.",
          "ACCESS, REFRESH, SOCKET 토큰을 분리해 REST, 재발급, WebSocket 경계를 명확히 나눴습니다.",
          "리프레시 토큰 재사용을 탈취 신호로 간주하는 회전 정책으로 세션 방어 로직을 구성했습니다.",
        ],
        snippet: {
          lang: "java",
          label: "Redis 분산 락 획득",
          code: `public boolean tryLock(UUID userId, LocalDate date, String jobId, Duration ttl) {
    String key = "ai:daily-rec:lock:" + userId + ":" + date;
    Boolean locked = redisTemplate.opsForValue().setIfAbsent(key, jobId, ttl);
    return Boolean.TRUE.equals(locked);
}`
        }
      },
      {
        title: "날씨 캐시와 운영 관측",
        items: [
          "기상청 발표 시각에 맞춰 TTL이 달라지는 날씨 캐시를 두고, 자주 바뀌는 사용자 데이터는 별도 단기 캐시로 분리했습니다.",
          "Micrometer, Prometheus, Grafana를 통해 API와 운영 지표를 확인할 수 있는 구성을 만들었습니다.",
          "GitLab CI, Docker Buildx, Traefik 기반 배포로 백엔드/AI/모니터링 변경을 나눠 반영했습니다.",
        ],
        snippet: {
          type: "table",
          label: "다층 캐시 예시",
          headers: ["대상", "TTL", "이유"],
          rows: [
            ["기상청 예보", "수시간", "발표 주기 기준"],
            ["최저 / 최고 기온", "발표 시각 가변", "일별 갱신 시점 반영"],
            ["옷장 / 코디", "10분", "사용자 변경 빈도 고려"]
          ]
        }
      }
    ],
    problems: [
      {
        title: "같은 추천 요청이 중복 실행되는 문제",
        problem:
          "일별 추천은 한 번만 생성되어야 하는데, 사용자가 연속 요청하거나 메시지가 중복 소비되면 같은 결과 생성 로직이 여러 번 돌 수 있습니다.",
        process: [
          "먼저 중복이 어디서 생기는지 HTTP 재요청과 큐 재소비를 분리해서 봤습니다.",
          "단순히 DB 중복 체크만으로는 동시에 들어온 작업을 막기 어려웠습니다.",
          "그래서 실행 시점에는 락으로 막고, 완료 이후에는 dedup 키로 다시 소비되지 않게 이중 방어를 넣었습니다.",
        ],
        solution:
          "Redis 락으로 같은 날짜 조합의 동시 실행을 막고, 처리 완료된 작업은 dedup 키로 다시 소비되지 않게 했습니다.",
        result: "중복 추천 실행과 중복 결과 저장을 함께 줄였습니다.",
        snippet: {
          type: "visual",
          label: "중복 실행 방어",
          content: [
            { id: "lock", name: "Distributed Lock", desc: "동시 요청 1회만 통과" },
            { id: "job", name: "Recommendation Job", desc: "실제 AI 처리" },
            { id: "dedup", name: "Dedup Key", desc: "완료 작업 재처리 방지" }
          ]
        }
      },
      {
        title: "재시도와 poison pill을 같은 방식으로 처리하기 어려운 문제",
        problem:
          "메시지 실패를 무조건 재시도하면 항상 실패하는 메시지가 큐를 오염시키고, 반대로 즉시 삭제하면 일시 장애 때 작업이 유실됩니다.",
        process: [
          "실패를 하나의 경우로 보면 재시도해야 할 작업과 버려야 할 작업을 구분할 수 없었습니다.",
          "비즈니스 오류와 인프라 오류를 같은 정책으로 처리하면 둘 중 하나는 반드시 손해를 보게 됩니다.",
          "그래서 오류 원인에 따라 ACK 전략을 나누는 쪽으로 운영 정책을 정리했습니다.",
        ],
        solution:
          "비즈니스 오류와 인프라 오류를 나눠 ACK 전략을 다르게 가져갔습니다. 재시도 가치가 없는 메시지는 정리하고, 일시 장애는 visibility timeout 재처리를 이용했습니다.",
        result: "재시도와 정리 기준을 분리해 큐 운영 안정성을 높였습니다.",
        snippet: {
          type: "table",
          label: "ACK 전략 분리",
          headers: ["상황", "처리", "의도"],
          rows: [
            ["성공", "delete", "정상 종료"],
            ["비즈니스 오류", "delete", "poison pill 정리"],
            ["인프라 오류", "재시도", "일시 장애 복구 대기"]
          ]
        }
      },
      {
        title: "리프레시 토큰 재사용을 탐지해야 하는 문제",
        problem:
          "탈취된 리프레시 토큰이 재사용되면 기존 사용자 세션과 공격자 세션이 동시에 유지될 수 있습니다.",
        process: [
          "단순 만료 시간 검사만으로는 이미 탈취된 토큰의 재사용을 막을 수 없었습니다.",
          "재발급 후 이전 토큰이 다시 들어오는 순간을 공격 신호로 봐야 했습니다.",
          "그래서 회전 정책과 재사용 탐지 로직을 함께 두는 방향으로 정리했습니다.",
        ],
        solution:
          "리프레시 토큰은 회전 시 즉시 폐기하고, 폐기된 토큰이 다시 들어오면 재사용으로 판단해 해당 사용자 세션을 전체 만료시켰습니다.",
        result: "토큰 탈취 후 재사용 공격에 대한 방어력을 높였습니다.",
        snippet: {
          lang: "java",
          label: "Refresh Token Rotation",
          code: `public TokenPair rotate(String refreshToken) {
    RefreshToken stored = repository.findByToken(refreshToken)
        .orElseThrow(TokenReusedException::new);
    repository.delete(stored);
    return issueNewPair(stored.getUserId());
}`
        }
      }
    ],
    techChoice: [
      {
        tech: "AWS SQS",
        feature: "비동기 작업 버퍼와 재시도 정책을 제공하는 관리형 큐",
        advantage: "앱 응답과 AI 처리 시간을 분리하고, 실패한 작업도 재시도 전략으로 관리할 수 있었습니다.",
        comparison: "동기 HTTP 호출보다 사용자 응답을 막지 않았고, Kafka처럼 초기에 운영 복잡도를 크게 요구하지도 않았습니다.",
        decision: "팀 규모와 프로젝트 기간을 고려하면 구현과 운영 균형이 가장 현실적이어서 SQS를 택했습니다.",
      },
      {
        tech: "Java 21 Virtual Threads",
        feature: "블로킹 코드 구조를 유지하면서 스레드 비용을 줄일 수 있는 경량 스레드 모델",
        advantage: "SQS long polling 소비자를 복잡한 리액티브 코드 없이 운영할 수 있었습니다.",
        comparison: "전통적인 스레드 풀보다 대기 비용 부담이 낮고, 리액티브 전환보다 구현 부담이 적었습니다.",
        decision: "기존 Spring 코드 스타일을 유지하면서 소비자 동시성을 확보하기 쉬워서 선택했습니다.",
      },
      {
        tech: "Redis",
        feature: "짧은 지연과 TTL, 원자 연산에 강한 인메모리 저장소",
        advantage: "락, dedup, 캐시를 같은 인프라에서 빠르게 처리할 수 있었습니다.",
        comparison: "DB 행 잠금만으로는 캐시와 락, dedup를 같이 다루기 불편했고 응답성도 떨어질 수 있었습니다.",
        decision: "운영 단순성과 즉시성 때문에 Redis 한 축으로 묶는 편이 현실적이었습니다.",
      },
      {
        tech: "Prometheus + Grafana",
        feature: "메트릭 수집과 시각화를 직접 구성할 수 있는 조합",
        advantage: "API와 운영 지표를 한 화면에서 보며 병목과 장애 징후를 확인하기 좋았습니다.",
        comparison: "로그만 보는 방식보다 수치 추이를 보기 쉬웠고, 외부 SaaS를 바로 붙이는 것보다 제어 범위가 컸습니다.",
        decision: "프로젝트 운영 흐름을 직접 확인할 수 있는 최소 관측 체계를 빠르게 만들기 좋았습니다.",
      },
      {
        tech: "Gmail API (OAuth2)",
        feature: "OAuth2 기반으로 Gmail 발송 기능을 제어할 수 있는 API",
        advantage: "SMTP 계정 비밀번호 관리보다 명시적인 인증 흐름으로 메일 발송을 붙일 수 있었습니다.",
        comparison: "단순 SMTP보다 README와 실제 구성 설명이 더 잘 맞았고, 인증 방식도 분명했습니다.",
        decision: "팀 문서와 실제 외부 서비스 구성을 맞추는 쪽이 중요해서 Gmail API 기준으로 정리했습니다.",
      },
      {
        tech: "기상청 API",
        feature: "국내 예보 발표 시각과 구조가 명확한 공공 날씨 API",
        advantage: "추천 문맥에 필요한 날씨 데이터를 국내 기준으로 맞출 수 있었습니다.",
        comparison: "해외 범용 날씨 API보다 발표 시각 기준 TTL 설계와 서비스 맥락 연결이 더 쉬웠습니다.",
        decision: "서비스 대상과 캐시 정책을 같이 맞추기 위해 기상청 API를 사용했습니다.",
      }
    ],
    retrospective: [
      {
        point: "배운 점",
        detail: "AI 기능보다도 큐 소비, 중복 방지, 인증 경계 같은 운영 구조가 서비스 품질을 더 크게 좌우한다는 점을 배웠습니다.",
      },
      {
        point: "아쉬운 점",
        detail: "비동기 파이프라인 효과를 p95, p99 같은 수치로 끝까지 남기지 못한 점이 아쉽습니다.",
      }
    ],
    links: {},
  },
];

export const projects = baseProjects.map((project) => ({
  ...project,
  detailPage: projectDetailPages[project.id],
}));
