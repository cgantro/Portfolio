import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProjectPageContent from "../components/sections/Projects/ProjectPageContent";
import useActiveSection from "../hooks/useActiveSection";
import { meta, projects } from "../data";

export default function ProjectPage() {
  const { projectId } = useParams();
  const projectIndex = projects.findIndex((project) => project.id === projectId);

  if (projectIndex === -1) {
    return <Navigate to="/" replace />;
  }

  const project = projects[projectIndex];
  const detailPage = project.detailPage;
  const sections = detailPage.sections.map((section) => ({
    id: section.id,
    label: section.label,
  }));
  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);
  const activeSection = useActiveSection(sectionIds);
  const previousProject = projects[projectIndex - 1] ?? null;
  const nextProject = projects[projectIndex + 1] ?? null;

  return (
    <AppShell
      meta={meta}
      sections={sections}
      activeSection={activeSection}
      style={{
        "--accent": detailPage.theme.accent,
        "--accent-dim": detailPage.theme.accent,
        "--accent-bg": detailPage.theme.accentSoft,
        "--project-accent": detailPage.theme.accent,
        "--project-accent-soft": detailPage.theme.accentSoft,
        "--project-surface": detailPage.theme.surface,
        "--project-glow": detailPage.theme.glow,
        "--content-max": "1600px",
        "--main-gutter": "20px",
      }}
    >
      <ProjectPageContent
        project={project}
        previousProject={previousProject}
        nextProject={nextProject}
      />
    </AppShell>
  );
}
