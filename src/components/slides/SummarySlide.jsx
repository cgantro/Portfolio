import SlideFrame from "./SlideFrame";
import SlideCard from "../common/SlideCard";
import TechIcon from "../common/TechIcon";

function CoreTechRow({ item }) {
  return (
    <div className="core-tech-row">
      <div className="core-tech-icons" aria-hidden="true">
        {item.icons.map((key) => (
          <TechIcon key={`${item.name}-${key}`} iconKey={key} label={item.name} />
        ))}
      </div>
      <div>
        <p className="core-tech-row-title">{item.name}</p>
        <p className="core-tech-row-meta">{item.score} · {item.canDo}</p>
      </div>
    </div>
  );
}

function SupportingChip({ item }) {
  return (
    <span className="support-chip" title={item.name}>
      <TechIcon iconKey={item.icon} label={item.name} />
      <span>{item.name}</span>
    </span>
  );
}

export default function SummarySlide({ summary, techStacks }) {
  return (
    <SlideFrame id="summary" sectionLabel="Summary" title="Profile / Core Strengths / Tech Stack">
      <div className="summary-slide-grid">
        <SlideCard title="Profile">
          <ul>
            {summary.profileStatements.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </SlideCard>

        <SlideCard title="Core Strengths">
          <div className="strength-list">
            {summary.coreStrengths.map((item) => (
              <div key={item.title} className="strength-item">
                <p className="strength-title">{item.title}</p>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </SlideCard>

        <SlideCard title="Core Tech Stack">
          <div className="core-tech-list">
            {techStacks.core.map((item) => (
              <CoreTechRow key={item.name} item={item} />
            ))}
          </div>
          <p className="supporting-heading">Supporting Tech Stack</p>
          <div className="support-chip-wrap">
            {techStacks.supporting.map((item) => (
              <SupportingChip key={item.name} item={item} />
            ))}
          </div>
        </SlideCard>
      </div>
    </SlideFrame>
  );
}
