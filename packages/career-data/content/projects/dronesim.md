# DroneSim

## 개요

가상 드론의 비행 상태, 카메라, 지상통제 명령을 같은 C++ 시뮬레이션에서 시험하는 개인 프로젝트입니다.

## 설계 선택

화면에서 조작하는 실행과 JSON 시나리오 실행은 동일한 `SimulationCore`를 사용합니다. 렌더링·입력 장치 없이도 같은 Tick 규칙으로 편대 비행과 통신 장애를 반복 확인할 수 있도록 한 구조입니다.

시뮬레이션은 1/60초 고정 Tick으로 진행하고 렌더링은 최신 상태를 별도로 표시합니다. Windows 네이티브에서는 선택적으로 AirSim 강체 물리를 호출합니다. 브라우저 빌드에는 AirSim이 포함되지 않아 운동학 모델을 사용합니다.

## 구현

`AdvanceOneTick`은 먼저 공통 ECS 상태를 진행하고, 네이티브 강체 모드일 때만 AirSim 물리 단계를 호출합니다. 마지막에 Tick 번호와 카메라 자세를 동기화합니다. 다음은 공개 `SimulationCore.cpp`의 핵심 흐름입니다.

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

웹 빌드는 `__EMSCRIPTEN__` 분기에서 강체 계산을 제외합니다. 따라서 웹 데모는 입력과 시뮬레이션 흐름을 확인하는 용도이며, 네이티브 물리나 실기체 동작을 검증하지 않습니다.

## 문제 해결 과정

드론 수가 늘면 충돌 상자 쌍을 비교하는 비용이 커졌습니다. 멀리 떨어진 객체의 충돌 후보 검사를 줄이고, 충돌 상자 변환 결과를 Tick 안에서 재사용하도록 수정했습니다. 공개 Windows Release 기록에는 분리 배치 64대와 밀집 배치 32대의 전후 Tick p95 비교가 있습니다. 측정 반복 횟수와 조건은 아래 측정 섹션에 따로 표시합니다.

## 공개 출처

- [DroneSim 저장소](https://github.com/cgantro/DroneSim)
- [SimulationCore.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/SimulationCore.cpp)
- [ScenarioRunner.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp)
- [개발 원리와 측정 조건](https://github.com/cgantro/DroneSim/blob/main/docs/public/기술검토.md)
