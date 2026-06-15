import styles from "./ProjectPage.module.css";
import {
  ArchitectureBlock,
  CompactTroubleshootingGrid,
  FactPanel,
  HeroCard,
  ProjectSection,
  RetrospectivePanel,
  SummaryCardGrid,
  TechChoicePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function MausoleumPage({ project, detailPage, links }) {
  const mainProblems = project.problems.slice(0, 2);
  const extraProblems = project.problems.slice(2);
  const architectureFacts = [
    {
      label: "책임 분리",
      value: "클라이언트는 캡처, 코덱, UDP 전송, 재생 단계로 나누고 서버는 방 단위 처리와 청취 판정을 분리했습니다.",
    },
    {
      label: "데이터 경로",
      value: "roomCode 기준 큐 적재와 방 단위 브로드캐스트 흐름을 따로 둬 보이스 경로를 추적하기 쉽게 만들었습니다.",
    },
    {
      label: "규칙 확장",
      value: "생사 상태별 청취 가능 여부는 전략 레이어에서 바꾸고, 전송 파이프라인은 그대로 유지했습니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현" title="구현 내용">
        <div className={styles.singleBoard}>
          <SummaryCardGrid items={project.implementations} />
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
