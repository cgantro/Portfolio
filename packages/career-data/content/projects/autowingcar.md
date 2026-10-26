# 오토잉카 (AutoWing Car)

## 프로젝트 개요

공항에서 견인차에 운행 명령을 보내고 차량 상태와 경로를 관제하는 6인 팀 프로젝트입니다. 차량 메시지를 서버에서 처리해 관제 화면과 주행 기록에 반영합니다. 개발 기간은 2026년 1~2월이며 Java·Spring Boot·MQTT·WebSocket·STOMP·Redis·PostgreSQL을 사용했습니다.

## 주요 기능

- 관제 화면에서 견인차 위치와 운행 상태를 확인합니다.
- 차량에 운행 명령을 보내고 장비의 명령 수신 응답을 확인합니다.
- 차량·항공편·비상 알림의 변경 내용을 실시간으로 확인합니다.
- 통제 구간과 다른 차량이 점유한 구간을 피해 이동 경로와 대체 경로를 찾습니다.
- 차량 상태와 주행 이력을 저장합니다.

## 역할

6인 팀에서 Spring Boot 백엔드와 차량 메시지 처리를 맡았습니다. MQTT로 차량 상태와 명령 응답을 받고, WebSocket·STOMP로 관제 화면을 갱신했습니다. Redis에 최신 상태를 두고 PostgreSQL에 주행 이력을 저장했으며, 상태 전이·명령 처리 순서와 DB 커밋 이후 MQTT 발행을 구현했습니다. 이동 시간 비용을 적용한 A*·Yen 경로 탐색과 RDP 경로 단순화도 담당했습니다.

## 트러블슈팅

### 자동 상태 변경 뒤 이전 차량 상태가 다시 저장됨

게이트 도착 메시지 처리 중 서버가 차량 상태를 `DOCKING`으로 바꾼 뒤, 같은 메시지에 담긴 과거 상태 `MOVING_TO_GATE`가 다시 저장될 수 있었습니다. 자동 동작 전 상태를 보관하고 처리 뒤 상태가 바뀌었으면 서버가 정한 상태를 우선 적용하도록 했습니다. 이어 상태 조정기가 허용된 전이인지 확인합니다.

```java title="차량 상태 갱신"
CarStatus preAutoActionStatus = assignedCar.getCarStatus();
checkAndTriggerAutoActions(assignedCar, x, y, status);

if (assignedCar.getCarStatus() != preAutoActionStatus) {
    status = assignedCar.getCarStatus();
}

status = stateCoordinator.resolveCarStatus(assignedCar, status);
assignedCar.updateStatus(x, y, heading, velocity, battery, status);
```

### DB 반영 전에 차량 명령이 먼저 발행됨

운행 정보를 저장하는 트랜잭션이 실패해도 MQTT 명령이 먼저 차량에 전달될 수 있었습니다. 명령 발행을 트랜잭션 커밋 이후로 옮겨 DB 반영이 끝난 뒤에만 차량으로 명령을 보내도록 했습니다.

```java title="커밋 이후 명령 발행"
TxUtil.executeAfterCommit(
    () -> towingCarMqttService.sendDriveCommand(carCode, payload));
```

## 결과

상태 갱신 역행과 커밋 전 명령 발행 문제를 고쳐, 서버 기록과 차량 명령의 처리 순서를 맞췄습니다.
