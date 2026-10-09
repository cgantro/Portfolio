import coverImage from "../../../asset/로봇팔 시연.webp";
import architectureImage from "../../../asset/robotpal-system-architecture.svg";

export default {
  id: "robotpal",
  sectionOrder: ["results", "architecture", "implementation", "case-studies", "sources"],
  homeHighlight: "초당 화면 갱신 수 +43.9%, 카메라 영상 전송 수 +48.6%",
  title: "RobotPal",
  category: "C++ 로봇 시뮬레이터와 실시간 영상 전송",
  period: "2025.11 – 2025.12",
  team: "4인 팀",
  role: [
    "Qt 화면에서 실물 JETANK 이동 로봇의 상태를 확인하고 조작 입력을 보내는 기능 구현",
    "좌우 모터 입력과 실측 주행값으로 가상 이동 로봇의 직진과 회전 속도 보정",
    "Python 인공지능 명령을 이동 로봇, 로봇 팔, 집게, 카메라 기울기 제어에 연결",
    "가상 카메라 화면을 이미지로 압축해 Python 인공지능 모듈에 전달",
    "성능 측정 도구 Tracy로 병목을 찾고 별도 작업 스레드 네 개로 이미지 압축을 분리",
  ],
  cardRole: "실물 주행 측정값을 이용한 가상 로봇 보정",
  summary: [
    "실물 JETANK 이동 로봇의 주행을 가상으로 재현하는 C++ 시뮬레이터입니다.",
    "가상 카메라 영상을 Python 인공지능 모듈에 보내고, 이동 로봇과 로봇 팔 제어 명령을 연결했습니다.",
  ],
  cover: coverImage,
  stack: [
    "C++17",
    "OpenGL 3D 화면 그리기",
    "Flecs 개체 상태 관리",
    "libjpeg 이미지 압축",
    "Tracy 성능 측정 도구",
    "TCP 순서 보장 통신",
    "WebSocket 양방향 통신",
    "Emscripten C++ 변환 도구",
    "WebAssembly 브라우저 실행 형식",
    "Python",
    "CMake 빌드 설정 도구",
  ],
  benchmarkTable: {
    title: "영상 전송 방식별 성능 비교",
    headers: [
      "구성",
      "화면을 가져오는 방식",
      "이미지 압축 처리",
      "영상 전송 끔, 초당 화면 갱신",
      "영상 전송 켬, 초당 화면 갱신",
      "초당 카메라 화면 전송",
      "화면 갱신 감소율",
    ],
    rows: [
      ["직접 읽기", "그래픽 작업이 끝날 때까지 기다려 화면을 가져옴", "시뮬레이션 실행 흐름", "102.38", "66.70", "26.95", "34.84%"],
      ["픽셀 임시 저장 공간 두 개", "이전 화면을 읽으며 다음 화면을 다른 공간에 저장", "시뮬레이션 실행 흐름", "102.52", "65.60", "25.49", "36.02%"],
      ["픽셀 임시 저장 공간 두 개와 작업 흐름 네 개", "이전 화면을 읽으며 다음 화면을 다른 공간에 저장", "별도 작업 흐름 네 개", "102.95", "96.01", "40.05", "6.74%"],
    ],
    note: "해상도 1232 x 832에서 영상 전송을 끈 상태와 켠 상태를 각각 5회 측정했습니다.",
  },
  architecture: {
    image: architectureImage,
    alt: "가상 카메라 이미지가 압축되어 인공지능 모듈로 전달되고, 인공지능 명령이 이동 로봇과 로봇 팔 제어로 이어지는 구조",
    summary: [],
    mobileFlows: [
      { title: "가상 카메라 영상", steps: [
        { title: "가상 카메라", detail: "시뮬레이션 화면을 이미지로 캡처" },
        { title: "이미지 압축", detail: "JPEG 형식으로 용량을 줄임" },
        { title: "영상 전달", detail: "Python 인공지능의 학습과 판단 입력으로 전송" },
      ] },
      { title: "외부 제어 명령", steps: [
        { title: "Python 인공지능", detail: "이동과 관절 제어 명령 생성" },
        { title: "시뮬레이터 제어", detail: "명령을 이동과 관절 모터 움직임에 반영" },
        { title: "가상 장비", detail: "이동 로봇, 로봇 팔, 집게와 카메라 움직임" },
      ] },
    ],
  },
  implementations: [
    {
      title: "Qt 제어 화면과 실장비 측정 및 보정",
      body: [
        "Qt는 화면과 버튼을 만드는 C++ 개발 도구입니다. 제어 화면에서 실물 JETANK 이동 로봇의 상태를 확인하고 주행과 관절 모터 입력을 보냅니다.",
        "실물 JETANK의 직진과 회전 값을 측정한 뒤 좌우 모터 입력의 평균과 차이에 따라 가상 이동 로봇의 직진 속도와 회전 속도 계수를 조정했습니다.",
      ],
    },
    {
      title: "이동 로봇과 로봇 팔 제어 명령 연결",
      body: [
        "JSON은 프로그램끼리 항목과 값을 주고받는 문서 형식입니다. Python 인공지능 모듈이 보낸 JSON 명령을 이동 로봇과 관절 모터 제어에 전달합니다.",
        "인공지능이 만드는 명령과 실제 움직임을 계산하는 제어 기능을 분리해, 입력 방식이 바뀌어도 주행 계산을 함께 사용할 수 있게 했습니다.",
      ],
    },
    {
      title: "가상 카메라 이미지 캡처와 압축",
      body: [
        "OpenGL은 3D 화면을 그리는 그래픽 라이브러리입니다. 화면에 바로 띄우지 않는 임시 그림판에 가상 카메라 장면을 그린 뒤 이미지를 읽어 JPEG로 압축해 Python 인공지능 모듈에 전달합니다.",
        "JPEG 압축은 libjpeg 이미지 처리 라이브러리를 연결했습니다. 실행 환경에 따라 사용할 수 있는 구현을 골라 같은 영상 처리 흐름을 유지했습니다.",
      ],
    },
    {
      title: "성능 측정으로 이미지 압축 병목 확인",
      body: [
        "성능 측정 도구 Tracy로 그래픽 장치가 그린 화면을 주 실행 흐름으로 복사하는 시간과 JPEG 압축 시간을 따로 쟀습니다. 화면 읽기는 그래픽 장치의 픽셀을 프로그램이 쓸 수 있게 옮기는 작업입니다.",
        "픽셀 임시 버퍼를 두 개 번갈아 쓰는 구성과 여기에 작업 스레드 네 개를 더한 구성을 비교했습니다. 임시 버퍼만 추가했을 때는 큰 차이가 없었고, 이미지 압축이 오래 걸리는 구간임을 확인했습니다.",
        "JPEG 압축을 대기열에 넣고 별도 작업 스레드, 즉 화면 갱신과 따로 실행되는 작업 흐름이 처리하도록 바꿨습니다. 시뮬레이션을 갱신하는 흐름은 압축이 끝나기를 기다리지 않습니다.",
      ],
    },
  ],
  caseStudies: [
    {
      title: "실물 주행 측정값으로 가상 이동 로봇 보정",
      narrative: [
        "실물 JETANK 이동 로봇에 좌우 모터 입력 0.3을 주고 직진 속도 약 2.4cm/s, 회전 속도 약 24도/s를 측정했습니다. 이 값을 가상 이동 로봇의 속도 계수를 맞추는 기준으로 삼았습니다.",
        "좌우 모터 입력이 같으면 평균값에 따라 앞으로 움직이고, 입력 차이가 나면 그 차이에 따라 회전합니다. 측정한 직진과 회전 속도에 맞춰 두 계산의 계수를 보정했습니다.",
        "속도는 목표값까지 한 번에 바꾸지 않고 화면을 한 번 갱신하는 데 걸린 시간에 맞춰 조금씩 따라가게 합니다. 계산된 속도와 회전량으로 가상 이동 로봇의 위치와 방향을 갱신합니다.",
      ],
      pseudocode: `updateMobileRobot(leftMotor, rightMotor, frameSeconds):
  // frameSeconds는 직전 화면 갱신부터 지난 시간(초)입니다
  // 실물 직진 측정값에 맞춰 좌우 모터 입력의 평균을 앞으로 움직일 속도로 바꿉니다
  targetSpeed = 0.08 * (leftMotor + rightMotor) / 2
  // 실물 회전 측정값에 맞춰 좌우 입력 차이를 회전 속도로 바꿉니다
  targetTurn = 1.3963 * (rightMotor - leftMotor) / 2

  // 화면을 갱신할 때마다 현재 속도를 조금씩 목표값에 가까워지게 해 움직임을 부드럽게 합니다
  speed += (targetSpeed - speed) * 5.0 * frameSeconds
  turn += (targetTurn - turn) * 5.0 * frameSeconds
  // 거의 멈춘 상태의 작은 값은 제거해 입력 노이즈로 인한 흔들림을 막습니다
  if abs(speed) < 0.001: speed = 0
  if abs(turn) < 0.001: turn = 0

  // 현재 방향각을 기준으로 위치와 회전 속도를 갱신합니다
  yaw += turn * frameSeconds
  x -= sin(yaw) * speed * frameSeconds
  z -= cos(yaw) * speed * frameSeconds`,
      pseudocodeLabel: "의사 코드, 좌우 모터 입력에서 위치와 방향 갱신까지",
    },
    {
      title: "화면 임시 저장만으로 해결되지 않아 이미지 압축을 분리",
      narrative: [
        "가상 카메라 영상을 Python 인공지능에 보내자 화면을 갱신하는 속도가 줄었습니다. 먼저 그래픽 장치가 그린 화면을 프로그램으로 가져오는 과정에서 기다리는 것이 원인이라고 보고 픽셀 임시 저장 공간 두 개를 번갈아 쓰도록 바꿨습니다.",
        "측정 결과 임시 저장 공간만 쓴 구성은 영상을 보내는 동안 화면 갱신 속도가 오히려 더 낮았습니다. 성능 측정 도구 Tracy로 화면 복사와 JPEG 압축 시간을 따로 재 보니, 주 실행 흐름에서 이미지 압축에 걸리는 시간이 화면 복사보다 길었습니다.",
        "그래서 압축 라이브러리를 바꾸는 대신 실행 순서를 바꿨습니다. 주 실행 흐름은 캡처한 화면을 대기열에 넣고 시뮬레이션을 이어가며, 별도 작업 흐름 네 개가 대기열의 이미지를 JPEG로 압축하고 전송하도록 구성했습니다.",
        "작업 흐름 하나가 이미지 한 장을 압축하는 시간은 더 길었지만 시뮬레이션은 압축 완료를 기다리지 않습니다. 비교 측정에서 영상 전송 중 화면 갱신 수와 카메라 전송 수가 함께 높아졌습니다.",
      ],
      flow: [
        { title: "현상", detail: "카메라 영상을 보내면 화면 갱신 속도 저하" },
        { title: "첫 확인", detail: "화면을 프로그램으로 가져오는 픽셀 임시 버퍼 적용" },
        { title: "시간 비교", detail: "화면 복사와 이미지 압축에 걸리는 시간 측정" },
        { title: "구조 변경", detail: "이미지 압축을 작업 스레드 네 개로 넘겨 화면 갱신 대기 제거" },
        { title: "결과", detail: "비교표에서 초당 화면 갱신 횟수와 카메라 전송 횟수 확인" },
      ],
      pseudocode: `simulationThread(cameraFrame):
  // 화면을 캡처한 뒤 압축 작업 대기열에 넣습니다
  compressionQueue.add(cameraFrame)
  // 압축이 끝날 때까지 기다리지 않고 다음 화면을 갱신합니다
  updateSimulation()

imageWorker():
  // 별도 작업 스레드가 대기열에서 이미지를 하나씩 꺼냅니다
  while image = compressionQueue.take():
    compressedImage = encodeAsJpeg(image)
    sendImageToPython(compressedImage)

      `,
      pseudocodeLabel: "의사 코드, 화면 갱신과 이미지 압축 분리",
    },
  ],
  links: {
    github: "https://github.com/cgantro/RobotPal",
    demo: null,
  },
  theme: { accent: "#7dd3fc" },
};
