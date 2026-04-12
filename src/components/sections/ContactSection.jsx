import Card from "../common/Card";
import SectionShell from "../common/SectionShell";

export default function ContactSection({ contact, excludedProjects, verificationStatus }) {
  return (
    <SectionShell id="contact" title="Contact" className="print-break-before print-avoid-break">
      <Card title="연락처">
        <p>
          <strong>Email:</strong> {contact.email}
        </p>
        <p>
          <strong>GitHub:</strong>{" "}
          <a href={contact.github} target="_blank" rel="noreferrer">
            {contact.github}
          </a>
        </p>
        <p>{contact.note}</p>
      </Card>

      <Card title="Main Portfolio 제외 프로젝트">
        <ul>
          {excludedProjects.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card title="검증 상태 요약">
        <div className="evidence-grid">
          <div className="evidence verified">
            <p className="evidence-label">GitHub 확인 완료</p>
            <ul>
              {verificationStatus.githubVerified.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="evidence needs-input">
            <p className="evidence-label">사용자 보강 필요</p>
            <ul>
              {verificationStatus.userInputRequired.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </SectionShell>
  );
}
