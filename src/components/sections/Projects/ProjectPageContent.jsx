import { Link } from "react-router-dom";
import CodeBlock from "../../ui/CodeBlock";
import styles from "./ProjectPageContent.module.css";

const SECTIONS = [
  ["overview", "개요"],
  ["results", "핵심 결과"],
  ["architecture", "구조"],
  ["implementation", "구현"],
  ["case-studies", "문제 해결"],
  ["verification", "검증"],
  ["sources", "자료"],
];

function Section({ id, index, label, title, intro, children }) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.sectionHeader}>
        <p>{index} / {label}</p>
        <h2>{title}</h2>
        {intro ? <span>{intro}</span> : null}
      </div>
      {children}
    </section>
  );
}

function DecisionVisual({ visual }) {
  if (!visual) return null;
  return (
    <aside className={styles.decisionVisual} aria-label={`${visual.title} 의사 코드와 판단 흐름`}>
      <div className={styles.visualHeader}>
        <p className={styles.visualEyebrow}>문제 해결 판단 과정</p>
        <h3>{visual.title}</h3>
        <p>아래 코드는 실제 소스 코드가 아닌, 문제 해결에서 사용한 판단 기준을 요약한 의사 코드입니다.</p>
      </div>
      <div className={styles.visualGrid}>
        <CodeBlock code={visual.code} lang="의사 코드" label="판단 기준 요약" />
        <ol className={styles.decisionSteps}>
          {visual.steps?.map((step, index) => (
            <li key={`${step.label}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h4>{step.label}</h4><p>{step.detail}</p></div>
            </li>
          ))}
        </ol>
      </div>
      {visual.note ? <p className={styles.visualNote}>{visual.note}</p> : null}
    </aside>
  );
}

export default function ProjectPageContent({ project, previousProject, nextProject }) {
  const { caseStudies = [], metrics = [], implementations = [], verification, architecture, links = {} } = project;
  const mainCase = caseStudies[0];
  const limitations = [...new Set(caseStudies.map(({ limitations: item }) => item).filter(Boolean))];

  return (
    <article className={styles.page} style={{ "--project-accent": project.theme?.accent ?? "var(--accent)" }}>
      <header id="overview" className={styles.hero}>
        <div className={styles.heroText}>
          <Link className={styles.backLink} to="/#projects">← 전체 프로젝트</Link>
          <p className={styles.kicker}>{project.category}</p>
          <h1>{project.title}</h1>
          <p className={styles.summary}>{project.summary}</p>
          <dl className={styles.meta}>
            {project.period ? <div><dt>기간</dt><dd>{project.period}</dd></div> : null}
            <div><dt>팀</dt><dd>{project.team}</dd></div>
            <div><dt>담당</dt><dd>{project.role}</dd></div>
          </dl>
          <div className={styles.tags}>{project.stack.map((skill) => <span key={skill}>{skill}</span>)}</div>
        </div>
        {project.cover ? <figure className={styles.heroImage}><img src={project.cover} alt={`${project.title} 프로젝트 화면`} /></figure> : null}
      </header>

      <nav className={styles.contents} aria-label="프로젝트 페이지 목차">
        {SECTIONS.map(([id, label], index) => <a key={id} href={`#${id}`}><span>0{index + 1}</span>{label}</a>)}
      </nav>

      {metrics.length || project.resultSummary ? (
        <Section id="results" index="02" label="핵심 결과" title="무엇을 확인했나" intro={project.resultsIntro ?? "구현 결과와 측정 조건을 구분해 정리했습니다."}>
          {project.resultSummary ? <p className={styles.resultSummary}>{project.resultSummary}</p> : null}
          {metrics.length ? (
            <div className={styles.metricGrid}>
              {metrics.map((metric) => <article className={styles.metricCard} key={metric.label}><p>{metric.label}</p><strong>{metric.value}</strong><span>{metric.context}</span></article>)}
            </div>
          ) : null}
        </Section>
      ) : null}

      <Section id="architecture" index="03" label="시스템 구조" title="시스템은 어떻게 움직이나" intro="전체 처리 흐름과 제가 맡은 부분을 구분했습니다.">
        <div className={styles.architectureCard}>
          {architecture?.image ? <img src={architecture.image} alt={architecture.alt} loading="lazy" /> : null}
          {architecture?.flow?.length ? (
            <ol className={styles.architectureFlow} aria-label={architecture.alt}>
              {architecture.flow.map((step, index) => (
                <li key={step.title}>
                  <span>0{index + 1}</span><strong>{step.title}</strong><small>{step.detail}</small>
                  {index < architecture.flow.length - 1 ? <i aria-hidden="true">→</i> : null}
                </li>
              ))}
            </ol>
          ) : null}
          <p>{architecture?.summary}</p>
        </div>
      </Section>

      <Section id="implementation" index="04" label="핵심 구현" title="직접 구현한 내용" intro="프로젝트의 동작을 설명하는 핵심 구현입니다.">
        <div className={styles.implementationList}>
          {implementations.map((item, index) => <article key={item.title}><span>0{index + 1}</span><div><h3>{item.title}</h3><p>{item.body}</p></div></article>)}
        </div>
      </Section>

      <Section id="case-studies" index="05" label="문제 해결 사례" title="문제를 해결한 과정" intro="문제를 재현하고 원인을 확인한 뒤, 근거를 바탕으로 해결 방향을 정했습니다.">
        <DecisionVisual visual={project.decisionVisual} />
        <div className={styles.caseList}>
          {caseStudies.map((study, index) => (
            <article className={styles.caseCard} key={study.title}>
              <div className={styles.caseTitle}><span>사례 0{index + 1}</span><h3>{study.title}</h3></div>
              <dl>
                <div><dt>상황</dt><dd>{study.situation}</dd></div>
                <div><dt>원인 분석</dt><dd>{study.analysis}</dd></div>
                <div><dt>선택 근거</dt><dd>{study.decision}</dd></div>
                <div><dt>구현</dt><dd>{study.implementation}</dd></div>
                <div><dt>검증</dt><dd>{study.verification}</dd></div>
                <div><dt>한계</dt><dd>{study.limitations}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <Section id="verification" index="06" label="검증과 한계" title="어디까지 확인했나" intro={verification?.summary}>
        <ul className={styles.verificationList}>{verification?.items?.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ul>
        {limitations.length ? <div className={styles.limitations}><p>추가 검증이 필요한 항목</p><ul>{limitations.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
      </Section>

      <Section id="sources" index="07" label="자료와 실행" title="저장소와 데모" intro={links.github || links.demo ? "공개된 저장소와 데모를 연결했습니다." : "현재 연결할 수 있는 공개 저장소나 데모 주소가 없습니다."}>
        <div className={styles.sourceCard}>
          <div><p className={styles.cardLabel}>관련 자료</p><h3>{project.title}</h3><p>{links.github || links.demo ? "구현 내용과 실행 화면은 연결된 자료에서 확인할 수 있습니다." : "공개 링크를 확인하지 못해 이 페이지에는 저장소와 데모를 연결하지 않았습니다."}</p></div>
          <div className={styles.sourceActions}>
            {links.github ? <a href={links.github} target="_blank" rel="noreferrer">GitHub 저장소 ↗</a> : <span>공개된 저장소 주소 없음</span>}
            {links.demo ? <a href={links.demo} target="_blank" rel="noreferrer">데모 새 탭에서 열기 ↗</a> : null}
          </div>
        </div>
        {links.demo && project.id === "grasplink" ? (
          <div className={styles.demoFrame}>
            <iframe
              src={links.demo}
              title="GraspLink 인터랙티브 시뮬레이터"
              allow="fullscreen; cross-origin-isolated"
              allowFullScreen
            />
          </div>
        ) : null}
      </Section>

      <nav className={styles.pager} aria-label="다른 프로젝트">
        {previousProject ? <Link to={`/projects/${previousProject.id}`}>← {previousProject.title}</Link> : <span />}
        <Link to="/#projects">프로젝트 목록</Link>
        {nextProject ? <Link to={`/projects/${nextProject.id}`}>{nextProject.title} →</Link> : null}
      </nav>
    </article>
  );
}
