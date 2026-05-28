import Tag from "../../ui/Tag";
import { coverImages } from "../../../data/projectImages";
import styles from "./Projects.module.css";

export default function ProjectCard({ project, index, onOpen }) {
  const imgs = coverImages[project.id];
  return (
    <article className={styles.card} onClick={() => onOpen(project)}>
      {/* Number + divider */}
      <div className={styles.cardNum}>
        <span className={styles.num}>{project.num}</span>
        <div className={styles.divider} />
      </div>

      {/* Cover image */}
      <div className={styles.cover}>
        {imgs?.src ? (
          <img
            src={imgs.src}
            alt={project.title}
            loading={index === 0 ? "eager" : "lazy"}
            onError={(e) => {
              e.currentTarget.onerror = null;
              if (imgs.fallback) e.currentTarget.src = imgs.fallback;
              else e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className={styles.coverPlaceholder}>
            <span className={styles.placeholderText}>{project.title[0]}</span>
          </div>
        )}
        <div className={styles.coverOverlay} />
      </div>

      {/* Content */}
      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{project.title}</h2>
        <p className={styles.cardSubtitle}>{project.subtitle}</p>

        <div className={styles.cardMeta}>
          <span className={styles.period}>{project.period}</span>
          <span className={styles.metaDot}>·</span>
          <span className={styles.team}>{project.team}</span>
        </div>

        {/* Stack tags */}
        <div className={styles.tags}>
          {project.stack.slice(0, 5).map((s) => <Tag key={s}>{s}</Tag>)}
          {project.stack.length > 5 && (
            <Tag>+{project.stack.length - 5}</Tag>
          )}
        </div>

        {/* Highlights */}
        <ul className={styles.cardHighlights}>
          {project.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className={styles.highlight}>
              <span className={styles.arrow}>›</span>
              {h}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={styles.cta}>
          <span>자세히 보기</span>
          <span className={styles.ctaArrow}>↗</span>
        </div>
      </div>
    </article>
  );
}
