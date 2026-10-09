import { useState } from "react";
import { Link } from "react-router-dom";
import { getProjectSections } from "../../../data/projectSections";
import CodeBlock from "../../ui/CodeBlock";
import styles from "./ProjectPageContent.module.css";

function Section({ id, title, children }) {
  return (
    <section id={id} className={styles.section}>
      <header className={styles.sectionHeader}><h2>{title}</h2></header>
      {children}
    </section>
  );
}

function Results({ project }) {
  const { metrics = [], performanceRows = [] } = project;
  return (
    <>
      {project.resultSummary ? <p className={styles.resultSummary}>{project.resultSummary}</p> : null}
      {metrics.length ? <div className={styles.metricGrid}>
        {metrics.map((metric) => <article className={styles.metricCard} key={metric.label}>
          <p>{metric.label}</p><strong>{metric.value}</strong>{metric.context ? <span>{metric.context}</span> : null}
        </article>)}
      </div> : null}
      {performanceRows.length ? <div className={styles.analysisTableWrap}>
        <table className={styles.analysisTable}>
          <caption>구간별 처리 시간 중앙값 (p50)</caption>
          <thead><tr><th scope="col">구간</th><th scope="col">동기 방식</th><th scope="col">PBO · 작업 스레드 4개</th></tr></thead>
          <tbody>{performanceRows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.before}</td><td>{row.after}</td></tr>)}</tbody>
        </table>
      </div> : null}
    </>
  );
}

function DemoEmbed({ url, title }) {
  const [started, setStarted] = useState(false);
  return started ? (
    <div className={styles.demoFrame}>
      <iframe src={url} title={`${title} 인터랙티브 시뮬레이터`} allow="fullscreen; cross-origin-isolated" allowFullScreen />
    </div>
  ) : (
    <div className={styles.demoLaunch}>
      <div><h3>페이지 안에서 시뮬레이터 실행</h3><p>실제 로봇 동작을 확인할 수 있는 인터랙티브 데모입니다.</p></div>
      <button type="button" onClick={() => setStarted(true)}>시뮬레이터 실행</button>
    </div>
  );
}

function SectionContent({ id, project }) {
  const { architecture, implementations = [], caseStudies = [], verification, links = {} } = project;
  if (id === "results") return <Results project={project} />;
  if (id === "architecture") return <div className={styles.architectureCard}>
    {architecture?.image ? <img src={architecture.image} alt={architecture.alt} loading="lazy" /> : null}
    {architecture?.flow?.length ? <ol className={styles.architectureFlow} aria-label={architecture.alt}>{architecture.flow.map((step, index) => <li key={step.title}><span>0{index + 1}</span><strong>{step.title}</strong><small>{step.detail}</small></li>)}</ol> : null}
    {architecture?.summary ? <p>{architecture.summary}</p> : null}
  </div>;
  if (id === "implementation") return <>
    {project.id === "grasplink" && links.demo ? <DemoEmbed url={links.demo} title={project.title} /> : null}
    <div className={styles.implementationList}>
      {implementations.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}
    </div>
  </>;
  if (id === "case-studies") return <div className={styles.caseList}>
    {caseStudies.map((study, index) => <article className={styles.caseCard} key={study.title}>
      <div className={styles.caseTitle}><span>사례 0{index + 1}</span><h3>{study.title}</h3></div>
      <dl>{[["상황", study.situation], ["원인", study.analysis], ["판단", study.decision], ["적용", study.implementation], ["확인", study.verification], ["범위", study.limitations]]
        .filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {study.code ? <div className={styles.caseCode}><CodeBlock code={study.code} lang={study.codeLanguage ?? "cpp"} label={study.codeLabel ?? "실제 구현 발췌"} /></div> : null}
    </article>)}
  </div>;
  if (id === "verification") return <div>
    {verification?.summary ? <p className={styles.verificationSummary}>{verification.summary}</p> : null}
    <ul className={styles.verificationList}>{verification?.items?.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
  </div>;
  if (id === "sources") return <>
    <div className={styles.sourceCard}>
      <div><p className={styles.cardLabel}>관련 자료</p><h3>{project.title}</h3><p>구현 내용과 실행 화면을 확인할 수 있는 자료입니다.</p></div>
      <div className={styles.sourceActions}>
        {links.github ? <a href={links.github} target="_blank" rel="noreferrer">GitHub 저장소 ↗</a> : null}
        {links.demo && project.id !== "grasplink" ? <a href={links.demo} target="_blank" rel="noreferrer">데모 열기 ↗</a> : null}
      </div>
    </div>
  </>;
  return null;
}

export default function ProjectPageContent({ project, previousProject, nextProject }) {
  const sections = getProjectSections(project);
  return (
    <article className={styles.page} style={{ "--project-accent": project.theme?.accent ?? "var(--accent)" }}>
      <header id="overview" className={styles.hero}>
        <div className={styles.heroText}>
          <Link className={styles.backLink} to="/#projects">← 전체 프로젝트</Link>
          <p className={styles.kicker}>{project.category}</p><h1>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
          <dl className={styles.meta}>{project.period ? <div><dt>기간</dt><dd>{project.period}</dd></div> : null}<div><dt>팀</dt><dd>{project.team}</dd></div><div><dt>담당</dt><dd>{project.role}</dd></div></dl>
          <div className={styles.tags}>{project.stack.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        {project.cover ? <figure className={styles.heroImage}><img src={project.cover} alt={`${project.title} 프로젝트 화면`} /></figure> : null}
      </header>

      <nav className={styles.contents} aria-label="프로젝트 페이지 목차">
        {sections.map(({ id, label }, index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}
      </nav>

      {sections.map(({ id, title }) => <Section key={id} id={id} title={title}><SectionContent id={id} project={project} /></Section>)}

      <nav className={styles.pager} aria-label="다른 프로젝트">
        {previousProject ? <Link to={`/projects/${previousProject.id}`}>← {previousProject.title}</Link> : <span />}
        <Link to="/#projects">프로젝트 목록</Link>
        {nextProject ? <Link to={`/projects/${nextProject.id}`}>{nextProject.title} →</Link> : null}
      </nav>
    </article>
  );
}
