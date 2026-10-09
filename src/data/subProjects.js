/**
 * 서브 프로젝트 — 작은 카드 (어떤 프로젝트인지 + 기술 스택)
 */
export const subProjects = [
  {
    id: "media-workbench",
    title: "Media Workbench",
    subtitle: "영상에서 음성을 뽑고 말한 내용을 글로 옮기는 Windows 프로그램",
    period: "2026.06",
    team: "개인 프로젝트",
    role: "설계 및 구현",
    stack: ["C++17", "Windows 화면 제어", "FFmpeg 영상과 음성 변환", "Whisper 음성 인식", "CUDA 그래픽 연산", "CMake 빌드 설정", "Inno Setup 설치 파일"],
    summary:
      "FFmpeg로 영상 파일에서 음성 파일을 만들고, Whisper 음성 인식 모델로 변환한 말을 글 파일에 저장하는 Windows 프로그램입니다. 음성 변환과 글 변환 화면을 나눠 만들고, 그래픽 연산 장치에서 음성 인식을 실행할 구성 요소까지 설치 파일에 포함했습니다.",
    cover: null,
    links: {
      github: "https://github.com/cgantro/MP3-Extractor---STT",
    },
  },

  // ── 부트캠프 ──
  {
    id: "snackshop",
    title: "Korean Snack Shop",
    subtitle: "해외에 한국 간식을 소개하는 쇼핑 플랫폼",
    period: "2023.08 – 2023.09",
    team: "팀 프로젝트",
    role: "백엔드 (인증/인가, AWS RDS)",
    stack: ["Spring Boot Java 서버 도구", "Java 17", "Spring Security 로그인 관리", "JWT 서명 로그인 토큰", "Google 계정 로그인 연결", "AWS RDS 관리형 데이터베이스", "MySQL 관계형 데이터베이스"],
    summary:
      "해외에 한국 간식을 소개하는 쇼핑 플랫폼입니다. 회원가입과 로그인 확인, 구글 계정 로그인 연결, 로그인 토큰 발급과 관리형 데이터베이스 구성을 맡았습니다.",
    cover: null,
    links: {
      github: "https://github.com/codestates-seb/seb45_main_025",
    },
  },

  // ── 학부 개인 프로젝트 ──
  {
    id: "os-lru",
    title: "운영체제 파일 읽기 캐시",
    subtitle: "최근에 읽은 파일 데이터를 메모리에 남기는 기능",
    period: "2023 (학부)",
    team: "개인",
    role: "전담",
    stack: ["C", "OS"],
    summary:
      "최근에 사용한 파일 데이터는 남기고 가장 오래 사용하지 않은 데이터를 교체하는 LRU 방식을 직접 구현했습니다. 원형 연결 대기열로 교체 순서를 관리했습니다.",
    cover: null,
    links: {},
  },
  {
    id: "stack-calc",
    title: "스택 기반 계산기",
    subtitle: "괄호와 사칙연산 순서를 지키는 계산 엔진",
    period: "2023 (학부)",
    team: "개인",
    role: "전담",
    stack: ["C"],
    summary:
      "마지막에 넣은 값을 먼저 꺼내는 스택 자료구조로 연산자 우선순위를 처리했습니다. 일반 수식을 계산하기 쉬운 순서로 바꾼 뒤 결과를 구합니다.",
    cover: null,
    links: {},
  },
  {
    id: "tictactoe-ai",
    title: "틱택토 인공지능",
    subtitle: "앞으로 둘 수를 살펴 유리한 선택을 고르는 프로그램",
    period: "2023 (학부)",
    team: "개인",
    role: "전담",
    stack: ["Python"],
    summary:
      "가능한 다음 수를 살펴 각 선택의 유불리를 비교합니다. 결과가 바뀔 수 없는 선택지는 중간에 제외해 탐색량을 줄였습니다.",
    cover: null,
    links: {},
  },
  {
    id: "diffsvc",
    title: "음성 변환 웹서비스",
    subtitle: "입력한 음성의 음색을 바꾸는 졸업 작품",
    period: "2025 (졸업작품)",
    team: "2인",
    role: "학습과 추론 환경 구성",
    stack: ["Python", "Diff-SVC 음성 변환 모델", "FastAPI Python 웹 서버 도구"],
    summary:
      "Diff-SVC 음성 변환 모델을 웹서비스에 연결했습니다. 개인 컴퓨터의 그래픽 연산 장치에서 모델을 학습시키고 입력 음성의 변환 결과를 만드는 실행 환경을 구성했습니다.",
    cover: null,
    links: {},
  },
];
