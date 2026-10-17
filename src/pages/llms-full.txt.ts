import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';

const order = config.sidebar.flatMap((group) =>
  'items' in group ? group.items.map((item) => ('slug' in item ? item.slug : '')) : [],
);

export const GET: APIRoute = async () => {
  const pages = await getCollection('docs');
  pages.sort((left, right) => order.indexOf(left.id) - order.indexOf(right.id));
  const sections = pages.map(
    (page) => `# ${page.data.title}\n\nSource: https://grf.sh/${page.id}/\n\n${page.body?.trim() ?? ''}\n`,
  );
  const header = '# grfsh documentation\n\n> The complete grfsh documentation from https://grf.sh/docs/ as one file. Agent instructions in short form are at https://grf.sh/llms.txt.\n';
  return new Response([header, ...sections].join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
};
