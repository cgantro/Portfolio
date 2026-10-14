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

`pnpm run build`는 콘텐츠/이력서 검증, 12페이지 기술 포트폴리오 PDF와 RenderCV 1페이지 이력서 PDF 생성, Astro 정적 웹사이트 빌드를 수행합니다. 웹 산출물은 `apps/web/dist/`, PDF와 교환용 JSON Resume은 `apps/print/dist/{edition}/`에 생성되고, 다운로드로 복사됩니다. PDF 성공은 파일 존재만으로 처리하지 않고, 페이지 수와 한국어 텍스트 추출을 확인한 뒤 기록합니다.

브라우저 검사는 배포 경로 `/Portfolio/`를 포함한 실제 정적 빌드에서 라우트, 검색·필터, 다운로드, 키보드 동작, 시뮬레이터 실행을 검사합니다. axe-core는 WCAG 자동 점검에 사용됩니다. 시각 검사는 10개 경로를 375px, 768px, 1440px에서 캡처해 `artifacts/design-review/`에 보관합니다. `pnpm report:visual`은 스크린샷 목록과 해시를 기록합니다. `pnpm test:live-simulator`는 공개 GraspLink 시뮬레이터를 실제 브라우저에서 열어 확인하므로 네트워크가 필요하며 CI에서는 실행하지 않습니다.

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

`main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드하고 `apps/web/dist/`를 GitHub Pages에 배포합니다. `rebuild/portfolio-v2` 브랜치 푸시와 `main` 대상 PR은 단위·브라우저·시각·PDF 검사를 수행합니다. V2를 배포하기 전에는 변경된 경로와 GitHub Pages 설정을 확인해야 합니다.

## GraspLink

프로젝트 상세 페이지의 시뮬레이터는 사용자가 실행 링크를 누른 뒤에만 원래의 GraspLink 사이트를 새 탭으로 엽니다. 라이브 브라우저 확인에서 최상위 페이지에서는 시뮬레이터가 렌더링됐지만 iframe에서는 빈 캔버스만 보여 새 탭을 사용합니다. 방문 시 무거운 WASM을 바로 내려받지 않으며, 공개 시뮬레이터의 실제 렌더링 결과는 별도의 라이브 점검으로 기록합니다.
