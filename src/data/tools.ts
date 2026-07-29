// ============================================================
// 工具注册表：整站唯一的"数据中心"
// ------------------------------------------------------------
// 新增一个工具 = 在这里加一条记录 + 在 src/components/tools/
// 里写一个同名 React 组件。首页、分类页、路由、sitemap
// 全部自动生成，无需改其他任何文件。
// ============================================================

export interface Faq {
  q: string;
  a: string;
}

export interface Tool {
  /** URL 路径，例如 /tools/json-formatter */
  slug: string;
  /** 工具名称（卡片标题、H1） */
  name: string;
  /** 一句话描述（卡片副标题、meta description 的基础） */
  description: string;
  /** 分类 id，对应下面 CATEGORIES */
  category: string;
  /** 搜索关键词（中文/英文/拼音都可以往里塞，利于站内搜索和 SEO） */
  keywords: string[];
  /** src/components/tools/ 下的组件文件名（不带 .tsx） */
  component: string;
  /** 页面底部的 SEO 介绍文案（2-3 段，支持多段） */
  seoContent?: string[];
  /** 常见问题（会渲染成 FAQ，并输出结构化数据，利于搜索展现） */
  faqs?: Faq[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const SITE = {
  name: 'ToolHub 工具箱',
  tagline: '免费在线工具大全',
  description:
    'ToolHub 工具箱 - 免费在线工具大全：JSON 格式化、Base64 编码解码、时间戳转换、UUID 生成、二维码生成、密码生成器、Markdown 编辑器、字数统计等，无需注册，打开即用。',
};

export const CATEGORIES: Category[] = [
  { id: 'dev', name: '开发工具', icon: '💻', description: '程序员常用的在线开发与调试工具' },
  { id: 'text', name: '文本工具', icon: '📝', description: '文本处理、转换与统计工具' },
  { id: 'image', name: '图片工具', icon: '🖼️', description: '图片生成与处理工具' },
  { id: 'life', name: '生活工具', icon: '🧰', description: '日常生活中实用的在线小工具' },
];

export const TOOLS: Tool[] = [
  // ---------------- 开发工具 ----------------
  {
    slug: 'json-formatter',
    name: 'JSON 格式化',
    description: '在线 JSON 格式化、压缩与校验，支持语法高亮和错误定位',
    category: 'dev',
    keywords: ['json', '格式化', '压缩', '校验', 'beautify', 'validate', 'minify'],
    component: 'JsonFormatter',
    seoContent: [
      'JSON（JavaScript Object Notation）是目前最流行的数据交换格式，广泛应用于 API 接口、配置文件和数据存储。在开发调试过程中，我们经常遇到被压缩成一行的 JSON 数据，难以阅读；或者手写 JSON 时因为一个多余的逗号导致解析失败。',
      '本工具可以将混乱的 JSON 一键格式化为带缩进、语法高亮的可读形式，也可以反向压缩成单行以节省传输体积。内置实时校验功能，当 JSON 存在语法错误时会给出具体的错误位置和原因，帮助你快速定位问题。所有处理都在你的浏览器本地完成，数据不会上传到任何服务器，可放心处理敏感数据。',
    ],
    faqs: [
      { q: 'JSON 格式化工具有什么用？', a: '它可以把压缩混乱的 JSON 数据格式化为带缩进的可读结构，也能校验 JSON 语法是否正确，并把合法的 JSON 压缩成单行。' },
      { q: '我的数据会被上传到服务器吗？', a: '不会。本工具完全在你的浏览器本地运行，所有数据不会离开你的电脑，可以放心处理包含敏感信息的 JSON。' },
      { q: '提示"Unexpected token"是什么意思？', a: '这表示 JSON 存在语法错误，常见问题包括：多余的逗号、使用了单引号而不是双引号、键名没有加引号等。工具会显示出错的位置，方便你修正。' },
    ],
  },
  {
    slug: 'base64',
    name: 'Base64 编码解码',
    description: '在线 Base64 编码与解码，完美支持中文等 UTF-8 字符',
    category: 'dev',
    keywords: ['base64', '编码', '解码', 'encode', 'decode', '中文'],
    component: 'Base64Tool',
    seoContent: [
      'Base64 是一种用 64 个可打印字符来表示二进制数据的编码方式，常用于在文本协议中传输图片、文件等二进制内容，也常用于简单的数据混淆。',
      '本工具支持文本的 Base64 编码与解码，并且正确处理 UTF-8 字符集，中文、Emoji 等内容编解码不会出现乱码。所有转换均在浏览器本地完成，无需联网，数据安全有保障。',
    ],
    faqs: [
      { q: 'Base64 是加密吗？', a: '不是。Base64 只是一种编码方式，任何人都可以解码，不能用于保护机密信息。如果需要加密，请使用 AES 等真正的加密算法。' },
      { q: '为什么其他地方解码中文会乱码？', a: '很多简易工具直接使用浏览器原生的 btoa/atob 函数，它们只支持 Latin-1 字符集。本工具先进行 UTF-8 转换，因此中文不会乱码。' },
    ],
  },
  {
    slug: 'timestamp',
    name: '时间戳转换',
    description: 'Unix 时间戳与日期时间互转，实时显示当前时间戳',
    category: 'dev',
    keywords: ['时间戳', 'timestamp', 'unix', '日期', '转换', 'date'],
    component: 'TimestampConverter',
    seoContent: [
      'Unix 时间戳是从 1970 年 1 月 1 日（UTC）起至现在的总秒数（或毫秒数），是计算机系统中表示时间的标准方式。开发中经常需要在时间戳和人类可读的日期时间之间互相转换。',
      '本工具首页实时显示当前的秒级和毫秒级时间戳，点击即可复制。支持时间戳转日期时间、日期时间转时间戳双向转换，自动识别秒级和毫秒级时间戳，并以本地时区显示。',
    ],
    faqs: [
      { q: '秒级和毫秒级时间戳有什么区别？', a: '秒级时间戳是 10 位数字（如 1753804800），毫秒级是 13 位（如 1753804800000）。JavaScript 使用毫秒级，而大多数后端语言和数据库使用秒级。本工具会自动识别。' },
      { q: '转换结果用的是什么时区？', a: '转换结果使用你浏览器所在的本地时区显示。' },
    ],
  },
  {
    slug: 'uuid-generator',
    name: 'UUID 生成器',
    description: '在线批量生成 UUID v4，支持大写、无横线等多种格式',
    category: 'dev',
    keywords: ['uuid', 'guid', '生成器', 'v4', '唯一标识'],
    component: 'UuidGenerator',
    seoContent: [
      'UUID（通用唯一识别码）是一种由 128 位数字组成的标识符，广泛用于数据库主键、会话标识、文件名等需要全局唯一 ID 的场景。UUID v4 基于随机数生成，碰撞概率可以忽略不计。',
      '本工具使用浏览器内置的密码学安全随机数接口生成 UUID v4，支持一次批量生成最多 100 个，并提供大写、去除横线等格式选项，点击即可复制。所有生成过程在本地完成，不经过网络。',
    ],
    faqs: [
      { q: 'UUID 会重复吗？', a: '理论上可能，实际上不会。UUID v4 有 2^122 种组合，每秒生成 10 亿个、连续生成 100 年，重复的概率也微乎其微。' },
      { q: '生成 UUID 需要联网吗？', a: '不需要。UUID v4 由随机数构成，本工具使用你浏览器内置的安全随机数接口在本地生成。' },
    ],
  },
  {
    slug: 'password-generator',
    name: '随机密码生成器',
    description: '生成高强度随机密码，自定义长度与字符类型，本地生成更安全',
    category: 'dev',
    keywords: ['密码', 'password', '随机', '生成器', '安全', '强度'],
    component: 'PasswordGenerator',
    seoContent: [
      '使用弱密码或在多个网站重复使用同一个密码，是账号被盗的最主要原因。安全专家建议：每个网站使用不同的、足够长的随机密码，并借助密码管理器保存。',
      '本工具使用浏览器密码学安全随机数接口（crypto.getRandomValues）在你本地生成密码，不经过任何网络传输，比在线"云端生成"的密码工具更安全。你可以自由组合大写字母、小写字母、数字和符号，并排除容易混淆的字符（如 0 和 O、1 和 l）。',
    ],
    faqs: [
      { q: '多长的密码才算安全？', a: '一般建议至少 12 位以上；如果包含大小写字母、数字和符号，16 位的随机密码以目前算力需要数亿年才能暴力破解。' },
      { q: '在这里生成密码安全吗？', a: '安全。密码完全在你的浏览器本地生成，不会发送到任何服务器，也不会被记录。你甚至可以断网使用本工具。' },
    ],
  },
  // ---------------- 文本工具 ----------------
  {
    slug: 'word-counter',
    name: '字数统计',
    description: '在线统计字数、字符数、段落数、句子数和预计阅读时长',
    category: 'text',
    keywords: ['字数', '统计', '字符', 'word', 'count', '阅读时长', '作文'],
    component: 'WordCounter',
    seoContent: [
      '无论是写作文、写论文、运营公众号还是准备演讲稿，准确掌握文本的字数都是刚需。不同场景对"字数"的定义也不同：有的按字符数算，有的按词数算。',
      '本工具在你输入的同时实时统计：总字符数（含/不含空格）、中文汉字数、英文单词数、数字、标点、段落数、句子数，并估算中文和英文的阅读时长。所有统计均在浏览器本地实时完成，长文本也不会卡顿。',
    ],
    faqs: [
      { q: '作文字数一般是怎么算的？', a: '国内作文通常按"字符数（不含空格）"计算，即每个汉字、标点都算一个字。本工具会同时给出多种统计口径。' },
      { q: '阅读时长是怎么估算的？', a: '按中文平均每分钟 300-400 字、英文每分钟 200 词左右的正常阅读速度估算，仅供参考。' },
    ],
  },
  {
    slug: 'markdown-editor',
    name: 'Markdown 编辑器',
    description: '在线 Markdown 编辑与实时预览，支持导出 HTML',
    category: 'text',
    keywords: ['markdown', '编辑器', '预览', 'md', 'html', '写作'],
    component: 'MarkdownEditor',
    seoContent: [
      'Markdown 是一种轻量级标记语言，用简单的符号（如 # 表示标题、** 表示加粗）就能排出整洁的格式，是程序员写文档、博主写文章的首选格式。',
      '本工具提供左右分栏的编辑与实时预览：左边输入 Markdown 源码，右边即时显示渲染效果。支持标题、列表、表格、代码块、任务列表等常用语法，写完后可一键复制 HTML 代码或纯文本。所有内容保存在你的浏览器本地，刷新页面也不会丢失。',
    ],
    faqs: [
      { q: 'Markdown 常用语法有哪些？', a: '井号加空格表示标题（# 一级、## 二级），两个星号包裹表示加粗，一个星号表示斜体，减号加空格表示列表，三个反引号包裹代码块。' },
      { q: '我写的内容保存在哪里？', a: '内容自动保存在你浏览器的本地存储（localStorage）中，不会上传到服务器。清除浏览器数据会同时清除内容，请注意备份。' },
    ],
  },
  // ---------------- 图片工具 ----------------
  {
    slug: 'qrcode-generator',
    name: '二维码生成器',
    description: '输入文字或网址，立即生成高清二维码，支持自定义尺寸和下载',
    category: 'image',
    keywords: ['二维码', 'qrcode', '生成', '扫码', '网址', '下载'],
    component: 'QrCodeGenerator',
    seoContent: [
      '二维码可以把网址、文字、WiFi 密码等信息压缩进一张图片，手机一扫即可读取，是线下分享信息最方便的方式。',
      '本工具输入内容即时生成二维码，支持自定义尺寸和纠错级别（纠错级别越高，二维码被遮挡一部分后越容易被识别）。生成的二维码可以下载为高清 PNG 图片，用于打印、海报等场景。生成过程完全在浏览器本地完成。',
    ],
    faqs: [
      { q: '二维码有字数限制吗？', a: '有。理论上最多可容纳约 4000 个字母数字或约 1000 个汉字，但内容越多二维码越密集、越难扫描，建议内容尽量简短，网址可使用短链接。' },
      { q: '纠错级别是什么意思？', a: '纠错级别（L/M/Q/H）决定二维码被污损、遮挡后仍可被识别的能力，H 级最高可容忍约 30% 的面积损坏。如果要在二维码中间加 Logo，建议选择 H 级。' },
    ],
  },
  // ---------------- 生活工具 ----------------
  {
    slug: 'bmi-calculator',
    name: 'BMI 计算器',
    description: '输入身高体重，快速计算 BMI 指数及健康体重范围',
    category: 'life',
    keywords: ['bmi', '计算器', '体重', '身高', '健康', '减肥', '指数'],
    component: 'BmiCalculator',
    seoContent: [
      'BMI（身体质量指数）是国际上常用的衡量人体胖瘦程度与健康状况的指标，计算方式为体重（公斤）除以身高（米）的平方。',
      '根据中国标准：BMI 低于 18.5 为偏瘦，18.5-23.9 为正常，24-27.9 为超重，28 及以上为肥胖。本工具输入身高体重后即时给出 BMI 数值、健康评级，以及适合你身高的健康体重范围，可作为健身或减肥计划的参考。',
    ],
    faqs: [
      { q: 'BMI 正常就代表健康吗？', a: '不完全。BMI 无法区分肌肉和脂肪，肌肉发达的运动员 BMI 可能"超标"但身体很健康；反之 BMI 正常也可能体脂率偏高。BMI 应作为参考指标之一，结合体脂率、腰围等综合判断。' },
      { q: 'BMI 中国标准和国际标准有什么不同？', a: '国际标准（WHO）中 BMI 25 以上为超重、30 以上为肥胖；考虑到亚洲人体质特点，中国标准为 24 以上超重、28 以上肥胖，更为严格。' },
    ],
  },
];

// ---------- 工具函数 ----------

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getCategory(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function toolsByCategory(categoryId: string): Tool[] {
  return TOOLS.filter((t) => t.category === categoryId);
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return TOOLS;
  return TOOLS.filter((t) => {
    const haystack = [t.name, t.description, t.slug, ...t.keywords].join(' ').toLowerCase();
    return q.split(/\s+/).every((word) => haystack.includes(word));
  });
}
