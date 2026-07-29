import { useState } from 'react';
import { getFavorites, toggleFavorite } from '../data/tools';

export default function FavoriteButton({ slug }: { slug: string }) {
  const [fav, setFav] = useState<boolean | null>(null);

  // 首次点击前先从 localStorage 读取状态（避免 SSR/CSR 不一致）
  const read = () => {
    if (fav === null) setFav(getFavorites().includes(slug));
  };

  const toggle = () => {
    const next = toggleFavorite(slug);
    setFav(next.includes(slug));
  };

  const isFav = fav === true;

  return (
    <button
      onClick={toggle}
      onMouseEnter={read}
      onFocus={read}
      aria-pressed={isFav}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
        isFav
          ? 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
          : 'border-gray-300 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-amber-700'
      }`}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill={isFav ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      {isFav ? '已收藏' : '收藏'}
    </button>
  );
}
