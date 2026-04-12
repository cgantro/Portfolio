import Card from "../common/Card";
import SectionShell from "../common/SectionShell";

export default function CoreStrengthsSection({ strengths }) {
  return (
    <SectionShell id="core-strengths" title="Core Strengths" className="print-avoid-break">
      <div className="card-grid two-col">
        {strengths.map((item) => (
          <Card key={item.title} title={item.title}>
            <p>
              <strong>형성 경험:</strong> {item.formedBy}
            </p>
            <p>
              <strong>해결 가능 문제:</strong> {item.solves}
            </p>
            <p>
              <strong>강점 직무:</strong> {item.fitRole}
            </p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}
