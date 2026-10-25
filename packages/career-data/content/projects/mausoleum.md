# 영묘 (Mausoleum)

## 개요

언리얼 엔진 5 협동 게임의 음성 기능과 별도 C++ UDP 중계 서버를 구현한 팀 프로젝트입니다. 방 식별 정보를 게임 세션과 음성 서버에 전달하고, 마이크 입력부터 인코딩·전송·재생까지 연결했습니다.

## 설계 선택

게임 진행은 언리얼 전용 서버가 맡고 음성은 별도 C++ 서버가 중계합니다. 룸 코드 해시로 패킷을 워커별 작업 큐에 배정해 같은 룸의 패킷이 같은 큐에서 처리되게 했습니다. 서로 다른 룸은 여러 워커가 나눠 처리하고, 여러 참가자에게 보낼 때는 페이로드를 공유해 복사를 줄였습니다.

## 구현

서버는 패킷 길이와 룸·세션 정보를 확인한 뒤 룸 코드에 따라 작업 큐를 선택합니다.

```cpp
const size_t shard = shardIndexForRoom(roomCode);
if (shard >= voiceInboundQueues_.size()) {
    return;
}

VoiceInboundTask task;
task.packet = std::move(packet);
task.queuedAt = std::chrono::steady_clock::now();
voiceInboundQueues_[shard]->push(std::move(task));
```

마이크 입력은 Opus 인코더로 압축해 UDP로 보내고, 수신 음성은 화자별 디코더 상태로 복원해 재생합니다. 송신 인코더에는 16 kHz 단일 채널, 20 ms 프레임, 24 kbps와 FEC·DTX 설정을 적용했습니다. 수신 코드에서는 FEC 복구 동작을 확인하지 않았으므로 패킷 손실 복구 기능으로 설명하지 않습니다.

## 문제 해결 과정

게임 창이 백그라운드에 있는 동안 마이크 캡처 데이터가 쌓이면 복귀 후 오래된 음성이 늦게 전송될 수 있었습니다. 포커스를 잃은 동안 캡처 버퍼를 비우고 인코더 상태를 초기화해, 복귀 후에는 새로 들어온 음성부터 인코딩하도록 했습니다.
