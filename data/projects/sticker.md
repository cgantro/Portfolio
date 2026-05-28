# STICKER — AI 패션 코디 추천 앱

## 1. 프로젝트 소개

- **목적**: 사진으로 옷을 등록하면 AI가 2D 모델화하고, 날씨·일정·무드 기반으로 오늘의 코디를 추천하는 패션 앱
- **개발 기간**: 2026-04-14 ~ 2026-05-21 (약 5주, SSAFY S14 Final 프로젝트)
- **팀 구성**: 5~6인 (React Native 프론트, Spring Boot 백엔드, FastAPI AI 서버)
- **사용 기술**: Spring Boot 3.5, Java 21 가상 스레드, AWS SQS/S3, Redis, Micrometer, Prometheus, Grafana, Traefik, GitLab CI/CD, Docker Buildx
- **한 줄 설명**: SQS 비동기 AI 파이프라인 + Redis 다층 캐싱 + Micrometer 계층별 메트릭으로 구성된 패션 코디 추천 백엔드

---

## 2. 내 구현 (백엔드 + 인프라)

### 2-1. CI/CD 파이프라인 (멀티 레벨 라우터)

루트 `.gitlab-ci.yml` → `push-deploy.yml` → backend/ai/monitoring 3개 독립 트리거. `changes` 필터로 도메인별 독립 배포:

```yaml
# push-deploy.yml
backend_push_deploy_pipeline:
  rules:
    - changes: [Server/**/*]   # 백엔드 코드만 바뀌면 백엔드만 재배포
monitoring_push_deploy_pipeline:
  rules:
    - changes: [monitoring/**/*]  # 모니터링만 바뀌면 모니터링만 재배포
```

Docker Buildx 멀티 아키텍처 이미지 빌드 → Docker Hub push → SSH EC2 배포. MR 알림 단계 포함.

### 2-2. 이메일 인증 + 회원가입

`EmailVerificationService.sendVerificationCode()`:
- `SecureRandom` 6자리 인증코드 생성
- 재발송 쿨다운: `resendAvailableAt` 체크 → 너무 이른 재발송 차단
- 전역 발송 속도 제한: `synchronized(globalRateLock)` 시간 윈도우 기반 카운터
- `EmailVerificationStore`(Redis): `{email → EmailVerificationState}` TTL 저장
- `EmailSender`(Gmail SMTP): 인증코드 발송

`confirmVerificationCode()`: 코드 일치 + 만료 시각 검증 → `EmailVerificationState.verified=true`

`EmailRegisterService.register()`: 인증 완료 상태 확인 → `User` 엔티티 생성 + BCrypt 비밀번호 해시 + JWT 토큰 발급

`EmailLoginService.login()`: BCrypt 검증 → JWT 토큰 페어 반환

### 2-3. 소셜 로그인 (Kakao / Google)

`AuthService.socialLogin(request)`:
- `mode=login`: 기존 계정만 허용 (신규 자동 생성 차단)
- `mode=register`: 신규 계정 생성 허용

**Kakao**: `accessToken` → `KakaoApiClient.getUserMe()` → 이메일 제공 동의 시 `users.email`에 저장
**Google**: `idToken` → `GoogleApiClient.verifyIdToken()` → 항상 이메일 획득 가능 → `users.email` 저장

소셜 이메일이 기존 이메일 가입자와 충돌 시 `USER_EMAIL_DUPLICATE` 예외. `UserAuthIdentity` 엔티티: `(userId, provider, providerUserId)` 복합 식별.

### 2-4. JWT 인증

`JwtAuthenticationFilter`: `Authorization: Bearer <token>` 헤더 추출 → `JwtAuthTokenProvider.validate()` → `SecurityContext` 설정. `AuthTokenProvider` 인터페이스 + `JwtAuthTokenProvider` 구현으로 테스트 대체 가능.

`RequireAuth` 어노테이션 + `RequireAuthAspect`: Controller 메서드에 `@RequireAuth` 붙이면 인증 컨텍스트(`AuthContext.currentUserId()`) 주입 확인.

### 2-5. Refresh Token Rotation

`RefreshTokenStore` 인터페이스 → `RedisRefreshTokenStore`(prod) / `InMemoryRefreshTokenStore`(local) 전환 가능.

재사용 감지 로직:
```java
// 서명 유효하나 저장소에 없음 → 이미 사용된 토큰 재사용 → 전체 세션 무효화
if (savedTokenOptional.isEmpty()) {
    refreshTokenStore.revokeAllByUserId(userId);
    throw new ResponseStatusException(UNAUTHORIZED, "재사용이 감지된 refresh token입니다.");
}
// userId claim 불일치도 전체 세션 무효화
if (!userId.equals(savedToken.userId())) {
    refreshTokenStore.revokeAllByUserId(userId);
    throw ...;
}
// 정상: 기존 토큰 폐기 + 신규 ACCESS + REFRESH 발급 (Rotation)
```

### 2-6. SQS Job 발행기 + Redis 분산 락

`SqsDailyRecommendationJobPublisher.publish(messageBody)`: `SqsClient.sendMessage()` → `AiSqsProperties.getDailyRecommendationJobQueueUrl()`에서 URL 로딩.

