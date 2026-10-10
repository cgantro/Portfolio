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

function CopyPoints({ value, className }) {
  if (Array.isArray(value) && value.length) return <ul className={`${className} ${styles.contentPoints}`}>{value.map((point, index) => <li key={`${index}-${point}`}>{point}</li>)}</ul>;
  return value ? <p className={className}>{value}</p> : null;
}

function DataTable({ title, headers = [], rows = [], note }) {
  if (!rows.length) return null;
  return <div className={styles.analysisTableWrap} role="region" tabIndex={0} aria-label={`${title}, 좌우로 움직여 표의 나머지 항목 확인`}>
    <table className={styles.analysisTable}>
      <caption>{title}</caption>
      <thead><tr>{headers.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
      <tbody>{rows.map((row, index) => {
        const cells = Array.isArray(row) ? row : row.cells;
        return <tr key={row.label ?? index}>{cells.map((cell, cellIndex) => cellIndex === 0
        ? <th scope="row" key={`${cellIndex}-${cell}`}>{cell}</th>
        : <td key={`${cellIndex}-${cell}`}>{cell}</td>)}</tr>;
      })}</tbody>
    </table>
    {note ? <p className={styles.tableNote}>{note}</p> : null}
  </div>;
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
      {project.benchmarkTable ? <DataTable {...project.benchmarkTable} /> : null}
      {performanceRows.length ? <DataTable title={project.performanceCaption ?? "구성별 측정 결과"} headers={project.performanceColumns} rows={performanceRows} note={project.performanceNote} /> : null}
      {project.diagnosticRows?.length ? <DataTable title={project.diagnosticCaption ?? "구간별 계측 결과"} headers={project.diagnosticColumns} rows={project.diagnosticRows} note={project.diagnosticNote} /> : null}
    </>
  );
}

function DemoEmbed({ url, title }) {
  return (
    <div className={styles.demoSection}>
      <div className={styles.demoHeading}>
        <div><p className={styles.cardLabel}>직접 조작</p><h3>{title} 웹 시뮬레이터</h3></div>
        <div className={styles.demoLinks}>
          <a href={url} target="_blank" rel="noreferrer">시뮬레이터 새 탭에서 열기 ↗</a>
        </div>
      </div>
      <div className={styles.demoFrame}>
        <iframe src={url} title={`${title} 웹 시뮬레이터`} allow="fullscreen" allowFullScreen loading="lazy" />
      </div>
      <p className={styles.demoNote}>페이지 가까이 이동하면 시뮬레이터를 불러옵니다. 첫 실행에는 시간이 걸릴 수 있습니다.</p>
    </div>
  );
}

