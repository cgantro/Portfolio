export default function FigureCard({ title, caption, bullets = [] }) {
  return (
    <article className="figure-card-block">
      <h4>{title}</h4>
      <p>{caption}</p>
      {bullets.length > 0 ? (
        <ul>
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