`RedisDailyRecommendationJobLockStore.tryLock(userId, targetDate, jobId, ttl)`:
```java
// key: ai:daily-recommendation:{userId}:{targetDate}
Boolean locked = redisTemplate.opsForValue().setIfAbsent(key, jobId, ttl);
```
`release()`: 저장된 `jobId`와 현재 `jobId` 일치 시에만 삭제 → 경쟁 상태에서 다른 요청의 락 해제 방지.

발행 흐름: 분산 락 획득 → Job payload 조립 (옷장 아이템 목록, 날씨 컨텍스트, 사용자 정보) → SQS 큐 발행

### 2-7. SQS 결과 소비기

`SqsDailyRecommendationResultConsumer implements SmartLifecycle`:

```java
private final ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();

private void consumeLoop() {
    while (running) {
        ReceiveMessageRequest request = ReceiveMessageRequest.builder()
                .queueUrl(queueUrl)
                .maxNumberOfMessages(10)
                .waitTimeSeconds(20)  // long-polling
                .build();
        // ...
    }
}
```

`SmartLifecycle.stop(Runnable callback)`: `running=false` → loop 종료 대기 → `callback.run()` — graceful shutdown 보장.

두 계층 오류 처리:
- `InvalidRecommendationResultMessageException` → 즉시 ack (poison pill 방지)
- 그 외 예외 → ack 없음 → SQS visibility timeout 후 자동 재처리

### 2-8. Redis 결과 dedup

`RedisDailyRecommendationResultDedupStore.markIfAbsent(jobId, ttl)`:
```java
// KEY_PREFIX + jobId → "1", TTL 7일
Boolean stored = redisTemplate.opsForValue().setIfAbsent(KEY_PREFIX + jobId, "1", ttl);
return Boolean.TRUE.equals(stored);
```
중복 jobId 수신 시 `ProcessingDecision.ACK` → 중복 DB 저장 없이 SQS에서 삭제.

`DailyRecommendationResultService.process()`: insert-only 저장 — 기존 추천을 덮어쓰지 않고 수신 결과를 이력처럼 누적. DB 커밋 이후 알림 발송: `runAfterCommitOrNow(() -> notificationDispatchService.sendToUser(...))` (내부적으로 `TransactionSynchronizationManager.registerSynchronization().afterCommit()` 또는 즉시 실행).

### 2-9. Redis 캐시 설정

`RedisCacheConfig`:
```java
ObjectMapper redisMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

redisMapper.activateDefaultTypingAsProperty(
        redisMapper.getPolymorphicTypeValidator(),
        ObjectMapper.DefaultTyping.EVERYTHING,  // 모든 타입에 @class 포함
        "@class"
);
```

캐시별 TTL:
| 캐시 이름 | TTL | 이유 |
|---|---|---|
| `WEATHER_SUMMARY` | 600s (설정값) | 기상청 예보 갱신 주기 |
| `KMA_FORECAST` | 4h | 단기예보 업데이트 주기 |
| `KMA_CURRENT_OBSERVATION` | 2h | 실황 데이터 갱신 주기 |
| `KMA_TMN` | 28h | 당일 최저기온 → 다음날 02:10까지 유효 |
| `KMA_TMX` | 16h | 당일 최고기온 → 다음날 11:10까지 유효 |
| `WARDROBE_ITEMS` / `CODI_LIST` / `CODI_DETAIL` | 10min | 사용자 데이터 변경 빈도 |

`WardrobeQueryService`: `@Cacheable(WARDROBE_ITEMS, key="#userId")` + `@CacheEvict(WARDROBE_ITEMS, key="#userId")` 아이템 삭제 시 무효화.

### 2-10. 기상청 날씨 서비스

`KmaWeatherQueryService`:
- **현재기온**: 초단기실황(T1H, 실측값) 우선 → 실패 시 단기예보(TMP) fallback
- **최저기온**: `isTmnPublished()` (02:10 이후) → 공식 TMN / 이전 → TMP 최솟값 추정
- **최고기온**: `isTmxPublished()` (11:10 이후) → 공식 TMX / 이전 → TMP 최댓값 추정

격자 좌표(nx, ny): 사용자 GPS 좌표 → 기상청 격자 좌표 변환 후 캐시 키로 사용.

`WeatherSummaryCacheService`: `WeatherSummaryCacheKey(nx, ny)` 기준 on-demand 캐시 — 동일 격자점 재요청 시 KMA API 호출 없음.

### 2-11. Micrometer AOP 성능 계측

`ExecutionTimeAspect`:
- 포인트컷: `*Service`, `*Repository`, `*Client`, `@LogExecutionTime`
- `app_operation_seconds` 메트릭: `endpoint`(템플릿 URI, raw URI 금지), `layer`(service/repository/external/sqs), `operation`(10개 버킷), `result`(success/error) 태그
- `endpoint` 추출: `HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE` → `/users/{id}` 형태
- `app_db_query_candidate_seconds`: 서비스 레이어 호출 중 `dbQueryCandidate` 판단 시 추가 기록 (SQL 계측 없이 1차 슬로우 쿼리 감지)
- `application.yml` percentiles: p95/p99 설정 (SLO 기반 경보용)

### 2-12. 모니터링 인프라

`docker-compose.monitoring.yml`: Prometheus + Grafana + Traefik 컨테이너.

