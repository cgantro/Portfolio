# 오토잉카 (AutoWing Car) — 공항 스마트 토잉카 관제 시스템

## 1. 프로젝트 소개

- **목적**: 공항 지상 토잉카(항공기 견인 차량)의 자율주행과 관제탑 실시간 제어를 통합하는 시스템. 마샬러 수신호 AI 인식, 자율 도킹, 서버 사이드 경로 배정 포함
- **개발 기간**: 2026-01-16 ~ 2026-02-09 (약 3주, SSAFY S14 1차 프로젝트)
- **팀 구성**: 6인. 백엔드(yoonpyo), 프론트엔드(이선휘, jokong98), AI(마샬러 수신호 인식 + 자율 도킹), 임베디드(STM32, ORIN, ROS2)
- **사용 기술**: Spring Boot 3.5, Java 17, MQTT (Eclipse Paho + Spring Integration), WebSocket/STOMP, Spring Security + JWT (jjwt), Redis (Lettuce), Spring AOP, A\* + Yen's K-Shortest Path, RDP 경로 단순화, Springwolf/Swagger, GitLab CI/CD, Docker, YOLOv8n-pose (TensorRT), ArUco, STM32, ROS2 (AMCL + Nav2), NVIDIA ORIN
- **한 줄 설명**: MQTT로 실물 토잉카와 통신하고, WebSocket STOMP로 관제탑·기장·마샬러에게 실시간 상태를 브로드캐스트하며, A\* + Yen's K-Shortest 서버 사이드 경로 계산으로 이동 명령을 생성하는 공항 지상 관제 시스템

---

## 2. 내 구현 (백엔드 전담, 85커밋)

### 2-1. CI/CD 파이프라인

루트 `.gitlab-ci.yml` → `Backend/.gitlab-ci.yml`, `AI/.gitlab-ci.yml`, `Frontend/.gitlab-ci.yml`, `embedded/.gitlab-ci.yml` 4개 파일을 `include: inputs:` 주입 방식으로 통합. 스테이지: `notify` (MR 알림) → `build` → `package` (Docker Hub 푸시) → `deploy` (SSH EC2 배포). `DOCKER_TLS_CERTDIR: ""` 환경변수 명시로 DinD 2375 포트 연결 문제 해결.

### 2-2. JWT 3토큰 인증

`JwtTokenProvider`: `token_type` claim으로 ACCESS/REFRESH/SOCKET 구분.

- `ACCESS` (15분): REST API 인증
- `REFRESH` (7일): Redis TTL 저장, Refresh Token Rotation (재사용 감지 시 `deleteByUserId` 전체 무효화)
- `SOCKET` (1분): WebSocket 핸드셰이크 전용

`AuthHandshakeInterceptor`: `socket_token` 쿼리 파라미터 검증 → `isSocketToken()` 통과 시에만 연결 허용. ACCESS 토큰으로 WebSocket 연결 시 거부. 연결 성공 시 `attributes["USER_ID"]` 저장.

`AuthService.login()`: `@Transactional` 제거 → BCrypt 연산 중 DB 커넥션을 점유하지 않도록 최적화 (코드 주석: `"Removed for Performance: DB Connection holding time optimization"`).

`AuthService.refreshToken()`: Refresh Token 검증 → Redis 저장 토큰과 비교 → 불일치 시 `deleteByUserId()` (재사용 공격 감지) → 새 ACCESS + SOCKET + REFRESH 세트 발급 후 Redis 교체.

### 2-3. 토잉카 상태 머신

`CarStatus` enum 8개 상태:
```
IDLE → MOVING_TO_GATE → DOCKING → TOWING → UNDOCKING
     → WAITING_FOR_RETURN → RETURNING → STOP/ERROR
```

`TowingCarService` 공개 메서드 전체:

**`dispatchCarToFlight(flightNumber)`**: 배터리 잔량 높은 IDLE 차량 자동 배정 (`findFirstByCarStatusOrderByBatteryDesc`). A\* 경로 계산 → MQTT DRIVE 명령 (`msgId`, `timestamp`, `type=DRIVE`, `taskId`, `edgeIds`, `finalAction=DOCK`). `TxUtil.executeAfterCommit`으로 커밋 후 MQTT 발행.

