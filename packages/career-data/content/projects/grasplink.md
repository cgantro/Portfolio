# GraspLink

## 개요

한화 HCR-12A 로봇 팔과 Robotiq 2F-85 집게 장치가 물체를 집어 옮기는 동작을 재현한 C++17 시뮬레이터입니다.

순기구학(FK)은 관절 각도에서 각 링크와 TCP(tool center point, 로봇 도구 중심점)의 자세를 계산하고, 역기구학(IK)은 목표 TCP 자세를 만드는 관절 각도를 찾습니다. Flecs ECS(Entity-Component-System)는 장면의 로봇과 물체, Transform과 충돌 형상을 나눠 관리하며, Jolt Physics는 강체 운동과 충돌을 계산합니다. OpenGL 렌더러는 이 장면을 화면에 그립니다.

## 담당 범위

- 로봇 3D 모델의 관절 회전축을 실제 관절에 맞추고, 계산한 팔 자세를 화면과 충돌 검사에 함께 반영
- 도구 끝의 목표 위치에서 관절 각도를 찾는 역기구학과 직접 이동, 직선 이동, 장애물 우회 계획 구현
- 정해진 간격으로 물리와 충돌을 계산하고, 충돌 시 직전 안전 자세로 복원하며 6번 관절 복귀와 양쪽 손끝을 이용한 물체 집기 구현
- C++ 시뮬레이터를 브라우저 실행 형식으로 바꾸고 브라우저에서 직접 조작하도록 배포

## 구현

### 화면의 로봇과 충돌 검사에 같은 자세 적용

GLB는 3D 모델을 저장하는 파일 형식입니다. 모델 안의 관절 회전축과 회전 기준점을 실제 로봇 관절 위치에 맞춘 뒤 관절 각도를 차례로 적용해 팔 각 부분의 위치와 방향을 계산합니다.

계산한 자세를 OpenGL 화면 모델과 Jolt 물리 엔진의 충돌 검사 형상에 똑같이 적용했습니다. 로봇 팔은 물리 엔진이 임의로 움직이지 않고, 관절 제어 계산이 정한 자세를 따라가도록 구성했습니다.

### 로봇 도구 끝의 목표 위치에서 관절 각도 계산

TCP(tool center point)는 로봇 도구 중심점으로, 집게가 물체에 접근하거나 작업 목표를 지정하는 기준입니다. 역기구학(IK)은 목표 TCP 자세에 맞는 관절 각도를 구합니다. Jacobian으로 각 관절의 작은 변화가 TCP에 미치는 영향을 계산하고, Damped Least Squares(DLS)로 특이 자세 근처의 수치 불안정과 큰 관절 변화를 완화합니다.

허용 회전 범위에 닿은 관절은 더 이상 목표에 가까워지는 방향으로 움직일 수 없으므로 계산에서 제외하고, 나머지 관절도 허용 범위 밖으로 나가지 않게 제한합니다.

IK는 계산을 시작하는 관절 각도에 따라 다른 해로 수렴할 수 있습니다. TCP 직선 이동에서는 바로 앞 경로 지점에서 찾은 관절 각도를 다음 IK 계산의 시작값으로 넘겨 팔 자세의 연속성을 유지합니다.

기본 계산으로 목표를 찾지 못하면 1번, 3번, 5번 관절을 움직여 팔이 다른 방향으로 접히는 자세를 시험합니다. 그래도 실패하면 Halton 방식으로 관절이 움직일 수 있는 범위 전체에서 시험 각도를 고르게 뽑습니다. 이 각도 조합은 정해진 횟수만 확인하고, 실패는 관절 한계를 넘어야 하는 경우와 허용 오차 안의 각도를 찾지 못한 경우로 나눠 제어기에 전달합니다.

### 목표점 직접 이동과 화면 임무의 우회 경로 탐색

`MovePose`는 도구 끝의 목표 위치와 방향을 관절 각도로 바꾼 뒤, 현재 관절 자세에서 목표까지 직접 움직이는 명령입니다. 현재 각도와 몇 가지 다른 팔 자세를 시도하지만, 이 명령은 막힌 길을 돌아가는 경로를 찾지 않습니다.

화면의 임무 계획은 먼저 직접 이동할 수 있는지 확인하고, 길이 막힌 경우에만 RRT-Connect를 사용합니다. RRT-Connect는 출발점과 목표점에서 충돌하지 않는 관절 경로를 각각 뻗어 서로 연결하는 탐색 방식입니다. 계산을 화면 갱신 주기에 나눠 수행하고, 중간 관절 자세까지 검사한 경로만 움직임에 사용합니다.

`MovePose`는 간단한 이동에 쓰고, 계산량이 큰 우회 탐색은 화면 임무 계획에 한정했습니다.

