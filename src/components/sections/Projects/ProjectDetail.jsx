import { useEffect, useState, useCallback, useRef } from "react";
import Tag from "../../ui/Tag";
import CodeBlock from "../../ui/CodeBlock";
import ArchitectureDiagram from "../../ui/ArchitectureDiagram";
import styles from "./Projects.module.css";

function getTabs(project) {
  const tabs = ["개요"];
  if (project.techChoice?.length) tabs.push("기술 선정");
  tabs.push("구현", "문제 해결");
  if (project.retrospective?.length) tabs.push("회고");
  tabs.push("아키텍처");
  return tabs;
}

export default function ProjectDetail({ project, allProjects, onClose, onNavigate }) {
  const [activeTab, setActiveTab]   = useState("개요");
  const [animKey,   setAnimKey]     = useState(0);
  const [probIdx,   setProbIdx]     = useState(0);
  const [probDir,   setProbDir]     = useState(1);
  const [probKey,   setProbKey]     = useState(0);
  const contentRef = useRef(null);
  const tabs       = getTabs(project);
  const problems   = project.problems ?? [];
  const projIndex  = allProjects ? allProjects.findIndex(p => p.id === project.id) : 0;
  const hasNextProj = allProjects && projIndex < allProjects.length - 1;
  const hasPrevProj = allProjects && projIndex > 0;

  const [modalDir, setModalDir] = useState(1);
  const [modalKey, setModalKey] = useState(project.id);

  const switchTab = useCallback((tab) => {
    setActiveTab(tab);
    setAnimKey(k => k + 1);
    if (tab === "문제 해결") setProbIdx(0);
    contentRef.current?.scrollTo({ top: 0 });
  }, []);

  const goProblem = useCallback((delta) => {
    const next = probIdx + delta;
    if (next < 0 || next >= problems.length) return;
    setProbDir(delta);
    setProbIdx(next);
    setProbKey(k => k + 1);
    contentRef.current?.scrollTo({ top: 0 });
  }, [probIdx, problems.length]);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (activeTab === "문제 해결") {
        if (e.key === "ArrowRight") goProblem(1);
        if (e.key === "ArrowLeft")  goProblem(-1);
      }
    };
    window.addEventListener("keydown", fn);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", fn); document.body.style.overflow = ""; };
  }, [onClose, activeTab, goProblem]);

  const isProbTab  = activeTab === "문제 해결";
  const contentKey = isProbTab ? `prob-${probKey}` : `tab-${animKey}`;
  const contentAnim = probDir > 0 ? styles.cubeNext : styles.cubePrev;

  const handleNextProj = () => {
    setModalDir(1);
    setModalKey(allProjects[projIndex + 1].id);
    onNavigate(allProjects[projIndex + 1]);
  };
  const handlePrevProj = () => {
    setModalDir(-1);
    setModalKey(allProjects[projIndex - 1].id);
    onNavigate(allProjects[projIndex - 1]);
  };

  return (
    <div className={styles.detailOverlay} onClick={onClose}>
      <div 
        key={modalKey} 
        className={`${styles.detailModal} ${modalDir > 0 ? styles.modalCubeNext : styles.modalCubePrev}`} 
        onClick={e => e.stopPropagation()}
      >

        <div className={styles.detailHeader}>
          <div className={styles.dHeaderLeft}>
            <span className={styles.dNum}>{project.num}</span>
            <span className={styles.dTitle}>{project.title}</span>
          </div>
          <div className={styles.dHeaderRight}>
            {hasPrevProj && <button className={styles.projNavBtn} onClick={handlePrevProj}>‹ 이전</button>}
            {hasNextProj && <button className={styles.projNavBtn} onClick={handleNextProj}>다음 ›</button>}
            <button className={styles.dClose} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.detailTabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={[styles.dTab, activeTab === tab ? styles.dTabActive : ""].join(" ")}
              onClick={() => switchTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.detailContent} ref={contentRef}>
          <div key={contentKey} className={contentAnim}>
            <TabContent tab={activeTab} project={project} probIdx={probIdx} />
          </div>
        </div>

        {isProbTab && problems.length > 1 && (
          <div className={styles.probSliderNav}>
            <button
              className={styles.probNavBtn}
              onClick={() => goProblem(-1)}
              disabled={probIdx === 0}
            >←</button>

            <div className={styles.probDots}>
              {problems.map((_, i) => (
                <button
                  key={i}
                  className={[styles.probDot, i === probIdx ? styles.probDotActive : ""].join(" ")}
                  onClick={() => {
                    setProbDir(i > probIdx ? 1 : -1);
                    setProbIdx(i);
                    setProbKey(k => k + 1);
                    contentRef.current?.scrollTo({ top: 0 });
                  }}
                />
              ))}
            </div>

            <span className={styles.probCounter}>
              <span className={styles.dCur}>{probIdx + 1}</span>
              <span className={styles.dSep}> / </span>
              <span className={styles.dTot}>{problems.length}</span>
            </span>

            <button
              className={styles.probNavBtn}
              onClick={() => goProblem(1)}
              disabled={probIdx === problems.length - 1}
            >→</button>
          </div>
        )}

      </div>
    </div>
  );
}

