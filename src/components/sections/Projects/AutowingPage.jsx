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
      label: "책임 분리",
      value: "관리 UI는 상태 확인과 모니터링에 집중하고, 백엔드는 명령 라우팅과 인메모리 맵 그래프 기반 경로 추천을 맡도록 분리했습니다.",
    },
    {
      label: "채널 분리",
      value: "명령과 상태는 MQTT, 현장 영상은 WebRTC 기반 스트림으로 분리해 서로 다른 지연 기준이 한 흐름에 묶이지 않게 했습니다.",
    },
    {
      label: "재계산 기준",
      value: "현재 위치와 진행 문맥을 기준으로 그래프 탐색 시작점을 다시 잡아 설명 가능한 경로 추천 흐름을 유지했습니다.",
    },
  ];

  return (
    <>
      <HeroCard project={project} detailPage={detailPage} links={links} />

      <ProjectSection id="implementation" label="구현" title="구현 내용">
        <div className={styles.stackLayout}>
          <FactPanel title="상태 전이 흐름" snippet={project.implementations[0].snippet} facts={[]} />
          <TimelinePanel
            title="프로토타입 시나리오 흐름"
            items={[
              {
                title: "차량 연결 요청",
                items: [
                  "기체와 견인차 연결 요청이 오면 관리 화면 상태와 차량 상태를 먼저 확인합니다.",
                  "마커 신호와 AI 서버에서 전달된 보조 판단 결과는 출발 가능 여부를 결정하는 입력으로 사용합니다.",
                ],
              },
              {
                title: "미션 경로 생성과 출발 확인",
                items: [
                  "백엔드는 미션 경로를 계산하고, 차량은 현재 위치와 상태를 MQTT 경로로 보고합니다.",
                  "운영자가 승인하거나 출발 조건이 충족돼야 실제 출발 상태로 전이됩니다.",
                ],
              },
              {
                title: "차단 구간과 우회",
                items: [
                  "주행 도중 길이 막히면 현재 위치와 이미 진행된 구간을 기준으로 우회 경로를 다시 계산합니다.",
                  "운영자는 영상 피드로 현장 상황을 확인하고, 시스템은 재계산된 경로를 기준으로 이후 상태 흐름을 갱신합니다.",
                ],
              },
              {
                title: "비상 정지와 복귀",
                items: [
                  "긴급 정지 이후에는 수동 개입, 확인 해제, 재출발 조건을 다시 통과해야 합니다.",
                  "이 흐름을 상태 전이 기준으로 분리해 제어와 운영 설명이 어긋나지 않게 했습니다.",
                ],
              },
            ]}
          />
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

      <ProjectSection id="architecture" label="아키텍처" title="구조 설계">
        <div className={styles.splitBoard}>
          <ArchitectureBlock notes={detailPage.architectureNotes} />
          <FactPanel title="설계 판단" facts={architectureFacts} snippet={project.implementations[1].snippet} />
        </div>
      </ProjectSection>

      <ProjectSection id="retrospective" label="회고" title="회고">
        <RetrospectivePanel items={project.retrospective} />
      </ProjectSection>
    </>
  );
}
