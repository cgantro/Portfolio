import Card from "../common/Card";
import SectionShell from "../common/SectionShell";

export default function CollaborationSection({ collaborationProcess, evidencePlacementGuide, pdfGuide }) {
  return (
    <SectionShell
      id="collaboration"
      title="Collaboration / Process"
      className="print-break-before print-avoid-break"
    >
      <Card title="협업 프로세스 템플릿">
        <div className="process-grid">
          {collaborationProcess.template.map((item) => (
            <div key={item.item} className="process-item">
              <h4>{item.item}</h4>
              <p>{item.guide}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="현재 프로젝트에서 확인된 협업 근거">
        <ul>
          {collaborationProcess.appliedEvidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card title="아키텍처/화면/수치 자료 배치 원칙">
        <div className="evidence-layout-grid">
          {evidencePlacementGuide.map((item) => (
            <div key={item.artifact} className="evidence-layout-item">
              <h4>{item.artifact}</h4>
              <p>
                <strong>배치:</strong> {item.placement}
              </p>
              <p>
                <strong>전달 메시지:</strong> {item.message}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="PDF 제출형 디자인 원칙">
        <ul>
          {pdfGuide.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </SectionShell>
  );
}