**`connectCar(pilotId, request)`**: 기장이 도킹 확인 시 호출. 상태는 차량 응답(ACK) 대기 → MQTT `connectCar` 명령 발행. 이미 TOWING이면 멱등 처리.

**`disconnectCar(pilotId, request)`**: 미션 완료 처리 (`MissionStatus.COMPLETED`) → `returnToBase()` → MQTT disconnect 명령. `returnToBase()`는 n4(RUNWAY) → n8(FINISH) A\* 경로 계산 후 DRIVE(finalAction=PARK) 발행.

**`switchMode(pilotId, request)`**: AUTO/MANUAL 전환. MQTT `setMode` 명령.

**`emergencyStop(pilotId, request)`**: 미션 상태 `PAUSED` → MQTT `emergencyStop` → 기장 + 관제사(AdminAlertDto) 동시 알림.

**`resumePushback(pilotId, request)`**: PAUSED 미션 → RUNNING → MQTT `resumeCar`.

**`processCarMonitoring(carCode, payload)`**: MQTT monitoring 수신 처리 핵심. 매 틱마다:
1. x, y, yaw, v, mode, battery 파싱
2. **stale 상태 보호**: `DOCKING` 상태인데 payload가 `MOVING_TO_GATE` → 강제 `DOCKING` 유지
3. **토폴로지 추적**: `findNearestNode(x, y, contextNode)` — 현재 노드의 인접 노드만 검색 (전체 노드 순회 방지)
4. **자동 액션**: `checkAndTriggerAutoActions()` 실행
5. **pre-action 상태 보호**: 자동 액션이 상태를 바꿨으면 payload 상태 대신 변경된 상태 사용
6. `TOWING` 신규 전환 감지 → 기장에게 토잉 완료 알림
7. `DrivingLog` 저장 (위치, 상태, 배터리, 미션 ID)
8. 전체 WebSocket 브로드캐스트

**`checkAndTriggerAutoActions()`**:
- `WAITING_FOR_RETURN` 수신 시 자동 `returnToBase()` (이미 RETURNING이면 스킵)
- IDLE + 위치가 n2(START_NODE, 차고지) 0.1m 이내 → 진행 중 미션 자동 완료 처리

**`getAllTowingCars()`**: 전체 차량 상태 조회 (관제사 대시보드용).

### 2-4. A\* + Yen's K-Shortest Path

`MapService.findSinglePath(start, end, excludedEdges)`:
- `PriorityQueue<PathNode>` (f = g + h)
- g값: `Edge.travelTime` (없으면 `distance / 10.0`)
- 휴리스틱: 유클리드 거리 / MapInfo.maxSpeed (예측 이동시간)
- `UsageManager.isEdgeLocked()` / `isNodeLocked()` → 잠긴 간선/노드 우회
- `MapStatus.BLOCKED` 간선/노드 제외
- `cameFrom: Map<Long, Edge>` 역추적

`MapService.findShortestPath(start, end)` — Yen's K=3:
1. 첫 번째 최단 경로 A\*
2. K-1 반복: spur 노드별 root 경로 유지 → 이전 경로들과 동일 root인 간선 excluded → spur A\* 계산 → `PriorityQueue<List<Edge>>` candidates
3. 중복 제거 (`containsPath`)
4. 결과: `PathOptionDto(optionId, label, edgeIds)` 리스트

`MapService.findNearestNode(x, y, contextNode)`:
- contextNode == null: 전체 노드 검색 (초기 배차 시)
- contextNode 있음: 해당 노드 + 1홉 인접 노드만 검색 (모니터링 틱마다 호출 최적화)

`MapService.getPushbackPath(flightId, targetGate)`: 실물 차량 현재 좌표 기반 경로 계산 → 프론트 경로 미리보기용.

