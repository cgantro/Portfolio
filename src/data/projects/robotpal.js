import coverImage from "../../../asset/로봇팔 시연.webp";
import architectureImage from "../../../asset/robotpal-system-architecture.svg";

export default {
  id: "robotpal",
  title: "RobotPal",
  category: "C++ 시뮬레이터 · 실시간 스트리밍",
  period: "2025.11.12 – 2025.12.15",
  team: "2인",
  role: "카메라 스트리밍·성능 검증, 제어기와 네트워크 연결, 그리퍼 제어 구현",
  summary:
    "JETANK 로봇팔의 훈련과 제어 로직 검증을 위한 C++ 가상 시뮬레이터입니다. Tracy로 다시 계측해 GPU 픽셀 읽기보다 JPEG 압축이 주 스레드를 더 오래 점유한다는 점을 확인하고, JPEG 작업을 작업 스레드 4개로 분리했습니다.",
  cover: coverImage,
  stack: [
    "C++17",
    "OpenGL",
    "Flecs ECS",
    "libjpeg-turbo",
    "Tracy",
    "TCP",
    "WebSocket",
    "Emscripten",
    "WebAssembly",
    "Python",
    "CMake",
  ],
  metrics: [
    {
      label: "스트리밍 중 시뮬레이션 FPS",
      value: "66.70 → 96.01 (+43.9%)",
      context:
        "1232×832에서 동기 방식과 PBO + JPEG 작업 스레드 4개 구성을 비교. 스트리밍 OFF/ON을 각각 5회 측정한 중앙값.",
    },
    {
      label: "카메라 송신 FPS",
      value: "26.95 → 40.05 (+48.6%)",
      context:
        "같은 조건에서 동기 방식과 PBO + 작업 스레드 4개 구성을 비교. 목표 상한인 60 FPS에는 미달.",
    },
    {
      label: "스트리밍에 따른 FPS 감소율",
      value: "34.84% → 6.74% (−28.1%p)",
      context:
        "각 구성의 시뮬레이션 FPS를 스트리밍 OFF/ON 상태로 비교. OFF FPS의 구성 간 차이는 0.557%로, 허용 기준인 5% 이내였습니다.",
    },
    {
      label: "동기 방식 구간 p50",
      value: "픽셀 읽기 1.144ms · JPEG 16.406ms",
      context:
        "Tracy 계측 결과. JPEG 압축 시간이 픽셀 읽기보다 길어 병목 가설을 다시 검토했습니다.",
    },
    {
      label: "PBO + 작업 스레드 4개 구간 p50",
      value: "주 스레드 큐 등록 0.017ms · 작업 스레드 JPEG 27.075ms",
      context:
        "작업 스레드별 JPEG 처리 시간은 오히려 늘었습니다. 알고리즘이 빨라진 것이 아니라 주 스레드가 압축을 기다리지 않도록 구조를 바꾼 결과입니다.",
    },
  ],
  architecture: {
    image: architectureImage,
    alt: "RobotPal의 ECS 렌더링·스트리밍·제어 시스템과 TCP/WebSocket 클라이언트 경로",
    summary:
      "OpenGL 카메라 프레임은 스트리밍 시스템을 거쳐 TCP 또는 WebSocket으로 전송됩니다. 네트워크 명령은 제어기 계층으로 전달되며, 데스크톱의 TCP 경로와 WebAssembly의 WebSocket 경로를 구분합니다.",
  },
  implementations: [
    {
      title: "가상 로봇 시뮬레이터와 제어 경계",
      body:
        "ECS 기반 렌더링 환경에서 로봇 제어 로직을 시험할 수 있도록 IRobotController 인터페이스로 상위 제어 로직과 제어기 구현을 분리했습니다. 이 프로젝트에서는 가상 시뮬레이터에서 제어 로직을 검증합니다. TryGrip은 가장 가까운 Grabbable 객체를 그리퍼의 자식으로 붙이고, 놓을 때 월드 변환을 다시 계산합니다.",
    },
    {
      title: "TCP·WebSocket 네트워크 경로",
      body:
        "TcpNetworkTransport로 네트워크 송수신을 렌더 루프와 분리했습니다. 네이티브 데스크톱 빌드에서는 TCP를, WebAssembly 빌드에서는 브라우저 제약에 맞춰 WebSocket을 사용합니다. 네트워크 명령은 AGV 제어 계층으로 전달됩니다.",
    },
    {
      title: "Tracy 계측에 따른 JPEG 작업 분리",
      body:
        "동기 방식, PBO, PBO + 작업 스레드 4개 구성을 비교했습니다. PBO만 적용했을 때 성능이 나아지지 않아 Tracy로 픽셀 읽기와 JPEG 처리 시간을 확인했고, JPEG 압축을 주 스레드에서 분리했습니다. 주 스레드는 인코딩이 끝날 때까지 기다리지 않고 작업을 큐에 넣은 뒤 시뮬레이션을 이어갑니다.",
    },
  ],
  caseStudies: [
    {
      title: "픽셀 읽기가 병목일 것이라는 초기 가설",
      situation:
        "스트리밍 중 시뮬레이션 FPS가 낮아져 GPU 프레임을 CPU로 읽어 오는 동기 픽셀 읽기를 주요 병목으로 예상했습니다.",
      analysis:
        "PBO만 적용했을 때 스트리밍 중 시뮬레이션 FPS는 66.70에서 65.60으로, 카메라 송신 FPS는 26.95에서 25.49로 낮아졌습니다. Tracy 계측에서 동기 방식 픽셀 읽기 p50은 1.144ms, JPEG p50은 16.406ms였습니다.",
      decision:
        "픽셀 읽기가 주원인이라는 가설을 접고, 주 스레드에서 처리하던 JPEG 압축을 먼저 분리하기로 했습니다.",
      implementation:
        "비동기 PBO + Fence 경로를 비교하면서 JPEG 인코딩은 작업 스레드 4개가 처리하도록 했습니다. 주 스레드는 압축이 끝날 때까지 기다리지 않고 작업을 큐에 넣은 뒤 다음 프레임으로 넘어갑니다.",
      verification:
        "1232×832에서 동기 방식, PBO, PBO + 작업 스레드 4개 구성을 비교하고 스트리밍 OFF/ON을 각각 5회 측정해 중앙값을 사용했습니다. OFF FPS의 구성 간 차이는 0.557%로 허용 기준인 5% 이내였습니다.",
      limitations:
        "PBO만 적용했을 때는 이 작업 조건에서 개선되지 않았습니다. 결과는 문서에 기록된 내장 GPU 환경에 한정되며, 다른 GPU에도 그대로 적용된다고 볼 수 없습니다.",
    },
    {
      title: "시뮬레이션 프레임 처리 경로에서 JPEG 분리",
      situation:
        "주 스레드에서 처리한 JPEG의 p50은 16.406ms로, 프레임 처리 경로를 오래 점유했습니다.",
      analysis:
        "PBO + 작업 스레드 4개 구성에서 주 스레드의 큐 등록 p50은 0.017ms였지만 작업 스레드별 JPEG p50은 27.075ms로 늘었습니다. 개별 인코딩이 빨라진 것이 아니라 주 스레드의 대기가 사라졌습니다.",
      decision:
        "개별 JPEG 처리 시간과 전체 시뮬레이션 성능을 구분해 평가했습니다.",
      implementation:
        "JPEG 압축은 작업 스레드 묶음에 맡기고, 시뮬레이션 프레임 처리 경로에서는 작업을 큐에 넣기만 하도록 했습니다.",
      verification:
        "동기 방식과 비교해 스트리밍 중 시뮬레이션 FPS는 66.70에서 96.01로, 카메라 송신 FPS는 26.95에서 40.05로 올랐습니다. 스트리밍에 따른 FPS 감소율은 34.84%에서 6.74%로 낮아졌습니다.",
      limitations:
        "카메라 송신 FPS 40.05는 목표인 60 FPS에 미달했습니다. 이번 성능 측정에는 수신과 디코딩이 포함되지 않았습니다.",
    },
  ],
  decisionVisual: {
    title: "병목 가설을 다시 세운 과정",
    code: `// 판단 흐름을 설명하는 의사 코드입니다. 실제 구현 코드가 아닙니다.
if (pboOnlyDoesNotImproveFps) {
  readbackTime = measureWithTracy("readback");
  jpegTime = measureWithTracy("jpeg");

  if (jpegTime > readbackTime) {
    큐 등록JpegJobs(workerCount = 4);
    continueSimulationWithoutWaiting();
  }
}

compareMedianFps(runCount = 5); // 작업별 JPEG 시간은 더 길어질 수 있음`,
    steps: [
      {
        label: "초기 가설",
        detail: "스트리밍 FPS 저하의 원인을 동기 GPU 픽셀 읽기로 예상",
      },
      {
        label: "계측으로 재검토",
        detail: "PBO만 적용해도 개선되지 않음. Tracy p50: 픽셀 읽기 1.144ms, JPEG 16.406ms",
      },
      {
        label: "구조 변경",
        detail: "JPEG 작업은 작업 스레드 4개로 분산하고 주 스레드는 큐 등록 후 진행",
      },
      {
        label: "전체 경로로 확인",
        detail: "주 스레드 큐 등록 p50은 0.017ms. 작업 스레드 JPEG p50은 27.075ms로 증가해 개별 인코딩이 빨라진 것이 아니라 대기만 분리했음을 확인",
      },
    ],
    note:
      "의사 코드와 단계는 Tracy 계측을 바탕으로 JPEG 병목 판단 과정을 요약한 자료이며 실제 구현 코드는 아닙니다. 스트리밍 OFF/ON 각각 5회 측정한 중앙값과 5% 허용 기준으로 비교했습니다. 시뮬레이션 FPS와 카메라 송신 FPS는 개선됐지만, 송신은 목표 60 FPS에 미달했습니다.",
  },
  verification: {
    summary:
      "최신 문서에 기록된 비교 조건과 Tracy 구간 계측을 바탕으로 성능 결과를 정리했습니다.",
    items: [
      "1232×832 해상도에서 동기 방식, PBO, PBO + 작업 스레드 4개 구성을 비교",
      "스트리밍 OFF/ON을 각각 5회 측정해 중앙값 사용; OFF FPS 구성 간 차이는 0.557%로 5% 허용 기준 이내",
      "Tracy p50으로 동기 방식의 픽셀 읽기·JPEG 및 작업 스레드 구성의 큐 등록·JPEG 구간 비교",
      "수신·디코딩은 측정에서 제외했으며 카메라 송신 FPS가 목표 60 FPS에 미달했음을 기록",
    ],
  },
  links: {
    github: "https://github.com/cgantro/RobotPal",
    demo: null,
  },
  theme: { accent: "#7dd3fc" },
};
