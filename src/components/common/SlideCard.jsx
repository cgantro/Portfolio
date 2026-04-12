export default function SlideCard({ title, children, className = "" }) {
  const classes = ["slide-card", className].filter(Boolean).join(" ");

  return (
    <article className={classes}>
      {title ? <h3>{title}</h3> : null}
      {children}
    </article>
  );
}
