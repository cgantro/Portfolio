# RobotPal

## 개요

실물 JETANK의 주행을 가상 환경에서 재현하고, 카메라 영상을 Python 인공지능 모듈로 전달하는 C++ 시뮬레이터입니다.

## 설계 선택

제어 명령과 주행 계산을 분리해 입력 경로와 시뮬레이션 갱신을 독립적으로 다룰 수 있게 했습니다.

카메라 전송을 켜면 화면 갱신률이 떨어졌습니다. 픽셀 버퍼를 두 개 사용하는 것만으로는 개선되지 않아, Tracy 프로파일링으로 화면 복사와 JPEG 압축 구간을 나누어 확인했습니다. 압축 완료를 시뮬레이션 주 흐름에서 기다리지 않도록 작업 대기열과 네 개의 압축 작업자를 적용했습니다.

## 구현

그래픽스 읽기와 JPEG 압축이 오래 걸리는 구간임을 확인한 뒤, 캡처 프레임을 별도 대기열에 넘겼습니다. 아래는 공개 저장소의 `StreamingPipeline::PushFrame`에서 프레임을 큐에 넣는 부분입니다. 큐가 가득 차면 오래된 프레임부터 버려, 처리 지연이 계속 쌓이는 것을 제한합니다.

```cpp
{
    std::lock_guard<std::mutex> lk(m_encodeQueueMutex);
    if (m_encodeQueue.size() >= EncodeQueueCapacity) {
        const auto droppedFrameId = m_encodeQueue.front().frameId;
        m_encodeQueue.pop();
        robotpal::benchmark::Event(
            "encode_queue_dropped",
            droppedFrameId,
            0,
            EncodeQueueCapacity,
            "drop_oldest_capacity_6"
        );
    }
    m_encodeQueue.push(std::move(job));
}
m_encodeQueueCv.notify_one();
```

이 변경의 목적은 JPEG 인코더 한 개의 처리 시간을 줄이는 것이 아니라, 인코딩 대기를 시뮬레이션 갱신 흐름에서 분리하는 것이었습니다. 프레임이 밀리면 오래된 프레임을 버리는 정책과 큐 용량을 함께 둬 지연 누적을 제한합니다.

## 문제 해결 과정

픽셀 버퍼를 두 개 번갈아 쓰는 실험은 성능 개선으로 이어지지 않았습니다. 프로파일링에서는 JPEG 압축이 주 실행 흐름을 오래 점유하는 구간으로 나타났습니다. 압축을 작업자 스레드로 옮긴 뒤 스트리밍 중 시뮬레이션 속도와 카메라 송신 속도는 공개 측정에서 함께 높아졌습니다.

다만 작업자에서 프레임 한 장을 인코딩하는 시간 자체는 더 길었습니다. 따라서 확인된 결과는 인코딩 알고리즘의 가속이 아니라, 시뮬레이션 갱신이 인코딩 완료를 기다리는 시간을 줄인 것입니다.

## 검증 범위와 한계

- 공개 보고값은 1232×832 iGPU 환경의 측정입니다. Streaming OFF·ON 각각 5회 측정의 중앙값이며, 네트워크 수신과 디코딩은 제외했습니다.
- 스트리밍 중 시뮬레이션은 66.70→96.01 FPS, 카메라 송신은 26.95→40.05 FPS로 보고됐습니다. 카메라 송신은 60 FPS 목표에 미달했습니다.
- 정확한 GPU 모델과 원본 측정 로그가 없어 다른 장비에서 재현되거나 같은 성능을 보장한다고 말할 수 없습니다.
- 공개 자료의 팀 규모와 후속 작업 기간 기록이 서로 달라 팀 인원 수는 표시하지 않았습니다.
- 집기는 ECS 부모 관계 변경으로 처리합니다. 강체 물리에 의한 파지로 설명하지 않습니다.

## 공개 출처

- [RobotPal 저장소](https://github.com/cgantro/RobotPal)
- [StreamingWorker.cpp](https://github.com/cgantro/RobotPal/blob/main/RobotPal/src/Util/StreamingWorker.cpp)
- [스트리밍 성능 측정 기록](https://github.com/cgantro/RobotPal/blob/main/docs/streaming-performance-result.md)
