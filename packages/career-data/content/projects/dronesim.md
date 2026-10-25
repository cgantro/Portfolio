# DroneSim

## 개요

가상 드론의 비행 상태와 카메라, 지상통제 명령을 시험하는 C++ 시뮬레이터입니다. 화면 조작과 화면 없는 JSON 시나리오가 같은 SimulationCore를 사용해 편대 비행, 공동 임무, 통신 지연·손실을 반복 실행합니다.

## 설계 선택

시뮬레이션은 초당 60회 고정 간격으로 상태를 갱신하고, 렌더링은 최신 상태를 화면에 그립니다. 화면 갱신률이 달라져도 비행 규칙은 같은 간격으로 처리되도록 두 흐름을 분리했습니다. 게임패드, UDP 지상통제와 JSON 시나리오 입력은 공통 드론 명령으로 변환합니다.

네이티브 실행은 선택에 따라 AirSim 강체 물리를 사용하고, WebAssembly는 운동학 모델을 사용합니다. 물리 엔진 차이는 한 주기 처리 경계에 두고 시나리오 실행과 상태 갱신 흐름은 공유합니다.

## 충돌 후보 계산 줄이기

드론이 늘면 가능한 모든 쌍을 비교하는 방식은 불필요한 충돌 계산까지 늘립니다. 각 강체의 충돌 상자를 월드 좌표로 한 번 계산하고 X 좌표로 정렬한 뒤, 서로 충돌 반경이 닿을 수 있는 드론만 후보로 살핍니다. 후보 한 쌍의 상자 접촉은 한 번 계산해 양쪽 드론에 기록합니다.

파일: modules/simulation_core/src/PhysicsWorld.cpp

```cpp
void PrepareDroneContacts(double largestCollisionRadius)
{
    droneContacts.clear();
    droneContacts.resize(bodies.size());
    for (std::size_t orderIndex = 0;
        orderIndex < bodyPositionsByX.size(); ++orderIndex)
    {
        const std::size_t bodyIndex = bodyPositionsByX[orderIndex].second;
        const Body& body = *bodies[bodyIndex];
        const double maximumCandidateX = body.collisionState.positionMeters.x
            + body.collisionRadiusMeters + largestCollisionRadius;
        for (std::size_t candidateOrder = orderIndex + 1U;
            candidateOrder < bodyPositionsByX.size()
                && bodyPositionsByX[candidateOrder].first <= maximumCandidateX;
            ++candidateOrder)
        {
            const std::size_t otherIndex = bodyPositionsByX[candidateOrder].second;
            RecordDronePairContacts(bodyIndex, otherIndex);
        }
    }
}
```

가장 큰 충돌 반경을 검색 폭에 포함해 크기가 다른 기체도 후보에서 빠지지 않게 합니다. Windows Release에서 밀집 배치한 드론 32·64대의 충돌 계산을 각각 30,000 Tick씩 3회 측정했습니다. 아래에는 실행별 틱 처리 시간 p95의 중앙값을 표시했습니다.

화면 없는 실행에서는 같은 SimulationCore로 드론 수, 편대·공동 임무, 통신 지연·손실에 따른 동작을 반복 시험합니다. 현재 데모 지형은 약 18.8 × 23.7km 규모의 북한산 지형이고, 건물과 시설물은 중심 구역에만 있습니다. 건물 내부 임무나 실내 수색은 구현 범위에 포함되지 않습니다. 네이티브 실행은 AirSim 강체 물리를 사용하고 WebAssembly는 운동학 모델을 사용합니다.
