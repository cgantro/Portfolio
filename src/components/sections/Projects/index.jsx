import { useEffect, useMemo, useState } from "react";
import ProjectIcon from "./ProjectIcon";
import ReferenceProjectPage from "./ReferenceProjectPage";
import styles from "./Projects.module.css";

export default function Projects({ projects }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(() => projects.find((project) => project.id === selectedId) ?? null, [projects, selectedId]);

  useEffect(() => {
    if (!selected) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <p>프로젝트 상세</p>
        <h2>주요 프로젝트의 세부 사항을 확인해보세요</h2>
      </div>
      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <button key={project.id} className={styles.card} onClick={() => setSelectedId(project.id)}>
            <span className={styles.projectLogo}><ProjectIcon id={project.id} className={styles.icon} /></span>
            <h3>{project.title}</h3>
            <p className={styles.subtitle}>{project.subtitle}</p>
            <p className={styles.team}>{project.team} 팀 프로젝트 · {project.period}</p>
            <ul className={styles.skills}>
              {project.stack.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </button>
        ))}
      </div>
      {selected ? (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={() => setSelectedId(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-label={`${selected.title} 프로젝트 상세`} onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.close} onClick={() => setSelectedId(null)} aria-label="프로젝트 상세 닫기">×</button>
            <ReferenceProjectPage project={selected} detailPage={selected.detailPage} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
