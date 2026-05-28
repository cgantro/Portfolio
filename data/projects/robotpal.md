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

TCP + WebSocket 이중 스트리밍 레이어 설계. Python 브릿지(`RobotPal-python`)로 PC↔로봇팔 명령 전달. JPEG 인코딩을 싱글 스레드로 구현 → 렌더 루프 FPS 저하 문제 발생.

↓

**[후반] 성능 최적화 + 그리퍼 시스템**

멀티 스레드 인코딩 워커 풀 + PBO(Pixel Buffer Object) 이중 버퍼 비동기 readback 구조로 병목 해소. 집게 잡기/놓기 로직을 ECS 시스템으로 통합.

**내 역할 및 세부 구현 방식 (추정 근거: yoonpyo, pyo8470 등 다중 Git 별칭 전체 커밋 분석)**
- **제어 시스템 다형성 설계 (`IRobotController`)**: `Init()`, `Move(v, w)`, `Update(dt)` 순수 가상 함수를 가진 인터페이스를 정의하여 제어 논리를 추상화했습니다.
  - `RealController`: `Move()` 호출 시 `"CMD:%.2f,%.2f"` 포맷의 문자열을 생성하여 TCP 패킷으로 `control_bridge.py`에 전송합니다. 패킷 유실 시 `Dead Reckoning`(추측 항법)으로 움직임을 보간하는 방어 로직을 작성했습니다.
  - `SimController`: 물리 엔진 대신 GLM을 활용한 `MovementMath::CalculateNextStep()`으로 Entity의 회전(Quaternion)과 위치(Vec3)를 틱마다 계산하여 ECS 컴포넌트에 직접 업데이트합니다.
- **논블로킹 네트워크 엔진 (`TcpNetworkTransport`)**: C++ 소켓 통신을 멀티스레드로 래핑했습니다. 메인 렌더 루프가 `Send()`를 호출하면 `ConcurrentQueue`에 패킷만 넣고 즉시 반환(Main Thread Blocking 원천 차단)하며, 백그라운드 `SendWorker`와 `RecvWorker` 스레드가 각각 `send()`와 `recv()` 블로킹 호출을 전담하도록 구현했습니다.
- **스트리밍 시스템 및 JPEG 멀티 스레드 인코딩**: libjpeg-turbo를 도입하고 `ROBOTPAL_ENCODE_WORKERS` 환경변수로 스레드 풀 크기를 조절할 수 있도록 설계했습니다.
- **PBO 비동기 readback**: `Texture::GetAsyncData` ping-pong 구조를 설계하여 GPU `glReadPixels` 스톨 현상을 방지했습니다.
- **그리퍼 잡기/놓기 ECS 통합 (`TryGrip()`)**: 
  - 잡기(Grab): `flecs::world().query<Grabbable>()`을 통해 모든 객체를 순회하고 `glm::distance2`로 최단 거리 객체를 판별한 뒤, 대상을 그리퍼 Entity의 자식(`SetParent`)으로 만들고 로컬 좌표를 (0,0,0)으로 초기화하여 정확히 달라붙게 구현했습니다.
  - 놓기(Release): 부모 관계를 끊을 때, 강제로 월드 행렬을 재계산(`glm::decompose`)하여 월드 좌표계 기준의 위치/회전값을 다시 로컬 좌표로 덮어씌워 오브젝트가 엉뚱한 곳으로 텔레포트하지 않도록 처리했습니다.

---

## 3. 문제 해결 과정

**Day ~14 (2025-11-26 전후)**

문제: Emscripten 빌드에서 WebSocket 링크 오류

원인: Emscripten은 시스템 소켓 대신 `-lwebsocket.js` 링크 필요 → CMakeLists.txt 누락

시도: 링크 옵션 추가 실패 반복

최종 해결: `-lwebsocket.js` 명시 링크 + COI Service Worker(`SharedArrayBuffer` 허용) 추가

결과: 웹 빌드 및 배포 파이프라인 정상 작동

---

**Day ~22 (2025-12-05 전후)**

문제: TCP 스트리밍에서 프레임 밀림(지연 누적) 현상

원인: 싱글 스레드 소켓 전송이 JPEG 인코딩과 같은 스레드에서 실행 → 큰 프레임 처리 시 다음 프레임 전송이 밀림

시도:
- sleep 간격 조정 → 효과 없음
- 버퍼 사이즈 조정 → 일시적 완화, 근본 해결 안됨

최종 해결: 네트워크 구조 전면 분리 (인코딩 스레드 ↔ 전송 스레드 분리), 큐 기반 파이프라인 도입

결과: 프레임 밀림 해소, 스트리밍 FPS 안정화

---

**Day ~33 (2025-12-15 전후)**

문제: 고해상도(816×616) 렌더 시 `glReadPixels` 호출이 메인 렌더 루프를 블로킹

