# RobotPal

## 1. 프로젝트 소개

- **목적**: JETANK 로봇팔 훈련·테스트용 가상 시뮬레이션 환경 구축. 실물 하드웨어 없이 제어 로직 검증 가능하게 함
- **개발 기간**: 2025-11-12 ~ 2025-12-15 (약 1개월)
- **팀 구성**: 2인 (엔진 아키텍처 담당 Junwoo + 스트리밍/제어 시스템 담당 yoonpyo)
- **사용 기술**: C++17, OpenGL, Emscripten (WebAssembly), ImGui, libjpeg-turbo, TCP/WebSocket, Python, CMake
- **한 줄 설명**: OpenGL 기반 C++ 렌더링 엔진에 실시간 카메라 스트리밍과 그리퍼 제어를 붙여 웹에서도 동작하는 로봇팔 시뮬레이터

---

## 2. 주요 기능 및 역할

**[초기] 렌더링 엔진 뼈대**

ECS(Entity-Component-System) 구조로 씬 관리 기틀 잡기. GLTF 모델 로드, ImGui 기반 에디터 레이어, Emscripten을 통한 웹 빌드 CI/CD 구축.

↓

**[중간] 스트리밍 파이프라인 구축**

AI 학습·추론에 사용할 가상 카메라 영상을 외부로 전달하는 스트리밍 경로를 구축했다. 최신 성능 검증에서는 번호판 인식에 필요한 **1232×832** 해상도를 유지하고, Camera Send FPS와 Streaming ON Simulation FPS를 함께 개선 대상으로 삼았다.

↓

**[후반] 성능 최적화 + 그리퍼 시스템**

초기에는 GPU Readback을 주요 병목으로 예상해 Non-blocking PBO + Fence를 적용했지만 PBO-only는 전체 성능을 개선하지 못했다. Tracy 재계측에서 JPEG가 더 큰 Main Thread 병목임을 확인한 뒤 JPEG 작업을 4 Worker로 분리해 Simulation critical path에서 제거했다. 집게 잡기/놓기 로직은 ECS 시스템으로 통합했다.

**내 역할 및 세부 구현 방식**
- **제어 시스템 다형성 설계 (`IRobotController`)**: 상위 제어 논리와 실제/가상 제어 구현을 분리.
- **논블로킹 네트워크 엔진 (`TcpNetworkTransport`)**: 메인 렌더 루프와 송수신 처리를 분리.
- **카메라 스트리밍 성능 검증**: Sync / PBO / PBO+4Worker 구조를 비교하고 Tracy로 Readback·JPEG·Main-thread enqueue를 계측.
- **가설 수정과 구조 개선**: PBO-only가 개선되지 않자 GPU Readback 중심 가설을 폐기하고 JPEG Main Thread 병목을 기준으로 4 Worker 구조를 적용.
- **PBO 비동기 readback**: Non-blocking PBO + Fence 구조를 성능 가설 검증에 사용. 현재 workload에서는 PBO-only 개선 효과가 관측되지 않았음을 함께 기록.
- **그리퍼 잡기/놓기 ECS 통합 (`TryGrip()`)**: 
  - 잡기(Grab): `flecs::world().query<Grabbable>()`을 통해 모든 객체를 순회하고 `glm::distance2`로 최단 거리 객체를 판별한 뒤, 대상을 그리퍼 Entity의 자식(`SetParent`)으로 만들고 로컬 좌표를 (0,0,0)으로 초기화하여 정확히 달라붙게 구현했습니다.
  - 놓기(Release): 부모 관계를 끊을 때, 강제로 월드 행렬을 재계산(`glm::decompose`)하여 월드 좌표계 기준의 위치/회전값을 다시 로컬 좌표로 덮어씌워 오브젝트가 엉뚱한 곳으로 텔레포트하지 않도록 처리했습니다.

---

## 3. 문제 해결 과정

### 웹 실행 환경 대응

Emscripten/WebAssembly 환경에서는 Desktop TCP와 다른 WebSocket 전송 경로 및 pthread 실행 조건을 고려했다. SharedArrayBuffer 등 브라우저 제약을 확인하고 웹 실행 조건을 별도 경계에서 처리했다.

### 카메라 스트리밍 성능 최적화 — 최신 기준

#### 목표

JETANK 번호판 인식에 필요한 영상 품질을 유지하기 위해 해상도를 **1232×832**로 고정하고 스트리밍 상한을 **60 FPS**로 설정했다. 해상도를 낮추지 않고 다음 두 지표를 개선 대상으로 삼았다.

