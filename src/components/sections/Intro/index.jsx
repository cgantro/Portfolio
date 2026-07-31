import styles from "./Intro.module.css";

const strengths = [
  { icon: "⚡", title: "실시간 성능 최적화", body: "렌더링·인코딩·전송의 병목을 분리하고 같은 조건에서 개선 결과를 검증합니다." },
  { icon: "↔", title: "통신과 동시성 설계", body: "TCP·UDP·WebSocket 환경에서 큐, 워커, 상태 흐름을 명확하게 설계합니다." },
  { icon: "◈", title: "실시간 처리 파이프라인 설계", body: "프레임·음성·상태 데이터를 처리 경로별로 분리하고, 지연과 병목을 관리합니다." },
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
    </section>
  );
}
