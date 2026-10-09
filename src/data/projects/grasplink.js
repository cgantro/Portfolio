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
      "제어기 상태를 RobotKinematics에서 계산하고, 결과를 GLB 관절과 Jolt 충돌 형상에 함께 반영합니다.",
      "시뮬레이션·로보틱스·뷰어·물리 기능을 모듈로 나눴습니다.",
      "물리 모듈이 Flecs나 렌더러에 직접 의존하지 않도록 구성했습니다.",
    ],
    flow: [
      { title: "제어기", detail: "관절 목표와 이동 명령" },
      { title: "기구학 계산", detail: "FK · IK · 경로 표본" },
      { title: "공통 자세", detail: "관절 변환 · 충돌 형상" },
      { title: "화면 · 물리", detail: "OpenGL · Jolt Physics" },
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
        "회귀 테스트는 −314.5°에서 0° 복귀를 1e−8 rad 허용 오차로 확인합니다. 개발 일지에는 당시 CTest 20/20 통과가 기록돼 있으며, Viewer 전체 임무와 실제 로봇 제어 결과는 확인하지 않았습니다.",
      ],
      pseudocode: `// 일반 이동은 짧은 회전 경로를 유지
MovePose(request):
  target = nearest_equivalent_angle(current, request)
  execute_if_joint_path_is_valid(target)

// 임무 시작·종료 때만 J6의 실제 영점 복귀
UnwindJ6():
  target.J6 = 0 degrees
  preserveJointTurns = true
  execute(target)
  if abs(actual.J6) > 1 degree:
    stop_mission()
  else:
    continue_pick_and_place()`,
      pseudocodeLabel: "의사 코드 · 일반 이동과 J6 영점 복귀 정책",
      code: `void CheckExplicitWristUnwindPreservesZeroRepresentation()
{
    SimRobotController controller(models::hanwha::kHcr12a);
    ASSERT_TRUE((static_cast<bool>(controller.Connect()))) << "wrist unwind controller connects";

    JointMoveCommand nearNegativeLimit;
    nearNegativeLimit.targetPositionRadians.assign(6, 0.0);
    nearNegativeLimit.targetPositionRadians.back() = -314.5 * 3.14159265358979323846 / 180.0;
    nearNegativeLimit.preserveJointTurns = true;
    ASSERT_TRUE((static_cast<bool>(controller.MoveJoint(nearNegativeLimit)))) << "J6 accepts its explicit negative-turn representation";
    ASSERT_TRUE(AdvanceUntilIdle(controller, 0.01)) << "motion reaches target within bounded updates";
    ASSERT_NEAR(controller.GetState().jointPositionRadians.back(), nearNegativeLimit.targetPositionRadians.back(), 1e-8) << "J6 reaches negative 314.5 degrees without changing to an equivalent turn";

    JointMoveCommand unwind;
    unwind.targetPositionRadians = controller.GetState().jointPositionRadians;
    unwind.targetPositionRadians.back() = 0.0;
    unwind.preserveJointTurns = true;
    ASSERT_TRUE((static_cast<bool>(controller.MoveJoint(unwind)))) << "explicit J6 unwind request is accepted";
    ASSERT_TRUE(AdvanceUntilIdle(controller, 0.01)) << "motion reaches target within bounded updates";
    ASSERT_NEAR(controller.GetState().jointPositionRadians.back(), 0.0, 1e-8) << "J6 returns to the central zero degree representation instead of the nearby negative 360 degree turn";
}`,
      codeLanguage: "cpp",
      codeLabel: "J6 −314.5°에서 0° 복귀를 확인하는 회귀 테스트 (219–239행)",
      codeSource:
        "https://github.com/cgantro/GraspLink/blob/18ad54b63311e331c927e66ea487af4264d49132/tests/RobotMotionTests.cpp#L219-L239",
      sourceLinks: [
        {
          label: "MovePose 구현",
          url: "https://github.com/cgantro/GraspLink/blob/18ad54b63311e331c927e66ea487af4264d49132/modules/robotics/src/backends/simulation/SimRobotController.cpp#L430-L456",
        },
        {
          label: "MoveLinear 구현",
          url: "https://github.com/cgantro/GraspLink/blob/18ad54b63311e331c927e66ea487af4264d49132/modules/robotics/src/backends/simulation/SimRobotController.cpp#L550-L576",
        },
        {
          label: "MoveLinear 경로 및 충돌 검사 조건",
          url: "https://github.com/cgantro/GraspLink/blob/18ad54b63311e331c927e66ea487af4264d49132/modules/robotics/include/robotics/backends/simulation/SimRobotController.h#L109-L120",
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
