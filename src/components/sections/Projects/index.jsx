import { useState, useRef, useEffect } from "react";
import SectionLabel from "../../ui/SectionLabel";
import ProjectDetail from "./ProjectDetail";
import Tag from "../../ui/Tag";
import useCardTilt from "../../../hooks/useCardTilt";
import styles from "./Projects.module.css";

export default function Projects({ projects }) {
  const [selected, setSelected] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const sceneRef = useRef(null);
  const [radius, setRadius] = useState(300);

  useEffect(() => {
    const updateRadius = () => {
      if (sceneRef.current) {
        const width = sceneRef.current.offsetWidth;
        setRadius((width / 2) / Math.tan(Math.PI / 3));
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const rotateY = currentIndex * -120;

  return (
    <>
      <SectionLabel>주력 프로젝트</SectionLabel>

      <div className={styles.prismScene} ref={sceneRef}>
        <button 
          className={`${styles.prismNav} ${styles.prismPrev}`}
          onClick={() => setCurrentIndex(i => i - 1)}
        >
          ‹
        </button>

        <div 
          className={styles.prism}
          style={{ transform: `translateZ(${-radius}px) rotateY(${rotateY}deg)` }}
        >
          {projects.map((p, i) => {
            const faceAngle = i * 120;
            return (
              <div 
                key={p.id} 
                className={styles.prismFace}
                style={{ transform: `rotateY(${faceAngle}deg) translateZ(${radius}px)` }}
              >
                <BentoCard project={p} onClick={() => setSelected(p)} />
              </div>
            );
          })}
        </div>

        <button 
          className={`${styles.prismNav} ${styles.prismNext}`}
          onClick={() => setCurrentIndex(i => i + 1)}
        >
          ›
        </button>
      </div>

      {selected && (
        <ProjectDetail 
          project={selected} 
          allProjects={projects}
          onClose={() => setSelected(null)} 
          onNavigate={(newProject) => setSelected(newProject)}
        />
      )}
    </>
  );
}

function BentoCard({ project, isLarge, onClick }) {
  // Bento 타일에서도 틸팅(Glare) 효과 적용
  const { cardStyle, glarePos, onMouseMove, onMouseLeave } = useCardTilt(10);

  return (
    <article
      className={styles.bentoCard}
      style={cardStyle}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {/* 커서 글레어 */}
      <div
        className={styles.glare}
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0,255,65,0.18) 0%, transparent 65%)`,
          opacity: glarePos.opacity,
        }}
      />

      {/* 커버 이미지 영역 */}
      <div className={styles.bentoCover}>
        {project.cover ? (
          <img
            src={project.cover}
            alt={project.title}
            onError={(e) => {
              if (project.coverFallback) e.currentTarget.src = project.coverFallback;
              else e.currentTarget.parentElement.style.display = "none";
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

      {/* 정보 영역 */}
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

        <div className={styles.bentoTags}>
          {project.stack.slice(0, 4).map((s) => <Tag key={s}>{s}</Tag>)}
          {project.stack.length > 4 && <Tag>+{project.stack.length - 4}</Tag>}
        </div>

        <div className={styles.bentoDivider} />

        <ul className={styles.bentoHighlights}>
          {project.highlights.map((h, i) => (
            <li key={i} className={styles.hl}>
              <span className={styles.arrow}>›</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className={styles.cta}>
          <span>자세히 보기</span>
          <span className={styles.ctaArrow}>↗</span>
        </div>
      </div>
    </article>
  );
}
