import styles from "./Intro.module.css";

const strengths = [
  { icon: "⚡", title: "실시간 성능 최적화", body: "렌더링·인코딩·전송의 병목을 분리하고 같은 조건에서 개선 결과를 검증합니다." },
  { icon: "↔", title: "통신과 동시성 설계", body: "TCP·UDP·WebSocket 환경에서 큐, 워커, 상태 흐름을 명확하게 설계합니다." },
  { icon: "◈", title: "실시간 처리 파이프라인 설계", body: "프레임·음성·상태 데이터를 처리 경로별로 분리하고, 지연과 병목을 관리합니다." },
];

const collaborationExperience = [
  { icon: "↻", title: "애자일 프로젝트 운영", body: "기능을 짧은 단위로 나누고 구현·검증 결과에 따라 다음 우선순위를 조정하는 방식으로 팀 프로젝트를 진행했습니다." },
  { icon: "7D", title: "주 단위 스프린트", body: "주간 목표와 담당 작업을 정하고, 스프린트 종료 시 완료 범위와 미해결 이슈를 확인해 다음 계획에 반영했습니다." },
  { icon: "↑", title: "데일리 스크럼", body: "매일 서서 진행하는 짧은 스크럼에서 전날 작업, 당일 계획과 차단 요소를 공유해 팀원이 필요한 지원을 빠르게 연결했습니다." },
  { icon: "◎", title: "기술 커뮤니케이션", body: "문제를 재현 조건·로그·수치로 정리하고, 모듈 인터페이스와 트레이드오프를 문서화해 팀의 판단 기준을 맞췄습니다." },
];

export default function Intro() {
  return (
    <section className={styles.intro} id="intro">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>C++ APPLICATION SOFTWARE ENGINEER</p>
        <div className={styles.symbol}>⌁</div>
        <h1 className={styles.role}>안녕하세요,<br />실시간 흐름을 설계하는<br /><em>C++ 개발자 홍윤표</em>입니다.</h1>
        <p className={styles.description}>시뮬레이터·실시간 통신·응용 소프트웨어에서 병목을 측정하고, 처리 경로를 분리해 안정적인 실행 흐름을 구현합니다.</p>
        <div className={styles.keywords}>
          {["C++17", "Simulation", "Real-time Communication", "Multithreading"].map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      </div>

      <div className={styles.strengthSection}>
        <h2>핵심 역량</h2>
        <p>구현한 시스템의 흐름을 읽고, 병목과 경계를 기준으로 개선합니다.</p>
        <div className={styles.strengthGrid}>
          {strengths.map((strength) => (
            <article key={strength.title} className={styles.strengthCard}>
              <span className={styles.strengthIcon}>{strength.icon}</span>
              <h3>{strength.title}</h3>
              <p>{strength.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.strengthSection}>
        <h2>협업 경험</h2>
        <p>애자일 방법론을 바탕으로 목표와 진행 상황, 차단 요소를 짧은 주기로 공유했습니다.</p>
        <div className={`${styles.strengthGrid} ${styles.collaborationGrid}`}>
          {collaborationExperience.map((item) => (
            <article key={item.title} className={styles.strengthCard}>
              <span className={styles.strengthIcon}>{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
