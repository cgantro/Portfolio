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

export default function AutowingPage({ project, detailPage, links }) {
  const mainProblems = project.problems.slice(0, 2);
  const extraProblems = project.problems.slice(2);
  const architectureFacts = [
    {
      label: "상태 반영",
      value: "관제 명령이 아니라 장비가 보낸 상태 이벤트를 기준으로 최종 상태를 반영합니다.",
    },
    {
      label: "메시지 순서",
      value: "DB 트랜잭션이 끝난 뒤 MQTT와 WebSocket 메시지를 발행합니다.",
    },
    {
      label: "채널",
      value: "제어, 영상, 보조 데이터를 다른 채널로 전송합니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현 내용" title="구현 내용">
        <div className={styles.stackLayout}>
          <SummaryCardGrid items={project.implementations} />
          <TechChoicePanel items={project.techChoice} />
        </div>
      </ProjectSection>

      <ProjectSection id="troubleshooting" label="문제 해결" title="문제 해결">
        <div className={styles.stackLayout}>
          {mainProblems.map((item) => (
            <TroubleshootingCard key={item.title} item={item} />
          ))}
          <CompactTroubleshootingGrid items={extraProblems} />
        </div>
      </ProjectSection>

      <ProjectSection id="architecture" label="시스템 구성" title="시스템 구성">
        <div className={styles.stackLayout}>
          <div className={styles.splitBoard}>
            <ArchitectureBlock notes={detailPage.architectureNotes} />
            <FactPanel title="설계 판단" facts={architectureFacts} />
          </div>
          <article className={styles.surfaceCard}>
            <h3 className={styles.cardTitle}>{detailPage.designMetrics.title}</h3>
            <SimpleTable
              headers={detailPage.designMetrics.headers}
              rows={detailPage.designMetrics.rows}
            />
            <p className={styles.tableNote}>{detailPage.designMetrics.note}</p>
          </article>
        </div>
      </ProjectSection>

      <ProjectSection id="retrospective" label="한계와 추가 검증" title="한계와 추가 검증">
        <RetrospectivePanel items={project.retrospective} />
      </ProjectSection>
    </>
  );
}
