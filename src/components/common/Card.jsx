export default function Card({ title, className = "", children }) {
  const classes = ["info-card", className].filter(Boolean).join(" ");

  return (
    <article className={classes}>
      {title ? <h3>{title}</h3> : null}
      {children}
    </article>
  );
}
