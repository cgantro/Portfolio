import SlideCard from "../common/SlideCard";
import FigureBlock from "../common/FigureBlock";
import MetricCard from "../common/MetricCard";

function LeftBlock({ block }) {
  return (
    <SlideCard title={block.title}>
      <ul>
        {block.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SlideCard>
  );
}

function RightBlock({ block }) {
  if (block.type === "figure") {
    return <FigureBlock title={block.title} caption={block.caption} bullets={block.bullets} image={block.image} />;
  }

  if (block.type === "metrics") {
    return <MetricCard title={block.title} items={block.items} />;
  }

  return (
    <SlideCard title={block.title}>
      <ul>
        {block.items?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </SlideCard>
  );
}

export default function ProjectSlide({ slide, projectName, isActive }) {
  const classes = ["project-slide", isActive ? "is-active" : ""].filter(Boolean).join(" ");

  return (
    <article className={classes} aria-hidden={isActive ? "false" : "true"}>
      <header className="project-slide-header print-only">
        <p className="project-slide-project-name">{projectName}</p>
        <h4>{slide.label}</h4>
      </header>

      <div className="project-slide-layout">
        <div className="project-slide-left">
          {slide.leftBlocks.map((block) => (
            <LeftBlock key={block.title} block={block} />
          ))}
        </div>

        <div className="project-slide-right">
          {slide.rightBlocks.map((block) => (
            <RightBlock key={block.title} block={block} />
          ))}
        </div>
      </div>
    </article>
  );
}
