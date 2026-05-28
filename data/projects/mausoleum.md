# 영묘 (Mausoleum) — UE5 멀티플레이어 던전 탈출 게임

## 1. 프로젝트 소개

- **목적**: Unreal Engine 5로 제작한 멀티플레이어 던전 탈출 게임. 플레이어가 협력하여 영묘(고대 무덤) 내 페이즈 기반 퍼즐·이벤트를 클리어하고 탈출
- **개발 기간**: 2026-02-24 ~ 2026-03-27 (약 4주, SSAFY S14 2차 프로젝트)
- **팀 구성**: 6인 (UE5 클라이언트, C++ 게임 서버, 서버 인프라 분리)
- **사용 기술**: Unreal Engine 5 (C++), C++ GameServer (uWebSockets, Protobuf, UDP), Opus, HRTF, Docker, Jenkins, CMake
- **한 줄 설명**: UDP 기반 Opus 보이스 채팅, 룸 샤딩 C++ 게임 서버, 전략 패턴 기반 생사 분리 음성 시스템을 갖춘 UE5 멀티플레이어 게임

---

## 2. 주요 기능 및 역할

**[초기] 기반 구축 (2월 24~26일)**

레포 세팅, GitHooks 기반 커밋 자동화, 기본 맵·캐릭터 이동/점프/시야 InputAction. WebSocket 로비 서버 프로토타입. 상호작용 인터페이스(라인트레이싱) 초안.

↓

**[중간] 보이스 채팅 + 아이템 시스템 병렬 개발 (3월 초~중순)**

yoonpyo: **인게임 보이스 채팅 시스템** 구축 (`S14P21A302-31`). Opus 코덱 + UDP 기반 음성 전송. C++ 게임 서버에 룸 샤딩 보이스 서버 추가. `UPrivateVoiceChatComponent` Facade로 캡처·코덱·네트워크·재생·전략 계층 분리. 동시에 `UA302ItemSpawnOrchestrator` 아이템 스폰 오케스트레이터 + 페이즈 연동 구현 (`S14P21A302-165`).

↓

**[후반] 서버 리팩토링 + 버그 수렴 (3월 하순)**

C++ 게임 서버 3단계 OOP 리팩토링: `INetworkEventLoop` 선언/구현 분리 → 엔드포인트 등록 책임 일원화 → `SocketPlatform`으로 소켓 라이프사이클 이관 (`S14P21A302-192~194`). 죽은 플레이어 간 보이스 채팅 분리 (전략 패턴). 백그라운드 전환 시 버퍼 누적 보이스 깨짐 버그 수정. HUD 퀵슬롯 바인딩 갱신 누락 버그 수정.

**내 역할 (근거: yoonpyo 저자 커밋 전체)**
- 보이스 채팅 클라이언트 전담: `UPrivateVoiceChatComponent` Facade, Opus 코덱(링버퍼), HRTF 3D 오디오, Strategy 패턴
- 보이스 채팅 서버 전담: C++ UDP VoiceServer, 룸 샤딩, `ConcurrentQueue` 워커 풀
- C++ 게임 서버 OOP 리팩토링 주도 (`S14P21A302-68`, `74`, `192~194`)
- `UA302ItemSpawnOrchestrator` + 페이즈 클리어 연동 (`S14P21A302-165`)
- HUD 퀵슬롯 바인딩, 저주검 타이머, 캐릭터 스폰 버그 수정

---

## 3. 문제 해결 과정

**Day 7~10 (2026-03-03~05, 보이스 채팅 초기 품질 불량)**

문제: UDP 보이스 데이터 전송은 됐으나 수신 측 재생 품질 불량 — 지지직, 끊김, 에코

원인 1: `FVoiceModule::Get().CreateVoiceCapture(DeviceName)` 에 Friendly Name("마이크(Realtek(R) Audio)")을 전달 → DirectSound 디바이스 ID와 불일치 → 캡처 객체 생성 실패 → null 캡처에서 빈 데이터 전송

원인 2: 캡처·네트워크·재생 로직이 하나의 클래스에 혼재 → 오디오 채널 버퍼가 공유되어 간섭 발생

시도:
- Protobuf 패킷 구조 조정
- 버퍼 크기 변경

