import { useCallback, useState } from 'react';

const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950`;

const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnpqrstuvwxyz';
const DIGITS = '23456789';
const SYMBOLS = '!@#$%^&*-_=+?';
// 易混淆字符：0 O o 1 l I
const AMBIGUOUS = /[0Ool1I]/g;

interface Options {
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
}

function buildCharset(opts: Options, excludeAmbiguous: boolean): string {
  let chars = '';
  if (opts.upper) chars += UPPER;
  if (opts.lower) chars += LOWER;
  if (opts.digits) chars += DIGITS;
  if (opts.symbols) chars += SYMBOLS;
  if (excludeAmbiguous) chars = chars.replace(AMBIGUOUS, '');
  return chars;
}

function genPassword(length: number, charset: string): string {
  const values = new Uint32Array(length);
  crypto.getRandomValues(values); // 密码学安全随机数
  return Array.from(values, (v) => charset[v % charset.length]).join('');
}

/** 按熵值（bit）粗略评估强度 */
function strengthOf(length: number, charsetSize: number) {
  if (!charsetSize) return { label: '—', color: 'bg-gray-200', width: '0%' };
  const entropy = length * Math.log2(charsetSize);
  if (entropy < 40) return { label: '弱', color: 'bg-red-50 dark:bg-red-950/400', width: '25%' };
  if (entropy < 60) return { label: '中', color: 'bg-amber-500', width: '50%' };
  if (entropy < 80) return { label: '强', color: 'bg-lime-500', width: '75%' };
  return { label: '很强', color: 'bg-green-600', width: '100%' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState<Options>({ upper: true, lower: true, digits: true, symbols: true });
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const charset = buildCharset(opts, excludeAmbiguous);
  const strength = strengthOf(length, charset.length);

  const generate = useCallback(() => {
    if (!charset) return;
    setPassword(genPassword(length, charset));
  }, [length, charset]);

  const copy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const toggle = (key: keyof Options) => {
    setOpts((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // 至少保留一种字符类型
      if (!Object.values(next).some(Boolean)) return prev;
      return next;
    });
  };

  return (
    <div className="space-y-5">
      {/* 密码展示 */}
      <div className="flex items-center gap-2">
        <code className="min-h-[3rem] flex-1 break-all rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-900 px-4 py-3 font-mono text-lg text-green-300">
          {password || '点击下方按钮生成密码'}
        </code>
        <button onClick={copy} disabled={!password} className={btnGhost}>
          {copied ? '✓ 已复制' : '复制'}
        </button>
      </div>

      {/* 强度条 */}
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">密码强度</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div className={`h-full rounded-full transition-all ${strength.color}`} style={{ width: strength.width }} />
        </div>
      </div>

      {/* 长度 */}
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">长度</span>
          <span className="font-mono font-medium text-gray-700 dark:text-gray-300">{length}</span>
        </div>
        <input
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
      </div>

      {/* 字符类型 */}
      <div className="flex flex-wrap gap-4">
        {(
          [
            ['upper', '大写字母 A-Z'],
            ['lower', '小写字母 a-z'],
            ['digits', '数字 0-9'],
            ['symbols', '符号 !@#$'],
          ] as [keyof Options, string][]
        ).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={opts[key]}
              onChange={() => toggle(key)}
              className="h-4 w-4 accent-indigo-600"
            />
            {label}
          </label>
        ))}
        <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
          <input
            type="checkbox"
            checked={excludeAmbiguous}
            onChange={(e) => setExcludeAmbiguous(e.target.checked)}
            className="h-4 w-4 accent-indigo-600"
          />
          排除易混淆字符（0 O 1 l）
        </label>
      </div>

      <button onClick={generate} disabled={!charset} className={btnPrimary}>
        🎲 生成密码
      </button>
      <p className="text-xs text-gray-400 dark:text-gray-500">
        密码使用浏览器密码学安全随机数在本地生成，不经过网络传输。
      </p>
    </div>
  );
}
