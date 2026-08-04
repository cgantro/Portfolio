import styles from "./ProjectPage.module.css";
import {
  ArchitectureBlock,
  CompactTroubleshootingGrid,
  HeroCard,
  ProjectSection,
  RetrospectivePanel,
  SummaryCardGrid,
  TechChoicePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function StickerPage({ project, detailPage, links }) {
  const mainProblems = project.problems.slice(0, 2);
  const extraProblems = project.problems.slice(2);

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현 내용" title="구현 내용">
        <div className={styles.singleBoard}>
          <SummaryCardGrid items={project.implementations} />
          <TechChoicePanel items={project.techChoice} />
        </div>
      </ProjectSection>

      <ProjectSection id="troubleshooting" label="문제 해결" title="문제 해결">
        <div className={styles.stackLayout}>
          {mainProblems.map((item, index) => (
            <TroubleshootingCard
              key={item.title}
              item={item}
              consideration={detailPage.designConsiderations[index]}
            />
          ))}
          <CompactTroubleshootingGrid items={extraProblems} />
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
