import SectionShell from "../common/SectionShell";
import TechIcon from "../common/TechIcon";

function StrengthCard({ item }) {
  return (
    <article className="summary-card">
      <h4>{item.title}</h4>
      <p>{item.detail}</p>
    </article>
  );
}

function CoreTechCard({ item }) {
  return (
    <article className="core-tech-card">
      <div className="core-tech-head">
        <div className="icon-group" aria-hidden="true">
          {item.icons.map((key) => (
            <TechIcon key={`${item.name}-${key}`} iconKey={key} label={`${item.name} icon`} />
          ))}
        </div>
        <div>
          <p className="core-tech-name">{item.name}</p>
          <p className="core-tech-score">{item.score}</p>
        </div>
      </div>
      <p className="core-tech-can-do">{item.canDo}</p>
    </article>
  );
}

function SupportingTechChip({ item }) {
  return (
    <div className="supporting-chip" title={item.name}>
      <TechIcon iconKey={item.icon} label={item.name} />
      <span>{item.name}</span>
    </div>
  );
}

export default function SummarySection({ summary, techStacks }) {
  return (
    <SectionShell id="summary" title="Summary" className="print-avoid-break">
      <div className="summary-layout">
        <article className="summary-panel">
          <h3>Profile</h3>
          <ul>
            {summary.profileStatements.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>

        <article className="summary-panel">
          <h3>Core Strengths</h3>
          <div className="strength-grid">
            {summary.coreStrengths.map((item) => (
              <StrengthCard key={item.title} item={item} />
            ))}
          </div>
        </article>

        <article className="summary-panel">
          <h3>Core Tech Stack</h3>
          <div className="core-tech-grid">
            {techStacks.core.map((item) => (
              <CoreTechCard key={item.name} item={item} />
            ))}
          </div>

          <h3 className="supporting-title">Supporting Tech Stack</h3>
          <div className="supporting-tech-grid">
            {techStacks.supporting.map((item) => (
              <SupportingTechChip key={item.name} item={item} />
            ))}
          </div>
        </article>
      </div>
    </SectionShell>
  );
}
