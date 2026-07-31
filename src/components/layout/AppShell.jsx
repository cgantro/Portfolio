import { Link } from "react-router-dom";

export default function AppShell({ meta, sections, activeSection, children, style }) {
  return (
    <div className="site-shell" style={style}>
      <header className="site-header">
        <Link to="/" className="site-mark" aria-label={`${meta.name} 홈`}>
          <i />
          <i />
          <i />
        </Link>
        <nav className="site-nav" aria-label="주요 메뉴">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={activeSection === section.id ? "site-nav-active" : undefined}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