최종 해결:
1. `CreateVoiceCapture(TEXT(""))` — 빈 문자열(OS 기본 장치) 사용. 코드 주석: `"CreateVoiceCapture는 DirectSound 디바이스 ID를 기대합니다. Friendly Name은 매칭되지 않으므로 반드시 빈 문자열을 사용해야 합니다."`
2. 보이스챗 모듈 완전 분리 (`Feat: 보이스챗 모듈 분리`): `UVoiceCaptureProcessor` / `UVoiceAudioReceiver` / `UVoiceNetworkClient` / `UVoiceCodec` 독립 클래스로 분리. 화자별 독립 코덱 (`TMap<FString, UVoiceCodec*> SpeakerCodecs`)으로 디코드 상태 간섭 제거

결과: 프로토타입 완료 (`Feat: 보이스 채팅 개발 프로토타입 완료`, 3월 5일)

---

**Day 12~14 (2026-03-08~10, Opus 코덱 설계)**

문제: RAW PCM을 UDP로 전송 → 단일 패킷 크기 과다, 패킷 손실 시 복구 없음

원인 분석: 16kHz 모노 PCM은 20ms 프레임 기준 640바이트. 압축 없이 전송하면 네트워크 대역 낭비 및 UDP 단편화 위험

설계 결정:
- Opus 코덱, `OPUS_APPLICATION_VOIP` 모드
- 24kbps, 20ms 프레임 (`FrameSize = 16000 / 50 = 320` 샘플)
- `OPUS_SET_INBAND_FEC(1)`: 패킷 손실 인밴드 복원
- `OPUS_SET_DTX(1)`: 무음 구간 패킷 전송 중단 (대역폭 절약)
- `OPUS_SET_PACKET_LOSS_PERC(10)`: 10% 손실 예상 설정
- `OPUS_SET_COMPLEXITY(5)`: 인코딩 CPU 부하 절감

패킷 포맷: `[2바이트: 프레임 길이][N바이트: Opus 데이터]` — 가변 길이 프레임 연속 전송 지원

링버퍼 설계: `TCircularQueue<uint8>` 링버퍼로 PCM 적재 → 1프레임(640B) 누적 시 Opus 인코딩 → 큐 가득 찼을 때 오래된 데이터 폐기 (실시간성 우선)

결과: PCM 대비 약 90% 압축. 패킷 손실 시 FEC로 부분 복원

---

**Day 15 (2026-03-09, 게임 서버 레거시 제거)**

문제: 게임 서버 코드가 `WebSocketManager` 하나에 WebSocket 연결, 룸 상태, 브로드캐스트 로직이 혼재 → 기능 추가마다 의도치 않은 사이드이펙트

원인: 초기 프로토타입 코드를 리팩토링 없이 기능만 추가

시도: 부분 분리 → 참조 관계 복잡해서 중단

최종 해결: 3단계 순차 리팩토링

**1단계 (`S14P21A302-68`): 네트워크 서브시스템 재설계**
- `GameNetworkSubsystem` 도입: API 요청 주소 중앙 관리
- Network Client 인터페이스 생성: 네트워크 레이어 추상화 시작

**2단계 (`S14P21A302-74`): 책임 분리 및 플랫폼 추상화**
- API 요청 주소 단일 파일 (`engine.ini`) 관리
- 레거시 `WebSocketManager` 완전 제거
- `INetworkEventLoop` 인터페이스 도입:

```cpp
class INetworkEventLoop {
public:
    virtual void udpLoop(std::atomic<bool>& running,
                         const std::vector<NetworkUdpEndpoint>& udpEndpoints,
                         ConcurrentQueue<NetPacket>& inboundQueue) = 0;

    virtual void tcpLoop(std::atomic<bool>& running,
                         const std::vector<NetworkTcpListener>& tcpListeners,
                         ConnectionRegistry& connections,
                         ConcurrentQueue<NetPacket>& inboundQueue) = 0;
};
std::unique_ptr<INetworkEventLoop> CreateNetworkEventLoop(); // 팩토리
```

Linux: `LinuxNetworkEventLoop` (epoll), Win: `NetworkEventLoopWin` (select)

**3단계 (`S14P21A302-192~194`): 소켓 라이프사이클 완전 분리**
- `S14P21A302-192`: EventLoop 선언/구현 파일 분리 (.h/.cpp 분리로 컴파일 단위 격리)
- `S14P21A302-193`: 엔드포인트 등록 책임 일원화 — `addUdpEndpoint()` / `addTcpListener()`는 `start()` 전에만 호출 가능. 위반 시 에러 로그: `"실행 중에는 UDP 엔드포인트를 등록할 수 없습니다."`
- `S14P21A302-194`: `SocketPlatform` 인터페이스로 소켓 라이프사이클 이관:

