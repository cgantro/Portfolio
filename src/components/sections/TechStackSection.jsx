import ScoreBar from "../common/ScoreBar";
import SectionShell from "../common/SectionShell";

export default function TechStackSection({ stack }) {
  return (
    <SectionShell
      id="tech-stack"
      title="Tech Stack"
      note="기술 이름 나열이 아니라, 해당 기술로 해결 가능한 업무 단위를 중심으로 정리했습니다."
      className="print-break-before"
    >
      <div className="stack-groups">
        {stack.map((group) => (
          <article key={group.category} className="stack-group print-avoid-break">
            <h3>{group.category}</h3>
            <div className="stack-table">
              {group.items.map((item) => (
                <div key={item.name} className="stack-row">
                  <div className="stack-title">
                    <h4>{item.name}</h4>
                    <ScoreBar score={item.score} />
                  </div>
                  <p>
                    <strong>활용 수준:</strong> {item.level}
                  </p>
                  <p>
                    <strong>구현 업무:</strong> {item.tasks}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
