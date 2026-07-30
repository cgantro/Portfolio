import SectionLabel from "../../ui/SectionLabel";
import styles from "./Contact.module.css";

export default function Contact({ meta }) {
  return (
    <>
      <SectionLabel>Contact</SectionLabel>

      <div className={styles.wrapper}>
        <p className={styles.message}>
          Email, GitHub, Resume로 연락할 수 있습니다.
        </p>

        <div className={styles.links}>
          <a href={`mailto:${meta.email}`} className={styles.link}>
            <span className={styles.linkLabel}>Email</span>
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
            © 2026 Hong Yoonpyo
          </span>
        </div>
      </div>
    </>
  );
}
