export default function HeroSection({ doc }) {
  const hasPdf = Boolean(doc.links.pdf);

  return (
    <section id="intro" className="doc-section intro-section print-avoid-break">
      <p className="intro-name">{doc.owner}</p>
      <h1>{doc.mainTitle}</h1>
      <p className="intro-subtitle">{doc.subtitle}</p>

      <div className="intro-meta">
        <p>
          <strong>Focus</strong> {doc.focus}
        </p>
        <p>
          <strong>Target Roles</strong> {doc.targetRoles.join(" / ")}
        </p>
      </div>

      <div className="intro-actions">
        <a className="action-btn" href={doc.links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a className="action-btn" href={doc.links.email}>
          Email
        </a>
        {hasPdf ? (
          <a className="action-btn" href={doc.links.pdf} target="_blank" rel="noreferrer">
            PDF
          </a>
        ) : (
          <span className="action-btn disabled">PDF 준비중</span>
        )}
      </div>
    </section>
  );
}