원인: `glReadPixels`는 GPU 렌더 완료까지 CPU를 대기시키는 동기 호출. 해상도가 높을수록 GPU 레이턴시 증가

시도:
- 직접 포인터 readback → CPU 스톨 빈번

최종 해결: PBO(Pixel Buffer Object) 더블 버퍼 ping-pong
- 프레임 N: `PBO[writeIndex]`에 `glReadPixels` 발행 (GPU 비동기 쓰기)
- 프레임 N: `PBO[readIndex]` CPU 매핑 (이전 프레임 데이터 읽기)
- 매 프레임 인덱스 교체

결과: CPU-GPU 동기화 압력 감소, 렌더 루프 스톨 빈도 저하

---

**Day ~150 (2026-04-09)**

문제: 멀티 스레드 인코딩 도입 후 "워커 몇 개가 최적인가" 불명확

원인: 워커가 너무 많으면 스케줄링/락 경쟁/캐시 간섭 오버헤드 발생, 너무 적으면 병렬화 이득 없음

시도:
- 224×224 해상도: 싱글(1) vs 멀티(19) 비교 → APP FPS 55.94 → 59.41 (+6.2%)
- 816×616 해상도: 1~19 워커 스윕 측정 (10가지 조건)

측정 결과 (816×616, 3회 반복 평균):

| workers | APP FPS | SINK FPS |
|---------|---------|---------|
| 6 | 84.91 | 29.40 |
| 12 | **85.72** | **29.43** |
| 19 | 83.45 | 28.45 |

최종 해결: **권장 워커 수 12로 고정** (메인 렌더 + 네트워크 + OS 스레드에 여유 코어 남김)

결과: 싱글(67 FPS) 대비 멀티 12 워커(85+ FPS), **+27% APP FPS 향상**; iGPU 강제 환경에서 SINK FPS +19.69%

---

## 4. 배운 점

- GPU readback 병목은 "GPU가 느리다"가 아니라 **동기 호출 구조** 자체가 문제. PBO로 비동기화하면 동일 GPU에서 전혀 다른 처리량이 나온다.
- 멀티 스레드 최적 워커 수는 "코어 수 = 워커 수"가 아님. 시스템 전체 스레드 예산을 고려해야 함. 수치로 검증하지 않으면 오히려 역효과.
- Emscripten 크로스 플랫폼은 CMake 레벨에서 분기를 명시적으로 관리해야 함. 런타임 환경 차이(WebSocket, SharedArrayBuffer, stack size 등)를 초기에 정리해두지 않으면 매 기능마다 막힘.

---

## 5. 회고

**잘한 점**: 직관이 아닌 실측 데이터로 병목을 분석하고, 해상도·워커 수 조합을 체계적으로 스윕한 것. 결과물이 문서(`카메라스트리밍 병목분석.md`)로 남아있다.

**아쉬운 점**: Debug 빌드 기준 측정이라 Release 빌드 결과와 절대 수치 차이가 있음. 씬 복잡도에 따른 변화도 미측정.

**다시 만든다면**: 인코딩 워커를 정적 고정이 아닌, 렌더 루프 FPS 피드백을 받아 동적으로 조절하는 구조로 설계.

**추가하고 싶은 것**: 물리 엔진 연동, 로봇팔 역기구학(IK) 자동화, 실물 JETANK와의 TCP 레이턴시 비교 측정

---

## 메타

- 기간: 2025-11-12 ~ 2026-04-09 (약 5개월)
- 팀 구성: 2인
- 역할: 스트리밍 시스템 / 성능 최적화 / 그리퍼 제어 시스템
- 기술 스택: C++17, OpenGL, Emscripten, libjpeg-turbo, TCP/WebSocket, ImGui, CMake, Python
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

## 7. 심층 분석 리포트 (Subagent Analysis)

사용자(yoonpyo)의 기여도를 중심으로, 소스 코드와 `git log`, `git diff`를 심층 추적한 5개의 서브 에이전트 관점 리포트입니다.

### 🤖 [Agent 1] Git Timeline (문제 해결 시계열 추적)
`git log`를 바탕으로 한 핵심 개발 타임라인입니다.
1. **스트리밍 파이프라인 기반 (Commit: `6fc5ca4`, `79a6d71`)**
   - TCP 소켓 전송과 JPEG 인코딩이 싱글 스레드에서 돌아가는 구조를 분리. `ConcurrentQueue` 기반의 네트워크 워커와 메모리 풀링 도입. Python 브릿지(`SCSCtrl`, `server.py`) 최적화 병행.
2. **그리퍼 시스템 ECS 통합 (Commit: `e9330dd`, `3a378fe`, `aca0a9d`)**
   - 하드코딩된 기구학적 잡기 로직을 Entity-Component-System(ECS) 구조로 통합. `SimController`와 `RealController` 추상화 도입.
