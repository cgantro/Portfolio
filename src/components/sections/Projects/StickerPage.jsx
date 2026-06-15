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
      value: "API 응답 경로, 추천 작업 생성, 결과 저장과 알림 흐름을 나눠 긴 작업이 응답 경로를 점유하지 않게 했습니다.",
    },
    {
      label: "중복 방어",
      value: "Redis 락으로 작업 시작을 한 번 걸고, 결과 저장 직전에는 jobId/date 기준으로 다시 확인해 중복 반영을 줄였습니다.",
    },
    {
      label: "재처리 기준",
      value: "afterCommit 이후 외부 작업 시작, 실패 유형 분리, 토큰 회전 정책을 나눠 운영 흐름을 추적하기 쉽게 했습니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현" title="구현 내용">
        <div className={styles.stackLayout}>
          <SummaryCardGrid items={project.implementations} />
          <FlowGrid items={detailPage.userFlows} />
          <TechChoicePanel items={project.techChoice} />
        </div>
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
