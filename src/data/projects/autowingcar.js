import coverImage from "../../../asset/오토잉카_실물.png";
import architectureImage from "../../../asset/autowing-system-architecture.svg";

export default {
  id: "autowingcar",
  title: "오토잉카 (AutoWing Car)",
  category: "Java · MQTT 기반 이동체 관제",
  period: "2026.01 – 2026.02",
  team: "6인",
  role: "백엔드 단독 개발: MQTT·WebSocket 통신, 장비 상태 전이, 경로 추천과 부하 검증",
  summary: "공항 토잉카 관제 백엔드에서 장비에 내린 명령과 장비가 보고한 상태를 구분하고, MQTT(메시지 발행·구독 프로토콜) 원격 측정 정보와 WebSocket(양방향 실시간 통신 방식) 관제 이벤트 흐름을 구현했습니다. Java 기반 보조 사례로 C++ 실시간 통신 프로젝트와 함께 상태 전이 설계 경험을 보여줍니다.",
  cover: coverImage,
  stack: ["Java 17", "Spring Boot 3.5", "MQTT", "WebSocket/STOMP", "PostgreSQL", "Redis", "Docker", "GitLab CI", "k6"],
  resultSummary: "명령과 장비가 보고한 상태를 분리하고, 커밋 후 이벤트 발행과 통제 구간을 반영한 경로 재탐색 흐름을 구성했습니다.",
  architecture: {
    image: architectureImage,
    alt: "이동체·AI 서비스가 MQTT와 HTTP를 통해 Spring Boot 관제 백엔드에 연결되고 관제 UI는 WebSocket STOMP를 이용하는 구성도",
    summary: "백엔드는 장비에서 온 MQTT 메시지를 처리해 WebSocket STOMP(실시간 웹 메시징 방식)로 관제 화면에 전달합니다. 관제 명령과 장비가 보고한 결과를 구분해 상태를 갱신합니다.",
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
    },
    {
      title: "데이터베이스 저장 전에 메시지가 발행되는 문제",
      situation: "트랜잭션이 롤백되더라도 MQTT나 WebSocket에는 변경 이벤트가 먼저 전달될 수 있었습니다.",
      analysis: "데이터베이스 저장(커밋)과 메시지 브로커 발행은 별도 작업입니다. 트랜잭션 안에서 바로 메시지를 발행하면 데이터 저장이 확정되기 전에 외부에 변경 내용이 전달될 수 있었습니다.",
      decision: "데이터베이스 트랜잭션이 완료된 뒤 외부 이벤트를 발행하도록 순서를 정했습니다.",
      implementation: "TxUtil.executeAfterCommit을 도입해 dispatch, connect, disconnect, emergencyStop 명령의 이벤트 발행을 데이터베이스 커밋 후 실행하도록 옮겼습니다.",
      verification: "문서에는 TransactionSynchronizationAdapter.afterCommit을 통한 커밋 후 발행 적용이 기록되어 있습니다.",
      limitations: "프로세스가 커밋 직후 발행 전에 종료되는 경우를 다루는 영속 아웃박스나 복구 검증은 기록에서 확인되지 않습니다.",
    },
  ],
  verification: {
    summary: "부하 시험은 문제 해결 사례가 아니라 모의 환경의 처리량과 메시지 지연을 확인한 검증 결과로 분리했습니다.",
    items: [
      "부하 조건: k6, 모의 차량 클라이언트 500개, 각 10Hz. 실물 차량으로 시험하지 않았습니다.",
      "기록된 결과: 최대 8,935 msg/s, 종단 간(E2E) 지연 14–28ms. 원본 측정 보고서와 지연 통계 정의는 확인되지 않았습니다.",
      "MQTT 자동 상태 전이와 오래된 payload의 덮어쓰기 방지 로직은 프로젝트 문서에 기술되어 있습니다.",
      "커밋 이후 MQTT·WebSocket 발행 순서는 executeAfterCommit 적용 내용으로 확인되며, 장애 복구 보장은 별도 검증이 필요합니다.",
    ],
  },
  decisionVisual: {
    title: "차량 상태와 외부 이벤트의 순서를 지키는 판단",
    code: `// 판단 흐름을 설명하는 의사 코드입니다. 실제 구현 코드가 아닙니다.\nnextStatus = parseStatus(mqttMessage);\nif (db.status == DOCKING && nextStatus == MOVING_TO_GATE) {\n  nextStatus = db.status; // 늦게 도착한 이전 상태는 반영하지 않음\n}\nrunAutomaticActions();\nif (db.statusChanged) nextStatus = db.status;\nsave(nextStatus);\nafterCommit(() => publishStatusEvents());`,
    steps: [
      { label: "상태 메시지 수신", detail: "MQTT 메시지 본문에서 차량 상태를 읽습니다." },
      { label: "이전 상태 무시", detail: "현재 상태가 도킹(DOCKING)인데 이전 이동 상태(MOVING_TO_GATE)가 도착하면 도킹 상태를 유지합니다." },
      { label: "자동 동작 결과 반영", detail: "자동 동작이 상태를 바꿨다면 변경된 서버 상태를 저장합니다." },
      { label: "저장 후 이벤트 발행", detail: "데이터베이스 커밋이 완료된 뒤 MQTT·WebSocket 이벤트를 발행합니다." },
    ],
    note: "상태가 이전 값으로 되돌아가는 현상에 대한 방어와 executeAfterCommit(커밋 완료 후 실행) 순서를 요약한 의사 코드입니다. 실제 차량 동작이나 메시지 전달 보장을 뜻하지 않습니다.",
  },
  links: { github: null, demo: null },
  theme: { accent: "#4F8C83" },
};
