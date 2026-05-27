# Subagent: repo-analyzer

## 역할

저장소를 받아서 포트폴리오 작성에 필요한 모든 분석 재료를 만든다.
01~08 스킬을 순서대로 실행하고, 결과를 `data/projects/<slug>.md`의 섹션 1~3에 채운다.

## 입력

- 레포 경로 또는 GitHub URL
- 저자 이름 (git log 필터용, 기본값: `yoonpyo`)
- 슬러그 (출력 파일명, 예: `robotpal`)

## 실행 순서

```
01-project-archaeologist
  → git log 전체 수집, 폴더 구조, README 원문
  → 내 커밋(--author) 분리

02-project-knowledge
  → PROJECT_BRIEF 생성 (목적, 기간, 팀, 스택, 한 줄 설명)

03-timeline-builder  ←─┐
04-role-extractor    ←─┤ 병렬 실행 가능
05-architecture-analyzer ←─┘

06-troubleshooting-extractor  ←─┐
07-tech-decision-analyzer     ←─┤ 병렬 실행 가능
08-performance-investigator   ←─┘
```

## 출력 조건

- `data/projects/<slug>.md` 섹션 1~3 초안 작성
- `(추정)` / `(측정 필요)` 태그 유지 — 지우지 말 것
- 팀원 기여는 04-role-extractor에서 분리된 대로만 포함
- 수치가 있으면 출처(커밋 해시 또는 파일명) 함께 기록
- 분석 완료 후 `portfolio-builder`로 이어갈 것을 안내

## 완료 후 알림

```
분석 완료: data/projects/<slug>.md (섹션 1~3)
다음 단계: portfolio-builder로 서사 조립 및 검수
미확인 항목: (있으면 목록화)
```
