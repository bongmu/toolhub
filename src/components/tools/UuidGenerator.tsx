import { useCallback, useState } from 'react';

const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;

function genOne(): string {
  // 浏览器内置的密码学安全 UUID v4
  return crypto.randomUUID();
}

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noDash, setNoDash] = useState(false);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, genOne));
  const [copiedKey, setCopiedKey] = useState('');

  const generate = useCallback(() => {
    const n = Math.min(100, Math.max(1, count || 1));
    let list = Array.from({ length: n }, genOne);
    if (noDash) list = list.map((u) => u.replace(/-/g, ''));
    if (uppercase) list = list.map((u) => u.toUpperCase());
    setUuids(list);
  }, [count, uppercase, noDash]);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          数量
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-lg border border-gray-300 px-2 py-1.5 text-sm outline-none focus:border-indigo-400"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={uppercase}
            onChange={(e) => setUppercase(e.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
          大写
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={noDash}
            onChange={(e) => setNoDash(e.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
          去除横线
        </label>
        <button onClick={generate} className={btnPrimary}>
          重新生成
        </button>
        <button onClick={() => copy(uuids.join('\n'), 'all')} className={btnGhost}>
          {copiedKey === 'all' ? '✓ 已复制' : '复制全部'}
        </button>
      </div>

      <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200">
        {uuids.map((u, i) => (
          <li
            key={i}
            className="flex items-center justify-between gap-3 bg-white px-4 py-2.5 transition hover:bg-gray-50"
          >
            <code className="min-w-0 truncate font-mono text-sm text-gray-800">{u}</code>
            <button
              onClick={() => copy(u, String(i))}
              className="shrink-0 rounded-lg px-2.5 py-1 text-xs text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
            >
              {copiedKey === String(i) ? '✓ 已复制' : '复制'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
