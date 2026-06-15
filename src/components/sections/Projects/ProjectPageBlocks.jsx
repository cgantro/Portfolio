import { Link } from "react-router-dom";
import styles from "./ProjectPage.module.css";

export function PageHeader({ previousProject, nextProject }) {
  if (!previousProject && !nextProject) {
    return null;
  }

  return (
    <header className={styles.pageHeader}>
      <nav className={styles.pager} aria-label="project pager">
        {previousProject ? (
          <Link className={styles.pagerLink} to={`/projects/${previousProject.id}`}>
            Previous Project · {previousProject.title}
          </Link>
        ) : null}
        {nextProject ? (
          <Link className={styles.pagerLink} to={`/projects/${nextProject.id}`}>
            Next Project · {nextProject.title}
          </Link>
        ) : null}
      </nav>
    </header>
  );
}

export function HeroCard({ project, detailPage, links }) {
  const coreStack = project.stack?.slice(0, 4) ?? [];
  const contextBody = detailPage.context?.body ?? [];

  return (
    <section className={styles.hero}>
      <div className={styles.heroBody}>
        <span className={styles.heroEyebrow}>{detailPage.hero.eyebrow}</span>
        <span className={styles.projectNumber}>{project.num}</span>
        <h1 className={styles.heroTitle}>{detailPage.hero.title}</h1>
        <div className={styles.heroMeta}>
          <span>{project.period}</span>
          <span className={styles.metaDivider}>/</span>
          <span>{project.team}</span>
          <span className={styles.metaDivider}>/</span>
          <span>{project.stack.slice(0, 2).join(" · ")}</span>
        </div>
        {detailPage.hero.subtitle ? (
          <p className={styles.heroSummary}>{detailPage.hero.subtitle}</p>
        ) : null}
        {detailPage.hero.description ? (
          <p className={styles.heroDescription}>{detailPage.hero.description}</p>
        ) : null}
        {contextBody.length ? (
          <div className={styles.plainCopy}>
            {contextBody.map((paragraph) => (
              <p key={paragraph} className={styles.bodyText}>
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
        <div className={styles.tagRow}>
          {coreStack.map((tag) => (
            <span key={tag} className={styles.tagChip}>
              {tag}
            </span>
          ))}
        </div>
        {links.length > 0 ? <LinkGroup links={links} /> : null}
      </div>
      <div className={styles.heroMediaCard}>
        <img
          className={styles.heroMedia}
          src={detailPage.hero.media.src}
          alt={detailPage.hero.media.alt}
        />
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

export function OverviewInfoGrid({ items }) {
  return (
    <div className={styles.overviewInfoGrid}>
      {items.map((item) => (
        <article key={item.label} className={styles.overviewInfoCard}>
          <span className={styles.specLabel}>{item.label}</span>
          {Array.isArray(item.values) ? (
            <ul className={styles.overviewValueList}>
              {item.values.map((value) => (
                <li key={value} className={styles.overviewValueChip}>
                  {value}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.sectionGuideText}>{item.value}</p>
          )}
        </article>
      ))}
    </div>
  );
}

export function FactPanel({ title, facts, snippet }) {
  return (
    <article className={styles.surfaceCard}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <PlainFacts facts={facts} />
      {snippet ? <SnippetBlock snippet={snippet} /> : null}
    </article>
  );
}

export function SummaryCard({ title, summary, details, items, snippet, className = "" }) {
  const hasNarrative = Boolean(summary || details?.length);

  return (
    <article className={[styles.surfaceCard, className].filter(Boolean).join(" ")}>
      <h3 className={styles.cardTitle}>{title}</h3>
      {summary ? <p className={styles.summaryLead}>{summary}</p> : null}
      {snippet?.type === "visual" ? <SnippetBlock snippet={snippet} /> : null}
      {hasNarrative ? (
        <div className={styles.detailStack}>
          {details?.map((detail) => (
            <p key={detail} className={styles.bodyText}>
              {detail}
            </p>
          ))}
        </div>
      ) : (
        <ul className={styles.bulletList}>
          {items.map((item) => (
            <li key={item} className={styles.bulletItem}>
              <span className={styles.bulletMark}>+</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
      {snippet && snippet.type !== "visual" ? <SnippetBlock snippet={snippet} /> : null}
    </article>
  );
}

export function SummaryCardGrid({ items }) {
  return (
    <div className={styles.altBoard}>
      {items.map((item, index) => (
        <SummaryCard
          key={item.title}
          className={
            items.length % 2 === 1 && index === items.length - 1 ? styles.fullSpanCard : ""
          }
          title={item.title}
          summary={item.summary}
          details={item.details}
          items={item.items}
          snippet={item.snippet}
        />
      ))}
    </div>
  );
}

export function SnippetBlock({ snippet }) {
  if (snippet.type === "table") {
    return (
      <div className={styles.snippetBlock}>
        <p className={styles.infoKicker}>{snippet.label}</p>
        <SimpleTable headers={snippet.headers} rows={snippet.rows} compact />
        {snippet.note ? <p className={styles.bodyText}>{snippet.note}</p> : null}
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
                  -&gt;
                </span>
              ) : null}
            </div>
          ))}
        </div>
        {snippet.note ? <p className={styles.bodyText}>{snippet.note}</p> : null}
      </div>
    );
  }

  return (
    <div className={styles.snippetBlock}>
      <p className={styles.infoKicker}>{snippet.label}</p>
      <pre className={styles.codeBlock}>
        <code>{snippet.code}</code>
      </pre>
      {snippet.note ? <p className={styles.bodyText}>{snippet.note}</p> : null}
    </div>
  );
}

export function TroubleshootingCard({ item, consideration }) {
  const causeText = item.background ?? item.unexpected ?? "";
  const hasMoreDetails = Boolean(
    (item.unexpected && item.unexpected !== causeText) ||
      item.process?.length ||
      item.decision ||
      consideration,
  );

  return (
    <article className={styles.issueCard}>
      <div className={styles.issueSection}>
        <span className={styles.issueLabel}>문제</span>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.bodyText}>{item.problem}</p>
      </div>
      {causeText ? (
        <div className={styles.issueSection}>
          <span className={styles.issueLabel}>원인</span>
          <p className={styles.bodyText}>{causeText}</p>
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
      {hasMoreDetails ? (
        <details className={styles.issueDetails}>
          <summary className={styles.issueDetailsSummary}>판단 과정 더보기</summary>
          <div className={styles.issueDetailsBody}>
            {item.unexpected && item.unexpected !== causeText ? (
              <div className={styles.issueSection}>
                <span className={styles.issueLabel}>예상과 달랐던 점</span>
                <p className={styles.bodyText}>{item.unexpected}</p>
              </div>
            ) : null}
            {item.process?.length ? (
              <div className={styles.issueSection}>
                <span className={styles.issueLabel}>판단 과정</span>
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
            {item.decision ? (
              <div className={styles.issueSection}>
                <span className={styles.issueLabel}>채택 이유</span>
                <p className={styles.bodyText}>{item.decision}</p>
              </div>
            ) : null}
            {consideration ? (
              <div className={styles.issueSection}>
                <span className={styles.issueLabel}>설계 기준</span>
                <p className={styles.bodyText}>{consideration.body}</p>
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
      {item.snippet ? <SnippetBlock snippet={item.snippet} /> : null}
    </article>
  );
}

export function CompactTroubleshootingGrid({ items }) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className={styles.issueSummaryWrap}>
      <div className={styles.issueSummaryHeader}>
        <h3 className={styles.cardTitle}>추가 이슈</h3>
      </div>
      <div className={styles.issueSummaryGrid}>
        {items.map((item) => (
          <article key={item.title} className={styles.issueMiniCard}>
            <h4 className={styles.choiceName}>{item.title}</h4>
            <div className={styles.issueMiniBlock}>
              <span className={styles.specLabel}>문제</span>
              <p className={`${styles.bodyText} ${styles.issueMiniText}`}>{item.problem}</p>
            </div>
            <div className={styles.issueMiniBlock}>
              <span className={styles.specLabel}>해결</span>
              <p className={`${styles.bodyText} ${styles.issueMiniText}`}>{item.solution}</p>
            </div>
            <div className={styles.issueMiniResult}>
              <span className={styles.specLabel}>결과</span>
              <p className={styles.bodyText}>{item.result}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
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

export function TechChoicePanel({ items }) {
  return (
    <article className={styles.surfaceCard}>
      <h3 className={styles.cardTitle}>핵심 기술 선택</h3>
      <div className={styles.choiceStack}>
        {items.map((item) => (
          <div key={item.tech} className={styles.choiceCard}>
            <h4 className={styles.choiceName}>{item.tech}</h4>
            {item.feature ? <p className={styles.choiceFeature}>{item.feature}</p> : null}
            <p className={styles.bodyText}>{item.decision}</p>
            <dl className={styles.specList}>
              <div className={styles.specRow}>
                <dt className={styles.specLabel}>강점</dt>
                <dd className={styles.specValue}>{item.advantage}</dd>
              </div>
              <div className={styles.specRow}>
                <dt className={styles.specLabel}>트레이드오프</dt>
                <dd className={styles.specValue}>{item.comparison}</dd>
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
          key={link.href}
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
                    <span className={styles.bulletMark}>+</span>
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
            <span className={styles.bulletMark}>+</span>
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
    if (!link?.href || seen.has(link.href)) {
      return;
    }

    seen.add(link.href);
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
