/**
 * 주력 프로젝트 3개
 * - implementations: 구현 내용 (자연어)
 * - problems: 문제 원인 + 해결 + 코드 스니펫 (한 문제당 한 슬라이드)
 * - techChoice: 기술 선정 이유 + 대안 비교
 */
export const projects = [
  {
    id: "robotpal",
    num: "01",
    title: "RobotPal",
    subtitle: "로봇팔 시뮬레이션 & 실시간 스트리밍",
    period: "2025.11 – 2026.04",
    team: "2인 (엔진 + 스트리밍)",
    role: "핵심 제어 아키텍처 및 네트워크 엔진 설계 · 성능 최적화",
    stack: ["C++17", "Emscripten", "libjpeg-turbo", "TCP/WebSocket", "ImGui", "CMake"],
    cover: "/%EB%A1%9C%EB%B4%87%ED%8C%94%20%EC%8B%9C%EC%97%B0.webp",
    coverFallback: "/project-robotpal-cover.png",
    highlights: [
      "실시간 스트리밍 파이프라인 설계",
      "GPU 비동기 readback(PBO) 최적화",
      "Emscripten 웹 빌드 · CI/CD",
    ],
    implementations: [
      {
        title: "제어 시스템 다형성 설계 및 네트워크 엔진 구축",
        items: [
          "가상 환경(SimController)과 실제 로봇(RealController)을 통합하는 IRobotController 인터페이스 기반 다형성 제어 구조 설계",
          "메인 렌더 스레드가 블로킹되지 않도록 Send/Recv 워커 스레드와 ConcurrentQueue로 분리된 논블로킹 TCP 통신 엔진 구축",
          "C++ 시뮬레이터와 실제 로봇을 잇는 Python 브릿지 통신망(control_bridge.py) 개발",
        ],
        snippet: {
          lang: "cpp",
          label: "IRobotController 기반 다형성 제어 규격",
          code: `\
class IRobotController {
public:
    virtual ~IRobotController() = default;
    virtual void UpdateJoints(const std::vector<float>& angles) = 0;
    virtual void GetCurrentState(RobotState& outState) = 0;
};

// 시뮬레이터 환경 제어 구현체
class SimController : public IRobotController { /* ... */ };

// 실제 로봇 하드웨어 제어(Python 브릿지 TCP 연동) 구현체
class RealController : public IRobotController { /* ... */ };`
        }
      },
      {
        title: "스트리밍 파이프라인",
        items: [
          "TCP와 WebSocket을 이중 레이어로 구성해 데스크톱과 브라우저 클라이언트를 동시 지원",
          "인코딩 스레드와 전송 스레드를 큐로 분리해 큰 프레임이 전송을 막지 않도록 파이프라인 재설계",
        ],
        snippet: {
          type: "visual",
          label: "네트워크 스트리밍 파이프라인 분리",
          content: [
            { id: "render", name: "Render Thread", desc: "60 FPS 렌더 루프 보장" },
            { id: "queue", name: "Concurrent Queue", desc: "Non-blocking 버퍼링" },
            { id: "network", name: "Network Workers", desc: "Send/Recv 독립 I/O" }
          ]
        }
      },
      {
        title: "GPU 비동기 Readback (PBO)",
        items: [
          "두 개의 픽셀 버퍼를 번갈아 사용해 이번 프레임 쓰기와 이전 프레임 읽기를 동시에 진행",
          "CPU가 GPU 작업 완료를 기다리지 않아도 되므로 렌더 루프가 블로킹되지 않음",
          "렌더링 FPS를 유지하면서 픽셀 데이터를 안정적으로 가져올 수 있는 구조",
        ],
        snippet: {
          type: "visual",
          label: "PBO 더블 버퍼링 (Ping-Pong 구조)",
          content: [
            { id: "cpu", name: "CPU (이번 프레임)", desc: "완료된 [이전 프레임] 버퍼 매핑 & 읽기" },
            { id: "gpu", name: "GPU (이번 프레임)", desc: "비동기 glReadPixels로 [이번] 버퍼 쓰기" },
            { id: "swap", name: "Index Swap", desc: "매 프레임 read/write 인덱스 교체" }
          ]
        }
      },
      {
        title: "멀티 스레드 JPEG 인코딩",
        items: [
          "libjpeg-turbo 기반 인코더를 워커 풀로 구성해 여러 프레임을 병렬 처리",
          "1~19 워커 수를 바꾸며 FPS를 실측해 최적 워커 수(12개)를 데이터로 결정",
          "워커 수가 적으면 병렬화 이득 없고, 너무 많으면 스케줄링 오버헤드로 오히려 역효과",
        ],
        snippet: {
          type: "visual",
          label: "libjpeg-turbo 워커 풀 파이프라인",
          content: [
            { id: "q_in", name: "Encode Queue (Input)", desc: "프레임 데이터 적재" },
            { id: "workers", name: "12 Worker Threads", desc: "tjCompress2() 병렬 압축" },
            { id: "q_out", name: "Send Queue (Output)", desc: "인코딩 완료 버퍼 전달" }
          ]
        }
      },
      {
        title: "웹 빌드 (Emscripten)",
        items: [
          "기존 C++ OpenGL 코드를 재작성 없이 WebAssembly로 크로스컴파일",
          "브라우저에서 멀티스레드를 쓰려면 SharedArrayBuffer가 필요하고, 이는 Cross-Origin Isolated 환경에서만 활성화됨",
          "COI Service Worker를 추가해 모든 응답에 COOP/COEP 헤더를 자동 삽입, 웹 멀티스레드 활성화",
        ],
        snippet: {
          lang: "javascript",
          label: "Service Worker 헤더 삽입 (SharedArrayBuffer 활성화 규격)",
          code: `\
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      const newHeaders = new Headers(response.headers);
      // 웹 멀티스레드(WASM Pthreads) 필수 헤더 강제 주입
      newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
      newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
      
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    })
  );
});`
        }
      },
    ],
    problems: [
      {
        title: "glReadPixels 렌더 루프 블로킹",
        problem:
          "고해상도(816×616)에서 glReadPixels를 호출하면 GPU 렌더 완료까지 CPU가 멈춰 대기합니다. 렌더 루프가 이 구간에서 매 프레임 블로킹되어 FPS가 크게 하락했습니다.",
        solution:
          "PBO(Pixel Buffer Object) 더블 버퍼 ping-pong 구조로 전환했습니다. 이번 프레임에선 GPU에 비동기 쓰기만 발행하고, CPU는 이미 완료된 이전 프레임 데이터를 읽습니다. 매 프레임 read/write 인덱스를 교체해 블로킹 없이 픽셀 데이터를 가져옵니다.",
        result: "CPU-GPU 동기화 압력 감소, 렌더 루프 스톨 빈도 저하",
        snippet: {
          type: "visual",
          label: "PBO Ping-Pong 교차 접근",
          content: [
            { id: "cpu", name: "CPU Read", desc: "이미 완료된 pbo[readIndex] 비동기 매핑" },
            { id: "gpu", name: "GPU Write", desc: "pbo[writeIndex]에 glReadPixels 발행 (논블로킹)" },
            { id: "swap", name: "Index Swap", desc: "매 틱마다 read/write 타겟을 스왑" }
          ]
        },
      },
      {
        title: "TCP 프레임 밀림 (지연 누적)",
        problem:
          "인코딩과 소켓 전송이 같은 스레드에서 순서대로 실행되었습니다. 큰 프레임을 인코딩하는 동안 다음 프레임 전송이 밀려나고, 그 지연이 계속 누적되어 스트리밍이 버벅거렸습니다.",
        solution:
          "인코딩 스레드와 전송 스레드를 완전히 분리했습니다. 인코딩이 끝난 데이터를 큐에 넣으면 전송 스레드가 독립적으로 소비하는 생산자-소비자 구조로 전환했습니다.",
        result: "프레임 밀림 해소, 스트리밍 FPS 안정화",
        snippet: {
          type: "visual",
          label: "파이프라인 재설계 (생산자-소비자 구조)",
          content: [
            { id: "enc", name: "인코딩 스레드", desc: "프레임 분할 압축" },
            { id: "queue", name: "Concurrent Queue", desc: "데이터 버퍼링" },
            { id: "tx", name: "전송 스레드 (Tx)", desc: "논블로킹 소켓 I/O" }
          ]
        }
      },
      {
        title: "멀티 스레드 최적 워커 수 불명확",
        problem:
          "워커가 너무 많으면 락 경쟁과 캐시 간섭이 생기고, 너무 적으면 병렬화 이득이 없습니다. 직관으로 정하면 오히려 성능이 나빠질 수 있었습니다.",
        solution:
          "1~19 워커 수를 바꾸며 같은 조건(816×616, 3회 평균)으로 FPS를 실측했습니다. 12 워커에서 최고 성능이 나와 그 값을 채택했습니다.",
        result: "싱글(67 FPS) 대비 12 워커(85+ FPS) — +27% APP FPS / iGPU SINK FPS +19.69%",
        snippet: {
          type: "table",
          label: "벤치마크 결과 — 816×616 해상도, 3회 평균",
          headers: ["Workers", "APP FPS", "SINK FPS", "비고"],
          rows: [
            ["1", "67.xx", "24.xx", "싱글 스레드 기준"],
            ["6", "84.91", "29.40", "-"],
            ["12", "85.72", "29.43", "최적 채택 (최고 성능)"],
            ["19", "83.45", "28.45", "스케줄링 오버헤드 역전"]
          ]
        },
      },
      {
        title: "브라우저에서 멀티스레드 동작 불가",
        problem:
          "Emscripten으로 빌드한 WASM에서 pthreads 기반 멀티스레드 워커가 브라우저에서 전혀 실행되지 않았습니다. SharedArrayBuffer는 Cross-Origin Isolated 환경에서만 활성화되는데, 일반 서버 응답에는 COOP/COEP 헤더가 없어 비활성 상태였기 때문입니다.",
        solution:
          "COI(Cross-Origin Isolation) Service Worker를 빌드에 추가했습니다. 이 Service Worker가 모든 응답에 COOP: same-origin과 COEP: require-corp 헤더를 강제 삽입해 SharedArrayBuffer를 활성화합니다.",
        result: "웹 빌드에서 12개 인코딩 워커 정상 동작, 브라우저 배포 파이프라인 완성",
        snippet: {
          type: "visual",
          label: "COI Service Worker 헤더 주입",
          content: [
            { id: "server", name: "정적 파일 서버", desc: "일반 응답 (헤더 없음)" },
            { id: "sw", name: "Service Worker", desc: "COOP/COEP 헤더 강제 삽입" },
            { id: "browser", name: "WASM 브라우저", desc: "SharedArrayBuffer 활성화" }
          ]
        }
      },
    ],
    techChoice: [
      {
        tech: "C++17",
        reason: [
          "가비지 컬렉터 중단 현상(GC Pause)이 없어 렌더 루프의 낮은 지연시간 보장",
          "멀티스레드 제어 및 메모리 직접 관리에 최적화",
          "Emscripten WASM 크로스컴파일 지원이 가장 강력한 언어",
        ],
      },
      {
        tech: "Emscripten",
        reason: [
          "기존 작성된 C++ OpenGL 코드를 재작성 없이 브라우저로 이식 가능",
          "자바스크립트(JS) 포팅 대비 압도적인 개발 생산성 확보",
          "WebAssembly 네이티브급 성능으로 렌더링 프레임 방어",
        ],
      },
      {
        tech: "libjpeg-turbo",
        reason: [
          "SIMD 명령어를 활용한 하드웨어 가속으로 타 라이브러리(stb_image) 대비 월등한 압축 속도",
          "단일 헤더 및 정적 라이브러리 추가만으로 무거운 의존성(OpenCV 등) 없이 경량화 연동",
        ],
      },
      {
        tech: "TCP / WebSocket",
        reason: [
          "WebRTC/UDP 기반 통신 대비 구현 난이도가 현저히 낮아 단기간 프로토타입 개발에 적합",
          "NAT 순회(STUN/TURN) 등 복잡한 인프라 설정 없이 기존 방화벽 환경에서 100% 동작",
        ],
      },
      {
        tech: "OpenGL",
        reason: [
          "Emscripten이 WebGL2로의 자동 API 변환을 공식 지원",
          "Vulkan이나 DirectX와 달리 단일 코드로 크로스 플랫폼(네이티브 + 웹) 렌더링 가능",
        ],
      },
      {
        tech: "Python (브릿지)",
        reason: [
          "JETANK 하드웨어 제조사 SDK가 Python 바인딩만을 공식 제공",
          "ROS2 등 무거운 미들웨어를 도입하는 대신, C++ 메인 엔진과 소켓으로 통신하는 경량 브릿지로 채택",
        ],
      },
      {
        tech: "CMake",
        reason: [
          "C++ 네이티브 환경과 WebAssembly 컴파일 타겟을 단일 빌드 스크립트로 통합 관리 가능",
          "의존성 라이브러리 링킹을 명시적으로 제어하기에 가장 안정적인 사실상의 업계 표준",
        ],
      },
    ],
    retrospective: [
      {
        point: "TCP → UDP 기반 스트리밍",
        detail: "영상 스트리밍에서 패킷 하나가 지연되면 TCP head-of-line blocking으로 뒤 프레임들이 전부 밀립니다. 손실을 허용하되 최신 프레임만 전달하는 UDP 방식을 선택했다면 체감 레이턴시를 더 낮출 수 있었을 것입니다.",
      },
      {
        point: "Debug 빌드 기준 벤치마크",
        detail: "워커 수 스윕 측정이 Debug 빌드로 진행됐습니다. Release 빌드에서는 컴파일러 최적화로 절대 수치가 다를 수 있습니다. Release 빌드 기준으로 재측정하고 씬 복잡도별 변화도 함께 기록했다면 더 신뢰도 높은 데이터를 남길 수 있었을 것입니다.",
      },
      {
        point: "워커 수 동적 조절",
        detail: "실측으로 12를 찾아 하드코딩했지만, 렌더 루프 FPS 피드백을 받아 런타임에 동적으로 조절하는 구조였다면 배포 환경의 CPU 코어 수가 달라도 최적 성능을 낼 수 있었을 것입니다.",
      },
    ],
    links: {
      github: "https://github.com/Junwoo-Seo-1998/RobotPal",
    },
  },

  {
    id: "mausoleum",
    num: "02",
    title: "영묘 (Mausoleum)",
    subtitle: "UE5 멀티플레이어 던전 탈출 게임",
    period: "2026.02 – 2026.03",
    team: "6인 (UE5 클라이언트 + C++ 서버 + 인프라)",
    role: "보이스 채팅 클라이언트 & 서버 · 게임 서버 구조 개선",
    stack: ["Unreal Engine 5 (C++)", "C++ GameServer", "uWebSockets", "UDP", "Opus", "HRTF", "Docker"],
    cover: "/%EC%98%81%EB%AC%98.png",
    coverFallback: "/project-mausoleum-cover.png",
    highlights: [
      "보이스 채팅 클라이언트·서버 전담",
      "생사 분리 전략 패턴 설계",
      "C++ 게임 서버 OOP 리팩토링",
    ],
    implementations: [
      {
        title: "보이스 채팅 클라이언트 (UE5 C++)",
        items: [
          "마이크 캡처, 코덱(Opus), 네트워크 전송, 재생, 청취 규칙 5개 모듈을 완전히 분리해 Facade 패턴으로 조합",
          "Opus 16kHz·20ms·24kbps 설정에 FEC와 DTX를 활성화해 패킷 손실 복구와 무음 구간 대역폭 절감을 동시에 처리",
          "화자마다 독립적인 코덱 인스턴스를 유지해 디코드 상태 간섭을 방지하고, HRTF로 3D 공간음향을 구현",
        ],
        snippet: {
          type: "visual",
          label: "UVoiceCaptureProcessor 캡처 및 전송 흐름",
          content: [
            { id: "mic", name: "VoiceCapture", desc: "마이크 버퍼 획득 (RawData)" },
            { id: "opus", name: "Opus Codec", desc: "FEC/DTX 내장 인코딩" },
            { id: "net", name: "NetworkClient", desc: "UDP 소켓 비동기 전송" }
          ]
        }
      },
      {
        title: "보이스 채팅 서버 (C++)",
        items: [
          "uWebSockets 라이브러리를 활용해 수천 명의 동시 접속을 버틸 수 있는 고성능 룸(Room) 기반 릴레이 서버 구축",
          "Protobuf를 이용해 패킷 직렬화/역직렬화를 최적화하고, 패킷 구조를 Header-Body 포맷으로 통일",
          "Docker를 이용해 C++ 서버 빌드 환경을 격리하고, Jenkins 파이프라인으로 AWS EC2 자동 배포 구성",
        ],
        snippet: {
          lang: "protobuf",
          label: "보이스 채팅 서버 Protobuf 패킷 스키마 규격",
          code: `\
// 패킷 다형성을 위한 Header-Body 통합 규격
message VoicePacket {
  enum PacketType {
    JOIN_ROOM = 0;
    LEAVE_ROOM = 1;
    VOICE_DATA = 2;
  }
  
  PacketType type = 1;     // Header: 메시지 타입
  string room_id = 2;      // Routing: 목적지 방 ID
  uint32 sender_id = 3;    // Routing: 발신자 ID
  bytes opus_payload = 4;  // Body: 인코딩된 오디오 청크
}`
        }
      },
      {
        title: "생사 분리 전략 패턴",
        items: [
          "전략 인터페이스를 두고 생존자용과 영혼용 청취 규칙을 각각 구현체로 분리",
          "생존자: 거리 기반으로 청취 범위를 제한하고 사망자 목소리를 차단",
          "영혼: 다른 영혼과는 항상 통화 가능, 특정 조건 충족 시에만 생존자에게 들림",
        ],
        snippet: {
          lang: "cpp",
          label: "다형성을 활용한 청취 규칙 전략 인터페이스",
          code: `\
class IListenStrategy {
public:
    virtual ~IListenStrategy() = default;
    // 화자의 소리가 청자에게 들리는지 여부를 판단하는 핵심 규격
    virtual bool CanHear(APlayer* Listener, APlayer* Speaker) = 0;
};

class SurvivorStrategy : public IListenStrategy {
    bool CanHear(APlayer* L, APlayer* S) override { 
        /* 거리 계산 및 상태(생존/사망) 기반 필터링 */ 
        return true;
    }
};`
        }
      },
      {
        title: "C++ 게임 서버 구조 개선",
        items: [
          "네트워크 이벤트 루프를 인터페이스로 추상화해 UDP/TCP 루프의 책임을 명확히 분리",
          "소켓 라이프사이클 관리를 별도 컴포넌트로 분리해 플랫폼 구현체를 교체 가능한 구조로 개선",
          "방 입장 시 기존 플레이어 목록 스냅샷 전송, 퇴장 시 방장 변경 이벤트 처리",
        ],
        snippet: {
          type: "visual",
          label: "네트워크 책임 분리 아키텍처",
          content: [
            { id: "udp", name: "UDP Event Loop", desc: "보이스 전용 (Opus/HRTF, 지연시간 최소화)" },
            { id: "tcp", name: "TCP Event Loop", desc: "상태 동기화 전용 (위상, 신뢰성 전송)" },
            { id: "manager", name: "LifeCycle Manager", desc: "연결/해제/룸 세션 중앙 제어" }
          ]
        }
      },
      {
        title: "페이즈 시스템",
        items: [
          "시간 기반 타이머를 제거하고 조각상 완료 횟수(count) 기반으로 페이즈를 전환해 게임 일시정지 버그를 해소",
          "P0→P1→P2→Ended 전환 흐름을 중앙에서 관리하고, 전체 완료 감지 시 탈출 루트를 개방",
        ],
        snippet: {
          lang: "cpp",
          label: "카운트 기반(Phase Transition) 규격 코드",
          code: `\
void APhaseManager::OnStatueCompleted() {
    CompletedStatuesCount++;
    
    // 시간 타이머 대신 확정적인 상태(Count) 규격을 기반으로 페이즈 전환
    if (CompletedStatuesCount == 1 && CurrentPhase == EPhase::P0) {
        TransitionToPhase(EPhase::P1);
    } 
    else if (CompletedStatuesCount == 3 && CurrentPhase == EPhase::P1) {
        TransitionToPhase(EPhase::P2);
    }
    else if (CompletedStatuesCount >= MaxStatues) {
        TransitionToPhase(EPhase::Ended);
        OpenEscapeRoute(); // 탈출구 개방
    }
}`
        }
      },
    ],
    problems: [
      {
        title: "캡처 디바이스 null — 보이스 전혀 전송 안 됨",
        problem:
          "마이크의 표시 이름('마이크(Realtek Audio)')을 그대로 UE5 캡처 API에 전달했더니 null을 반환했습니다. 내부에서 DirectSound 디바이스 ID와 매칭을 시도하는데, Friendly Name은 매칭에 실패합니다. 결과적으로 캡처 객체가 없어 빈 데이터만 전송되었습니다.",
        solution:
          "빈 문자열을 전달하면 OS 기본 장치를 선택하고 항상 유효한 캡처 객체를 반환한다는 것을 확인했습니다. 장치 이름 대신 빈 문자열로 초기화하는 것으로 수정했습니다.",
        result: "보이스 채팅 프로토타입 완료 (Day 10)",
        snippet: {
          lang: "cpp",
          label: "언리얼 캡처 장치 매칭 트러블슈팅",
          code: `\
// ❌ 마이크 이름을 직접 전달하면 내부 DirectSound ID 불일치로 null 반환
FVoiceModule::Get().CreateVoiceCapture(TEXT("마이크(Realtek(R) Audio)"));

// ✅ 빈 문자열 전달 규격: OS 기본 녹음 장치 자동 매칭 (항상 유효한 캡처 객체 획득)
FVoiceModule::Get().CreateVoiceCapture(TEXT(""));`,
        },
      },
      {
        title: "백그라운드 복귀 시 오래된 음성 한꺼번에 재생",
        problem:
          "게임을 백그라운드로 전환하는 동안 마이크 캡처 버퍼가 계속 쌓입니다. 다시 포커스를 되찾으면 쌓인 버퍼가 한꺼번에 전송·재생되어 오래된 음성이 뭉쳐서 들렸습니다.",
        solution:
          "포커스가 복귀하는 시점에 캡처 버퍼를 전량 폐기하고 코덱 상태를 리셋했습니다. 이전 버퍼가 남아있지 않으므로 복귀 직후부터 깨끗한 음성이 전송됩니다.",
        result: "포커스 복귀 직후 깨짐 현상 해소",
        snippet: {
          type: "visual",
          label: "백그라운드 복귀 처리 흐름",
          content: [
            { id: "focus", name: "OnFocusChanged", desc: "게임 포커스 복귀 이벤트 감지" },
            { id: "drop", name: "Flush Buffer", desc: "누적된 마이크 잔여 버퍼 전량 폐기" },
            { id: "reset", name: "Codec Reset", desc: "디코더 상태 초기화로 노이즈 방지" }
          ]
        },
      },
      {
        title: "두 시계 혼용으로 페이즈 타이머 오작동",
        problem:
          "렌더 프레임 시계와 게임 월드 시계를 목적 구분 없이 혼용했습니다. 게임이 일시정지되면 게임 시계는 멈추지만 렌더 시계는 계속 흘러, 페이즈 타이머가 멈추지 않고 진행되는 버그가 발생했습니다.",
        solution:
          "페이즈 전환 조건을 시간 기반에서 조각상 완료 횟수(count) 기반으로 변경했습니다. 렌더 시계는 렌더 전용, 게임 시계는 게임 로직 전용으로 사용처를 명확히 분리했습니다.",
        result: "페이즈 전환 타이밍 정확성 확보, 일시정지 연동 버그 해소",
        snippet: {
          type: "visual",
          label: "시계 사용처 분리 (책임 명확화)",
          content: [
            { id: "render", name: "렌더 시계 (DeltaTime)", desc: "애니메이션, 시각 효과 전용" },
            { id: "game", name: "조각상 카운트 (Count)", desc: "페이즈 전환, 게임 로직 전용" }
          ]
        }
      },
    ],
    techChoice: [
      {
        tech: "UDP",
        reason: [
          "TCP의 고질적인 Head-of-line Blocking 방지: 패킷 하나 지연 시 전체 스트림이 막히는 현상을 원천 차단",
          "실시간 음성 채팅에서는 데이터 무결성(패킷 손실)보다 '지연시간 최소화'가 압도적으로 중요하기 때문에 채택",
        ],
      },
      {
        tech: "Opus Codec",
        reason: [
          "20ms 프레임 단위의 실시간 대화에 최적화된 저지연 고효율 오디오 코덱",
          "무음 구간 대역폭을 아끼는 DTX와, 패킷 유실을 복구하는 FEC 기능이 자체 내장되어 있어 UDP의 불안정성을 완벽히 상쇄",
        ],
      },
      {
        tech: "uWebSockets",
        reason: [
          "존재하는 C++ 웹소켓/네트워크 라이브러리 중 가장 높은 I/O 처리량(Throughput) 달성",
          "Boost.Beast 대비 코드가 간결하고, libwebsockets 대비 추상화가 잘 되어 있어 룸 샤딩 구조 구현에 적합",
        ],
      },
      {
        tech: "HRTF",
        reason: [
          "단순 좌우 스테레오 패닝을 넘어, 머리 전달 함수를 활용해 3D 공간 상의 소리 위치를 현실감 있게 재현",
          "언리얼 엔진(UE5)에 기본 플러그인으로 내장되어 있어 별도의 무거운 외부 오디오 미들웨어 없이 즉시 적용 가능",
        ],
      },
      {
        tech: "Protobuf",
        reason: [
          "스키마 기반 바이너리 직렬화를 통해 JSON 대비 데이터 크기를 줄이고 파싱 속도 대폭 향상",
          "C++ 클라이언트와 서버 간의 데이터 구조를 .proto 파일 하나로 강제하여 타입 불일치(Type Safety) 문제 해소",
        ],
      },
      {
        tech: "Docker",
        reason: [
          "C++ 컴파일러 및 의존성 라이브러리(Opus 등) 버전 불일치로 인한 '내 컴퓨터에선 되는데' 문제를 원천 차단",
          "팀원 전체가 완벽하게 동일한 격리 빌드 환경을 갖추고, AWS EC2 배포 환경까지 일관되게 유지 가능",
        ],
      },
      {
        tech: "Jenkins",
        reason: [
          "기존 팀 내 구축된 서버 인프라를 재사용할 수 있어 추가 클라우드 CI/CD 비용이 0원",
          "C++ CMake 빌드 파이프라인과 Docker 이미지 빌드 로직을 자유롭게 스크립팅할 수 있는 확장성",
        ],
      },
      {
        tech: "CMake",
        reason: [
          "C++ 게임 서버와 보이스 서버의 복잡한 의존성(uWebSockets, Protobuf, Opus) 링킹을 명시적으로 제어하기 위함",
          "Visual Studio, CLion 등 팀원들의 다양한 개발 도구를 모두 지원하는 범용 메타 빌드 시스템",
        ],
      },
    ],
    retrospective: [
      {
        point: "Jitter Buffer 미구현",
        detail: "UDP는 패킷 순서가 보장되지 않아 도착 순서가 뒤바뀐 패킷이 그대로 재생되어 순간적으로 음성이 어긋나는 현상이 있었습니다. 수십 ms 크기의 jitter buffer를 두어 재정렬 후 일정 속도로 재생했다면 음질이 더 안정적이었을 것입니다.",
      },
      {
        point: "음성 품질 지표 미계측",
        detail: "'들린다/안 들린다' 수준으로 테스트했습니다. MD에도 'VoiceProfiler 데이터를 인게임 디버그 UI로 노출'이 추가 목표로 남았는데, 패킷 손실률·RTT·jitter를 서버에서 집계하는 구조였다면 품질 튜닝을 데이터 기반으로 할 수 있었을 것입니다.",
      },
      {
        point: "ProcessCapture 포커스 체크 미사전 설계",
        detail: "백그라운드 복귀 시 보이스 깨짐 버그를 Day 29에 발견하고 FApp::HasFocus() 체크를 추가했습니다. 버퍼 누적이 보이스 품질에 미치는 영향을 설계 시점에 고려했다면 처음부터 방어 코드가 들어갔을 것입니다.",
      },
    ],
    links: {},
  },

  {
    id: "sticker",
    num: "03",
    title: "STICKER",
    subtitle: "AI 날씨·일정 기반 패션 코디 추천 앱",
    period: "2026.04 – 2026.05",
    team: "6인 (React Native + Spring Boot + FastAPI)",
    role: "백엔드 전담 · DevOps",
    stack: ["Spring Boot 3.5", "Java 21", "AWS SQS/S3", "Redis", "Prometheus", "Grafana", "Traefik", "GitLab CI/CD", "Docker Buildx"],
    cover: "/Sticker.png",
    highlights: [
      "Spring Boot 백엔드 전담",
      "SQS 비동기 AI 파이프라인 설계",
      "DevOps (CI/CD · 모니터링)",
    ],
    implementations: [
      {
        title: "SQS 비동기 AI 파이프라인",
        items: [
          "AI 추천 요청을 SQS 메시지로 발행하고, 소비자가 AI 서버에 전달하는 비동기 구조로 설계해 메인 서버 응답 속도와 AI 처리를 완전히 분리",
          "Java 21 가상 스레드로 소비자를 실행해 SQS long-polling 블로킹 구간에서 OS 스레드를 점유하지 않음",
          "에러 종류를 두 가지로 분류: 비즈니스 오류는 재시도해도 결과가 같으므로 즉시 삭제, 인프라 오류는 visibility timeout으로 자동 재큐",
        ],
        snippet: {
          type: "visual",
          label: "가상 스레드 기반 SQS Long-polling",
          content: [
            { id: "vthread", name: "Virtual Thread", desc: "블로킹 대기 시 OS 스레드 양보" },
            { id: "logic", name: "Process Result", desc: "AI 추천 로직 실행 및 판정" },
            { id: "ack", name: "Ack Strategy", desc: "비즈니스 오류(즉시 삭제) / 인프라 오류(재큐)" }
          ]
        }
      },
      {
        title: "중복 실행 방어 (dedup + 분산 락)",
        items: [
          "Redis setIfAbsent로 사용자+날짜 조합의 분산 락을 획득한 요청만 AI 추천 진행, 동시 중복 요청 차단",
          "처리 완료된 jobId를 7일 TTL로 Redis에 마킹해 SQS at-least-once delivery로 인한 중복 소비를 방지",
          "락 소유자만 해제 가능하도록 구현해 다른 요청이 락을 빼앗는 상황을 방지",
        ],
        snippet: {
          lang: "java",
          label: "Redis 원자적 분산 락 획득 규격 (setIfAbsent)",
          code: `\
public boolean tryLock(UUID userId, LocalDate date, String jobId, Duration ttl) {
    String key = "ai:daily-rec:lock:" + userId + ":" + date;
    // 원자적 처리: 키가 없을 때만 생성하고 true 반환 (동시성 방어)
    Boolean locked = redisTemplate.opsForValue()
                                  .setIfAbsent(key, jobId, ttl);
    return Boolean.TRUE.equals(locked);
}`
        }
      },
      {
        title: "인증 시스템",
        items: [
          "JWT를 세 종류로 분리: ACCESS(15분)는 REST API, REFRESH(7일)는 토큰 갱신, SOCKET(1분)은 WebSocket 핸드셰이크 전용",
          "Refresh Token 교환 시 기존 토큰을 즉시 폐기하고, 이미 폐기된 토큰으로 재시도가 들어오면 탈취로 간주해 해당 사용자의 모든 세션을 무효화",
          "소셜 로그인 시 mode 파라미터로 신규 가입과 기존 계정 로그인을 분리해 의도치 않은 계정 생성을 방지",
        ],
        snippet: {
          type: "table",
          label: "JWT 토큰 규격 및 용도 분리",
          headers: ["토큰 종류", "수명 (TTL)", "주요 용도", "비고"],
          rows: [
            ["ACCESS", "15분", "REST API 인증", "짧은 수명으로 탈취 피해 최소화"],
            ["REFRESH", "7일", "Access 재발급", "사용 시 1회용 폐기 (RTR 방식)"],
            ["SOCKET", "1분", "WebSocket 핸드셰이크", "쿼리 스트링 노출 대비 극단적 짧은 수명"]
          ]
        }
      },
      {
        title: "Redis 다층 캐시",
        items: [
          "날씨 API 응답을 데이터 종류별로 TTL을 다르게 설정: 요약 데이터 10분, 예보 데이터 4시간, 최저기온 28시간",
          "기상청 데이터 발표 시각 기준으로 TTL을 동적으로 계산해 발표 직후에는 짧게, 이후엔 길게 설정",
          "자주 바뀌는 옷장/코디 데이터는 10분 단기 캐싱으로 DB 조회 부담 감소",
        ],
        snippet: {
          type: "table",
          label: "데이터 생명주기(TTL) 기반 다층 캐시 규격",
          headers: ["Cache Name", "TTL 규격", "설정 근거"],
          rows: [
            ["KMA_FORECAST", "4시간", "기상청 단기예보 API 업데이트 주기와 일치"],
            ["KMA_TMN (최저)", "최대 28시간", "전날 02:10 발표값 → 익일 자정 이후까지 유효"],
            ["KMA_TMX (최고)", "최대 16시간", "당일 11:10 발표값 → 익일 업데이트 전까지 유효"],
            ["WARDROBE / CODI", "10분", "사용자 데이터 변경 빈도를 고려한 타협점"]
          ]
        }
      },
      {
        title: "CI/CD 파이프라인",
        items: [
          "루트 파이프라인이 changes 필터로 변경된 도메인(backend/ai/monitoring)만 재배포 트리거",
          "Docker Buildx로 멀티 아키텍처 이미지를 빌드해 Docker Hub에 푸시, SSH로 EC2에 배포",
          "Traefik이 컨테이너 라벨을 읽어 라우팅을 자동 구성, nginx 설정 파일 없이 서비스 노출",
        ],
        snippet: {
          lang: "yaml",
          label: "GitLab CI - Changes 필터 기반 도메인별 독립 파이프라인 규격",
          code: `\
backend_push_deploy_pipeline:
  rules:
    - changes: [Server/**/*]   # Server 폴더 내부 변경시에만 트리거
  trigger:
    include: .gitlab/ci/backend-deploy.yml

monitoring_push_deploy_pipeline:
  rules:
    - changes: [monitoring/**/*]  # 모니터링 인프라 설정 변경시에만 트리거
  trigger:
    include: .gitlab/ci/monitoring-deploy.yml`
        }
      },
    ],
    problems: [
      {
        title: "DB 커밋 전 SQS 발행 → 데이터 불일치",
        problem:
          "트랜잭션 안에서 SQS 메시지를 발행했더니 DB가 롤백되어도 메시지는 이미 큐에 들어간 상태가 됩니다. AI 서버가 메시지를 소비해 DB에 없는 데이터를 참조하면서 오류가 발생했습니다.",
        solution:
          "TransactionSynchronization.afterCommit() 훅에 SQS 발행 로직을 등록했습니다. DB 커밋이 완료된 이후에만 실행되므로 롤백 시에는 메시지가 발행되지 않습니다.",
        result: "DB 상태와 메시지 큐 상태의 일관성 보장",
        snippet: {
          lang: "java",
          label: "afterCommit 훅을 이용한 DB-SQS 일관성 제어",
          code: `\
public static void executeAfterCommit(Runnable task) {
    TransactionSynchronizationManager.registerSynchronization(
        new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                task.run(); // DB 커밋이 완전 종료된 이후에만 콜백 실행
            }
        }
    );
}

// 롤백 발생 시 큐 발행 안 됨 (일관성 보장)
txUtil.executeAfterCommit(
    () -> sqsPublisher.publish(new AIRecommendationJob(userId, jobId))
);`,
        },
      },
      {
        title: "SQS 메시지 유실 vs 무한 재시도 딜레마",
        problem:
          "처리 실패 메시지를 즉시 삭제하면 유실되고, 무조건 재시도하면 항상 실패하는 poison pill 메시지가 큐 전체를 블록합니다. 이 두 가지를 동시에 막아야 했습니다.",
        solution:
          "에러 종류를 두 가지로 분류해 ack 전략을 분리했습니다. 비즈니스 로직 오류(잘못된 메시지 형식 등)는 재시도해도 결과가 같으므로 즉시 삭제합니다. 인프라 오류(DB 연결 실패 등)는 일시적이므로 ack를 보류해 visibility timeout 후 자동 재큐됩니다.",
        result: "메시지 유실 없이 poison pill 격리",
        snippet: {
          type: "visual",
          label: "에러 종류별 ACK 전략 분리",
          content: [
            { id: "success", name: "성공", desc: "deleteMessage (정상 처리 완료)" },
            { id: "biz", name: "비즈니스 오류", desc: "즉시 deleteMessage (Poison Pill 격리)" },
            { id: "infra", name: "인프라 오류", desc: "ACK 미전송 (Timeout 후 자동 재처리)" }
          ]
        },
      },
      {
        title: "Refresh Token 탈취 대응",
        problem:
          "탈취된 Refresh Token이 재사용되어도 서버가 구분할 방법이 없습니다. 기존 토큰과 새 토큰이 동시에 유효한 상태가 유지되어 공격자가 계속 세션을 유지할 수 있었습니다.",
        solution:
          "토큰 교환 시 기존 토큰을 즉시 폐기합니다. 이미 폐기된 토큰으로 재시도가 들어오면 탈취로 판단하고 해당 사용자의 모든 세션을 강제 만료합니다.",
        result: "탈취 토큰으로 로그인 시도 시 전체 세션 강제 만료",
        snippet: {
          lang: "java",
          label: "RTR 재사용 감지 및 세션 강제 만료 로직",
          code: `\
public TokenPair rotate(String refreshToken) {
    RefreshToken stored = repository.findByToken(refreshToken)
        .orElseThrow(() -> {
            // 토큰 존재 안함 = 이미 폐기된 토큰의 불법 재사용 시도 → 탈취로 확정
            revokeAllByUserId(extractUserId(refreshToken)); // 해당 유저의 모든 연결 세션 강제 폭파
            return new TokenReusedException();
        });

    repository.delete(stored);               // 사용된 토큰은 1회용 폐기
    return issueNewPair(stored.getUserId()); // 신규 토큰 발급
}`,
        },
      },
    ],
    techChoice: [
      {
        tech: "AWS SQS",
        reason: [
          "AI 추천 처리 수십 초 소요 → 동기 HTTP 호출 불가",
          "at-least-once 보장 + visibility timeout 재처리 기본 내장",
          "RabbitMQ는 직접 운영 필요, Kafka는 파티션·컨슈머 설정 과다",
        ],
      },
      {
        tech: "Java 21 가상 스레드",
        reason: [
          "SQS long-polling(20s) 블로킹 구간에서 OS 스레드 미점유",
          "기존 블로킹 코드 그대로 유지 — 코드 변경 없이 스레드 비용 제거",
          "ThreadPoolExecutor는 OS 스레드 수 한도, 코루틴은 스택 전환 필요",
        ],
      },
      {
        tech: "Redis",
        reason: [
          "분산 락·결과 dedup·날씨 캐시를 단일 인프라로 처리",
          "Memcached는 분산 락 구현 불가, 로컬 캐시는 다중 인스턴스 불일치",
          "TTL, setIfAbsent, 원자적 연산이 모두 필요한 사용 패턴",
        ],
      },
      {
        tech: "Prometheus + Grafana",
        reason: [
          "Micrometer AOP로 코드 수정 없이 계층별 메트릭 수집",
          "p95/p99 SLO를 직접 쿼리하고 대시보드 시각화",
          "Datadog은 유료, CloudWatch는 AWS 종속",
        ],
      },
      {
        tech: "Spring Security",
        reason: [
          "JWT 필터 체인·OAuth2·role 접근 제어를 Security Filter Chain으로 일원화",
          "SOCKET 전용 토큰 검증 경로를 별도 필터로 분리",
          "OAuth2 제공자 추가 시 설정만 확장하면 됨",
        ],
      },
      {
        tech: "Kakao / Google OAuth2",
        reason: [
          "Spring Security OAuth2 Client로 소셜 로그인 통합",
          "mode 파라미터로 신규 가입·기존 로그인 분리 — 의도치 않은 계정 생성 방지",
          "추후 제공자 추가 시 설정만 확장하면 됨",
        ],
      },
      {
        tech: "Gmail SMTP",
        reason: [
          "SecureRandom OTP + Redis 5분 TTL로 재발송 쿨다운 구현",
          "SendGrid·SES는 도메인 인증·유료 플랜 필요",
          "개발 단계에서 별도 설정 없이 즉시 연동 가능",
        ],
      },
      {
        tech: "FCM",
        reason: [
          "앱 백그라운드 상태에서도 푸시 수신 가능",
          "WebSocket 폴링은 앱이 백그라운드일 때 동작하지 않음",
          "Firebase Admin SDK 한 번으로 iOS·Android 크로스 플랫폼 전송",
        ],
      },
      {
        tech: "HikariCP 튜닝",
        reason: [
          "가상 스레드 환경에서 I/O 빈도 증가에 맞춘 풀 크기 조정",
          "커넥션 고갈 타임아웃 방지",
          "maximumPoolSize·connectionTimeout 부하 테스트 기반으로 결정",
        ],
      },
      {
        tech: "KMA 단기예보 API",
        reason: [
          "국내 관측 데이터 → 국내 패션 추천 정확도 우위",
          "발표 시각 기반 TTL 동적 계산으로 API 호출 최소화",
          "상용 해외 API는 국내 측정 오차 존재",
        ],
      },
      {
        tech: "S3 Presigned URL",
        reason: [
          "클라이언트가 직접 S3 업로드 → 서버 메모리·트래픽 제거",
          "URL Redis 캐싱으로 반복 발급 최소화",
          "서명 만료로 접근 제어 자동 처리",
        ],
      },
      {
        tech: "SmartLifecycle",
        reason: [
          "stop() 훅에서 처리 중인 메시지 완료 대기 후 종료 — Graceful Shutdown",
          "@PostConstruct/ApplicationRunner는 shutdown 타이밍 제어 불가",
          "배포 중 메시지 유실 방지",
        ],
      },
    ],
    retrospective: [
      {
        point: "SQS DLQ(Dead Letter Queue) 미구성",
        detail: "재시도 한도를 초과한 메시지를 격리하는 DLQ를 연결하지 않았습니다. DLQ가 있었다면 최종 실패 메시지를 유실 없이 추적하고 수동 재처리하는 운영 편의성이 크게 높아졌을 것입니다.",
      },
      {
        point: "캐시 개선 효과 수치화 미흡",
        detail: "Redis 캐시 도입 전후 응답 시간을 Grafana baseline으로 남기지 않았습니다. 캐시 적용 전 app_operation_seconds를 먼저 기록하고 진행했다면 개선 효과를 p95/p99 수치로 증명할 수 있었을 것입니다.",
      },
      {
        point: "날씨 캐시 선제 갱신 설계 오버",
        detail: "날씨 캐시에 스케줄러 기반 선제 갱신을 도입했다가 복잡성이 커서 on-demand 방식으로 단순화했습니다. 처음부터 on-demand로 설계했다면 동일한 결과를 불필요한 복잡성 없이 얻을 수 있었을 것입니다.",
      },
    ],
    links: {},
  },
];