Grafana 서브패스 라우팅:
```yaml
environment:
  - GF_SERVER_ROOT_URL=https://${APP_HOST}/grafana/
  - GF_SERVER_SERVE_FROM_SUB_PATH=true
labels:
  - traefik.http.routers.grafana.rule=Host(`${APP_HOST}`) && PathPrefix(`/grafana`)
```

Prometheus entrypoint를 셸 스크립트로 변경 → `${APP_HOST}` 환경변수 런타임 렌더링.

### 2-13. 성능 개선

- **가상 스레드**: `spring.threads.virtual.enabled=true` → SQS long-polling(20s), KMA API 호출 등 I/O 대기 중 OS 스레드 미점유
- **DB 인덱스**: `findByUser_IdOrderByCreatedAtDesc` 등 주요 조회 컬럼 인덱스 추가
- **HikariCP 커넥션 풀**: 가상 스레드 환경에 맞춘 풀 크기 조정 (I/O 빈도 증가에 대응)
- **S3 Presigned URL 캐시**: 동일 키 반복 생성 방지

---

## 3. 팀 핵심 구현

### AI 서버 — 코디 추천 파이프라인 (FastAPI)

SQS `daily-recommendation-job` 큐 소비 → 코디 후보 3개 생성 → SQS `daily-recommendation-result` 큐 발행.

**파이프라인 7단계** (`daily_rec_service.py`):
1. 빈 옷장 체크 → `EMPTY_WARDROBE` 에러
2. `WeatherContext` → `WeatherFeature` 정규화 (계절/온도 구간/날씨 리스크)
3. 1차 필터: 계절 필터 + 날씨 리스크 필터 (우천 시 흰 소재 제외 등)
4. `enumerate_all_combos`: 상의(base) × 아우터(outer) × 신발(shoes) 전체 조합 생성 (화이트리스트 통과 아이템만)
5. `score_and_diversify`: context 태그(캐주얼/포멀/스포티) 3슬롯 각 1위 후보 선택 — 스타일 다양성 보장
6. 후보별 `(title, shortReason)` 생성: Evidence → LLM(`generate_reason`) 우선, 실패 시 룰 fallback. `ThreadPoolExecutor`로 3후보 병렬 호출 (SQS visibility timeout 30s 여유 확보)
7. `formatter` 표현 변환

**아이템 임베딩** (`embeddings/`): 옷장 아이템을 벡터로 임베딩 → 코사인 유사도 기반 스타일 매칭 점수 계산.

**이미지 생성** (`image_gen/orchestrator.py`): Gemini Flash / OpenAI DALL-E 클라이언트 팩토리 패턴. 2단계 합성:
- Step 1: 마네킹 자산 + 옷장 아이템 이미지 → `generate_daily()` → preview 이미지 생성
- Step 2: preview 출력(base) + scene_description → `generate_scene_blend()` → home 배경 합성 (형태/옷 변동 차단, 시각 일관성 보장)
- 후처리: center-crop 4:5 → S3 PutObject (`users/{userId}/ai-codi-generated/{date}/{uuid}.png`)

`scene_ref` 폐기 결정 (2026-05-14): Gemini Flash에서 `scene_ref` 이미지가 outfit template으로 잡혀 preview 입력이 무시되는 현상 → scene_ref 제거, base 이미지 + 텍스트만으로 단순화.

**옷장 아이템 2D 모델화 API** (`/wardrobe/image`): 업로드된 의류 사진 → 배경 제거 + 2D 렌더링 → S3 저장 → 아이템 URL 반환. 백엔드가 이 URL을 `WardrobeItem.imageUrl`로 저장.

### React Native 앱

역할별 화면 흐름:
- **옷장 등록**: 사진 촬영 → AI API 2D 모델화 요청 → 카테고리/서브카테고리/색상 태깅 → `WardrobeItem` 저장
- **코디 추천**: 오늘의 코디 3후보 표시 (preview 이미지 + shortReason), 슬롯별 선택, 최종 코디 확정
- **코디 세트**: 사용자 직접 코디 조합 생성/저장/편집 (`CodiSet`, `CodiSetItem`)
- **인증**: 이메일 인증 회원가입 + 카카오/구글 소셜 로그인 + 토큰 갱신 (Refresh Token Rotation 연동)

Push 알림: AI 코디 추천 완료 시 FCM 수신 → 앱 내 알림 표시. `FcmNotificationSender` (prod) / `NoOpNotificationSender` (local) 전략 패턴.

---

## 4. 문제 해결 과정

**Day 22~28 (2026-05-06~11, 모니터링 배포 불안정)**

문제: Prometheus + Grafana를 CI/CD로 배포했으나 Grafana가 `/grafana` 서브패스에서 리다이렉트 루프 발생. 동시에 모니터링 설정 변경 시 메인 서비스 재배포도 트리거됨

원인 1 (Grafana 루프): Traefik이 `/grafana` prefix를 strip해 컨테이너의 `/`로 라우팅하는데, Grafana가 `root_url`을 모르면 `http://host/`로 리다이렉트 → Traefik이 다시 `/grafana`로 라우팅 → 무한 루프

원인 2 (배포 연동): 메인 서비스와 모니터링 설정이 동일 파이프라인에서 처리됨

시도:
- nginx reverse proxy 경유 → Traefik과 중복
- 배포 이미지 롤백 (`Fix: deploy SSH 서명 오류 대응 및 배포 이미지 롤백`)
- Prometheus entrypoint를 shell로 변경해 설정 템플릿 렌더링 시점 확보

