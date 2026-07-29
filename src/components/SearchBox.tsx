import { useMemo, useState } from 'react';

interface ToolItem {
  slug: string;
  name: string;
  description: string;
  category: string;
  keywords: string[];
}

export default function SearchBox({ tools }: { tools: ToolItem[] }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tools
      .filter((t) => {
        const haystack = [t.name, t.description, t.slug, ...t.keywords]
          .join(' ')
          .toLowerCase();
        return q.split(/\s+/).every((w) => haystack.includes(w));
      })
      .slice(0, 8);
  }, [query, tools]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
        <svg
          className="h-5 w-5 shrink-0 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索工具，如：JSON、二维码、时间戳…"
          className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="清空"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {query && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {results.length ? (
            results.map((t) => (
              <a
                key={t.slug}
                href={`/tools/${t.slug}/`}
                className="flex items-center justify-between gap-3 px-4 py-3 transition hover:bg-indigo-50"
              >
                <div className="min-w-0">
                  <div className="font-medium text-gray-900">{t.name}</div>
                  <div className="truncate text-sm text-gray-500">{t.description}</div>
                </div>
                <span className="shrink-0 text-gray-300">→</span>
              </a>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              没有找到「{query}」相关工具，换个关键词试试
            </div>
          )}
        </div>
      )}
    </div>
  );
}
