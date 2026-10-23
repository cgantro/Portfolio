/** Render engineering case-study sections without repeating the overview. */
export function implementationNarrative(markdown) {
  const chapters = markdown.split(/(?=^## )/m);
  const selected = chapters.filter(chapter => /^## (구현|문제 해결 과정|설계|설계 선택|의사 결정)/.test(chapter));
  const content = selected.length ? selected.join('\n') : markdown.replace(/^# .+\n/, '');
  return content.replace(/^(#{2,5}) /gm, '$1# ');
}
