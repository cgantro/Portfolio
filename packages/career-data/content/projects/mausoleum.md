# 영묘 (Mausoleum)

## 개요

언리얼 엔진 5 협동 게임에 C++ UDP 음성 서버를 연결한 팀 프로젝트입니다. 로비에서 받은 방 식별 정보를 게임 세션과 음성 서버까지 전달하고, 마이크 입력부터 압축·전송·재생까지 이어지게 했습니다.

## 설계 선택

게임 진행은 언리얼 전용 서버가 맡고 음성 처리는 별도 서버에서 담당합니다. 방 식별 코드의 해시로 담당 작업 대기열을 골라 같은 방의 입력 순서를 지키고, 다른 방은 여러 작업 스레드가 나눠 처리하도록 했습니다. 음성을 여러 참가자에게 보낼 때는 같은 페이로드를 함께 사용해 복사를 줄였습니다.

## 구현

서버는 패킷 길이와 세션 권한을 확인한 뒤 방 식별 코드로 작업 대기열을 선택합니다.

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

클라이언트에서는 화자마다 Opus 인코더 상태를 두고 UDP 음성을 주고받아 재생합니다. 인코더는 16 kHz 음성을 20 ms 단위로 나눠 24 kbps로 압축하며, 손실 복구와 무음 구간 전송 감소 설정도 적용했습니다.

## 문제 해결 과정

게임 창을 다른 창 뒤로 보냈다가 돌아오면 대기 중이던 음성이 늦게 재생되거나 깨졌습니다. 오래된 음성을 복귀 뒤 한꺼번에 재생하는 대신, 화면이 비활성화될 때 입력 대기열과 인코더 상태를 초기화했습니다. 복귀 후에는 새로 들어온 음성부터 처리합니다.
