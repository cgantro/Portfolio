export default function LinkChip({ href, label }) {
  if (!href) {
    return <span className="muted-chip">{label}</span>;
  }

  return (
    <a className="link-chip" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
