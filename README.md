# 🧰 ToolHub 工具箱

免费在线工具站，基于 **Astro + React + Tailwind CSS v4**。
全站静态生成、无后端、零服务器成本，所有工具在浏览器本地运行。

## 快速开始

```bash
npm install      # 安装依赖（已装过可跳过）
npm run dev      # 本地开发 → http://localhost:4321
npm run build    # 构建静态文件 → dist/
npm run preview  # 本地预览构建结果
```

## 部署上线（免费，约 10 分钟）

### 方式一：Netlify（推荐，国内访问尚可）

1. 把代码推送到 GitHub：`git init && git add . && git commit -m "init"`，然后在 GitHub 新建仓库并 push
2. 注册 [netlify.com](https://www.netlify.com) → **Add new site → Import an existing project** → 选 GitHub → 选这个仓库
3. Netlify 已自动识别 `netlify.toml`（build: `npm run build`，publish: `dist`），直接点 **Deploy**
4. 部署成功后：**Site settings → Domain management → Add a custom domain**，输入你的域名
5. 去你的域名服务商后台，把 DNS 的 `CNAME` 记录指向 Netlify 给你的地址（如 `xxx.netlify.app`）；根域名用 `A` 记录指向 `75.2.60.5`
6. 等 DNS 生效（几分钟到几小时），Netlify 会自动签发免费 HTTPS 证书

### 方式二：Vercel

1. 同样先推送 GitHub
2. 注册 [vercel.com](https://vercel.com) → **Add New → Project** → 导入仓库（Vercel 自动识别 Astro，无需配置）
3. 部署后在 **Settings → Domains** 添加域名，按提示改 DNS 即可

### 部署后必做

- [ ] 修改 `astro.config.mjs` 里的 `SITE_URL` 为你的真实域名，重新部署（sitemap/canonical 依赖它）
- [ ] 修改 `public/robots.txt` 里的 Sitemap 地址为真实域名
- [ ] 到 [Google Search Console](https://search.google.com/search-console) 验证站点并提交 `https://你的域名/sitemap-index.xml`
- [ ] 到[百度站长平台](https://ziyuan.baidu.com/)验证站点并提交 sitemap（国内流量重要）

## 接入广告（流量起来之后）

1. 申请 [Google AdSense](https://adsense.google.com)（要求：已备案域名或海外站、有一定内容量）
2. 拿到发布商 ID（`pub-` 开头）后：
   - 本地：复制 `.env.example` 为 `.env`，填入 `PUBLIC_ADSENSE_ID=pub-xxxxxxxx`
   - Netlify/Vercel：在后台 **Environment variables** 添加同名变量
3. 在 AdSense 后台创建"展示广告"单元拿到 slot ID，填入 `src/components/AdSlot.astro` 的 `slot` 默认值
4. 重新部署即可——未配置 ID 时网站不加载任何广告代码

> 国内替代：百度联盟、搜狗联盟。接入方式类似，替换 `AdSlot.astro` 里的脚本即可。

## 添加一个新工具（维护核心）

只需 **2 步**，首页卡片、分类、路由、sitemap 全部自动生成：

1. **写组件**：在 `src/components/tools/` 新建 `MyTool.tsx`（React 组件，参考现有 9 个工具）
2. **登记**：
   - `src/data/tools.ts` 的 `TOOLS` 数组加一条记录（slug、名称、描述、关键词、SEO 文案、FAQ）
   - `src/pages/tools/[slug].astro` 顶部 import 并在模板里加一行 `{tool.component === 'MyTool' && <MyTool client:load />}`

## 项目结构

```
src/
├── data/tools.ts          # ⭐ 工具注册表（整站唯一数据中心）
├── layouts/
│   ├── BaseLayout.astro   # 全站布局（SEO meta、AdSense 脚本）
│   └── ToolLayout.astro   # 工具页布局（面包屑、FAQ、结构化数据）
├── components/
│   ├── Header.astro / Footer.astro / AdSlot.astro / SearchBox.tsx
│   └── tools/             # ⭐ 每个工具一个 React 组件
└── pages/
    ├── index.astro        # 首页（分类 + 搜索）
    ├── 404.astro
    └── tools/[slug].astro # 动态路由，自动生成所有工具页
```

## 推荐后续添加的工具（高搜索量）

- 开发类：URL 编解码、正则测试、颜色转换、Cron 表达式解析、JWT 解码、HTTP 状态码查询
- 文本类：大小写转换、去重/排序、文本对比（diff）、简繁转换、拼音转换
- 图片类：图片压缩、图片转 Base64、ICO 生成、SVG 预览
- 生活类：亲戚称呼计算、房贷计算器、个税计算器、日期倒计时

每个新工具页 = 一个新的长尾关键词入口，这是工具站流量增长的核心打法。