`MapService.convertPathToPayload(path)`: Edge 리스트 → waypoints + 도착 노드 좌표 페이로드 변환 (임베디드 경로 추종용).

`GraphCache`:
- `@ApplicationReadyEvent`: 애플리케이션 준비 완료 후 DB 간선 전체 로딩
- `@Scheduled(fixedRate=60_000)`: 1분마다 인접 리스트 갱신
- `adjacencyMap: Map<Long, List<Edge>>` (srcNodeId → outgoing edges)

`UsageManager`: `Collections.synchronizedSet(HashSet)` 기반 edge/node 잠금. 토잉카 이동 중인 간선을 다른 차량이 선택하지 못하도록 예약.

### 2-5. RDP 경로 단순화

`RdpSimplifier.simplify(points, epsilon)` — Ramer-Douglas-Peucker 알고리즘:
- 시작/끝점 유지, 중간점 중 직선으로부터 수직 거리가 epsilon 초과인 점만 유지
- 수직 거리: `perpendicularDistance()` (삼각형 넓이 / 빗변 공식)
- waypoints 전송량 감소 → MQTT 페이로드 크기 절감

### 2-6. MQTT 파이프라인

```
임베디드(MQTT Broker)
  → MqttInboundConfig (Spring Integration)
  → MqttInboundHandler.handleMessage()
  → MqttSignalProcessorImpl.process(topic, payload)
    → MqttIncomingMessageParser.parse() [Sealed Class: CarData | MapData | Ack]
    → "monitoring" → TowingCarService.processCarMonitoring()
    → "map_info"  → MapWebSocketService.broadcastMapInfo()
    → "ack"       → 로그
```

`MqttTopics` 상수 클래스: 토픽 문자열 하드코딩 방지. `MqttIncomingMessage` sealed class: `CarData(carCode, messageType, payload)`, `MapData(payload)`, `Ack(payload)`.

`TxUtil.executeAfterCommit(Runnable)`:
```java
// 트랜잭션 활성 중이면 afterCommit() 훅에 등록, 비활성이면 즉시 실행
TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
    public void afterCommit() { action.run(); }
});
```
DB 커밋 전 MQTT 발행 차단 → 수신자가 DB 반영 전 상태를 읽는 문제 방지.

### 2-7. WebSocket STOMP

`WebSocketTopics` 상수 클래스. `StompWebSocketService` → `WebSocketService` 인터페이스. 채널 분리:
- `/topic/car/{carCode}`: 전체 구독자에게 차량 상태 브로드캐스트
- `/topic/flight/{flightId}`: 특정 비행 편 구독자에게 배차 알림
- `/queue/pilot/{pilotId}`: 기장 개인 채널 (연결/해제 결과)
- `/topic/admin/emergency`: 관제사 비상 알림

`WebSocketEventListener`: 세션 연결/해제 로그.

### 2-8. 커스텀 예외 계층

```
BusinessException(HttpStatus, errorCode, message)
  ├── ResourceNotFoundException
  │     ├── TowingCarNotFoundException
  │     ├── FlightNotFoundException
  │     └── MissionNotFoundException
  ├── ConflictException
  │     └── CarAlreadyInUseException
  ├── InvalidRequestException
  │     ├── InvalidJwtTokenException
  │     ├── TowingCarNotAssignedException
  │     └── DataConversionException
  └── MQTT 전용
        ├── MalformedMqttPayloadException
        ├── MqttMessageParseException
        ├── MqttPublishException
        └── UnsupportedMqttTopicException
```

`GlobalExceptionHandler (@RestControllerAdvice)`: HTTP 응답용. `MqttExceptionHandler`: MQTT 처리 중 예외 → 로그 + 무시(서비스 중단 방지). `WebSocketExceptionHandler`: WebSocket 오류 → `WebSocketErrorDto` 클라이언트 전달.

### 2-9. AOP

`LoggingAspect`: `*Controller + *Service` 전체 `@Around` — 메서드명, 인자, 실행시간, 반환값 자동 로깅. 예외 시 에러 로그.