function TabContent({ tab, project, probIdx }) {
  switch (tab) {
    case "개요":      return <OverviewSlide project={project} />;
    case "구현":      return <ImplPage impls={project.implementations} />;
    case "문제 해결": return <ProblemSlide prob={project.problems[probIdx]} />;
    case "기술 선정": return <TechChoicePage choices={project.techChoice} />;
    case "회고":      return <RetroPage retro={project.retrospective} />;
    case "아키텍처":  return <ArchitecturePage projectId={project.id} />;
    default: return null;
  }
}

function ArchitecturePage({ projectId }) {
  return (
    <div className={styles.mdContainer} style={{ background: 'var(--bg2)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '32px 24px' }}>
      <ArchitectureDiagram projectId={projectId} />
    </div>
  );
}

function OverviewSlide({ project }) {
  return (
    <div className={styles.slideOverview}>
      {project.cover && (
        <div className={styles.ovCover}>
          <img
            src={project.cover}
            alt={project.title}
            loading="lazy"
            decoding="async"
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
        </div>
        <div className={styles.ovTags}>
          {project.stack.map(s => <Tag key={s}>{s}</Tag>)}
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

function ImplPage({ impls }) {
  return (
    <div className={styles.implPage}>
      {impls.map((impl, i) => (
        <div key={i} className={styles.implBlock}>
          <h3 className={styles.implTitle}>{impl.title}</h3>
          <ul className={styles.implItems}>
            {impl.items.map((item, j) => (
              <li key={j} className={styles.implItem}>
                <span className={styles.implDot}>·</span><span>{item}</span>
              </li>
            ))}
          </ul>
          {impl.snippet && (
            <div className={styles.probSnippet}>
              {impl.snippet.type === "visual" && <VisualDiagram snippet={impl.snippet} />}
              {impl.snippet.type === "table" && <DataTable snippet={impl.snippet} />}
              {(!impl.snippet.type || impl.snippet.type === "code") && (
                <CodeBlock code={impl.snippet.code} lang={impl.snippet.lang} label={impl.snippet.label} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProblemSlide({ prob }) {
  if (!prob) return null;
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
          {prob.snippet.type === "visual" && <VisualDiagram snippet={prob.snippet} />}
          {prob.snippet.type === "table" && <DataTable snippet={prob.snippet} />}
          {(!prob.snippet.type || prob.snippet.type === "code") && (
            <CodeBlock code={prob.snippet.code} lang={prob.snippet.lang} label={prob.snippet.label} />
          )}
        </div>
      )}
    </div>
  );
}

function RetroPage({ retro }) {
  return (
    <div className={styles.retroPage}>
      {retro.map((item, i) => (
        <div key={i} className={styles.retroItem}>
          <span className={styles.retroIdx}>{String(i + 1).padStart(2, "0")}</span>
          <div className={styles.retroBody}>
            <span className={styles.retroPoint}>{item.point}</span>
            <p className={styles.retroDetail}>{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TechChoicePage({ choices }) {
  return (
    <div className={styles.techPage}>
      {choices.map((c, i) => (
        <div key={i} className={styles.techRow}>
          <div className={styles.techMeta}>
            <span className={styles.techName}>{c.tech}</span>
          </div>
          <ul className={styles.techReasonList}>
            {c.reason.map((r, j) => (
              <li key={j} className={styles.techReasonItem}>
                <span className={styles.techReasonDot}>·</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function VisualDiagram({ snippet }) {
  return (
    <div className={styles.visualWrap}>
      <div className={styles.visualLabel}>{snippet.label}</div>
      <div className={styles.visualFlow}>
        {snippet.content.map((item, i) => (
          <div key={item.id} className={styles.visualNodeWrap}>
            {i > 0 && <div className={styles.visualArrow}>→</div>}
            <div className={styles.visualNode}>
              <span className={styles.visualNodeName}>{item.name}</span>
              <span className={styles.visualNodeDesc}>{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DataTable({ snippet }) {
  return (
    <div className={styles.tableWrap}>
      <div className={styles.visualLabel}>{snippet.label}</div>
      <div className={styles.tableScroll}>
        <table className={styles.nativeTable}>
          <thead>
            <tr>
              {snippet.headers.map((h, i) => <th key={i}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {snippet.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => <td key={j}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}