# DroneSim

## 개요

드론 비행과 지상통제 명령을 한 환경에서 시험하는 M&S 시뮬레이터입니다. 화면 조작과 JSON 시나리오가 같은 SimulationCore를 실행합니다. 입력 장치나 화면에 기대지 않고 비행 규칙과 임무 결과를 반복 확인할 수 있게 구성했습니다.

화면에서는 비행 상태와 EO 카메라 영상을 확인하고, UDP 지상통제 명령을 보낼 수 있습니다. 화면 없는 시나리오에서는 여러 기체의 편대·공동 임무와 상태 보고 단절을 재현합니다. 영상 인식이나 실기체 비행 검증을 구현한 것은 아닙니다.

## 고정 주기 시뮬레이션과 물리 모델

화면 프레임마다 비행 상태를 한 번씩 갱신하면 PC 성능과 화면 갱신률에 따라 모의 결과가 달라집니다. DroneSim은 누적 시간을 1/60초 단위로 소비해 시뮬레이션 Tick을 진행하고, 렌더링은 그 결과를 그립니다. 게임패드·UDP·JSON 입력은 공통 드론 명령으로 바꿔 같은 시뮬레이션 흐름에 넣습니다.

Flecs ECS가 각 Tick의 드론 상태를 갱신하고, 네이티브 실행은 선택한 물리 모드에 따라 AirSim 강체 계산을 연결합니다. WebAssembly에서는 운동학 기준 모델을 씁니다. 두 실행은 입력과 시나리오 흐름을 공유하지만 물리 계산은 같지 않습니다.

## 입력에서 화면과 시험 결과까지

입력은 공통 명령으로 변환된 뒤 SimulationCore의 고정 Tick에서 처리됩니다. 갱신한 상태는 화면의 OpenGL 장면과 EO 카메라에 전달되고, JSON 시나리오 실행에서는 임무 완료·장애 대응 결과를 기록합니다. 물리 선택과 화면 출력의 경계를 나눠 같은 비행 규칙을 대화형 실행과 자동 시험에서 재사용했습니다.

## 충돌 후보 정렬 재사용

충돌 계산은 충돌 상자의 X 좌표 순으로 정렬한 강체 목록에서 서로 가까운 후보만 살핍니다. 이전에는 Tick마다 목록 전체를 정렬했습니다. 드론이 서로 앞지르지 않았다면 순서는 유지되므로, 좌표만 갱신하고 순서가 바뀐 경우에만 다시 정렬하도록 바꿨습니다.

[PhysicsWorld.cpp의 정렬 재사용 코드](https://github.com/cgantro/DroneSim/blob/69ecab93/modules/simulation_core/src/PhysicsWorld.cpp#L544-L549)

```cpp
for (auto& [positionX, bodyIndex] : bodyPositionsByX)
    positionX = bodies[bodyIndex]->collisionState.positionMeters.x;

if (!std::is_sorted(bodyPositionsByX.begin(), bodyPositionsByX.end()))
    std::sort(bodyPositionsByX.begin(), bodyPositionsByX.end());
```

이 최적화가 적용된 변경 전후 커밋에서 분리·밀집 배치를 각각 측정했습니다. 아래 값은 각 조건의 세 반복에서 구한 물리 단계 p95의 중앙값입니다. 감소율은 이 중앙값을 기준으로 다시 계산했습니다.

| 배치 | 드론 수 | 변경 전 | 변경 후 | 감소율 |
| --- | ---: | ---: | ---: | ---: |
| 분리, 간격 2.5m | 128 | 188.0µs | 184.2µs | 2.0% |
| 분리, 간격 2.5m | 256 | 370.1µs | 345.4µs | 6.7% |
| 분리, 간격 2.5m | 512 | 741.8µs | 669.9µs | 9.7% |
| 밀집, 간격 0.55m | 128 | 472.3µs | 408.6µs | 13.5% |
| 밀집, 간격 0.55m | 256 | 827.6µs | 791.6µs | 4.4% |

Windows Release에서 준비 Tick 120회 뒤 조건별 30,000 Tick을 세 번 실행했습니다. 물리 단계 시간은 충돌 계산을 포함한 구간입니다. 접촉 후보 생성에는 정렬 외에 충돌 상자 좌표 갱신과 후보 쌍 검사도 포함되므로, 전체 감소량을 정렬 생략 하나의 효과로 단정할 수 없습니다. 이 확장성 시험에는 지형과 정적 장애물을 넣지 않았습니다. [변경 전 원자료](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-94c39b94-before-sort-reuse.json)와 [변경 후 원자료](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-69ecab93-after-sort-reuse.json)에서 반복값을 확인할 수 있습니다.

## 상태 보고 단절 뒤 임무 재할당

다중 기체 시나리오는 임무 시작 직전 일부 드론의 상태 보고를 끊고, 남은 기체가 미완료 과제를 이어받는지 확인합니다. 준비 실행 뒤 드론 수별로 세 번 측정했으며, 모든 과제를 기한 안에 끝내면 해당 시나리오를 통과한 것으로 판정했습니다.

| 드론 수 | 상태 보고 단절 | 재할당 횟수 중앙값 | 임무 완료율 | 시나리오 실행 시간 중앙값 |
| ---: | ---: | ---: | ---: | ---: |
| 4 | 1대 (25%) | 1회 | 100% | 2.210ms |
| 16 | 4대 (25%) | 4회 | 100% | 3.005ms |
| 64 | 16대 (25%) | 16회 | 100% | 7.895ms |
| 256 | 64대 (25%) | 64회 | 100% | 66.757ms |

이 결과는 운동학 기반 헤드리스 시나리오에서 상태 보고가 사라진 상황을 모의한 것입니다. 세 번의 실행에서 모든 과제가 완료됐고, 단절된 기체 수만큼 과제를 다시 배정했습니다. 실행 시간은 조정기만 따로 잰 값이 아니라 상태 갱신과 임무 처리를 포함한 시나리오 전체 시간입니다. 실제 UDP 링크 장애나 실기체 임무 성공률을 검증한 결과는 아닙니다. [시나리오 실행기](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp)와 [Release 측정 원자료](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-24-26c7fce1.json)를 함께 볼 수 있습니다.

## 물리 모델의 범위

AirSim 강체 물리는 Windows 네이티브 실행에서 사용하고, 웹 데모는 운동학 모델로 실행합니다. 공개된 물리 계수는 실제 비행 로그와 대조하지 않았으므로 실기체의 움직임을 예측하는 모델로 해석할 수 없습니다.
