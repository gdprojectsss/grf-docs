const repository = 'gdprojectsss/goRustlyFast';
const installer = `https://raw.githubusercontent.com/${repository}/main/install.sh`;
const releases = `https://github.com/${repository}/releases/download`;
const targets = new Set([
  'x86_64-unknown-linux-musl',
  'x86_64-unknown-linux-gnu',
  'aarch64-unknown-linux-gnu',
  'x86_64-apple-darwin',
  'aarch64-apple-darwin',
]);
const commandLineClients = /^(curl|wget|fetch|libfetch|httpie|xh|aria2)/i;

function text(body, status = 200, type = 'text/plain; charset=utf-8') {
  return new Response(body, {
    status,
    headers: { 'content-type': type, 'cache-control': 'public, max-age=300' },
  });
}

async function installScript() {
  const response = await fetch(installer, { cf: { cacheTtlByStatus: { '200-299': 300, '400-599': 0 } } });
  if (!response.ok) {
    return text('echo "grfsh install: the installer is unavailable right now" >&2\nexit 1\n', 502, 'text/x-shellscript; charset=utf-8');
  }
  return text(response.body, 200, 'text/x-shellscript; charset=utf-8');
}

async function latestTag() {
  const response = await fetch(`https://github.com/${repository}/releases/latest`, {
    redirect: 'manual',
    headers: { 'user-agent': 'grf.sh' },
    cf: { cacheTtlByStatus: { '300-399': 300, '400-599': 0 } },
  });
  const location = response.headers.get('location') ?? '';
  const match = location.match(/\/releases\/tag\/([^/?#]+)$/);
  return match ? decodeURIComponent(match[1]) : null;
}

async function download(version, name) {
  const tag = version === 'latest' ? await latestTag() : version;
  if (!tag || !/^v\d+\.\d+\.\d+[\w.-]*$/.test(tag)) {
    return text('No such release.\n', 404);
  }
  const file = targets.has(name) ? `grfsh-${tag}-${name}.tar.gz` : name;
  if (!/^[\w.+-]+$/.test(file)) {
    return text('No such file.\n', 404);
  }
  return Response.redirect(`${releases}/${tag}/${file}`, 302);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const agent = request.headers.get('user-agent') ?? '';

    if (path === '/install' || path === '/install.sh' || (path === '/' && commandLineClients.test(agent))) {
      return installScript();
    }
    if (path === '/latest') {
      const tag = await latestTag();
      return tag ? text(`${tag}\n`) : text('No release yet.\n', 404);
    }
    const parts = path.split('/').filter(Boolean);
    if (parts[0] === 'download' && parts.length === 3) {
      return download(parts[1], parts[2]);
    }
    return env.ASSETS.fetch(request);
  },
};
