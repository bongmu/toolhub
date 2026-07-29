import { useMemo, useState } from 'react';

interface Stats {
  chars: number;
  charsNoSpace: number;
  chinese: number;
  words: number;
  digits: number;
  paragraphs: number;
  sentences: number;
  readMinutesCN: number;
  readMinutesEN: number;
}

function analyze(text: string): Stats {
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const chinese = (text.match(/[一-鿿]/g) || []).length;
  const words = (text.match(/[a-zA-Z0-9']+/g) || []).length;
  const digits = (text.match(/\d/g) || []).length;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n|\n/).filter((p) => p.trim()).length : 0;
  const sentences = text.trim()
    ? (text.match(/[。！？!?；;…]|[.!?]+(?=\s|$)/g) || []).length || 1
    : 0;
  return {
    chars,
    charsNoSpace,
    chinese,
    words,
    digits,
    paragraphs,
    sentences,
    readMinutesCN: chinese / 350,
    readMinutesEN: words / 200,
  };
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => analyze(text), [text]);

  const items: [string, string | number][] = [
    ['总字符数', stats.chars],
    ['不含空格', stats.charsNoSpace],
    ['中文汉字', stats.chinese],
    ['英文单词', stats.words],
    ['数字', stats.digits],
    ['段落数', stats.paragraphs],
    ['句子数', stats.sentences],
    [
      '预计阅读时长',
      stats.readMinutesCN + stats.readMinutesEN < 1
        ? '少于 1 分钟'
        : `约 ${Math.ceil(stats.readMinutesCN + stats.readMinutesEN)} 分钟`,
    ],
  ];

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map(([label, value]) => (
          <div key={label} className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 px-4 py-3 text-center">
            <div className="text-lg font-bold text-indigo-700">{value}</div>
            <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{label}</div>
          </div>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="在此输入或粘贴文本，统计结果实时更新…"
        className="h-[26rem] w-full resize-y rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-950 p-3 leading-relaxed outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:text-gray-100"
      />
      <div className="mt-2 flex justify-end">
        <button
          onClick={() => setText('')}
          className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-950"
        >
          清空
        </button>
      </div>
    </div>
  );
}
