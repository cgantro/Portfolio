import { useEffect, useMemo, useRef, useState } from "react";
import TopNavbar from "../layout/TopNavbar";
import ProjectDeck from "../projects/ProjectDeck";
import HeroSection from "./HeroSection";
import SummarySection from "./SummarySection";

function ProjectLinks({ project }) {
  const links = project.links || (project.repo ? [{ label: "깃허브", href: project.repo }] : []);

  if (!links.length) return null;

  return (
    <div className="project-overlay-links">
      {links.map((link) => (
        <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      ))}
    </div>
  );
}

const OVERLAY_TRANSITION_MS = 220;

export default function PortfolioPage({ doc, navItems }) {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [overlayActive, setOverlayActive] = useState(false);
  const closeTimerRef = useRef(null);
  const selectedProject = useMemo(
    () => doc.featuredProjectDecks.find((project) => project.id === selectedProjectId) ?? null,
    [doc.featuredProjectDecks, selectedProjectId]
  );

  useEffect(() => {
    if (!selectedProject) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeydown = (event) => {
      if (event.key === "Escape") requestCloseOverlay();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeydown);
    const rafId = window.requestAnimationFrame(() => setOverlayActive(true));

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject]);

  useEffect(
    () => () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    []
  );

  const openOverlay = (projectId) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOverlayActive(false);
    setSelectedProjectId(projectId);
  };

  const requestCloseOverlay = () => {
    if (!selectedProjectId) return;
    setOverlayActive(false);

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const closeDelay = prefersReducedMotion ? 0 : OVERLAY_TRANSITION_MS;

    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedProjectId(null);
      closeTimerRef.current = null;
    }, closeDelay);
  };

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
          <div className="project-grid">
            {doc.featuredProjectDecks.map((project) => (
              <button
                key={project.id}
                type="button"
                className="project-grid-card"
                aria-label={`${project.name} 상세 열기`}
                onClick={() => openOverlay(project.id)}
              >
                {project.cardImage ? (
                  <span className="project-grid-card-image-wrap">
                    <img className="project-grid-card-image" src={project.cardImage.src} alt={project.cardImage.alt} />
                  </span>
                ) : null}
                <span className="project-grid-card-title">{project.name}</span>
                <span className="project-grid-card-summary">{project.oneLine}</span>
                <span className="project-grid-card-tags" aria-hidden="true">
                  {project.stackTags.slice(0, 4).map((tag) => (
                    <span key={`${project.id}-${tag}`} className="project-grid-card-tag">
                      {tag}
                    </span>
                  ))}
                </span>
                <span className="project-grid-card-cta">상세 보기</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {selectedProject ? (
        <div
          className={["project-overlay", overlayActive ? "is-active" : ""].filter(Boolean).join(" ")}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-title-${selectedProject.id}`}
        >
          <div className="project-overlay-backdrop" onClick={requestCloseOverlay} />
          <div className="project-overlay-panel">
            <header className="project-overlay-header">
              <div>
                <p className="project-overlay-kicker">Project Detail</p>
                <h3 id={`project-title-${selectedProject.id}`}>{selectedProject.name}</h3>
                <p className="project-overlay-summary">{selectedProject.oneLine}</p>
                <ProjectLinks project={selectedProject} />
              </div>
              <button type="button" className="project-overlay-close" onClick={requestCloseOverlay} aria-label="상세 닫기">
                닫기
              </button>
            </header>

            <div className="project-overlay-content">
              <ProjectDeck project={selectedProject} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
