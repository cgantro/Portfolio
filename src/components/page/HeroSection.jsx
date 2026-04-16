import ImageFrame from "../common/ImageFrame";

export default function HeroSection({ doc }) {
  const portrait = doc.portrait || {};
  const personalInfo = doc.personalInfo || {};
  const links = doc.links || {};
  const collaborationContact = doc.collaborationContact || {};
  const contact = collaborationContact.contact || {};
  const githubHref = contact.github || links.github;
  const emailValue = contact.email || links.email?.replace(/^mailto:/, "");
  const githubLabel = githubHref ? githubHref.replace(/^https?:\/\//, "") : "";
  const targetRoles = doc.targetRoles || [];
  const collaborationNotes = collaborationContact.collaboration || [];

  return (
    <section className="page-section intro-section editorial-hero" id="contact">
      <div className="editorial-hero-layout">
        <div className="editorial-hero-copy hero-head">
          <p className="editorial-kicker">{doc.owner}</p>
          <h1 className="editorial-hero-title">{doc.mainTitle}</h1>
          <p className="editorial-hero-summary">{doc.subtitle}</p>
        </div>

        <div className="hero-profile-row">
          <div className="editorial-hero-portrait">
            <ImageFrame
              src={portrait.src}
              alt={portrait.alt || `${doc.owner} 프로필 사진`}
              placeholder={portrait.placeholder || "프로필 사진 준비중"}
              className="editorial-portrait-frame"
            />
          </div>

          <div className="editorial-bio-facts hero-profile-card">
            <p className="editorial-bio-heading">프로필</p>
            <div className="editorial-bio-list">
              <p>
                <span className="editorial-bio-label">출생</span>
                <span className="editorial-bio-value">{personalInfo.birthYear}</span>
              </p>
              <p>
                <span className="editorial-bio-label">학력</span>
                <span className="editorial-bio-value">{personalInfo.education}</span>
              </p>
              <p>
                <span className="editorial-bio-label">자격</span>
                <span className="editorial-bio-value">{personalInfo.certifications?.join(", ")}</span>
              </p>
              <p>
                <span className="editorial-bio-label">어학</span>
                <span className="editorial-bio-value">{personalInfo.language}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="hero-info-grid">
          <div className="editorial-meta-group hero-info-card">
            <p className="editorial-meta-label">전문 분야</p>
            <p className="editorial-meta-value">{doc.focus}</p>
          </div>

          <div className="editorial-meta-group hero-info-card hero-info-card-wide">
            <p className="editorial-meta-label">희망 역할 및 직무</p>
            <ul className="hero-role-list">
              {targetRoles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>

          <div className="editorial-hero-contact-panel hero-info-card">
            <p className="editorial-contact-item-label">연락</p>
            <div className="editorial-contact-actions">
              {emailValue ? (
                <a className="editorial-contact-link" href={`mailto:${emailValue}`}>
                  <span>이메일</span>
                  {emailValue}
                </a>
              ) : null}
              {githubHref ? (
                <a className="editorial-contact-link" href={githubHref} target="_blank" rel="noreferrer">
                  <span>깃허브</span>
                  {githubLabel}
                </a>
              ) : null}
            </div>
          </div>

          {collaborationNotes.length ? (
            <div className="editorial-collaboration-notes hero-info-card">
              <p className="editorial-collaboration-heading">협업 방식</p>
              <ul className="editorial-collaboration-list">
                {collaborationNotes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
