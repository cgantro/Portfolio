import { Link } from "react-router-dom";
import styles from "./ProjectPage.module.css";

export function PageHeader({ previousProject, nextProject }) {
  return (
    <header className={styles.pageHeader}>
      <nav className={styles.pager} aria-label="project pager">
        {previousProject ? (
          <Link className={styles.pagerLink} to={`/projects/${previousProject.id}`}>
            이전 · {previousProject.title}
          </Link>
        ) : (
          <span className={styles.pagerGhost}>이전 프로젝트 없음</span>
        )}
        {nextProject ? (
          <Link className={styles.pagerLink} to={`/projects/${nextProject.id}`}>
            다음 · {nextProject.title}
          </Link>
        ) : (
          <span className={styles.pagerGhost}>다음 프로젝트 없음</span>
        )}
      </nav>
    </header>
  );
}

export function HeroCard({ project, detailPage, links }) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroMediaCard}>
        <img
          className={styles.heroMedia}
          src={detailPage.hero.media.src}
          alt={detailPage.hero.media.alt}
        />
      </div>
      <div className={styles.heroBody}>
        <span className={styles.heroEyebrow}>{detailPage.hero.eyebrow}</span>
        <span className={styles.projectNumber}>{project.num}</span>
        <h1 className={styles.heroTitle}>{detailPage.hero.title}</h1>
        <p className={styles.heroSubtitle}>{detailPage.hero.subtitle}</p>
        <p className={styles.heroDescription}>{detailPage.hero.description}</p>
        <div className={styles.heroMeta}>
          <span>{project.period}</span>
          <span className={styles.metaDivider}>·</span>
          <span>{project.team}</span>
          <span className={styles.metaDivider}>·</span>
          <span>{project.role}</span>
        </div>
        <div className={styles.tagRow}>
          {project.stack.map((tag) => (
            <span key={tag} className={styles.tagChip}>
              {tag}
            </span>
          ))}
        </div>
        <ul className={styles.highlightList}>
          {project.highlights.map((item) => (
            <li key={item} className={styles.highlightItem}>
              <span className={styles.bulletMark}>›</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        {links.length > 0 ? <LinkGroup links={links} /> : null}
      </div>
    </section>
  );
}

export function ProjectSection({ id, label, title, lead, children }) {
  return (
    <section id={id} className={styles.projectSection}>
      <SectionHeader label={label} title={title} lead={lead} />
      {children}
    </section>
  );
}

export function SectionHeader({ label, title, lead }) {
  return (
    <header className={styles.sectionHeader}>
      <span className={styles.sectionEyebrow}>{label}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {lead ? <p className={styles.sectionLead}>{lead}</p> : null}
    </header>
  );
}

export function CopyCard({ title, paragraphs }) {
  return (
    <article className={styles.surfaceCard}>
      {title ? <h3 className={styles.cardTitle}>{title}</h3> : null}
      <div className={styles.copyStack}>
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className={styles.bodyText}>
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

export function PlainCopy({ paragraphs }) {
  return (
    <div className={styles.plainCopy}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={styles.bodyText}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function FactCard({ title, facts }) {
  return (
    <aside className={styles.factCard}>
      {title ? <h3 className={styles.cardTitle}>{title}</h3> : null}
      <dl className={styles.factList}>
        {facts.map((fact) => (
          <div key={`${fact.label}-${fact.value}`} className={styles.factRow}>
            <dt className={styles.factLabel}>{fact.label}</dt>
            <dd className={styles.factValue}>{fact.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export function PlainFacts({ facts }) {
  return (
    <dl className={styles.plainFacts}>
      {facts.map((fact) => (
        <div key={`${fact.label}-${fact.value}`} className={styles.plainFactRow}>
          <dt className={styles.factLabel}>{fact.label}</dt>
          <dd className={styles.factValue}>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SummaryCard({ title, items, snippet }) {
  return (
    <article className={styles.surfaceCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <ul className={styles.bulletList}>
        {items.map((item) => (
          <li key={item} className={styles.bulletItem}>
            <span className={styles.bulletMark}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {snippet ? <SnippetBlock snippet={snippet} /> : null}
    </article>
  );
}

export function SnippetBlock({ snippet }) {
  if (snippet.type === "table") {
    return (
      <div className={styles.snippetBlock}>
        <p className={styles.infoKicker}>{snippet.label}</p>
        <SimpleTable headers={snippet.headers} rows={snippet.rows} compact />
      </div>
    );
  }

  if (snippet.type === "visual") {
    return (
      <div className={styles.snippetBlock}>
        <p className={styles.infoKicker}>{snippet.label}</p>
        <div className={styles.visualFlow}>
          {snippet.content.map((node, index) => (
            <div key={node.id} className={styles.visualFlowUnit}>
              <div className={styles.visualItem}>
                <span className={styles.visualName}>{node.name}</span>
                <p className={styles.visualDesc}>{node.desc}</p>
              </div>
              {index < snippet.content.length - 1 ? (
                <span className={styles.visualArrow} aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.snippetBlock}>
      <p className={styles.infoKicker}>{snippet.label}</p>
      <pre className={styles.codeBlock}>
        <code>{snippet.code}</code>
      </pre>
    </div>
  );
}

export function TroubleshootingCard({ item, consideration }) {
  return (
    <article className={styles.issueCard}>
      <div className={styles.issueSection}>
        <span className={styles.issueLabel}>문제</span>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.bodyText}>{item.problem}</p>
      </div>
      {item.process?.length ? (
        <div className={styles.issueSection}>
          <span className={styles.issueLabel}>해결 과정</span>
          <ol className={styles.processList}>
            {item.process.map((step, index) => (
              <li key={step} className={styles.processItem}>
                <span className={styles.processIndex}>{String(index + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <div className={styles.issueSection}>
        <span className={styles.issueLabel}>해결</span>
        <p className={styles.bodyText}>{item.solution}</p>
      </div>
      <div className={styles.issueSection}>
        <span className={styles.issueLabel}>결과</span>
        <p className={styles.bodyText}>{item.result}</p>
      </div>
      {consideration ? (
        <div className={styles.issueSection}>
          <span className={styles.issueLabel}>판단 기준</span>
          <p className={styles.bodyText}>{consideration.body}</p>
        </div>
      ) : null}
      {item.snippet ? <SnippetBlock snippet={item.snippet} /> : null}
    </article>
  );
}

export function SimpleTable({ headers, rows, compact = false }) {
  return (
    <div className={styles.tableWrap}>
      <table className={compact ? styles.compactTable : styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row[0]}-${index}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EvidenceList({ notes }) {
  return (
    <div className={styles.plainStack}>
      <h3 className={styles.cardTitle}>정리 기준</h3>
      <ul className={styles.bulletList}>
        {notes.map((note) => (
          <li key={note} className={styles.bulletItem}>
            <span className={styles.bulletMark}>•</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DesignConsiderationPanel({ title = "설계 판단", items }) {
  return (
    <article className={styles.surfaceCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.choiceStack}>
        {items.map((item) => (
          <div key={item.title} className={styles.choiceCard}>
            <h4 className={styles.choiceName}>{item.title}</h4>
            <p className={styles.bodyText}>{item.body}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function TechChoicePanel({ items }) {
  return (
    <article className={styles.surfaceCard}>
      <h3 className={styles.cardTitle}>기술 선택 이유</h3>
      <div className={styles.choiceStack}>
        {items.map((item) => (
          <div key={item.tech} className={styles.choiceCard}>
            <h4 className={styles.choiceName}>{item.tech}</h4>
            <dl className={styles.specList}>
              <div className={styles.specRow}>
                <dt className={styles.specLabel}>특징</dt>
                <dd className={styles.specValue}>{item.feature}</dd>
              </div>
              <div className={styles.specRow}>
                <dt className={styles.specLabel}>장점</dt>
                <dd className={styles.specValue}>{item.advantage}</dd>
              </div>
              <div className={styles.specRow}>
                <dt className={styles.specLabel}>비교</dt>
                <dd className={styles.specValue}>{item.comparison}</dd>
              </div>
              <div className={styles.specRow}>
                <dt className={styles.specLabel}>선정 이유</dt>
                <dd className={styles.specValue}>{item.decision}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </article>
  );
}

export function RetrospectivePanel({ items }) {
  return (
    <div className={styles.retroGrid}>
      {items.map((item) => (
        <article key={item.point} className={styles.retroCard}>
          <span className={styles.issueLabel}>회고</span>
          <h3 className={styles.retroPoint}>{item.point}</h3>
          <p className={styles.bodyText}>{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function LinkGroup({ links }) {
  return (
    <div className={styles.linkGroup}>
      {links.map((link) => (
        <a
          key={`${link.label}-${link.href}`}
          className={styles.ctaLink}
          href={link.href}
          target="_blank"
          rel="noreferrer"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function FlowGrid({ items }) {
  return (
    <div className={styles.featureMosaic}>
      {items.map((item) => (
        <article key={item.title} className={styles.imageFeatureCard}>
          <div className={styles.imageFeatureMedia}>
            <img className={styles.imageFeatureImage} src={item.image} alt={item.title} />
          </div>
          <div className={styles.imageFeatureBody}>
            <span className={styles.infoKicker}>{item.kicker}</span>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.bodyText}>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function TimelinePanel({ title, items }) {
  return (
    <article className={styles.surfaceCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.timelineBoard}>
        {items.map((item, index) => (
          <div key={item.title} className={styles.timelineItem}>
            <div className={styles.timelineRail}>
              <span className={styles.timelineIndex}>{String(index + 1).padStart(2, "0")}</span>
              {index < items.length - 1 ? <span className={styles.timelineLine} /> : null}
            </div>
            <div className={styles.timelineBody}>
              <div className={styles.timelineHeader}>
                <h4 className={styles.cardTitle}>{item.title}</h4>
              </div>
              <ul className={styles.bulletList}>
                {item.items.map((point) => (
                  <li key={point} className={styles.bulletItem}>
                    <span className={styles.bulletMark}>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export function ArchitectureBlock({ notes }) {
  return (
    <article className={styles.architectureBlock}>
      <h3 className={styles.cardTitle}>시스템 구조</h3>
      <ul className={styles.bulletList}>
        {notes.map((note) => (
          <li key={note} className={styles.bulletItem}>
            <span className={styles.bulletMark}>•</span>
            <span>{note}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function buildProjectLinks(project, detailPage) {
  const links = [];
  const seen = new Set();

  const pushLink = (link) => {
    const key = `${link.label}::${link.href}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    links.push(link);
  };

  if (project.links?.github) {
    pushLink({ label: "GitHub", href: project.links.github });
  }

  if (project.links?.demo) {
    pushLink({ label: "Demo", href: project.links.demo });
  }

  if (Array.isArray(detailPage.links)) {
    detailPage.links.forEach((link) => pushLink(link));
  }

  return links;
}
