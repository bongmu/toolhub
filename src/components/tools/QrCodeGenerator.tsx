import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950`;

const ERROR_LEVELS = [
  { value: 'L', label: 'L - 7%' },
  { value: 'M', label: 'M - 15%' },
  { value: 'Q', label: 'Q - 25%' },
  { value: 'H', label: 'H - 30%（可加 Logo）' },
] as const;

export default function QrCodeGenerator() {
  const [text, setText] = useState('');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 输入变化时实时生成（防抖 300ms）
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!text.trim() || !canvasRef.current) {
        if (canvasRef.current) {
          canvasRef.current.getContext('2d')?.clearRect(0, 0, size, size);
        }
        return;
      }
      try {
        await QRCode.toCanvas(canvasRef.current, text, {
          width: size,
          margin: 2,
          errorCorrectionLevel: level,
          color: { dark: '#1e293b', light: '#ffffff' },
        });
        setError('');
      } catch {
        setError('生成失败：内容可能过长，请精简后再试');
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [text, size, level]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text.trim()) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `qrcode-${size}px.png`;
    a.click();
  };

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-400">内容</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入网址或文字，如 https://example.com"
            className="h-28 w-full resize-y rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {error && <p className="mt-1.5 text-sm text-red-500 dark:text-red-400">❌ {error}</p>}
        </div>

        <div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">尺寸</span>
            <span className="font-mono text-gray-700 dark:text-gray-300">{size} × {size} px</span>
          </div>
          <input
            type="range"
            min={128}
            max={1024}
            step={64}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-400">纠错级别</label>
          <div className="flex flex-wrap gap-2">
            {ERROR_LEVELS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={
                  level === l.value
                    ? btnPrimary
                    : 'rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950'
                }
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={download} disabled={!text.trim() || !!error} className={btnPrimary}>
          ⬇ 下载 PNG
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm">
          <canvas ref={canvasRef} width={size} height={size} className="h-56 w-56" />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{text.trim() ? '手机扫码即可查看内容' : '输入内容后自动生成'}</p>
      </div>
    </div>
  );
}