`PerformanceAspect`: `@LogExecutionTime` 어노테이션 붙은 메서드 실행시간 측정.

### 2-10. DB 구조

**Domain 계층**:
- `TowingCar`: code, carStatus, lastPosX, lastPosY, lastHeading, lastVelocity, battery, currentMissionId, lastNode(FK→Node)
- `Flight`: flightNumber, pilot(FK→User), assignedTowingCar(FK→TowingCar), nodeCode(게이트 노드), departureDate
- `Mission`: towingCar(FK), flight(FK), status(RUNNING/PAUSED/COMPLETED)
- `MissionLog`: 미션 이벤트 이력
- `DrivingLog`: 주행 위치/상태/배터리 이력 (processCarMonitoring 틱마다 저장)

**지도 계층**:
- `MapInfo`: width, height, resolution, originX, originY, imagePath, maxSpeed, basicMap(boolean)
- `Node`: nodeCode, posX, posY, status(ACTIVE/BLOCKED), nodeType(GATE/RUNWAY/BASE/INTERSECTION)
- `Edge`: edgeCode, srcNode(FK), dstNode(FK), distance, travelTime, maxSpeed, waypoints(JSON), status(ACTIVE/BLOCKED)

H2(로컬) / PostgreSQL(운영) 프로파일 분리. `MapLoadingService`: YAML 파일에서 노드/간선 초기 데이터 로딩.

---

## 3. 팀 핵심 구현

### AI — 마샬러 수신호 인식 (`gesture_ai.py`)

YOLOv8n-pose TensorRT 엔진(`.engine` 파일) 추론. 인식 대상: 어깨(5,6), 팔꿈치(7,8), 손목(9,10) 17 keypoints.

```python
def calculate_angle(a, b, c):  # 관절 각도 계산
    radians = arctan2(c-b) - arctan2(a-b)
    return abs(radians * 180.0 / pi)
```

스테이지 기반 제스처 상태 기계:
- `stage` 변수로 수신호 단계 추적
- `trigger_counter` 카운터: 20프레임(~1초) 유지 확인 후 스테이지 전환 (`LIMIT_NORMAL=20`, `LIMIT_RESET=40`)
- `triggered_lock=True`로 중복 전환 방지
- 인식된 수신호 → MQTT 명령으로 서버에 전달

### AI — 자율 도킹 (`docking_ai.py`)

ArUco 마커(ID:0, `DICT_6X6_250`) 기반 도킹 정렬:

```python
camera_matrix = [[872.23558, 0, 315.00614],
                 [0, 873.47815, 240.01070],
                 [0, 0, 1]]
dist_coeffs = [0.14923, -1.11676, 0.00511, 0.00329, 7.40075]
```

`cv2.solvePnP(obj_points, corners, camera_matrix, dist_coeffs)` → 3D 거리/yaw/roll/pitch 계산. 보정 상수: `DIST_SCALE=1.45`, `DIST_OFFSET=-1.5` (10~30cm 구간 실측 캘리브레이션).

성능 최적화 3가지:
1. `PROCESS_INTERVAL=4`: 4프레임 중 1프레임만 ArUco 검출 (30fps → 7.5fps 연산, 스킵 프레임엔 이전 결과 재사용)
2. `ROI_Y_START_RATIO=0.4`: 상단 40% 제거 → 검색 영역 60%로 감소
3. `parameters.minMarkerPerimeterRate=0.02`, `adaptiveThreshWinSizeStep=8`: 노이즈 마커 무시 + 임계값 스텝 확대

도킹 완료 조건: 거리 < 임계값 + yaw 오차 < 허용 범위 → MQTT `DOCK` 명령 발행.

### 임베디드 — 실물 토잉카 (STM32 + ORIN + ROS2)

```
STM32 (모터 제어)
  ↕ UART
NVIDIA ORIN (ROS2 Nav2)
  ↕ MQTT
Spring Boot 서버
```

