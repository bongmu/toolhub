import { useEffect, useMemo, useState } from 'react';
import { marked } from 'marked';

const STORAGE_KEY = 'toolhub-markdown-draft';

const SAMPLE = `# 欢迎使用 Markdown 编辑器

左侧输入 **Markdown** 源码，右侧实时预览。

## 常用语法

- 无序列表项
- 支持 *斜体*、**加粗**、~~删除线~~

1. 有序列表
2. 自动编号

> 引用一段话

\`\`\`js
// 代码块
console.log('Hello, ToolHub!');
\`\`\`

| 表格 | 支持 |
| ---- | ---- |
| A    | B    |

[链接示例](https://example.com)
`;

marked.setOptions({ gfm: true, breaks: true });

export default function MarkdownEditor() {
  const [text, setText] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  // 恢复上次草稿（localStorage 仅浏览器可用，需放进 useEffect）
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setText(saved ?? SAMPLE);
  }, []);

  useEffect(() => {
    if (text) localStorage.setItem(STORAGE_KEY, text);
  }, [text]);

  const html = useMemo(() => marked.parse(text, { async: false }) as string, [text]);

  const copy = async (content: string, key: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => copy(html, 'html')}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          {copiedKey === 'html' ? '✓ 已复制' : '复制 HTML'}
        </button>
        <button
          onClick={() => copy(text, 'md')}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          {copiedKey === 'md' ? '✓ 已复制' : '复制 Markdown'}
        </button>
        <button
          onClick={() => setText('')}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          清空
        </button>
        <span className="ml-auto self-center text-xs text-gray-400">草稿自动保存在本地</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在此输入 Markdown…"
          spellCheck={false}
          className="h-[28rem] w-full resize-y rounded-xl border border-gray-300 bg-gray-50 p-3 font-mono text-sm leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
        <article
          className="md-preview h-[28rem] overflow-auto rounded-xl border border-gray-300 bg-white p-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>

      {/* 预览排版样式（Tailwind 未涵盖的原生 HTML 元素） */}
      <style>{`
        .md-preview h1 { font-size: 1.6em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .md-preview h2 { font-size: 1.35em; font-weight: 700; margin: 0.8em 0 0.4em; }
        .md-preview h3 { font-size: 1.15em; font-weight: 600; margin: 0.7em 0 0.35em; }
        .md-preview h4, .md-preview h5, .md-preview h6 { font-weight: 600; margin: 0.6em 0 0.3em; }
        .md-preview p { margin: 0.6em 0; line-height: 1.75; }
        .md-preview ul, .md-preview ol { margin: 0.6em 0; padding-left: 1.6em; line-height: 1.75; }
        .md-preview ul { list-style: disc; }
        .md-preview ol { list-style: decimal; }
        .md-preview blockquote { margin: 0.8em 0; padding: 0.4em 1em; border-left: 4px solid #c7d2fe; background: #eef2ff; color: #4b5563; border-radius: 0 8px 8px 0; }
        .md-preview code { background: #f1f5f9; color: #be185d; padding: 0.15em 0.4em; border-radius: 6px; font-size: 0.9em; }
        .md-preview pre { background: #0f172a; color: #e2e8f0; padding: 1em; border-radius: 10px; overflow: auto; margin: 0.8em 0; }
        .md-preview pre code { background: none; color: inherit; padding: 0; }
        .md-preview a { color: #4f46e5; text-decoration: underline; }
        .md-preview table { border-collapse: collapse; margin: 0.8em 0; width: 100%; }
        .md-preview th, .md-preview td { border: 1px solid #e5e7eb; padding: 0.45em 0.8em; }
        .md-preview th { background: #f9fafb; }
        .md-preview hr { margin: 1.2em 0; border: none; border-top: 1px solid #e5e7eb; }
        .md-preview img { max-width: 100%; border-radius: 8px; }
        .md-preview del { color: #9ca3af; }
      `}</style>
    </div>
  );
}
