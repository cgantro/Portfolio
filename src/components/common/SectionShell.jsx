import SectionHeader from "./SectionHeader";

export default function SectionShell({ id, title, note, className = "", children }) {
  const classes = ["doc-section", className].filter(Boolean).join(" ");

  return (
    <section id={id} className={classes}>
      {title ? <SectionHeader title={title} note={note} /> : null}
      {children}
    </section>
  );
}