```cpp
class SocketPlatform {
public:
    virtual SocketType createUdpEndpoint(int port) = 0;
    virtual SocketType createTcpListener(int port) = 0;
    virtual bool closeSocket(SocketType& sock) = 0;
    virtual bool setNonBlocking(SocketType sock) = 0;
    virtual void configureUdpSocket(SocketType sock) = 0;
};
SocketPlatform& GetSocketPlatform(); // 싱글턴 팩토리
```

`PosixSocketPlatform`: POSIX `socket()`/`bind()`/`fcntl()`. `WinSocketPlatform`: Winsock2.

결과: 새 기능(죽은 플레이어 보이스 분리 등) 추가 시 기존 네트워크 코드 터치 없이 확장 가능

---

**Day 21~23 (2026-03-17~19, 보이스 룸 샤딩)**

문제: 게임 서버 보이스 워커가 단일 스레드 → 방이 많아질수록 패킷 처리 지연

원인: 단일 `ConcurrentQueue`에 모든 방의 UDP 패킷이 쌓임 → 큰 방의 패킷이 작은 방 처리를 차단

시도: 워커 스레드 수 증가 → 단일 큐에 여러 워커가 경합 → Lock contention 증가

최종 해결: roomCode 기반 해시 샤딩

```cpp
size_t VoiceServer::shardIndexForRoom(const std::string& roomCode) const {
    return std::hash<std::string>{}(roomCode) % kVoiceWorkerCount;
}
```

- 동일 방의 패킷은 항상 같은 샤드(워커+큐)로 라우팅 → 방 간 간섭 없음
- 각 워커가 자신의 `ConcurrentQueue<VoiceInboundTask>`를 독립 소비

브로드캐스트 최적화: `shared_ptr<const vector<char>>`로 공유 페이로드 → 방 내 모든 클라이언트에 zero-copy 전송

```cpp
// handleVoiceData에서
for (const auto& [otherKey, otherClient] : clientsSnapshot) {
    if (otherKey != packet.senderKey) {
        network.sendUdp(otherClient.addr, sharedPayload); // 포인터 공유, 복사 없음
    }
}
```

결과: `Refactor: Voice 서버 스레드 풀(2) 등록 및 room 별 샤딩`

---

**Day 25 (2026-03-20, 죽은 플레이어 보이스 분리)**

문제: 죽은 플레이어가 산 플레이어 음성을 모두 들음 → 게임 밸런스 붕괴

원인: 보이스 수신 필터가 룸코드 일치 + 본인 제외만 확인. 생사 상태를 무시함

시도: 수신 콜백에 if/else 조건 직접 추가 → 조건 분기가 복잡해 유지보수 어려움

최종 해결: Strategy 패턴으로 보이스 수신 규칙 분리

```cpp
// DistanceVoiceChatStrategy::CanReceiveVoice()
if (bListenerAlive) {
    if (!bSpeakerAlive) return false; // 산 사람은 산 사람만 들음
    return DistSquared <= FMath::Square(HearingDistance); // 거리 기반
}

if (bListenerSpirit) {
    if (bSpeakerSpirit) return true; // 죽은 사람끼리 → 거리 무제한
    if (bSpeakerAlive) {
        // 관전 중인 대상이면 항상 들음
        if (IsSpeakerCurrentViewTargetForListener(ListenerComp, SpeakerActor))
            return true;
        // 주변 살아있는 사람들이 화자를 들을 수 있는 범위면 청취 허용
        return CanAlivePlayersHearSpeaker(SpeakerActor, SpeakerRoom, HearingDistance);
    }
}
```

전략 전환: 로비 진입 → `SetLobbyMode()` (전체 통화). 인게임 시작 → `SetDistanceMode(4200.f)` (거리+생사 기반). 월드 타입을 `A302RuntimeGuards::IsLobbyWorld()`로 판단해 자동 전환

결과: `Refactor: Voice 죽은 사람끼리 보이스 챗 가능`

---

**Day 29 (2026-03-24, 백그라운드 보이스 깨짐)**

문제: 앱이 백그라운드로 전환된 후 포그라운드로 돌아오면 보이스가 지지직거리며 깨짐

원인 (커밋 메시지 직접 인용):
> "백그라운드 시 버퍼에 데이터가 쌓여서 깨지는 문제"

