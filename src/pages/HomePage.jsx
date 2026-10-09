import { useMemo } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Contact from "../components/sections/Contact";
import Timeline from "../components/sections/Timeline";
import useActiveSection from "../hooks/useActiveSection";
import { activities, meta, projects, subProjects, supportingTechnologies, techStack, timeline } from "../data";
import styles from "./HomePage.module.css";

const SECTIONS = [
  { id: "intro", label: "소개" },
  { id: "projects", label: "프로젝트" },
  { id: "expertise", label: "역량" },
  { id: "background", label: "배경" },
  { id: "contact", label: "연락처" },
];

export default function HomePage() {
  const sectionIds = useMemo(() => SECTIONS.map(({ id }) => id), []);
  const activeSection = useActiveSection(sectionIds);
  const featuredProjects = projects.filter((project) => project.featured !== false);
  const additionalProjects = subProjects.filter((project) => ["media-workbench", "os-lru"].includes(project.id));

  return (
    <AppShell meta={meta} sections={SECTIONS} activeSection={activeSection}>
      <section id="intro" className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>C++ 소프트웨어 개발자</p>
          <h1>로봇 시뮬레이터와<br />실시간 시스템을 만듭니다.</h1>
          <p className={styles.lede}>
            6축 로봇의 기구학과 이동 경로를 구현하고, 영상·음성 전송 흐름을 다뤘습니다.
            성능 문제는 구간별로 측정해 병목을 찾아 개선합니다.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#projects">대표 프로젝트 보기 <span aria-hidden="true">↓</span></a>
            <a className={styles.secondaryAction} href={meta.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          </div>
        </div>
        <aside className={styles.heroNote} aria-label="핵심 개발 분야">
          <p className={styles.noteLabel}>주요 개발 분야</p>
          <ul>
            <li><span>01</span> 로봇 시뮬레이션</li>
            <li><span>02</span> C++ 시스템·그래픽스</li>
            <li><span>03</span> 영상·음성 전송</li>
          </ul>
          <p className={styles.location}>{meta.location} <span>·</span> {meta.email}</p>
        </aside>
      </section>

      <section id="projects" className={`section ${styles.section}`}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>주요 프로젝트 · 2025–2026</p>
          <h2>대표 프로젝트</h2>
          <p>직접 맡은 기능과 그 과정에서 내린 기술적 판단을 담았습니다.</p>
        </div>
        <div className={styles.projectGrid}>
          {featuredProjects.map((project, index) => {
            return (
              <Link className={styles.projectCard} to={`/projects/${project.id}`} key={project.id}>
                <div className={styles.projectImage}>
                  {project.cover ? <img src={project.cover} alt={`${project.title} 프로젝트 화면`} loading={index > 1 ? "lazy" : "eager"} /> : project.id === "grasplink" ? (
                    <div className={styles.projectFlowCover} aria-label="GraspLink 로봇 시뮬레이터 구성 요약">
                      <span>로봇 시뮬레이션 흐름</span><strong>HCR-12A</strong><small>기구학 계산 <i>→</i> 경로 계획 <i>→</i> 충돌 검사</small>
                    </div>
                  ) : <span>{project.title}</span>}
                  <span className={styles.projectNumber}>0{index + 1}</span>
                </div>
                <div className={styles.projectCopy}>
                  <div className={styles.projectMeta}><span>{project.category}</span><span>{project.period}</span></div>
                  <h3>{project.title}<span aria-hidden="true"> ↗</span></h3>
                  {Array.isArray(project.summary) ? <ul className={styles.projectSummaryPoints}>{project.summary.map((point) => <li key={point}>{point}</li>)}</ul> : <p>{project.summary}</p>}
                  {project.cardRole ? <div className={styles.cardRole}><span>담당</span><strong>{project.cardRole}</strong></div> : null}
                  {project.homeHighlight ? <div className={styles.projectMetric}><strong>{project.homeHighlight}</strong>{project.homeHighlightNote ? <span>{project.homeHighlightNote}</span> : null}</div> : null}
                  <div className={styles.tags}>{project.stack.slice(0, 5).map((skill) => <span key={skill}>{skill}</span>)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="expertise" className={`section ${styles.section} ${styles.expertiseSection}`}>
        <div className={styles.sectionHeading}>
          <h2>기술 역량</h2>
        </div>
        <div className={styles.expertiseGrid}>
          {techStack.map((item, index) => (
            <article className={styles.expertiseCard} key={item.category}>
              <span className={styles.expertiseIndex}>0{index + 1}</span>
              <h3>{item.category}</h3>
              <p>{item.evidence}</p>
              <div className={styles.tags}>{item.items.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </article>
          ))}
        </div>
        <div className={styles.supportingTech}>
          <strong>{supportingTechnologies.label}</strong>
          <div className={styles.tags}>{supportingTechnologies.items.map((skill) => <span key={skill}>{skill}</span>)}</div>
          <small>{supportingTechnologies.evidence}에서 사용했습니다.</small>
        </div>
        <div className={styles.supporting}>
          <div>
            <h3>보조 프로젝트</h3>
          </div>
          <div className={styles.additionalList}>
            {additionalProjects.map((project) => project.links?.github ? (
              <a key={project.id} href={project.links.github} target="_blank" rel="noreferrer">
                <span><strong>{project.title}</strong><small>{project.subtitle}</small></span><span aria-hidden="true">↗</span>
              </a>
            ) : (
              <div className={styles.additionalRow} key={project.id}>
                <span><strong>{project.title}</strong><small>{project.subtitle}</small></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="background" className={`section ${styles.section} ${styles.backgroundSection}`}>
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>학력과 활동</p>
          <h2>교육과 활동</h2>
        </div>
        <Timeline items={timeline} />
        {activities.length ? <div className={styles.activityStrip}>{activities.map((activity) => <p key={activity.id}><strong>{activity.title}</strong><span>{activity.period} · {activity.subtitle}</span>{activity.items?.[1] ? <span>{activity.items[1]}</span> : null}</p>)}</div> : null}
      </section>

      <section id="contact" className={`section ${styles.contactSection}`}>
        <Contact meta={meta} />
      </section>
    </AppShell>
  );
}
