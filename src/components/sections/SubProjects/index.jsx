import SectionLabel from "../../ui/SectionLabel";
import Tag from "../../ui/Tag";
import styles from "./SubProjects.module.css";

export default function SubProjects({ projects }) {
  return (
    <>
      <SectionLabel>Sticker & More</SectionLabel>

      <div className={styles.grid}>
        {projects.map((p) => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.title}>{p.title}</span>
              {p.links?.github && (
                <a
                  href={p.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ghLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  ⌥
                </a>
              )}
            </div>
            <p className={styles.subtitle}>{p.subtitle}</p>
            <p className={styles.summary}>{p.summary}</p>
            <div className={styles.footer}>
              <div className={styles.tags}>
                {p.stack.slice(0, 4).map((s) => <Tag key={s}>{s}</Tag>)}
              </div>
              <span className={styles.period}>{p.period}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
