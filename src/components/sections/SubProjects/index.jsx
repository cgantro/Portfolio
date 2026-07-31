import styles from "./SubProjects.module.css";

export default function SubProjects({ projects }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.heading}>
        <p>기타 구현</p>
        <h2>학습과 실험으로 완성한 부 프로젝트</h2>
      </div>
      <div className={styles.grid}>
        {projects.map((project, index) => (
          <article key={project.id} className={styles.card}>
            <span className={styles.logo}>{String(index + 1).padStart(2, "0")}</span>
            <h3>{project.title}</h3>
            <p className={styles.subtitle}>{project.subtitle}</p>
            <p className={styles.team}>{project.team} · {project.period}</p>
            <ul className={styles.tags}>{project.stack.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            {project.links?.github ? <a className={styles.link} href={project.links.github} target="_blank" rel="noopener noreferrer">Repository ↗</a> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
