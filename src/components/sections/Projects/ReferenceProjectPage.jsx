import { Link } from "react-router-dom";
import { buildProjectLinks } from "./ProjectPageBlocks";
import ProjectIcon from "./ProjectIcon";
import styles from "./ReferenceProjectPage.module.css";

function DetailSection({ eyebrow, title, children }) {
  return (
    <section className={styles.section}>
      <p className={styles.sectionEyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function ReferenceProjectPage({ project, detailPage, previousProject, nextProject }) {
  const links = buildProjectLinks(project, detailPage);
  const metrics = detailPage.benchmarkTable ?? detailPage.designMetrics;

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>프로젝트 상세</p>
        <span className={styles.logo}><ProjectIcon id={project.id} className={styles.projectIcon} /></span>
        <h1>{project.title}</h1>
        <p className={styles.subtitle}>{project.subtitle}</p>
        <dl className={styles.meta}>
          <div><dt>기간</dt><dd>{project.period}</dd></div>
          <div><dt>팀 구성</dt><dd>{project.team} 팀 프로젝트</dd></div>
          <div><dt>역할</dt><dd>{project.roleItems?.[0] ?? project.role}</dd></div>
        </dl>
      </header>

      {detailPage.hero.media?.src ? (
        <figure className={styles.media}>
          <img src={detailPage.hero.media.src} alt={detailPage.hero.media.alt} />
          {detailPage.hero.media.caption ? <figcaption>{detailPage.hero.media.caption}</figcaption> : null}
        </figure>
      ) : null}

      <DetailSection eyebrow="Overview" title="프로젝트 개요">
        <p className={styles.description}>{detailPage.hero.description}</p>
        {project.roleItems?.length ? <ul className={styles.roleList}>{project.roleItems.map((item) => <li key={item}>{item}</li>)}</ul> : null}
        <div className={styles.skills}>{project.stack.map((skill) => <span key={skill}>{skill}</span>)}</div>
        {links.length ? <div className={styles.links}>{links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div> : null}
      </DetailSection>

      <DetailSection eyebrow="Implementation" title="주요 구현">
        <div className={styles.entryList}>
          {project.implementations.map((item, index) => (
            <article key={item.title} className={styles.entry}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.title}</h3><p>{item.summary}</p></div>
            </article>
          ))}
        </div>
      </DetailSection>

      <DetailSection eyebrow="Troubleshooting" title="문제 해결">
        <div className={styles.entryList}>
          {project.problems.map((item, index) => (
            <article key={item.title} className={styles.entry}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.title}</h3><p><b>문제.</b> {item.problem}</p><p><b>해결.</b> {item.solution}</p><p className={styles.result}><b>결과.</b> {item.result}</p></div>
            </article>
          ))}
        </div>
      </DetailSection>

      {metrics ? (
        <DetailSection eyebrow="Validation" title={metrics.title}>
          <div className={styles.tableWrap}>
            <table><thead><tr>{metrics.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{metrics.rows.map((row) => <tr key={row.join("-")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table>
          </div>
          {metrics.note ? <p className={styles.note}>{metrics.note}</p> : null}
        </DetailSection>
      ) : null}

      <DetailSection eyebrow="Architecture" title="아키텍처">
        {detailPage.architectureImage ? (
          <figure className={styles.architectureFigure}>
            {detailPage.architectureImage.markup ? (
              <div
                className={styles.architectureSvg}
                role="img"
                aria-label={detailPage.architectureImage.alt}
                dangerouslySetInnerHTML={{ __html: detailPage.architectureImage.markup }}
              />
            ) : (
              <img src={detailPage.architectureImage.src} alt={detailPage.architectureImage.alt} />
            )}
          </figure>
        ) : null}
      </DetailSection>

      <DetailSection eyebrow="Review" title="한계와 추가 검증">
        <div className={styles.entryList}>{project.retrospective.map((item, index) => <article key={item.point} className={styles.entry}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{item.point}</h3><p>{item.detail}</p></div></article>)}</div>
      </DetailSection>

      {previousProject || nextProject ? (
        <nav className={styles.pager}>
          {previousProject ? <Link to={`/projects/${previousProject.id}`}>← {previousProject.title}</Link> : <span />}
          {nextProject ? <Link to={`/projects/${nextProject.id}`}>{nextProject.title} →</Link> : null}
        </nav>
      ) : null}
    </article>
  );
}
