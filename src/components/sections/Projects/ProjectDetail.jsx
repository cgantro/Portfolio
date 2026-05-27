import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Tag from "../../ui/Tag";
import CodeBlock from "../../ui/CodeBlock";
import styles from "./Projects.module.css";

function buildSlides(project) {
  const slides = [];
  slides.push({ type: "overview" });
  if (project.implementations?.length) {
    slides.push({ type: "section-header", label: "구현" });
    project.implementations.forEach((impl) => slides.push({ type: "impl", impl }));
  }
  if (project.problems?.length) {
    slides.push({ type: "section-header", label: "문제 해결" });
    project.problems.forEach((prob) => slides.push({ type: "problem", prob }));
  }
  if (project.teamFeatures?.length) {
    slides.push({ type: "team" });
  }
  return slides;
}

export default function ProjectDetail({ project, onClose }) {
  const slides = useMemo(() => buildSlides(project), [project]);
  const [idx, setIdx]   = useState(0);
  const [dir, setDir]   = useState(1);
  const contentRef      = useRef(null);

  const go = useCallback((delta) => {
    const next = idx + delta;
    if (next < 0 || next >= slides.length) return;
    setDir(delta);
    setIdx(next);
    contentRef.current?.scrollTo({ top: 0 });
  }, [idx, slides.length]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft")  go(-1);
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [go, onClose]);

  const slide = slides[idx];
  const animClass = dir > 0 ? styles.slideNext : styles.slidePrev;

  return (
    <div className={styles.detailOverlay} onClick={onClose}>
      <div className={styles.detailModal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.detailHeader}>
          <span className={styles.dNum}>{project.num}</span>
          <span className={styles.dTitle}>{project.title}</span>
          <span className={styles.dCounter}>
            <span className={styles.dCurrent}>{idx + 1}</span>
            <span className={styles.dSep}> / </span>
            <span className={styles.dTotal}>{slides.length}</span>
          </span>
          <button className={styles.dClose} onClick={onClose}>✕</button>
        </div>

        <div className={styles.detailContent} ref={contentRef}>
          {/* key가 바뀌면 재마운트 → 애니메이션 트리거 */}
          <div key={`${project.id}-${idx}`} className={animClass}>
            <SlideRenderer slide={slide} project={project} />
          </div>
        </div>

        <div className={styles.detailNav}>
          <button className={styles.dNavBtn} onClick={() => go(-1)} disabled={idx === 0}>←</button>

          <div className={styles.dDots}>
            {slides.map((s, i) => (
              <button
                key={i}
                className={[styles.dDot, i === idx ? styles.dDotActive : ""].join(" ")}
                onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); contentRef.current?.scrollTo({ top: 0 }); }}
              />
            ))}
          </div>

          <button className={styles.dNavBtn} onClick={() => go(1)} disabled={idx === slides.length - 1}>→</button>
        </div>
      </div>
    </div>
  );
}

function SlideRenderer({ slide, project }) {
  switch (slide.type) {
    case "overview":       return <OverviewSlide project={project} />;
    case "section-header": return <SectionHeaderSlide label={slide.label} />;
    case "impl":           return <ImplSlide impl={slide.impl} />;
    case "problem":        return <ProblemSlide prob={slide.prob} />;
    case "team":           return <TeamSlide features={project.teamFeatures} />;
    default: return null;
  }
}

function OverviewSlide({ project }) {
  return (
    <div className={styles.slideOverview}>
      {project.cover && (
        <div className={styles.ovCover}>
          <img
            src={project.cover}
            alt={project.title}
            onError={(e) => {
              if (project.coverFallback) e.currentTarget.src = project.coverFallback;
              else e.currentTarget.parentElement.style.display = "none";
            }}
          />
        </div>
      )}
      <div className={styles.ovInfo}>
        <div>
          <h2 className={styles.ovTitle}>{project.title}</h2>
          <p className={styles.ovSubtitle}>{project.subtitle}</p>
        </div>
        <div className={styles.ovMeta}>
          <span className={styles.ovMetaLabel}>기간</span><span>{project.period}</span>
          <span className={styles.ovMetaLabel}>팀</span><span>{project.team}</span>
          <span className={styles.ovMetaLabel}>역할</span><span>{project.role}</span>
        </div>
        <div className={styles.ovTags}>
          {project.stack.map((s) => <Tag key={s}>{s}</Tag>)}
        </div>
        <ul className={styles.ovHighlights}>
          {project.highlights.map((h, i) => (
            <li key={i} className={styles.ovHighlight}>
              <span className={styles.ovArrow}>›</span><span>{h}</span>
            </li>
          ))}
        </ul>
        {project.links?.github && (
          <a href={project.links.github} target="_blank" rel="noopener noreferrer" className={styles.ovLink}>
            ⌥ GitHub →
          </a>
        )}
      </div>
    </div>
  );
}

function SectionHeaderSlide({ label }) {
  return (
    <div className={styles.slideHeader}>
      <div className={styles.shLine} />
      <span className={styles.shLabel}>// {label}</span>
      <div className={styles.shLine} />
    </div>
  );
}

function ImplSlide({ impl }) {
  return (
    <div className={styles.slideImpl}>
      <h3 className={styles.implTitle}>{impl.title}</h3>
      <ul className={styles.implItems}>
        {impl.items.map((item, i) => (
          <li key={i} className={styles.implItem}>
            <span className={styles.implDot}>·</span><span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProblemSlide({ prob }) {
  return (
    <div className={styles.slideProb}>
      <h3 className={styles.probTitle}>{prob.title}</h3>
      <div className={styles.probGrid}>
        <span className={styles.probLabel}>문제</span>
        <p className={styles.probText}>{prob.problem}</p>
        <span className={styles.probLabel}>해결</span>
        <p className={styles.probText}>{prob.solution}</p>
        <span className={[styles.probLabel, styles.probLabelResult].join(" ")}>결과</span>
        <p className={[styles.probText, styles.probResult].join(" ")}>{prob.result}</p>
      </div>
      {prob.snippet && (
        <div className={styles.probSnippet}>
          <CodeBlock code={prob.snippet.code} lang={prob.snippet.lang} label={prob.snippet.label} />
        </div>
      )}
    </div>
  );
}

function TeamSlide({ features }) {
  return (
    <div className={styles.slideTeam}>
      <h3 className={styles.implTitle}>팀 핵심 구현</h3>
      {features.map((feat, i) => (
        <div key={i} className={styles.teamBlock}>
          <div className={styles.teamBlockTitle}>{feat.title}</div>
          <ul className={styles.implItems} style={{ padding: "12px 14px", gap: "8px" }}>
            {feat.items.map((item, j) => (
              <li key={j} className={styles.implItem}>
                <span className={styles.implDot}>·</span><span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
