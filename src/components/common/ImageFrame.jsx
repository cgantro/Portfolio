export default function ImageFrame({ title, caption, src, alt, placeholder, className = "", compact = false }) {
  const classes = ["image-frame", compact ? "is-compact" : "", className].filter(Boolean).join(" ");

  return (
    <article className={classes}>
      <div className="image-frame-media">
        {src ? <img src={src} alt={alt || title} loading="lazy" /> : <div className="image-frame-placeholder">{placeholder}</div>}
      </div>
      <div className="image-frame-meta">
        {title ? <p className="image-frame-title">{title}</p> : null}
        {caption ? <p className="image-frame-caption">{caption}</p> : null}
      </div>
    </article>
  );
}
