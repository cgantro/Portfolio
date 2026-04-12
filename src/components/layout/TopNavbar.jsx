export default function TopNavbar({ items }) {
  return (
    <header className="top-navbar" aria-label="슬라이드 네비게이션">
      <div className="top-navbar-inner">
        <p className="nav-brand">Hong Yoonpyo Portfolio</p>
        <nav>
          <ul className="nav-list">
            {items.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
