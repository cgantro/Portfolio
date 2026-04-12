import ProjectSlide from "./ProjectSlide";

export default function InProgressDeck({ deck }) {
  return (
    <section className="deck-section">
      {deck.slides.map((slide, index) => (
        <ProjectSlide
          key={`${deck.id}-${slide.key}`}
          project={deck}
          slide={slide}
          slideIndex={index}
          totalSlides={deck.slides.length}
          anchorId={index === 0 ? "in-progress" : `in-progress-${deck.id}-${index + 1}`}
        />
      ))}
    </section>
  );
}
