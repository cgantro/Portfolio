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

**내 역할 (추정 근거: yoonpyo 브랜치 커밋 전체)**
- 스트리밍 시스템 전담: `StreamingSystemModule.cpp`, `StreamingWorker.cpp`
- JPEG 멀티 스레드 인코딩: libjpeg-turbo 도입, `ROBOTPAL_ENCODE_WORKERS` 환경변수 제어
- PBO 비동기 readback: `Texture::GetAsyncData` ping-pong 구조
- 그리퍼 잡기/놓기 ECS 시스템: `집게 잡기/놓기 System` 커밋 시리즈
- 병목 분석 전체: 벤치마크 스크립트 작성, `카메라스트리밍 병목분석.md` 작성

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
