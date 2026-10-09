import coverImage from "../../../asset/오토잉카_실물.png";
import architectureImage from "../../../asset/autowing-system-architecture.svg";

export default {
  id: "autowingcar",
  sectionOrder: ["architecture", "implementation", "case-studies", "verification", "sources"],
  homeHighlight: "MQTT 상태 정합성 · 경로 재탐색 · 부하 검증",
  title: "오토잉카 (AutoWing Car)",
  category: "Java · MQTT 기반 이동체 관제",
  period: "2026.01 – 2026.02",
  team: "6인",
  role: "백엔드 단독 개발: 서버 통신, 차량 상태 관리, 관제 경로 추천",
  summary: "공항 토잉카의 위치와 운행 상태를 수집하고 관제 명령과 경로 정보를 전달하는 Spring Boot 기반 관제 시스템입니다. MQTT·WebSocket 통신, 차량 상태 전이, 공항 지도 기반 경로 탐색과 부하 검증을 담당했습니다.",
  cover: coverImage,
  stack: ["Java 17", "Spring Boot 3.5", "MQTT", "WebSocket/STOMP", "PostgreSQL", "Redis", "Docker", "GitLab CI", "k6"],
  architecture: {
    image: architectureImage,
    alt: "이동체·AI 서비스가 MQTT와 HTTP를 통해 Spring Boot 관제 백엔드에 연결되고 관제 UI는 WebSocket STOMP를 이용하는 구성도",
    summary: "백엔드는 장비 MQTT 메시지를 처리해 WebSocket STOMP로 관제 화면을 갱신합니다. 관제 명령과 장비가 보고한 결과를 구분해 상태를 반영합니다.",
  },
  implementations: [
    { title: "장비 응답을 기준으로 상태 갱신", body: "관제 명령을 보냈다는 사실만으로 차량 상태를 확정하지 않고, 장비가 돌려보낸 MQTT 결과 메시지를 기준으로 갱신했습니다. 데이터베이스 반영이 완료된 뒤 외부 메시지를 발행하도록 순서를 정했습니다." },
    { title: "관제 이벤트와 경로 정보 전달", body: "MQTT로 받은 정보를 서비스 로직에 연결하고 STOMP WebSocket으로 관제 화면을 갱신했습니다. 그래프 기반 경로 추천은 현재 위치와 통제 구간을 반영해 우회 경로를 다시 계산합니다." },
  ],
  caseStudies: [
    {
      title: "명령 상태와 장비 상태가 되돌아가는 문제",
      situation: "게이트 도킹을 감지해 서버 상태를 도킹(DOCKING)으로 바꾼 뒤에도, 늦게 도착한 이전 이동 상태(MOVING_TO_GATE)가 메시지 본문(payload)에 담겨 데이터베이스 상태를 되돌릴 수 있었습니다.",
      analysis: "자동 동작으로 바뀐 서버 상태와 MQTT 메시지에 담긴 이전 상태를 같은 기준으로 취급했습니다.",
      decision: "서버가 이미 상태를 전환했다면 뒤늦게 도착한 이전 값이 그 결과를 덮어쓰지 못하게 했습니다.",
      implementation: "DOCKING 상태에서 이전 MOVING_TO_GATE 값을 무시하고, 자동 액션 실행 전후 상태를 비교해 액션이 변경한 상태를 우선 반영하도록 했습니다.",
      verification: "상태 롤백 버그와 방어 로직이 2026-02-06 프로젝트 기록에 기술되어 있습니다.",
      limitations: "MQTT 재전송·중복·순서 역전 시나리오의 자동화 시험 결과는 제공된 기록에서 확인되지 않습니다.",
      codeLanguage: "java",
      codeLabel: "이전 상태 덮어쓰기 방지 구현 발췌",
      code: `if (assignedCar.getCarStatus() == CarStatus.DOCKING
    && status == CarStatus.MOVING_TO_GATE) {
    status = CarStatus.DOCKING;
}

CarStatus preAutoActionStatus = assignedCar.getCarStatus();
checkAndTriggerAutoActions(assignedCar, x, y, status);
if (assignedCar.getCarStatus() != preAutoActionStatus) {
    status = assignedCar.getCarStatus();
}`,
    },
    {
      title: "데이터베이스 저장 전에 메시지가 발행되는 문제",
      situation: "트랜잭션이 롤백되더라도 MQTT나 WebSocket에는 변경 이벤트가 먼저 전달될 수 있었습니다.",
      analysis: "데이터베이스 저장(커밋)과 메시지 브로커 발행은 별도 작업입니다. 트랜잭션 안에서 바로 메시지를 발행하면 데이터 저장이 확정되기 전에 외부에 변경 내용이 전달될 수 있었습니다.",
      decision: "데이터베이스 트랜잭션이 완료된 뒤 외부 이벤트를 발행하도록 순서를 정했습니다.",
      implementation: "TxUtil.executeAfterCommit을 도입해 dispatch, connect, disconnect, emergencyStop 명령의 이벤트 발행을 데이터베이스 커밋 후 실행하도록 옮겼습니다.",
      verification: "커밋 이후 발행을 적용했습니다. 커밋 직후 프로세스 종료에 대한 복구는 검증하지 않았습니다.",
      limitations: "프로세스가 커밋 직후 발행 전에 종료되는 경우를 다루는 영속 아웃박스나 복구 검증은 기록에서 확인되지 않습니다.",
      codeLanguage: "java",
      codeLabel: "커밋 이후 발행 호출 예시",
      code: `TxUtil.executeAfterCommit(
    () -> mqttService.publish(topic, payload)
);`,
    },
  ],
  verification: {
    summary: "k6 모의 환경에서 처리량과 메시지 지연을 확인했습니다.",
    items: [
      "부하 조건: k6, 모의 차량 클라이언트 500개, 각 10Hz. 실물 차량으로 시험하지 않았습니다.",
      "기록된 결과: 최대 8,935 msg/s, 종단 간(E2E) 지연 14–28ms. 지연 값의 통계 기준은 별도로 확보되지 않았습니다.",
      "커밋 이후 MQTT·WebSocket 발행 순서는 executeAfterCommit 적용 내용으로 확인되며, 장애 복구 보장은 별도 검증이 필요합니다.",
    ],
  },
  links: { github: null, demo: null },
  theme: { accent: "#4F8C83" },
};
