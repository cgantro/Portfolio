import { useState } from "react";
import SlideNav from "./SlideNav";
import ProjectSlide from "./ProjectSlide";

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

export default function ProjectDeck({ project, sectionLabel }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <article className="project-deck-card print-avoid-break">
      <header className="project-deck-head">
        <div>
          <p className="project-deck-label">{sectionLabel}</p>
          <h3>{project.name}</h3>
          <p className="project-deck-summary">{project.oneLine}</p>
          <p className="project-deck-role">
            <strong>Role</strong> {project.roleLabel}
          </p>
        </div>
        <StackTags tags={project.stackTags} />
      </header>

      <SlideNav slides={project.slides} activeIndex={activeIndex} onSelect={setActiveIndex} />

      <div className="project-deck-stage">
        {project.slides.map((slide, index) => (
          <ProjectSlide
            key={`${project.id}-${slide.key}`}
            slide={slide}
            projectName={project.name}
            isActive={index === activeIndex}
          />
        ))}
      </div>

      <footer className="project-deck-footer">
        <a href={project.repo || "#"} target="_blank" rel="noreferrer" className={project.repo ? "" : "is-disabled"}>
          {project.repo ? "GitHub Repository" : "Repository 링크 준비중"}
        </a>
      </footer>
    </article>
  );
}