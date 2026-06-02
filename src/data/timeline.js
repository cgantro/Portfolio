/**
 * 이력 타임라인 — 학력, 자격증, 주요 마일스톤
 * type: "edu" | "cert" | "work" | "etc"
 */
export const timeline = [
  {
    id: "kwu",
    type: "edu",
    title: "광운대학교 소프트웨어학부",
    detail: "학사 졸업",
    period: "2019.03 – 2025.08",
    tags: ["소프트웨어학부"],
    note: "운영체제(버퍼 캐시 LRU 구현), 자료구조, 알고리즘 등 CS 기초 과목 이수",
  },
  {
    id: "opic",
    type: "cert",
    title: "Opic IH 취득",
    detail: "영어",
    period: "2026.02",
    tags: ["멀티캠퍼스"],
  },
  {
    id: "jip",
    type: "cert",
    title: "정보처리기사 취득",
    detail: "기사",
    period: "2024.12.11",
    tags: ["한국산업인력공단"],
  },
  {
    id: "ssafy",
    type: "edu",
    title: "삼성 청년 SW 아카데미 (SSAFY) 14기",
    detail: "SW 역량 강화",
    period: "2025.07.08 – 현재",
    tags: ["SSAFY"],
    note: "프로젝트 3회 (오토잉카, 영묘, 스티커). 백엔드·시스템 역량 집중 강화",
  },
  {
    id: "robotpal",
    type: "etc",
    title: "RobotPal",
    detail: "개인 프로젝트",
    period: "2025.11 – 2026.04",
    tags: ["C++", "Emscripten"],
    note: "JETANK 로봇팔 시뮬레이션, 스트리밍 파이프라인, 웹 배포까지 포함한 크로스플랫폼 실험",
  },
];
