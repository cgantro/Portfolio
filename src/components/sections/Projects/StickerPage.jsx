import styles from "./ProjectPage.module.css";
import {
  ArchitectureBlock,
  CopyCard,
  DesignConsiderationPanel,
  EvidenceList,
  FactCard,
  FlowGrid,
  HeroCard,
  LinkGroup,
  ProjectSection,
  RetrospectivePanel,
  SummaryCard,
  TechChoicePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function StickerPage({ project, detailPage, links }) {
  const referenceLinks = detailPage.links ?? [];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection
        id="overview"
        label="개요"
        title="결정 비용을 줄이기 위해 옷장 데이터를 추천 가능한 자산으로 바꿨습니다"
        lead="STICKER는 내 옷을 디지털 자산으로 정리하고, 매일의 추천과 조정을 운영 가능한 백엔드 흐름으로 연결하는 데 초점을 맞춘 서비스입니다."
      >
        <div className={styles.splitBoard}>
          <CopyCard title="서비스 맥락" paragraphs={detailPage.context.body} />
          <FactCard title="핵심 범위" facts={detailPage.context.facts} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="architecture"
        label="아키텍처"
        title="앱 응답과 AI 작업을 분리한 비동기 추천 구조"
        lead="추천 생성 시간이 길어질 수 있기 때문에 앱 응답과 AI 처리를 같은 경로에 두지 않고, 큐를 중심으로 경계를 나눴습니다."
      >
        <div className={styles.splitBoard}>
          <ArchitectureBlock notes={detailPage.architectureNotes} />
          <SummaryCard
            title="비동기 파이프라인"
            items={[
              "앱 요청은 Spring Boot API에서 검증 후 큐에 적재합니다.",
              "추천과 조정은 FastAPI AI 서버가 비동기로 처리합니다.",
              "저장, 캐시, 인증, 푸시 알림을 운영 경계 안에서 분리해 묶었습니다.",
            ]}
            snippet={project.implementations[0].snippet}
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="implementation"
        label="구현"
        title="사용자 흐름과 운영 경로를 같이 보이도록 정리했습니다"
        lead="기능 카드만 예쁘게 놓는 대신, 업로드부터 추천·조정·저장까지의 사용자 흐름과 그 뒤에서 받치는 운영 구조를 함께 드러냈습니다."
      >
        <FlowGrid items={detailPage.userFlows} />
        <div className={styles.altBoard}>
          {project.implementations.map((item) => (
            <SummaryCard
              key={item.title}
              title={item.title}
              items={item.items}
              snippet={item.snippet}
            />
          ))}
        </div>
      </ProjectSection>

      <ProjectSection
        id="troubleshooting"
        label="트러블슈팅"
        title="운영 중복과 실패 분기를 먼저 통제했습니다"
        lead="AI 파이프라인은 성공 경로보다 실패와 중복이 더 빨리 문제를 만듭니다. 그래서 큐 소비, 중복 추천, 토큰 재사용 방어를 우선 정리했습니다."
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
        title="정량 수치보다 운영 정책과 코드 경계를 근거로 남겼습니다"
        lead="측정된 latency 통계가 없는 영역은 억지 숫자를 만들지 않고, TTL, 락, ACK 전략, 토큰 정책 같은 설계 기준으로 설명을 묶었습니다."
      >
        <div className={styles.evidenceBoard}>
          <EvidenceList notes={detailPage.evidenceNotes} />
          <DesignConsiderationPanel title="운영 설계 기준" items={detailPage.designConsiderations} />
          <TechChoicePanel items={project.techChoice} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="retrospective"
        label="회고"
        title="다음 단계는 수치 계측과 추천 설명 가능성 강화입니다"
        lead="운영 경계는 먼저 정리됐고, 이제는 추천 품질과 성능을 더 직접적인 지표로 남기는 단계가 필요합니다."
      >
        <div className={styles.stackLayout}>
          <RetrospectivePanel items={project.retrospective} />
          {referenceLinks.length > 0 ? (
            <article className={styles.surfaceCard}>
              <h3 className={styles.cardTitle}>참고 자료</h3>
              <p className={styles.bodyText}>
                팀 포트폴리오 원본은 보조 레퍼런스로만 유지했습니다. 본문 설명의 기준은 저장소와 구현 구조입니다.
              </p>
              <LinkGroup links={referenceLinks} />
            </article>
          ) : null}
        </div>
      </ProjectSection>
    </>
  );
}

