export const techStacks = {
  core: [
    {
      name: "Spring Boot",
      icons: ["springboot"],
      score: "3.5/5",
      canDo: "실시간 관제 API와 상태 관리 서비스 설계/구현",
    },
    {
      name: "Java / C++",
      icons: ["java", "cplusplus"],
      score: "3.5/5",
      canDo: "백엔드 서비스와 실시간 처리 로직 구현",
    },
    {
      name: "Redis",
      icons: ["redis"],
      score: "3.0/5",
      canDo: "실시간 상태 캐시와 토큰 저장소 분리",
    },
    {
      name: "PostgreSQL / TimescaleDB",
      icons: ["postgres"],
      score: "3.0/5",
      canDo: "시계열 로그 저장 경로와 조회 구조 구성",
    },
  ],
  infraMessaging: [
    { name: "MQTT", icon: "mqtt" },
    { name: "WebSocket / STOMP", icon: "websocket" },
    { name: "Docker", icon: "docker" },
    { name: "Nginx", icon: "nginx" },
    { name: "GitLab CI", icon: "gitlab" },
  ],
  tooling: [
    { name: "Git", icon: "git" },
    { name: "Jira", icon: "jira" },
    { name: "Scrum", icon: "scrum" },
    { name: "Notion", icon: "notion" },
    { name: "Logging", icon: "logging" },
    { name: "AOP", icon: "aop" },
  ],
};
