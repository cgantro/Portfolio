import { useState } from "react";
import SlideNav from "./SlideNav";
import ProjectSlide from "./ProjectSlide";

function ProjectLinks({ project }) {
  const links = project.links || (project.repo ? [{ label: "깃허브", href: project.repo }] : []);

  if (!links.length) return null;

  return (
    <footer className="project-deck-footer">
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      ))}
    </footer>
  );
}

export default function ProjectDeck({ project, sectionLabel }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <article className="project-deck-card print-avoid-break">
      <header className="project-deck-head is-simple">
        <div>
          <p className="project-deck-label">{sectionLabel}</p>
          <h3>{project.name}</h3>
          <p className="project-deck-summary">{project.oneLine}</p>
        </div>
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

      <ProjectLinks project={project} />
    </article>
  );
}
