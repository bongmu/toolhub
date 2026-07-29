import { useMemo, useState } from 'react';

interface Level {
  label: string;
  color: string;
  bg: string;
  advice: string;
}

function classify(bmi: number): Level {
  if (bmi < 18.5)
    return {
      label: '偏瘦',
      color: 'text-sky-700',
      bg: 'bg-sky-100',
      advice: '体重偏低，建议均衡饮食、适当增加优质蛋白和力量训练。',
    };
  if (bmi < 24)
    return {
      label: '正常',
      color: 'text-green-700',
      bg: 'bg-green-100',
      advice: '体重在健康范围，保持规律运动和均衡饮食即可。',
    };
  if (bmi < 28)
    return {
      label: '超重',
      color: 'text-amber-700',
      bg: 'bg-amber-100',
      advice: '体重略高，建议控制热量摄入并增加有氧运动。',
    };
  return {
    label: '肥胖',
    color: 'text-red-700',
    bg: 'bg-red-100',
    advice: '体重明显超标，建议制定科学的减重计划，必要时咨询医生或营养师。',
  };
}

export default function BmiCalculator() {
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('65');

  const result = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h < 50 || h > 300 || w < 10 || w > 500) return null;
    const bmi = w / (h / 100) ** 2;
    const minW = 18.5 * (h / 100) ** 2;
    const maxW = 23.9 * (h / 100) ** 2;
    return { bmi, level: classify(bmi), minW, maxW };
  }, [height, weight]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600">身高（cm）</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="如 170"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-600">体重（kg）</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="如 65"
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {result ? (
        <div className={`rounded-xl p-5 ${result.level.bg}`}>
          <div className="flex flex-wrap items-baseline gap-x-4">
            <span className={`text-4xl font-bold ${result.level.color}`}>
              {result.bmi.toFixed(1)}
            </span>
            <span className={`rounded-full bg-white px-3 py-1 text-sm font-medium ${result.level.color}`}>
              {result.level.label}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">{result.level.advice}</p>
          <p className="mt-2 text-sm text-gray-600">
            你的健康体重范围：
            <span className="font-semibold">
              {result.minW.toFixed(1)} ~ {result.maxW.toFixed(1)} kg
            </span>
          </p>

          {/* 标准刻度条 */}
          <div className="mt-4">
            <div className="flex h-2.5 overflow-hidden rounded-full">
              <div className="w-[18%] bg-sky-400" />
              <div className="w-[33%] bg-green-500" />
              <div className="w-[24%] bg-amber-400" />
              <div className="flex-1 bg-red-400" />
            </div>
            <div className="mt-1 flex justify-between text-xs text-gray-500">
              <span>偏瘦 &lt;18.5</span>
              <span>正常 18.5-23.9</span>
              <span>超重 24-27.9</span>
              <span>肥胖 ≥28</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-xl bg-gray-100 p-4 text-center text-sm text-gray-500">
          请输入合理的身高（50-300 cm）和体重（10-500 kg）
        </p>
      )}

      <p className="text-xs leading-relaxed text-gray-400">
        注：BMI 采用中国成人标准，仅适用于 18 岁以上成年人，不适用于孕妇、运动员等特殊人群。
      </p>
    </div>
  );
}
