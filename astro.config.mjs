// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// ⚠️ 部署前把这里改成你的真实域名，例如 'https://www.example.com'
// 它用于生成 sitemap.xml 和 canonical 链接
const SITE_URL = process.env.SITE_URL || 'https://qyj-tools.eu.cc';

export default defineConfig({
  site: SITE_URL,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