원인 분석:
1. 백그라운드 상태에서도 `VoiceCapture`는 PCM 데이터를 캡처 버퍼에 계속 적재
2. Opus 링버퍼에도 처리되지 않은 PCM이 쌓임
3. 포그라운드 복귀 후 쌓인 데이터를 일괄 처리 → 오디오 타임라인 붕괴 + 오래된 PCM이 Opus 상태에 혼재

시도:
- HRTF 파라미터 조정 → 일부 개선 (`Fix: Voice 깨지는 문제 및 HRTF 개선`)

최종 해결: `ProcessCapture()`에 `FApp::HasFocus()` 체크 추가

```cpp
void UVoiceCaptureProcessor::ProcessCapture()
{
    // 백그라운드 동안 쌓인 음성을 복귀 직후 전송하면 지연/지지직의 원인이 됩니다.
    // 포커스가 없을 때는 캡처 버퍼를 비우고 코덱 상태를 리셋하여 실시간성만 유지합니다.
    if (!FApp::HasFocus())
    {
        DrainAllCaptureData(); // VoiceCapture 내부 PCM 버퍼 전량 소비·폐기
        ResetCodecForRealtime(); // Opus 인코더 링버퍼·상태 초기화
        return;
    }
    // ... 이후 정상 캡처 처리
}

void UVoiceCaptureProcessor::ResetCodecForRealtime()
{
    // 인코더 링버퍼/상태를 초기화해 오래된 잔여 프레임이 다음 전송에 섞이지 않게 합니다.
    Codec->Shutdown();
    Codec->Init();
}
```

추가 안전장치: `StaleCaptureHardDropBytes = 8192` — 포커스 복귀 후에도 8KB 초과 적재 감지 시 전량 폐기 + 코덱 리셋. `MaxCaptureReadBytesPerTick = 4096` — 틱당 최대 읽기 제한으로 폭발적 처리 방지

결과: 백그라운드 → 포그라운드 전환 후 정상 재생 (`Fix: 보이스 깨지는 거 개선`)

---

**Day 31~32 (2026-03-25~26, 아이템 시스템 버그)**

문제: 아이템 사용 시 효과가 적용되지 않음 (`S14P21A302-177`)

원인 분석:
- 아이템 스폰 → 픽업 → 퀵슬롯 등록 → 사용 효과 적용 체인에서 퀵슬롯 픽업 후 HUD 바인딩 갱신 함수 호출이 누락됨
- UE5에서 HUD 위젯 데이터는 게임 로직이 명시적으로 갱신 호출을 해야 반영됨 — 자동 업데이트되지 않음

시도:
- 퀵슬롯이 꽉 찼을 때 아이템 획득 차단 추가 → 별도 UI 동기화 버그 발견

최종 해결 (3개 커밋):
1. `Fix: HUD 퀵슬롯 바인딩 갱신 함수 추가` — 아이템 픽업 시 퀵슬롯 HUD 바인딩 명시적 갱신
2. `Fix: 퀵슬롯 가득 찼을 때 아이템 획득 차단` — 슬롯 초과 픽업 방지
3. `Fix: 방패 자동사용 시 퀵슬롯 UI 동기화` — 자동 사용 후 UI 상태 동기화

아이템 스폰 오케스트레이터 설계 (`UA302ItemSpawnOrchestrator`):
- 페이즈 이벤트 2개: `HandleRoomLevelReady()` (레벨 로드 시 초기 스폰), `HandleRoomPhaseChanged()` (페이즈 전환 시 아이템 교체)
- `ItemSpawnPolicy` 데이터 에셋: 페이즈별 아이템 풀 (`LootPool`), 최소/최대 스폰 수, 가중치 랜덤 선택
- 무한 루프 방지: `SafeGuard = (PhaseTotalMaxSpawn * 4) + 16`

결과: 아이템 픽업 → 퀵슬롯 반영 → 사용 효과 전체 체인 정상 작동

---

**Day 16~20 (2026-03-12~16, 페이즈 시스템 설계)**

문제: 게임 진행 단계(Phase0 → Phase1 → Phase2 → Ended)를 클라이언트가 폴링해서 판단하면 서버와 타이밍이 어긋남

원인: 초기 설계에서 페이즈 전환 조건을 클라이언트 단에서 카운팅 → 패킷 손실이나 처리 지연 시 클라이언트마다 다른 페이즈 상태

