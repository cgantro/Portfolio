import styles from "./Intro.module.css";

export default function Intro() {
  return (
    <section className={styles.intro} id="intro">
      <p className={styles.eyebrow}>INTRO</p>
      <h1 className={styles.role}>C++ Application Software Engineer</h1>
      <p className={styles.description}>
        C++ 기반 시뮬레이터와 실시간 통신 기능을 개발했습니다.<br />
        실행 조건을 고정해 병목을 측정하고, 처리 흐름을 분리해 개선 결과를 검증합니다.
      </p>
      <div className={styles.keywords}>
        {["C++17", "Multithreading", "Socket Programming", "Simulation"].map((keyword) => <span key={keyword}>{keyword}</span>)}
      </div>
    </section>
  );
}
