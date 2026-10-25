# RobotPal

## 개요

실물 JETANK 없이 주행·로봇 팔 제어와 카메라 기반 인식 흐름을 시험하는 로봇 시뮬레이터입니다. 저는 실물 장비 연동, 가상 카메라 스트리밍, 제어 명령 연결과 스트리밍 성능 개선을 맡았습니다.

## 카메라 스트리밍 병목 분석

가상 카메라 프레임은 GPU에서 읽어 온 뒤 JPEG로 인코딩해 Python 영상 인식 모듈로 보냅니다. 스트리밍을 켜면 시뮬레이션 갱신률이 떨어져 처음에는 GPU Readback을 병목으로 의심하고 PBO와 Fence를 적용했습니다. 하지만 PBO만 쓴 결과는 시뮬레이션 FPS가 66.70에서 65.60, 카메라 송신률이 26.95에서 25.49로 낮아졌습니다.

Tracy로 구간별 시간을 다시 쟀습니다. 동기 Readback p50은 1.144ms였고 메인 스레드 JPEG 인코딩은 16.406ms였습니다. 큰 비용은 픽셀을 가져오는 단계보다 JPEG 인코딩에서 발생했습니다. 그래서 프레임 데이터를 제한된 작업 큐에 넘기고 4개 워커 스레드가 인코딩과 송신을 처리하도록 구조를 바꿨습니다.

프레임 생성 쪽은 큐가 여섯 장을 넘으면 가장 오래된 프레임을 버리고 새 프레임을 넣습니다. 인코더가 화면 갱신보다 느릴 때 지연된 화면이 계속 쌓이지 않게 하려는 정책입니다.

```cpp title="RobotPal/src/Util/StreamingWorker.cpp"
{
    std::lock_guard<std::mutex> lk(m_encodeQueueMutex);
    if (m_encodeQueue.size() >= EncodeQueueCapacity)
        m_encodeQueue.pop();
    m_encodeQueue.push(std::move(job));
}
m_encodeQueueCv.notify_one();
```

워커는 조건 변수로 새 작업을 기다렸다가 큐에서 꺼냅니다. 잠금은 작업을 꺼낼 때만 잡고, JPEG 인코딩과 송신은 잠금을 푼 뒤 처리합니다.

```cpp title="RobotPal/src/Util/StreamingWorker.cpp · 워커 대기열"
std::unique_lock<std::mutex> lk(m_encodeQueueMutex);
m_encodeQueueCv.wait(lk, [&] {
    return !m_encodeQueue.empty() || !m_isRunning.load();
});
if (!m_isRunning.load() && m_encodeQueue.empty()) break;
job = std::move(m_encodeQueue.front());
m_encodeQueue.pop();
lk.unlock();
```

워커가 큐에서 꺼낸 프레임은 JPEG로 인코딩한 뒤 네트워크 엔진에 넘깁니다.

```cpp title="RobotPal/src/Util/StreamingWorker.cpp · JPEG 송신"
bool ok = jpeg->EncodeRGB(
    rgbPtr, job.width, job.height, 70, jpegOut);
if (!ok) {
    robotpal::benchmark::Event("encode_failed", job.frameId, encodeNs, 0, "jpeg");
    continue;
}

if(m_networkEngine) {
    m_networkEngine->SendPacket(packet, job.frameId);
}
```

워커의 JPEG 인코딩 p50은 오히려 27.075ms로 길어졌지만, 메인 스레드의 큐 삽입은 p50 0.017ms였습니다. 목표 해상도 1232×832를 유지하고 각 구성을 5회 측정한 중앙값은 다음과 같습니다.

| 구성 | 스트리밍 중 시뮬레이션 | 카메라 프레임 송신 | 스트리밍에 따른 시뮬레이션 저하 |
| --- | ---: | ---: | ---: |
| 동기 Readback·인코딩 | 66.70 FPS | 26.95 FPS | 34.84% |
| PBO만 적용 | 65.60 FPS | 25.49 FPS | 36.02% |
| PBO와 워커 4개 | 96.01 FPS | 40.05 FPS | 6.74% |

동기 방식과 비교해 스트리밍 중 시뮬레이션은 43.9%, 카메라 송신은 48.6% 높아졌습니다. 개선의 원인은 JPEG 인코더 자체가 빨라진 게 아니라, 메인 스레드가 인코딩 완료를 기다리지 않게 된 데 있습니다. 60 FPS 송신 목표에는 도달하지 못했습니다. 측정은 내장 GPU 환경에서 했고 영상 수신·디코딩은 포함하지 않았습니다. [성능 기록](https://github.com/cgantro/RobotPal/blob/main/docs/streaming-performance-result.md) · [워커 구현](https://github.com/cgantro/RobotPal/blob/main/RobotPal/src/Util/StreamingWorker.cpp)

## 실물 장비와 제어 연결

`IRobotController` 인터페이스로 실물 JETANK과 시뮬레이터의 제어 구현을 분리했습니다. Qt 관제 화면은 실물 장비 상태를 보여주고 조작 입력을 전달합니다. Python 영상 인식 모듈의 명령은 가상 이동체와 팔·집게·카메라 기울기 제어에 연결했습니다. 모터 입력에 따른 실측 주행 결과를 가상 주행과 대조해 직진·회전 속도를 보정했습니다.

웹 빌드는 Emscripten/WebAssembly의 네트워크·스레드 제약에 맞춰 별도 경로로 구성했습니다. 데스크톱의 TCP 전송과 웹 환경의 WebSocket 전송을 구분하며, 웹에서의 동작은 데스크톱 성능 측정과 별개입니다.
