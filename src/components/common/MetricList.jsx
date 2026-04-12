export default function MetricList({ title, items }) {
  return (
    <div className="metric-group">
      <p className="subheading">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
