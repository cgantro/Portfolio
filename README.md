# Engineering portfolio

프로젝트 경험과 검증 근거를 한곳에서 관리하고, 웹 포트폴리오와 직무별 이력서·PDF를 같은 원본 데이터에서 생성합니다.

## 개발 환경

- Node.js 22.13 이상
- pnpm 10.29.1
- PDF 생성에는 Vivliostyle CLI와 사용자 전역 `uv`/RenderCV가 사용됩니다. 선택형 Typst 비교 빌드에는 Typst가 필요합니다.

```powershell
pnpm install --frozen-lockfile
pnpm dev:web
```

## 원본 데이터

- `packages/career-data/content/career.yaml`: 프로필, 경력, 학력, 기술, 직무별 이력서 구성
- `packages/career-data/content/projects/*.yaml`: 프로젝트 사실, 역할, 주장, 지표, 근거 ID와 검증 상태
- `packages/career-data/content/projects/*.md`: 프로젝트 설명과 구현 과정
- `packages/schema/src/index.ts`: 날짜 정밀도, 사실 관계, 근거 연결, 공개 링크를 검사하는 Zod 스키마

`verified`, `reported`, `unverified` 상태는 원본의 검증 수준을 그대로 나타냅니다. 수치에는 단위, 측정 조건, 근거 ID가 함께 있어야 하며, 구조 검증을 과학적 재현성 검증으로 표현하지 않습니다. 비공개 자료는 `career-db/`와 `PRIVATE_NOT_FOR_GITHUB/`에 두고 공개 데이터나 빌드 결과에 복사하지 않습니다.

## 빌드와 검증

```powershell
pnpm run validate:content
pnpm run audit:content
pnpm run validate:resume
pnpm run vale:content
pnpm run test:unit
pnpm run build
pnpm run test:e2e
pnpm run test:visual
pnpm report:visual
pnpm test:live-simulator
pnpm run validate:pdf
```

`pnpm run build`는 콘텐츠 검증, 포트폴리오·이력서 PDF 생성, Astro 정적 웹사이트 빌드를 수행합니다. 웹 산출물은 `apps/web/dist/`, PDF는 검증용 `apps/print/dist/{edition}/`에 생성됩니다. PDF는 웹 산출물에 복사하지 않으며, 웹 포트폴리오에도 이력서 화면이나 내려받기 링크를 두지 않습니다.

브라우저 검사는 배포 경로 `/Portfolio/`를 포함한 실제 정적 빌드에서 여섯 경로, 키보드 탐색, 접근성, 시뮬레이터 실행을 확인합니다. axe-core는 WCAG 자동 점검에 사용됩니다. 시각 검사는 첫 화면, 프로젝트 목록, 네 프로젝트 상세를 375px, 768px, 1440px에서 캡처해 `artifacts/design-review/screenshots/`에 보관합니다. `pnpm test:live-simulator`는 공개 DroneSim 웹 데모를 실제 브라우저에서 열어 확인하므로 네트워크가 필요하며 CI에서는 실행하지 않습니다.

선택형 엔진 비교는 다음 명령으로 실행합니다.

```powershell
pnpm --filter @portfolio/print pdf:typst
pnpm --filter @portfolio/print resume:typst
pnpm --filter @portfolio/print resume:rendercv
```

## Codex 전역 및 저장소 로컬 설정

재사용 스킬과 Vale·uv 실행 파일은 사용자 전역 설치이므로 다른 저장소에서도 사용할 수 있습니다. 사용자 전역 스킬은 `%USERPROFILE%\.codex\skills\`에 있고, 전역으로 설치된 `im-not-ai`, MengTo `editorial-tech`, `split-layout-technical`을 사용할 수 있습니다. Vale과 uv 프로그램도 현재 Windows 사용자에게 설치되어 있습니다.

이 포트폴리오에만 적용되는 지침, 스킬, 서브에이전트는 저장소에 버전 관리합니다.

- `AGENTS.md`: 데이터·디자인·검증 규칙
- `.agents/skills/`: 포트폴리오 전용 콘텐츠, PDF, 디자인 감사 절차
- `.codex/agents/`: 화면 설계, UI/접근성/코드/문서/기술 콘텐츠 검토자
- `.vale.ini`, `tooling/content-validation/`: 저장소 전용 문서 규칙

전역 도구를 설치해도 저장소 규칙은 이 프로젝트에만 적용됩니다. Codex는 전역 스킬을 새 세션에서 다시 검색합니다.

## 배포

`main`에 직접 푸시하면 `.github/workflows/deploy.yml`이 빌드하고 `apps/web/dist/`를 GitHub Pages에 배포합니다. 포트폴리오 작업은 `main`에서만 진행하며 별도 브랜치나 작업 트리를 만들지 않습니다. `.github/workflows/portfolio-v2-ci.yml`은 `main` 변경을 검사합니다.

## DroneSim

프로젝트 상세 페이지의 데모는 사용자가 실행 링크를 누른 뒤 DroneSim Pages를 새 탭으로 엽니다. 웹 빌드는 운동학 기준 모델을 사용하며, Windows 네이티브 AirSim 강체 물리 경로와 다릅니다. 방문만으로 데모를 내려받거나 시작하지 않습니다. 공개 앱의 실제 동작은 `pnpm test:live-simulator`로 별도 확인합니다.
