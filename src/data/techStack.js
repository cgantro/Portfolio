export const techStack = [
  {
    category: "C++ 시스템 개발",
    evidence: "GraspLink, RobotPal, 영묘",
    items: [
      { name: "C++17", detail: "로봇과 서버 프로그램 구현" },
      { name: "STL", detail: "C++ 표준 자료 구조와 알고리즘" },
      { name: "CMake", detail: "프로그램 빌드 설정 관리" },
      { name: "멀티스레딩", detail: "여러 작업 흐름을 동시에 실행" },
    ],
  },
  {
    category: "시뮬레이션과 그래픽스",
    evidence: "GraspLink, RobotPal",
    items: [
      { name: "OpenGL", detail: "3D 화면 그리기" },
      { name: "Flecs", detail: "로봇과 물체의 상태, 동작 관리" },
      { name: "Jolt Physics", detail: "물체 움직임과 충돌 계산" },
    ],
  },
  {
    category: "실시간 통신과 영상 및 음성 전송",
    evidence: "RobotPal, 영묘",
    items: [
      { name: "TCP", detail: "데이터 순서를 지켜 전달" },
      { name: "WebSocket", detail: "연결을 유지해 양방향 통신" },
      { name: "JPEG", detail: "이미지 파일 크기 축소" },
      { name: "UDP", detail: "지연을 줄이는 음성 전송" },
      { name: "Opus", detail: "실시간 음성 압축" },
      { name: "언리얼 엔진 5", detail: "3D 게임 화면과 서버 개발" },
    ],
  },
  {
    category: "성능 분석과 검증",
    evidence: "RobotPal, GraspLink, 오토윙카",
    items: [
      { name: "Tracy", detail: "프로그램 구간별 실행 시간 측정" },
      { name: "Google Benchmark", detail: "C++ 기능의 실행 시간 비교" },
      { name: "CTest", detail: "C++ 자동 검사 실행" },
      { name: "k6", detail: "가상 접속을 만들어 부하 측정" },
    ],
  },
];

export const supportingTechnologies = {
  label: "보조 기술",
  evidence: "오토윙카",
  items: [
    { name: "Java 17", detail: "서버 프로그램 언어" },
    { name: "Spring Boot", detail: "Java 서버 개발 도구" },
    { name: "Redis", detail: "자주 쓰는 값을 빠르게 임시 저장" },
    { name: "PostgreSQL", detail: "관계형 데이터베이스" },
  ],
};
