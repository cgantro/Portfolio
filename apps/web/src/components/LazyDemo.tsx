export default function LazyDemo({ url, poster, title }: { url: string; poster: string; title: string }) {
  return <div className="demo-container">
    <div className="demo-poster"><img src={poster} alt={`${title} 시뮬레이터 미리보기`} loading="lazy" width="1200" height="750" /><div className="demo-poster-overlay"><span className="eyebrow">직접 실행</span><h3>시뮬레이터 조작</h3><p>새 탭에서 시뮬레이터를 엽니다.</p><a className="button" href={url} target="_blank" rel="noopener noreferrer">시뮬레이터 열기 <span aria-hidden="true">↗</span></a></div></div>
  </div>;
}
