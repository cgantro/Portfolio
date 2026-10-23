import { useState } from 'react';
import { assetUrl, matchesProject, projectUrl } from '../lib/urls.mjs';

type ProjectPreview = { id: string; title: string; subtitle: string; category: string; period: string; status: string; stack: string[]; summary: string[]; cover: { src: string; alt: string } };
export default function ProjectExplorer({ projects }: { projects: ProjectPreview[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const categories = [...new Set(projects.map(project => project.category))];
  const visible = projects.filter(project => matchesProject(project, query, category));
  return <>
    <div className="project-filters">
      <div className="filter-categories" role="group" aria-label="프로젝트 분야">
        <button type="button" className={category === 'all' ? 'selected' : ''} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>전체 <span>{projects.length}</span></button>
        {categories.map(item => <button type="button" key={item} className={category === item ? 'selected' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <label className="search-field"><span className="sr-only">프로젝트 또는 기술 검색</span><span aria-hidden="true">⌕</span><input type="search" placeholder="프로젝트 또는 기술 검색" value={query} onChange={event => setQuery(event.target.value)} /></label>
    </div>
    <p className="result-count" aria-live="polite">{visible.length}개 프로젝트</p>
    <div className="project-grid">
      {visible.map(project => <article className="project-card" key={project.id}>
        <a className="project-cover" href={projectUrl(project.id)} aria-label={`${project.title} 프로젝트 상세 보기`}><img src={assetUrl(project.cover.src)} alt={project.cover.alt} loading="lazy" width="960" height="640" /><span className="project-index">프로젝트 {String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span className="cover-arrow" aria-hidden="true">↗</span></a>
        <div className="project-card-body"><div className="project-meta"><span>{project.category}</span><span>{project.status === 'ongoing' ? '진행 중' : project.period}</span></div><h2><a href={projectUrl(project.id)}>{project.title}</a></h2><p>{project.summary[0]}</p><div className="tags">{project.stack.slice(0, 4).map(tag => <span key={tag}>{tag}</span>)}</div></div>
      </article>)}
    </div>
    {visible.length === 0 && <div className="empty-state"><h2>검색 결과가 없습니다.</h2><p>다른 기술 이름이나 프로젝트 이름으로 검색해 주세요.</p><button type="button" className="button secondary" onClick={() => { setQuery(''); setCategory('all'); }}>필터 초기화</button></div>}
  </>;
}
