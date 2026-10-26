# DroneSim

## 고정 Tick과 비행 계산 개요

화면 프레임률에 따라 모의 시간이 달라지지 않도록 경과 시간을 누적해 1/60초 단위로 처리합니다. Flecs 시스템은 Tick마다 조종 입력과 기체 상태를 갱신하고 EO 카메라 자세를 맞춥니다. 화면 없는 시험도 같은 `SimulationCore`를 사용합니다.

네이티브 빌드는 프로젝트 좌표계 ENU·FLU를 AirSim 좌표와 물리 입력으로 변환합니다. WebAssembly 빌드는 AirSim 대신 운동학 모델을 사용합니다.

## 통신 단절과 임무 재할당

하트비트 제한 시간을 넘긴 기체는 `unknown` 상태로 바꾸고, 맡은 임무를 대기열로 돌립니다. 조정기는 연결된 기체 가운데 목표에 가까운 기체를 골라 미완료 임무를 다시 배정합니다. 새 임무를 배정하기 전에 기존 임무부터 대기열에 돌려놓습니다.

| 드론 수 | 상태 보고 단절·재할당 | 임무 완료율 | 시나리오 실행 시간 중앙값 |
| ---: | ---: | ---: | ---: |
| 4 | 1대·1회 | 100% | 2.210ms |
| 16 | 4대·4회 | 100% | 3.005ms |
| 64 | 16대·16회 | 100% | 7.895ms |
| 256 | 64대·64회 | 100% | 66.757ms |

측정 조건: 4~256대 · 전체 기체의 25% 상태 보고 단절 · 기체 수별 3회 실행.

## 세부 조건 · 임무 재할당

운동학 모델을 사용하는 헤드리스 JSON 시나리오로 시험했습니다. 표의 실행 시간은 시나리오 전체를 세 번 실행해 구한 중앙값입니다. [시나리오 처리 코드](https://github.com/cgantro/DroneSim/blob/main/modules/simulation_core/src/ScenarioRunner.cpp) · [측정 기록](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-24-26c7fce1.json)

## 충돌 후보 정렬 재사용

드론 충돌 후보를 찾기 전에 강체 목록을 X 좌표순으로 정렬합니다. 매 Tick 좌표를 갱신한 뒤 순서가 유지되면 정렬을 건너뛰고, 순서가 바뀐 경우에만 다시 정렬하도록 바꿨습니다.

| 배치·드론 수 | 물리 단계 p95 개선 전 → 후 | 감소율 |
| --- | ---: | ---: |
| 분리·128대 | 188.0 → 184.2µs | 2.0% |
| 분리·256대 | 370.1 → 345.4µs | 6.7% |
| 분리·512대 | 741.8 → 669.9µs | 9.7% |
| 밀집·128대 | 472.3 → 408.6µs | 13.5% |
| 밀집·256대 | 827.6 → 791.6µs | 4.4% |

측정 조건: Windows Release · 분리·밀집 5개 기체 수 조합 · 물리 단계 p95.

## 세부 조건 · 충돌 계산

각 조건은 준비 Tick 120회 뒤 30,000 Tick씩 세 번 실행했습니다. 분리 배치 간격은 2.5m, 밀집 배치 간격은 0.55m이며 표에는 세 반복에서 나온 p95의 중앙값을 적었습니다. 물리 단계에는 좌표 갱신과 후보 쌍 검사도 포함됩니다. [정렬 변경 코드](https://github.com/cgantro/DroneSim/blob/69ecab93/modules/simulation_core/src/PhysicsWorld.cpp#L544-L549) · [변경 전 측정](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-94c39b94-before-sort-reuse.json) · [변경 후 측정](https://github.com/cgantro/DroneSim/blob/main/benchmarks/results/archive/aerosimlab-full-benchmark-release-2026-10-23-69ecab93-after-sort-reuse.json)

## PX4 기록 재생과 접촉 오차

공개 PX4 X500 ULog를 60Hz 입력으로 바꿔 AirSim 강체 모델에서 재생했습니다. 12회 실행 가운데 3회에서 바닥 접촉 뒤 속도가 되살아나, 접촉 판정의 `float` 반올림 문제를 확인했습니다. 좌표 크기에 비례한 허용 오차를 적용한 뒤 새 프로세스에서 12회 반복 실행 간 상태 차이는 2.6×10⁻⁶ 이내였습니다. 이는 접촉 처리의 반복 안정성을 보여주며 비행 모델의 정확도가 높아졌다는 뜻은 아닙니다.

[PX4 기록 재생 기술 검토](https://github.com/cgantro/DroneSim/blob/main/docs/public/기술검토.md#px4-x500-로그와-4초-재생-비교)

## PX4 재생 세부 수치

조건: 12.05~16.05초 ULog 구간 · 위치·자세는 PX4 추정값 · 모터 입력은 정규화 추력 명령.

| 측정 항목 | 결과 |
| --- | ---: |
| 초기 회전 속도·추력 계수 조합별 위치 RMSE | 0.653~1.649m |
| 초기 회전 속도·추력 계수 조합별 자세 RMSE | 71.81~108.95도 |
| 같은 재생의 4초 위치 RMSE | 약 1.041m |
| 바닥 접촉을 피한 진단 재생의 위치 RMSE | 20.641m |

접촉 판정 수정 전에는 바닥 간격 계산이 실행마다 약 2.6nm 겹치거나 2.2nm 떨어진 것으로 갈렸습니다. 수정 후 상태 차이는 항목별 원래 단위로 비교했습니다.

## 한계

- 웹 데모는 운동학 모델로 동작하며 AirSim 강체 비행 성능을 보여주지 않습니다.
- 보고 단절은 시나리오 입력으로 재현했습니다. 실제 UDP 장애나 무선 환경에서의 성공률은 측정하지 않았습니다.
- 충돌 성과는 좌표 갱신과 후보 쌍 검사를 포함한 물리 단계 전체의 측정입니다. 개선폭을 정렬 생략 하나의 효과로 볼 수 없습니다.
- PX4 기록 재생은 개루프 비교입니다. 외부 측량 위치와 실측 추력 자료가 없어 모델 정확도를 검증하지 못하며, 접촉 처리와 파라미터 민감도만 확인했습니다.
- 충돌 형상은 상자로 단순화했고 강체마다 한 Tick에 접촉 한 건만 처리합니다.

## 코드

X 좌표순이 유지될 때 정렬을 생략하는 부분입니다.

```cpp title="modules/simulation_core/src/PhysicsWorld.cpp"
for (auto& [positionX, bodyIndex] : bodyPositionsByX)
    positionX = bodies[bodyIndex]->collisionState.positionMeters.x;

if (!std::is_sorted(bodyPositionsByX.begin(), bodyPositionsByX.end()))
    std::sort(bodyPositionsByX.begin(), bodyPositionsByX.end());
```
