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
  SimpleTable,
  SummaryCard,
  TechChoicePanel,
  TimelinePanel,
  TroubleshootingCard,
} from "./ProjectPageBlocks";

export default function AutowingPage({ project, detailPage, links }) {
  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection
        id="overview"
        label="개요"
        title="공항 지상 이동 절차를 시스템 구조로 바꾸는 작업"
        lead="오토잉카에서 중요한 것은 화려한 주행 데모보다 운영 절차를 설명 가능한 시스템으로 만드는 일이었습니다."
      >
        <div className={styles.splitBoard}>
          <CopyCard title="도메인 맥락" paragraphs={detailPage.context.body} />
          <FactCard title="이번에 정리한 축" facts={detailPage.context.facts} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="architecture"
        label="아키텍처"
        title="명령, 영상, 경로 계획의 책임을 분리한 관제 구조"
        lead="같은 실시간 데이터라도 지연 허용치와 장애 양상이 다르기 때문에 채널을 나누고, 관제실과 차량 사이의 책임을 구분했습니다."
      >
        <div className={styles.splitBoard}>
          <ArchitectureBlock notes={detailPage.architectureNotes} />
          <DesignConsiderationPanel
            title="역할 분리 기준"
            items={[
              {
                title: "관제실",
                body: "운영 UI와 현장 확인을 맡고, 승인과 개입의 근거를 남기는 쪽에 집중합니다.",
              },
              {
                title: "백엔드",
                body: "명령 라우팅, 상태 수집, 경로 계산과 재탐색 판단을 담당합니다.",
              },
              {
                title: "차량과 AI 모듈",
                body: "온보드 주행 제약과 도킹/수신호 같은 현장 판단을 로컬에 가까운 계층에서 다룹니다.",
              },
            ]}
          />
        </div>
      </ProjectSection>

      <ProjectSection
        id="implementation"
        label="구현"
        title="운영 절차를 명령 채널과 상태 전이로 정리했습니다"
        lead="장식용 타일 대신 실제 시나리오 기준으로 관제 흐름을 단계별로 설명하고, 각 구현 축을 별도 카드로 나눴습니다."
      >
        <div className={styles.stackLayout}>
          <TimelinePanel
            title="운영 시나리오"
            items={[
              {
                title: "도킹과 연결 요청",
                items: [
                  "기체와 토잉카 연결 요청이 올라오면 관제실이 상태와 승인을 확인합니다.",
                  "마샬러 신호와 도킹 AI 보조 판단은 출발 가능 여부의 입력으로 사용됩니다.",
                ],
              },
              {
                title: "미션 경로 생성과 출발 승인",
                items: [
                  "백엔드는 미션 경로를 계산하고, 차량은 현재 위치와 상태를 MQTT 경로로 보고합니다.",
                  "기장 승인 또는 수신호 조건이 충족되어야 실제 출발 상태로 전이됩니다.",
                ],
              },
              {
                title: "차단 구간과 우회",
                items: [
                  "활주로 일부가 막히면 마지막 통과 노드와 현재 위치를 기준으로 우회 경로를 다시 계산합니다.",
                  "관제실은 영상 피드로 현장 상황을 확인하고, 차량은 재계산된 경로를 따릅니다.",
                ],
              },
              {
                title: "비상 정지와 복귀",
                items: [
                  "긴급 정지 후에는 수동 개입, 승인 해제, 재출발 조건을 다시 통과해야 합니다.",
                  "이 흐름을 상태 전이 기준으로 분리해 제어와 운영 설명이 어긋나지 않게 했습니다.",
                ],
              },
            ]}
          />
          <div className={styles.splitBoard}>
            {project.implementations.map((item) => (
              <SummaryCard
                key={item.title}
                title={item.title}
                items={item.items}
                snippet={item.snippet}
              />
            ))}
          </div>
        </div>
      </ProjectSection>

      <ProjectSection
        id="troubleshooting"
        label="트러블슈팅"
        title="운영 시나리오와 시스템 응답이 어긋나지 않게 정리했습니다"
        lead="이 프로젝트의 문제 해결은 알고리즘 자체보다도 실제 현장 절차와 시스템 반응을 한 문맥으로 맞추는 데 가까웠습니다."
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
        title="성과 수치보다 설계 기준과 운영 파라미터를 근거로 남겼습니다"
        lead="오토잉카는 화려한 벤치마크보다 운영 파라미터를 어떤 제약 아래서 잡았는지가 더 중요했습니다."
      >
        <div className={styles.evidenceBoard}>
          <article className={styles.surfaceCard}>
            <h3 className={styles.cardTitle}>{detailPage.designMetrics.title}</h3>
            <SimpleTable
              headers={detailPage.designMetrics.headers}
              rows={detailPage.designMetrics.rows}
            />
            <p className={styles.tableNote}>{detailPage.designMetrics.note}</p>
          </article>
          <EvidenceList notes={detailPage.evidenceNotes} />
          <TechChoicePanel items={project.techChoice} />
        </div>
      </ProjectSection>

      <ProjectSection
        id="retrospective"
        label="회고"
        title="운영 시나리오를 코드 계약으로 더 강하게 고정할 필요가 남았습니다"
        lead="설명 가능한 관제 구조까지는 정리했지만, 다음 단계에서는 상태 머신과 이벤트 리플레이 수준으로 더 명시화해야 합니다."
      >
        <RetrospectivePanel items={project.retrospective} />
      </ProjectSection>
    </>
  );
}

