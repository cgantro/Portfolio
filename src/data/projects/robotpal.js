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
  summary:
    "4인 팀이 JETANK AGV와 로봇팔의 움직임을 가상 환경에서 시험할 수 있도록 만든 C++ 시뮬레이터입니다. 실제 장비 상태와 시뮬레이션을 연결하고 카메라 화면을 전송합니다.",
  resultSummary: "2026년 10월 후속 측정입니다. 1232×832 해상도에서 스트리밍 OFF·ON을 각각 5회 측정해 중앙값을 비교했습니다.",
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
    },
    {
      label: "카메라 송신 FPS",
      value: "26.95 → 40.05 (+48.6%)",
      context: "목표 60 FPS 미달",
    },
  ],
  performanceRows: [
    { label: "동기 GPU Readback", before: "1.144 ms", after: "—" },
    { label: "동기 JPEG 인코딩", before: "16.406 ms", after: "—" },
    { label: "주 스레드 큐 등록", before: "—", after: "0.017 ms" },
    { label: "작업 스레드 JPEG 인코딩", before: "—", after: "27.075 ms" },
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
        "외부 명령은 TCP·WebSocket 통신 경로로 연결했습니다. OpenGL 가상 카메라에서 프레임을 읽어 JPEG 형식으로 압축한 뒤 전송했습니다. 데스크톱과 WebAssembly의 전송 경로도 구분했습니다.",
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
        "동일 해상도와 반복 조건에서 동기 방식과 작업 스레드 구성을 비교했습니다. 시뮬레이션과 카메라 송신의 중앙값 모두 개선됐습니다.",
      limitations:
        "작업 스레드의 개별 JPEG 압축 시간은 더 길어졌습니다. 인코더 자체의 처리 속도 개선이 아니라 주 스레드의 대기를 줄인 결과입니다.",
    },
  ],
  verification: {
    summary: "카메라 수신·디코딩 시간은 측정하지 않았습니다.",
    items: [
      "스트리밍 OFF FPS의 두 구성 간 차이는 0.557%로, 5% 허용 기준 이내였습니다.",
      "Tracy 구간 계측: GPU Readback·JPEG·주 스레드 큐 등록·작업 스레드 JPEG 처리.",
    ],
  },
  links: {
    github: "https://github.com/cgantro/RobotPal",
    demo: null,
  },
  theme: { accent: "#7dd3fc" },
};
