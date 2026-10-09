import coverImage from "../../../asset/GraspLink-preview.webp";

export default {
  id: "grasplink",
  sectionOrder: ["implementation", "architecture", "case-studies", "verification", "sources"],
  title: "GraspLink",
  category: "C++ 로봇 시뮬레이션",
  period: "2026.08 – 진행 중",
  team: "개인 프로젝트",
  role: "개인 프로젝트로 설계·구현",
  cardRole: "C++ 로봇 시뮬레이터와 기구학·이동·파지 기능 설계 및 구현",
  summary:
    "Hanwha HCR-12A 로봇 팔과 Robotiq 2F-85 그리퍼의 Pick-and-Place 작업을 재현하는 C++17 시뮬레이터입니다. OpenGL·Flecs ECS·Jolt Physics를 연결해 로봇 기구학, 관절 및 TCP 경로 계획, 충돌 검사와 접촉 기반 파지를 구현했습니다. 실제 로봇 하드웨어를 제어하는 시스템은 아닙니다.",
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
    image: null,
    alt: "로봇 제어기 상태를 공통 기구학으로 계산해 화면의 관절과 충돌 형상에 함께 반영하는 구조",
    summary:
      "제어기에서 받은 로봇 상태를 RobotKinematics에서 계산해 GLB 관절과 Jolt 충돌 형상에 똑같이 반영합니다. 시뮬레이션·로보틱스·뷰어·물리 기능을 모듈로 나누고, 물리 모듈이 Flecs나 렌더러에 직접 의존하지 않도록 구성했습니다.",
    flow: [
      { title: "제어기", detail: "관절 목표와 이동 명령" },
      { title: "기구학 계산", detail: "FK · IK · 경로 표본" },
      { title: "공통 자세", detail: "관절 변환 · 충돌 형상" },
      { title: "화면 · 물리", detail: "OpenGL · Jolt Physics" },
    ],
  },
  implementations: [
    {
      title: "렌더링과 충돌에 공통 로봇 자세 사용",
      body:
        "각 관절의 기준점(bind pivot)을 바탕으로 관절 회전을 차례로 누적해 로봇 자세를 계산합니다. 같은 계산 결과를 GLB 관절과 링크별 Kinematic 충돌 형상에 적용해 화면과 충돌 검사에서 서로 다른 자세를 사용하지 않도록 했습니다.",
    },
    {
      title: "목표 자세와 TCP 직선 이동 분리",
      body:
        "MovePose는 목표 TCP 자세를 IK로 관절 목표로 바꿔 관절 경로로 이동합니다(MoveJ 방식). 현재 자세를 먼저 해 탐색에 사용하고, 직접 경로가 충돌하면 제한된 RRT-Connect를 시도합니다. TCP 직선 이동은 보장하지 않습니다. UI 미션은 같은 관절 경로 계획을 `BeginPosePlanning`으로 여러 프레임에 나눠 처리합니다. MoveLinear는 TCP 위치의 직선과 최단 회전을 표본별로 미리 계획하고 충돌을 확인한 뒤, 저장한 관절 자세를 보간해 실행합니다. 직전 표본의 IK 해를 다음 표본의 초기값으로 쓰며, 연속 해를 찾지 못하면 다른 경로 방식으로 바꾸지 않고 실패합니다.",
    },
    {
      title: "고정 주기 물리와 안전 자세 복원",
      body:
        "정해진 제어 주기마다 로봇·그리퍼 상태와 충돌 형상을 갱신한 뒤 Jolt 물리를 진행합니다. 다음 검사 자세가 환경이나 허용되지 않은 로봇 자체의 충돌과 겹치면 직전 관절 자세로 되돌리고 제어기를 대기 상태(Idle)로 둡니다. 이는 검사 지점에서 자세를 복원하는 보호 동작으로, 이동 구간 전체의 연속 충돌 검사나 장애물을 우회하는 경로 계획은 아닙니다.",
    },
    {
      title: "그리퍼 상태와 접촉 기반 파지",
      body:
        "2F-85는 팔의 직렬 FK와 다른 방식으로 움직이는 분기형 구조라, 그리퍼의 닫힘 비율(closure fraction)을 따로 계산합니다. 시뮬레이션에서는 양쪽 손끝이 같은 물체에 서로 반대쪽에서 닿으면 고정 제약(constraint)을 만들어 물체를 집습니다.",
    },
  ],
  caseStudies: [
    {
      title: "J6 영점 복귀가 −360° 목표로 바뀌던 문제",
      situation:
        "J6이 −314.5°인 상태에서 임무가 0° 복귀를 요청했지만, 짧은 회전을 우선하는 등가각 정렬이 목표를 −360°로 바꿀 수 있었습니다. 명령은 수락돼도 중앙 위치로 돌아오지 않는 문제였습니다.",
      analysis:
        "일반 관절 이동에서는 현재 자세와 가까운 등가각을 선택하는 것이 효율적이지만, 임무의 J6 언와인드는 실제 0° 회전 표현을 요구합니다. 두 동작에 같은 각도 정렬 규칙을 적용한 것이 원인이었습니다.",
      decision:
        "일반 이동의 짧은 회전 선택은 유지하고, J6을 지정된 영점으로 복귀시키는 명령에서만 회전수를 보존하도록 분리했습니다.",
      implementation:
        "Pick-and-Place 임무가 J6 목표를 0°로 지정하고 `preserveJointTurns`를 켜도록 수정했습니다. 언와인드 뒤 관절각이 ±1° 안에 있는지 확인한 뒤에만 픽업을 시작하며, 임무 완료도 같은 조건을 통과해야 인정합니다.",
      verification:
        "회귀 테스트에서 J6이 −314.5°일 때 언와인드를 요청하고, 최종 관절각이 −360°가 아닌 0°인지 확인합니다.",
      limitations:
        "검증은 시뮬레이션 제어기와 자동 회귀 테스트 범위입니다. 실제 로봇에서 언와인드나 Pick-and-Place를 실행한 결과는 아닙니다.",
      code: `JointMoveCommand unwind;
unwind.targetPositionRadians = controller.GetState().jointPositionRadians;
unwind.targetPositionRadians.back() = 0.0;
unwind.preserveJointTurns = true;
ASSERT_TRUE((static_cast<bool>(controller.MoveJoint(unwind)))) << "explicit J6 unwind request is accepted";
ASSERT_TRUE(AdvanceUntilIdle(controller, 0.01)) << "motion reaches target within bounded updates";
ASSERT_NEAR(controller.GetState().jointPositionRadians.back(), 0.0, 1e-8) << "J6 returns to the central zero degree representation instead of the nearby negative 360 degree turn";`,
      codeLanguage: "cpp",
      codeLabel: "J6 언와인드 회귀 테스트 발췌",
      codeSource:
        "https://github.com/cgantro/GraspLink/blob/master/tests/RobotMotionTests.cpp#L219-L238",
    },
  ],
  verification: {
    summary:
      "시뮬레이션은 로봇 기구학, 경로 계획, 충돌 검사까지 다룹니다.",
    items: [
      "지원 빌드: Windows 네이티브와 WebAssembly 타깃",
      "MovePose는 TCP 목표를 관절 공간 경로로 실행하며 직선 TCP 이동을 보장하지 않음",
      "MoveLinear는 TCP 직선·최단 회전 경로를 표본별로 계획하고 검사한 뒤 실행함. 표본 사이의 모든 자세를 수학적으로 보장하지는 않음",
      "J6 영점 복귀 정책은 자동 회귀 테스트로 확인. 실제 로봇에서 실행한 제어 결과는 없음",
      "실제 장치 제어, 토크·질량·관성 기반 동역학, 하드웨어 그리퍼 연결부는 구현 범위에서 제외",
    ],
  },
  links: {
    github: "https://github.com/cgantro/GraspLink",
    demo: "/Portfolio/minibcg/index.html",
  },
  theme: { accent: "#67e8f9" },
};
