import styles from "./ProjectPage.module.css";
import {
  ArchitectureBlock,
  CompactTroubleshootingGrid,
  FactPanel,
  FlowGrid,
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
  const architectureFacts = [
    {
      label: "책임 분리",
      value: "요청 검증과 작업 처리를 분리해 API 응답 경로가 긴 AI 작업에 묶이지 않도록 했습니다.",
    },
    {
      label: "중복 방어",
      value: "Redis 락은 1차 방어선으로 두고, 결과 저장 단계에서는 jobId 기준 dedup을 한 번 더 걸어 중복 반영을 줄였습니다.",
    },
    {
      label: "일관성 기준",
      value: "afterCommit 발행, dedup, 메시지 삭제/재처리 분리로 외부 작업 시작 시점과 실패 처리 기준을 명확히 잡았습니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현" title="구현 내용">
        <FlowGrid items={detailPage.userFlows} />
        <SummaryCardGrid items={project.implementations} />
        <TechChoicePanel items={project.techChoice} />
      </ProjectSection>

      <ProjectSection id="troubleshooting" label="트러블슈팅" title="메인 문제 해결">
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
