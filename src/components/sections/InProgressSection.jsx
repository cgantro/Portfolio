import LinkChip from "../common/LinkChip";
import SectionShell from "../common/SectionShell";

export default function InProgressSection({ project }) {
  return (
    <SectionShell id="in-progress" title="In Progress" className="print-break-before print-avoid-break">
      <article className="project-card in-progress-card">
        <header className="project-top">
          <div>
            <h3>{project.name}</h3>
            <p className="project-one-line">{project.oneLine}</p>
          </div>
          <div className="project-links">
            <LinkChip href={project.repo} label="GitHub" />
          </div>
        </header>

        <div className="in-progress-grid">
          <section className="project-text-block">
            <h4>왜 시작했는지</h4>
            <p>{project.whyStarted}</p>
          </section>

          <section className="project-text-block">
            <h4>현재 구현 범위</h4>
            <ul>
              {project.currentScope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="project-text-block">
            <h4>앞으로 검증할 것</h4>
            <ul>
              {project.nextValidation.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </SectionShell>
  );
}
