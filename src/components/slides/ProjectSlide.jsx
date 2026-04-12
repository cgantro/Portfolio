import SlideFrame from "./SlideFrame";
import SlideCard from "../common/SlideCard";
import FigureCard from "../common/FigureCard";
import MetricCard from "../common/MetricCard";

function StackTags({ tags }) {
  return (
    <div className="project-stack-tags">
      {tags.map((tag) => (
        <span key={tag} className="project-tag">
          {tag}
        </span>
      ))}
    </div>
  );
}

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
    return <FigureCard title={block.title} caption={block.caption} bullets={block.bullets} />;
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

export default function ProjectSlide({ project, slide, slideIndex, totalSlides, anchorId }) {
  return (
    <SlideFrame
      id={anchorId}
      sectionLabel={`${project.name} · ${slide.label} · ${slideIndex + 1}/${totalSlides}`}
      title={slide.title}
      subtitle={slide.summary}
      className="project-slide"
    >
      <div className="project-meta-line">
        <p>
          <strong>Role</strong> {project.roleLabel}
        </p>
        <StackTags tags={project.stackTags} />
      </div>

      <div className="project-slide-grid">
        <div className="project-left-column">
          {slide.leftBlocks.map((block) => (
            <LeftBlock key={block.title} block={block} />
          ))}
        </div>

        <div className="project-right-column">
          {slide.rightBlocks.map((block) => (
            <RightBlock key={block.title} block={block} />
          ))}
        </div>
      </div>

      <footer className="project-slide-footer">
        <a href={project.repo || "#"} target="_blank" rel="noreferrer" className={project.repo ? "" : "is-disabled"}>
          {project.repo ? "GitHub Repository" : "Repository 링크 준비중"}
        </a>
      </footer>
    </SlideFrame>
  );
}
