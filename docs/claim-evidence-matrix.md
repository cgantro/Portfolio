# 주장·근거 대조표

| 화면에 표시하는 주장 | 대조 근거 | 판정 | 처리 |
|---|---|---|---|
| GraspLink는 HCR-12A 6축 팔과 2F-85를 시뮬레이션하며 실제 로봇은 제어하지 않음 | `D:/Projects/MiniBCG/README.md`, `docs/ROBOT_MOTION_AND_GRASP.md`, 공개 `cgantro/GraspLink` 저장소 | 확인 | 범위를 요약에 명시 |
| GraspLink의 MoveJ/MovePose는 관절 경로이며 TCP 직선을 보장하지 않고, MoveLinear는 TCP 선형 이동을 계획 | `docs/ROBOT_MOTION_AND_GRASP.md`, 시뮬레이션 제어기와 경로 계획기 | 확인 | 이동 방식의 차이를 구현 설명에 명시 |
| J6 등가각 보정에서 회전 수를 보존하지 않아 원위치 복귀가 어긋남 | `diary/14-j6-unwind-center-and-random-yaw.md`, `SimRobotController.cpp`, `PickPlaceMission.cpp`, `RobotMotionTests.cpp` | 확인 | 원인·수정과 회귀 테스트로 설명 |
| RobotPal은 4인 팀, 공식 기간 2025.11–2025.12이며 사용자는 Qt·측정/보정·제어·스트리밍을 담당 | 사용자가 확정한 기준, `docs/PORTFOLIO_OVERHAUL_WORK_ORDER.md` | 사용자 확인 | 프로젝트 기간은 월 단위로 표시 |
| RobotPal 후속 스트리밍 벤치마크: Sync/PBO/PBO+4 workers 비교 | `https://github.com/cgantro/RobotPal/blob/main/docs/streaming-performance-result.md` | 공개 기준 문서 확인 | 프로젝트 기간과 별도 표기, 측정 조건과 범위를 함께 표시 |
| Tracy 16.406ms와 0.017ms는 같은 작업 구간의 전후 비교가 아님 | RobotPal 성능 결과, `tracyDiagnostics` 구성 | 확인 | 별도 진단 표에 배치하고 인코더가 빨라졌다고 표현하지 않음 |
| 영묘 앱 복귀 때 캡처 버퍼를 비우고 코덱을 재설정 | `VoiceCaptureProcessor.cpp`의 `ProcessCapture()` 원문 | 확인 | 원문 일부 발췌와 공개 코드 링크 제공 |
| 영묘 Opus 음성 페이로드 약 90.3% 감소 | 프로젝트 음성 페이로드 비교 자료 | 부분 확인 | PCM 애플리케이션 페이로드 비교로 한정하고 IP/UDP 헤더 제외 명시 |
| AutoWing의 MQTT 늦은 상태 메시지가 DOCKING을 이전 상태로 되돌리는 문제와 방어 | `data/projects/agv.md`, 프로젝트 당시 버그 기록 | 부분 확인 | 문제 설명에 한정하고, 자동화 재전송 시험은 하지 않았음을 표시 |
| AutoWing 외부 메시지는 트랜잭션 커밋 후 발행 | `data/projects/agv.md`, `TxUtil.executeAfterCommit` 구현 기록 | 부분 확인 | 순서 조정만 주장하고 outbox·정확히 한 번 전달 보장 제외 |
| AutoWing k6 최대 8,935 msg/s 및 E2E 14–28ms | `data/projects/agv.md`의 시험 기록 | 부분 확인 | 모의 클라이언트 조건·최대 처리량·불명확한 지연 통계 기준 표시 |
| 포트폴리오가 GitHub Pages에서 `/Portfolio/` 경로로 배포됨 | `vite.config.js`, `.github/workflows/deploy.yml` | 확인 | README 배포 설명 갱신 |

개인 프로젝트 작업 노트와 로컬 원본 저장소는 공개 페이지에 노출하지 않습니다. 위 경로는 내부 추적용입니다.
