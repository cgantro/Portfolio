import SlideFrame from "./SlideFrame";
import SlideCard from "../common/SlideCard";

export default function ContactSlide({ collaborationContact }) {
  return (
    <SlideFrame
      id="contact"
      sectionLabel="Contact"
      title="Collaboration & Contact"
      subtitle="협업 방식과 연락처를 마지막 슬라이드에서 간결하게 정리합니다."
    >
      <div className="contact-slide-grid">
        <SlideCard title="Collaboration">
          <ul>
            {collaborationContact.collaboration.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SlideCard>

        <SlideCard title="Contact">
          <p>
            <strong>Email</strong> {collaborationContact.contact.email}
          </p>
          <p>
            <strong>GitHub</strong>{" "}
            <a href={collaborationContact.contact.github} target="_blank" rel="noreferrer">
              {collaborationContact.contact.github}
            </a>
          </p>
        </SlideCard>
      </div>
    </SlideFrame>
  );
}
