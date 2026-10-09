import styles from "./Contact.module.css";

export default function Contact({ meta }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.eyebrow}>연락처</p>
      <h2>C++ 응용 소프트웨어<br />개발자로 새 팀을 찾고 있습니다.</h2>
      <p className={styles.message}>로봇 시뮬레이션과 실시간 시스템을 만드는 팀에서 일하고 싶습니다. 아래 주소로 연락해 주세요.</p>
      <div className={styles.links}>
        <a href={`mailto:${meta.email}`}>이메일 보내기 <span>→</span></a>
        <a href={meta.github} target="_blank" rel="noopener noreferrer">GitHub 보기 <span>↗</span></a>
      </div>
      <p className={styles.footer}>© 2026 홍윤표</p>
    </div>
  );
}
