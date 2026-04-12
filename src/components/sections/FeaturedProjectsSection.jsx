import ProjectCard from "../projects/ProjectCard";
import SectionShell from "../common/SectionShell";

export default function FeaturedProjectsSection({ projects }) {
  return (
    <SectionShell id="featured-projects" title="Featured Projects" className="print-break-before">
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionShell>
  );
}
