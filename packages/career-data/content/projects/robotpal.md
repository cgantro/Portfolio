# RobotPal

## 개요 · 스트리밍 병목 문제

카메라 영상을 Python 인식 모듈로 보내면 시뮬레이션 갱신률이 떨어졌습니다. 처음에는 GPU에서 프레임을 읽어 오는 과정이 원인이라고 보고 PBO와 Fence를 적용했지만, PBO만으로는 개선되지 않았습니다.

## 원인 분석

카메라 스트리밍 병목을 구간별로 나눠 확인했습니다.

Tracy로 구간별 실행 시간을 확인하니 동기 GPU Readback은 p50 1.144ms, 메인 스레드 JPEG 인코딩은 p50 16.406ms였습니다. 프레임을 GPU에서 가져오는 시간보다 JPEG 인코딩이 메인 스레드를 오래 점유하고 있었습니다.

<인라인 차트 자리>

## 해결

JPEG 인코딩과 송신을 메인 스레드에서 분리해 워커 스레드 4개가 맡도록 바꿨습니다. 대기열은 최대 6개 프레임만 보관하고, 가득 차면 가장 오래된 프레임을 버린 뒤 최신 프레임을 넣습니다.

워커의 JPEG 인코딩 p50은 27.075ms로 더 길었지만, 메인 스레드의 대기열 삽입은 p50 0.017ms였습니다. 인코더 자체를 빠르게 만든 것이 아니라 화면 갱신이 인코딩 완료를 기다리지 않도록 했습니다.

## 결과

| 구성 | 스트리밍 중 시뮬레이션 | 카메라 프레임 송신 |
| --- | ---: | ---: |
| 동기 Readback·인코딩 | 66.70 FPS | 26.95 FPS |
| PBO만 적용 | 65.60 FPS | 25.49 FPS |
| PBO와 워커 4개 | 96.01 FPS | 40.05 FPS |

동기 방식과 비교해 시뮬레이션 갱신률은 43.9%, 카메라 송신률은 48.6% 높아졌습니다. 측정은 1232×832 해상도의 내장 GPU 환경에서 각 구성을 5회 실행한 중앙값이며, 영상 수신과 압축 해제는 포함하지 않았습니다.

## 한계

- 카메라 송신률 40.05 FPS는 목표 60 FPS에 못 미쳤습니다.
- 공개 기록에 원본 로그와 정확한 CPU·GPU 사양, 빌드 설정이 없어 결과를 독립적으로 재현할 수 없습니다.
- 수신·디코딩 성능은 측정 범위에 포함하지 않았습니다.
- 보고된 결과를 다른 GPU나 해상도에 그대로 적용할 수 없습니다.

[성능 측정 기록](https://github.com/cgantro/RobotPal/blob/main/docs/streaming-performance-result.md)

## 부가 구현

`IRobotController`로 가상 이동체와 실물 JETANK의 제어 구현을 분리했습니다. Qt 관제 화면에서 실물 장비 상태를 확인하고 조작할 수 있으며, Python 인식 명령은 이동체·로봇 팔·집게 제어에 연결했습니다.

실측 주행값을 바탕으로 가상 이동체의 직진·회전 속도를 보정했습니다. 웹 빌드는 WebAssembly 환경에서 WebSocket을 사용하고, 데스크톱 빌드는 TCP를 사용합니다.

## 코드

다음 코드는 대기열을 6개로 제한하고, 가득 찼을 때 오래된 작업을 먼저 버리는 부분입니다.

```cpp title="RobotPal/src/Util/StreamingWorker.cpp"
{
    std::lock_guard<std::mutex> lk(m_encodeQueueMutex);
    if (m_encodeQueue.size() >= EncodeQueueCapacity)
        m_encodeQueue.pop();
    m_encodeQueue.push(std::move(job));
}
m_encodeQueueCv.notify_one();
```

워커는 잠금 구간 안에서 다음 프레임만 꺼냅니다. JPEG 인코딩과 송신은 잠금을 푼 뒤 수행합니다.

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

인코딩이 끝난 프레임은 네트워크 엔진으로 전달합니다.

```cpp title="RobotPal/src/Util/StreamingWorker.cpp · JPEG 송신"
bool ok = jpeg->EncodeRGB(
    rgbPtr, job.width, job.height, 70, jpegOut);
if (!ok) {
    robotpal::benchmark::Event("encode_failed", job.frameId, encodeNs, 0, "jpeg");
    continue;
}

if (m_networkEngine) {
    m_networkEngine->SendPacket(packet, job.frameId);
}
```
