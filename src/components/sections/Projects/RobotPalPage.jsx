import styles from "./ProjectPage.module.css";
import {
  FactPanel,
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
  const architectureFacts = [
    {
      label: "책임 분리",
      value: "시뮬레이션 루프와 프레임 전달 경로를 나눠 병목이 생기는 단계를 바로 확인할 수 있게 했습니다.",
    },
    {
      label: "데이터 흐름",
      value: "readback은 PBO, 인코딩과 전달 단계는 큐 기반 워커 구조로 분리해 각 단계의 점유 시간을 따로 볼 수 있게 했습니다.",
    },
    {
      label: "실행 경로",
      value: "같은 C++ 코어를 데스크톱과 WebAssembly 경로로 연결하고, 웹 실행 조건은 별도 계층에서 맞췄습니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현" title="구현 내용">
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
          </article>
        </div>
      </ProjectSection>

      <ProjectSection id="troubleshooting" label="트러블슈팅" title="메인 문제 해결">
        <div className={styles.stackLayout}>
          {project.problems.map((item) => (
            <TroubleshootingCard key={item.title} item={item} />
          ))}
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
