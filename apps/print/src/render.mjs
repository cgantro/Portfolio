import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve, relative, sep, basename, extname } from 'node:path';
import { selectEdition, eligibleClaims, eligibleMetrics, toJsonResume } from '@portfolio/resume-adapter';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const e = escapeHtml;
const labelStatus = status => status === 'verified' ? '근거 확인' : '기존 자료 기록';
const list = items => `<ul>${items.map(item => `<li>${e(item)}</li>`).join('')}</ul>`;
const paragraphs = items => items.map(item => `<p>${e(item)}</p>`).join('');
const heading = (index, title) => `<div class="eyebrow">PORTFOLIO / ${String(index).padStart(2, '0')}</div><h1>${e(title)}</h1>`;
const publicLink = value => /^https?:\/\//.test(value);
const evidenceMarkup = evidence => `<ol class="sources">${evidence.map(item => `<li><strong>${e(item.id)}</strong> ${e(item.label)}<br>${publicLink(item.source) ? `<a href="${e(item.source)}">${e(item.source)}</a>` : `<span class="source-path">${e(item.source)}</span>`}${item.locator ? ` · ${e(item.locator)}` : ''}${item.note ? `<br>${e(item.note)}` : ''} <span class="status">${labelStatus(item.status)}</span></li>`).join('')}</ol>`;

