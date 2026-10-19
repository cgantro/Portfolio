import coverImage from "../../../asset/오토잉카_실물.png";
import architectureImage from "../../../asset/autowing-system-architecture.svg";

export default {
  id: "autowingcar",
  sectionOrder: ["architecture", "implementation", "case-studies", "verification", "sources"],
  title: "오토잉카 (AutoWing Car)",
  category: "Java 기반 공항 차량 관제 서버",
  period: "2026.01 – 2026.02",
  team: "6인",
  role: [
    "6인 팀 프로젝트에서 백엔드 개발을 주로 담당해 미션·경로·장비 명령·차량 상태 처리 흐름 구현",
    "MQTT 장비 명령과 일부 명령 ACK 추적, 차량 상태 전이, STOMP/WebSocket 관제 갱신 연결",
    "A*·Yen 경로 후보 탐색과 지도 로딩 단계의 RDP 경유점 단순화 구현",
    "PostgreSQL 현재 상태와 운행 기록, Redis 상태·운행 로그 처리, 인증 및 배포 구성을 담당",
  ],
  cardRole: "미션·경로 탐색·장비 명령·상태를 연결한 백엔드",
  summary: [
    "공항 견인 미션과 차량 운행을 관리하는 관제 시스템입니다. 저장소에는 프론트엔드, AI, 장비 코드도 있지만, 본인 담당은 Java/Spring Boot 백엔드입니다.",
    "백엔드는 미션 승인과 경로 후보 계산, MQTT 장비 명령·상태 수신, DB와 Redis 저장, 실시간 관제 화면 갱신을 연결합니다. 장비 측 자율주행 경로 추종과 서버의 지도 경로 탐색은 별도 구현입니다.",
  ],
  cover: coverImage,
  stack: ["Java 17", "Spring Boot 서버 개발 도구", "MQTT 장비 메시지 통신", "WebSocket 실시간 연결과 STOMP 메시지 규칙", "PostgreSQL 관계형 데이터베이스", "Redis 빠른 임시 저장소", "Docker 실행 환경 포장", "GitLab CI 자동 빌드와 배포", "k6 부하 측정 도구"],
  architecture: {
    image: architectureImage,
    alt: "차량과 인공지능 서비스가 장비 메시지와 웹 요청으로 Java 서버에 연결되고 관제 화면은 실시간 연결로 갱신되는 구성도",
    mobileFlows: [
      { title: "차량 상태 수신과 저장", steps: [
        { title: "이동체", detail: "위치, 속도, 배터리, 상태 전송" },
        { title: "차량 메시지 통신", detail: "상태와 명령을 서버로 전달" },
        { title: "Java 서버", detail: "차량 상태 변경과 주행 이력 처리" },
        { title: "데이터베이스와 임시 저장소", detail: "운행 기록과 로그인 확인 정보 저장" },
      ] },
      { title: "관제 화면 갱신", steps: [
        { title: "서버 알림", detail: "차량, 항공편, 비상 상황 변경" },
        { title: "실시간 웹 연결", detail: "바뀐 정보를 관제 화면에 바로 전달" },
        { title: "관제 화면", detail: "차량과 공항 상황 표시" },
      ] },
    ],
    summary: [
      "미션 승인과 서버 경로 탐색 결과를 장비 명령으로 연결하고, 차량 상태 수신 결과를 데이터베이스와 관제 화면에 반영합니다.",
      "RDP 단순화는 지도 자원을 적재할 때 경유점을 줄이는 처리입니다. 차량 명령을 보내기 직전에 적용하는 단계가 아닙니다.",
    ],
  },
  implementations: [
    { title: "차량 상태를 저장하고 관제 화면에 전달", body: ["차량 메시지에서 위치와 속도, 배터리, 운행 상태를 읽어 주행 이력에 저장했습니다.", "관제 화면의 차량, 항공편, 비상 알림은 실시간 연결을 통해 바뀐 내용만 전달했습니다. STOMP는 이 연결 위에서 메시지 종류와 목적지를 정하는 규칙입니다."] },
    { title: "차량 명령과 수신 확인 처리", body: ["차량별 명령 ID와 시퀀스를 등록하고 ACK 응답을 대조하는 경로가 있습니다. 다만 직접 발행하는 일부 주행 명령은 같은 ACK 추적 경로를 통하지 않습니다.", "명령 수신 ACK와 차량이 보고하는 실제 위치·운행 상태는 별도로 관리합니다."] },
    { title: "A* 탐색으로 차량 조건을 반영한 기본 경로 계산", body: ["A*는 지금까지 이동한 비용과 목적지까지의 예상 비용을 더해 유리한 경로부터 살펴보는 탐색 방법입니다. 시작 지점부터 목적지까지 그래프를 살피며 통제 구간과 다른 차량이 차지한 지점이나 연결선은 후보에서 제외했습니다.", "연결선 이동 시간을 비용으로 사용하고 값이 없을 때는 거리 나누기 10으로 보정했습니다. 목적지까지의 예상 비용은 직선 거리와 최고 속도를 이용해 계산했습니다."] },
    { title: "Yen 탐색으로 대안 경로 최대 3개 계산", body: ["Yen 알고리즘은 가장 나은 경로를 먼저 찾은 뒤 다른 경로 후보를 차례로 찾는 방법입니다. A*가 찾은 기본 경로를 바탕으로 우회 경로를 최대 3개까지 계산했습니다.", "경로 후보 목록으로 돌려줘 차량 배정과 관제 화면에서 이동 경로를 비교할 수 있게 했습니다."] },
    { title: "지도 적재 단계에서 RDP로 경유점 단순화", body: ["Ramer–Douglas–Peucker(RDP)는 선 모양을 크게 바꾸지 않는 점을 줄이는 방법입니다.", "이 구현은 지도 간선의 원본 경유점을 읽을 때 실행해 단순화된 경유점을 지도 자원으로 저장합니다. 미션 생성이나 차량 명령 직전에 경로를 다시 단순화하는 처리로 설명하면 안 됩니다."] },
    { title: "현재 차량 상태와 운행 로그 저장 경로 분리", body: ["차량·미션의 현재 상태는 PostgreSQL 트랜잭션에서 처리하고, 운행 로그는 활성 경로에서 트랜잭션 이후 Redis Stream에 넣은 뒤 별도 작업이 JDBC 배치로 저장합니다.", "현재 활성 경로는 DrivingLogWriteBehindService입니다. 기존 DrivingLogStreamService에도 스케줄러가 남아 있지만 주요 차량 처리 경로에서는 호출되지 않는 별도 서비스입니다.", "Redis 적재가 실패했을 때 직접 JDBC로 저장하는 폴백은 없습니다. DB 커밋 뒤 Redis 적재에 실패하면 해당 로그가 유실될 수 있습니다."] },
    { title: "일부 장비 명령은 DB 커밋 이후 발행", body: ["일부 MQTT 장비 명령은 TxUtil의 after-commit 작업으로 등록해 DB 트랜잭션이 완료된 뒤 전송합니다.", "이 순서는 모든 외부 알림에 적용되지는 않습니다. 예를 들어 일부 WebSocket 미션 알림은 커밋 전에 호출되므로 전체 외부 이벤트의 커밋 이후 발행을 보장한다고 설명하지 않습니다."] },
    { title: "로그인 확인과 자동 배포 구성", body: ["JWT는 로그인 정보를 담고 서버 서명을 붙여 위조 여부를 확인하는 토큰입니다. 이를 이용해 요청자를 확인하고, Redis에는 로그인 갱신 토큰을 저장해 만료 여부를 관리했습니다.", "Docker에 서버 실행 환경을 담고 GitLab CI가 코드를 자동으로 빌드하고 배포하도록 구성했습니다. API는 서버 기능 요청 창구를 뜻하며, 예외 응답과 요청 처리 기록을 정리했습니다."] },
  ],
  caseStudies: [
    {
      title: "명령 상태와 장비 상태가 되돌아가는 문제",
      flow: [
        { title: "이전 차량 상태 메시지", detail: "메시지에는 아직 출입구로 이동 중이라고 기록" },
        { title: "자동 처리", detail: "도착 처리로 데이터베이스 상태가 도킹 완료로 변경" },
        { title: "상태 덮어쓰기", detail: "후속 저장이 이전 이동 상태를 다시 기록" },
        { title: "순서 변경 시도", detail: "자동 처리 순서만 바꿔도 오래된 상태가 다시 저장됨" },
        { title: "최종 처리", detail: "현재와 처리 뒤 상태를 비교해 도킹 결과를 유지" },
      ],
      narrative: [
        "출입구 도착 처리로 데이터베이스 상태를 도킹 완료로 바꾼 직후, 같은 차량 메시지를 저장하는 단계가 이전의 이동 중 상태를 다시 기록했습니다. 다음 상태 확인에서 도착 처리가 반복됐습니다.",
        "자동 처리 순서만 바꿔서는 해결되지 않았습니다. 받은 상태를 현재 값과 대조하고, 자동 처리 전후 데이터베이스 값이 바뀌었다면 그 결과를 우선 저장하도록 정리했습니다.",
      ],
      pseudocode: `onMonitoringMessage(message):
  // 차량 메시지보다 데이터베이스에 저장된 최신 상태를 기준으로 판단합니다
  dbStatus = vehicle.status
  // 이미 도착 상태라면 이전 주행 상태를 되돌려 쓰지 않습니다
  if dbStatus == "도킹 완료" and message.status == "출입구로 이동 중":
    reject(message)
    return

  acceptedMonitoringStatus = message.status
  statusBeforeAction = dbStatus
  // 자동 처리로 데이터베이스에 저장된 상태가 바뀌었는지 확인합니다
  checkAndTriggerAutoActions(vehicle, message)
  dbStatus = vehicle.status

  if dbStatus != statusBeforeAction:
    // 자동 액션이 상태를 바꿨으면 그 결과를 유지합니다
    persist dbStatus
  else:
    // 상태 전이가 없을 때만 수신한 모니터링 상태를 저장합니다
    persist accepted monitoring status`,
      pseudocodeLabel: "의사 코드, 이전 차량 상태보다 자동 처리 결과 우선",
    },
    {
      title: "차량 상태 저장이 끝나기 전에 명령이 전송되는 문제",
      flow: [
        { title: "저장 중 메시지 전송", detail: "데이터베이스 확정 전에 명령이 장비에 먼저 도착할 수 있음" },
        { title: "순서 변경 시도", detail: "함수 마지막으로 옮겨도 저장 완료 뒤 실행된다는 보장은 없음" },
        { title: "저장 완료 뒤 전송", detail: "변경이 확정된 뒤에만 장비에 명령 전달" },
      ],
      narrative: [
        "데이터베이스 변경 중에 메시지를 바로 보내면 저장이 취소돼도 명령은 장비에 먼저 전달될 수 있었습니다. 단순히 함수 마지막으로 옮기는 것만으로는 저장 완료 뒤 실행된다고 보장할 수 없었습니다.",
        "데이터베이스 저장이 끝난 뒤 실행할 작업에 메시지 전송을 등록해 변경이 확정된 뒤에만 장비 명령을 보내도록 순서를 맞췄습니다.",
      ],
      pseudocode: `updateVehicle(command):
  begin transaction
  persistVehicleChange(command)
  // 일부 MQTT 장비 명령은 커밋 후 실행되도록 등록합니다
  afterCommit(() => publishEquipmentCommand(command))
  commit transaction
      `,
      pseudocodeLabel: "일부 MQTT 장비 명령의 커밋 후 발행 흐름",
    },
  ],
  verification: {
    summary: "k6 부하 측정 도구로 모의 차량 연결을 확인한 기존 결과",
    items: [
      "500개 모의 차량 클라이언트가 각각 초당 10회 상태를 전송한 조건에서 초당 최대 8,935개 메시지, 요청부터 응답까지 14–28ms로 기록돼 있습니다. 실제 차량 500대 측정 결과는 아닙니다.",
      "원본 부하 보고서가 없어 응답 시간 통계 기준과 반복 횟수는 확인할 수 없습니다. 이 수치는 현재 Redis 운행 로그 저장 경로의 통합 부하나 강제 종료 복구를 검증한 결과가 아닙니다.",
      "현재 코드의 개선 여지: A* 휴리스틱 계산 중 지도 최대 속도를 반복 조회하고, GraphCache 재적재와 경로 조회가 같은 불변 스냅샷을 사용하지 않습니다. Yen 분기 탐색도 이전 루트 노드 재진입을 차단하지 않습니다.",
    ],
  },
  links: { github: "https://github.com/cgantro/Autowing_car", demo: null },
  theme: { accent: "#4F8C83" },
};
