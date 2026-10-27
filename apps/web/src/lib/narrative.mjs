/** Render engineering case-study sections without repeating the overview. */
export function implementationNarrative(markdown, { headingOffset = 1, includeResults = true } = {}) {
  const chapters = markdown.split(/(?=^## )/m);
  const selected = chapters.filter(chapter =>
    /^## /.test(chapter)
      && !/^## (개요|검증 범위와 한계)\s*$/m.test(chapter)
      && (includeResults || !/^## 결과\s*$/m.test(chapter)),
  );
  const content = selected.length ? selected.join('\n') : markdown.replace(/^# .+\n/, '');
  return content.replace(/^(#{2,5}) /gm, (_heading, hashes) => `${'#'.repeat(hashes.length + headingOffset)} `);
}
