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
  SummaryCard,
  TechChoicePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function MausoleumPage({ project, detailPage, links }) {
  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection
        id="overview"
        label="개요"
        title="게임 규칙과 보이스 지연 요구사항을 동시에 맞춘 프로젝트"
        lead="영묘는 멀티플레이 규칙과 음성 채팅이 서로 다른 제약을 갖기 때문에, 둘을 한 구조에 섞지 않는 것이 핵심이었습니다."
      >
        <div className={styles.splitBoard}>
          <CopyCard title="프로젝트 배경" paragraphs={detailPage.context.body} />
          <FactCard title="중심 과제" facts={detailPage.context.facts} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="architecture"
        label="아키텍처"
        title="로비 동기화와 보이스 전송을 다른 경로로 분리"
        lead="신뢰성이 중요한 로비/상태 동기화와 낮은 지연이 중요한 음성 전송을 분리해, 각 문제를 독립적으로 디버깅할 수 있게 했습니다."
      >
        <div className={styles.splitBoard}>
          <ArchitectureBlock notes={detailPage.architectureNotes} />
          <DesignConsiderationPanel title="설계 판단" items={detailPage.designConsiderations} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="implementation"
        label="구현"
        title="UE5 보이스 경로와 상태 규칙을 코드 구조로 분리"
        lead="클라이언트 안에서는 캡처, 코덱, 네트워크, 재생을 명확히 나누고, 게임 규칙은 전략과 페이즈 구조로 분리했습니다."
      >
        <div className={styles.altBoard}>
          <SummaryCard
            title={project.implementations[0].title}
            items={project.implementations[0].items}
            snippet={project.implementations[0].snippet}
          />
          <SummaryCard
            title={project.implementations[1].title}
            items={project.implementations[1].items}
            snippet={project.implementations[1].snippet}
          />
        </div>
        <div className={styles.singleBoard}>
          <SummaryCard
            title={project.implementations[2].title}
            items={project.implementations[2].items}
            snippet={project.implementations[2].snippet}
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="troubleshooting"
        label="트러블슈팅"
        title="지연, 규칙, 상태 전환을 같은 방식으로 풀지 않았습니다"
        lead="보이스와 게임 규칙이 서로 다른 종류의 문제였기 때문에, 전송 경로 분리와 상태 전략 분리를 각각 따로 다뤘습니다."
      >
        <div className={styles.issueGrid}>
          {project.problems.map((item, index) => (
            <TroubleshootingCard
              key={item.title}
              item={item}
              consideration={detailPage.designConsiderations[index]}
            />
          ))}
        </div>
      </ProjectSection>

      <ProjectSection
        id="evidence"
        label="근거"
        title="측정 수치보다 구조 선택의 이유를 명확히 남겼습니다"
        lead="이 프로젝트는 저지연 음성, 상태 규칙, 서버 분리의 판단 근거를 소스 구조와 README 기준으로 정리하는 것이 더 중요했습니다."
      >
        <div className={styles.evidenceBoard}>
          <EvidenceList notes={detailPage.evidenceNotes} />
          <TechChoicePanel items={project.techChoice} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="retrospective"
        label="회고"
        title="품질 계측과 규칙 중앙화는 다음 단계에서 더 보강해야 합니다"
        lead="지금은 구조를 나누는 데 집중했고, 다음 단계에서는 지표 수집과 더 명시적인 상태 머신으로 안정성을 끌어올릴 여지가 큽니다."
      >
        <RetrospectivePanel items={project.retrospective} />
      </ProjectSection>
    </>
  );
}

