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
      <SectionLabel>Projects</SectionLabel>

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
  const [roleSpotlight, problemSpotlight, resultSpotlight] = project.detailPage?.spotlight ?? [];

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
            style={{ objectFit: imgs.fit ?? "cover" }}
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

        {project.metric ? (
          <div className={styles.metric}>
            <strong>{project.metric}</strong>
            <span>{project.metricLabel}</span>
            <small>{project.benchmark}</small>
          </div>
        ) : null}

        <div className={styles.signalGrid}>
          <article className={styles.signalCard}>
            <span className={styles.signalLabel}>문제</span>
            <p className={styles.signalValue}>{problemSpotlight?.value ?? project.problems[0]?.title}</p>
          </article>
          <article className={styles.signalCard}>
            <span className={styles.signalLabel}>역할</span>
            <p className={styles.signalValue}>{roleSpotlight?.value ?? project.role}</p>
          </article>
          <article className={styles.signalCard}>
            <span className={styles.signalLabel}>결과</span>
            <p className={styles.signalValue}>{resultSpotlight?.value ?? project.highlights[0]}</p>
          </article>
        </div>

        <div className={styles.bentoTags}>
          {project.stack.slice(0, 4).map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
          {project.stack.length > 4 ? <Tag>+{project.stack.length - 4}</Tag> : null}
        </div>

        <div className={styles.cta}>
          <span>상세 페이지 보기</span>
          <span className={styles.ctaArrow}>↗</span>
        </div>
      </div>
    </article>
  );
}