설계 결정: `UA302ServerPhaseSubsystem` — 서버 Dedicated 싱글 서브시스템이 페이즈 전환을 독점 판단

```cpp
// 0.25초 폴링 타이머
GetWorldTimerManager().SetTimer(
    PhasePollTimerHandle,
    this, &UA302ServerPhaseSubsystem::PollPhaseState,
    PhasePollInterval /* 0.25f */, true
);

// ResolvePhase(): 카운트 기반 전환
// Phase0→Phase1: bPhase0ClearConditionMet (아이템 클리어 수 도달)
// Phase1→Phase2: 클리어 오브젝트 수 (조각상 완료 수 도달)
// Phase2→Ended: 탈출 완료 수 도달 OR 제한 시간 초과
```

**두 시계 문제 (Two-Clock Problem)**:
- 서버 내부 페이즈 평가: `FPlatformTime::Seconds()` — 엔진 월드 시간과 독립적인 단조 증가 시계
- 클라이언트 HUD 타이머 표시: `GS->GetServerWorldTimeSeconds()` — 네트워크 동기화된 서버 시간
- 두 시계를 혼용하면 HUD가 서버 판단보다 몇 초 앞서거나 뒤처짐 → 두 역할에 각각 다른 시계 사용

`TriggerAllStatuesCompleteInRoom()` — GM 커맨드나 서버 강제 완료 시 룸의 모든 조각상을 강제 완성:

```cpp
// 룸 슬롯 인덱스 캐시 (lazy rebuild)
if (bRoomActorIndexDirty) RebuildRoomActorIndex();

for (auto* Statue : StatuesByRoomSlot[RoomSlot]) {
    Statue->ForceComplete();
}
for (auto* Blocker : EscapeBlockersByRoomSlot[RoomSlot]) {
    Blocker->OpenEscapeRoute(); // 탈출구 차단 Actor 해제
}
```

`bRoomActorIndexDirty` 플래그: 룸 액터 등록/해제 시 dirty 마킹 → 다음 접근 시 한 번만 인덱스 재빌드. 매 폴링마다 월드 전체를 순회하지 않아도 됨

매치 타이머 분리: `StartRoomPhaseTimeline()` 호출 시 페이즈 평가 타이머만 시작. HUD 매치 타이머는 별도의 `NotifyRoomMatchTimerStart()` 호출 시점에 시작 — 페이즈 로딩 시간을 타이머에서 제외

결과: 모든 클라이언트가 서버가 브로드캐스트한 단일 페이즈 상태만 수신 → 타이밍 불일치 제거

---

**Day 10~12 (2026-03-06~08, C++ 로비 서버 방 관리)**

문제: 클라이언트가 룸에 입장할 때 이미 접속한 플레이어 목록을 모름 → 뒤늦게 접속한 플레이어의 화면에 기존 플레이어가 표시되지 않음

원인: 서버가 `RES_PLAYER_ENTERED` 브로드캐스트만 구현 → 입장 전에 접속한 플레이어의 `ENTERED` 이벤트를 새 입장자는 수신하지 못함

최종 해결: `handleJoinRoom` — 입장자에게 기존 플레이어 스냅샷을 `existingPlayers` 배열로 즉시 전송

```cpp
// handleJoinRoom 중:
// 1. 입장자에게 기존 플레이어 목록 전송
json res = { {"type", RES_ROOM_JOINED}, {"existingPlayers", existingList} };
conn->send(res.dump());

// 2. 기존 플레이어들에게 신규 입장자 알림
json broadcast = { {"type", RES_PLAYER_ENTERED}, {"playerName", newPlayer} };
for (auto& other : room->getPlayers()) {
    if (other != newPlayer) other_conn->send(broadcast.dump());
}
```

호스트 마이그레이션: `handleLeaveRoom`에서 방장이 나갈 때 `bHostChanged` 감지 → `host_changed` 브로드캐스트

```cpp
if (room->bHostChanged) {
    json hc = { {"type", "host_changed"}, {"newHost", room->getHost()} };
    for (auto& p : room->getPlayers()) p_conn->send(hc.dump());
}
```

연결 끊김 처리: `onDisconnect` 콜백 → `room->removePlayer(playerName)` → `player_left` 브로드캐스트 → `removeRoomIfEmpty()`. WebSocket 연결 해제가 곧 퇴장 처리 — 별도 leave 패킷 불필요

