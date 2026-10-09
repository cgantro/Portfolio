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
    "6인 팀에서 Java 서버 개발 도구인 Spring Boot로 서버 전반을 단독 구현하고 장비와 관제 서비스를 연결",
    "차량에 보내는 명령과 수신 확인, 실시간 관제 화면 갱신, 차량 상태 변경 흐름 구현",
    "이동 비용이 낮은 길을 찾는 A*와 다른 경로를 찾는 Yen 탐색, 경로 모양을 유지하며 점을 줄이는 RDP 구현",
    "데이터베이스와 임시 상태 저장, 로그인 확인 토큰, 배포 환경과 k6 부하 검증 구성",
  ],
  cardRole: "백엔드 단독 개발, 상태 정합성과 경로 탐색",
  summary: [
    "공항 토잉카 관제 서버입니다. Spring Boot는 Java로 서버 프로그램을 만드는 개발 도구입니다.",
    "MQTT는 차량 장치와 상태, 명령을 주고받는 메시지 방식입니다. WebSocket은 브라우저와 서버가 연결을 유지하며 양방향으로 정보를 주고받는 통신 방식입니다. 차량 상태가 순서에 맞게 바뀌도록 처리하고 지도 경로 탐색도 구현했습니다.",
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
      "차량 메시지 통신으로 장비 상태와 결과를 받고, 열린 웹 연결로 관제 화면을 갱신했습니다.",
      "인공지능과 차량 장치, 관제 화면을 연결하는 서버 전반을 맡았습니다.",
    ],
  },
  implementations: [
    { title: "차량 상태를 저장하고 관제 화면에 전달", body: ["차량 메시지에서 위치와 속도, 배터리, 운행 상태를 읽어 주행 이력에 저장했습니다.", "관제 화면의 차량, 항공편, 비상 알림은 실시간 연결을 통해 바뀐 내용만 전달했습니다. STOMP는 이 연결 위에서 메시지 종류와 목적지를 정하는 규칙입니다."] },
    { title: "차량 명령과 수신 확인 처리", body: ["차량으로 명령을 보내고 장비가 명령을 받았다는 확인 응답을 받아 처리 상태에 반영했습니다.", "서버가 보낸 명령과 장비가 보고한 실제 주행 상태를 분리해 관리했습니다."] },
    { title: "A* 탐색으로 차량 조건을 반영한 기본 경로 계산", body: ["A*는 지금까지 이동한 비용과 목적지까지의 예상 비용을 더해 유리한 경로부터 살펴보는 탐색 방법입니다. 시작 지점부터 목적지까지 그래프를 살피며 통제 구간과 다른 차량이 차지한 지점이나 연결선은 후보에서 제외했습니다.", "연결선 이동 시간을 비용으로 사용하고 값이 없을 때는 거리 나누기 10으로 보정했습니다. 목적지까지의 예상 비용은 직선 거리와 최고 속도를 이용해 계산했습니다."] },
    { title: "Yen 탐색으로 대안 경로 최대 3개 계산", body: ["Yen 알고리즘은 가장 나은 경로를 먼저 찾은 뒤 다른 경로 후보를 차례로 찾는 방법입니다. A*가 찾은 기본 경로를 바탕으로 우회 경로를 최대 3개까지 계산했습니다.", "경로 후보 목록으로 돌려줘 차량 배정과 관제 화면에서 이동 경로를 비교할 수 있게 했습니다."] },
    { title: "RDP 경로 단순화로 차량에 보낼 점 줄이기", body: ["경로의 모든 점을 차량에 보내면 메시지가 커집니다. Ramer–Douglas–Peucker(RDP)는 경로 모양에 영향이 적은 점을 줄이는 방법입니다.", "허용 오차를 넘는 꺾임은 남기고 나머지 점을 줄여 원래 경로 모양을 유지한 채 차량에 전달했습니다."] },
    { title: "주행 기록과 지도, 차량 상태 저장", body: ["운영 데이터는 서로 연결된 항목을 표로 관리하는 PostgreSQL 데이터베이스에 저장하고, 개발과 테스트에는 H2 임시 데이터베이스를 사용했습니다.", "주행 이력에는 위치와 상태, 배터리, 임무 기록을 저장했습니다. 지도와 차량이 차지한 구간도 별도로 관리했습니다.", "Redis 빠른 저장소에는 최신 차량 상태와 만료 시간이 있는 로그인 갱신 정보를 저장했습니다."] },
    { title: "데이터베이스 저장이 끝난 뒤 차량 명령 전송", body: ["데이터베이스 변경이 확정된 뒤 명령 메시지를 보내도록 저장 완료 뒤 실행할 작업을 등록했습니다. 저장이 취소됐는데 차량이 먼저 움직이는 상황을 막기 위한 순서입니다."] },
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
  // 저장이 확정된 뒤에만 차량에 명령을 전달합니다
  afterSave(() => sendVehicleCommand(command))
  commit transaction
      `,
      pseudocodeLabel: "의사 코드, 데이터베이스 저장 뒤 차량 명령 전달",
    },
  ],
  verification: {
    summary: "k6 부하 측정 도구로 가상 차량 연결 확인",
    items: [
      "가상 차량 500대가 초당 10회씩 상태를 보내도록 했을 때 초당 최대 8,935개 메시지를 처리했고, 요청부터 응답까지 걸린 시간은 14–28ms였습니다.",
      "원본 부하 보고서가 없어 응답 시간 통계 기준과 반복 횟수는 확인할 수 없습니다.",
    ],
  },
  links: { github: null, demo: null },
  theme: { accent: "#4F8C83" },
};
