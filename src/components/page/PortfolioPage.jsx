import TopNavbar from "../layout/TopNavbar";
import ProjectDeck from "../projects/ProjectDeck";
import HeroSection from "./HeroSection";
import SummarySection from "./SummarySection";
import ContactSection from "./ContactSection";

export default function PortfolioPage({ doc, navItems }) {
  return (
    <div className="deck-page">
      <a className="skip-link" href="#summary">
        본문 바로가기
      </a>

      <TopNavbar items={navItems} />

      <main className="portfolio-page" aria-label="Portfolio document page">
        <HeroSection doc={doc} />

        <SummarySection summary={doc.summary} techStacks={doc.techStacks} />

        <section className="page-section" id="projects">
          <div className="section-header">
            <h2>Featured Projects</h2>
          </div>
          <div className="project-section-list">
            {doc.featuredProjectDecks.map((project) => (
              <ProjectDeck key={project.id} project={project} sectionLabel="Featured Project" />
            ))}
          </div>
        </section>

        <section className="page-section" id="in-progress">
          <div className="section-header">
            <h2>In Progress</h2>
          </div>
          <ProjectDeck project={doc.inProgressDeck} sectionLabel="In Progress" />
        </section>

        <ContactSection collaborationContact={doc.collaborationContact} />
      </main>
    </div>
  );
}