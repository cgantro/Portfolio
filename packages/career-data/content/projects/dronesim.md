# DroneSim

## 개요

다중 드론의 비행과 지상통제, 통신 단절 뒤 임무 재할당을 시나리오로 시험합니다.

## 시뮬레이션 코어와 비행 모델

화면 프레임마다 비행 상태를 갱신하면 렌더링 속도에 따라 모의 시간이 달라집니다. 화면에서 지난 시간을 누적한 뒤 1/60초 단위로 소비해 시뮬레이션을 진행하도록 했습니다. 프레임이 늦어져도 한 프레임 안에서 필요한 Tick을 따라잡으며, JSON 시나리오도 화면 조작과 같은 `SimulationCore`를 호출합니다.

Flecs 시스템은 매 Tick 조종값과 기체 상태를 읽어 다음 상태를 계산합니다. 네이티브 빌드에서는 직접 구현한 어댑터가 ENU/FLU 좌표와 물리 계수를 AirSim 형식으로 바꿔 강체 물리에 전달합니다. WebAssembly 빌드는 같은 명령 흐름에 운동학 모델을 연결합니다. 이 구분으로 웹 실행 파일에서 AirSim 의존성을 제외했습니다.

EO 카메라도 시뮬레이션 Tick 뒤 기체 자세에 맞춰 움직입니다. 별도 해상도로 렌더링한 영상을 비동기 픽셀 읽기로 가져와 OpenCV로 밝기·대비·선명도를 계산합니다. 이 값은 영상 품질 지표이며, 물체 인식 결과는 아닙니다.

[SimulationCore.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/SimulationCore.cpp) · [PhysicsWorld.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/PhysicsWorld.cpp)

## 충돌 후보 정렬 재사용

충돌 후보를 찾기 전에 기체의 X 좌표순으로 목록을 정렬합니다. 기체가 많아지면 매 Tick 전체 정렬을 반복하는 비용이 커집니다. 기존 목록의 좌표만 갱신한 뒤 순서가 그대로면 정렬을 생략하고, 기체가 서로 앞질러 순서가 달라진 경우에만 다시 정렬하도록 바꿨습니다.

[PhysicsWorld.cpp의 정렬 재사용 코드](https://github.com/cgantro/DroneSim/blob/69ecab93/modules/simulation_core/src/PhysicsWorld.cpp#L544-L549)

```cpp
for (auto& [positionX, bodyIndex] : bodyPositionsByX)
    positionX = bodies[bodyIndex]->collisionState.positionMeters.x;

if (!std::is_sorted(bodyPositionsByX.begin(), bodyPositionsByX.end()))
    std::sort(bodyPositionsByX.begin(), bodyPositionsByX.end());
```

같은 조건에서 정렬 재사용 전후의 물리 단계 p95 중앙값을 비교했습니다.

| 배치·드론 수 | 물리 단계 p95 전 → 후 | 감소율 |
| --- | ---: | ---: |
| 분리·128대 | 188.0 → 184.2µs | 2.0% |
| 분리·256대 | 370.1 → 345.4µs | 6.7% |
| 분리·512대 | 741.8 → 669.9µs | 9.7% |
| 밀집·128대 | 472.3 → 408.6µs | 13.5% |
| 밀집·256대 | 827.6 → 791.6µs | 4.4% |

Windows Release에서 준비 Tick 120회 뒤 각 조건을 30,000 Tick씩 세 번 실행했습니다. 표에는 반복별 p95의 중앙값을 적었습니다. 물리 단계에는 좌표 갱신과 후보 쌍 검사도 들어가므로, 측정된 감소분을 정렬 생략 하나의 효과로 볼 수는 없습니다. 이 시험의 충돌 계산에는 지형과 정적 장애물이 포함되지 않았습니다. [변경 전 기록](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-94c39b94-before-sort-reuse.json) · [변경 후 기록](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-69ecab93-after-sort-reuse.json)

## 지상통제와 명령 처리

UDP 수신부는 패킷의 명령 종류와 형식을 확인해 비행, 카메라, 상태 조회 경로로 나눕니다. 상태 조회는 현재 값을 바로 응답하고, 비행·카메라 명령은 다음 Tick에 적용한 뒤 결과를 돌려줍니다. 지상통제 명령이 적용되는 Tick에는 게임패드나 기록 재생 입력을 함께 반영하지 않도록 우선순위를 정했습니다.

[Protocol.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/communication/src/Protocol.cpp)

## 통신 단절 시 임무 재할당

통신 복구 여부만 확인하는 대신, 보고가 끊긴 기체가 맡던 일을 다른 기체가 끝낼 수 있는지 JSON 시나리오로 시험했습니다. 상태 보고가 제한 시간 안에 돌아오지 않으면 기체를 `unknown`으로 처리하고 미완료 임무를 대기열에 돌립니다. 조정기는 연결되어 비행 중인 기체 중 목표에 가까운 기체를 골라 임무를 다시 맡깁니다. 이미 다른 구역을 맡은 기체라면 기존 구역을 대기열에 넣고 새 임무부터 처리합니다.

전체 기체의 25%에서 보고를 끊고 기체 수를 4대부터 256대까지 늘렸습니다. 세 번씩 실행한 모든 조건에서 남은 임무를 기한 안에 끝냈습니다.

| 드론 수 | 단절·재할당 | 완료율 | 전체 실행 시간 중앙값 |
| ---: | ---: | ---: | ---: |
| 4 | 1대·1회 | 100% | 2.210ms |
| 16 | 4대·4회 | 100% | 3.005ms |
| 64 | 16대·16회 | 100% | 7.895ms |
| 256 | 64대·64회 | 100% | 66.757ms |

실행 시간은 운동학 모델을 사용하는 헤드리스 시나리오 전체를 잰 값입니다. JSON 입력으로 단절 시점을 정한 시험이므로 실제 UDP 장애나 무선 환경에서의 성공률을 뜻하지 않습니다. [ScenarioRunner.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp) · [측정 기록](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-24-26c7fce1.json)

## 모델의 한계

실제 비행 로그와 물리 계수의 오차는 아직 대조하지 않았습니다. 충돌 형상은 상자로 단순화했고 강체마다 한 Tick에 접촉 한 건을 처리합니다.
