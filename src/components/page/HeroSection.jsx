import ImageFrame from "../common/ImageFrame";

export default function HeroSection({ doc }) {
  const portrait = doc.portrait || {};
  const personalInfo = doc.personalInfo || {};
  const links = doc.links || {};

  return (
    <section className="page-section intro-section editorial-hero" id="intro">
      <div className="editorial-hero-layout">
        <div className="editorial-hero-copy">
          <p className="editorial-kicker">{doc.owner}</p>
          <h1 className="editorial-hero-title">{doc.mainTitle}</h1>
          <p className="editorial-hero-summary">{doc.subtitle}</p>

          <div className="editorial-hero-meta">
            <div className="editorial-meta-group">
              <p className="editorial-meta-label">Focus</p>
              <p className="editorial-meta-value">{doc.focus}</p>
            </div>
            <div className="editorial-meta-group">
              <p className="editorial-meta-label">Roles</p>
              <p className="editorial-meta-value">{doc.targetRoles.join(" / ")}</p>
            </div>
          </div>

          <div className="editorial-bio-facts">
            <p className="editorial-bio-heading">Profile</p>
            <div className="editorial-bio-list">
              <p>
                <span className="editorial-bio-label">Birth</span>
                <span className="editorial-bio-value">{personalInfo.birthYear}</span>
              </p>
              <p>
                <span className="editorial-bio-label">Education</span>
                <span className="editorial-bio-value">{personalInfo.education}</span>
              </p>
              <p>
                <span className="editorial-bio-label">Certification</span>
                <span className="editorial-bio-value">{personalInfo.certifications?.join(", ")}</span>
              </p>
              <p>
                <span className="editorial-bio-label">Language</span>
                <span className="editorial-bio-value">{personalInfo.language}</span>
              </p>
            </div>
          </div>

          <div className="editorial-contact-actions">
            {links.github ? (
              <a
                className="editorial-contact-link"
                href={links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            ) : null}
            {links.email ? (
              <a className="editorial-contact-link" href={links.email}>
                cgantro@gmail.com
              </a>
            ) : (
              <span className="editorial-contact-link is-muted">Email Pending</span>
            )}
          </div>
        </div>

        <div className="editorial-hero-visual">
          <ImageFrame
            title={portrait.title || "Portrait"}
            caption={portrait.caption || "Profile image frame"}
            src={portrait.src}
            alt={portrait.alt || `${doc.owner} profile portrait`}
            placeholder={portrait.placeholder || "Profile image pending"}
            className="editorial-portrait-frame"
          />
        </div>
      </div>
    </section>
  );
}