### 도구 끝 직선 이동의 중간 지점 검사

`MoveLinear`은 로봇 도구 끝을 시작점과 목표점 사이의 직선으로 움직입니다. 사원수는 3차원 회전을 표현하는 방식입니다. 구면 선형 보간(SLERP)으로 시작 방향에서 목표 방향까지 가장 짧은 회전을 만들고, 위치 경로는 1cm 간격의 중간 목표로 나눕니다.

각 중간 목표에서 필요한 관절 각도를 계산할 때 바로 앞 지점의 결과를 시작값으로 사용합니다. 그 결과로 이어지는 움직임이 관절 한계에 걸리면 제한된 다른 각도 조합을 시도합니다.

모든 중간 지점의 관절 각도를 찾은 다음에만 경로를 실행합니다. 계산은 화면 갱신 주기에 나눠 진행해 화면 응답을 유지합니다.

직선 경로를 따라 계속 이어지는 관절 각도를 찾지 못하면 요청을 거절합니다. 다른 이동 명령이나 우회 경로로 바꾸지 않습니다.

### 일정한 간격의 물리 계산과 안전 자세 복원

정해진 간격으로 로봇과 집게 각도를 갱신하고, Jolt 물리 계산으로 주변 물체와 부딪히는지 확인합니다.

다음 자세가 벽이나 물체, 허용되지 않은 로봇 팔 부분과 부딪히면 직전에 충돌이 없었던 관절 각도로 되돌리고 제어를 멈춥니다.

이 검사는 각 확인 시점의 자세를 대상으로 합니다. 확인 시점 사이의 모든 움직임까지 충돌이 없다고 보장하지는 않습니다.

### 물체를 집고 놓는 순서에 맞춘 6번 관절 복귀

물체를 집고 놓는 작업의 시작과 끝에 6번 관절을 기준 각도로 돌려놓습니다. 명령 완료 응답만 믿지 않고 시뮬레이터가 보고하는 현재 관절 각도를 확인한 뒤 다음 동작을 시작합니다.

### 양쪽 손끝 접촉을 확인한 뒤 물체 고정

한쪽 손끝이 먼저 닿아도 물체를 바로 붙이지 않습니다. 반대 손끝이 같은 물체의 맞은편에 닿을 때까지 집게를 닫습니다.

양쪽 접촉이 확인되면 닫힘을 멈추고, 물리 계산 중 집게와 물체 사이의 위치와 방향을 유지하는 고정 연결(Fixed Constraint)을 만듭니다. 손끝이 닿았는지로 집었는지 판단하며, 실제로 버티는 힘까지 계산하지는 않습니다.

### WebAssembly 빌드와 브라우저 실행

Emscripten은 C++ 프로그램을 브라우저에서 실행할 수 있는 WebAssembly 형식으로 바꾸는 도구입니다. 여러 작업 스레드가 메모리를 나눠 쓰도록 브라우저 보안 설정을 함께 구성해 시뮬레이터를 직접 조작할 수 있게 배포했습니다.

## 문제 해결 과정

### 끝점에는 닿을 수 있지만 직선 이동 중간에서 멈추던 문제

관절 각도에서 도구 끝의 위치를 계산하는 순기구학으로 끝점에 닿을 수 있음을 확인했지만, 도구 끝을 직선으로 이동시키면 중간 지점에서 필요한 관절 각도를 찾지 못해 계획이 멈췄습니다. 끝점 하나에 닿는 것과 이동 경로 전체를 따라가는 것은 다른 문제였습니다.

같은 중간 지점에서 관절 범위 안의 시작 각도 조합 136개를 확인하자 38개가 허용 오차 안의 관절 각도를 찾았습니다. 목표가 도달 불가능한 것이 아니라 기존 자세 주변만 살펴보던 계산이 다른 팔 자세를 놓치고 있었습니다.

먼저 현재 관절 각도에서 계산해 경로가 갑자기 꺾이지 않게 했습니다. 찾지 못하면 1번, 3번, 5번 관절을 기준으로 팔이 다른 쪽으로 접히는 각도 조합을 확인하고, 이후 관절 범위에 고르게 퍼진 다른 시작 각도도 제한된 횟수만큼 시도했습니다. 후보를 비교할 때는 관절마다 허용 범위가 다른 점을 반영해 이동량을 비율로 비교하고, 관절 끝 범위에 가까운 자세에는 불이익을 줬습니다.

관절 속도를 기준으로 가장 빨리 움직일 후보를 고르는 방식도 시험했지만, 예상 이동 시간이 짧아도 관절 각도 계산이 제한 시간 안에 끝나지 않는 경로가 생겼습니다. 그래서 이 기준은 빼고 관절 허용 범위에 대한 이동량으로 후보를 비교했습니다.

