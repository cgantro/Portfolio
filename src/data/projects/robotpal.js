import coverImage from "../../../asset/로봇팔 시연.webp";
import architectureImage from "../../../asset/robotpal-system-architecture.svg";

export default {
  id: "robotpal",
  sectionOrder: ["results", "architecture", "implementation", "case-studies", "sources"],
  homeHighlight: "시뮬레이션 FPS +43.9% · 카메라 송신 FPS +48.6%",
  homeHighlightNote: "2026.10 후속 측정",
  title: "RobotPal",
  category: "C++ 시뮬레이터 · 실시간 스트리밍",
  period: "2025.11 – 2025.12",
  team: "4인 팀",
  role: "Qt 제어 화면, 실장비 주행 계수 보정, AGV·로봇팔·그리퍼 제어, Python 연동, 카메라 스트리밍·성능 검증",
  cardRole: "Qt·실장비 보정·로봇 제어",
  summary: [
    "JETANK용 C++ 가상 시뮬레이터",
    "Python AI 모듈에 가상 카메라 영상을 공급하고 AGV·로봇팔 제어 명령을 연결",
  ],
  resultSummary:
    "후속 성능 측정 · 2026년 10월 8일",
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
      "해상도 1232×832 · 스트리밍 OFF/ON 각 5회 측정 중앙값 · OFF FPS 구성 간 편차 0.557% (허용선 5% 이내) · 수신·디코딩 측정 제외 · 카메라 송신 목표 60 FPS 미달",
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
      "큐 등록과 JPEG 인코딩은 별도 구간 · 작업 스레드별 JPEG p50은 더 길었음 · 개선 요인: 주 스레드의 압축 대기를 없앤 구조 변경",
  },
  architecture: {
    image: architectureImage,
    alt: "RobotPal의 ECS 렌더링·스트리밍·제어 시스템과 TCP/WebSocket 클라이언트 경로",
    summary: [
      "데스크톱은 TCP, WebAssembly는 WebSocket 경로를 사용합니다.",
      "서보 ID 1–3은 로봇팔, ID 4는 그리퍼, ID 5는 카메라 기울기에 대응합니다.",
    ],
    mobileFlows: [
      { title: "가상 카메라 영상", steps: [
        { title: "OpenGL 카메라", detail: "시뮬레이션 화면 프레임 생성" },
        { title: "JPEG 인코딩", detail: "libjpeg API로 프레임 압축" },
        { title: "영상 전송", detail: "Python AI 학습·추론 입력으로 전달" },
      ] },
      { title: "외부 제어 명령", steps: [
        { title: "Python 모듈", detail: "AGV·서보 명령 생성" },
        { title: "TCP · WebSocket", detail: "데스크톱과 WebAssembly 전송 경로" },
        { title: "NetworkEngine", detail: "수신한 패킷을 제어 계층으로 전달" },
        { title: "주행 · 서보", detail: "AGV, 로봇팔, 그리퍼, 카메라 기울기" },
      ] },
    ],
  },
  implementations: [
    {
      title: "Qt 제어 화면과 실장비 측정·보정",
      body: [
        "Qt 화면에서 JETANK 상태와 제어 입력을 확인",
        "실장비 직진·회전 속도를 측정해 가상 주행 계수에 반영",
      ],
    },
    {
      title: "AGV·로봇팔·그리퍼 제어와 Python 연동",
      body: [
        "명령 흐름: Python → TCP/WebSocket → NetworkEngine → 주행·서보 제어",
        "서보 ID 1–3: 로봇팔 베이스·어깨·팔꿈치 · ID 4: 그리퍼 · ID 5: 카메라 기울기",
        "`IRobotController` 인터페이스로 상위 제어 로직과 제어기 구현을 분리",
      ],
    },
    {
      title: "통신·가상 카메라 스트리밍",
      body: [
        "OpenGL 가상 카메라 JPEG 영상을 Python AI 학습·추론 입력으로 전달",
        "인코딩: `libjpeg` API · 네이티브: libjpeg-turbo · WebAssembly: Emscripten 내장 libjpeg",
      ],
    },
  ],
  caseStudies: [
    {
      title: "실물 주행 기준을 가상 AGV 계수에 반영",
      narrative: [
        "실물 JETANK에서 모터 입력 0.3일 때 직진 약 2.4cm/s와 회전 약 24°/s를 측정해 가상 주행 계수의 기준으로 삼았습니다.",
        "`ControllerSystemModule.cpp`는 좌우 모터 입력의 평균으로 선속도, 입력 차이의 절반으로 각속도를 계산합니다.",
        "가속도 완화를 적용한 뒤 가상 위치와 회전을 갱신합니다.",
        "보정 후 오차와 반복 측정 횟수는 기록에 남아 있지 않습니다.",
      ],
      equations: [
        { label: "목표 선속도 · m/s", expression: "v = 0.08 × ((L + R) / 2)" },
        { label: "목표 각속도 · rad/s", expression: "ω = 1.3963 × ((R − L) / 2)" },
      ],
      equationNote: "L: 좌측 모터 입력 · R: 우측 모터 입력",
    },
    {
      title: "PBO 가설을 재검토하고 JPEG 병목을 주 스레드에서 분리",
      narrative: [
        "카메라 스트리밍을 켜면 시뮬레이션 FPS가 떨어졌습니다. 가상 카메라 영상은 Python AI 모듈의 입력으로 보내고 있었습니다.",
        "처음에는 동기 `glReadPixels`의 GPU Readback 대기를 의심해 PBO와 Fence를 적용했습니다. PBO 단독 구성에서는 스트리밍 중 시뮬레이션 FPS와 카메라 송신 FPS가 Sync보다 낮았습니다.",
        "Tracy로 처리 구간을 나눠 보니 주 스레드 JPEG 인코딩의 p50이 GPU Readback보다 길었습니다. 가장 오래 걸리는 대기가 압축 쪽이라는 점에 맞춰 병목 가설을 바꿨습니다.",
        "JPEG를 작업 스레드 4개에 맡기고, 주 스레드는 큐에 작업을 등록한 뒤 시뮬레이션을 이어가도록 바꿨습니다.",
        "2026년 10월 후속 측정에서는 시뮬레이션과 카메라 송신 FPS가 모두 높아졌습니다. 작업 스레드별 JPEG 시간은 더 길어졌으며, 개선은 인코더 속도보다 주 스레드 대기 구조를 바꾼 결과였습니다.",
      ],
      flow: [
        { title: "현상", detail: "스트리밍 중 시뮬레이션 FPS 하락" },
        { title: "초기 가설", detail: "GPU Readback 대기 · PBO 단독 구성은 성능 개선으로 이어지지 않음" },
        { title: "재계측", detail: "Tracy로 Readback과 JPEG 처리 구간 비교" },
        { title: "조치", detail: "JPEG를 작업 스레드 4개로 이동하고 주 스레드 대기 제거" },
        { title: "후속 측정", detail: "성능 비교표에서 세 구성의 FPS 결과 확인" },
      ],
    },
  ],
  links: {
    github: "https://github.com/cgantro/RobotPal",
    demo: null,
  },
  theme: { accent: "#7dd3fc" },
};
