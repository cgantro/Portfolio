export default function SlideTabs({ slides, activeIndex, onSelect }) {
  return (
    <div className="slide-tabs" role="tablist" aria-label="Project slide tabs">
      {slides.map((slide, index) => (
        <button
          key={slide.key}
          type="button"
          role="tab"
          aria-selected={activeIndex === index}
          className={activeIndex === index ? "tab-button is-active" : "tab-button"}
          onClick={() => onSelect(index)}
        >
          {slide.label}
        </button>
      ))}
    </div>
  );
}