export function renderPortfolio({ data, edition, projects }, stylesheet) {
  const { profile } = data;
  const renderedProjects = projects.map((project, index) => {
    const claims = eligibleClaims(project);
    const metrics = eligibleMetrics(project);
    return `<section class="page project" id="${e(project.id)}">
      ${heading(index + 3, project.title)}<p class="subtitle">${e(project.subtitle)}</p>
      <div class="metadata"><span>${e(project.period)}</span><span>${e(project.category)}</span></div>
      <div class="stack">${project.stack.map(item => `<span>${e(item)}</span>`).join('')}</div>
      ${paragraphs(project.summary)}
      <h2>MY ROLE</h2>${list(project.role)}
      ${project.printImage ? `<figure><img src="${e(project.printImage)}" alt="${e(project.architecture.alt)}"><figcaption>${e(project.architecture.alt)}</figcaption></figure>` : ''}
      <h2>구현과 결과</h2><ul class="claims">${claims.map(claim => `<li>${e(claim.text)} <small>[${claim.evidenceIds.map(e).join(', ')}]</small></li>`).join('')}</ul>
      ${metrics.length ? `<div class="metrics">${metrics.map(metric => `<div><strong>${e(metric.label)}: ${e(metric.value)} ${e(metric.unit)}</strong>${metric.baseline !== undefined ? `<span>비교 기준 ${e(metric.baseline)} ${e(metric.unit)}</span>` : ''}<p>${e(metric.conditions.join(' · '))}</p><small>[${metric.evidenceIds.map(e).join(', ')}]</small></div>`).join('')}</div>` : ''}
      ${project.limitations.length ? `<aside><h3>검증 범위</h3>${list(project.limitations)}</aside>` : ''}
      <div class="project-links">${Object.entries(project.links).filter(([, value]) => value && publicLink(value)).map(([label, value]) => `<a href="${e(value)}">${e(label.toUpperCase())} ↗ ${e(value)}</a>`).join('<br>')}</div>
    </section>`;
  }).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="author" content="${e(profile.name)}"><title>${e(profile.name)} | ${e(edition.headline)}</title><style>${stylesheet}</style></head><body>
    <section class="page cover">${heading(1, profile.name)}<p class="name-en">${e(profile.nameEn)}</p><div class="cover-title"><h2>${e(edition.headline)}</h2><p>${e(profile.tagline)}</p></div>${paragraphs(profile.summary)}<dl class="contacts">${profile.email ? `<dt>EMAIL</dt><dd><a href="mailto:${e(profile.email)}">${e(profile.email)}</a></dd>` : ''}<dt>GITHUB</dt><dd><a href="${e(profile.github)}">${e(profile.github)}</a></dd></dl><div class="cover-edition">${e(edition.label)}<br><span>PROJECT PORTFOLIO · 한국어</span></div></section>
    <section class="page overview">${heading(2, '프로젝트와 기술')}<p class="subtitle">${e(edition.headline)}</p><div class="project-index">${projects.map((project, index) => `<article><span class="index-number">${String(index + 1).padStart(2, '0')}</span><h2><a href="#${e(project.id)}">${e(project.title)}</a></h2><p>${e(project.subtitle)}</p><p class="muted">${e(project.period)} · ${e(project.category)}</p></article>`).join('')}</div><h2>기술 경험</h2><dl class="skill-list">${data.skills.map(group => { const items = group.items.filter(item => item.projectIds.some(id => edition.projectIds.includes(id))); return items.length ? `<dt>${e(group.category)}</dt><dd>${e(items.map(item => item.name).join(' · '))}</dd>` : ''; }).join('')}</dl></section>
    ${renderedProjects}
    <section class="page background">${heading(projects.length + 3, '학습과 경험')}<div class="timeline">${data.timeline.filter(item => item.type === 'edu' || item.type === 'cert' || item.type === 'work').map(item => `<article><p class="eyebrow">${e(item.period)}</p><h2>${e(item.title)}</h2><p>${e(item.detail)}</p>${item.note ? `<p class="muted">${e(item.note)}</p>` : ''}</article>`).join('')}</div></section>
    <section class="page evidence">${heading(projects.length + 4, '프로젝트 근거')}<p class="muted">본문의 근거 ID와 원본 자료를 연결했습니다. 기록된 사실의 검증 범위는 프로젝트별로 표시합니다.</p>${projects.map(project => `<article class="evidence-project"><h2>${e(project.title)}</h2>${evidenceMarkup(project.evidence.filter(item => item.status !== 'unverified'))}</article>`).join('')}</section>
  </body></html>`;
}

export async function preparePortfolio(input, editionId, { root, outputDir }) {
  const selected = selectEdition(input, editionId);
  await mkdir(outputDir, { recursive: true });
  const projects = [];
  for (const project of selected.projects) {
    const source = project.architecture?.src || project.cover?.src;
    let printImage;
    if (source) {
      const clean = source.replace(/^\/Portfolio\//, '').replace(/^\//, '').replace(/^assets\//, 'asset/');
      const assetPath = resolve(root, clean);
      const relativePath = relative(root, assetPath);
      if (relativePath.startsWith(`..${sep}`) || relativePath === '..' || /^[A-Za-z]:/.test(relativePath)) throw new Error(`Image leaves the workspace: ${source}`);
      const targetName = `${project.id}-architecture${extname(basename(assetPath))}`;
      await mkdir(resolve(outputDir, 'assets'), { recursive: true });
      await copyFile(assetPath, resolve(outputDir, 'assets', targetName));
      printImage = `assets/${targetName}`;
    }
    projects.push({ ...project, printImage });
  }
  const stylesheet = await readFile(new URL('../styles/portfolio.css', import.meta.url), 'utf8');
  const html = renderPortfolio({ ...selected, projects }, stylesheet);
  const { resume, lossReport } = toJsonResume(input, editionId);
  const printData = { profile: selected.data.profile, edition: selected.edition, projects: projects.map(project => ({ ...project, contributions: eligibleClaims(project), outcomes: [], metrics: eligibleMetrics(project) })), timeline: selected.data.timeline };
  await writeFile(resolve(outputDir, 'portfolio.html'), html, 'utf8');
  await writeFile(resolve(outputDir, 'resume.json'), JSON.stringify(resume, null, 2) + '\n', 'utf8');
  await writeFile(resolve(outputDir, 'resume.loss-report.json'), JSON.stringify(lossReport, null, 2) + '\n', 'utf8');
  await writeFile(resolve(outputDir, 'portfolio.data.json'), JSON.stringify(printData, null, 2) + '\n', 'utf8');
  const typst = await readFile(new URL('../templates/portfolio.typ', import.meta.url), 'utf8');
  await writeFile(resolve(outputDir, 'portfolio.typ'), typst, 'utf8');
  const resumeTypst = await readFile(new URL('../templates/resume.typ', import.meta.url), 'utf8');
  await writeFile(resolve(outputDir, 'resume.typ'), resumeTypst, 'utf8');
  // JSON is a strict YAML subset; this preserves Korean strings without a second serializer.
  const rendercv = {
    cv: { name: resume.basics.name, headline: resume.basics.label, email: resume.basics.email, website: resume.basics.url,
      sections: {
        '소개': [resume.basics.summary],
        '프로젝트 경험': resume.projects.map(project => ({ name: project.name, date: `${project.startDate || ''} - ${project.endDate || '진행 중'}`, summary: project.description.split('. ')[0] + (project.description.includes('. ') ? '.' : ''), highlights: project.highlights.slice(0, 2) })),
        '기술': resume.skills.map(skill => ({ label: skill.name, details: skill.keywords.join(' · ') })),
        '교육': resume.education.map(item => ({ institution: item.institution, area: item.area, date: `${item.startDate || ''} - ${item.endDate || ''}` })),
        '자격': resume.certificates.map(item => ({ bullet: `${item.name} (${item.date || ''})` })),
      } },
    design: { theme: 'classic', page: { size: 'a4', top_margin: '1.3cm', bottom_margin: '1.3cm', left_margin: '1.6cm', right_margin: '1.6cm', show_footer: false, show_top_note: false },
      typography: { font_family: { body: 'Malgun Gothic', name: 'Malgun Gothic', headline: 'Malgun Gothic', connections: 'Malgun Gothic', section_titles: 'Malgun Gothic' }, font_size: { body: '10pt', name: '28pt', headline: '11pt', connections: '9pt', section_titles: '12pt' }, line_spacing: '0.45em' },
      header: { space_below_name: '0.2cm', space_below_headline: '0.2cm', space_below_connections: '0.2cm' },
      section_titles: { space_above: '0.25cm', space_below: '0.15cm' }, sections: { space_between_regular_entries: '0.5em' }, entries: { date_and_location_width: '4.2cm' },
    },
  };
  await writeFile(resolve(outputDir, 'resume.rendercv.yaml'), JSON.stringify(rendercv, null, 2) + '\n', 'utf8');
  return { htmlPath: resolve(outputDir, 'portfolio.html'), outputDir, editionId };
}
