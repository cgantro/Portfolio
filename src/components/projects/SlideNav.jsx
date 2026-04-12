import SlideTabs from "./SlideTabs";

export default function SlideNav({ slides, activeIndex, onSelect }) {
  return (
    <div className="slide-nav" aria-label="프로젝트 내부 슬라이드 네비게이션">
      <SlideTabs slides={slides} activeIndex={activeIndex} onSelect={onSelect} />
    </div>
  );
}