최종 해결 (2가지):

1. **Grafana 서브패스 설정**:
```yaml
# docker-compose.monitoring.yml
grafana:
  environment:
    - GF_SERVER_ROOT_URL=https://${APP_HOST}/grafana/
    - GF_SERVER_SERVE_FROM_SUB_PATH=true
  labels:
    - traefik.http.routers.grafana.rule=Host(`${APP_HOST}`) && PathPrefix(`/grafana`)
    - traefik.http.services.grafana.loadbalancer.server.port=3000
    # PathPrefix 라우팅 시 Traefik이 prefix를 strip하지 않음 → Grafana가 /grafana/ 경로 그대로 수신
```

2. **모니터링 파이프라인 독립화**:
```yaml
# .gitlab-ci.yml (루트 라우터)
trigger_push_deploy:
  trigger:
    include: .gitlab/ci/push-deploy.yml
# push-deploy.yml 내부: backend/ai/monitoring 각각 changes 필터로 독립 트리거
monitoring_push_deploy_pipeline:
  rules:
    - changes: [monitoring/**/*]  # 모니터링 파일만 바뀌면 모니터링만 재배포
```

결과: `/grafana` 경로 정상 접근. 모니터링 설정 변경이 서비스 재배포를 유발하지 않음

---

**Day 25 (2026-05-08, Redis ClassCastException)**

문제: 옷장 목록 Redis 캐싱 적용 직후 `ClassCastException` 발생. `WardrobeItemsResponse`로 저장됐으나 역직렬화 시 타입 불일치

원인 분석:
- `GenericJackson2JsonRedisSerializer` 기본 설정은 `@class` 메타데이터 없이 JSON만 저장
- 저장 시점의 클래스와 조회 시점의 클래스 경로가 미세하게 달라지거나, 복잡한 중첩 컬렉션 타입(`List<WardrobeItemSummaryResponse>`)의 타입 정보가 복원 불가

시도:
- 기본 `GenericJackson2JsonRedisSerializer` 사용 → 저장은 되나 역직렬화 시 타입 캐스팅 오류

최종 해결:

```java
// RedisCacheConfig.java
ObjectMapper redisMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

redisMapper.activateDefaultTypingAsProperty(
        redisMapper.getPolymorphicTypeValidator(),
        ObjectMapper.DefaultTyping.EVERYTHING,  // 모든 타입에 @class 메타데이터 포함
        "@class"
);

GenericJackson2JsonRedisSerializer valueSerializer =
        new GenericJackson2JsonRedisSerializer(redisMapper);
```

저장 예시: `{"@class":"com.project.server.domain.wardrobe.dto.WardrobeItemsResponse","items":[...]}`

캐시별 TTL 전략:
```java
.withInitialCacheConfigurations(Map.of(
    CacheNames.WEATHER_SUMMARY,           base.entryTtl(weatherTtl),          // 600s (설정값)
    CacheNames.KMA_FORECAST,              base.entryTtl(Duration.ofHours(4)),  // 예보 업데이트 주기
    CacheNames.KMA_CURRENT_OBSERVATION,   base.entryTtl(Duration.ofHours(2)),
    CacheNames.KMA_TMN,                   base.entryTtl(Duration.ofHours(28)), // 당일 최저기온 만료
    CacheNames.KMA_TMX,                   base.entryTtl(Duration.ofHours(16)), // 당일 최고기온 만료
    CacheNames.WARDROBE_ITEMS,            base.entryTtl(Duration.ofMinutes(10)),
    CacheNames.CODI_LIST,                 base.entryTtl(Duration.ofMinutes(10)),
    CacheNames.CODI_DETAIL,               base.entryTtl(Duration.ofMinutes(10))
))
```

캐시 무효화: 옷장 아이템 삭제 시 `@CacheEvict(value = CacheNames.WARDROBE_ITEMS, key = "#userId")`

결과: 옷장 목록·상세, 코디 목록·상세 Redis 캐싱 전체 적용

---

**Day 26~28 (2026-05-07~11, SQS 소비기 설계)**

문제: AI 서버가 추천 결과를 SQS에 비동기로 발행하는 구조에서 백엔드가 결과를 신뢰성 있게 소비해야 함. 동시에 서버 재시작 중 메시지 유실 없이 graceful shutdown 보장 필요

원인 분석:
- `@Scheduled` 폴링: Spring 스케줄러는 shutdown 타이밍 제어가 어려움
- 쓰레드 점유: SQS long-polling(20s)이 platform thread를 점유하면 연결 낭비

설계 결정:

```java
// SqsDailyRecommendationResultConsumer.java
@Component
// SmartLifecycle: 빈 초기화 이후 자동 시작(isAutoStartup), 종료 순서(phase) 제어
public class SqsDailyRecommendationResultConsumer implements SmartLifecycle {

    // 단일 가상 스레드: 순서 보장 + SQS long-polling(20s) 대기 중 OS 스레드 미점유
    private final ExecutorService executorService = Executors.newVirtualThreadPerTaskExecutor();

    private void consumeLoop() {
        while (running) {
            ReceiveMessageRequest request = ReceiveMessageRequest.builder()
                    .queueUrl(queueUrl)
                    .maxNumberOfMessages(10)
                    .waitTimeSeconds(20)  // long-polling
                    .build();
            List<Message> messages = sqsClient.receiveMessage(request).messages();
            for (Message message : messages) {
                handleMessage(queueUrl, message);
            }
        }
    }
}
```