팔이 한 방향으로 움직이기 어려운 자세에서 목표를 만들고, 제한된 시작 각도 탐색이 목표를 찾는지 확인했습니다. 도구 끝 위치와 방향 오차, 반복 횟수도 기준 안에 드는지 검사하고 이동 제어 경로에서도 관절 한계와 결과를 확인했습니다.

정해진 수의 시작 각도만 확인하므로 모든 목표에 도달할 수 있다고 보장하지는 않습니다.

#### MovePose: 목표 TCP 자세로 관절 이동

```text
MovePose(targetTCP):
    // IK: 목표 TCP 자세를 만드는 관절 각도를 계산합니다.
    preferred = inverseKinematics(targetTCP, currentAngles)
    if preferred exists and jointPathIsSafe(
        currentAngles, preferred):
        return MoveJoint(preferred)

    // 현재 자세에서 안전한 해를 못 찾았을 때만 다른 초기 관절 각도를 시도합니다.
    bestSolution = none

    for initialAngles in alternativeJointAngles(currentAngles):
        candidate = inverseKinematics(targetTCP, initialAngles)
        if candidate not found:
            continue

        if not jointPathIsSafe(currentAngles, candidate):
            continue

        // 관절 범위에 맞춰 이동량을 비교하고, 한계에 가까운 해는 불리하게 둡니다.
        bestSolution = chooseLowerCostSafeSolution(
            bestSolution, candidate, currentAngles)

    if bestSolution exists:
        return MoveJoint(bestSolution)
    return reject("안전한 관절 해를 찾지 못함")

jointPathIsSafe(start, goal):
    path = sampleJointPath(start, goal)
    if not withinJointLimits(path):
        return false
    if collisionCheckerConnected:
        return collisionFree(path)
    return true
```

#### 화면의 목표 자세 계획: 직접 경로와 RRT-Connect 분리

```text
PlanPoseForGui(targetTCP):
    // 화면 응답을 유지하도록 IK와 경로 탐색을 프레임 예산에 나눕니다.
    // 현재 자세부터 시도하고, 실패하면 대체 관절 각도를 제한 횟수만큼 확인합니다.
    for initialAngles in currentAndAlternativeJointAngles(currentAngles):
        candidate = solveIKInSteps(targetTCP, initialAngles)
        if candidate not found:
            continue

        directPath = planJointPath(currentAngles, candidate)
        if directPath is safe:
            return accept(directPath)

        // 반복 횟수와 탐색 노드 수를 제한한 RRT-Connect로 우회 경로를 찾습니다.
        detour = boundedRRTConnect(currentAngles, candidate)
        if detour exists and detour is safe:
            return accept(detour)

    return reject("예산 안에 안전한 경로를 찾지 못함")
```

#### MoveLinear: TCP 직선 경로 계획

```text
MoveLinear(targetTCP):
    // Quaternion SLERP는 두 회전 사이의 최단 방향을 보간합니다.
    samples = interpolateTCPPath(
        currentTCP,
        targetTCP,
        positionStep = 1 cm,
        orientation = quaternionSLERP(shortestArc)
    )
    previousAngles = currentAngles
    plan = []

    for tcpPose in samples:
        candidate = inverseKinematics(tcpPose, previousAngles)
        if candidate missing or not jointPathIsSafe(
                previousAngles, candidate):
            candidate = tryAlternativeIKStarts(tcpPose, previousAngles)
        if candidate missing or not jointPathIsSafe(
                previousAngles, candidate):
            return reject("직선 경로를 이어갈 수 없음")

        plan.append(candidate)
        previousAngles = candidate

    return commitLinearPlan(plan)
```

## 검증 범위와 한계

- 충돌 검사는 경로의 확인 지점을 대상으로 하며 지점 사이의 연속 충돌 안전을 보장하지 않습니다.
- 직선 이동의 대체 시작 각도 탐색은 제한된 횟수만 수행하므로 모든 목표에 대한 완전성을 보장하지 않습니다.
- Fixed Constraint 파지는 양손끝 접촉을 기준으로 물체를 고정하며 실제 파지력이나 마찰 기반 안정성을 검증하지 않습니다.
- 136개 시작 자세 중 38개 수렴은 공개 사례의 보고값이며 원본 실험 데이터와 실행 환경은 이 저장소에 포함되지 않습니다.
- 브라우저 데모 링크는 공개 기록에 있는 주소이며 이 데이터 마이그레이션에서 실행 상태를 확인하지 않았습니다.

## 공개 출처

- **grasplink-public**: src/data/projects/grasplink.js — role, implementations, caseStudies