- Camera Streaming Send FPS
- Streaming ON Simulation FPS

수신·디코딩은 최신 측정 범위에서 제외했다.

#### 측정 구성

| 단계 | GPU Readback | JPEG |
|---|---|---|
| Sync | 동기 `glReadPixels` | Main Thread |
| PBO | Non-blocking PBO + Fence | Main Thread |
| PBO + MT | Non-blocking PBO + Fence | 4 Worker Threads |

Streaming OFF/ON을 각각 5회 측정해 median을 사용했다. Streaming-OFF FPS 브랜치 간 차이는 **0.557%**로 sanity gate 5%를 통과했다.

#### 초기 가설 실패

처음에는 GPU Readback이 주요 병목이라고 예상했다. 그러나 PBO-only는 Simulation FPS ON **66.70 → 65.60**, Camera Send FPS **26.95 → 25.49**로 개선되지 않았다.

Tracy로 다시 계측한 결과 Sync에서 Readback p50은 **1.144ms**, JPEG p50은 **16.406ms**였다. 초기 가설과 달리 JPEG 압축이 훨씬 큰 Main Thread 병목이었다.

#### 구조 개선

JPEG 알고리즘 자체의 단일 작업 시간을 줄이기보다 압축을 Simulation critical path에서 제거했다. PBO+MT에서는 Main Thread가 JPEG 완료를 기다리지 않고 **p50 0.017ms**의 enqueue 후 다음 Simulation frame으로 진행한다.

JPEG Worker의 개별 p50은 **27.075ms**로 오히려 증가했다. 따라서 성능 향상을 “JPEG가 빨라졌다”로 해석하지 않는다. 여러 worker가 병렬 처리하며 Main Thread 대기를 제거한 것이 핵심이다.

#### 최종 결과

| 단계 | Simulation FPS OFF | Simulation FPS ON | Camera Send FPS | Streaming Penalty |
|---|---:|---:|---:|---:|
| Sync | 102.38 | 66.70 | 26.95 | 34.84% |
| PBO | 102.52 | 65.60 | 25.49 | 36.02% |
| PBO + MT | 102.95 | **96.01** | **40.05** | **6.74%** |

Sync 대비 PBO+MT:
- Streaming ON Simulation FPS **+43.9%**
- Camera Send FPS **+48.6%**
- Streaming Penalty **34.84% → 6.74%(-28.1%p)**

#### PBO-only가 개선되지 않은 이유

1232×832 RGB 한 프레임은 약 **2.93MiB**다. PBO를 사용해도 JPEG 입력으로 사용하려면 map 이후 CPU 메모리 복사가 필요하다.

```text
GPU Render Target → PBO → map → 약 2.93 MiB memcpy → CPU JPEG
```

현재 workload에서는 PBO만으로 제거할 수 있는 병목 비중이 작았고, CPU JPEG 처리와 메모리 복사가 더 중요했다. iGPU에서 관측한 결과를 다른 GPU 환경에 일반화하지 않으며 dGPU에서는 별도 측정이 필요하다.

---

## 4. 배운 점

- 최적화 기법을 먼저 정답으로 두지 않는다. 초기 가설이 틀리면 실제 계측값을 기준으로 원인을 다시 정의한다.
- 개별 작업 latency와 전체 시스템 처리량은 다르다. JPEG Worker 한 건의 시간은 늘었지만 critical path 분리로 전체 Simulation FPS와 Send FPS는 향상됐다.
- PBO-only 실패를 “PBO는 느리다”로 일반화하지 않고 현재 workload의 메모리 복사·CPU 처리 구조와 연결해 해석한다.
- 성능 수치는 반복 횟수, 대표값, 비교 조건, 목표 미달 여부까지 함께 기록해야 한다.

---

## 5. 회고

**잘한 점**: 초기 GPU Readback 가설과 다른 결과를 숨기지 않고 Tracy로 재프로파일링해 실제 JPEG Main Thread 병목을 찾은 것.

**아쉬운 점**: 최종 Camera Send FPS는 **40.05**로 60 FPS 목표에 도달하지 못했다.

**다음 우선순위**: JPEG 인코더 처리량, 불필요한 CPU 메모리 복사, 4 Worker 처리 구조를 추가로 검증한다.

---

## 메타

- 기간: 2025-11-12 ~ 2026-04-09 (약 5개월)
- 팀 구성: 2인
- 역할: 스트리밍 시스템 / 성능 최적화 / 그리퍼 제어 시스템
- 기술 스택: C++17, OpenGL, PBO/Fence, JPEG, Tracy, Emscripten, TCP/WebSocket, ImGui, CMake, Python
- 레포: https://github.com/Junwoo-Seo-1998/RobotPal

