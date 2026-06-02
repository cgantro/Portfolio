import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar({ meta, sections, activeSection }) {
  return (
    <aside className={styles.sidebar}>
      {/* Profile */}
      <div className={styles.profile}>
        <div className={styles.avatar}>
          <img
            src={meta.profile}
            alt={meta.name}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
        <Link to="/" className={styles.name}>
          {meta.name}
        </Link>
        <div className={styles.role}>{meta.role}</div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={[styles.navItem, activeSection === s.id ? styles.active : ""].join(" ")}
          >
            <span className={styles.navDot} />
            {s.label}
          </a>
        ))}
      </nav>

      {/* Links */}
      <div className={styles.links}>
        <a href={`mailto:${meta.email}`} className={styles.link}>
          <span className={styles.linkIcon}>✉</span>
          {meta.email}
        </a>
        <a href={meta.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
          <span className={styles.linkIcon}>⌥</span>
          github.com/cgantro
        </a>
      </div>

      {/* Decorative terminal prompt */}
      <div className={styles.prompt}>
        <span className={styles.promptUser}>yoonpyo</span>
        <span className={styles.promptAt}>@</span>
        <span className={styles.promptHost}>portfolio</span>
        <span className={styles.promptChar}> $</span>
        <span className={styles.cursor} />
      </div>
    </aside>
  );
}
