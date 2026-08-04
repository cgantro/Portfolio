import styles from "./ProjectPage.module.css";
import {
  HeroCard,
  ProjectSection,
  RetrospectivePanel,
  SimpleTable,
  SummaryCardGrid,
  TechChoicePanel,
  TroubleshootingCard,
  ArchitectureBlock,
} from "./ProjectPageBlocks";

export default function RobotPalPage({ project, detailPage, links }) {
  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현 내용" title="구현 내용">
        <div className={styles.stackLayout}>
          <SummaryCardGrid items={project.implementations} />
          <TechChoicePanel items={project.techChoice} />
          <article className={styles.surfaceCard}>
            <h3 className={styles.cardTitle}>{detailPage.benchmarkTable.title}</h3>
            <SimpleTable
              headers={detailPage.benchmarkTable.headers}
              rows={detailPage.benchmarkTable.rows}
            />
            <p className={styles.tableNote}>{detailPage.benchmarkTable.note}</p>
            <code className={styles.formula}>final_throughput = consumed / measured_seconds</code>
          </article>
        </div>
      </ProjectSection>

      <ProjectSection id="troubleshooting" label="문제 해결" title="문제 해결">
        <div className={styles.stackLayout}>
          {project.problems.map((item) => (
            <TroubleshootingCard key={item.title} item={item} />
          ))}
        </div>
      </ProjectSection>

      <ProjectSection id="architecture" label="아키텍처" title="아키텍처">
        <ArchitectureBlock notes={detailPage.architectureNotes} image={detailPage.architectureImage} />
      </ProjectSection>

      <ProjectSection id="retrospective" label="한계와 추가 검증" title="한계와 추가 검증">
        <RetrospectivePanel items={project.retrospective} />
      </ProjectSection>
    </>
  );
}
