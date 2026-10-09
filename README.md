# C++ 개발자 포트폴리오

React와 Vite로 만든 개인 포트폴리오입니다. 홈 화면에서 대표 프로젝트와 담당 영역을 소개하고, 프로젝트 페이지에서 구조·구현·문제 해결·검증 결과를 확인할 수 있습니다.

## Run locally

```sh
npm ci
npm run dev
```

Create a production build with:

```sh
npm run build
```

## 프로젝트 콘텐츠

- 대표 프로젝트 데이터: `src/data/projects/*.js`
- 프로젝트 섹션 정의와 렌더러: `src/data/projectSections.js`, `src/components/sections/Projects/ProjectPageContent.jsx`
- 홈 화면과 학력·기술·활동: `src/pages/HomePage.jsx`, `src/data/`
- 이미지와 시연 자료: `asset/`

GraspLink의 Emscripten 웹 빌드는 `asset/minibcg/index.html`에 있고 `/Portfolio/minibcg/index.html`에서 실행합니다. 약 22.38MB의 단일 HTML은 프로젝트 페이지에서 미리보기와 실행 버튼을 먼저 보여 주며, 사용자가 실행을 눌렀을 때 불러옵니다. 별도 탭으로 열거나 GitHub 저장소를 확인할 수도 있습니다. 사이트 루트에는 스레드 빌드용 `coi-serviceworker.min.js`가 있습니다.

## Deployment

`main`에 푸시하면 `.github/workflows/deploy.yml`이 빌드 후 `dist/`를 GitHub Pages에 배포합니다. Vite의 운영 base 경로는 `/Portfolio/`이며, 워크플로는 정적 호스팅에서 프로젝트 경로에 직접 접근할 수 있도록 404 fallback을 구성합니다.
