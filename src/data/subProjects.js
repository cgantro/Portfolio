/**
 * 서브 프로젝트 — 작은 카드 (어떤 프로젝트인지 + 기술 스택)
 */
export const subProjects = [
  // ── SSAFY 프로젝트 ──
  {
    id: "autowing",
    title: "오토잉카 (AutoWing Car)",
    subtitle: "공항 스마트 토잉카 관제 시스템",
    period: "2026.01 – 2026.02",
    team: "6인",
    role: "백엔드 전담",
    stack: ["Spring Boot 3.5", "Java 17", "MQTT", "WebSocket/STOMP", "A*", "Yen's K-Shortest", "Redis", "JWT"],
    summary:
      "MQTT로 실물 토잉카와 통신하고, A* + Yen's K-Shortest 서버 사이드 경로 계산으로 이동 명령을 생성하는 공항 지상 관제 시스템",
    cover: "/project-autowing-cover.png",
    links: {},
  },

  // ── 부트캠프 ──
  {
    id: "snackshop",
    title: "Korean Snack Shop",
    subtitle: "해외에 한국 간식을 소개하는 쇼핑 플랫폼",
    period: "2023.08 – 2023.09",
    team: "팀 프로젝트",
    role: "백엔드 (인증/인가, AWS RDS)",
    stack: ["Spring Boot", "Java 17", "Spring Security", "JWT", "Google OAuth2", "AWS RDS", "MySQL"],
    summary:
      "해외에 한국 간식을 소개하는 쇼핑 플랫폼. 회원가입·로그인 인증, JWT, Google OAuth2, AWS RDS 구축 담당",
    cover: null,
    links: {
      github: "https://github.com/codestates-seb/seb45_main_025",
    },
  },

  // ── 학부 개인 프로젝트 ──
  {
    id: "os-lru",
    title: "OS 파일시스템 버퍼 캐시",
    subtitle: "LRU 캐시 알고리즘 직접 구현",
    period: "2023 (학부)",
    team: "개인",
    role: "전담",
    stack: ["C", "OS"],
    summary:
      "원형 연결 큐를 활용한 운영체제 파일시스템 캐시 교체 로직 설계. LRU 정책 직접 구현",
    cover: null,
    links: {},
  },
  {
    id: "stack-calc",
    title: "스택 기반 계산기",
    subtitle: "연산자 우선순위 처리 계산 엔진",
    period: "2023 (학부)",
    team: "개인",
    role: "전담",
    stack: ["C"],
    summary:
      "Stack 자료구조로 연산자 우선순위를 처리하는 계산 엔진 구현. 중위→후위 변환 + 평가",
    cover: null,
    links: {},
  },
  {
    id: "tictactoe-ai",
    title: "TicTacToe AI",
    subtitle: "Minimax + Alpha-Beta Pruning",
    period: "2023 (학부)",
    team: "개인",
    role: "전담",
    stack: ["Python"],
    summary:
      "Minimax + Alpha-Beta Pruning 기반 게임 AI. 게임 상태 트리 탐색 + 재귀 의사결정 + 탐색 공간 최적화",
    cover: null,
    links: {},
  },
  {
    id: "diffsvc",
    title: "Diff-SVC 음성합성 웹서비스",
    subtitle: "음악 + 개발 결합 졸업작품",
    period: "2025 (졸업작품)",
    team: "2인",
    role: "학습·추론 환경 구성",
    stack: ["Python", "Diff-SVC", "FastAPI"],
    summary:
      "Diff-SVC 기반 음성합성 모델 적용 웹서비스. 로컬 GPU 환경에서 학습·추론 파이프라인 구성",
    cover: null,
    links: {},
  },
];
