# RobotPal

## 개요

가상 환경에서 JETANK 이동 로봇의 주행과 카메라 영상을 다루는 C++ 시뮬레이터입니다. 카메라 영상을 Python 인공지능 모듈로 보내고, 돌아온 명령으로 이동 로봇과 로봇 팔을 제어합니다.

## 설계 선택

캡처한 프레임의 JPEG 압축과 송신은 작업자 네 개에 맡겨 시뮬레이션 갱신이 압축 완료를 기다리지 않게 했습니다.

## 구현

프레임 대기열을 여섯 개로 제한하고, 가득 차면 가장 오래 기다린 프레임을 버립니다. 밀린 과거 화면보다 새 프레임을 우선해 전송 지연이 계속 쌓이지 않도록 했습니다.

```cpp
{
    std::lock_guard<std::mutex> lock(m_encodeQueueMutex);
    if (m_encodeQueue.size() >= EncodeQueueCapacity)
        m_encodeQueue.pop();
    m_encodeQueue.push(std::move(job));
}
m_encodeQueueCv.notify_one();
```

## 문제 해결 과정

픽셀 버퍼 객체(PBO)를 적용해도 화면 갱신률은 나아지지 않았습니다. Tracy로 구간별 시간을 살펴 JPEG 압축이 주 실행 흐름을 붙잡는 병목임을 확인하고, 압축과 송신을 작업 스레드로 옮겼습니다. 그 결과 시뮬레이션 갱신이 압축 완료를 기다리는 시간이 줄었고, 스트리밍 중 시뮬레이션 갱신률과 카메라 송신률이 모두 높아졌습니다. 프레임 한 장의 인코딩 시간 자체를 줄인 것은 아닙니다.
