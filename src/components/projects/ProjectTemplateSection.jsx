export default function ProjectTemplateSection({ title, children }) {
  return (
    <section className="project-section-block">
      <h4>{title}</h4>
      <div>{children}</div>
    </section>
  );
}
