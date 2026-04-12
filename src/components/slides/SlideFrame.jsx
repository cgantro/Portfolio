export default function SlideFrame({ id, title, subtitle, sectionLabel, className = "", children }) {
  const classes = ["slide-frame", className].filter(Boolean).join(" ");

  return (
    <section id={id} className={classes}>
      <header className="slide-header">
        {sectionLabel ? <p className="slide-label">{sectionLabel}</p> : null}
        {title ? <h2>{title}</h2> : null}
        {subtitle ? <p className="slide-subtitle">{subtitle}</p> : null}
      </header>
      <div className="slide-content">{children}</div>
    </section>
  );
}