두 계층 오류 처리:
```java
private void handleMessage(String queueUrl, Message message) {
    try {
        // 처리 성공 → ack
        resultService.process(payload);
        deleteMessage(queueUrl, message.receiptHandle());
    } catch (InvalidRecommendationResultMessageException ex) {
        // 계약 위반 메시지(jobType 불명, 필드 누락): 재시도해도 성공 불가 → 즉시 ack (독성 메시지 루프 방지)
        log.warn("event=DAILY_RECOMMENDATION_RESULT_INVALID_MESSAGE ...");
        deleteMessage(queueUrl, message.receiptHandle());
    } catch (Exception ex) {
        // 일시 장애(DB 다운, 네트워크): ack 미뤄서 visibility timeout 후 SQS 재처리
        log.error("event=DAILY_RECOMMENDATION_RESULT_PROCESS_ERROR ...");
    }
}
```

결과: 서버 재시작 시 graceful stop. SQS 메시지 유실 없음. 독성 메시지 무한 루프 차단

---

**Day 26~28 (계속, 중복 소비 방지 + 중복 발행 방지)**

문제: SQS at-least-once delivery 보장으로 인해 동일 jobId 메시지가 두 번 도착할 수 있음. 동시에 사용자가 빠르게 추천 요청을 두 번 보내면 AI 서버로 Job이 두 번 발행됨

해결 1 — **결과 dedup** (Redis `setIfAbsent`, 7일 TTL):

```java
// RedisDailyRecommendationResultDedupStore.java
@Override
public boolean markIfAbsent(String jobId, Duration ttl) {
    // 원자적 set-if-absent: jobId 최초 처리 시에만 true
    Boolean stored = redisTemplate.opsForValue()
            .setIfAbsent(KEY_PREFIX + jobId, "1", ttl);
    return Boolean.TRUE.equals(stored);
}

// DailyRecommendationResultService.java
if (!dedupStore.markIfAbsent(message.jobId(), DEDUP_TTL)) {
    log.info("event=DAILY_RECOMMENDATION_RESULT_DUPLICATE ...");
    return ProcessingDecision.ACK; // 중복이어도 ack → SQS에서 삭제
}
```

해결 2 — **발행 분산 락** (Redis `setIfAbsent`, TTL with jobId):

```java
// RedisDailyRecommendationJobLockStore.java
public boolean tryLock(UUID userId, LocalDate targetDate, String jobId, Duration ttl) {
    // key: ai:daily-recommendation:{userId}:{targetDate}
    Boolean locked = redisTemplate.opsForValue()
            .setIfAbsent(key(userId, targetDate), jobId, ttl);
    return Boolean.TRUE.equals(locked);
}

public void release(UUID userId, LocalDate targetDate, String jobId) {
    String existing = redisTemplate.opsForValue().get(key(userId, targetDate));
    if (jobId.equals(existing)) { // 본인 잠금만 해제 (경쟁 상태 방지)
        redisTemplate.delete(key(userId, targetDate));
    }
}
```

결과 저장 방식 (insert-only):
```java
// DailyRecommendationResultService.java
// 기존 추천을 업데이트/덮어쓰지 않고 수신 결과를 이력처럼 누적
List<AiCodiSlot> persistedSlots = aiCodiSlotRepository.saveAll(savedSlots);
dailyAiSlotItemRepository.saveAll(slotItems);
// 저장 후 알림 발송: DB 커밋 이후에만 실행
runAfterCommitOrNow(() -> notificationDispatchService.sendToUser(...));
```

결과: 동일 jobId 중복 소비 시 DB 중복 저장 없음. 동시 요청 중복 발행 방지

---

**Day 29~30 (2026-05-14~15, 날씨 최저기온 부정확)**

문제: 날씨 API에서 최저기온이 실제값과 다르게 응답. 자정 직후 요청 시 전날 최저기온이 반환됨

원인 분석:
- 기상청 TMN(최저기온)은 02:10에 발표. 그 이전에는 해당 항목 자체가 없음
- 기존 코드는 TMN이 없으면 null 반환 → 미확정 상태를 클라이언트에 그대로 전달

시도: 단기예보 TMP 데이터에서 최솟값을 선택 → 정확도 낮음

최종 해결: 발표 시각 기반 분기:

```java
// KmaWeatherQueryService.java

// 최저기온: 02:10 이후면 공식 TMN, 이전이면 TMP 최솟값 추정
if (isTmnPublished(now)) {
    KmaForecastData tmnData = kmaWeatherClient.fetchTodayTmnForecast(gridPoint, today);
    minTemperature = parser.parseDouble(parser.getOptionalValue(tmnData.items(), today, "TMN"));
    if (minTemperature == null) {
        minTemperature = parser.selectMinTemperature(items, today); // fallback
    }
} else {
    minTemperature = parser.selectMinTemperature(items, today); // TMP 최솟값 추정
}

// 최고기온: 11:10 이후면 공식 TMX, 이전이면 TMP 최댓값 추정
if (isTmxPublished(now)) { ... }

private static boolean isTmnPublished(LocalDateTime now) {
    int h = now.getHour();
    return h > 2 || (h == 2 && now.getMinute() >= 10);
}
```

