import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';

type CodeNode = { type?: string; lang?: string | null; meta?: string | null; data?: Record<string, unknown>; children?: CodeNode[] };

function codeMetadata() {
  return (tree: CodeNode) => {
    const visit = (node: CodeNode) => {
      if (node.type === 'code' && node.meta) {
        const title = node.meta.replace(/^title=/, '').replace(/^['"]|['"]$/g, '');
        node.data = { ...node.data, hProperties: { 'data-title': title } };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

export default function MarkdownContent({ content, collapsibleCode = false }: { content: string; collapsibleCode?: boolean }) {
  return <div className="prose"><ReactMarkdown remarkPlugins={[codeMetadata, remarkGfm]} components={{
    a: ({ children, href }) => <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>{children}</a>,
    code: ({ children, className, node, ...props }) => {
      const language = /language-([\w-]+)/.exec(className ?? '')?.[1] ?? '';
      const title = (props as Record<string, string>)['data-title'];
      const grammar = Prism.languages[language];
      const source = String(children).replace(/\n$/, '');
      if (!language || !grammar) return <code className={className} {...props}>{children}</code>;
      return <code className={`language-${language}`} data-language={language} data-title={title} dangerouslySetInnerHTML={{ __html: Prism.highlight(source, grammar, language) }} />;
    },
    pre: ({ children, node, ...props }) => {
      const codeNode = node?.children?.[0];
      const codeProperties = codeNode?.type === 'element' ? codeNode.properties as Record<string, unknown> : undefined;
      const classNames = codeProperties?.className as string[] | undefined;
      const language = classNames?.find((name) => name.startsWith('language-'))?.slice('language-'.length);
      const title = (codeProperties?.['data-title'] ?? codeProperties?.dataTitle) as string | undefined;
      if (!language) return <pre {...props} tabIndex={0}>{children}</pre>;
      if (collapsibleCode) return <details className="code-disclosure">
        <summary><span>{language}</span>{title && <span className="code-sample__title">{title}</span>}</summary>
        <pre {...props} tabIndex={0}>{children}</pre>
      </details>;
      return <figure className="code-sample">
        <figcaption><span>{language}</span>{title && <span className="code-sample__title">{title}</span>}</figcaption>
        <pre {...props} tabIndex={0}>{children}</pre>
      </figure>;
    },
  }}>{content}</ReactMarkdown></div>;
}
