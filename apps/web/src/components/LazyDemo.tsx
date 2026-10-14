export default function LazyDemo({ url, poster, title }: { url: string; poster: string; title: string }) {
  return <div className="demo-container">
    <div className="demo-poster"><img src={poster} alt={`${title} 시뮬레이터 미리보기`} loading="lazy" width="1200" height="750" /><div className="demo-poster-overlay"><span className="eyebrow">INTERACTIVE SIMULATOR</span><h3>직접 움직여 보세요.</h3><p>새 탭에서 시뮬레이터를 실행합니다.</p><a className="button" href={url} target="_blank" rel="noopener noreferrer">시뮬레이터 실행 <span aria-hidden="true">↗</span></a></div></div>
  </div>;
}
