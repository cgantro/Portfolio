export default function SideNav({ items }) {
  return (
    <aside className="side-nav" aria-label="문서 섹션 이동">
      <p className="side-nav-title">Portfolio Map</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
