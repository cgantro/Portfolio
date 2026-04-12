import ImageFrame from "./ImageFrame";

export default function FigureBlock({ title, caption, bullets = [], image }) {
  return (
    <article className="figure-block">
      <ImageFrame
        compact
        title={title}
        caption={caption}
        src={image?.src}
        alt={image?.alt || title}
        placeholder={image?.placeholder || "구조도 / 스크린샷 / 로그 캡처 영역"}
      />
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