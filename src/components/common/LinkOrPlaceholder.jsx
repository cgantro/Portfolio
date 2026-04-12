export default function LinkOrPlaceholder({ href, label, placeholder }) {
  if (!href) {
    return <span className="contact-placeholder">{placeholder}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}