현재기온도 이중 fallback 구조:
```java
// 초단기실황(T1H, 실측값) 우선
try {
    KmaCurrentObservation obs = kmaWeatherClient.fetchCurrentObservation(gridPoint, now);
    temperature = parser.parseDouble(obs.values().get("T1H"));
} catch (BusinessException ignored) {}
// 실패 시 단기예보(TMP)로 대체
if (temperature == null) {
    temperature = parser.parseDouble(parser.getOptionalValue(items, today, "TMP"));
}
```

날씨 요약 캐시: `WeatherSummaryCacheKey(nx, ny)` — 격자점 기준 캐싱. 동일 위치 재요청 시 KMA API 호출 없음

결과: 새벽 2시 이전에도 정확한 최저기온 추정값 제공. 11시 이전에도 최고기온 추정값 제공

---

**Day 30~31 (2026-05-17~18, 성능 병목 계측 + 개선)**

문제: 주요 조회 API 응답이 느리지만 어느 레이어가 병목인지 불명확. 날씨 API 호출이 매 요청마다 기상청 외부 API 호출 발생

원인: 인덱스 없는 컬럼 조회(full scan), 캐시 미도입, platform thread 기반 I/O 점유

AOP 계측 시스템 구축:

```java
// ExecutionTimeAspect.java
@Around(
    "execution(public * com.project.server.domain..service..*(..))
    || execution(public * com.project.server.domain..repository..*(..))
    || execution(public * com.project.server.domain..client..*(..))
    || @annotation(LogExecutionTime)"
)
public Object logExecutionTime(ProceedingJoinPoint joinPoint) {
    // 메트릭 태그: endpoint(템플릿 URI), layer(service/repository/external/sqs), operation(도메인버킷), result
    Timer.builder("app_operation_seconds")
            .tag("endpoint", endpoint)   // raw URI 금지 → 템플릿 패턴으로 카디널리티 통제
            .tag("layer", layer.metricValue())
            .tag("operation", operation) // 10개 허용값만: auth/codi/wardrobe/weather/...
            .tag("result", result)
            .register(meterRegistry)
            .record(elapsedMs, TimeUnit.MILLISECONDS);

    // 서비스 레이어 슬로우 쿼리 후보 감지 (SQL 계측 라이브러리 없이 1차 대응)
    if (serviceMethod && dbQueryCandidate) {
        Timer.builder("app_db_query_candidate_seconds")
                .tag("class", methodSignature.getDeclaringType().getSimpleName())
                .tag("method", methodSignature.getMethod().getName())
                .register(meterRegistry)
                .record(elapsedMs, TimeUnit.MILLISECONDS);
    }
}
```

`application.yml` percentile 설정:
```yaml
management.metrics.distribution.percentiles:
  app_operation_seconds: 0.95, 0.99
  app_db_query_candidate_seconds: 0.95, 0.99
  http.server.requests: 0.95, 0.99
  hikaricp.connections.acquire: 0.95, 0.99
```

3가지 병행 개선:
1. **DB 인덱스**: `findByUser_IdOrderByCreatedAtDesc` 등 주요 조회 컬럼 인덱스 추가
2. **가상 스레드**: `spring.threads.virtual.enabled=true` — I/O 대기 중 OS 스레드 미점유
3. **날씨 + S3 URL 캐싱**: 격자점 기준 날씨 on-demand 캐시, S3 Presigned URL 캐시

결과: Grafana `app_operation_seconds` p95/p99 확인 가능. 날씨 외부 API 호출 빈도 대폭 감소

---

**Day 27 (2026-05-10, Refresh Token Rotation 강화)**

문제: JPA 기반 Refresh Token 저장소 → 서버 재시작 시 토큰 유지 불안정. 토큰 재사용 공격 감지 없음

원인: Refresh Token을 JPA 엔티티로 관리하면 DB 의존성 증가, 서버 클러스터 환경에서 일관성 보장 어려움

해결:
1. JPA 저장소를 `RefreshTokenStore` 인터페이스로 추상화 → `RedisRefreshTokenStore` 구현 (prod), `InMemoryRefreshTokenStore` (local)
2. Refresh Token Rotation + 재사용 감지:

```java
// RefreshTokenService.java
Optional<RefreshTokenState> savedTokenOptional = refreshTokenStore.findByToken(refreshToken);
if (savedTokenOptional.isEmpty()) {
    // 서명은 유효하지만 저장소에 없음 → 이미 사용된 토큰 재사용 = 공격 시도
    refreshTokenStore.revokeAllByUserId(userId); // 해당 사용자 전체 세션 무효화
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "재사용이 감지된 refresh token입니다.");
}
// userId claim과 저장소의 userId 불일치도 전체 세션 무효화
if (!userId.equals(savedToken.userId())) {
    refreshTokenStore.revokeAllByUserId(userId);
    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "재사용이 감지된 refresh token입니다.");
}
// 정상: 새 토큰 발급 (rotation - 기존 토큰 폐기, 신규 발급)
AuthTokenProvider.TokenPair tokenPair = authTokenProvider.issueTokens(userId);
```

결과: 서버 재시작 후에도 Redis에서 Refresh Token 유지. 토큰 탈취 후 재사용 시 전체 세션 자동 무효화

