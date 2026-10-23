# 영묘 (Mausoleum)

## 개요

언리얼 엔진 5 협동 게임에 C++ UDP 음성 서버를 연결해 같은 방에 있는 참가자끼리 음성으로 대화할 수 있게 한 팀 프로젝트입니다.

## 설계 선택

게임 진행은 언리얼 전용 서버가 맡고, 별도 음성 서버는 같은 방의 참가자에게 UDP 음성을 전달합니다.

같은 방의 패킷은 도착한 순서대로 처리하고, 방마다 담당 작업 대기열을 정했습니다. 방 식별 코드의 해시값으로 대기열을 골라 서로 다른 방의 음성 처리를 나눴습니다. 방마다 작업을 나누는 구조지만 공개 자료에 성능 비교 측정이 없어 처리량이 얼마나 늘었는지는 제시하지 않습니다.

## 구현

서버는 패킷 형식과 세션 권한을 확인한 뒤 방 식별 코드에 따라 작업 대기열로 보냅니다. 다음은 공개 `VoiceServer.cpp`에서 방별 대기열을 고르는 코드입니다.

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

마이크 입력, 화자별 Opus 인코더, UDP 송수신과 클라이언트 재생을 연결했습니다. 앱을 백그라운드로 전환하는 동안 오래된 음성 자료가 쌓여 복귀 후 늦게 재생되는 일을 막기 위해, 화면이 비활성화될 때 입력 대기열과 인코더 상태를 비우도록 했습니다.

## 문제 해결 과정

게임 창을 다른 창 뒤로 보냈다가 돌아오면 쌓여 있던 음성이 한꺼번에 처리돼 늦게 재생되거나 소리가 깨졌습니다. 오래된 음성을 모두 재생하는 대신 다른 창으로 전환할 때 입력 대기열과 인코더 상태를 비워, 돌아온 뒤 들어온 음성부터 처리했습니다.

## 검증 범위와 한계

- 16kHz 샘플링, 20ms 프레임, 24kbps는 인코더 설정값이며 측정된 지연·품질 결과가 아닙니다.
- 방별 큐 분배와 공유 페이로드의 효과를 재현하는 벤치마크는 공개 자료에 없습니다.
- 문서에 UDP 음성 패킷 직렬화 방식 기록이 일치하지 않아, 모든 음성 패킷이 Protocol Buffers를 사용한다고 단정하지 않습니다.
- 공개 기록에서 팀 규모는 6인으로 기재되어 있습니다. 성능 수치나 운영 규모는 별도 검증하지 않았습니다.

## 공개 출처

- [Mausoleum 저장소](https://github.com/cgantro/Mausoleum)
- [VoiceServer.cpp](https://github.com/cgantro/Mausoleum/blob/main/Server/GameServer/src/voice/VoiceServer.cpp)
