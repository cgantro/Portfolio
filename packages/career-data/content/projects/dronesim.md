# DroneSim

## 개요

다중 드론의 비행·지상통제·공동 임무를 반복 시험하는 시뮬레이터입니다. 화면 조작과 JSON 시나리오가 같은 `SimulationCore`를 사용하며, 네이티브 빌드에서는 AirSim 강체 물리를, 웹 빌드에서는 운동학 모델을 실행합니다.

## 고정 Tick과 비행 계산

화면 프레임마다 비행 상태를 갱신하면 렌더링 속도에 따라 모의 시간이 달라집니다. 지난 시간을 누적하고 1/60초 단위로 처리해, 화면 출력과 시뮬레이션 시간을 분리했습니다. Flecs 시스템은 Tick마다 조종 입력과 기체 상태를 갱신하고 EO 카메라 자세를 맞춥니다. 헤드리스 실행도 같은 코어를 호출하므로 화면 없이 시나리오를 반복할 수 있습니다.

네이티브 물리 연결부는 프로젝트 좌표계인 ENU·FLU와 AirSim의 좌표·물리 입력 사이를 변환합니다. 웹 빌드는 AirSim 의존성을 포함하지 않고 운동학 모델을 씁니다. 웹 데모는 지상통제 화면과 명령 흐름을 살펴보는 용도이며, 강체 비행 성능을 보여주지는 않습니다.

## 통신 단절과 임무 재할당

통신 단절을 단순히 연결 여부로만 처리하지 않고, 끊긴 기체가 맡은 임무를 이어서 끝낼 수 있는지 시나리오로 시험했습니다. 하트비트 제한 시간을 넘기면 해당 기체를 `unknown`으로 바꾸고, 미완료 임무를 대기열에 돌립니다. 조정기는 연결된 비행 기체 가운데 목표에 가까운 기체를 골라 다시 배정합니다. 기존 임무가 있으면 대기열에 먼저 돌려놓습니다.

전체 기체의 25%에서 상태 보고를 끊고 4~256대 조건을 각각 세 번 실행했습니다. 네 조건 모두 남은 임무를 완료했습니다.

| 드론 수 | 보고 단절·재할당 | 임무 완료율 | 시나리오 실행 시간 중앙값 |
| ---: | ---: | ---: | ---: |
| 4 | 1대·1회 | 100% | 2.210ms |
| 16 | 4대·4회 | 100% | 3.005ms |
| 64 | 16대·16회 | 100% | 7.895ms |
| 256 | 64대·64회 | 100% | 66.757ms |

실행 시간은 운동학 모델로 수행한 헤드리스 JSON 시나리오 전체를 잰 값입니다. 보고 단절을 시나리오 입력으로 재현했으며 실제 UDP 장애나 무선 환경의 성공률을 측정한 값은 아닙니다. [시나리오 처리 코드](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp) · [측정 기록](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-24-26c7fce1.json)

## 충돌 후보 정렬 재사용

드론 충돌 후보를 좁히기 전에 X 좌표순으로 강체 목록을 정렬합니다. 기존 구현은 매 Tick 전체 목록을 다시 정렬했습니다. 기체가 서로 앞지르지 않아 순서가 유지되는 동안에는 좌표만 갱신하고, 순서가 바뀐 경우에만 정렬하도록 고쳤습니다.

```cpp title="modules/simulation_core/src/PhysicsWorld.cpp"
for (auto& [positionX, bodyIndex] : bodyPositionsByX)
    positionX = bodies[bodyIndex]->collisionState.positionMeters.x;

if (!std::is_sorted(bodyPositionsByX.begin(), bodyPositionsByX.end()))
    std::sort(bodyPositionsByX.begin(), bodyPositionsByX.end());
```

같은 배치와 실행 조건에서 물리 단계 p95의 반복별 중앙값을 비교했습니다.

