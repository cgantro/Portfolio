/**
 * 기술 스택 — 카테고리별 그룹
 * level: "primary" | "secondary" | "learning"
 * skillicon: skillicons.dev 아이콘 ID (null이면 텍스트 폴백)
 */
export const techStack = [
  {
    category: "언어",
    icon: "{ }",
    items: [
      { name: "C++17",      level: 3, skillicon: "cpp"  },
      { name: "Java 17/21", level: 3, skillicon: "java" },
      { name: "Python",     level: 2, skillicon: "py"   },
    ],
  },
  {
    category: "프레임워크",
    icon: "⚙",
    items: [
      { name: "Spring Boot 3.5",    level: 3, skillicon: "spring" },
      { name: "Spring Security",    level: 3, skillicon: "spring" },
      { name: "Unreal Engine 5",    level: 2, skillicon: "unrealengine" },
      { name: "uWebSockets",        level: 2, skillicon: null     },
    ],
  },
  {
    category: "툴",
    icon: "◈",
    items: [
      { name: "Docker / Buildx",   level: 2, skillicon: "docker" },
      { name: "GitLab CI/CD",      level: 3, skillicon: "gitlab" },
      { name: "Emscripten (WASM)", level: 3, skillicon: "wasm"   },
      { name: "Opus Codec",        level: 2, skillicon: null     },
    ],
  },
  {
    category: "인프라 · DB",
    icon: "⬡",
    items: [
      { name: "AWS (EC2, S3, SQS)",   level: 3, skillicon: "aws"      },
      { name: "Redis (Lettuce)",      level: 3, skillicon: "redis"    },
      { name: "PostgreSQL",           level: 2, skillicon: "postgres" },
      { name: "JPA / Hibernate",      level: 3, skillicon: null       },
      { name: "Prometheus + Grafana", level: 2, skillicon: "grafana"  },
      { name: "Traefik",              level: 2, skillicon: null       },
    ],
  },
];
