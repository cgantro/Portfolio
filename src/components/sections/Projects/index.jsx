import { useNavigate } from "react-router-dom";
import SectionLabel from "../../ui/SectionLabel";
import Tag from "../../ui/Tag";
import useCardTilt from "../../../hooks/useCardTilt";
import { coverImages } from "../../../data/projectImages";
import styles from "./Projects.module.css";

export default function Projects({ projects }) {
  const navigate = useNavigate();

  return (
    <>
      <SectionLabel>주력 프로젝트</SectionLabel>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <BentoCard
            key={project.id}
            project={project}
            onClick={() => navigate(`/projects/${project.id}`)}
          />
        ))}
      </div>
    </>
  );
}

function BentoCard({ project, onClick }) {
  const { cardStyle, glarePos, onMouseMove, onMouseLeave } = useCardTilt(8);
  const imgs = coverImages[project.id];

  return (
    <article
      className={styles.bentoCard}
      style={cardStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
    >
      <div
        className={styles.glare}
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0,255,65,0.15) 0%, transparent 68%)`,
          opacity: glarePos.opacity,
        }}
      />

      <div className={styles.bentoCover}>
        {imgs?.src ? (
          <img
            src={imgs.src}
            alt={project.title}
            onError={(event) => {
              event.currentTarget.onerror = null;
              if (imgs.fallback) {
                event.currentTarget.src = imgs.fallback;
              } else {
                event.currentTarget.parentElement.style.display = "none";
              }
            }}
          />
        ) : (
          <div className={styles.coverPh}>
            <span>{project.title[0]}</span>
          </div>
        )}
        <div className={styles.bentoCoverGrad} />
        <span className={styles.numBadge}>{project.num}</span>
      </div>

      <div className={styles.bentoBody}>
        <div className={styles.bentoHeader}>
          <h2 className={styles.title}>{project.title}</h2>
          <p className={styles.subtitle}>{project.subtitle}</p>
        </div>

        <div className={styles.metaRow}>
          <span>{project.period}</span>
          <span className={styles.dot2}>·</span>
          <span>{project.team}</span>
        </div>

        <p className={styles.roleText}>{project.role}</p>

        <div className={styles.bentoTags}>
          {project.stack.slice(0, 4).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
          {project.stack.length > 4 ? <Tag>+{project.stack.length - 4}</Tag> : null}
        </div>

        <div className={styles.bentoDivider} />

        <ul className={styles.bentoHighlights}>
          {project.highlights.map((item) => (
            <li key={item} className={styles.hl}>
              <span className={styles.arrow}>›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <span>상세 페이지 보기</span>
          <span className={styles.ctaArrow}>↗</span>
        </div>
      </div>
    </article>
  );
}