| 배치·드론 수 | 개선 전 → 후 | 감소율 |
| --- | ---: | ---: |
| 분리·128대 | 188.0 → 184.2µs | 2.0% |
| 분리·256대 | 370.1 → 345.4µs | 6.7% |
| 분리·512대 | 741.8 → 669.9µs | 9.7% |
| 밀집·128대 | 472.3 → 408.6µs | 13.5% |
| 밀집·256대 | 827.6 → 791.6µs | 4.4% |

Windows Release에서 준비 Tick 120회 뒤 각 조건을 30,000 Tick씩 세 번 실행했습니다. 물리 단계에는 좌표 갱신과 후보 쌍 검사도 포함되므로, 전체 감소분을 정렬 생략 하나의 효과로 돌리지는 않았습니다. [정렬 변경 코드](https://github.com/cgantro/DroneSim/blob/69ecab93/modules/simulation_core/src/PhysicsWorld.cpp#L544-L549) · [변경 전 측정](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-94c39b94-before-sort-reuse.json) · [변경 후 측정](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-69ecab93-after-sort-reuse.json)

## PX4 비행 기록 재생과 접촉 오차

공개 PX4 X500 ULog의 비행 구간을 별도 변환 도구로 읽어 60Hz JSON 입력으로 만들었습니다. NED·FRD 좌표를 ENU·FLU로 바꾸고, 위치·속도·자세·각속도 표본과 모터 명령을 같은 시각으로 맞춘 뒤 AirSim 강체 모델에 재생했습니다. 두 궤적의 차이는 네 항목의 RMSE로 비교했습니다.

12.05~16.05초 구간에서 위치·자세는 PX4 추정값이고, 모터 값은 실제 RPM이 아니라 정규화 추력 명령입니다. 초기 회전 속도와 추력 계수를 달리한 재생에서 위치 RMSE는 0.653m에서 1.649m, 자세 RMSE는 71.81도에서 108.95도까지 달라졌습니다. 한 구간의 개루프 비교로 모델 계수를 확정할 수 없다는 점을 확인했습니다.

같은 입력을 Release 빌드에서 12회 반복했을 때 3회는 접촉 뒤 속도가 다시 생겼습니다. 위치와 X500 충돌 상자를 이용해 바닥 간격을 계산하자 실행마다 약 2.6nm 겹치거나 2.2nm 떨어졌습니다. 기존 접촉 판정은 겹침이 0보다 큰 경우만 처리해 `float` 반올림 수준의 차이를 접촉 유무로 다르게 판단했습니다. 좌표 크기에 비례하는 허용 오차 안에서는 접촉으로 판정하고 AirSim에는 겹침 깊이를 0 이상으로 전달하도록 수정했습니다. 이후 새 프로세스에서 12회 반복한 실행 간 상태 차이는 항목별 원래 단위 기준 2.6×10⁻⁶ 이내였습니다.

반복 결과는 안정됐지만 비행 재현도가 높아진 것은 아닙니다. 시뮬레이션은 약 1초에 평지에 닿았고, 4초 위치 RMSE는 약 1.041m였습니다. 같은 입력에서 바닥 접촉을 피한 진단 재생의 위치 RMSE는 20.641m였습니다. PX4 제어기가 오차를 보정하지 않는 개루프 비교이며 외부 측량 위치와 실측 추력 자료가 없어, 현재 결과는 모델 정확도가 아니라 접촉 처리와 파라미터 민감도를 보여줍니다. [PX4 기록 재생 기술 검토](https://github.com/cgantro/DroneSim/blob/main/docs/public/기술검토.md#px4-x500-로그와-4초-재생-비교)

## 지상통제 명령

UDP 수신부는 패킷 형식과 명령 종류를 확인해 비행·카메라·상태 조회 경로로 나눕니다. 상태 조회는 현재 값을 응답하고, 비행·카메라 변경은 다음 Tick에 적용한 뒤 상태를 돌려줍니다. 지상통제 입력이 적용되는 Tick에는 게임패드나 기록 재생 입력을 함께 반영하지 않도록 우선순위를 정했습니다. [Protocol.cpp](https://github.com/cgantro/DroneSim/blob/main/modules/communication/src/Protocol.cpp)
