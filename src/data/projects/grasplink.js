import coverImage from "../../../asset/GraspLink-preview.webp";
import architectureImage from "../../../asset/grasplink-system-architecture.svg";

export default {
  id: "grasplink",
  sectionOrder: ["implementation", "architecture", "case-studies", "sources"],
  title: "GraspLink",
  category: "C++ 로봇 시뮬레이션",
  period: "2026.08 – 진행 중",
  team: "개인 프로젝트",
  role: "로봇 기구학·IK, 관절/TCP 경로 계획, J6 복귀 및 파지 시뮬레이션 구현",
  cardRole: "C++ 로봇 시뮬레이터와 기구학·이동·파지 기능 설계 및 구현",
  summary: [
    "Hanwha HCR-12A 로봇 팔과 Robotiq 2F-85 그리퍼의 Pick-and-Place 작업을 재현하는 C++17 시뮬레이터입니다.",
    "OpenGL·Flecs ECS·Jolt Physics를 연결해 기구학, 관절 및 TCP 경로 계획, 충돌 검사와 접촉 기반 파지를 구현했습니다.",
    "실제 로봇 하드웨어를 제어하는 시스템은 아닙니다.",
  ],
  cover: coverImage,
  stack: [
    "C++17",
    "OpenGL",
    "Flecs ECS",
    "Jolt Physics",
    "Forward Kinematics",
    "Damped Least Squares IK",
    "RRT-Connect",
    "CMake",
    "Emscripten",
    "WebAssembly",
  ],
  architecture: {
    image: architectureImage,
    alt: "로봇 상태를 공통 기구학으로 계산해 화면의 관절과 충돌 형상에 함께 반영하는 구조",
    summary: [
      "시뮬레이션·로보틱스·뷰어·물리 기능을 모듈로 나눴습니다.",
      "물리 모듈이 Flecs나 렌더러에 직접 의존하지 않도록 구성했습니다.",
    ],
    mobileFlows: [
      { title: "이동 계획과 공통 자세", steps: [
        { title: "제어 명령", detail: "관절 또는 TCP 목표" },
        { title: "IK · 경로 계획", detail: "MovePose · MoveLinear · UI RRT" },
        { title: "RobotKinematics", detail: "공통 링크 변환 계산" },
        { title: "화면과 충돌 형상", detail: "OpenGL GLB · Jolt Physics" },
      ] },
      { title: "접촉 기반 파지", steps: [
        { title: "양쪽 손끝 접촉", detail: "같은 동적 물체의 서로 반대쪽 면" },
        { title: "고정 제약 생성", detail: "그리퍼와 물체의 상대 자세를 고정" },
        { title: "함께 이동", detail: "물체를 그리퍼와 연결해 시뮬레이션" },
      ] },
    ],
  },
  implementations: [
    {
      title: "렌더링과 충돌 형상이 공유하는 기구학",
      body: [
        "입력: 모델의 관절 기준점과 제어기가 보고한 관절각.",
        "처리: 관절 회전을 순서대로 누적해 링크별 변환을 계산.",
        "결과: 같은 변환을 GLB 관절과 Jolt Kinematic 충돌 형상에 적용.",
        "설계 이유: 화면과 물리 검사가 서로 다른 관절 자세를 쓰지 않도록 공통 계산을 사용.",
      ],
    },
    {
      title: "TCP 목표와 관절 한계를 반영한 IK",
      body: [
        "입력: 로봇 베이스 기준 TCP 목표와 현재 관절각.",
        "처리: Damped Least Squares IK가 시작값(seed)에서 목표 오차를 줄여 관절 목표를 풉니다. 경로 계획은 현재 자세를 먼저 쓰고, 해가 없거나 경로가 막히면 제한된 대체 시작값을 시험합니다.",
        "관절 한계에 닿은 축이 더 바깥쪽으로 움직이지 않도록 해당 Jacobian 열을 제외해 다시 계산하고, 나머지 관절 변화량도 한계 안에 맞춥니다.",
        "결과: 관절 목표 또는 도달 불가·관절 한계·수렴 실패 등의 상태를 반환합니다.",
        "범위: 시작값 탐색은 제한된 후보만 살펴보므로 모든 해를 찾거나 도달 불가를 증명하지는 않습니다.",
      ],
    },
    {
      title: "MovePose와 UI의 RRT 경로 계획",
      body: [
        "`MovePose`: TCP 목표를 IK 관절 목표로 바꾸고, 시작 자세에서 목표까지의 관절 경로를 검사해 관절 이동으로 넘깁니다.",
        "현재 자세를 먼저 seed로 쓰며, 해가 없거나 경로가 막히면 대체 seed를 시도합니다. 이 동기식 API는 RRT-Connect를 호출하지 않고 TCP 직선도 보장하지 않습니다.",
        "UI 임무의 `BeginPosePlanning`: `AdvanceMotionPlanning` 호출마다 제한된 작업량을 처리하는 별도 계획 API입니다.",
        "직접 관절 경로가 막힐 때 제한된 RRT-Connect를 시도하고, 검증된 경로를 관절 웨이포인트로 실행합니다.",
      ],
    },
    {
      title: "MoveLinear의 표본별 IK와 경로 검사",
      body: [
        "입력 경로에서 TCP 위치는 직선으로, 방향은 quaternion 최단 회전으로 보간합니다.",
        "기본 1 cm 간격으로 표본을 만들고 IK를 풉니다. 앞 표본의 해를 다음 표본의 첫 seed로 쓰며, 해가 없거나 관절 경로가 막힐 때에만 제한된 대체 seed를 시도합니다.",
        "충돌 검사기가 등록된 경우에만 표본 관절 경로를 검사합니다. 전체 경로의 계획과 검증을 마친 뒤 저장된 관절 자세를 보간해 실행합니다.",
        "`BeginLinearPathPlanning`과 `AdvanceMotionPlanning`으로 계산을 여러 번에 나눌 수 있습니다.",
        "연속 해를 찾지 못하면 다른 관절 분기나 RRT로 바꾸지 않고 실패합니다. 표본 사이 모든 자세의 도달 가능성까지 보장하지는 않습니다.",
      ],
    },
    {
      title: "고정 주기 물리와 안전 자세 복원",
      body: [
        "고정 제어 주기마다 로봇·그리퍼 상태와 충돌 형상을 갱신한 뒤 Jolt 물리를 진행합니다.",
        "다음 검사 자세가 환경 또는 허용되지 않은 로봇 자체와 충돌하면 직전 관절 자세로 되돌리고 제어기를 대기 상태(Idle)로 둡니다.",
        "검사 지점에서 자세를 복원하는 보호 동작이며, 이동 구간 전체의 연속 충돌 검사나 장애물 우회 계획은 아닙니다.",
      ],
    },
    {
      title: "양쪽 손끝 접촉으로 고정 제약 파지",
      body: [
        "입력: 물리 계산 뒤의 양쪽 손끝 접촉 정보와 그리퍼 닫힘 상태.",
        "한쪽 손끝이 먼저 닿으면 반대 손끝이 물체를 끼울 때까지 닫힘을 이어갑니다.",
        "양쪽 손끝이 같은 동적 물체의 서로 반대쪽 면에 닿으면 닫힘을 멈추고 그리퍼와 물체 사이에 고정 제약(constraint)을 만듭니다. 이후 물체는 그리퍼와 함께 움직입니다.",
        "범위: 접촉 조건으로 파지를 단순화한 시뮬레이션입니다. 손끝의 힘·마찰이나 실제 파지력은 계산하지 않습니다.",
      ],
    },
  ],
  caseStudies: [
    {
      title: "J6 영점 복귀가 −360° 목표로 바뀌던 문제",
      flow: [
        { label: "증상", detail: "−314.5°에서 요청한 0°로 복귀하지 못함" },
        { label: "가설 확인", detail: "관절 한계는 ±360°였고 명령은 수락됨" },
        { label: "원인", detail: "등가각 정렬이 목표를 −360°로 변경" },
        { label: "판단", detail: "일반 이동 영향 방지를 위해 요청별 `preserveJointTurns` 적용" },
        { label: "검증", detail: "±1° 미션 게이트와 영점 복귀 회귀 테스트" },
      ],
      narrative: [
        "Pick-and-Place 임무가 J6을 0°로 돌려놓지 못했습니다. 처음에는 관절 한계를 의심했지만, 범위는 ±360°였고 명령도 수락됐습니다.",
        "J6이 −314.5°일 때 가까운 등가각 정렬이 요청한 0°를 −360°로 바꿀 수 있었습니다. 모든 명령에서 정렬을 끄면 일반 이동의 짧은 회전 선택도 달라져, 정책을 요청별로 나눴습니다.",
        "`preserveJointTurns`는 기본적으로 끄고 J6 영점 복귀에서만 켭니다. 언와인드 후 실제 J6이 0° ±1°일 때만 픽업을 시작하고, 임무 완료 조건도 같은 방식으로 확인합니다.",
        "회귀 테스트는 −314.5°에서 0° 복귀를 1e−8 rad 허용 오차로 확인합니다. 이 검증은 제어기 동작을 다루며 Viewer 전체 임무나 실제 로봇 제어 결과를 포함하지 않습니다.",
      ],
      pseudocode: `// 일반 관절 이동은 가까운 등가각을 선택
MovePose(target):
  q = nearestEquivalentAngle(current, target)
  executeIfJointPathClear(q)

// 임무 시작·종료 때만 J6의 실제 영점 복귀
UnwindJ6():
  target.J6 = 0°
  move(target, preserveTurns=true)
  if abs(actual.J6) <= 1°:
    startPickAndPlace()
  else:
    stopMission()`,
      pseudocodeLabel: "의사 코드 · 일반 이동과 J6 영점 복귀 정책",
    },
    {
      title: "pthreads 빌드가 로컬 파일에서 멈추던 문제",
      flow: [
        { title: "로컬 파일 실행", detail: "file:// 페이지의 origin은 null" },
        { title: "Worker 생성 실패", detail: "브라우저 보안 정책이 pthread Worker를 차단" },
        { title: "실행 조건 확인", detail: "HTTPS와 crossOriginIsolated 필요" },
        { title: "배포 경로 구성", detail: "단일 HTML 자산과 COI Service Worker를 Pages에 배포" },
        { title: "브라우저 확인", detail: "배포 후 Worker 생성과 격리 상태를 실제 확인해야 함" },
      ],
      narrative: [
        "Emscripten pthreads 빌드를 `file://`로 열자 Worker 생성은 origin `null`에서 차단됐고, 별도 파일로 생성된 자산을 가져오는 요청도 CORS에 막혔습니다. HTML에 자산을 합치는 것만으로는 브라우저의 스레드 보안 조건이 해결되지 않았습니다.",
        "원인은 파일 묶음과 실행 환경을 같은 문제로 본 데 있었습니다. pthreads는 `SharedArrayBuffer`를 쓰므로 페이지가 HTTPS 같은 보안 출처에서 실행되고 `crossOriginIsolated` 상태여야 합니다. COI Service Worker도 `file://`에서는 등록할 수 없습니다.",
        "로컬 파일 실행을 스레드 요구사항의 우회 경로로 삼지 않고, Emscripten pthread 플래그와 단일 HTML 자산 묶음을 유지한 채 GitHub Pages용 HTTPS 산출물을 별도로 배포하도록 구성했습니다. 페이지와 Worker 요청에 COOP·COEP 응답 헤더를 적용할 COI Service Worker도 배포 루트에 포함했습니다.",
        "이 구성은 브라우저의 실행 조건을 맞추기 위한 배포 경로입니다. GitHub Pages 배포와 실제 브라우저의 `crossOriginIsolated`, Worker 생성 검증은 아직 남아 있습니다.",
      ],
      pseudocode: `if pthreadsEnabled:
  require(HTTPS)
  require(COOP && COEP)
  assert(crossOriginIsolated)
  loadWorkerAssets()
  startWorkers()`,
      pseudocodeLabel: "의사 코드 · 브라우저 pthreads 실행 조건",
    },
  ],
  links: {
    github: "https://github.com/cgantro/GraspLink",
    demo: "/Portfolio/minibcg/index.html",
  },
  theme: { accent: "#67e8f9" },
};
