# DroneSim

## 개요

가상 드론의 비행 상태와 카메라, 지상통제 명령을 시험하는 C++ 시뮬레이터입니다. 화면 조작과 화면 없는 JSON 시나리오가 같은 `SimulationCore`를 사용해 편대 비행, 공동 임무, 통신 지연·손실을 반복 실행할 수 있습니다.

## 설계 선택

시뮬레이션은 초당 60회 고정 간격으로 상태를 갱신하고, 렌더링은 최신 상태를 화면에 그립니다. 화면 갱신률이 달라져도 비행 규칙은 같은 간격으로 처리되도록 두 흐름을 분리했습니다. 게임패드, UDP 지상통제와 JSON 시나리오 입력은 공통 드론 명령으로 변환합니다.

네이티브 실행은 선택에 따라 AirSim 강체 물리를 사용하고, WebAssembly는 운동학 모델을 사용합니다. 물리 엔진 차이는 한 주기 처리 경계에 두고 시나리오 실행과 상태 갱신 흐름은 공유합니다.

## 구현

`AdvanceOneTick`은 일시 정지 상태를 확인한 뒤 Flecs 상태를 갱신하고, 네이티브 강체 모드에서만 AirSim 계산을 호출합니다. 주기 번호와 카메라 자세는 마지막에 맞춥니다.

```cpp
void SimulationCore::AdvanceOneTick()
{
    if (paused_)
        return;

    ecs_->world.progress(DroneModel::fixedStepSeconds);
#if !defined(__EMSCRIPTEN__)
    if (ecs_->dynamics == SimulationDynamics::RigidBody)
        ecs_->AdvancePhysicsWorld();
#endif
    ++ecs_->tickCount;
    ecs_->SynchronizeCameraPose();
}
```

화면 없는 실행에서도 같은 코어에 시나리오를 넣어 최종 상태를 확인합니다. 입력 장치나 렌더링에 기대지 않고 드론 수, 편대 구성, 통신 장애에 따른 동작을 반복 시험할 수 있습니다.

## 문제 해결 과정

드론이 늘면서 모든 충돌 상자를 서로 비교하는 계산이 주기 시간을 키웠습니다. 먼저 멀리 떨어진 객체를 충돌 후보에서 제외하고, 한 주기 안에서 구한 충돌 상자 변환값을 재사용하도록 바꿨습니다. 분산 배치와 밀집 배치의 결과는 아래 측정값으로 나눠 확인할 수 있습니다.