---

## 4. 배운 점

- **Redis 캐싱은 직렬화 설정을 먼저 확정해야 한다.** `GenericJackson2JsonRedisSerializer`에 `@class` 타입 정보 없이 중첩 객체를 저장하면 역직렬화에서 반드시 터진다. `activateDefaultTypingAsProperty`를 설정 시점에 넣지 않으면 나중에 모든 캐시 키를 flush해야 한다.
- **모니터링 인프라는 메인 서비스 파이프라인에서 독립시켜야 한다.** Traefik 라우팅과 Grafana `root_url` 설정은 연동되어 있어 어느 한쪽만 고치면 루프가 생긴다. 두 설정을 함께 검토하는 체크리스트가 필요했다.
- **SQS 소비기의 오류 처리는 두 계층으로 분리해야 한다.** 계약 위반 메시지(잘못된 포맷)는 재시도해도 성공하지 않으므로 즉시 ack 해야 한다. 일시 장애(DB, 네트워크)는 ack를 미뤄 SQS visibility timeout 이후 재처리되게 해야 한다. 이 구분이 없으면 독성 메시지 루프가 발생한다.
- **Micrometer 태그 카디널리티를 처음부터 통제해야 한다.** raw URI를 태그로 쓰면 `/users/123` `/users/456`마다 별도 시계열이 생성된다. 템플릿 패턴(`/users/{id}`)으로 normalize하는 코드를 처음 AOP 작성 시 넣었다.

---

## 5. 회고

**잘한 점**: SQS 소비기에 `SmartLifecycle`을 쓴 것 — `@PostConstruct`로 스레드 시작하면 shutdown 타이밍을 제어할 수 없다. 배포 파이프라인을 `changes` 필터로 도메인별 독립화한 것 — 모니터링 설정만 바뀌면 모니터링만 재배포된다.

**아쉬운 점**: Redis 캐시 도입 전후 응답 시간을 Grafana baseline으로 남기지 않았다. 개선 효과를 수치로 증명할 수 없다. 날씨 캐시에 스케줄러 기반 선제 갱신을 도입했다가 제거한 것 (on-demand로 단순화) — 처음부터 on-demand로 설계했어야 했다.

**다시 만든다면**: 캐시 적용 전 `app_operation_seconds` baseline을 먼저 측정하고 진행. SQS Dead Letter Queue 처리 — 현재는 visibility timeout 재처리만 있고 최종 실패 처리가 없다. `runAfterCommitOrNow` 패턴을 공용 유틸(`TxUtil`)로 추출해 팀 전체가 일관되게 사용.

**추가하고 싶은 것**: SQS Dead Letter Queue + DLQ 알림, k6 부하 테스트 → Grafana 연동 결과, Circuit Breaker (Resilience4j)로 기상청 API 장애 격리

---

## 메타

- 기간: 2026-04-14 ~ 2026-05-21 (약 5주)
- 팀 구성: 5~6인 (React Native, Spring Boot, FastAPI)
- 역할: 백엔드 개발자 / 인프라 (CI/CD, Prometheus/Grafana, Redis, SQS)
- 기술 스택: Spring Boot 3.5, Java 21 가상 스레드, AWS SQS/S3, Redis (Lettuce), Micrometer, Prometheus, Grafana, Traefik, Docker Buildx, GitLab CI/CD
- 레포: GitLab (S14P31A408)

---

## 6. 프로젝트 리뷰 피드백 및 보완점

프로젝트 코드 및 문서를 심층 분석하여 도출한 누락된 내용 및 보완 필요 사항입니다:

