import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://grf.sh',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'grfsh',
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
          label: 'Getting started',
          items: [
            { label: 'Introduction', slug: 'docs' },
            { label: 'Installation', slug: 'docs/installation' },
            { label: 'Making grfsh your shell', slug: 'docs/login-shell' },
          ],
        },
        {
          label: 'Using grfsh',
          items: [
            { label: 'Scripting', slug: 'docs/scripting' },
            { label: 'Table pipelines', slug: 'docs/tables' },
            { label: 'Interactive features', slug: 'docs/interactive' },
            { label: 'Configuration', slug: 'docs/configuration' },
            { label: 'Prompt themes', slug: 'docs/themes' },
            { label: 'Theme gallery', slug: 'docs/theme-gallery' },
            { label: 'Agents and scripts', slug: 'docs/agents' },
          ],
        },
        {
          label: 'Coming from another shell',
          items: [
            { label: 'Migrating from bash', slug: 'docs/migrating-from-bash' },
            { label: 'Migrating from zsh', slug: 'docs/migrating-from-zsh' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Compatibility with bash', slug: 'docs/compatibility' },
            { label: 'Stability promise', slug: 'docs/stability' },
            { label: 'FAQ', slug: 'docs/faq' },
          ],
        },
      ],
    }),
  ],
});