ROS2 Nav2 스택: AMCL(Adaptive Monte Carlo Localization)로 LIDAR 기반 위치 추정. costmap 2D(정적+동적 장애물). `move_base` 목표 노드 좌표 → DWA/TEB 로컬 플래너 경로 추종. 서버에서 전달받은 `edgeIds` → 노드 좌표 시퀀스 → ROS2 목표점 순차 전달.

STM32: 모터 PWM 제어, 엔코더 피드백, 비상 정지 하드웨어 인터럽트. ORIN으로부터 속도/방향 명령 수신.

MQTT 보고: `monitoring` 토픽에 `{x, y, yaw, v, mode, battery}` 주기 전송 → 서버 `processCarMonitoring` 수신.

### 프론트엔드 — 관제 대시보드

WebSocket STOMP 연결 (`socket_token` 쿼리 파라미터). 역할별 뷰 분리:
- **관제사(Admin)**: 전체 공항 지도 + 모든 토잉카 실시간 위치 오버레이, 배차 조작, 비상정지 알림 수신
- **기장(Pilot)**: 담당 토잉카 상태, 도킹 요청/해제 버튼, 토잉 완료 알림
- **마샬러(Marshaller)**: 수신호 AI 피드백 화면

지도: `MapInfo.imagePath` 이미지 위에 `Node` 좌표 오버레이. A\* 경로 미리보기 (3개 옵션 표시). 실시간 차량 위치 `broadcastCarStatus` 수신 갱신.

---

## 4. 문제 해결 과정

**Day 3~5 (2026-01-19, CI/CD 파이프라인)**

문제: GitLab CI push마다 파이프라인 실패. 백엔드 빌드 테스트가 동작하지 않음

원인: `DOCKER_TLS_CERTDIR` 환경변수 미설정 → DinD(Docker-in-Docker) 서비스가 TLS 인증서를 찾지 못해 2375 포트 연결 실패. `.gitlab-ci.yml` 코멘트에 직접 기록됨: `"이 줄이 없으면 2375 포트 연결 에러가 납니다!"`

시도:
- yml 문법 오류 수정 반복 (커밋 5회 이상 연속, `CI 스크립트 수정` → `CI yaml 수정` → `CI 오타 수정`)
- Docker 이미지 변경

최종 해결: `DOCKER_TLS_CERTDIR: ""` 변수 명시 추가. MR 대상 브랜치가 `dev`일 때만 백엔드 빌드 테스트 트리거, master/dev push 시 Docker build→EC2 배포 트리거로 스테이지 분리

결과: push → 자동 빌드/테스트 → Docker Hub 이미지 push → EC2 SSH 배포 파이프라인 완성

---

**Day 5~7 (2026-01-21~23, MQTT→WebSocket 비동기 처리)**

문제: MQTT로 토잉카 상태를 수신한 뒤 DB 저장 + WebSocket 브로드캐스트를 트랜잭션 안에서 실행 → MQTT 발행이 DB 커밋 전에 나가는 경우 발생. 수신 측이 아직 반영 안 된 상태를 읽음

원인: `@Transactional` 메서드 안에서 `towingCarMqttService.publish(...)` 직접 호출 → 트랜잭션 완료 전에 MQTT 메시지 발행됨

시도:
- 발행 순서를 서비스 레이어 끝으로 이동 → Proxy 방식 트랜잭션에서 실행 시점 보장 안 됨

최종 해결: `TxUtil.executeAfterCommit(Runnable)` 유틸 구현. `TransactionSynchronizationAdapter.afterCommit()` Hook을 사용해 DB 커밋 이후에만 MQTT 발행. 모든 MQTT publish 호출을 `TxUtil.executeAfterCommit(() -> mqttService.publish(...))` 으로 래핑

결과: DB 상태 반영 후 MQTT 발행 순서 보장. `dispatch`, `connect`, `disconnect`, `emergencyStop` 전 메서드 적용

---

**Day 7~10 (2026-01-23~26, WebSocket 인증 분리)**

