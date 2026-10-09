import coverImage from "../../../asset/오토잉카_실물.png";
import architectureImage from "../../../asset/autowing-system-architecture.svg";

export default {
  id: "autowingcar",
  sectionOrder: ["architecture", "implementation", "case-studies", "verification", "sources"],
  title: "오토잉카 (AutoWing Car)",
  category: "Java · MQTT 기반 이동체 관제",
  period: "2026.01 – 2026.02",
  team: "6인",
  role: "백엔드 단독 개발: 서버 통신, 차량 상태 관리, 관제 경로 추천",
  cardRole: "백엔드 단독 개발 · 통신·상태·경로",
  summary: "공항 토잉카 관제용 Spring Boot 백엔드입니다. MQTT로 장비 상태를 받고 WebSocket으로 관제 화면을 갱신했으며, 차량 상태 전이와 공항 지도 경로 탐색을 구현했습니다.",
  cover: coverImage,
  stack: ["Java 17", "Spring Boot 3.5", "MQTT", "WebSocket/STOMP", "PostgreSQL", "Redis", "Docker", "GitLab CI", "k6"],
  architecture: {
    image: architectureImage,
    alt: "이동체·AI 서비스가 MQTT와 HTTP를 통해 Spring Boot 관제 백엔드에 연결되고 관제 UI는 WebSocket STOMP를 이용하는 구성도",
    summary: "백엔드는 MQTT로 장비 상태와 결과를 받고, WebSocket STOMP로 관제 화면을 갱신합니다. 전체 시스템에는 AI·임베디드 장비·관제 UI가 포함되며, 본인 담당은 백엔드입니다.",
  },
  implementations: [
    { title: "MQTT 상태 수신과 관제 이벤트 전달", body: "차량 모니터링 메시지를 파싱해 현재 위치, 속도, 배터리, 운행 상태를 갱신하고 DrivingLog에 위치·상태·배터리·미션 이력을 저장했습니다. 관제 화면은 차량·비행 편·비상 알림 채널로 나눈 STOMP/WebSocket을 통해 갱신했습니다." },
    { title: "A* 경로 탐색과 Yen 대안 경로", body: "MapService에서 A*로 기본 최단 경로를 찾고, 차단되었거나 다른 차량이 점유한 노드·간선은 피하도록 했습니다. Yen 알고리즘으로 최대 3개의 경로 선택지를 계산해 관제에 제공했습니다. 비용은 간선 이동 시간과 속도 기반 휴리스틱을 사용하며, 이동 시간 값이 없으면 거리 기반 값을 사용합니다." },
    { title: "RDP 경로 단순화와 상태 저장", body: "Ramer–Douglas–Peucker(RDP) 알고리즘으로 경로의 시작·끝점과 허용 오차를 벗어나는 지점만 남겨 MQTT로 보낼 경유지를 줄였습니다. 운영 환경은 PostgreSQL, 로컬 개발은 H2를 사용하며, 모니터링 처리마다 주행 이력을 DrivingLog에 저장했습니다. Redis에는 Refresh Token을 저장했습니다." },
    { title: "데이터베이스 커밋 후 외부 이벤트 발행", body: "TxUtil.executeAfterCommit을 적용해 MQTT·WebSocket 이벤트가 데이터베이스 트랜잭션 커밋 뒤에 발행되도록 했습니다. 커밋과 메시지 발행의 순서는 정리했지만, 커밋 직후 발행 전 프로세스가 종료될 때의 복구는 보장하지 않습니다." },
  ],
  caseStudies: [
    {
      title: "명령 상태와 장비 상태가 되돌아가는 문제",
      situation: "게이트 도킹을 감지해 상태를 DOCKING으로 바꾼 직후, 늦게 도착한 이전 MOVING_TO_GATE 상태가 데이터베이스 값을 되돌리는 문제가 있었습니다.",
      analysis: "자동 동작으로 바뀐 서버 상태와 MQTT 메시지에 담긴 이전 상태를 같은 기준으로 취급했습니다.",
      decision: "서버가 이미 상태를 전환했다면 뒤늦게 도착한 이전 값이 그 결과를 덮어쓰지 못하게 했습니다.",
      implementation: "현재 상태가 DOCKING인데 이전 MOVING_TO_GATE 값이 오면 이를 무시했습니다. 자동 액션 실행 전후 상태를 비교해 액션이 바꾼 상태가 있으면 그 값을 우선 반영했습니다.",
      verification: "DOCKING 뒤 MOVING_TO_GATE가 도착해도 상태가 되돌아가지 않도록 수정했습니다.",
      limitations: "MQTT 재전송·중복·순서가 바뀌는 상황까지 자동화 시험으로 확인하지는 않았습니다.",
    },
    {
      title: "데이터베이스 저장 전에 메시지가 발행되는 문제",
      situation: "데이터베이스 트랜잭션이 롤백돼도 MQTT나 WebSocket에는 변경 이벤트가 먼저 전달될 수 있었습니다.",
      analysis: "데이터베이스 커밋과 메시지 발행은 별도 작업입니다. 트랜잭션 안에서 바로 발행하면 저장이 확정되기 전에 외부에 변경 내용이 전달될 수 있었습니다.",
      decision: "데이터베이스 커밋이 끝난 뒤 외부 이벤트를 발행하도록 순서를 바꿨습니다.",
      implementation: "TxUtil.executeAfterCommit으로 dispatch, connect, disconnect, emergencyStop 처리의 외부 이벤트 발행을 커밋 후 실행하도록 옮겼습니다.",
      verification: "커밋 이후 발행을 적용했습니다. 커밋 직후 프로세스 종료에 대한 복구는 검증하지 않았습니다.",
      limitations: "커밋 직후 프로세스가 종료되는 상황에서 메시지를 복구하는 outbox나 재발행은 검증하지 않았습니다.",
    },
  ],
  verification: {
    summary: "실제 차량이 아닌 모의 클라이언트로 진행한 k6 부하 시험입니다. 14–28ms 지연의 통계 기준은 명확하지 않습니다.",
    items: [
      "부하 조건: k6, 모의 차량 클라이언트 500개, 각 10Hz. 실물 차량으로 시험하지 않았습니다.",
      "최대 처리량은 8,935 msg/s였고, 종단 간(E2E) 지연은 14–28ms였습니다. 지연의 통계 기준은 명시되지 않았습니다.",
      "MQTT·WebSocket 이벤트는 커밋 후 발행하도록 바꿨습니다. 커밋 직후 프로세스가 종료되는 경우의 복구는 시험하지 않았습니다.",
    ],
  },
  links: { github: null, demo: null },
  theme: { accent: "#4F8C83" },
};
