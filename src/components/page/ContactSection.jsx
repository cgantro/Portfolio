export default function ContactSection({ collaborationContact }) {
  const contact = collaborationContact.contact || {};
  const githubLabel = contact.github ? contact.github.replace(/^https?:\/\//, "") : "";

  return (
    <section className="page-section editorial-contact-section" id="contact">
      <div className="section-header editorial-contact-header">
        <p className="editorial-section-label">Contact</p>
        <h2>Let's build reliable products together.</h2>
      </div>

      <div className="editorial-contact-layout">
        <div className="editorial-contact-intro">
          <p className="editorial-contact-note">
            I enjoy working with teams that value clear architecture, thoughtful collaboration,
            and stable systems in production.
          </p>
        </div>

        <div className="editorial-contact-details">
          <div className="editorial-contact-methods">
            <p className="editorial-contact-item-label">Email</p>
            {contact.email ? (
              <a className="editorial-contact-item-value" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            ) : (
              <p className="editorial-contact-item-value is-muted">Email Pending</p>
            )}
          </div>

          <div className="editorial-contact-methods">
            <p className="editorial-contact-item-label">GitHub</p>
            {contact.github ? (
              <a
                className="editorial-contact-item-value"
                href={contact.github}
                target="_blank"
                rel="noreferrer"
              >
                {githubLabel}
              </a>
            ) : (
              <p className="editorial-contact-item-value is-muted">Link Pending</p>
            )}
          </div>
        </div>
      </div>

      <div className="editorial-collaboration-notes">
        <p className="editorial-collaboration-heading">How I collaborate</p>
        <ul className="editorial-collaboration-list">
          {collaborationContact.collaboration.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}