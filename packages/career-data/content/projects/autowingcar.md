# 오토잉카 (AutoWing Car)

## 프로젝트 개요

공항 견인차에 운행 명령을 보내고, 차량 위치와 상태를 관제하는 6인 팀 프로젝트입니다. 서버가 차량 메시지와 관제 화면을 연결하고, 운행 경로를 계산합니다.

## 주요 기능

- MQTT로 차량 위치·속도·배터리·운행 상태와 명령 확인 응답 수신
- WebSocket·STOMP로 차량·항공편·비상 알림을 관제 화면에 전달
- 운행 상태와 주행 이력 저장
- A*와 Yen 알고리즘으로 이동 시간 기준 경로와 대체 경로 계산, RDP로 경로 점 정리

## 역할

6인 팀에서 백엔드 서버를 맡았습니다. MQTT 차량 통신과 상태 관리, 관제 화면 갱신, 데이터 저장을 구현했습니다. 차량 상태 전이와 명령 발행 순서를 조정하고, A*·Yen 경로 탐색과 RDP 단순화도 맡았습니다.

## 트러블슈팅

### 자동 상태 변경 뒤 차량의 이전 상태가 다시 저장됨

게이트 도착 메시지를 처리하면서 서버가 자동으로 차량을 `DOCKING`으로 바꿨지만, 같은 메시지에 담긴 이전 상태 `MOVING_TO_GATE`가 뒤이어 저장될 수 있었습니다. 자동 동작 전 상태를 보관하고 처리 후 값이 바뀌었으면 서버가 정한 상태를 우선 저장하도록 했습니다. 이어 상태 조정기가 허용된 전이인지 확인합니다.

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

운행 정보를 저장하는 트랜잭션이 실패해도 MQTT 명령이 먼저 차량에 전달될 수 있었습니다. 명령 발행을 트랜잭션 커밋 뒤로 옮겼습니다.

```java title="커밋 이후 명령 발행"
TxUtil.executeAfterCommit(
    () -> towingCarMqttService.sendDriveCommand(carCode, payload));
```

## 결과

명령을 보냈다는 확인 응답과 차량이 실제로 보고한 주행 상태를 분리해 관리합니다. 상태 변경은 MQTT에서 받아 저장하고 관제 화면에 전달하며, 경로 탐색은 통제 구간과 다른 차량이 점유한 지점·간선을 후보에서 제외합니다. 대체 경로는 최대 3개까지 계산합니다.
