import styles from "./ProjectPage.module.css";
import {
  ArchitectureBlock,
  CopyCard,
  DesignConsiderationPanel,
  EvidenceList,
  FactCard,
  HeroCard,
  ProjectSection,
  RetrospectivePanel,
  SimpleTable,
  SummaryCard,
  TechChoicePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function RobotPalPage({ project, detailPage, links }) {
  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection
        id="overview"
        label="개요"
        title="JETANK 후배들이 더 빨리 실험을 시작하도록 만든 기반"
        lead="실물을 바로 붙이지 않아도 데이터 수집, 학습, 연동 흐름을 먼저 검증할 수 있도록 공통 플랫폼을 만드는 데 초점을 맞췄습니다."
      >
        <div className={styles.splitBoard}>
          <CopyCard title="배경" paragraphs={detailPage.context.body} />
          <FactCard title="정리한 범위" facts={detailPage.context.facts} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="architecture"
        label="아키텍처"
        title="렌더 루프와 전달 경로를 분리한 구조"
        lead="시뮬레이터 내부 루프가 스트리밍과 웹 대응 때문에 멈추지 않도록 readback, 인코딩, 전달을 단계별로 잘라냈습니다."
      >
        <div className={styles.splitBoard}>
          <ArchitectureBlock notes={detailPage.architectureNotes} />
          <SummaryCard
            title="핵심 흐름"
            items={[
              "시뮬레이터 루프는 상태 계산과 렌더링에 집중합니다.",
              "프레임 readback은 비동기 PBO 구조로 넘겨 렌더 스톨을 줄입니다.",
              "압축과 전송은 큐 기반 단계 분리로 지연 누적을 줄입니다.",
              "동일한 C++ 코어를 데스크톱과 웹 경로로 함께 유지합니다.",
            ]}
            snippet={project.implementations[1].snippet}
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="implementation"
        label="구현"
        title="시뮬레이션, 스트리밍, 웹 배포를 하나의 흐름으로 정리"
        lead="구현 설명은 기능 나열보다 후배들이 어디에서 실험을 시작하고 어떤 경로로 결과를 확인할 수 있는지에 맞춰 정리했습니다."
      >
        <div className={styles.stackLayout}>
          {project.implementations.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              items={item.items}
              snippet={item.snippet}
            />
          ))}
        </div>
      </ProjectSection>

      <ProjectSection
        id="troubleshooting"
        label="트러블슈팅"
        title="렌더 루프를 막는 병목을 단계별로 풀었습니다"
        lead="성능 문제는 대부분 한 지점의 최적화보다 파이프라인 경계를 다시 자르는 쪽에서 풀렸습니다."
      >
        <div className={styles.issueGrid}>
          {project.problems.map((item) => (
            <TroubleshootingCard key={item.title} item={item} />
          ))}
        </div>
      </ProjectSection>

      <ProjectSection
        id="evidence"
        label="근거"
        title="설명은 측정값과 문서 기준으로만 남겼습니다"
        lead="성과 수치가 확인되는 부분은 병목 분석 문서 기준으로 제시하고, 나머지는 README와 빌드 구조에서 검증 가능한 항목만 정리했습니다."
      >
        <div className={styles.evidenceBoard}>
          <article className={styles.surfaceCard}>
            <h3 className={styles.cardTitle}>{detailPage.benchmarkTable.title}</h3>
            <SimpleTable
              headers={detailPage.benchmarkTable.headers}
              rows={detailPage.benchmarkTable.rows}
            />
            <p className={styles.tableNote}>{detailPage.benchmarkTable.note}</p>
          </article>
          <EvidenceList notes={detailPage.evidenceNotes} />
          <TechChoicePanel items={project.techChoice} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="retrospective"
        label="회고"
        title="플랫폼으로 묶은 만큼 이후 실험 경계를 더 분명히 남겨야 합니다"
        lead="지금 구조는 시작 비용을 줄이는 데 초점을 맞췄고, 다음 단계에서는 실물 브리지와 자동화된 벤치 체계를 더 또렷하게 남겨야 합니다."
      >
        <div className={styles.splitBoard}>
          <RetrospectivePanel items={project.retrospective} />
          <DesignConsiderationPanel
            title="이번 프로젝트에서 남긴 판단"
            items={[
              {
                title: "후배의 시작 비용을 먼저 줄인다",
                body: "완전한 제품보다 반복 실험에 필요한 공통 런타임과 전달 경로를 먼저 만드는 편이 팀 전체 생산성에 더 직접적이었습니다.",
              },
              {
                title: "성능 문제는 경계 분리로 푼다",
                body: "render, readback, encode, send를 같은 리듬으로 묶지 않고 각 단계의 책임을 분리하는 것이 최적화보다 먼저였습니다.",
              },
            ]}
          />
        </div>
      </ProjectSection>
    </>
  );
}

