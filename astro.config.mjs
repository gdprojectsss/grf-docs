import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://grf.sh',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'grfsh',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        'zh-cn': { label: '简体中文', lang: 'zh-CN' },
      },
      description: 'A small Unix shell written in Rust, with bash style scripting, typed table pipelines and an agent mode.',
      logo: { src: './src/assets/mark.svg', alt: 'grfsh' },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/docs.css'],
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://grf.sh/og.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://grf.sh/og.png' } },
      ],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/gdprojectsss/goRustlyFast' },
      ],
      editLink: { baseUrl: 'https://github.com/gdprojectsss/grf-docs/edit/main/' },
      lastUpdated: true,
      sidebar: [
        {
          label: 'Getting started', translations: { 'zh-CN': '入门' },
          items: [
            { label: 'Introduction', translations: { 'zh-CN': '简介' }, slug: 'docs' },
            { label: 'Installation', translations: { 'zh-CN': '安装' }, slug: 'docs/installation' },
            { label: 'Making grfsh your shell', translations: { 'zh-CN': '将 grfsh 设为你的 shell' }, slug: 'docs/login-shell' },
          ],
        },
        {
          label: 'Using grfsh', translations: { 'zh-CN': '使用 grfsh' },
          items: [
            { label: 'Scripting', translations: { 'zh-CN': '脚本' }, slug: 'docs/scripting' },
            { label: 'Table pipelines', translations: { 'zh-CN': '表格管道' }, slug: 'docs/tables' },
            { label: 'Interactive features', translations: { 'zh-CN': '交互功能' }, slug: 'docs/interactive' },
            { label: 'Configuration', translations: { 'zh-CN': '配置' }, slug: 'docs/configuration' },
            { label: 'Prompt themes', translations: { 'zh-CN': '提示符主题' }, slug: 'docs/themes' },
            { label: 'Theme gallery', translations: { 'zh-CN': '主题一览' }, slug: 'docs/theme-gallery' },
            { label: 'Agents and scripts', translations: { 'zh-CN': '代理和脚本' }, slug: 'docs/agents' },
          ],
        },
        {
          label: 'Coming from another shell', translations: { 'zh-CN': '从其他 shell 迁移' },
          items: [
            { label: 'Migrating from bash', translations: { 'zh-CN': '从 bash 迁移' }, slug: 'docs/migrating-from-bash' },
            { label: 'Migrating from zsh', translations: { 'zh-CN': '从 zsh 迁移' }, slug: 'docs/migrating-from-zsh' },
          ],
        },
        {
          label: 'Reference', translations: { 'zh-CN': '参考' },
          items: [
            { label: 'Compatibility with bash', translations: { 'zh-CN': '与 bash 的兼容性' }, slug: 'docs/compatibility' },
            { label: 'Stability promise', translations: { 'zh-CN': '稳定性承诺' }, slug: 'docs/stability' },
            { label: 'FAQ', translations: { 'zh-CN': '常见问题' }, slug: 'docs/faq' },
          ],
        },
      ],
    }),
  ],
});