문제: WebSocket 핸드셰이크에 일반 Access Token (15분 유효)을 그대로 사용 → URL 쿼리 파라미터로 전달되는 WebSocket 토큰이 브라우저 히스토리·로그에 노출될 위험. Access Token과 WebSocket 연결 권한을 분리할 방법 없음

원인 분석: WebSocket 연결은 HTTP 핸드셰이크를 통해 이뤄지므로 Authorization 헤더를 표준적으로 사용할 수 없음. 쿼리 파라미터 방식을 쓰되 토큰 수명을 줄여야 함

시도:
- Access Token을 그대로 사용 → 유효기간이 길어 탈취 시 위험

최종 해결: JWT에 `token_type` claim 추가. 3가지 토큰 타입 정의:
- `ACCESS` (15분): REST API 인증용
- `REFRESH` (7일): 토큰 갱신용, Redis에 저장
- `SOCKET` (1분): WebSocket 핸드셰이크 전용, 로그인 시 함께 발급

`AuthHandshakeInterceptor`에서 `socket_token` 쿼리 파라미터 검증. `isSocketToken()` 확인 → ACCESS Token으로 WebSocket 연결 시 거부. 커밋: `[S14P11A402-163] 로그인 인증 후 액세스(임시), 웹소켓 연결을 위한 토큰 발급 및 웹소켓 연결 시 세션 등록 처리`

결과: ACCESS/SOCKET 토큰 완전 분리. WebSocket 연결 토큰 노출 위험 최소화 (1분 유효)

---

**Day 10~13 (2026-01-26~29, 서비스 구조 비대화)**

문제: 하나의 서비스 클래스에 MQTT 수신, WebSocket 발행, 비즈니스 로직, DB 접근이 혼재. 기능 추가마다 의도치 않은 사이드이펙트 발생

원인: 초기 프로토타입 코드를 인터페이스 설계 없이 직접 확장

시도:
- 메서드 단위 분리 → 의존성 관계가 꼬여서 중단

최종 해결: 3차 리팩토링 순차 진행

1. `S14P11A402-159`: Entity 구조 개선 (TowingCar/Mission DB Adaptor 책임 분리)
2. `S14P11A402-173`: 코드 정렬 및 책임 분리 — 서비스 레이어 분해
3. `S14P11A402-189`: MQTT 인터페이스 분리 — 최상위 `MqttService` 인터페이스 + 도메인별 `TowingCarMqttService`, WebSocket도 동일 패턴 적용. 토픽 문자열 `MqttTopics` 상수 클래스 별도 관리

결과: 도메인 추가 시 기존 서비스 터치 없이 구현체만 추가 가능한 구조

---

**Day 15~17 (2026-01-29 ~ 2026-02-04, 커스텀 예외 + AOP)**

문제: 예외 처리가 `throw new RuntimeException("메시지 하드코딩")` 형태로 산재. 에러 응답 포맷 불일치. 어떤 메서드가 얼마나 오래 걸리는지 운영 중 파악 불가

원인: 예외 설계 없이 빠르게 개발한 결과

시도:
- 각 throw 위치를 직접 찾아서 교체 → 누락 다수

최종 해결 (2가지 병행):

1. **커스텀 예외 계층** (`S14P11A402-192`):
   - 기반 클래스: `BusinessException(HttpStatus, errorCode, message)`
   - 파생 클래스: `CarAlreadyInUseException`, `TowingCarNotFoundException`, `FlightNotFoundException`, `InvalidJwtTokenException`, `MalformedMqttPayloadException`, `MqttPublishException` 등 도메인별 10+종
   - `GlobalExceptionHandler`: `@RestControllerAdvice`로 전역 처리, HTTP Status 자동 매핑
   - WebSocket/MQTT 예외는 별도 DTO로 클라이언트 전달

2. **AOP 로깅** (`S14P11A402-194`):
   - `LoggingAspect`: `*Controller`, `*Service` 전체 메서드 `@Around` 어드바이스. 메서드명, 인자, 실행시간, 반환값 자동 로깅
   - `PerformanceAspect`: `@LogExecutionTime` 어노테이션 붙은 메서드의 실행시간 측정
   - Springwolf STOMP 엔드포인트 자동 문서화 추가

