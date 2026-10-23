# DroneSim

## 개요

DroneSim은 가상 드론의 비행 상태와 탑재 카메라, 지상통제 명령을 시험하는 C++ 시뮬레이터입니다. 저장소 이름은 DroneSim이며 실행 화면에는 AeroSimLab이라는 제품명이 표시됩니다.

## 설계 선택

### 화면 실행과 자동 시나리오가 같은 중심부를 사용

화면이 있는 시뮬레이터와 `aerosimlab_headless`는 같은 `SimulationCore`를 실행합니다. 지상통제 UDP, 게임패드, JSON 시나리오는 서로 다른 입구지만, 최종적으로 같은 드론 상태와 Tick 진행 규칙에 명령을 적용합니다. 그래서 화면이나 입력 장치 없이도 편대 비행, 통신 장애, 카메라 상태와 임무 결과를 반복 확인할 수 있습니다.

시뮬레이션 Tick은 1/60초의 고정 간격입니다. 화면 프레임이 늦어져도 Tick 누적기를 통해 같은 간격으로 상태를 진행하고, 렌더링은 최신 상태를 별도로 그립니다.

### 네이티브 강체 계산과 웹 운동학 모델을 구분

Windows 네이티브 강체 모드에서는 Flecs 시스템이 비행 상태와 로터 목표를 갱신한 다음 AirSim에 물리 계산을 맡깁니다. 장면 쪽에서는 지형·장애물의 상자 접촉을 찾아 물리 단계에 전달합니다. WebAssembly에는 AirSim을 포함하지 않고 운동학 기준 모델을 사용합니다.

웹 데모는 조작 흐름을 살펴보는 용도입니다. 실기체의 비행 성능을 예측하거나 네이티브 강체 물리를 검증하지 않습니다. 게임패드 경로가 있어도 실제 기기별 동작은 확인되지 않았습니다.

## 구현

### 고정 Tick에서 공통 상태 갱신

`SimulationCore::AdvanceOneTick`은 공통 ECS 진행을 먼저 수행합니다. 네이티브 빌드에서 강체 모드를 선택한 경우에만 AirSim 단계를 호출한 뒤 Tick 번호와 EO 카메라 자세를 맞춥니다. 다음은 공개 소스의 핵심 흐름입니다.

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

실제 함수에는 계측 초기화와 선택적 처리시간 기록도 포함되어 있습니다. `__EMSCRIPTEN__` 분기는 웹 빌드에서 AirSim 강체 계산을 제외합니다.

### 시나리오 파일로 통신 장애와 편대 동작 재현

시나리오 실행기는 Tick마다 예약 명령과 임무, 편대 위치 공유, 카메라 이벤트를 적용한 다음 공통 시뮬레이션을 한 번 진행합니다. 예를 들어 공개 `leader-following-outage.json`은 두 드론을 이륙시켜 편대 링크를 잠시 끊고, 마지막 위치와 최소 간격을 확인합니다.

```json
{
  "version": 1,
  "dynamics": "kinematic",
  "ticks": 300,
  "drones": [
    { "name": "lead", "initial_position_meters": [0, 0, 0] },
    { "name": "wing", "initial_position_meters": [-2, 0, 0] }
  ],
  "formation_links": [
    {
      "leader": "lead",
      "follower": "wing",
      "offset_meters": [-2, 0, 0],
      "outages": [{ "start_tick": 120, "end_tick": 180 }]
    }
  ],
  "commands": [
    { "tick": 0, "drone": "lead", "type": "takeoff" },
    { "tick": 0, "drone": "wing", "type": "takeoff" },
    {
      "tick": 90,
      "drone": "lead",
      "type": "set_waypoint",
      "position_meters": [4, 0, 1.5]
    }
  ],
  "expected": {
    "tolerance_meters": 0.05,
    "minimum_drone_separation_meters": 1.9,
    "drones": [
      { "name": "lead", "mode": "hovering", "position_meters": [4, 0, 1.5] },
      { "name": "wing", "mode": "hovering", "position_meters": [2, 0, 1.5] }
    ]
  }
}
```

`passed` 결과는 시나리오가 정의한 가상 조건과 기대값을 비교한 것입니다. 실제 무선망, 실제 기체의 간격 유지, 비행 안전을 보증하지 않습니다.

### 충돌 후보 계산량을 줄이고 반복 측정

드론 수가 늘 때 충돌 상자를 모두 비교하지 않도록 멀리 떨어진 드론의 충돌 후보 검사를 줄였습니다. 공개 Release 측정에서 분리 배치 64대의 Tick p95는 493.9µs에서 137.7µs로 낮아졌습니다. 가까이 겹친 32대 배치에서는 충돌 상자 변환을 Tick마다 한 번으로 제한해 p95 중앙값을 1,344.3µs에서 665.1µs로 낮췄습니다. 각 전후 비교는 세 번 반복했습니다.

이 값은 해당 Windows Release 빌드와 배치에서의 Tick 처리 시간입니다. 화면 렌더링, UDP, 영상 분석을 포함한 전체 프레임 지연이나 다른 컴퓨터의 성능으로 일반화하지 않습니다. README는 분리 배치 1,024대 결과는 한 번, 운동학 모드 1,024대와 공동 임무 실행은 별도의 반복 조건으로 구분해 기록합니다.

### 검증 범위

- 네이티브 강체 물리는 AirSim으로 계산합니다. 물리 계수는 공개 자료를 참고했지만 실제 비행 기록과 대조하지 않았습니다.
- 웹 실행과 일부 자동 시나리오에는 모터·관성·추력을 계산하지 않는 운동학 기준 모델을 사용할 수 있습니다.
- 드론과 장애물은 상자 형상으로 근사합니다. 정밀 메시 충돌과 여러 접촉을 한 번에 푸는 물리 반응은 지원하지 않습니다.
- 지형 높이 자료 간격은 약 30m입니다. 자료가 없는 일부 건물에는 시연용 높이를 사용합니다.

## 공개 출처

- [DroneSim 저장소](https://github.com/cgantro/DroneSim)
- [SimulationCore.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/SimulationCore.cpp)
- [ScenarioRunner.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp)
- [leader-following-outage.json](https://github.com/cgantro/DroneSim/blob/main/scenarios/multi-drone/leader-following-outage.json)
- [개발 원리와 측정 조건](https://github.com/cgantro/DroneSim/blob/main/docs/public/기술검토.md)
