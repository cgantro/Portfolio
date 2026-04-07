import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { DEFAULT_SELECTION, PROJECTS } from "./data/portfolioData";
import { createSpaceScene } from "./three/createSpaceScene";

const SECTION_KEYS = ["overview", "architecture", "troubleshooting"];
const DEFAULT_SECTION_TITLES = {
  overview: "Overview",
  architecture: "Architecture",
  troubleshooting: "Troubleshooting",
};

const TECH_GLYPH_MAP = {
  "Java 17": "JV",
  "Spring Boot": "SB",
  PostgreSQL: "PG",
  TimescaleDB: "TS",
  Redis: "RD",
  MQTT: "MQ",
  WebSocket: "WS",
  "C++17": "C++",
  OpenGL: "GL",
  "Flecs ECS": "ECS",
  Qt: "QT",
  CMake: "CM",
  PBO: "PBO",
  Multithreading: "MT",
  RDP: "RDP",
  Leadership: "LD",
  Mentoring: "MN",
  "Feedback Loop": "FL",
  Onboarding: "ONB",
  Coordination: "CO",
};

const TECH_ICON_MAP = {
  "Java 17": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  "Spring Boot": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
  PostgreSQL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  TimescaleDB: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  Redis: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  MQTT: "https://cdn.simpleicons.org/mqtt/8b5cf6",
  WebSocket: "https://cdn.simpleicons.org/socketdotio/38bdf8",
  "C++17": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  OpenGL: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opengl/opengl-original.svg",
  Qt: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/qt/qt-original.svg",
  CMake: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cmake/cmake-original.svg",
};

function getTechGlyph(label) {
  return TECH_GLYPH_MAP[label] ?? label.slice(0, 3).toUpperCase();
}

function getTechIcon(label) {
  return TECH_ICON_MAP[label] ?? null;
}

function normalizeTabContent(fullText) {
  if (fullText && typeof fullText === "object" && !Array.isArray(fullText)) {
    return {
      overview: fullText.overview ?? "",
      architecture: fullText.architecture ?? "",
      troubleshooting: fullText.troubleshooting ?? "",
    };
  }

  const fallback = typeof fullText === "string" ? fullText : "";
  return {
    overview: fallback,
    architecture: "",
    troubleshooting: "",
  };
}

function preprocessMarkdown(text) {
  return String(text ?? "")
    .replace(/^\[(.+?)\]\s*$/gm, "**[$1]**")
    .replace(/\n{3,}/g, "\n\n");
}

