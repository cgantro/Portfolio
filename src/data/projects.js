/**
 * 주력 프로젝트 3개
 * - implementations: 구현 내용 (자연어, 파일명/직접구현 표현 없음)
 * - problems: 문제해결 + 핵심 코드 스니펫
 */
export const projects = [
  {
    id: "robotpal",
    num: "01",
    title: "RobotPal",
    subtitle: "로봇팔 시뮬레이션 & 실시간 스트리밍",
    period: "2025.11 – 2026.04",
    team: "2인 (엔진 + 스트리밍)",
    role: "스트리밍 시스템 / 성능 최적화 / 그리퍼 ECS",
    stack: ["C++17", "Emscripten", "libjpeg-turbo", "TCP/WebSocket", "ImGui", "CMake"],
    cover: "/%EB%A1%9C%EB%B4%87%ED%8C%94%20%EC%8B%9C%EC%97%B0.webp",
    coverFallback: "/project-robotpal-cover.png",
    summary:
      "OpenGL 기반 C++ 렌더링 엔진에 실시간 카메라 스트리밍과 그리퍼 제어를 붙여 웹에서도 동작하는 JETANK 로봇팔 시뮬레이터",
    highlights: [
      "PBO 더블 버퍼 ping-pong으로 glReadPixels 동기 블로킹 해소",
      "멀티 스레드 인코딩 워커 12개 최적 실측 → +27% APP FPS, iGPU SINK FPS +19%",
      "인코딩 ↔ 전송 스레드 분리 + 큐 파이프라인 → 프레임 밀림 완전 해소",
    ],
    implementations: [
      {
        title: "스트리밍 파이프라인",
        items: [
          "TCP + WebSocket 이중 스트리밍 레이어 설계",
          "Python 브릿지로 PC ↔ 실물 로봇팔 명령 전달",
          "멀티 스레드 JPEG 인코더 + 큐 기반 전송 분리로 프레임 밀림 해소",
        ],
      },
      {
        title: "PBO 비동기 readback",
        items: [
          "프레임 N: GPU에 glReadPixels 비동기 쓰기 발행",
          "프레임 N: 이전 프레임(N-1) CPU 매핑으로 동기화 압력 제거",
          "매 프레임 read/write 인덱스 교체 (ping-pong)",
        ],
      },
      {
        title: "그리퍼 ECS 시스템",
        items: [
          "집게 잡기/놓기 로직을 ECS 시스템으로 통합",
          "충돌/상태 컴포넌트를 씬 관리 기틀 위에 독립적으로 확장",
        ],
      },
      {
        title: "웹 빌드 CI/CD",
        items: [
          "Emscripten으로 C++ → WebAssembly 크로스 컴파일",
          "COI Service Worker로 SharedArrayBuffer 허용 (크로스 오리진 격리)",
          "GitHub Actions 기반 자동 빌드 및 배포",
        ],
      },
    ],
    problems: [
      {
        title: "glReadPixels 렌더 루프 블로킹",
        problem:
          "고해상도(816×616)에서 glReadPixels가 GPU 렌더 완료까지 CPU를 동기 대기 → 렌더 루프 스톨, FPS 하락",
        solution:
          "PBO 더블 버퍼 ping-pong으로 비동기화 — 이번 프레임에서 쓰기 발행, 이전 프레임 데이터를 읽어 CPU 블로킹 제거",
        result: "CPU-GPU 동기화 압력 감소, 렌더 루프 스톨 빈도 저하",
        snippet: {
          lang: "cpp",
          label: "PBO ping-pong 구조",
          code: `\
void Texture::GetAsyncData(ReadCallback callback) {
    // ① 이전 프레임 데이터 CPU 읽기 (GPU는 이미 완료됨)
    glBindBuffer(GL_PIXEL_PACK_BUFFER, pbo_[readIndex_]);
    if (auto* ptr = glMapBuffer(GL_PIXEL_PACK_BUFFER, GL_READ_ONLY)) {
        callback(reinterpret_cast<const uint8_t*>(ptr), size_);
        glUnmapBuffer(GL_PIXEL_PACK_BUFFER);
    }
    // ② 이번 프레임 GPU 쓰기 발행 — CPU 블로킹 없음
    glBindBuffer(GL_PIXEL_PACK_BUFFER, pbo_[writeIndex_]);
    glReadPixels(0, 0, width_, height_, GL_RGBA, GL_UNSIGNED_BYTE, 0);

    std::swap(readIndex_, writeIndex_); // 매 프레임 교체
}`,
        },
      },
      {
        title: "TCP 프레임 밀림 (지연 누적)",
        problem:
          "인코딩과 소켓 전송이 같은 스레드에서 실행 → 큰 프레임 처리 중 다음 프레임 전송이 밀려 지연 누적",
        solution:
          "인코딩 스레드와 전송 스레드를 완전 분리, 인코딩 결과를 큐에 넣고 전송 스레드가 소비하는 구조로 전환",
        result: "프레임 밀림 해소, 스트리밍 FPS 안정화",
      },
      {
        title: "멀티 스레드 최적 워커 수 불명확",
        problem:
          "워커가 너무 많으면 락 경쟁/캐시 간섭, 너무 적으면 병렬화 이득 없음 — 직관으로 결정하면 오히려 역효과",
        solution:
          "1~19 워커 스윕 실측 (816×616, 3회 평균). 12 워커에서 최고 성능 확인 후 채택",
        result: "싱글(67 FPS) 대비 12 워커(85+ FPS), +27% APP FPS / iGPU SINK FPS +19.69%",
        snippet: {
          lang: "text",
          label: "벤치마크 결과 — 816×616 해상도, 3회 평균",
          code: `\
workers |  APP FPS | SINK FPS
--------+----------+---------
      1 |    67.xx |   24.xx   ← 싱글 스레드 기준
      6 |    84.91 |   29.40
     12 |    85.72 |   29.43   ← 최적 채택
     19 |    83.45 |   28.45   ← 스케줄링 오버헤드 역전`,
        },
      },
      {
        title: "Emscripten WebSocket 빌드 오류",
        problem:
          "Emscripten 빌드에서 WebSocket 링크 오류 — 시스템 소켓 대신 -lwebsocket.js 링크 필요",
        solution:
          "CMakeLists.txt에 -lwebsocket.js 명시 링크 + COI Service Worker(SharedArrayBuffer 허용) 추가",
        result: "웹 빌드 및 배포 파이프라인 정상 작동",
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
    role: "보이스 채팅 시스템 / C++ 서버 / 아이템 스폰",
    stack: ["Unreal Engine 5 (C++)", "C++ GameServer", "uWebSockets", "UDP", "Opus", "HRTF", "Docker"],
    cover: "/%EC%98%81%EB%AC%98.png",
    coverFallback: "/project-mausoleum-cover.png",
    summary:
      "UDP 기반 Opus 보이스 채팅, 룸 샤딩 C++ 게임 서버, 생사 분리 전략 패턴 음성 시스템을 갖춘 UE5 멀티플레이어 게임",
    highlights: [
      "CreateVoiceCapture(TEXT(\"\")) — DirectSound 디바이스 ID 불일치 문제 해소",
      "Strategy 패턴으로 생존자↔영혼 간 보이스 채팅 규칙 완전 분리",
      "C++ 게임 서버 3단계 OOP 리팩토링 주도 (INetworkEventLoop → SocketPlatform)",
    ],
    implementations: [
      {
        title: "보이스 채팅 클라이언트 (UE5 C++)",
        items: [
          "캡처 / 코덱 / 네트워크 / 재생 / 전략 5개 모듈로 완전 분리 (Facade 패턴)",
          "Opus 16kHz·20ms·24kbps·FEC+DTX, [2B 프레임 길이][Opus 데이터] 패킷 포맷",
          "HRTF 3D 오디오로 공간음향 구현, 화자별 독립 코덱으로 디코드 상태 간섭 제거",
        ],
      },
      {
        title: "보이스 채팅 서버 (C++)",
        items: [
          "roomCode 해시 기반 샤딩으로 워커별 독립 처리",
          "shared_ptr<const vector<char>> 제로 카피 패킷 전파",
        ],
      },
      {
        title: "생사 분리 전략 패턴",
        items: [
          "생존자: 거리 기반 청취, 죽은 자 목소리 차단",
          "영혼: 영혼끼리 항상 청취, view target 또는 조건 충족 시 생존자도 청취",
        ],
      },
      {
        title: "C++ 게임 서버 OOP 리팩토링",
        items: [
          "INetworkEventLoop 인터페이스로 udp/tcp 루프 책임 분리",
          "SocketPlatform으로 소켓 라이프사이클 이관, 플랫폼 구현체 교체 가능",
          "방 입장 시 기존 플레이어 목록 스냅샷 전송, 퇴장 시 방장 변경 이벤트 처리",
        ],
      },
      {
        title: "페이즈 시스템",
        items: [
          "0.25초 폴링, count 기반으로 P0→P1→P2→Ended 전환",
          "조각상 전체 완료 감지 → 탈출 루트 개방 체인",
        ],
      },
    ],
    problems: [
      {
        title: "캡처 디바이스 null — 보이스 전혀 전송 안 됨",
        problem:
          "CreateVoiceCapture에 Friendly Name('마이크(Realtek Audio)')을 전달 → 내부에서 DirectSound 디바이스 ID와 매칭 실패 → null 캡처 반환 → 빈 데이터 전송",
        solution:
          "빈 문자열을 전달하면 OS 기본 장치를 선택하고 항상 유효한 캡처 객체 반환",
        result: "보이스 채팅 프로토타입 완료 (Day 10)",
        snippet: {
          lang: "cpp",
          label: "VoiceCaptureProcessor.cpp",
          code: `\
// ❌ Friendly Name → DirectSound ID 불일치 → null 반환
FVoiceModule::Get().CreateVoiceCapture(TEXT("마이크(Realtek(R) Audio)"));

// ✅ 빈 문자열 = OS 기본 장치 선택 (항상 성공)
// 코드 주석: "CreateVoiceCapture는 DirectSound 디바이스 ID를 기대합니다.
//             Friendly Name은 매칭되지 않으므로 반드시 빈 문자열을 사용해야 합니다."
FVoiceModule::Get().CreateVoiceCapture(TEXT(""));`,
        },
      },
      {
        title: "백그라운드 전환 시 버퍼 누적 → 포커스 복귀 시 깨짐",
        problem:
          "앱이 백그라운드로 전환되는 동안 캡처 버퍼가 계속 쌓여, 포커스 복귀 시 오래된 데이터가 한꺼번에 전송되어 재생 품질 불량",
        solution:
          "포커스 소실 감지 시 버퍼 전체 비우기 + 코덱 리셋으로 오래된 상태 제거",
        result: "포커스 복귀 직후 깨짐 현상 해소",
        snippet: {
          lang: "cpp",
          label: "VoiceCaptureProcessor.cpp — 포커스 복구 처리",
          code: `\
void UVoiceCaptureProcessor::OnFocusChanged(bool bHasFocus) {
    if (!bHasFocus) return;

    // 포커스 복귀: 쌓인 버퍼 전부 폐기
    uint32 Avail = 0;
    VoiceCapture->GetCaptureState(Avail);
    if (Avail > StaleCaptureHardDropBytes) {
        TArray<uint8> Dummy;
        Dummy.SetNumUninitialized(Avail);
        VoiceCapture->GetVoiceData(Dummy.GetData(), Avail, Avail);
    }
    // 코덱 상태 리셋 (오래된 디코드 상태 제거)
    Codec->Shutdown();
    Codec->Init();
}`,
        },
      },
      {
        title: "두 시계 혼용으로 페이즈 타이머 오작동",
        problem:
          "렌더 시계(FPlatformTime)와 게임 시계(GetServerWorldTimeSeconds)를 혼용 → 게임 일시 정지 시 페이즈 타이머가 계속 진행",
        solution:
          "페이즈 전환을 시간 기반에서 count 기반으로 변경, 두 시계 사용처를 목적에 맞게 명확히 분리",
        result: "페이즈 전환 타이밍 정확성 확보",
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
    role: "백엔드 전담 + 인프라",
    stack: ["Spring Boot 3.5", "Java 21", "AWS SQS/S3", "Redis", "Prometheus", "Grafana", "Traefik", "GitLab CI/CD", "Docker Buildx"],
    cover: null,
    summary:
      "SQS 비동기 AI 파이프라인 + Redis 다층 캐싱 + Micrometer 계층별 메트릭으로 구성된 패션 코디 추천 백엔드",
    highlights: [
      "SQS 소비자에 Java 21 가상 스레드 적용, 2단계 에러 핸들링으로 메시지 유실 방지",
      "Redis setIfAbsent() dedup + 분산 락으로 중복 AI 추천 실행 차단",
      "Refresh Token Rotation + reuse detection으로 토큰 탈취 대응",
    ],
    implementations: [
      {
        title: "SQS 비동기 AI 파이프라인",
        items: [
          "AI 추천 요청을 SQS 메시지로 발행, 소비자가 AI 서버에 전달하는 비동기 구조",
          "Java 21 가상 스레드로 소비자 실행 — 블로킹 I/O에서 스레드 점유 없음",
          "2단계 에러 핸들링: 비즈니스 오류 → 즉시 삭제, 인프라 오류 → visibility timeout 재시도",
        ],
      },
      {
        title: "중복 실행 방어 (dedup + 분산 락)",
        items: [
          "분산 락: Redis setIfAbsent로 같은 사용자의 동일 날짜 요청을 하나만 진행",
          "결과 dedup: jobId를 7일 TTL로 Redis에 마킹, 동일 결과 중복 처리 방지",
          "락 소유자만 해제(owner-only release)로 다른 요청이 락을 빼앗는 상황 방지",
        ],
      },
      {
        title: "인증 시스템",
        items: [
          "JWT 3토큰: ACCESS(15m) / REFRESH(7d) / SOCKET(1m), token_type claim으로 구분",
          "Refresh Token Rotation: 토큰 재사용 감지 시 해당 사용자의 전체 세션 무효화",
          "소셜 로그인: mode=login(기존 계정만) / mode=register(신규 허용), Kakao·Google 지원",
        ],
      },
      {
        title: "Redis 다층 캐시",
        items: [
          "날씨 데이터 TTL: WEATHER_SUMMARY 10분, KMA_FORECAST 4시간, KMA_TMN 28시간",
          "WARDROBE/CODI 10분 (자주 바뀌는 데이터 단기 캐싱)",
          "기상청 데이터 발표 시각 기반으로 TTL 계산 (ex: 최저기온 h>2 또는 h==2 && min>=10)",
        ],
      },
      {
        title: "CI/CD 멀티 레벨 라우터",
        items: [
          "루트 CI → push-deploy.yml → backend/ai/monitoring 3개 독립 트리거",
          "changes 필터로 변경된 도메인만 재배포",
          "Docker Buildx 멀티 아키텍처 빌드 → Docker Hub → SSH EC2 배포",
        ],
      },
    ],
    problems: [
      {
        title: "DB 커밋 전 SQS 발행 → 데이터 불일치",
        problem:
          "트랜잭션 내에서 SQS를 발행하면, DB 롤백 발생 시에도 메시지는 이미 큐에 들어가 AI 서버가 존재하지 않는 데이터를 참조",
        solution:
          "TransactionSynchronization.afterCommit() 훅에 발행 로직을 등록 — DB 커밋 완료 이후에만 실행",
        result: "DB 상태와 메시지 큐 상태의 일관성 보장",
        snippet: {
          lang: "java",
          label: "TxUtil.java — afterCommit 훅",
          code: `\
public static void executeAfterCommit(Runnable task) {
    TransactionSynchronizationManager.registerSynchronization(
        new TransactionSynchronization() {
            @Override
            public void afterCommit() {
                task.run(); // DB 커밋 이후에만 실행됨
            }
        }
    );
}

// 사용: 롤백 발생 시 SQS 발행 안 됨
txUtil.executeAfterCommit(
    () -> sqsPublisher.publish(new AIRecommendationJob(userId, jobId))
);`,
        },
      },
      {
        title: "SQS 메시지 유실 vs 무한 재시도 딜레마",
        problem:
          "처리 실패 메시지를 즉시 삭제하면 유실, 무조건 재시도하면 poison pill 메시지가 큐를 블록",
        solution:
          "에러 종류별로 ack 전략을 분리: 비즈니스 로직 오류는 재시도해도 동일 결과이므로 즉시 삭제, 인프라 오류(일시적)는 visibility timeout으로 자동 재큐",
        result: "메시지 유실 없이 poison pill 격리",
        snippet: {
          lang: "java",
          label: "SqsConsumer.java — 2단계 에러 핸들링",
          code: `\
private void processMessage(Message msg) {
    try {
        handler.handle(msg);
        sqs.deleteMessage(queueUrl, msg.receiptHandle()); // ✅ 성공 ack

    } catch (InvalidRecommendationResultMessageException e) {
        // 비즈니스 오류 → 재시도해도 동일 실패 → 즉시 삭제
        sqs.deleteMessage(queueUrl, msg.receiptHandle());
    }
    // 그 외 예외 → no-ack → visibility timeout 후 자동 재큐
}`,
        },
      },
      {
        title: "Refresh Token 탈취 대응",
        problem:
          "탈취된 Refresh Token이 재사용되어도 서버가 구분 불가 — 기존 토큰과 새 토큰이 동시에 유효",
        solution:
          "토큰 교환 시 기존 토큰을 즉시 폐기. 이미 폐기된 토큰으로 요청이 오면 탈취로 간주하고 해당 사용자의 모든 세션 무효화",
        result: "탈취 토큰으로 로그인 시도 시 전체 세션 강제 만료",
        snippet: {
          lang: "java",
          label: "RefreshTokenService.java — reuse detection",
          code: `\
public TokenPair rotate(String refreshToken) {
    RefreshToken stored = repository.findByToken(refreshToken)
        .orElseThrow(() -> {
            // 존재하지 않음 = 이미 폐기된 토큰으로 재시도
            // → 탈취 가능성 → 전체 세션 강제 만료
            revokeAllByUserId(extractUserId(refreshToken));
            return new TokenReusedException();
        });

    repository.delete(stored);              // 기존 토큰 폐기
    return issueNewPair(stored.getUserId()); // 새 페어 발급
}`,
        },
      },
    ],
    teamFeatures: [
      {
        title: "AI 서버 — 7단계 코디 추천 파이프라인 (FastAPI)",
        items: [
          "빈 옷장 → 정규화 → 필터 → enumerate_all_combos → score_and_diversify → reason generation → formatter",
          "2단계 이미지 생성: generate_daily(preview) → generate_scene_blend(home 이미지)",
        ],
      },
      {
        title: "React Native 프론트",
        items: [
          "카메라로 옷 촬영 → S3 업로드 → AI 2D 모델화",
          "옷장 관리 / 코디 추천 / 인증 화면",
        ],
      },
    ],
    links: {},
  },
];
