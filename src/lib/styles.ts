// 工具组件共享的按钮样式（配合全局 dark: 变体自动支持深色模式）
export const btn =
  'rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40';

export const btnPrimary = `${btn} bg-indigo-600 text-white hover:bg-indigo-700`;

export const btnGhost = `${btn} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700`;

export const inputCls =
  'rounded-xl border border-gray-300 bg-gray-50 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900/50';

export const outputDarkCls =
  'rounded-xl border border-gray-300 bg-gray-900 dark:border-gray-700';
