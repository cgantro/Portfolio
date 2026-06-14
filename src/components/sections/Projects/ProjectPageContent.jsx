import styles from "./ProjectPage.module.css";
import AutowingPage from "./AutowingPage";
import MausoleumPage from "./MausoleumPage";
import { buildProjectLinks, PageHeader } from "./ProjectPageBlocks";
import RobotPalPage from "./RobotPalPage";
import StickerPage from "./StickerPage";

export default function ProjectPageContent({ project, previousProject, nextProject }) {
  const detailPage = project.detailPage;
  const links = buildProjectLinks(project, detailPage);

  return (
    <div className={styles.page}>
      <ProjectBody project={project} detailPage={detailPage} links={links} />
      <PageHeader previousProject={previousProject} nextProject={nextProject} />
    </div>
  );
}

function ProjectBody({ project, detailPage, links }) {
  switch (project.id) {
    case "robotpal":
      return <RobotPalPage project={project} detailPage={detailPage} links={links} />;
    case "autowing":
      return <AutowingPage project={project} detailPage={detailPage} links={links} />;
    case "mausoleum":
      return <MausoleumPage project={project} detailPage={detailPage} links={links} />;
    case "sticker":
      return <StickerPage project={project} detailPage={detailPage} links={links} />;
    default:
      return null;
  }
}

