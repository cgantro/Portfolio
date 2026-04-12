import SectionShell from "../common/SectionShell";

export default function CollaborationContactSection({ collaborationContact }) {
  return (
    <SectionShell
      id="collaboration-contact"
      title="Collaboration & Contact"
      className="print-break-before print-avoid-break"
    >
      <div className="collab-contact-layout">
        <article className="summary-panel">
          <h3>Collaboration</h3>
          <ul>
            {collaborationContact.collaboration.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </article>

        <article className="summary-panel">
          <h3>Contact</h3>
          <p>
            <strong>Email</strong> {collaborationContact.contact.email}
          </p>
          <p>
            <strong>GitHub</strong>{" "}
            <a href={collaborationContact.contact.github} target="_blank" rel="noreferrer">
              {collaborationContact.contact.github}
            </a>
          </p>
        </article>
      </div>
    </SectionShell>
  );
}
