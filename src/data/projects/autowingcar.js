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
  summary: [
    "공항 토잉카 관제용 Spring Boot 백엔드입니다.",
    "MQTT 장비 상태 수신, WebSocket 관제 화면 갱신, 차량 상태 전이와 지도 경로 탐색을 구현했습니다.",
  ],
  cover: coverImage,
  stack: ["Java 17", "Spring Boot 3.5", "MQTT", "WebSocket/STOMP", "PostgreSQL", "Redis", "Docker", "GitLab CI", "k6"],
  architecture: {
    image: architectureImage,
    alt: "이동체·AI 서비스가 MQTT와 HTTP를 통해 Spring Boot 관제 백엔드에 연결되고 관제 UI는 WebSocket STOMP를 이용하는 구성도",
    summary: [
      "백엔드: MQTT로 장비 상태·결과 수신, WebSocket STOMP로 관제 화면 갱신.",
      "시스템 구성: AI·임베디드 장비·관제 UI. 담당 범위는 백엔드입니다.",
    ],
  },
  implementations: [
    { title: "MQTT 상태 수신과 관제 이벤트 전달", body: ["차량 모니터링 메시지를 파싱해 위치·속도·배터리·운행 상태를 갱신하고, DrivingLog에 위치·상태·배터리·미션 이력을 저장했습니다.", "차량·비행 편·비상 알림으로 나눈 STOMP/WebSocket 채널로 관제 화면을 갱신했습니다."] },
    { title: "A*: 차량 조건을 반영한 기본 경로", body: ["입력: 시작·도착 노드와 지도 그래프.", "차단되거나 UsageManager에서 다른 차량이 점유한 노드·간선은 제외합니다.", "비용: 간선 이동 시간, 값이 없으면 거리/10. 휴리스틱: 유클리드 거리/최고 속도.", "출력: 조건을 반영한 기본 경로."] },
    { title: "Yen: 대안 경로 최대 3개", body: ["입력: A* 기본 경로와 그래프의 우회 후보.", "Yen 알고리즘으로 최대 3개 경로를 계산해 PathOptionDto 목록으로 반환합니다.", "역할: 차량 배정과 관제에서 비교할 경로 선택지를 제공합니다."] },
    { title: "RDP: MQTT 경유지 수 줄이기", body: ["입력: 순서가 있는 경로 점과 허용 오차 epsilon.", "Ramer–Douglas–Peucker 알고리즘으로 양 끝점과 선분에서 허용 오차를 넘는 점을 남겨 단순화 경로를 만듭니다.", "단순화 경로를 MQTT 경유지 payload에 사용해 전송 점 수를 줄였습니다.", "저장 구성: 운영 PostgreSQL·개발 H2, 모니터링별 주행 이력은 DrivingLog, Refresh Token은 Redis."] },
    { title: "데이터베이스 커밋 후 MQTT 발행", body: ["TxUtil.executeAfterCommit으로 MQTT 발행을 DB 트랜잭션 커밋 뒤 콜백에서 실행합니다."] },
  ],
  caseStudies: [
    {
      title: "명령 상태와 장비 상태가 되돌아가는 문제",
      flow: [
        { title: "오래된 MQTT 상태", detail: "이전 payload에 MOVING_TO_GATE가 남음" },
        { title: "자동 액션", detail: "게이트 도착 처리로 DB 상태가 DOCKING으로 변경" },
        { title: "상태 덮어쓰기", detail: "후속 저장이 payload의 MOVING_TO_GATE를 기록" },
        { title: "순서 변경 시도", detail: "자동 액션 호출 순서만 바꿔도 stale payload 저장은 남음" },
        { title: "최종 처리", detail: "DOCKING 가드와 전후 상태 비교로 자동 액션 결과를 우선" },
      ],
      narrative: [
        "게이트 도착 처리에서 서버 상태를 DOCKING으로 바꾼 직후, 이전 monitoring 메시지의 MOVING_TO_GATE가 저장돼 상태가 되돌아갔습니다. 다음 메시지에서도 게이트 도착 동작이 반복됐습니다.",
        "기록상 CONNECT 자동 액션이 DB 상태를 DOCKING으로 바꾼 뒤, 같은 처리 흐름의 후속 저장이 현재 메시지 payload의 오래된 MOVING_TO_GATE를 다시 기록했습니다. 자동 액션 호출 순서를 바꿔도 stale payload를 저장하는 단계가 남아 있어 해결되지 않았습니다. 대신 이미 DOCKING일 때 MOVING_TO_GATE 입력을 거르는 가드를 두고, 자동 액션 전 상태를 저장한 뒤 실행 후 DB 상태가 달라졌는지 비교해 바뀐 현재 상태를 최종 저장값으로 우선했습니다.",
        "프로젝트 기록에는 상태가 되돌아가는 문제를 막았다고 적혀 있습니다. MQTT 재전송·중복·역순 입력에 대한 자동화 시험 결과는 없습니다.",
      ],
    },
    {
      title: "데이터베이스 저장 전에 메시지가 발행되는 문제",
      flow: [
        { title: "트랜잭션 내부 발행", detail: "DB 커밋 전에 MQTT가 먼저 전달될 수 있음" },
        { title: "순서 변경 시도", detail: "서비스 메서드 끝으로 이동해도 프록시 트랜잭션 뒤 실행은 보장되지 않음" },
        { title: "커밋 후 콜백", detail: "TxUtil.executeAfterCommit에서 MQTT 발행" },
      ],
      narrative: [
        "트랜잭션 안에서 MQTT 메시지를 바로 발행해 DB 커밋보다 외부 전달이 먼저 일어날 수 있었습니다. 롤백되면 수신자는 데이터베이스에 반영되지 않은 변경을 받게 됩니다. 서비스 메서드 끝으로 발행을 옮기는 시도도 프록시 트랜잭션의 실행 순서를 보장하지 못했습니다.",
        "TxUtil.executeAfterCommit을 만들어 dispatch, connect, disconnect, emergencyStop의 MQTT 발행을 커밋 후 콜백에서 실행하도록 바꿨습니다. 이 변경은 순서만 정리하며 DB와 브로커의 원자적 전달을 보장하지 않습니다. 커밋 직후 프로세스가 종료될 때의 outbox나 재발행도 구현하지 않았습니다.",
      ],
    },
  ],
  verification: {
    summary: "k6 모의 차량 클라이언트 부하 검증",
    items: [
      "모의 차량 500개 · 각 10Hz · 최대 처리량 8,935 msg/s · E2E 지연 14–28ms",
      "원본 부하 보고서가 없어 지연 통계 기준과 반복 횟수는 확인할 수 없습니다.",
    ],
  },
  links: { github: null, demo: null },
  theme: { accent: "#4F8C83" },
};
