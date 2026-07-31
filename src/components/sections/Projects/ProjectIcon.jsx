const iconPaths = {
  robotpal: (
    <>
      <path d="M5 19h14M8 19v-4l4-3 3 2 2-5 3 1" />
      <path d="M8 11h3M16 6l2 1" />
      <circle cx="8" cy="19" r="1.4" /><circle cx="18" cy="19" r="1.4" />
    </>
  ),
  mausoleum: (
    <>
      <path d="M5 15c2 0 2-6 4-6s2 10 4 10 2-14 4-14 2 10 4 10" />
      <path d="M4 20h16" />
    </>
  ),
  autowing: (
    <>
      <path d="M5 17h14l-1-5H7l-2 5Z" />
      <path d="M8 12l1-3h6l2 3" />
      <circle cx="8" cy="18" r="1.5" /><circle cx="17" cy="18" r="1.5" />
    </>
  ),
  sticker: (
    <>
      <path d="M12 5a2.5 2.5 0 0 1 2.5 2.5c0 1.5-1.5 2-2.5 3" />
      <path d="m12 10-7 7h14l-7-7Z" />
      <path d="M5 20h14" />
    </>
  ),
};

export default function ProjectIcon({ id, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[id] ?? <path d="M6 6h12v12H6z" />}
    </svg>
  );
}
