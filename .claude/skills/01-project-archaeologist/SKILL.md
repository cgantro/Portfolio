# 01 · Project Archaeologist

## 역할

저장소 원본 데이터를 수집한다.
해석하거나 요약하지 말 것 — 다음 스킬들이 해석한다.

## Input

- 레포 경로 또는 GitHub URL
- 저자 이름 (git log 필터용)

## Process

```
1. git log --format="%h %ad %an %s" --date=short --all
2. git log --author=<name> (내 커밋 분리)
3. git branch -a (브랜치 구조)
4. 폴더 구조 depth 2
5. README 전문
6. docs/ 하위 문서 목록
7. 주요 설정 파일 (package.json, build.gradle, CMakeLists.txt 등)
```

## Output → 02-project-knowledge

```
REPO_RAW:
- 전체 커밋 수: N
- 기간: YYYY-MM-DD ~ YYYY-MM-DD
- 내 커밋: N개
- 브랜치 목록: [...]
- 폴더 구조: (depth 2 트리)
- README 원문 (첨부)
- 도메인 키워드: (README에서 추출한 명사 목록)
```

## 금지

- 요약 금지
- 해석 금지
- 없는 내용 추가 금지
