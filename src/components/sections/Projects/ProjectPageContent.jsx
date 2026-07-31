import ReferenceProjectPage from "./ReferenceProjectPage";

export default function ProjectPageContent({ project, previousProject, nextProject }) {
  return <ReferenceProjectPage project={project} detailPage={project.detailPage} previousProject={previousProject} nextProject={nextProject} />;
}