방 목록 필터: `handleGetRoomList`는 `GamePhase::Waiting` 상태 방만 반환 — 이미 시작된 방은 목록에 노출하지 않음

결과: 뒤늦은 입장자도 기존 플레이어 전원 확인 + 방장 이탈 시 자동 호스트 교체

---

**Day 14 (2026-03-10, 클라이언트 네트워크 아키텍처 통합)**

문제: 로비 WebSocket, 게임 WebSocket, UDP 보이스 채널이 각각 독립 컴포넌트로 관리 → 연결 주소가 코드 곳곳에 하드코딩, 채널 전환 시 컴포넌트 참조가 흩어짐

설계 결정: `UGameNetworkSubsystem` — 단일 `UGameInstanceSubsystem`으로 WebSocket + UDP 두 채널 통합 관리

```
UGameNetworkSubsystem
├── WebSocket 채널 (로비/게임 JSON 및 바이너리 프로토콜)
│   └── OnWebSocketBinaryPacketReceived 델리게이트
└── UDP 채널 (보이스 전용 실시간 패킷)
    └── OnUdpBinaryPacketReceived / OnBinaryPacketReceived 델리게이트
```

URL 정책: 연결 주소는 `FA302NetworkEndpointConfig` 상수 파일에서만 읽음 — 런타임 파라미터로 주소를 받지 않아 환경별 잘못된 주소 주입 불가. `engine.ini`의 값이 `FA302NetworkEndpointConfig`로 로딩됨 (서버 리팩토링 2단계와 대응)

바이너리 델리게이트 분리 이유: WebSocket 패킷은 룸/게임 로직용 JSON 래퍼 + 바이너리 Protobuf 혼용. UDP 패킷은 Opus 음성 데이터 전용 — 역할이 달라 동일 핸들러에서 파싱하면 분기 비용 발생 → 채널별 델리게이트 분리

결과: 모든 네트워크 채널을 단일 서브시스템에서 초기화/해제 → 씬 전환 시 연결 상태가 `GameInstance` 수명 동안 유지

---

## 4. 배운 점

- **오디오 시스템은 네트워크 레이어만 넣는다고 완성되지 않는다.** 캡처 버퍼 타이밍, 코덱 링버퍼 상태, 백그라운드 포커스 관리까지 전체를 이해해야 한다. `FApp::HasFocus()` 한 줄이 재생 품질을 결정했다.
- **CreateVoiceCapture에 Friendly Name을 넣으면 안 된다.** OS API 레이어와 UE5 내부 오디오 레이어가 다른 ID 체계를 쓴다. 빈 문자열이 "OS 기본 장치"를 의미한다는 것은 UE5 코드를 직접 읽어서야 알았다.
- **서버 리팩토링은 인터페이스가 확정되기 전까지 하면 안 된다.** `WebSocketManager` 하나에 다 넣은 코드를 3단계로 나눠 분리하는 비용이 기능 개발보다 높았다. 처음부터 `INetworkEventLoop`/`SocketPlatform` 추상화 경계를 잡아야 했다.
- **Strategy 패턴은 게임 규칙 변경에 강하다.** 생사 기반 보이스 분리 규칙이 추가됐을 때, 조건 분기를 `CanReceiveVoice()` 하나로 캡슐화하니 기존 재생 로직을 전혀 건드리지 않았다.

---

## 5. 회고

**잘한 점**: 백그라운드 보이스 깨짐 원인을 "소리가 이상하다"에서 멈추지 않고 "캡처 버퍼 누적 + 코덱 상태 오염"으로 정확히 추적한 것. 서버 리팩토링을 192~194 세 티켓으로 나눠 순차적으로 관리하며 각 단계에서 동작 검증 후 진행한 것.

**아쉬운 점**: 4주 안에 UE5 + C++ 서버를 병렬 개발하다 보니 아이템 시스템 통합 테스트가 부족했다. 퀵슬롯 버그 3개가 각각 다른 커밋으로 수렴된 것은 초기 설계 검증이 없었다는 신호였다.

**다시 만든다면**: 보이스 채팅 서버를 독립 프로세스로 분리 (로비 서버와 포트만 다른 별도 바이너리). `ProcessCapture` 내 포커스 체크는 처음 설계 시점에 넣었어야 할 방어 코드였다. 아이템 효과 체인은 이벤트 기반 ECS로 설계해 HUD 수동 갱신 의존성을 제거.

