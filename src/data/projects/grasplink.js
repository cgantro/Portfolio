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
      title: "도달 가능한 목표인데 직선 TCP 경로가 중간에서 끊기던 문제",
      flow: [
        { label: "증상", detail: "도달 가능한 끝점인데 경로 중간의 IK 표본에서 계획 거절" },
        { label: "원인 분리", detail: "동일 표본에 136개 합법 seed를 시험해 38개 수렴 확인" },
        { label: "수정", detail: "기존 자세와 관절 분기 탐색 뒤 결정적 seed 재시작" },
        { label: "절충", detail: "속도 기반 후보 선택의 지연 회귀를 확인하고 거리 점수 유지" },
        { label: "검증", detail: "특이 자세의 FK 목표와 controller 경로 회귀 테스트" },
      ],
      narrative: [
        "FK로 확인한 TCP 끝점에 도달할 수 있는데도, 그 끝점까지 직선으로 보간한 TCP 경로는 중간 표본에서 IK가 실패해 거절됐습니다. 끝점 하나의 도달 가능성과 경로 전체의 도달 가능성은 서로 다른 문제였습니다.",
        "먼저 같은 실패 표본에 관절 한계 안의 seed 136개를 넣었습니다. 그중 38개가 수렴했습니다. 이 결과는 목표 자체에 해가 없는 것이 아니라 기존 시작 자세 주변의 제한된 탐색이 해를 놓칠 수 있음을 보여줬습니다.",
        "기존 자세의 DLS 풀이로 표본 간 관절 연속성을 먼저 유지합니다. 대표 관절 분기 seed도 실패하면, 관절 범위에 고르게 퍼지는 결정적 Halton seed를 제한된 수만큼 시도합니다. 후보는 관절 범위로 정규화한 이동량과 한계 근접 페널티로 비교하고, 선택 전에 관절 경로와 충돌 조건을 검사합니다.",
        "후보를 최대 관절 속도 기준 예상 시간으로 고르는 대안은 제한된 계획 tick 안에 끝나지 않는 경로를 만들었습니다. 이 점수 변경은 제외하고, 기존 관절 범위 정규화 거리 기준을 유지했습니다.",
        "회귀 테스트는 특이한 영점 자세에서 FK로 만든 도달 가능 목표를 대상으로 합니다. 단일 seed 풀이 실패하는 것을 확인한 뒤 제한된 대체 seed가 목표를 복원하는지, TCP 위치·방향 오차와 반복 수가 기준 안에 드는지 검사합니다. controller 테스트는 실제 계획 결과가 완료되고 관절 한계와 TCP 오차 기준을 만족하는지 확인합니다.",
        "재시작은 정해진 수의 후보만 검사하므로 모든 목표에 대한 해 존재나 전역 최적 경로를 보장하지 않습니다.",
      ],
      sourceLinks: [
        {
          label: "선형 경로 계획기",
          url: "https://github.com/cgantro/GraspLink/blob/master/modules/robotics/src/planning/LinearPathPlanner.cpp",
        },
        {
          label: "IK 재시작 seed 생성",
          url: "https://github.com/cgantro/GraspLink/blob/master/modules/robotics/include/robotics/kinematics/detail/AlternativeIkSeeds.h",
        },
        {
          label: "특이 자세 및 경로 회귀 테스트",
          url: "https://github.com/cgantro/GraspLink/blob/master/tests/RobotMotionTests.cpp#L1240",
        },
        {
          label: "단일 seed 국소 수렴 테스트",
          url: "https://github.com/cgantro/GraspLink/blob/master/tests/RobotInverseKinematicsTests.cpp#L227",
        },
      ],
    },
  ],
  links: {
    github: "https://github.com/cgantro/GraspLink",
    demo: "/Portfolio/minibcg/index.html",
  },
  theme: { accent: "#67e8f9" },
};
