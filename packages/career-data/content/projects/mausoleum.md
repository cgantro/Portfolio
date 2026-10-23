# 영묘 (Mausoleum)

## 개요

언리얼 엔진 5 협동 게임에 C++ UDP 음성 서버를 연결해 방 참가자 간 음성 전달을 구현한 팀 프로젝트입니다.

## 설계 선택

게임 세션은 언리얼 전용 서버가 진행하고, 음성 서버는 방 참가자를 기준으로 UDP 음성을 전달합니다.

한 방의 패킷은 도착 순서를 유지해 처리하고, 서로 다른 방은 여러 작업 흐름에 나누도록 방 코드의 해시값으로 작업 큐를 정했습니다. 이 구조로 방 간 처리를 분리하지만, 공개 자료에는 성능 비교 측정이 없어 처리량 향상 수치는 제시하지 않습니다.

## 구현

서버는 패킷과 세션 권한을 확인한 뒤 방 코드를 기준으로 작업 큐에 전달합니다. 다음 코드는 공개 `VoiceServer.cpp`에서 방별 큐를 고르는 부분입니다.

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

마이크 캡처, 화자별 Opus 인코더, UDP 송수신과 클라이언트 재생을 연결했습니다. 앱이 백그라운드에 있는 동안 오래된 캡처 데이터가 쌓이면 복귀 후 지연 음성이 재생될 수 있어, 포커스를 잃은 상태의 버퍼와 인코더 상태를 비우도록 처리했습니다.

## 문제 해결 과정

게임 창을 백그라운드로 전환했다 돌아오면 이전에 쌓인 음성이 한꺼번에 처리돼 재생이 늦어지거나 깨졌습니다. 오래된 음성을 모두 재생하도록 두는 대신, 백그라운드 진입 때 입력 버퍼와 인코더 상태를 초기화해 복귀 후 최신 음성부터 처리하도록 했습니다.

## 검증 범위와 한계

- 16kHz 샘플링, 20ms 프레임, 24kbps는 인코더 설정값이며 측정된 지연·품질 결과가 아닙니다.
- 방별 큐 분배와 공유 페이로드의 효과를 재현하는 벤치마크는 공개 자료에 없습니다.
- 문서에 UDP 음성 패킷 직렬화 방식 기록이 일치하지 않아, 모든 음성 패킷이 Protocol Buffers를 사용한다고 단정하지 않습니다.
- 공개 기록에서 팀 규모는 6인으로 기재되어 있습니다. 성능 수치나 운영 규모는 별도 검증하지 않았습니다.

## 공개 출처

- [Mausoleum 저장소](https://github.com/cgantro/Mausoleum)
- [VoiceServer.cpp](https://github.com/cgantro/Mausoleum/blob/main/Server/GameServer/src/voice/VoiceServer.cpp)