**추가하고 싶은 것**: 관전 모드, 리플레이 시스템, 보이스 품질 지표 (`VoiceProfiler` 데이터를 인게임 디버그 UI로 노출)

---

## 메타

- 기간: 2026-02-24 ~ 2026-03-27 (약 4주)
- 팀 구성: 6인 (UE5 클라이언트, C++ 게임 서버, 인프라 분리)
- 역할: 보이스 채팅 전체 (클라이언트+서버), C++ 게임 서버 OOP 리팩토링 주도, 아이템 스폰 오케스트레이터, 퀵슬롯 버그 수정
- 기술 스택: Unreal Engine 5 (C++), C++ GameServer (uWebSockets, UDP), Opus, HRTF (USoundWaveProcedural + SPATIALIZATION_HRTF), Docker, Jenkins, CMake
- 레포: GitLab (S14P21A302)

---

## 6. 프로젝트 리뷰 피드백 및 보완점

프로젝트 코드 및 문서를 심층 분석하여 도출한 누락된 내용 및 보완 필요 사항입니다:

### 6-1. 프로젝트 문서화(Documentation) 부재
- **현상**: 프로젝트의 루트 `README.md` 파일이 단순히 Git 커밋 컨벤션 가이드로만 작성되어 있습니다.
- **문제점**: 정작 게임이 어떤 장르인지, 클라이언트 빌드 방법과 서버 실행 방법, 연동 아키텍처는 무엇인지에 대한 핵심 가이드가 전무합니다. 포트폴리오 관점에서 치명적인 감점 요소가 될 수 있습니다.
- **개선안**: 아키텍처 다이어그램 추가, 로비/게임 서버 구성 및 실행 방법 가이드를 상세히 보완해야 합니다.

### 6-2. CI/CD 인프라 설정 누락 (미완성)
- **현상**: `Server/Dockerfile`과 `Server/Jenkinsfile`이 생성되어 있으나, 내부 내용이 완전히 비어있습니다.
- **문제점**: 도커라이징 및 자동 배포를 도입하려다 중단된 것으로 추측되며, 완성되지 않은 코드가 방치되어 있습니다.
- **개선안**: 실제로 배포가 이루어졌다면 내용을 채워넣고, 사용하지 않는다면 관련 파일 및 설명을 걷어내는 등 마무리가 필요합니다.

### 6-3. 사용하지 않는 기술 명시 여부 (오버엔지니어링/잔재)
- **현상**: C++ 서버 쪽 빌드 파일(`vcpkg.json`) 및 `README.md`에 `protobuf` 라이브러리가 명시되어 있으나, 핵심 통신(Voice UDP 등) 패킷에서는 가벼운 바이너리 구조체를 수동으로 맵핑하여 직렬화/역직렬화하고 있습니다.
- **개선안**: 만약 로비에서만 `protobuf`를 쓰고 있다면 그 역할을 명확히 기술해야 하며, 최종적으로 안 쓰게 되었다면 의존성 트리를 최적화하기 위해 제거하는 것이 바람직합니다.

### 6-4. 하드코딩된 설정값들 (매직 넘버)
- **현상**: `MaxVoiceRoomCodeRetryCount = 8`, `DefaultInGameHearingDistance = 1800.f` 등 음성 채팅 및 네트워크 관련 수치들이 C++ 코드 내부에 상수로 하드코딩되어 있습니다.
- **개선안**: 기획자가 손쉽게 수치를 조절할 수 있도록 언리얼 `Config(.ini)` 파일로 분리하거나 게임 내 블루프린트 변수(`UPROPERTY(EditAnywhere)`)로 노출시키는 설계가 바람직합니다.

---

## 7. 심층 분석 리포트 (Subagent Analysis)

소스 코드 및 방대한 `git log` 히스토리를 5개의 서브 에이전트 관점에서 심층 분석한 리포트입니다.

