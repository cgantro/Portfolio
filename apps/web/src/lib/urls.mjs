/** All internal links must work under GitHub Pages' repository base. */
export function localUrl(path = '', base = '/Portfolio/') {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/** Shared records identify root asset files with an /assets/ namespace. */
export function assetUrl(path, base = '/Portfolio/') {
  if (/^(https?:|data:)/.test(path)) return path;
  return localUrl(path.replace(/^\/?assets\//, ''), base);
}

export function projectUrl(id, base = '/Portfolio/') {
  return localUrl(`projects/${encodeURIComponent(id)}/`, base);
}
