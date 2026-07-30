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
        <p className={styles.tagline}>{meta.tagline}</p>
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

    </aside>
  );
}
