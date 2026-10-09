import styles from "./Intro.module.css";

const strengths = [
  { icon: "⚡", title: "실시간 성능 개선", body: "화면 그리기와 이미지 압축, 데이터 전송에 걸리는 시간을 따로 재고 느린 구간을 줄입니다." },
  { icon: "↔", title: "통신과 여러 작업 처리", body: "데이터 전달 방식에 맞춰 순서와 지연을 조절하고, 대기열과 여러 작업 흐름으로 요청을 함께 처리합니다." },
  { icon: "◈", title: "실시간 데이터 처리", body: "영상과 음성, 장비 상태를 각각 필요한 경로로 보내고 처리 시간을 관리합니다." },
];

const collaborationExperience = [
  { icon: "↻", title: "짧은 개발 주기로 협업", body: "기능을 작은 단위로 나누고 구현과 확인 결과에 따라 다음 작업의 우선순위를 조정했습니다." },
  { icon: "7D", title: "주간 작업 계획", body: "한 주의 목표와 담당 작업을 정하고, 주가 끝날 때 완료한 내용과 남은 문제를 다음 계획에 반영했습니다." },
  { icon: "↑", title: "매일 진행 상황 공유", body: "전날 작업과 당일 계획, 막힌 일을 짧게 공유하고 필요한 지원을 연결했습니다." },
  { icon: "◎", title: "기술 내용 공유", body: "문제를 다시 확인할 조건과 기록, 측정값으로 정리하고 기능 간 연결 방식과 장단점을 문서로 남겼습니다." },
];

export default function Intro() {
  return (
    <section className={styles.intro} id="intro">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>C++ 응용 소프트웨어 개발자</p>
        <div className={styles.symbol}>⌁</div>
        <h1 className={styles.role}>안녕하세요,<br />실시간 흐름을 설계하는<br /><em>C++ 개발자 홍윤표</em>입니다.</h1>
        <p className={styles.description}>시뮬레이터와 실시간 통신 프로그램의 느린 구간을 측정하고 처리 흐름을 나눠 안정적으로 동작하게 만듭니다.</p>
        <div className={styles.keywords}>
          {["C++17", "로봇 시뮬레이션", "실시간 통신", "여러 작업 동시 실행"].map((keyword) => <span key={keyword}>{keyword}</span>)}
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
        <p>목표와 진행 상황, 막힌 일을 짧은 주기로 공유했습니다.</p>
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
