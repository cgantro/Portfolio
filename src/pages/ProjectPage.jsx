import { Navigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProjectPageContent from "../components/sections/Projects/ProjectPageContent";
import useActiveSection from "../hooks/useActiveSection";
import { meta, projects } from "../data";
import { getProjectSections } from "../data/projectSections";

export default function ProjectPage() {
  const { projectId } = useParams();
  const projectIndex = projects.findIndex((item) => item.id === projectId);
  const project = projectIndex === -1 ? null : projects[projectIndex];
  const PROJECT_SECTIONS = [{ id: "overview", label: "프로젝트" }, ...(project ? getProjectSections(project) : [])];
  const sectionIds = PROJECT_SECTIONS.map(({ id }) => id);
  const activeSection = useActiveSection(sectionIds);

  if (!project) return <Navigate to="/" replace />;

  return (
    <AppShell
      meta={meta}
      sections={PROJECT_SECTIONS}
      activeSection={activeSection}
      style={{ "--accent": project.theme?.accent ?? "#2563eb", "--accent-dim": project.theme?.accent ?? "#1d4ed8", "--accent-bg": "color-mix(in srgb, var(--accent) 13%, white)" }}
    >
      <ProjectPageContent
        project={project}
        previousProject={projects[projectIndex - 1] ?? null}
        nextProject={projects[projectIndex + 1] ?? null}
      />
    </AppShell>
  );
}
