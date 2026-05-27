# 02 · Project Knowledge

## 역할

01의 원본 데이터에서 프로젝트의 "무엇"을 정의한다.
목적, 팀 구성, 기간, 기술 스택, 도메인 컨텍스트.

## Input

- 01-project-archaeologist 출력 (REPO_RAW)

## Process

```
1. README에서 프로젝트 목적 문장 추출
2. 첫 커밋 날짜 ~ 마지막 커밋 날짜로 기간 산정
3. git log --all 저자 목록 → 팀 규모 추정
4. 설정 파일(package.json, gradle 등)에서 기술 스택 목록화
5. 폴더 구조에서 서비스 분리 구조 파악 (FE/BE/AI/Embedded 등)
6. 도메인 키워드로 "한 줄 시스템 설명" 생성
```

## Output → 03, 04, 05

```
PROJECT_BRIEF:
- 이름:
- 목적: (1~2문장)
- 기간: YYYY-MM-DD ~ YYYY-MM-DD (N주)
- 팀 구성: (역할별 인원 추정)
- 기술 스택: (레이어별 목록)
- 시스템 한 줄 설명:
- 서비스 구조: (FE / BE / AI / Infra 등)
```

## 주의

- 팀 인원은 git 저자 수로 추정, "(추정)" 명시
- README가 없으면 커밋 메시지 키워드로 유추, "(유추)" 명시
