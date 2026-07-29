import { useState } from 'react';

const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';
const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;
const btnGhost = `${btn} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

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
        <button onClick={loadSample} className={btnGhost}>
          示例
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
          <label className="mb-1.5 block text-sm font-medium text-gray-600">输入 JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='粘贴 JSON，例如：{"hello": "world"}'
            spellCheck={false}
            className="h-80 w-full resize-y rounded-xl border border-gray-300 bg-gray-50 p-3 font-mono text-sm leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-600">结果</label>
            <button onClick={copy} disabled={!output} className={btnGhost + ' !px-3 !py-1'}>
              {copied ? '✓ 已复制' : '复制'}
            </button>
          </div>
          {error ? (
            <div className="h-80 overflow-auto rounded-xl border border-red-200 bg-red-50 p-3 font-mono text-sm text-red-600">
              ❌ {error}
            </div>
          ) : (
            <pre className="h-80 overflow-auto rounded-xl border border-gray-300 bg-gray-900 p-3 font-mono text-sm leading-relaxed text-green-300">
              {output || '结果将显示在这里…'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
