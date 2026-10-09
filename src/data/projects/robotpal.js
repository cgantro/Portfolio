import coverImage from "../../../asset/로봇팔 시연.webp";
import architectureImage from "../../../asset/robotpal-system-architecture.svg";

export default {
  id: "robotpal",
  title: "RobotPal",
  category: "C++ 시뮬레이터 · 실시간 스트리밍",
  period: "2025.11 – 2025.12",
  team: "4인 팀",
  role: "Qt 기반 제어 화면, 실장비 측정·보정, AGV·로봇팔·그리퍼 제어, Python 모듈 연동, 카메라 스트리밍·성능 검증",
  summary:
    "4인 팀으로 JETANK AGV와 로봇팔의 움직임을 가상 환경에서 시험하는 C++ 시뮬레이터를 개발했습니다. Qt 기반 제어 화면과 Python 명령 연동, 실물 측정값을 반영한 이동 보정, 가상 카메라 스트리밍과 성능 검증을 맡았습니다.",
  resultsIntro: "아래 수치는 공식 프로젝트 기간(2025.11–2025.12)이 끝난 뒤인 2026.10에 별도로 재측정한 결과입니다.",
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
        "1232×832에서 동기 방식과 PBO·작업 스레드 4개 구성을 비교한 결과. 스트리밍 OFF/ON 각각 5회 측정한 중앙값.",
    },
    {
      label: "카메라 송신 FPS",
      value: "26.95 → 40.05 (+48.6%)",
      context:
        "같은 조건에서 동기 방식과 PBO·작업 스레드 4개 구성을 비교한 중앙값.",
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
      title: "Qt 제어 화면과 실장비 측정·시뮬레이터 보정",
      body:
        "Qt 기반 제어 화면에서 실물 로봇의 상태를 확인하고, JETANK의 직진·회전 속도를 측정해 시뮬레이터 이동 계수를 보정했습니다. 실측 속도는 아래 상세 사례에 정리했습니다.",
    },
    {
      title: "AGV·로봇팔·그리퍼 제어와 Python 연동",
      body:
        "AGV 이동, 로봇팔 관절과 그리퍼 제어를 구현하고 외부 Python 모듈에서 보낸 명령을 시뮬레이터 제어 계층에 연결했습니다. 상위 명령 처리와 제어기 구현은 IRobotController 경계로 분리했습니다.",
    },
    {
      title: "통신·가상 카메라 스트리밍",
      body:
        "외부 명령은 TCP·WebSocket 통신 경로로 연결했습니다. OpenGL 가상 카메라에서 프레임을 읽어 JPEG 형식으로 압축한 뒤 전송했습니다. 데스크톱과 WebAssembly의 전송 경로도 구분했습니다.",
    },
    {
      title: "Tracy 계측과 스트리밍 성능 개선",
      body:
        "동기 방식, PBO, PBO와 작업 스레드 4개 구성을 비교했습니다. PBO만 적용한 결과가 개선되지 않자 Tracy로 구간을 다시 측정해 JPEG 압축이 주 스레드 병목임을 확인했습니다. JPEG 작업을 작업 스레드로 보내고 주 스레드가 압축 완료를 기다리지 않도록 바꿨습니다. 측정 조건과 결과는 검증 섹션에 정리했습니다.",
    },
  ],
  caseStudies: [
    {
      title: "실장비 주행값을 시뮬레이터 이동 계수에 반영",
      situation:
        "시뮬레이터의 JETANK 이동이 실물 장비의 움직임을 반영하도록 직진·회전 계수를 보정할 기준이 필요했습니다.",
      analysis:
        "실물 JETANK에서 직진 속도 약 2.4cm/s, 회전 속도 약 24°/s를 측정했습니다.",
      decision:
        "두 실측값을 가상 시뮬레이터의 직진·회전 이동 계수를 보정하는 기준으로 사용했습니다.",
      implementation:
        "직진·회전 속도를 각각 반영해 JETANK 시뮬레이터의 이동 계수를 조정했습니다.",
      verification:
        "실물에서 측정한 직진·회전 속도를 시뮬레이터 이동 계수 보정에 적용했습니다. 보정 전후 오차나 반복 측정 분산은 자료에서 확인되지 않습니다.",
      limitations:
        "측정 환경·입력 조건·반복 횟수와 보정 후 정량 오차는 확인되지 않아, 해당 수치를 일반적인 실물 성능이나 검증 오차로 확대 해석하지 않습니다.",
    },
    {
      title: "PBO 가설을 재검토하고 JPEG 병목을 주 스레드에서 분리",
      situation:
        "카메라 스트리밍을 켜면 시뮬레이션 FPS가 낮아져 GPU 픽셀 읽기가 주된 원인이라고 예상했습니다.",
      analysis:
        "PBO만 적용한 구성은 동기 방식보다 스트리밍 중 시뮬레이션과 카메라 송신 FPS가 모두 낮았습니다. Tracy 구간별 계측에서 JPEG 압축이 픽셀 읽기보다 오래 걸렸습니다.",
      decision:
        "픽셀 읽기 최적화만으로는 문제가 해결되지 않는다고 판단해 JPEG 압축을 시뮬레이션 주 스레드의 대기 경로에서 분리했습니다.",
      implementation:
        "PBO와 Fence 경로에 작업 스레드 4개를 붙였습니다. 주 스레드는 JPEG 작업을 큐에 등록한 뒤 압축 완료를 기다리지 않고 시뮬레이션을 이어가도록 했습니다.",
      verification:
        "후속 재측정에서 1232×832 해상도로 스트리밍 OFF·ON을 각각 5회 측정해 중앙값을 비교했습니다. 수치 결과는 위 핵심 결과에 정리했습니다.",
      limitations:
        "작업 스레드의 개별 JPEG 압축 시간은 더 길어져 인코더 자체가 빨라진 것은 아닙니다. 카메라 송신은 목표 60 FPS에 미달했고, 수신·디코딩은 측정에 포함하지 않았습니다.",
    },
  ],
  decisionVisual: {
    title: "병목 가설을 다시 세운 과정",
    code: `// 판단 흐름을 설명하는 의사 코드입니다. 실제 구현 코드가 아닙니다.
if (!improvedWithPboOnly) {
  readbackTime = measureWithTracy("readback");
  jpegTime = measureWithTracy("jpeg");

  if (jpegTime > readbackTime) {
    enqueueJpegJobs(workerCount = 4);
    continueSimulationWithoutWaiting();
  }
}

compareMedianFps(runCount = 5);`,
    steps: [
      {
        label: "초기 가설",
        detail: "스트리밍 FPS 저하의 원인을 동기 GPU 픽셀 읽기로 예상",
      },
      {
        label: "계측으로 재검토",
        detail: "PBO 단독으로는 개선되지 않았습니다. Tracy 재계측에서 JPEG 압축이 픽셀 읽기보다 오래 걸렸습니다.",
      },
      {
        label: "구조 변경",
        detail: "JPEG 작업은 작업 스레드 4개로 분산하고 주 스레드는 큐 등록 후 진행",
      },
      {
        label: "전체 경로로 확인",
        detail: "주 스레드는 작업을 큐에 넣고 시뮬레이션을 이어갔습니다. 성과는 인코딩 가속이 아니라 주 스레드 대기 감소였습니다.",
      },
    ],
    note:
      "의사 코드는 Tracy 계측을 바탕으로 한 판단 요약이며 실제 구현 코드는 아닙니다. JPEG 처리 시간이 늘더라도 주 스레드 대기를 줄이는 선택을 설명합니다.",
  },
  verification: {
    summary:
      "재측정 조건과 계측 범위를 함께 기록했습니다. 프로젝트 수행 기간과 별도인 측정 시점은 핵심 결과 위에 표시했습니다.",
    items: [
      "1232×832 해상도에서 동기 방식, PBO, PBO와 작업 스레드 4개 구성을 비교",
      "스트리밍 OFF/ON을 각각 5회 측정해 중앙값을 사용했고, OFF FPS 구성 간 차이 0.557%는 5% 허용 기준 이내였습니다.",
      "Tracy로 픽셀 읽기, JPEG 압축, 주 스레드 큐 등록, 작업 스레드 압축 구간을 측정했습니다.",
      "카메라 송신은 목표 60 FPS에 미달했습니다. 수신·디코딩은 측정에서 제외했습니다.",
    ],
  },
  links: {
    github: "https://github.com/cgantro/RobotPal",
    demo: null,
  },
  theme: { accent: "#7dd3fc" },
};
