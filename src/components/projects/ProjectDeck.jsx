import ProjectSlide from "./ProjectSlide";

export default function ProjectDeck({ project }) {
  return (
    <article className="project-deck-card project-deck-card-overlay print-avoid-break">
      <div className="project-deck-stage project-deck-stage-overlay">
        {project.slides.map((slide) => (
          <ProjectSlide key={`${project.id}-${slide.key}`} slide={slide} projectName={project.name} isActive />
        ))}
      </div>
    </article>
  );
}
