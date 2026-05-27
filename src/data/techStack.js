/**
 * 기술 스택 — 카테고리별 그룹
 * level: "primary" | "secondary" | "learning"
 */
export const techStack = [
  {
    category: "Languages",
    icon: "{ }",
    items: [
      { name: "C++17", level: "primary" },
      { name: "Java 17/21", level: "primary" },
      { name: "Python", level: "secondary" },
    ],
  },
  {
    category: "Backend",
    icon: "⚙",
    items: [
      { name: "Spring Boot 3.5", level: "primary" },
      { name: "Spring Security", level: "primary" },
      { name: "uWebSockets", level: "secondary" },
    ],
  },
  {
    category: "Systems",
    icon: "◈",
    items: [
      { name: "Emscripten (WASM)", level: "primary" },
      { name: "Unreal Engine 5 (C++)", level: "secondary" },
      { name: "Opus Codec", level: "secondary" },
    ],
  },
  {
    category: "Infrastructure",
    icon: "⬡",
    items: [
      { name: "Docker / Docker Buildx", level: "primary" },
      { name: "GitLab CI/CD", level: "primary" },
      { name: "AWS (EC2, S3, SQS)", level: "primary" },
      { name: "Redis (Lettuce)", level: "primary" },
      { name: "Prometheus + Grafana", level: "secondary" },
      { name: "Traefik", level: "secondary" },
    ],
  },
  {
    category: "Data / DB",
    icon: "▤",
    items: [
      { name: "PostgreSQL", level: "primary" },
      { name: "JPA / Hibernate", level: "primary" },
    ],
  },
];
