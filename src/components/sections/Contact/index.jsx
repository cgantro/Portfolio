import SectionLabel from "../../ui/SectionLabel";
import styles from "./Contact.module.css";

export default function Contact({ meta }) {
  return (
    <>
      <SectionLabel>연락처</SectionLabel>

      <div className={styles.wrapper}>
        <p className={styles.message}>
          메일이나 GitHub으로 편하게 연락주세요.
        </p>

        <div className={styles.links}>
          <a href={`mailto:${meta.email}`} className={styles.link}>
            <span className={styles.linkLabel}>이메일</span>
            <span className={styles.linkVal}>{meta.email}</span>
            <span className={styles.arrow}>→</span>
          </a>

          <a
            href={meta.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.linkLabel}>GitHub</span>
            <span className={styles.linkVal}>github.com/cgantro</span>
            <span className={styles.arrow}>→</span>
          </a>
        </div>

        <div className={styles.footer}>
          <span className={styles.footerText}>
            © 2026 홍윤표 — built with React + Vite
          </span>
        </div>
      </div>
    </>
  );
}
