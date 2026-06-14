import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./MobileHeader.module.css";

export default function MobileHeader({ meta, sections, activeSection }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.name}>
          {meta.name}
        </Link>
        <button className={styles.menuBtn} onClick={() => setOpen(!open)} aria-label="메뉴">
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
          <span className={styles.menuLine} />
        </button>
      </header>

      {open && (
        <nav className={styles.drawer} onClick={() => setOpen(false)}>
          <div className={styles.intro}>
            <div className={styles.introRole}>{meta.role}</div>
            <p className={styles.introTagline}>{meta.tagline}</p>
          </div>
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={[styles.item, activeSection === s.id ? styles.active : ""].join(" ")}
            >
              {s.label}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
