# 오토잉카 (AutoWing Car)

## 개요

공항 견인차에 운행 명령을 보내고 차량 상태를 관제하는 백엔드 팀 프로젝트입니다. 6인 팀에서 차량 MQTT 통신, 상태 갱신, 관제 화면 연동과 경로 탐색을 포함한 서버 개발을 맡았습니다.

## 차량 상태와 관제 데이터

차량은 MQTT로 위치·속도·배터리·운행 상태와 명령 확인 응답을 보냅니다. 서버는 명령을 보냈다는 사실과 차량이 실제로 보고한 운행 상태를 별도로 관리합니다. 변경된 차량·항공편·비상 알림은 WebSocket·STOMP로 관제 화면에 전달하고, 위치와 상태는 주행 이력으로 저장합니다.

## 자동 상태 전이 뒤 이전 값이 상태를 되돌린 문제

차량이 게이트에 도착한 상태 보고를 처리하는 중 서버의 자동 동작이 상태를 `DOCKING`으로 바꾼 뒤, 같은 메시지에 담긴 이전 상태 `MOVING_TO_GATE`가 저장될 수 있었습니다. 입력 상태를 그대로 쓰지 않고 자동 동작 전후의 상태를 비교해, 처리 중 서버가 상태를 바꿨다면 그 값을 저장하도록 했습니다.

```java title="차량 상태 갱신과 전이 조정"
CarStatus preAutoActionStatus = assignedCar.getCarStatus();
checkAndTriggerAutoActions(assignedCar, x, y, status);

if (assignedCar.getCarStatus() != preAutoActionStatus) {
    status = assignedCar.getCarStatus();
}

CarStatus oldStatus = assignedCar.getCarStatus();
status = stateCoordinator.resolveCarStatus(assignedCar, status);
assignedCar.updateStatus(x, y, heading, velocity, battery, status);
```

이후 `stateCoordinator`가 허용되는 차량 상태 전이를 확인합니다. 명령 확인 응답은 차량이 메시지를 받았다는 뜻이고, 실제 운행 상태는 별도 상태 보고로 갱신합니다.

## DB 커밋 뒤 MQTT 명령 발행

운행 정보를 갱신하는 트랜잭션이 롤백되더라도 MQTT 명령이 먼저 차량으로 전달될 수 있었습니다. `afterCommit`으로 발행 시점을 트랜잭션 성공 뒤로 옮겼습니다.

```java title="트랜잭션 커밋 뒤 MQTT 명령 발행"
TxUtil.executeAfterCommit(
    () -> towingCarMqttService.sendDriveCommand(carCode, payload));
```

이 순서는 DB 변경이 확정된 뒤 명령을 보내게 합니다. 발행 실패를 재시도하거나 DB와 브로커를 원자적으로 묶는 아웃박스 처리는 아니므로, 실제 전송·차량 수행까지 보장하지는 않습니다.

## 경로 탐색

A*는 간선별 예상 이동 시간을 비용으로 두고 경로를 찾습니다. 통제 구간과 다른 차량이 점유한 지점·간선은 후보에서 제외하며, Yen 알고리즘으로 대체 경로를 최대 3개 구합니다. 관제용 경로 데이터는 RDP로 경로 형상을 유지하며 중간점을 줄여 전달합니다.
