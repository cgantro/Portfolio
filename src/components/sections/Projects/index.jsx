import { useState, useEffect, useCallback } from "react";
import SectionLabel from "../../ui/SectionLabel";
import ProjectDetail from "./ProjectDetail";
import Tag from "../../ui/Tag";
import useCardTilt from "../../../hooks/useCardTilt";
import styles from "./Projects.module.css";

export default function Projects({ projects }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [selected, setSelected] = useState(null);

  const prev = useCallback(() =>
    setActiveIdx((i) => (i - 1 + projects.length) % projects.length), [projects.length]);
  const next = useCallback(() =>
    setActiveIdx((i) => (i + 1) % projects.length), [projects.length]);

  useEffect(() => {
    if (selected) return;
    const fn = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [prev, next, selected]);

  return (
    <>
      <SectionLabel>주력 프로젝트</SectionLabel>

      {/* 3D 캐러셀 */}
      <div className={styles.coverflowWrap}>
        {projects.map((p, i) => {
          const offset = i - activeIdx;
          return (
            <SlideCard
              key={p.id}
              project={p}
              offset={offset}
              isActive={offset === 0}
              onActivate={() => offset !== 0 ? setActiveIdx(i) : setSelected(p)}
            />
          );
        })}
      </div>

      {/* 내비게이션 */}
      <div className={styles.carouselNav}>
        <button className={styles.navBtn} onClick={prev}>←</button>

        <div className={styles.dots}>
          {projects.map((p, i) => (
            <button
              key={p.id}
              className={[styles.dot, i === activeIdx ? styles.dotOn : ""].join(" ")}
              onClick={() => setActiveIdx(i)}
            />
          ))}
        </div>

        <span className={styles.counter}>
          <span className={styles.cCur}>{String(activeIdx + 1).padStart(2, "0")}</span>
          <span className={styles.cSep}> / </span>
          <span className={styles.cTot}>{String(projects.length).padStart(2, "0")}</span>
        </span>

        <button className={styles.navBtn} onClick={next}>→</button>
      </div>

      {selected && (
        <ProjectDetail project={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

// ── 개별 슬라이드 카드 (3D 틸트 + 글레어) ──
function SlideCard({ project, offset, isActive, onActivate }) {
  const { cardStyle, glarePos, onMouseMove, onMouseLeave } = useCardTilt(10);

  // offset별 3D 위치
  const wrapStyle = {
    transform: getCoverflowTransform(offset),
    opacity:   Math.abs(offset) === 0 ? 1 : Math.abs(offset) === 1 ? 0.35 : 0,
    zIndex:    3 - Math.abs(offset),
    pointerEvents: Math.abs(offset) <= 1 ? "auto" : "none",
    transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease",
  };

  return (
    <div className={styles.slideWrap} style={wrapStyle}>
      <article
        className={[styles.card, isActive ? styles.cardActive : ""].join(" ")}
        style={isActive ? cardStyle : {}}
        onMouseMove={isActive ? onMouseMove : undefined}
        onMouseLeave={isActive ? onMouseLeave : undefined}
        onClick={onActivate}
      >
        {/* 커서 글레어 */}
        {isActive && (
          <div
            className={styles.glare}
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(0,255,65,0.18) 0%, transparent 65%)`,
              opacity: glarePos.opacity,
            }}
          />
        )}

        {/* 커버 이미지 */}
        <div className={styles.cover}>
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
          <div className={styles.coverGrad} />
          <span className={styles.numBadge}>{project.num}</span>
        </div>

        {/* 카드 본문 */}
        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{project.title}</h2>
            <p className={styles.subtitle}>{project.subtitle}</p>
          </div>

          <div className={styles.metaRow}>
            <span>{project.period}</span>
            <span className={styles.dot2}>·</span>
            <span>{project.team}</span>
          </div>

          <div className={styles.tags}>
            {project.stack.slice(0, 5).map((s) => <Tag key={s}>{s}</Tag>)}
            {project.stack.length > 5 && <Tag>+{project.stack.length - 5}</Tag>}
          </div>

          <div className={styles.divider} />

          <ul className={styles.highlights}>
            {project.highlights.map((h, i) => (
              <li key={i} className={styles.hl}>
                <span className={styles.arrow}>›</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>

          {isActive && (
            <div className={styles.cta}>
              <span>자세히 보기</span>
              <span className={styles.ctaArrow}>↗</span>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

function getCoverflowTransform(offset) {
  if (offset === 0)  return "translateX(0) rotateY(0deg) scale(1)";
  if (offset === 1)  return "translateX(72%) rotateY(-38deg) scale(0.88)";
  if (offset === -1) return "translateX(-72%) rotateY(38deg) scale(0.88)";
  if (offset > 1)    return "translateX(140%) rotateY(-50deg) scale(0.75)";
  return                    "translateX(-140%) rotateY(50deg) scale(0.75)";
}
