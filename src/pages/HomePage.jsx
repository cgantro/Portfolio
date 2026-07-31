import { useMemo } from "react";
import AppShell from "../components/layout/AppShell";
import Timeline from "../components/sections/Timeline";
import Activities from "../components/sections/Activities";
import TechStack from "../components/sections/TechStack";
import Projects from "../components/sections/Projects";
import SubProjects from "../components/sections/SubProjects";
import Contact from "../components/sections/Contact";
import Intro from "../components/sections/Intro";
import useActiveSection from "../hooks/useActiveSection";
import { meta, projects, subProjects, timeline, activities, techStack } from "../data";

const SECTIONS = [
  { id: "intro", label: "소개" },
  { id: "techstack", label: "기술" },
  { id: "experience", label: "경험" },
  { id: "projects", label: "프로젝트" },
  { id: "education", label: "교육" },
];

export default function HomePage() {
  const sectionIds = useMemo(() => SECTIONS.map((section) => section.id), []);
  const activeSection = useActiveSection(sectionIds);

  return (
    <AppShell meta={meta} sections={SECTIONS} activeSection={activeSection}>
      <Intro />

      <section id="techstack" className="section">
        <TechStack stack={techStack} />
      </section>

      <section id="projects" className="section">
        <Projects projects={projects} />
        <div style={{ marginTop: "80px" }}>
          <SubProjects projects={subProjects} />
        </div>
      </section>

      <section id="experience" className="section">
        <Activities items={activities} />
      </section>

      <section id="education" className="section">
        <Timeline items={timeline} />
      </section>

      <section id="contact" className="section">
        <Contact meta={meta} />
      </section>
    </AppShell>
  );
}