function SectionContent({ id, project }) {
  const { architecture, implementations = [], caseStudies = [], verification, links = {} } = project;
  if (id === "results") return <Results project={project} />;
  if (id === "architecture") return <div className={styles.architectureCard}>
    {architecture?.image ? <div className={styles.architectureImageViewport} role="region" tabIndex={0} aria-label="시스템 구조 그림, 좌우로 움직여 전체를 확인">
      <img src={architecture.image} alt={architecture.alt} loading="lazy" />
    </div> : null}
    {architecture?.modules?.length ? <div className={styles.architectureModuleList}>
      {architecture.modules.map((group) => <section key={group.title} className={styles.architectureModuleGroup}>
        <h3>{group.title}</h3>
        <ul>{group.items.map((item) => <li key={item.title}>
          <strong>{item.title}</strong><small>{item.detail}</small>
        </li>)}</ul>
      </section>)}
    </div> : null}
    {!architecture?.modules?.length && architecture?.mobileFlows?.length ? <div className={styles.architectureMobileFlows}>
      {architecture.mobileFlows.map((flow) => <section key={flow.title} className={styles.architectureMobileFlow}>
        <h3>{flow.title}</h3>
        <ol>{flow.steps.map((step, index) => <li key={step.title}>
          <span>{String(index + 1).padStart(2, "0")}</span><div><strong>{step.title}</strong><small>{step.detail}</small></div>
        </li>)}</ol>
      </section>)}
    </div> : null}
    <CopyPoints value={architecture?.summary} className={styles.architectureSummary} />
  </div>;
  if (id === "implementation") return <>
    <div className={styles.implementationList}>
      {implementations.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><CopyPoints value={item.body} className={styles.implementationBody} /></div></article>)}
    </div>
  </>;
  if (id === "case-studies") return <div className={styles.caseList}>
    {caseStudies.map((study, index) => <article className={styles.caseCard} key={study.title}>
      <div className={styles.caseTitle}><span>사례 0{index + 1}</span><h3>{study.title}</h3></div>
      {study.flow?.length ? <ol className={styles.caseFlow} aria-label={`${study.title} 판단 흐름`}>
        {study.flow.map((step, stepIndex) => <li key={`${step.title ?? step.label}-${stepIndex}`}>
          <span>{String(stepIndex + 1).padStart(2, "0")}</span><div><strong>{step.title ?? step.label}</strong>{step.detail ? <small>{step.detail}</small> : null}</div>
        </li>)}
      </ol> : null}
      <ul className={styles.caseNarrative}>
        {(study.narrative ?? [study.situation, study.analysis, study.decision, study.implementation, study.verification, study.limitations]).filter(Boolean).map((paragraph, paragraphIndex) => <li key={paragraphIndex}>{paragraph}</li>)}
      </ul>
      {study.codeSamples?.length ? <div className={styles.caseCodeSamples}>
        {study.codeSamples.map((sample) => <section className={styles.caseCodeSample} key={sample.title}>
          <h4>{sample.title}</h4>
          <CodeBlock code={sample.code} lang="pseudo" label={sample.label ?? "의사 코드"} />
        </section>)}
      </div> : study.pseudocode ? <div className={styles.caseCode}>
        <CodeBlock code={study.pseudocode} lang="pseudo" label={study.pseudocodeLabel ?? "의사 코드"} />
      </div> : null}
      {study.equations?.length ? <dl className={styles.caseEquations}>
        {study.equations.map((equation) => <div className={styles.caseEquation} key={equation.label}>
          <dt>{equation.label}</dt><dd><code>{equation.expression}</code>{equation.detail ? <span>{equation.detail}</span> : null}</dd>
        </div>)}
      </dl> : null}
      {study.equationNote ? <p className={styles.caseEquationNote}>{study.equationNote}</p> : null}
      {study.code ? <div className={styles.caseCode}>
        <CodeBlock code={study.code} lang={study.codeLanguage ?? "cpp"} label={study.codeLabel ?? "구현 발췌"} />
      </div> : null}
    </article>)}
  </div>;
  if (id === "verification") return <div>
    {verification?.summary ? <p className={styles.verificationSummary}>{verification.summary}</p> : null}
    <ul className={styles.verificationList}>{verification?.items?.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
  </div>;
  if (id === "sources") return <>
    <div className={styles.sourceCard}>
      <div><p className={styles.cardLabel}>프로젝트 링크</p><h3>{project.title}</h3><p>저장소와 실행 가능한 자료를 열어볼 수 있습니다.</p></div>
      <div className={styles.sourceActions}>
        {links.github ? <a href={links.github} target="_blank" rel="noreferrer">GitHub 저장소 ↗</a> : null}
        {links.demo && project.id !== "grasplink" ? <a href={links.demo} target="_blank" rel="noreferrer">데모 열기 ↗</a> : null}
      </div>
    </div>
    {project.id === "grasplink" && links.demo ? <DemoEmbed url={links.demo} title={project.title} /> : null}
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
          <CopyPoints value={project.summary} className={styles.summary} />
          <dl className={styles.meta}>{project.period ? <div><dt>기간</dt><dd>{project.period}</dd></div> : null}{project.team ? <div><dt>팀</dt><dd>{project.team}</dd></div> : null}{project.id !== "robotpal" ? <div><dt>담당 역할</dt><dd>{Array.isArray(project.role) ? <ul className={styles.rolePoints}>{project.role.map((item) => <li key={item}>{item}</li>)}</ul> : project.role}</dd></div> : null}</dl>
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
