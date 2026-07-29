import { useEffect, useState } from 'react';

const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function TimestampConverter() {
  const [now, setNow] = useState(() => Date.now());
  const [tsInput, setTsInput] = useState('');
  const [tsResult, setTsResult] = useState('');
  const [tsError, setTsError] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [dateResult, setDateResult] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  // 实时刷新当前时间戳
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 1500);
  };

  const convertTs = () => {
    const raw = tsInput.trim();
    if (!/^-?\d+$/.test(raw)) {
      setTsError('请输入纯数字时间戳');
      setTsResult('');
      return;
    }
    // 11 位以上视为毫秒级
    const ms = raw.length >= 11 ? Number(raw) : Number(raw) * 1000;
    const d = new Date(ms);
    if (isNaN(d.getTime())) {
      setTsError('时间戳超出有效范围');
      setTsResult('');
      return;
    }
    setTsError('');
    setTsResult(formatDate(d));
  };

  const convertDate = () => {
    // 支持 "2026-07-29 12:00:00" 或 "2026/07/29 12:00:00" 等格式
    const normalized = dateInput.trim().replace(/\//g, '-');
    const d = new Date(normalized.replace(' ', 'T'));
    if (isNaN(d.getTime())) {
      setDateResult('❌ 无法识别的日期格式，试试 2026-07-29 12:00:00');
      return;
    }
    setDateResult(`秒级：${Math.floor(d.getTime() / 1000)}\n毫秒级：${d.getTime()}`);
  };

  const nowSec = Math.floor(now / 1000);

  return (
    <div className="space-y-8">
      {/* 当前时间戳 */}
      <div className="rounded-xl bg-indigo-50 p-4">
        <div className="mb-2 text-sm font-medium text-indigo-700">当前时间戳（每秒自动刷新）</div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">秒级</span>
            <code className="rounded bg-white px-2 py-1 font-mono text-lg font-semibold text-gray-900">
              {nowSec}
            </code>
            <button onClick={() => copy(String(nowSec), 'sec')} className={btnGhost + ' !px-2.5 !py-1 !text-xs'}>
              {copiedKey === 'sec' ? '✓' : '复制'}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">毫秒级</span>
            <code className="rounded bg-white px-2 py-1 font-mono text-lg font-semibold text-gray-900">
              {now}
            </code>
            <button onClick={() => copy(String(now), 'ms')} className={btnGhost + ' !px-2.5 !py-1 !text-xs'}>
              {copiedKey === 'ms' ? '✓' : '复制'}
            </button>
          </div>
          <div className="text-sm text-gray-500">本地时间：{formatDate(new Date(now))}</div>
        </div>
      </div>

      {/* 时间戳 → 日期 */}
      <div>
        <h2 className="mb-2 font-semibold text-gray-900">时间戳 → 日期时间</h2>
        <div className="flex flex-wrap gap-2">
          <input
            value={tsInput}
            onChange={(e) => setTsInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && convertTs()}
            placeholder="输入秒级或毫秒级时间戳，自动识别"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <button onClick={convertTs} disabled={!tsInput.trim()} className={btnPrimary}>
            转换
          </button>
        </div>
        {tsError && <p className="mt-2 text-sm text-red-500">❌ {tsError}</p>}
        {tsResult && (
          <p className="mt-2 font-mono text-sm text-gray-800">
            结果：<span className="font-semibold text-indigo-700">{tsResult}</span>
            <button onClick={() => copy(tsResult, 'ts')} className={btnGhost + ' ml-2 !px-2.5 !py-1 !text-xs'}>
              {copiedKey === 'ts' ? '✓' : '复制'}
            </button>
          </p>
        )}
      </div>

      {/* 日期 → 时间戳 */}
      <div>
        <h2 className="mb-2 font-semibold text-gray-900">日期时间 → 时间戳</h2>
        <div className="flex flex-wrap gap-2">
          <input
            value={dateInput}
            onChange={(e) => setDateInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && convertDate()}
            placeholder="如 2026-07-29 12:00:00（可省略时间）"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          <button onClick={convertDate} disabled={!dateInput.trim()} className={btnPrimary}>
            转换
          </button>
        </div>
        {dateResult && (
          <pre className="mt-2 whitespace-pre-wrap font-mono text-sm text-gray-800">{dateResult}</pre>
        )}
      </div>
    </div>
  );
}
