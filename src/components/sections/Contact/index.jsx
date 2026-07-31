import styles from "./Contact.module.css";

export default function Contact({ meta }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.eyebrow}>CONTACT</p>
      <h2>함께 문제를 풀<br />기회를 기다립니다.</h2>
      <p className={styles.message}>C++ 응용 소프트웨어와 실시간 통신 개발에 관한 제안은 언제든 환영합니다.</p>
      <div className={styles.links}>
        <a href={`mailto:${meta.email}`}>이메일 보내기 <span>→</span></a>
        <a href={meta.github} target="_blank" rel="noopener noreferrer">GitHub 보기 <span>↗</span></a>
      </div>
      <p className={styles.footer}>© 2026 Hong Yoonpyo</p>
    </div>
  );
}
