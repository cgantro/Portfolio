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
  TimelinePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function AutowingPage({ project, detailPage, links }) {
  const mainProblems = project.problems.slice(0, 2);
  const extraProblems = project.problems.slice(2);
  const architectureFacts = [
    {
      label: "source of truth",
      value: "상태 전이의 기준은 DB와 백엔드 서비스가 잡고, 화면과 차량 이벤트는 그 흐름을 따라가도록 정리했습니다.",
    },
    {
      label: "event boundary",
      value: "트랜잭션이 활성화된 경우 커밋 이후에만 MQTT 이벤트가 시작되도록 분리해 커밋 전 상태 노출을 줄였습니다.",
    },
    {
      label: "channel responsibility",
      value: "MQTT는 상태와 명령, WebRTC는 영상 확인, AI 결과는 보조 입력으로 구분해 채널별 책임을 분명하게 했습니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현" title="구현 내용">
        <div className={styles.stackLayout}>
          <SummaryCardGrid items={project.implementations} />
          <TimelinePanel title="상태 전이 시나리오" items={detailPage.scenarios} />
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

      <ProjectSection id="retrospective" label="회고" title="회고">
        <RetrospectivePanel items={project.retrospective} />
      </ProjectSection>
    </>
  );
}