---

## 6. 프로젝트 리뷰 피드백 및 보완점

프로젝트 코드 및 문서를 심층 분석하여 도출한 누락된 내용 및 보완 필요 사항입니다:

### 6-1. 실제 물리 엔진(Physics Engine)의 부재
- **현상**: 현재 시뮬레이터는 중력, 마찰, 충돌(Collision) 연산을 수행하는 실제 물리 엔진(예: Box2D, Bullet, PhysX)이 존재하지 않습니다. 
- **문제점**: `ControllerSystemModule.cpp`를 보면 물건을 집는(Grip) 로직이 거리(`glm::distance2`)를 재고 일정 범위 내에 있으면 강제로 `SetParent`를 호출해 자식 노드로 편입시키는 기구학(Kinematic)적 하드코딩으로 임시방편 처리되어 있습니다.
- **개선안**: 진정한 의미의 "로봇 시뮬레이터"로서 가치를 지니려면 강체 동역학 및 충돌 처리를 지원하는 물리 엔진 통합이 필수적입니다.

### 6-2. C++ 단위 테스트(Unit Test) 부족
- **현상**: Python SDK 모듈 쪽은 `pytest` 환경이 구성되어 있으나, 핵심인 C++ 코어(수학 연산, ECS 시스템, 네트워크 등)를 검증할 수 있는 단위 테스트 코드가 전혀 없습니다.
- **개선안**: GTest(Google Test)나 Catch2 같은 C++ 테스트 프레임워크를 연동하고, 각 모듈이 독립적으로 올바른 동작을 보장하는지 검증하는 CI 파이프라인 추가가 필요합니다.

### 6-3. 아키텍처 및 내부 설계 문서 부족
- **현상**: 사용자(End-User)를 위한 README(파이썬 SDK 실행 방법 등)는 잘 작성되어 있으나, 개발자를 위한 오픈소스 기여 가이드라인이나 내부 아키텍처 문서가 없습니다.
- **개선안**: ECS 기반의 각 시스템이 어떤 순서로 동작하고, 프레임 내에서 어떻게 데이터를 주고받는지(Update 루프 시퀀스/아키텍처 다이어그램 등)를 시각화한 설계 문서 추가를 권장합니다.

### 6-4. 코드 오타 (마이너 버그)
- **현상**: `ControllerSystemModule.cpp`의 약 221번 라인 부근에 구조체 변수명 오타(`ServoCommnad servoCmd{};`)가 존재합니다. 
- **개선안**: 코드 가독성과 유지보수를 위해 `ServoCommand`로 수정이 필요합니다.

---

## 7. 심층 분석 리포트

### 성능 최적화 판단 흐름

1. **가설 수립**: Streaming ON에서 Simulation FPS가 크게 떨어지는 원인을 GPU Readback으로 예상.
2. **첫 구조 변경**: Non-blocking PBO + Fence 적용.
3. **실패 확인**: PBO-only가 Sync보다 Simulation FPS ON과 Camera Send FPS를 개선하지 못함.
4. **재계측**: Tracy에서 Sync Readback p50 **1.144ms**, JPEG p50 **16.406ms** 확인.
5. **원인 수정**: 실제 Main Thread 병목을 JPEG 압축으로 재정의.
6. **구조 개선**: JPEG를 4 Worker로 분리해 Simulation critical path에서 제거.
7. **반복 검증**: OFF/ON 각 5회, median 기준으로 최종 성능 비교.

### 최종 성능

- Simulation FPS ON: **66.70 → 96.01 (+43.9%)**
- Camera Send FPS: **26.95 → 40.05 (+48.6%)**
- Streaming Penalty: **34.84% → 6.74% (-28.1%p)**
- Main-thread enqueue p50: **0.017ms**
- 최종 Camera Send FPS는 목표 60 FPS에 미달.

### 해석 원칙

- PBO를 적용했다는 사실 자체를 성과로 쓰지 않는다.
- JPEG Worker 개별 latency가 **27.075ms**로 증가했으므로 JPEG 알고리즘이 빨라졌다고 표현하지 않는다.
- 최종 개선은 JPEG 압축을 Main Thread critical path에서 분리한 구조적 효과로 설명한다.
- 수신·디코딩은 이번 최신 성능 측정 범위에 포함하지 않는다.
- 과거 224×224/816×616 worker sweep 및 32.9→37.3fps 계열 탐색 수치는 최신 성과 수치로 사용하지 않는다.

