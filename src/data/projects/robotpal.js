import coverImage from "../../../asset/로봇팔 시연.webp";
import architectureImage from "../../../asset/robotpal-system-architecture.svg";

export default {
  id: "robotpal",
  sectionOrder: ["results", "architecture", "implementation", "case-studies", "verification", "sources"],
  homeHighlight: "시뮬레이션 FPS +43.9% · 카메라 송신 FPS +48.6%",
  title: "RobotPal",
  category: "C++ 시뮬레이터 · 실시간 스트리밍",
  period: "2025.11 – 2025.12",
  team: "4인 팀",
  role: "Qt 기반 제어 화면, 실장비 측정·보정, AGV·로봇팔·그리퍼 제어, Python 모듈 연동, 카메라 스트리밍·성능 검증",
  cardRole: "Qt·실장비 보정·AGV/로봇 제어·스트리밍",
  summary:
    "4인 팀으로 개발한 JETANK용 C++ 가상 시뮬레이터입니다. 실물 장비에서 확인한 주행 속도를 가상 이동 계수에 반영하고, 제어 명령과 카메라 영상을 연결했습니다.",
  resultSummary:
    "성능 수치는 프로젝트 기간과 구분한 2026년 10월 8일 후속 벤치마크 결과입니다.",
  cover: coverImage,
  stack: [
    "C++17",
    "OpenGL",
    "Flecs ECS",
    "libjpeg API",
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
    },
    {
      label: "카메라 송신 FPS",
      value: "26.95 → 40.05 (+48.6%)",
    },
  ],
  benchmarkTable: {
    title: "스트리밍 구성별 성능 비교",
    headers: [
      "구성",
      "GPU 프레임 읽기",
      "JPEG 처리 위치",
      "시뮬레이션 OFF FPS",
      "시뮬레이션 ON FPS",
      "카메라 송신 FPS",
      "스트리밍 FPS 감소율",
    ],
    rows: [
      ["Sync", "동기 glReadPixels", "주 스레드", "102.38", "66.70", "26.95", "34.84%"],
      ["PBO", "비동기 PBO + Fence", "주 스레드", "102.52", "65.60", "25.49", "36.02%"],
      ["PBO + 작업 스레드 4개", "비동기 PBO + Fence", "작업 스레드 4개", "102.95", "96.01", "40.05", "6.74%"],
    ],
    note:
      "모든 구성에서 해상도는 1232×832로 유지했습니다. 스트리밍 OFF/ON을 각각 5회 측정해 중앙값을 사용했으며, OFF FPS 구성 간 차이 0.557%는 5% 허용 기준 이내였습니다. 수신·디코딩은 측정 범위에서 제외했고, 카메라 송신 목표 60 FPS에는 미달했습니다.",
  },
  tracyDiagnostics: {
    title: "Tracy 구간별 p50 계측",
    headers: ["구성", "계측 구간", "p50"],
    rows: [
      ["Sync", "GPU Readback", "1.144 ms"],
      ["Sync", "JPEG 인코딩 · 주 스레드", "16.406 ms"],
      ["PBO + 작업 스레드 4개", "주 스레드 큐 등록", "0.017 ms"],
      ["PBO + 작업 스레드 4개", "작업 스레드 JPEG 인코딩", "27.075 ms"],
    ],
    note:
      "큐 등록 시간과 JPEG 인코딩 시간은 서로 다른 구간입니다. Worker별 JPEG 시간은 오히려 늘었으므로 인코더가 빨라졌다고 해석하지 않습니다. 개선의 핵심은 주 스레드가 압축 완료를 기다리지 않게 한 구조 변경입니다.",
  },
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
        "Qt 제어 화면에서 실물 로봇 상태를 확인하고, JETANK의 직진·회전 속도를 측정해 시뮬레이터 이동 계수를 보정했습니다.",
    },
    {
      title: "AGV·로봇팔·그리퍼 제어와 Python 연동",
      body:
        "AGV 이동, 로봇팔 관절과 그리퍼 제어를 구현하고 외부 Python 모듈에서 보낸 명령을 시뮬레이터 제어 계층에 연결했습니다. 상위 명령 처리와 제어기 구현은 IRobotController 경계로 분리했습니다.",
    },
    {
      title: "통신·가상 카메라 스트리밍",
      body:
        "외부 명령은 TCP·WebSocket으로 전달하고, OpenGL 가상 카메라 영상은 JPEG로 압축해 전송합니다. 현재 확인 가능한 소스의 인코더는 libjpeg API를 사용하며, 네이티브 빌드는 libjpeg-turbo에 연결하고 WebAssembly 빌드는 Emscripten 내장 libjpeg를 사용합니다. 데스크톱과 WebAssembly의 전송 경로도 구분했습니다.",
    },
    {
      title: "Tracy 계측과 스트리밍 성능 개선",
      body:
        "동기 방식, PBO, PBO와 작업 스레드 4개 구성을 비교했습니다. PBO만 적용한 결과가 개선되지 않자 Tracy로 구간을 계측해 JPEG 압축 대기를 주 스레드에서 분리했습니다.",
    },
  ],
  caseStudies: [
    {
      title: "실장비 주행값을 시뮬레이터 이동 계수에 반영",
      situation:
        "시뮬레이터의 JETANK 이동이 실물 장비의 움직임을 반영하도록 직진·회전 계수를 보정할 기준이 필요했습니다.",
      analysis:
        "실물 JETANK에서 직진 속도 약 2.4cm/s, 회전 속도 약 24°/s를 측정해 가상 이동 계수의 기준으로 삼았습니다.",
      decision:
        "두 실측값을 가상 시뮬레이터의 직진·회전 이동 계수를 보정하는 기준으로 사용했습니다.",
      implementation:
        "직진·회전 속도를 각각 반영해 JETANK 시뮬레이터의 이동 계수를 조정했습니다.",
      verification:
        "실측값을 시뮬레이터의 선속도·각속도 계수에 반영했습니다. 보정 전후 오차나 반복 측정 분산은 확인되지 않았습니다.",
      limitations:
        "당시 입력 조건과 반복 횟수, 보정 뒤 오차값은 남아 있지 않습니다. 2.4cm/s와 24°/s는 측정 당시 결과로만 제시합니다.",
    },
    {
      title: "PBO 가설을 재검토하고 JPEG 병목을 주 스레드에서 분리",
      situation:
        "카메라 스트리밍을 켜면 시뮬레이션 FPS가 낮아져 GPU 픽셀 읽기가 주된 원인이라고 예상했습니다.",
      analysis:
        "PBO만 적용했을 때 스트리밍 중 시뮬레이션과 카메라 송신 성능은 동기 방식보다 개선되지 않았습니다. Tracy 계측에서는 동기 GPU Readback보다 JPEG 압축 구간이 더 길었습니다. 구간별 p50은 별도 표에 정리했습니다.",
      decision:
        "PBO 단독으로 병목이 해소되지 않아 JPEG 압축을 시뮬레이션 주 스레드의 대기 경로에서 분리했습니다.",
      implementation:
        "비동기 PBO + Fence 경로와 작업 스레드 4개 구성을 적용했습니다. 주 스레드는 JPEG 작업을 큐에 등록한 뒤 압축 완료를 기다리지 않고 시뮬레이션을 이어갑니다.",
      verification:
        "세 구성의 결과와 측정 조건은 성능 비교표에 정리했습니다.",
      limitations:
        "Worker별 JPEG 인코딩 시간은 동기 JPEG 구간보다 늘었습니다. 인코더 처리 속도 향상이 아니라 주 스레드의 압축 대기를 제거한 구조 변경으로 설명해야 합니다. 수신·디코딩은 측정하지 않았습니다.",
    },
  ],
  verification: {
    summary:
      "이 결과는 iGPU에서 해당 작업 조건으로 측정했습니다. 다른 GPU의 성능으로 일반화할 수 없습니다.",
    items: [
      "PBO 단독 구성은 이 테스트에서 개선되지 않았습니다. 이를 PBO의 일반 성능으로 해석하지 않았습니다.",
    ],
  },
  links: {
    github: "https://github.com/cgantro/RobotPal",
    report: "https://github.com/cgantro/RobotPal/blob/main/docs/streaming-performance-result.md",
    demo: null,
  },
  theme: { accent: "#7dd3fc" },
};
