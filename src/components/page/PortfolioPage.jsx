import TopNavbar from "../layout/TopNavbar";
import ProjectDeck from "../projects/ProjectDeck";
import HeroSection from "./HeroSection";
import SummarySection from "./SummarySection";

export default function PortfolioPage({ doc, navItems }) {
  return (
    <div className="deck-page">
      <a className="skip-link" href="#summary">
        본문 바로가기
      </a>

      <TopNavbar items={navItems} />

      <main className="portfolio-page" aria-label="포트폴리오 문서">
        <HeroSection doc={doc} />

        <SummarySection summary={doc.summary} techStacks={doc.techStacks} />

        <section className="page-section" id="projects">
          <div className="section-header">
            <h2>주요 프로젝트</h2>
          </div>
          <div className="project-section-list">
            {doc.featuredProjectDecks.map((project) => (
              <ProjectDeck key={project.id} project={project} sectionLabel="주요 프로젝트" />
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
