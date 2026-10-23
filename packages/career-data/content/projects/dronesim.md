# DroneSim

## 개요

가상 드론의 비행 상태, 카메라, 지상통제 명령을 같은 C++ 시뮬레이션에서 시험하는 개인 프로젝트입니다.

## 설계 선택

화면에서 직접 조작하거나 JSON 시나리오로 실행할 때 모두 같은 `SimulationCore`를 사용합니다. 렌더링이나 입력 장치 없이도 같은 시간 간격으로 편대 비행과 통신 장애를 반복 시험할 수 있습니다.

시뮬레이션은 1/60초 간격으로 진행하고 화면에는 최신 상태를 따로 그립니다. Windows 네이티브 실행에서는 선택적으로 AirSim 강체 물리를 호출합니다. 브라우저용 빌드에는 AirSim이 없어 운동학 모델을 씁니다.

## 구현

`AdvanceOneTick`은 공통 ECS 상태를 먼저 갱신합니다. 네이티브에서 강체 모드를 선택했을 때만 AirSim 물리 계산을 수행하고, 마지막에 주기 번호와 카메라 자세를 맞춥니다. 다음은 공개 `SimulationCore.cpp`에서 핵심 처리만 옮긴 코드입니다.

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

웹 빌드는 `__EMSCRIPTEN__` 조건에서 강체 계산을 건너뜁니다. 웹 데모에서는 입력과 시뮬레이션 흐름만 확인할 수 있으며, 네이티브 물리나 실제 기체의 움직임은 검증할 수 없습니다.

## 문제 해결 과정

드론 수가 늘자 충돌 상자를 서로 비교하는 데 드는 시간이 커졌습니다. 멀리 떨어진 객체는 충돌 후보에서 제외하고, 충돌 상자 변환 결과는 한 주기 안에서 재사용하도록 고쳤습니다. 공개된 Windows Release 측정에는 드론 64대를 떨어뜨려 배치한 조건과 32대를 밀집 배치한 조건의 수정 전후 주기 p95가 기록돼 있습니다. 반복 횟수와 측정 조건은 아래에 따로 적었습니다.

## 공개 출처

- [DroneSim 저장소](https://github.com/cgantro/DroneSim)
- [SimulationCore.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/SimulationCore.cpp)
- [ScenarioRunner.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp)
- [개발 원리와 측정 조건](https://github.com/cgantro/DroneSim/blob/main/docs/public/기술검토.md)
