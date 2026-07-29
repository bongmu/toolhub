import { useState } from 'react';

const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950`;

/** UTF-8 安全的 Base64 编码（原生 btoa 只支持 Latin-1，中文会报错/乱码） */
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function decodeBase64(b64: string): string {
  const binary = atob(b64.trim());
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const run = (fn: (s: string) => string) => {
    try {
      setOutput(fn(input));
      setError('');
    } catch {
      setError('转换失败：请检查输入是否为合法的' + (fn === encodeBase64 ? '文本' : 'Base64 编码'));
      setOutput('');
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setError('');
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={() => run(encodeBase64)} disabled={!input} className={btnPrimary}>
          编码 →
        </button>
        <button onClick={() => run(decodeBase64)} disabled={!input} className={btnPrimary}>
          ← 解码
        </button>
        <button onClick={swap} disabled={!output} className={btnGhost}>
          ⇅ 结果转输入
        </button>
        <button
          onClick={() => {
            setInput('');
            setOutput('');
            setError('');
          }}
          className={btnGhost}
        >
          清空
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-400">输入</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入要编码的文本，或要解码的 Base64…"
            spellCheck={false}
            className="h-[28rem] w-full resize-y rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">结果</label>
            <button onClick={copy} disabled={!output} className={btnGhost + ' !px-3 !py-1'}>
              {copied ? '✓ 已复制' : '复制'}
            </button>
          </div>
          {error ? (
            <div className="h-[28rem] overflow-auto rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-3 font-mono text-sm text-red-600 dark:text-red-400">
              ❌ {error}
            </div>
          ) : (
            <pre className="h-[28rem] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200">
              {output || '结果将显示在这里…'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
