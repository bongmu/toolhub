import { useEffect, useState } from 'react';
import { getFavorites } from '../data/tools';

interface ToolItem {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

const RECENT_KEY = 'toolhub-recent';

/** 在工具页调用：记录"最近使用" */
export function recordVisit(slug: string) {
  try {
    const list: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* 隐私模式等场景下静默失败 */
  }
}

export default function HomeSections({ tools }: { tools: ToolItem[] }) {
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setFavs(getFavorites());
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'));
    } catch {
      /* ignore */
    }
    // 收藏变化时（如从工具页返回）刷新
    const onFocus = () => setFavs(getFavorites());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const find = (slug: string) => tools.find((t) => t.slug === slug);
  const favTools = favs.map(find).filter((t): t is ToolItem => !!t);
  const recentTools = recent.map(find).filter((t): t is ToolItem => !!t);

  const card = (t: ToolItem) => (
    <a
      key={t.slug}
      href={`/tools/${t.slug}/`}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700"
    >
      <span className="text-2xl">{t.icon}</span>
      <div className="min-w-0">
        <div className="truncate font-medium text-gray-900 dark:text-gray-100">{t.name}</div>
        <div className="truncate text-sm text-gray-500 dark:text-gray-400">{t.description}</div>
      </div>
    </a>
  );

  if (!favTools.length && !recentTools.length) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      {favTools.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <span className="text-amber-500">★</span> 我的收藏
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{favTools.map(card)}</div>
        </section>
      )}
      {recentTools.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-gray-100">
            <span>🕘</span> 最近使用
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{recentTools.map(card)}</div>
        </section>
      )}
    </div>
  );
}