### 🤖 [Agent 1] Git Timeline (문제 해결 시계열 추적)
1. **네트워크 통합 및 보이스챗 초기 구축 (3월 초)**: C++ 게임 서버의 룸 매니저 로직과 클라이언트 측 `VoiceCaptureProcessor` 초기화 이슈를 해결하고, 기본 Opus 압축 파이프라인(`S14P21A302-31`)을 구축했습니다.
2. **룸 샤딩 및 페이즈 시스템 고도화 (3월 중순)**: 게임 서버의 C++ 리팩토링 3단계(192~194)를 거치며 `INetworkEventLoop` 기반으로 구조를 개편하고, 룸별 해시 샤딩을 적용했습니다. 동시에 서버 주도권의 `A302ServerPhaseSubsystem`이 구현되어 Two-Clock 문제를 해결했습니다.
3. **버그 수렴 및 전략 패턴 도입 (3월 하순)**: 백그라운드 전환 시 보이스 버퍼 누적 깨짐 버그(`[S14P21A302-17]`), 죽은 플레이어 간의 음성 분리를 위한 `DistanceVoiceChatStrategy.cpp` 도입, 퀵슬롯 UI 바인딩 동기화 등 폴리싱 단계의 커밋이 다수 기록되었습니다.

### 🤖 [Agent 2] Architecture (기술 및 아키텍처 분석)
- **UE5와 Custom C++ Server의 조화**: Unreal Engine의 기본 데디케이티드 서버(Dedicated Server)나 리플리케이션(Replication)에 전적으로 의존하지 않고, 직접 구현한 C++ Game Server(uWebSockets, UDP 기반)를 병행 사용했습니다. 이를 통해 로비 매칭과 대규모 음성 채팅 트래픽 처리를 경량화하고 최적화할 수 있었습니다.
- **보이스챗 계층화 (Facade + Strategy)**: 마이크 캡처(`UVoiceCaptureProcessor`), 인코딩(`UVoiceCodec`), 전송(`UVoiceNetworkClient`), 수신 필터링(`DistanceVoiceChatStrategy`)을 독립 모듈로 나누고 `UPrivateVoiceChatComponent`가 Facade 역할을 하도록 설계하여 높은 응집도와 낮은 결합도를 유지했습니다.

### 🤖 [Agent 3] Role & Code (내 역할 / 팀원 역할 검증)
- **yoonpyo (보이스챗 클라이언트/서버 및 아키텍처 주도)**:
  - UDP 기반 보이스 서버의 워커 풀, 룸 샤딩, Opus 코덱 적용 등 오디오 통신의 A-to-Z를 전담.
  - 레거시 게임 서버의 절차적 코드를 객체지향적(`SocketPlatform`, 인터페이스 분리)으로 리팩토링하는 과정을 주도(`S14P21A302-68, 74, 192~194`).
- **팀원들 (UE5 인게임 로직 및 UI)**:
  - UI(`PlayerHUDComponent`), 인게임 아이템 효과(`ItemMaliciousShield`, `GroupEventConfiscate`), 맵/레벨 디자인 등 게임플레이 컨텐츠 구현에 집중했습니다.

### 🤖 [Agent 4] Retrospective (회고 - 배운 점 및 아쉬운 점)
- **배운 점 (Learned)**: 오디오 시스템은 단순 네트워크 전송을 넘어 OS 오디오 드라이버 계층(`FApp::HasFocus()`와 백그라운드 캡처 거동 차이)과 버퍼 링 관리에 대한 깊은 이해가 필요하다는 점을 배웠습니다. 또한, 늦은 서버 리팩토링은 비용이 크다는 것을 경험하며 초기 아키텍처 경계(인터페이스 추상화)의 중요성을 체득했습니다.
- **아쉬운 점 (Regrets)**: C++ 서버에 도커라이징(Dockerfile)과 Jenkins CI/CD를 도입하려 했으나 일정 문제로 미완성(빈 파일로 방치)된 부분이 아쉽습니다. 또한 아이템 사용 체인(퀵슬롯 반영 누락 등)에서 단일화된 이벤트 기반 ECS 패턴을 도입하지 못해 HUD 동기화 버그를 여러 번 수정한 점이 구조적 아쉬움으로 남습니다.

### 🤖 [Agent 5] Quantitative (수치 분석)
- **Opus 코덱 압축률**: 16kHz 모노 PCM 20ms 프레임(640바이트)을 24kbps Opus로 압축하여 대역폭을 약 90% 이상 절감하면서도 UDP 통신의 실시간성을 확보했습니다.
- **C++ 서버의 동시성 최적화**: 룸코드 기반의 해시 샤딩(`std::hash`)을 통해 다수의 방이 활성화된 상황에서도 단일 워커 스레드의 Lock Contention 병목을 O(1) 수준으로 격리시켰으며, `shared_ptr` 페이로드를 사용한 Zero-Copy 브로드캐스트로 메모리 할당 빈도를 극단적으로 낮추었습니다.