결과: 예외 발생 위치와 타입이 로그에서 즉시 식별 가능. 코드에서 하드코딩된 에러 메시지 제거

---

**Day 17~19 (2026-02-03~04, Redis 인증 개선)**

문제: 서버 재시작 시 Refresh Token 소멸 → 모든 사용자 재로그인 필요. Redis host가 코드에 하드코딩됨

원인: Refresh Token을 인메모리에만 저장. `spring.data.redis.host` 환경변수 참조 누락

시도:
- Redis host 수정 3회 연속 커밋 (`Fix: Redis host configuration to use env variables` x3) — 배포 환경마다 다른 host 값 적용 실패 반복

최종 해결:
- `RedisConfig`에서 `@Value("${spring.data.redis.host}")` 환경변수 주입
- `RefreshTokenRepository`: Redis에 TTL 7일로 Refresh Token 저장
- **Refresh Token Rotation**: `refreshToken()` 호출 시 기존 토큰 폐기 + 신규 발급 (재사용 감지 시 전체 세션 무효화)
- `@Transactional` 제거 (`login()` 메서드): BCrypt 연산 중 DB 커넥션을 잡아두지 않도록 최적화 (커밋 코멘트에 "DB Connection holding time optimization" 명시)

결과: 서버 재시작 후에도 Refresh Token 유지. 토큰 탈취 후 재사용 시 자동 무효화

---

**Day 21 (2026-02-06, 상태 롤백 버그)**

문제: 토잉카가 게이트 도착 후 `DOCKING` 상태로 전환됐는데, 계속 `MOVING_TO_GATE` 상태로 인식되어 동일 동작을 반복 실행

원인 (커밋 메시지 직접 인용):

> "`checkAndTriggerAutoActions`에서 CONNECT 명령을 통해 상태를 DOCKING으로 변경했으나, **직후 Payload의 과거 상태(MOVING_TO_GATE)가 DB를 덮어쓰면서** 상태가 롤백됨 → 계속 MOVING_TO_GATE로 인식되어 반복 실행"

타임라인:
1. MQTT 수신: payload.mode = `MOVING_TO_GATE` (차량의 이전 상태 - 네트워크 지연)
2. `checkAndTriggerAutoActions()` 실행: 게이트 도착 감지 → DB 상태를 `DOCKING`으로 변경
3. `assignedCar.updateStatus(..., status)` 실행: `status` 변수는 여전히 payload의 `MOVING_TO_GATE` → DB를 다시 `MOVING_TO_GATE`로 덮어씀
4. 다음 MQTT 수신에서 또 게이트 도착 감지 → 무한 루프

시도:
- `checkAndTriggerAutoActions` 실행 순서 변경 → 근본 원인 해결 안됨

최종 해결: 2가지 안전장치 추가 (코드에 현존):

```java
// 안전장치 1: 페이로드 파싱 직후
if (assignedCar.getCarStatus() == CarStatus.DOCKING
    && status == CarStatus.MOVING_TO_GATE) {
    status = CarStatus.DOCKING; // 과거 상태 무시
}

// 안전장치 2: 자동 액션 실행 후
CarStatus preAutoActionStatus = assignedCar.getCarStatus();
checkAndTriggerAutoActions(assignedCar, x, y, status);
if (assignedCar.getCarStatus() != preAutoActionStatus) {
    status = assignedCar.getCarStatus(); // 자동 액션이 바꾼 상태 우선
}
```

결과: 상태 전환 후 이전 페이로드가 DB를 덮어쓰는 문제 차단

---

**Day 21 (2026-02-06, BCrypt 병목 발견)**

문제: 동시 로그인 부하 시 응답 지연 발생

원인 (커밋 메시지 직접 인용):

> "로그인 병목 구간 확인(BCrypt에서 병목) Scale-out을 하던 동시 접속 제한을 두던 해야할듯"

