import TechIcon from "../common/TechIcon";

function CoreTechRow({ item }) {
  return (
    <li className="summary-tech-row">
      <div className="summary-tech-icons" aria-hidden="true">
        {item.icons.map((key) => (
          <TechIcon key={`${item.name}-${key}`} iconKey={key} label={item.name} />
        ))}
      </div>
      <div className="summary-tech-copy">
        <p className="summary-tech-title">{item.name}</p>
        <p className="summary-tech-meta">
          {item.score} - {item.canDo}
        </p>
      </div>
    </li>
  );
}

function SupportingChip({ item }) {
  return (
    <li className="summary-support-item" title={item.name}>
      <TechIcon iconKey={item.icon} label={item.name} />
      <span>{item.name}</span>
    </li>
  );
}

function SummaryGroup({ eyebrow, title, children, className = "" }) {
  const classes = ["summary-group", className].filter(Boolean).join(" ");

  return (
    <article className={classes}>
      <div className="summary-group-header">
        <p className="summary-group-eyebrow">{eyebrow}</p>
        <h3 className="summary-group-title">{title}</h3>
      </div>
      <div className="summary-group-body">{children}</div>
    </article>
  );
}

export default function SummarySection({ summary, techStacks }) {
  return (
    <section className="page-section summary-editorial" id="summary">
      <div className="section-header summary-section-header">
        <h2>Selected Overview</h2>
      </div>

      <div className="summary-editorial-layout">
        <div className="summary-editorial-intro">
          <SummaryGroup eyebrow="Profile" title="A concise introduction" className="summary-profile-group">
            <ul className="summary-statement-list">
              {summary.profileStatements.map((line) => (
                <li key={line} className="summary-statement-item">
                  {line}
                </li>
              ))}
            </ul>
          </SummaryGroup>

          <SummaryGroup eyebrow="Strengths" title="What I tend to bring into a team" className="summary-strength-group">
            <div className="summary-strength-list">
              {summary.coreStrengths.map((item) => (
                <div className="summary-strength-item" key={item.title}>
                  <p className="summary-strength-title">{item.title}</p>
                  <p className="summary-strength-detail">{item.detail}</p>
                </div>
              ))}
            </div>
          </SummaryGroup>
        </div>

        <SummaryGroup eyebrow="Stack" title="Core technologies and working tools" className="summary-stack-group">
          <div className="summary-stack-block">
            <p className="summary-stack-label">Core technologies</p>
            <ul className="summary-tech-list">
              {techStacks.core.map((item) => (
                <CoreTechRow key={item.name} item={item} />
              ))}
            </ul>
          </div>

          <div className="summary-stack-grid">
            <div className="summary-stack-block">
              <p className="summary-stack-label">Messaging / Infra</p>
              <ul className="summary-support-list">
                {techStacks.infraMessaging.map((item) => (
                  <SupportingChip key={item.name} item={item} />
                ))}
              </ul>
            </div>

            <div className="summary-stack-block">
              <p className="summary-stack-label">Collaboration & Tooling</p>
              <ul className="summary-support-list">
                {techStacks.tooling.map((item) => (
                  <SupportingChip key={item.name} item={item} />
                ))}
              </ul>
            </div>
          </div>
        </SummaryGroup>
      </div>
    </section>
  );
}