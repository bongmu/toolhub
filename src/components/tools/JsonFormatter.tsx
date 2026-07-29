import { useState } from 'react';
import useExpand from '../../lib/useExpand';

const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950`;

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const { expanded, toggle } = useExpand();

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON 解析失败');
      setOutput('');
    }
  };

  const compress = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input)));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON 解析失败');
      setOutput('');
    }
  };

  const validate = () => {
    try {
      JSON.parse(input);
      setError('');
      setOutput('✅ JSON 格式正确！');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'JSON 解析失败');
      setOutput('');
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadSample = () => {
    setInput(
      '{"name":"ToolHub","tags":["免费","在线工具"],"version":1.0,"features":{"fast":true,"private":true},"users":null}'
    );
    setError('');
  };

  const pasteFromClipboard = async () => {
    try {
      setInput(await navigator.clipboard.readText());
      setError('');
    } catch {
      setError('读取剪贴板失败，请检查浏览器权限或直接 Ctrl+V 粘贴');
    }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(String(reader.result ?? ''));
      setError('');
    };
    reader.readAsText(file);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      format();
    }
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <button onClick={format} disabled={!input.trim()} className={btnPrimary}>
          格式化
        </button>
        <button onClick={compress} disabled={!input.trim()} className={btnGhost}>
          压缩
        </button>
        <button onClick={validate} disabled={!input.trim()} className={btnGhost}>
          校验
        </button>
        <button onClick={pasteFromClipboard} className={btnGhost}>
          粘贴
        </button>
        <button onClick={loadSample} className={btnGhost}>
          示例
        </button>
        <button onClick={download} disabled={!output} className={btnGhost}>
          下载
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
        {/* 输入区：右上角悬浮放大按钮（relative 容器 + absolute 按钮） */}
        <div className="relative flex flex-col">
          <label className="mb-1.5 block text-sm font-medium text-gray-600 dark:text-gray-400">
            输入 JSON
            <span className="ml-2 font-normal text-gray-400 dark:text-gray-500">
              （可拖入文件，Ctrl+Enter 快速格式化）
            </span>
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onKeyDown={onKeyDown}
            placeholder='粘贴 JSON，例如：{"hello": "world"}'
            spellCheck={false}
            className={`${expanded ? 'flex-1' : 'h-[32rem]'} w-full resize-y rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 font-mono text-sm leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100`}
          />
          {/* 悬浮在输入框右上角的放大/缩小图标按钮 */}
          <button
            onClick={toggle}
            aria-label={expanded ? '还原' : '放大'}
            title={expanded ? '还原（Esc）' : '放大输入区（Esc 还原）'}
            className="absolute right-3 top-11 rounded-md bg-white/80 p-1 text-gray-400 backdrop-blur-sm transition hover:bg-white hover:text-indigo-600 dark:bg-gray-800/80 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
          >
            {expanded ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">结果</label>
            <button onClick={copy} disabled={!output} className={btnGhost + ' !px-3 !py-1'}>
              {copied ? '✓ 已复制' : '复制'}
            </button>
          </div>
          {error ? (
            <div
              className={`${expanded ? 'flex-1' : 'h-[32rem]'} overflow-auto rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-3 font-mono text-sm text-red-600 dark:text-red-400`}
            >
              ❌ {error}
            </div>
          ) : (
            <pre
              className={`${expanded ? 'flex-1' : 'h-[32rem]'} overflow-auto rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-900 p-3 font-mono text-sm leading-relaxed text-green-300`}
            >
              {output || '结果将显示在这里…'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
