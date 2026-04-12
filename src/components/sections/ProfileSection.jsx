import Card from "../common/Card";
import SectionShell from "../common/SectionShell";

export default function ProfileSection({ profile }) {
  return (
    <SectionShell id="profile" title="Profile" className="print-avoid-break">
      <p className="lead">{profile.oneSentence}</p>

      <div className="card-grid two-col">
        {profile.capabilities.map((item) => (
          <Card key={item.title} title={item.title}>
            <p>{item.detail}</p>
          </Card>
        ))}
      </div>

      <Card title="직무 기여 방식" className="contribution-card">
        <ul>
          {profile.jobContributions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </SectionShell>
  );
}