원인 분석: BCrypt의 work factor(cost)가 높을수록 해싱 시간이 기하급수적으로 증가. 단일 서버에서 다수의 동시 로그인 요청이 들어오면 BCrypt 연산이 CPU를 과점유

해결 방향 검토 (미적용):
- Scale-out (수평 확장)
- 동시 접속 제한 (Rate Limiting)
- BCrypt work factor 낮추기 (보안 약화)
- 비동기 처리 (별도 스레드 풀)

결과: 발견 및 기록. 3주 프로젝트 기간 내 해결 미착수. `@Transactional` 제거 및 Redis 세션 구조 개선으로 부분 완화

---

## 5. 배운 점

- **트랜잭션과 외부 시스템 통신은 절대 섞으면 안 된다.** MQTT publish를 `@Transactional` 안에서 직접 호출하면 DB 커밋 전에 나가는 경우가 생긴다. `executeAfterCommit` 패턴이 정답이었다.
- **WebSocket 인증에는 전용 토큰이 필요하다.** HTTP 핸드셰이크 과정에서 쿼리 파라미터로 노출되는 토큰은 수명을 극단적으로 짧게 제한해야 한다.
- **상태 머신에서 외부 입력(MQTT 페이로드)은 항상 "오래됐을 수 있다"고 가정해야 한다.** 네트워크 지연으로 이미 전환된 상태보다 과거의 상태 값이 나중에 도착할 수 있다. DB의 현재 상태가 페이로드보다 항상 우선이어야 한다.
- **예외 설계는 첫 날부터 해야 한다.** 후반에 `throw new RuntimeException()` 을 전부 찾아서 바꾸는 작업은 기능 개발보다 더 오래 걸렸다.
- **GraphCache + UsageManager로 A\*에 실시간 잠금을 넣어야 다차량 충돌을 막는다.** 지도가 정적이라도 차량이 여럿이면 간선 잠금 없이는 두 차량이 동일 경로를 배정받는다.

---

## 6. 회고

**잘한 점**: 상태 롤백 버그의 발생 경위를 커밋 메시지에 단계별로 정확히 기술했다. `TxUtil.executeAfterCommit`처럼 재사용 가능한 인프라 유틸리티를 직접 만든 것. A\* 위에 Yen's K-Shortest를 얹어 경로 옵션 3개를 제공한 것.

**아쉬운 점**: BCrypt 병목을 발견만 하고 해결하지 못했다. Redis host 환경변수 문제로 동일 커밋이 3번 반복된 것. `UsageManager` 잠금이 서버 재시작 시 초기화되어 차량이 운행 중이면 경로 잠금 정보가 소멸된다.

**다시 만든다면**: `processCarMonitoring`의 상태 처리를 상태 패턴(State Pattern) 또는 이벤트 소싱으로 설계. 외부 차량 상태와 내부 DB 상태를 명확히 분리하는 계층 추가. BCrypt는 처음부터 비동기 스레드 풀로 분리. `UsageManager` 잠금을 Redis로 이관하여 서버 재시작에도 유지.

**추가하고 싶은 것**: k6 부하 테스트 결과 기반 서버 튜닝, Refresh Token 재사용 감지 알림, 토잉카 위치 이력 시각화 대시보드

---

## 메타

- 기간: 2026-01-16 ~ 2026-02-09 (약 3주)
- 팀 구성: 6인 (백엔드 yoonpyo 단독, 프론트엔드 2인, AI 1인, 임베디드 1~2인)
- 역할: 백엔드 단독 개발 (Spring Boot 전체 — 인증, 상태 머신, 경로 알고리즘, MQTT/WebSocket 통신, CI/CD, AOP)
- 기술 스택: Spring Boot 3.5, Java 17, Spring Security + JWT (jjwt), Redis (Lettuce), MQTT (Eclipse Paho + Spring Integration), WebSocket/STOMP, Spring AOP, A\* + Yen's K-Shortest, RDP 알고리즘, GraphCache, Springwolf, Swagger (SpringDoc), GitLab CI/CD, Docker
- 레포: GitLab (S14P11A402)