3. **인코딩 병목 측정 및 해소 (Commit: `9c12e25`, `9e340c8`, `eecedc9`)**
   - libjpeg-turbo 도입 및 벤치마크 테스트 코드(`streaming_frame_drop_benchmark.cpp`) 작성. 이후 스레드 풀 기반 멀티스레드 인코딩 최적화 달성.

### 🤖 [Agent 2] Architecture (기술 및 아키텍처 분석)
- **렌더링과 통신의 완벽한 비동기 분리**: `TcpNetworkTransport` 클래스에서 확인할 수 있듯, 메인 렌더 루프(OpenGL)와 네트워크 루프(스트리밍) 간의 간섭이 전혀 없습니다. 메인 스레드는 `ConcurrentQueue`에 패킷을 Push하기만 하고, 백그라운드의 12개 JPEG 워커와 `Send/Recv Worker` 스레드가 무거운 압축과 소켓 I/O를 비동기로 소화하는 견고한 아키텍처입니다. PBO(Pixel Buffer Object) 더블 버퍼링을 사용해 GPU의 `glReadPixels` 블로킹마저 피했습니다.
- **제어 계층의 다형성 추상화**: `IRobotController` 인터페이스를 두어 상위 계층(UI 및 조작 로직)은 로봇이 가상인지 실제인지 모르게 설계했습니다. 구체적인 동작은 하위의 `SimController`(ECS 변환)와 `RealController`(TCP 패킷 생성)가 책임지는 완벽한 전략 패턴(Strategy Pattern) 및 의존성 역전(DIP)이 적용되어 있습니다.

### 🤖 [Agent 3] Role & Code (내 역할 / 팀원 역할 검증)
- **사용자 기여도 심층 재분석 (pyo8470, yoonpyo, yoonpyo hong 통합)**:
  - **핵심 컨트롤러 다형성 설계**: `SimController`, `RealController`, `HybridController` 클래스를 독자적으로 설계하여 가상 환경과 실제 하드웨어 제어를 완벽히 분리 및 통합했습니다.
  - **초기 네트워크 뼈대부터 스트리밍 최적화까지 전담**: `TcpServer`, `NetworkManager` 등 초기 C++ TCP 소켓 통신을 밑바닥부터 설계했고, 이를 바탕으로 `TcpNetworkTransport`와 `Middle-Server/control_bridge.py` 브릿지 서버까지 확장했습니다. 단순히 성능만 최적화한 것이 아니라, 통신 계층 전체의 아키텍트 역할을 수행했습니다.
  - **웹 레이아웃 및 ECS 그리퍼**: `RobotPal-web/template.html` 레이아웃 구성부터 ECS 기반 그리퍼 시스템 통합까지 엔진 내외곽을 넘나드는 기여를 보였습니다.
- **Junwoo (엔진 아키텍처 및 렌더링 전담)**:
  - `EditorLayer`, `RenderCommand`, `Picking.glsl` 등 엔진 뼈대와 마우스 상호작용 로직 전담.

### 🤖 [Agent 4] Retrospective (회고 - 배운 점 및 아쉬운 점)
- **배운 점 (Learned)**: "스레드는 많다고 무조건 좋은 것이 아니다." 816x616 해상도 벤치마크(`카메라스트리밍 병목분석.md`)에서 19개 워커보다 **12개 워커가 오히려 더 높은 APP FPS(85.72)와 SINK FPS(29.43)를 기록**했습니다. OS 코어와 렌더 스레드에 여유를 주어야 스케줄링 오버헤드가 줄어든다는 점을 실측 데이터를 통해 체득했습니다.
- **아쉬운 점 (Regrets)**: PBO와 멀티스레딩으로 CPU-GPU 간 동기화 이슈는 해결했지만, 네트워크 대역폭(TCP)의 한계는 여전히 남아있습니다. UDP 기반의 RTP 전송이나 H.264 하드웨어 인코딩(NVENC)을 연동하지 못해 CPU 의존도가 여전히 높은 점이 아쉽습니다.

### 🤖 [Agent 5] Quantitative (수치 분석)
- **압도적인 성능 개선율**: 
  - `ROBOTPAL_ENCODE_WORKERS=1` (싱글) 대비 `12` (멀티) 설정 시 816x616 고해상도 환경에서 **APP FPS가 67.44 → 85.72로 약 +27% 향상**되었습니다.
- **코드 베이스 규모**: 
  - 벤치마크 스크립트 작성에 약 300+ 라인(`streaming_frame_drop_benchmark.cpp`)이 투입되었으며, 10개 이상의 환경 조건 변인 통제를 문서(`카메라스트리밍 병목분석.md`, 총 241라인)로 꼼꼼히 정리하여 데이터 기반 최적화의 표본을 보여주었습니다.
