import styles from "./ProjectPage.module.css";
import {
  ArchitectureBlock,
  CompactTroubleshootingGrid,
  FactPanel,
  HeroCard,
  ProjectSection,
  RetrospectivePanel,
  SimpleTable,
  SummaryCardGrid,
  TechChoicePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function RobotPalPage({ project, detailPage, links }) {
  const mainProblems = project.problems.slice(0, 2);
  const extraProblems = project.problems.slice(2);
  const architectureFacts = [
    {
      label: "책임 분리",
      value: "시뮬레이션 루프와 프레임 전달 단계를 나눠 각 병목을 따로 확인할 수 있게 했습니다.",
    },
    {
      label: "데이터 흐름",
      value: "readback은 PBO, 인코딩과 전달 단계는 워커 큐로 분리해 처리 흐름을 정리했습니다.",
    },
    {
      label: "실행 경로",
      value: "같은 C++ 코어를 데스크톱과 WebAssembly 경로로 유지하고, 웹 실행 조건은 별도 계층에서 맞췄습니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현" title="구현 내용">
        <div className={styles.stackLayout}>
          <SummaryCardGrid items={project.implementations} />
          <article className={styles.surfaceCard}>
            <h3 className={styles.cardTitle}>{detailPage.benchmarkTable.title}</h3>
            <SimpleTable
              headers={detailPage.benchmarkTable.headers}
              rows={detailPage.benchmarkTable.rows}
            />
            <p className={styles.tableNote}>{detailPage.benchmarkTable.note}</p>
          </article>
          <TechChoicePanel items={project.techChoice} />
        </div>
      </ProjectSection>

      <ProjectSection id="troubleshooting" label="트러블슈팅" title="메인 문제 해결">
        <div className={styles.stackLayout}>
          {mainProblems.map((item) => (
            <TroubleshootingCard key={item.title} item={item} />
          ))}
          <CompactTroubleshootingGrid items={extraProblems} />
        </div>
      </ProjectSection>

      <ProjectSection id="architecture" label="아키텍처" title="구조 설계">
        <div className={styles.splitBoard}>
          <ArchitectureBlock notes={detailPage.architectureNotes} />
          <FactPanel title="설계 판단" facts={architectureFacts} />
        </div>
      </ProjectSection>

      <ProjectSection id="retrospective" label="회고" title="회고">
        <RetrospectivePanel items={project.retrospective} />
      </ProjectSection>
    </>
  );
}