export default function App() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const panelRef = useRef(null);
  const sectionRefs = useRef({});

  const [selected, setSelected] = useState(DEFAULT_SELECTION);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const navItems = useMemo(
    () => [
      {
        id: DEFAULT_SELECTION.id ?? "about",
        label: DEFAULT_SELECTION.label ?? "홍윤표",
        kind: "항성",
        fallbackPayload: DEFAULT_SELECTION,
      },
      ...PROJECTS.map((project) => ({
        id: project.id,
        label: project.name,
        kind: "행성",
        fallbackPayload: {
          id: project.id,
          kind: "행성",
          title: project.name,
          subtitle: project.subtitle,
          techStack: project.techStack,
          highlights: project.highlights,
          tabLabels: project.tabLabels,
          fullText: project.fullText,
        },
      })),
    ],
    [],
  );

  useEffect(() => {
    if (!mountRef.current) return undefined;

    const scene = createSpaceScene({
      mountEl: mountRef.current,
      projects: PROJECTS,
      centralInfo: DEFAULT_SELECTION,
      onSelect: (payload) => {
        setSelected(payload);
        setIsPanelOpen(true);
      },
    });

    sceneRef.current = scene;

    return () => {
      sceneRef.current = null;
      scene.dispose();
    };
  }, []);

  const content = useMemo(() => normalizeTabContent(selected?.fullText), [selected]);
  const sectionTitles = selected?.tabLabels ?? DEFAULT_SECTION_TITLES;
  const techStack = selected?.techStack ?? [];
  const highlights = selected?.highlights ?? [];

  useEffect(() => {
    if (!panelRef.current) return;
    panelRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [selected?.id]);

  const handleQuickFocus = (item) => {
    const moved = sceneRef.current?.focusById(item.id) ?? false;
    if (!moved) {
      setSelected(item.fallbackPayload);
    }
    setIsPanelOpen(true);
  };

  const scrollToSection = (key) => {
    const doScroll = () => {
      const section = sectionRefs.current[key];
      if (!section) return;
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (!isPanelOpen) {
      setIsPanelOpen(true);
      window.setTimeout(doScroll, 180);
      return;
    }

    doScroll();
  };

  return (
    <div className="app-shell">
      <div ref={mountRef} className="canvas-host" />

      <div className="left-stack">
        <aside className="hud nav-panel">
          <h2>Quick Focus</h2>
          <div className="nav-list">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`jump-btn ${selected?.id === item.id ? "active" : ""}`}
                onClick={() => handleQuickFocus(item)}
              >
                <span
                  className={`jump-dot ${item.kind === "항성" ? "is-star" : "is-planet"}`}
                />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <section
        ref={panelRef}
        className={`hud detail-panel ${isPanelOpen ? "" : "collapsed"}`}
      >
        <button
          type="button"
          className="panel-close-btn"
          onClick={() => setIsPanelOpen(false)}
          aria-label="상세 패널 닫기"
        >
          ×
        </button>

        <h3>{selected?.kind ?? "항성"}</h3>
        <h4 className="detail-title">{selected?.title ?? ""}</h4>
        <p className="subtitle">{selected?.subtitle ?? ""}</p>
        {(techStack.length > 0 || highlights.length > 0) && (
          <div className="meta-grid">
            {techStack.length > 0 && (
              <section className="meta-card">
                <h5>Tech Stack</h5>
                <div className="tech-chip-list">
                  {techStack.map((tech) => {
                    const iconUrl = getTechIcon(tech);
                    return (
                      <span key={tech} className="tech-chip">
                        {iconUrl ? (
                          <span className="tech-icon-wrap">
                            <img src={iconUrl} alt={tech} className="tech-icon" loading="lazy" />
                          </span>
                        ) : (
                          <span className="tech-glyph">{getTechGlyph(tech)}</span>
                        )}
                        <span className="tech-label">{tech}</span>
                      </span>
                    );
                  })}
                </div>
              </section>
            )}
            {highlights.length > 0 && (
              <section className="meta-card">
                <h5>Highlights</h5>
                <ul className="highlight-list">
                  {highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
        <div className="panel-tools">
          <button
            type="button"
            className="focus-cancel-btn"
            onClick={() => {
              sceneRef.current?.clearFocus();
              setSelected(DEFAULT_SELECTION);
            }}
          >
            포커스 취소
          </button>
        </div>

        <div className="section-anchor-nav" role="navigation" aria-label="섹션 이동">
          {SECTION_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              className="anchor-btn"
              onClick={() => scrollToSection(key)}
            >
              {sectionTitles[key] ?? DEFAULT_SECTION_TITLES[key]}
            </button>
          ))}
        </div>

        {SECTION_KEYS.map((key) => (
          <section
            key={key}
            ref={(node) => {
              sectionRefs.current[key] = node;
            }}
            className="detail-section"
          >
            <h4 className="section-title">
              {sectionTitles[key] ?? DEFAULT_SECTION_TITLES[key]}
            </h4>
            <div className="section-content">
              <ReactMarkdown>{preprocessMarkdown(content[key])}</ReactMarkdown>
            </div>
          </section>
        ))}
      </section>

      {!isPanelOpen && (
        <button
          type="button"
          className="panel-open-btn"
          onClick={() => setIsPanelOpen(true)}
        >
          상세 열기
        </button>
      )}
    </div>
  );
}