### 6-1. 개선안의 실제 코드 미반영 (설정 누락)
- **현상**: 부하 테스트 결과 문서(`docs/load_test/RESULTS.md`)에서 DB 커넥션 풀 부족으로 인한 대기 현상을 최적화하기 위해, `HikariCP maximum-pool-size`를 9에서 20으로 상향 조정하겠다고(RUN #2) 명시했습니다.
- **문제점**: 하지만 실제 프로젝트의 `application-prod.yml` 파일 등 환경 설정에는 여전히 `maximum-pool-size: 9`로 방치되어 있어, 분석한 해결책이 코드베이스에 갱신되지 않았습니다. 
- **개선안**: 문서에 적힌 최적화 전략과 실제 코드의 프로덕션 설정값을 일치시키도록 `maximum-pool-size`를 20(또는 도출된 최적값)으로 업데이트해야 합니다.

### 6-2. 테스트 결과 기록 누락
- **현상**: 부하 테스트 결과(`docs/load_test/RESULTS.md`) 문서 하단의 "RUN #2 (변경 후)" 섹션에 템플릿만 존재하고 실제 결과값이 빈칸으로 남아 있습니다.
- **문제점**: 최적화 후 P95 응답 시간이나 Req/s 성능이 얼마나 개선되었는지 정량적인 결과(지표)가 없어, 트러블슈팅의 완결성이 떨어집니다.
- **개선안**: DB 커넥션 풀과 캐시를 튜닝한 이후 재측정한 부하 테스트 결과 데이터를 문서에 명확하게 채워 넣어 "문제 발견 -> 가설 수립 -> 튜닝 -> 결과 검증" 파이프라인을 완성해야 합니다.

---

## 7. 심층 분석 리포트 (Subagent Analysis)

소스 코드 전체(`docs/load_test/RESULTS.md` 포함)와 `git log` 히스토리를 5개의 서브 에이전트 관점에서 심층 분석한 리포트입니다.

### 🤖 [Agent 1] Git Timeline (문제 해결 시계열 추적)
`git log`를 바탕으로 한 핵심 백엔드/인프라 타임라인입니다.
1. **모니터링 및 인프라 분리 (Day 22~28)**: Grafana 서브패스 라우팅 문제 해결 및 CI/CD 파이프라인 최적화. `docker-compose.monitoring.yml`에서 Traefik 설정이 조정됨.
2. **캐싱 및 SQS 통합 (Day 25~28)**: `ClassCastException` 등 Redis 직렬화 이슈 해결, SQS 결과 소비를 위한 가상 스레드(`newVirtualThreadPerTaskExecutor`) 기반 `SmartLifecycle` 적용 및 분산 락(dedup) 구현.
3. **성능 모니터링 고도화 (Day 30~31)**: Micrometer AOP를 도입하여 레이어별 성능 계측(app_operation_seconds) 설정. 
4. **AI/Frontend 연동 최적화 (후반부)**: `adjust_preview_service.py` 자연어 보정 고도화 및 프론트엔드의 소셜 로그인(S14P31A408-188), UI 수정 커밋(S14P31A408-184 등)이 다수 병합되며 프로덕션 퀄리티 확보.

### 🤖 [Agent 2] Architecture (기술 및 아키텍처 분석)
- **비동기 이벤트 기반 백엔드**: Spring Boot 백엔드와 FastAPI AI 서버가 완전히 분리된 MSA(Microservices Architecture) 성격을 가집니다. 둘 사이의 통신은 AWS SQS를 통해 비동기로 처리되며, Redis를 활용한 분산 락과 Dedup 패턴을 통해 **"At-least-once" 전달 보장 환경에서의 중복 처리 문제를 완벽히 방어**하는 견고한 아키텍처를 구축했습니다.
- **가상 스레드(Virtual Threads) 극대화**: I/O 대기가 잦은 외부 API 호출(기상청 날씨), SQS Long-polling, Meshy 스트림 등의 작업 스레드를 Java 21의 가상 스레드로 전환하여 컨텍스트 스위칭 오버헤드를 극적으로 줄였습니다.

### 🤖 [Agent 3] Role & Code (내 역할 / 팀원 역할 검증)
- **yoonpyo (백엔드 및 인프라 전담)**:
  - Spring Security, JWT 갱신(Rotation), 이메일 및 소셜 인증 등 **코어 인증 서버(AuthService) 로직**을 전담.
  - SQS Publisher/Consumer, Redis 캐싱 및 락(`RedisDailyRecommendationJobLockStore`), KMA 날씨 API 연동 등 백엔드의 중추적인 서비스 레이어를 직접 설계하고 구현했습니다.
- **AI 파트 / 프론트엔드 파트 팀원**:
  - AI 서버(`fastapi`)는 이미지 젠(OpenAI/Gemini), 스타일링 프롬프트(`adjust_preview_service`), 필터링 모듈이 주를 이루며 지속적으로 고도화되었습니다.
  - 프론트엔드는 React Native 컴포넌트 분리 및 네비게이션 플로우 최적화에 집중했습니다.

### 🤖 [Agent 4] Retrospective (회고 - 배운 점 및 아쉬운 점)
- **배운 점 (Learned)**: SQS `ReceiveMessageRequest` 루프를 스프링 부트 생명주기에 안전하게 녹여내기 위해 `@Scheduled` 대신 `SmartLifecycle`을 도입한 경험은 Graceful Shutdown의 중요성을 깨닫게 했습니다. 또한 캐시 저장 시 `@class` 메타데이터 직렬화 누락으로 인한 런타임 캐스팅 에러를 겪으며, **Redis와 같은 외부 인메모리 저장소는 단순 도입보다 직렬화/역직렬화 설계가 훨씬 중요하다는 점**을 체득했습니다.
- **아쉬운 점 (Regrets)**: `RESULTS.md`의 부하 테스트 문서에서 기준치(RUN #1)는 상세히 기록했으나 튜닝 후 결과(RUN #2) 작성을 완료하지 못했습니다. 프로덕션 환경의 `application.yml`에 HikariCP pool size(9→20)를 반영하는 것을 잊은 채 프로젝트가 마감된 점이 가장 아쉽습니다.

### 🤖 [Agent 5] Quantitative (수치 분석)
- **부하 테스트 지표 (베이스라인)**: 1,000명의 Virtual Users(VUs) 동시 접속 테스트(`02_wardrobe_flow.js`) 시 **92.52 Req/s**, 실패율 0.00%를 달성했습니다. 다만 DB 커넥션 큐 대기로 인해 최대 지연 7.37s, p(95) 1.97s를 기록하며 HikariCP 튜닝의 정량적 근거를 확보했습니다.
- **가상 스레드 최적화 코드 적용**: `newSingleThreadExecutor`, `newCachedThreadPool`로 작성되었던 쓰레드 풀 2곳을 모두 `newVirtualThreadPerTaskExecutor`로 교체하여 I/O 블로킹 효율을 이론치에 가깝게 끌어올렸습니다.
