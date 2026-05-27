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
    id: "codestates",
    type: "edu",
    title: "코드스테이츠 부트캠프",
    detail: "백엔드 과정",
    period: "2024",
    tags: ["Spring Boot", "Java"],
    note: "Spring Boot 첫 실전 적용. 팀 프로젝트(SnackShop) 백엔드 담당",
  },
  {
    id: "opic",
    type: "cert",
    title: "OPic IH 취득",
    detail: "영어 말하기 시험",
    period: "2026.02",
    tags: ["영어"],
  },
  {
    id: "jip",
    type: "cert",
    title: "정보처리기사 취득",
    detail: "번호: 24203010925R",
    period: "2024.12.11",
    tags: ["국가자격증"],
  },
  {
    id: "ssafy",
    type: "edu",
    title: "삼성 청년 SW 아카데미 (SSAFY) 14기",
    detail: "임베디드 트랙",
    period: "2025.07.08 – 현재",
    tags: ["SSAFY", "임베디드"],
    note: "프로젝트 3회 (오토잉카, 영묘, 스티커). 백엔드·시스템 역량 집중 강화",
  },
];
