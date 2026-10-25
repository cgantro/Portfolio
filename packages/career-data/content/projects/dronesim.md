# DroneSim

## 개요

화면 조작과 JSON 시나리오가 같은 시뮬레이션 중심부를 사용하도록 구성해, 조작 화면 없이도 비행 규칙과 임무 결과를 반복 시험합니다.

## 고정 Tick과 물리 모델

화면 프레임에 맞춰 비행 상태를 갱신하면 화면 갱신률에 따라 모의 시간이 달라집니다. 앱은 누적 시간을 1/60초 단위로 소비해 Tick을 진행하고, 한 화면 프레임 사이에 여러 Tick을 처리할 수 있습니다. 화면 없는 JSON 시나리오도 같은 `SimulationCore`를 호출하므로 조작 화면 없이 비행 규칙과 임무 결과를 반복 시험할 수 있습니다.

Flecs 시스템은 드론의 상태와 조종값을 받아 매 Tick 기체를 갱신합니다. 네이티브 실행은 AirSim에 모터 입력과 충돌 접촉을 전달해 강체의 이동·회전을 계산합니다. WebAssembly는 같은 명령 흐름에서 운동학 기준 모델을 사용합니다. 물리 계산 코드는 빌드 대상에 따라 분리해 웹 빌드에 AirSim을 포함하지 않았습니다.

AirSim은 물리 계산 엔진으로 사용하고, 장면과 기체의 좌표계를 잇는 변환 및 물리 계수 전달은 직접 구현했습니다. 세계 좌표는 ENU에서 NED로, 기체 좌표는 FLU에서 FRD로 바꿉니다. EO 카메라 상태도 시뮬레이션 Tick 뒤 기체 자세에 맞추며, 별도 해상도로 그린 영상을 비동기 픽셀 읽기로 넘겨 OpenCV의 밝기·대비·선명도 지표를 계산합니다. 이 지표는 영상 품질 수치이며 사람이나 물체를 인식하지 않습니다.

[SimulationCore.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/SimulationCore.cpp) · [PhysicsWorld.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/PhysicsWorld.cpp)

## UDP 지상통제와 임무 조정

UDP 수신부는 한 패킷에 담긴 명령 종류와 형식을 확인한 뒤 비행·카메라·상태 조회 경로로 전달합니다. 상태 조회는 현재 상태로 응답하고, 비행이나 카메라 변경은 다음 Tick에 반영한 뒤 결과를 보냅니다. 적용할 지상통제 명령이 있는 Tick에는 게임패드나 기록 재생 입력을 함께 적용하지 않아 입력 우선순위를 분명히 했습니다.

화면 없는 시험에서는 실제 UDP 패킷을 보내는 대신 JSON 시나리오가 상태 보고 단절 시점을 지정합니다. 정해진 시간 안에 heartbeat가 돌아오지 않으면 기체 상태를 `unknown`으로 두고, 미완료 임무를 대기열에 돌립니다. 조정기는 연결되어 비행 중인 기체 가운데 목표에 가까운 기체를 골라 임무를 다시 맡깁니다. 이미 다른 구역을 맡은 기체라면 현재 구역을 대기열에 넣고 새 임무부터 처리합니다.

통신 단절과 임무 재할당은 시나리오 규칙으로 모의했습니다. 이 시험은 UDP 소켓의 실제 장애나 무선 환경을 재현하지 않습니다. [Protocol.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/communication/src/Protocol.cpp) · [ScenarioRunner.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp)

## 충돌 후보 정렬 재사용

매 Tick 충돌 후보를 만들기 전, 기존 목록의 X 좌표를 갱신합니다. 기체가 서로 앞지르지 않아 순서가 유지됐다면 전체 정렬을 건너뜁니다. 순서가 바뀐 경우에는 다시 정렬해 후보 탐색의 전제 조건을 지킵니다.

[PhysicsWorld.cpp의 정렬 재사용 코드](https://github.com/cgantro/DroneSim/blob/69ecab93/modules/simulation_core/src/PhysicsWorld.cpp#L544-L549)

```cpp
for (auto& [positionX, bodyIndex] : bodyPositionsByX)
    positionX = bodies[bodyIndex]->collisionState.positionMeters.x;

if (!std::is_sorted(bodyPositionsByX.begin(), bodyPositionsByX.end()))
    std::sort(bodyPositionsByX.begin(), bodyPositionsByX.end());
```

변경 전후 같은 배치에서 측정한 물리 단계 p95 중앙값은 다음과 같습니다. 드론 수가 적거나 배치가 조밀할 때 개선 폭이 작을 수 있고, 물리 단계에는 좌표 갱신과 후보 쌍 검사도 들어갑니다. 따라서 감소분 전부를 정렬 생략만의 효과로 볼 수는 없습니다.

| 배치 | 드론 수 | 변경 전 | 변경 후 | 감소 |
| --- | ---: | ---: | ---: | ---: |
| 분리, 간격 2.5m | 512 | 741.8µs | 669.9µs | 9.7% |
| 밀집, 간격 0.55m | 128 | 472.3µs | 408.6µs | 13.5% |
| 밀집, 간격 0.55m | 256 | 827.6µs | 791.6µs | 4.4% |

Windows Release에서 준비 Tick 120회 뒤 각 조건을 30,000 Tick씩 세 번 실행했고, 각 실행의 물리 단계 p95를 구해 세 값의 중앙값을 비교했습니다. 이 확장성 시험에는 지형과 정적 장애물이 없습니다. [변경 전 원자료](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-94c39b94-before-sort-reuse.json) · [변경 후 원자료](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-69ecab93-after-sort-reuse.json)

## 통신 단절 시나리오 결과

조사 임무를 시작할 때 전체 기체의 25%에서 상태 보고가 끊기도록 JSON 시나리오를 구성했습니다. 시험은 남은 기체가 중단된 기체의 미완료 과제를 이어받아 기한 안에 끝내는지 판정합니다. 드론 수를 4대에서 256대까지 늘려 각 조건을 세 번 실행했고, 모든 실행에서 과제를 전부 완료했습니다.

| 드론 수 | 보고 단절 | 재할당 | 완료율 | 시나리오 실행 시간 중앙값 |
| ---: | ---: | ---: | ---: | ---: |
| 4 | 1대 | 1회 | 100% | 2.210ms |
| 16 | 4대 | 4회 | 100% | 3.005ms |
| 64 | 16대 | 16회 | 100% | 7.895ms |
| 256 | 64대 | 64회 | 100% | 66.757ms |

실행 시간은 상태 갱신과 임무 처리를 포함한 헤드리스 시나리오 전체 시간입니다. 단절 시점과 비율을 정한 반복 시험이므로 실제 통신 장애에서의 성공률을 뜻하지 않습니다. [시나리오 실행 코드](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp) · [측정 원자료](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-24-26c7fce1.json)

실제 비행 로그와 물리 계수를 대조하는 정확도 검증은 아직 하지 않았습니다. 충돌 형상은 상자로 단순화했고, 강체마다 한 Tick에 접촉 한 건을 처리합니다.
