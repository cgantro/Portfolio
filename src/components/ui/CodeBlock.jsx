import { useMemo } from "react";
import styles from "./CodeBlock.module.css";

// ─── 토크나이저 ───
const PATTERNS = [
  // 주석 (최우선)
  { cls: "comment",    re: /\/\/.*$|\/\*[\s\S]*?\*\//m },
  // 문자열
  { cls: "string",     re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/ },
  // 어노테이션
  { cls: "annotation", re: /@\w+/ },
  // 키워드 (Java + C++ 통합)
  { cls: "keyword",    re: /\b(?:public|private|protected|class|interface|new|return|void|static|final|import|extends|implements|throws|try|catch|finally|if|else|for|while|do|switch|case|break|null|true|false|this|super|abstract|default|enum|instanceof|package|synchronized|auto|const|constexpr|nullptr|override|explicit|using|typedef|template|typename|inline|virtual|mutable|struct|namespace)\b/ },
  // 타입 / 빌트인
  { cls: "type",       re: /\b(?:String|Integer|Long|Boolean|List|Map|Set|Optional|Duration|Runnable|Object|int|float|double|bool|char|long|short|unsigned|signed|size_t|uint8_t)\b/ },
  // 숫자
  { cls: "number",     re: /\b\d+(?:\.\d+)?\b/ },
  // 함수 호출
  { cls: "func",       re: /\b([A-Za-z_]\w*)(?=\s*\()/ },
];

const MASTER_RE = new RegExp(
  PATTERNS.map((p) => `(${p.re.source})`).join("|"),
  "gm"
);

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function tokenize(code) {
  const result = [];
  let lastIdx = 0;
  const re = new RegExp(MASTER_RE.source, "gm");
  let m;

  while ((m = re.exec(code)) !== null) {
    // 매칭 전 평범한 텍스트
    if (m.index > lastIdx) {
      result.push({ cls: "plain", text: code.slice(lastIdx, m.index) });
    }
    // 어느 그룹에 매칭됐는지 찾기
    const groupIdx = m.slice(1).findIndex((g) => g !== undefined);
    result.push({ cls: PATTERNS[groupIdx]?.cls ?? "plain", text: m[0] });
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < code.length) {
    result.push({ cls: "plain", text: code.slice(lastIdx) });
  }
  return result;
}

function buildHtml(code) {
  const tokens = tokenize(code);
  return tokens
    .map(({ cls, text }) => {
      const escaped = escapeHtml(text);
      if (cls === "plain") return escaped;
      return `<span class="tok-${cls}">${escaped}</span>`;
    })
    .join("");
}

export default function CodeBlock({ code, label, lang = "java" }) {
  const html = useMemo(() => buildHtml(code.trim()), [code]);

  return (
    <div className={styles.wrap}>
      {label && (
        <div className={styles.label}>
          <span className={styles.langTag}>{lang}</span>
          <span className={styles.labelText}>{label}</span>
        </div>
      )}
      <pre className={styles.pre}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
