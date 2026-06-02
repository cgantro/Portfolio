import Sidebar from "./Sidebar";
import MobileHeader from "./MobileHeader";

export default function AppShell({ meta, sections, activeSection, children, style }) {
  return (
    <div className="layout" style={style}>
      <Sidebar meta={meta} sections={sections} activeSection={activeSection} />
      <MobileHeader meta={meta} sections={sections} activeSection={activeSection} />
      <main className="main">{children}</main>
    </div>
  );
}
