# DroneSim

## 개요

드론의 비행 상태와 탑재 카메라, 지상통제 명령을 한 C++ 시뮬레이터에서 다룹니다. 화면 조작과 JSON 시나리오 실행이 같은 시뮬레이션 중심부를 사용하도록 구성해, 화면이나 입력 장치 없이도 비행 동작을 반복 시험할 수 있게 했습니다.

## 설계 선택

시뮬레이션은 초당 60회 고정 간격으로 상태를 갱신하고, 화면은 최신 상태를 그립니다. 이 둘을 나눠 화면 갱신 시점이 비행 규칙에 영향을 주지 않게 했습니다. Windows 네이티브 실행에서는 선택적으로 AirSim 강체 물리를 연결하고, WebAssembly 빌드에서는 의존성에 맞춰 운동학 모델을 사용합니다.

## 구현

`AdvanceOneTick`에서 공통 ECS 상태를 갱신한 뒤, 네이티브 빌드에서 강체 모드를 선택한 경우에만 AirSim 계산을 수행합니다. 마지막에 주기 번호와 카메라 자세를 동기화합니다. 실행 환경별 차이를 이 경계에 모아 두어 입력과 주기 처리 흐름은 공유합니다.

```cpp
ecs_->world.progress(DroneModel::fixedStepSeconds);
#if !defined(__EMSCRIPTEN__)
if (ecs_->dynamics == SimulationDynamics::RigidBody)
    ecs_->AdvancePhysicsWorld();
#endif
++ecs_->tickCount;
ecs_->SynchronizeCameraPose();
```

## 문제 해결 과정

드론이 늘면서 충돌 상자끼리 모두 비교하는 계산이 주기 시간을 키웠습니다. 멀리 떨어진 객체를 충돌 후보에서 먼저 제외하고, 한 주기 안에서 계산한 충돌 상자 변환값을 다시 사용하도록 바꿨습니다. 수정 전후 성능은 드론을 넓게 배치한 경우와 충돌 상자가 가까이 겹치는 경우로 나눠 측정했습니다.
