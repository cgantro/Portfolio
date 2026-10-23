# RobotPal

## 개요

가상 환경에서 JETANK의 주행을 재현하고 카메라 영상을 Python 인공지능 모듈로 보내는 C++ 시뮬레이터입니다.

## 설계 선택

제어 명령 처리와 주행 계산을 나눠 입력과 시뮬레이션 갱신을 따로 다룰 수 있게 했습니다.

카메라를 전송하면 화면 갱신률이 낮아졌습니다. 픽셀 버퍼를 두 개 쓰는 방식으로는 나아지지 않아, Tracy로 화면 복사와 JPEG 압축에 걸리는 시간을 나눠 살폈습니다. 시뮬레이션이 압축 완료를 기다리지 않도록 작업 대기열을 두고 압축 작업자 네 개를 적용했습니다.

## 구현

그래픽 메모리에서 화면을 읽고 JPEG로 압축하는 데 시간이 오래 걸렸습니다. 그래서 캡처한 프레임을 별도 대기열에 넘겼습니다. 아래는 공개 저장소의 `StreamingPipeline::PushFrame`에서 프레임을 대기열에 넣는 부분입니다. 대기열이 가득 차면 가장 오래된 프레임부터 버려 처리 지연이 쌓이지 않게 합니다.

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

JPEG 인코더 한 개의 처리 시간을 줄이는 것이 목적은 아니었습니다. 시뮬레이션 갱신이 압축 완료를 기다리지 않도록 분리하는 데 초점을 뒀습니다. 프레임이 밀릴 때는 오래된 프레임을 버리고 대기열 크기도 제한해 지연이 쌓이지 않게 했습니다.

## 문제 해결 과정

픽셀 버퍼 두 개를 번갈아 쓰는 실험으로는 속도가 나아지지 않았습니다. 프로파일링 결과 JPEG 압축이 주 실행 흐름을 오래 붙잡고 있었습니다. 압축 작업을 별도 스레드로 옮긴 뒤 공개 측정에서 스트리밍 중 시뮬레이션 속도와 카메라 송신 속도가 모두 높아졌습니다.

작업자에서 프레임 한 장을 인코딩하는 시간 자체는 오히려 길었습니다. 확인된 개선은 인코딩 알고리즘이 빨라진 결과가 아니라 시뮬레이션 갱신이 압축을 기다리는 시간이 줄어든 결과입니다.

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
