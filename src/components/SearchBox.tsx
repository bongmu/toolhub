import { useEffect, useRef, useState } from 'react';

interface ToolItem {
  slug: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  keywords: string[];
}

const CAT_NAMES: Record<string, string> = {
  dev: '开发',
  text: '文本',
  image: '图片',
  life: '生活',
};

export default function SearchBox({ tools }: { tools: ToolItem[] }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 快捷键：/ 或 Ctrl+K 聚焦搜索框
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === '/' && !(e.target as HTMLElement).closest('input,textarea')) ||
          (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const results = q
    ? tools
        .filter((t) => {
          const haystack = [t.name, t.description, t.slug, ...t.keywords].join(' ').toLowerCase();
          return q.split(/\s+/).every((w) => haystack.includes(w));
        })
        .slice(0, 8)
    : [];

  const go = (slug: string) => {
    window.location.href = `/tools/${slug}/`;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active].slug);
    } else if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  // 保持高亮项可见
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-indigo-500 dark:focus-within:ring-indigo-900/50">
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
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="搜索工具，如：JSON、二维码、时间戳…"
          role="combobox"
          aria-expanded={!!q}
          aria-controls="search-results"
          aria-activedescendant={results.length ? `sr-${active}` : undefined}
          className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
        {query ? (
          <button
            onClick={() => setQuery('')}
            className="shrink-0 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            aria-label="清空"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-xs text-gray-400 sm:block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500">
            /
          </kbd>
        )}
      </div>

      {q && (
        <div
          ref={listRef}
          id="search-results"
          role="listbox"
          className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length ? (
            results.map((t, i) => (
              <a
                key={t.slug}
                id={`sr-${i}`}
                data-idx={i}
                role="option"
                aria-selected={i === active}
                href={`/tools/${t.slug}/`}
                onMouseEnter={() => setActive(i)}
                className={`flex items-center gap-3 px-4 py-3 transition ${
                  i === active ? 'bg-indigo-50 dark:bg-indigo-950/60' : ''
                }`}
              >
                <span className="text-xl">{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {t.name}
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      {CAT_NAMES[t.category] ?? t.category}
                    </span>
                  </div>
                  <div className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {t.description}
                  </div>
                </div>
                {i === active && <span className="shrink-0 text-xs text-gray-400">↵ 打开</span>}
              </a>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
              没有找到「{query}」相关工具，换个关键词试试
            </div>
          )}
        </div>
      )}
    </div>
  );
}
