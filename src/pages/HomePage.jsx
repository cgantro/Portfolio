import { useMemo } from "react";
import AppShell from "../components/layout/AppShell";
import Timeline from "../components/sections/Timeline";
import Activities from "../components/sections/Activities";
import TechStack from "../components/sections/TechStack";
import Projects from "../components/sections/Projects";
import SubProjects from "../components/sections/SubProjects";
import Contact from "../components/sections/Contact";
import useActiveSection from "../hooks/useActiveSection";
import { meta, projects, subProjects, timeline, activities, techStack } from "../data";

const SECTIONS = [
  { id: "projects", label: "주력 프로젝트" },
  { id: "techstack", label: "기술 스택" },
  { id: "timeline", label: "이력" },
  { id: "activities", label: "대외활동" },
  { id: "sub-projects", label: "서브 프로젝트" },
  { id: "contact", label: "연락처" },
];

export default function HomePage() {
  const sectionIds = useMemo(() => SECTIONS.map((section) => section.id), []);
  const activeSection = useActiveSection(sectionIds);

  return (
    <AppShell meta={meta} sections={SECTIONS} activeSection={activeSection}>
      <section id="projects" className="section">
        <Projects projects={projects} />
      </section>

      <section id="techstack" className="section">
        <TechStack stack={techStack} />
      </section>

      <section id="timeline" className="section">
        <Timeline items={timeline} />
      </section>

      <section id="activities" className="section">
        <Activities items={activities} />
      </section>

      <section id="sub-projects" className="section">
        <SubProjects projects={subProjects} />
      </section>

      <section id="contact" className="section">
        <Contact meta={meta} />
      </section>
    </AppShell>
  );
}
