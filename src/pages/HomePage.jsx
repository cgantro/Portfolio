import { useMemo } from "react";
import AppShell from "../components/layout/AppShell";
import Timeline from "../components/sections/Timeline";
import Activities from "../components/sections/Activities";
import TechStack from "../components/sections/TechStack";
import Projects from "../components/sections/Projects";
import Contact from "../components/sections/Contact";
import Intro from "../components/sections/Intro";
import useActiveSection from "../hooks/useActiveSection";
import { meta, projects, timeline, activities, techStack } from "../data";

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "projects", label: "Projects" },
  { id: "techstack", label: "Technical Skills" },
  { id: "timeline", label: "Education & Certification" },
  { id: "activities", label: "Activity" },
  { id: "contact", label: "Contact" },
];

export default function HomePage() {
  const sectionIds = useMemo(() => SECTIONS.map((section) => section.id), []);
  const activeSection = useActiveSection(sectionIds);

  return (
    <AppShell meta={meta} sections={SECTIONS} activeSection={activeSection}>
      <Intro />
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

      <section id="contact" className="section">
        <Contact meta={meta} />
      </section>
    </AppShell>
  );
}
