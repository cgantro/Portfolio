import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProjectPageContent from "../components/sections/Projects/ProjectPageContent";
import useActiveSection from "../hooks/useActiveSection";
import { meta, projects } from "../data";

const PROJECT_SECTIONS = [
  { id: "overview", label: "개요" },
  { id: "results", label: "결과" },
  { id: "architecture", label: "구조" },
  { id: "implementation", label: "구현" },
  { id: "case-studies", label: "문제 해결" },
  { id: "verification", label: "검증" },
  { id: "sources", label: "자료" },
];

export default function ProjectPage() {
  const { projectId } = useParams();
  const projectIndex = projects.findIndex((item) => item.id === projectId);
  const project = projectIndex === -1 ? null : projects[projectIndex];
  const sectionIds = useMemo(() => PROJECT_SECTIONS.map(({ id }) => id), []);
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
