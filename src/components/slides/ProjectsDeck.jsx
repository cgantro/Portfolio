import ProjectSlide from "./ProjectSlide";

export default function ProjectsDeck({ decks }) {
  const slides = decks.flatMap((project) =>
    project.slides.map((slide, index) => ({
      project,
      slide,
      index,
      total: project.slides.length,
      anchorId: `projects-${project.id}-${index + 1}`,
    }))
  );

  return (
    <section className="deck-section">
      {slides.map((entry, idx) => (
        <ProjectSlide
          key={`${entry.project.id}-${entry.slide.key}`}
          project={entry.project}
          slide={entry.slide}
          slideIndex={entry.index}
          totalSlides={entry.total}
          anchorId={idx === 0 ? "projects" : entry.anchorId}
        />
      ))}
    </section>
  );
}
