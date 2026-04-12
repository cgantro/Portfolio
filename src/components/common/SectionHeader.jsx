export default function SectionHeader({ title, note }) {
  return (
    <header className="section-title-wrap">
      <h2>{title}</h2>
      {note ? <p className="section-note">{note}</p> : null}
    </header>
  );
}
