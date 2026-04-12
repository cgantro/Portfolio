import LinkChip from "../common/LinkChip";

function TagList({ tags }) {
  return (
    <div className="project-tags">
      {tags.map((tag) => (
        <span key={tag} className="tag-chip">
          {tag}
        </span>
      ))}
    </div>
  );
}

function TextBlock({ title, items }) {
  return (
    <section className="project-text-block">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function EvidenceColumn({ evidence }) {
  return (
    <aside className="project-evidence">
      <div className="evidence-box">
        <h4>구조도</h4>
        <p>{evidence.architecture}</p>
      </div>

      <div className="evidence-box">
        <h4>화면/수치</h4>
        <p>{evidence.visual}</p>
      </div>

      <div className="metric-cards">
        {evidence.metrics.map((metric) => (
          <div key={metric} className="metric-card">
            {metric}
          </div>
        ))}
      </div>
    </aside>
  );
}

export default function ProjectCard({ project }) {
  const repo = project.repo?.startsWith("http") ? project.repo : null;

  return (
    <article className="project-card print-avoid-break" id={`project-${project.id}`}>
      <header className="project-top">
        <div>
          <h3>{project.name}</h3>
          <p className="project-one-line">{project.oneLine}</p>
          <p className="project-role">
            <strong>역할</strong> {project.roleLabel}
          </p>
        </div>
        <TagList tags={project.stackTags} />
      </header>

      <div className="project-main">
        <div className="project-left">
          <TextBlock title="문제 상황" items={project.problem} />
          <TextBlock title="내가 맡은 역할" items={project.responsibilities} />
          <TextBlock title="해결 방식" items={project.solution} />
        </div>

        <EvidenceColumn evidence={project.evidence} />
      </div>

      <footer className="project-bottom">
        <div className="project-outcome">
          <h4>결과</h4>
          <ul>
            {project.result.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="project-outcome">
          <h4>배운 점</h4>
          <ul>
            {project.learned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="project-link-wrap">
          <LinkChip href={repo} label={repo ? "GitHub" : "Repository 준비중"} />
        </div>
      </footer>
    </article>
  );
}
