import coverImage from "../../../asset/GraspLink.gif";

export default {
  id: "grasplink",
  title: "GraspLink",
  category: "C++ 로봇 시뮬레이션",
  period: null,
  team: "개인 프로젝트",
  role: "개인 프로젝트로 설계·구현",
  summary:
    "C++17로 Hanwha HCR-12A 6축 로봇 팔과 Robotiq 2F-85 그리퍼의 시뮬레이션을 구현했습니다. OpenGL 뷰어와 Flecs ECS, Jolt Physics를 연결하고 FK·DLS IK, MoveJ·MoveLinear, 충돌 검사와 Pick-and-Place 흐름을 구성했습니다. 실제 로봇 하드웨어를 구동하는 제어기는 아닙니다.",
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
  metrics: [
    {
      label: "GLB 좌표 변환 최대 정점 차이",
      value: "1.192e-7 m",
      context:
        "개발 기록에 남은 좌표 변환 전후의 최대 정점 위치 차이입니다. 모델 자산 변환을 확인한 값이며 실제 로봇의 위치 정확도와는 다릅니다.",
    },
    {
      label: "IK 실패 사례의 유효 초기값 탐색",
      value: "136개 중 38개 수렴",
      context:
        "특정 실패 사례를 재현해 기록한 결과입니다. 전체 목표의 성공률을 뜻하지 않습니다.",
    },
    {
      label: "경로 스트레스 샘플",
      value: "64개 중 51개 통과",
      context:
        "개발 기록에 남은 결과입니다. 충돌 검사 함수가 항상 '충돌 없음'을 반환하도록 둔 조건에서 얻었으므로, 실제 충돌 회피 성능을 보여주는 수치가 아닙니다.",
    },
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
        "Damped Least Squares IK로 TCP 목표에 도달할 관절각을 구합니다. MoveJ는 관절 경로를 검사하고, 직접 경로를 찾지 못하면 제한된 RRT-Connect를 시도합니다. 이 경로는 TCP가 직선으로 움직인다는 보장은 없습니다. MoveLinear는 TCP가 직선으로 이동하고 최단 회전 경로를 따르도록 경로를 나눠 계산하며, 직전 IK 해를 다음 계산의 초기값으로 사용합니다.",
    },
    {
      title: "고정 주기 물리와 안전 자세 복원",
      body:
        "정해진 제어 주기마다 로봇·그리퍼 상태와 충돌 형상을 갱신한 뒤 Jolt 물리를 진행합니다. 새 자세가 환경이나 허용되지 않은 로봇 자체의 충돌을 일으키면 직전의 안전한 관절 자세로 되돌리고 제어기를 대기 상태(Idle)로 둡니다.",
    },
    {
      title: "그리퍼 상태와 접촉 기반 파지",
      body:
        "2F-85는 팔의 직렬 FK와 다른 방식으로 움직이는 분기형 구조라, 그리퍼의 닫힘 비율(closure fraction)을 따로 계산합니다. 시뮬레이션에서는 양쪽 손끝이 같은 물체에 서로 반대쪽에서 닿으면 고정 제약(constraint)을 만들어 물체를 집습니다.",
    },
  ],
  caseStudies: [
    {
      title: "IK 실패가 목표 문제인지 초기값 문제인지 확인",
      situation:
        "일부 TCP 목표에서 현재 IK 탐색이 해를 찾지 못했습니다. 실패만으로 목표 자체가 도달 불가능하다고 단정할 수는 없었습니다.",
      analysis:
        "특정 실패 사례에서 유효한 초기 관절값 136개를 시도해 38개가 해를 찾았습니다. 초기값에 따라 결과가 달라질 수 있음을 보여주는 사례지만, 전체 목표에 대한 성공률은 아닙니다.",
      decision:
        "현재 관절값으로 해를 찾지 못하면 유효한 초기 관절값을 더 시도하고, 찾은 해마다 관절 한계와 경로 충돌 여부를 확인하도록 했습니다.",
      implementation:
        "목표 자세의 IK 해를 찾는 과정과 관절 경로 검증을 분리합니다. 이동 작업은 비동기로 경로를 계산하고, TCP가 연속해서 움직일 때는 앞선 경로 지점에서 구한 IK 해를 다음 지점의 초기값으로 이어 씁니다.",
      verification:
        "실패 사례에서 초기값별로 IK가 해를 찾았는지 비교했습니다. 136개 중 38개라는 값은 이 사례에만 해당합니다.",
      limitations:
        "이 수치만으로 모든 목표에 도달할 수 있는지, 전체 성공률이 얼마인지 판단할 수 없습니다. 현재 공개 문서에는 이 초기값 탐색 집계가 없습니다.",
    },
    {
      title: "관절 경로와 TCP 직선 경로를 구분",
      situation:
        "관절 공간에서 문제가 없는 MoveJ 경로라도 TCP가 직선으로 움직이지는 않습니다. TCP 직선 이동 중에는 한 IK 해의 다음 지점 해를 이어 찾지 못하는 경우도 있습니다.",
      analysis:
        "MoveJ는 관절 경로를 계획하고, 직접 갈 수 없으면 제한된 RRT-Connect를 시도합니다. MoveLinear는 TCP 위치를 직선으로 옮기고 최단 회전 경로를 따르므로 각 경로 지점에서 IK 해를 이어서 찾아야 합니다.",
      decision:
        "요청한 이동 방식에 맞는 계획기를 사용합니다. MoveLinear는 앞 지점의 IK 해를 우선 이어가고, 이어갈 수 없을 때만 다른 IK 해를 탐색합니다.",
      implementation:
        "시뮬레이션 제어기에서 관절 경로와 TCP 경로를 따로 계산하고, 두 경로 모두 관절 자세마다 충돌 여부를 확인합니다.",
      verification:
        "공개된 이동 명세에서 MoveJ가 TCP 직선 이동을 보장하지 않는 점, MoveLinear가 TCP 직선과 최단 회전을 따르는 점, 다음 경로 지점에 이전 IK 해를 사용하는 규칙을 확인했습니다.",
      limitations:
        "계획한 경로는 시뮬레이션용입니다. 토크·질량·관성을 바탕으로 한 동역학은 계산하지 않으며, 실제 로봇의 이동 정확도나 안전성을 보장하지 않습니다.",
    },
  ],
  decisionVisual: {
    title: "IK가 실패했을 때 다시 확인하는 순서",
    code: `// 판단 흐름을 설명하기 위한 의사 코드입니다. 실제 구현 코드가 아닙니다.
result = solveIK(targetPose, seed = currentJointAngles)

if (!result.converged) {
  candidates = retryWithOtherSeeds(targetPose)
  result = chooseCandidateWithinJointLimits(candidates)
}

if (result.exists && isCollisionFree(result.path)) {
  simulate(result.path)
} else {
  rejectPlan()
}`,
    steps: [
      {
        label: "현재 자세로 시도",
        detail: "현재 관절값을 초기값으로 삼아 목표 TCP의 IK 해를 찾습니다.",
      },
      {
        label: "다른 초기값으로 재시도",
        detail: "해를 찾지 못하면 유효한 다른 초기 관절값을 시도해 결과가 달라지는지 확인합니다.",
      },
      {
        label: "관절 조건 확인",
        detail: "해를 찾은 후보 가운데 관절 한계를 지키고 경로에 충돌이 없는 자세만 남깁니다.",
      },
      {
        label: "시뮬레이션 경로 결정",
        detail: "조건을 통과한 후보만 시뮬레이션 경로로 넘기고, 나머지는 거부합니다.",
      },
    ],
    note:
      "의사 코드와 단계 설명은 IK 실패 사례의 판단 과정을 쉽게 보여주기 위한 요약입니다. 실제 소스 코드나 전체 구현 절차를 그대로 옮긴 것이 아닙니다. 136개 중 38개가 해를 찾았다는 결과도 특정 사례에 한정됩니다.",
  },
  verification: {
    summary:
      "공개 저장소의 README와 아키텍처 문서를 바탕으로 시뮬레이션 범위와 이동·물리 동작을 정리했습니다. 초기값 탐색과 스트레스 테스트 수치는 제공된 설계안에 기록된 특정 사례로 한정해 적었습니다.",
    items: [
      "공개 README: C++17, Hanwha HCR-12A, Robotiq 2F-85, FK·IK, 충돌 검사, Pick-and-Place 및 Windows/Web 실행을 명시",
      "공개 아키텍처 문서: 공통 로봇 기구학, MoveJ·MoveLinear의 차이, 제한된 RRT-Connect, 고정 주기 충돌 검사 설명",
      "실제 장치 제어, 토크·질량·관성 기반 동역학, 하드웨어 그리퍼 연결부는 구현 범위에서 제외",
      "GLB 정점 오차·초기값 탐색·스트레스 테스트 수치는 제공된 기록의 제한 조건과 함께 표기",
    ],
  },
  links: {
    github: "https://github.com/cgantro/GraspLink",
    demo: "https://cgantro.github.io/Portfolio/minibcg/index.html",
  },
  theme: { accent: "#67e8f9" },
};
