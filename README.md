# grf.sh

The website and documentation for [grfsh](https://github.com/gdprojectsss/goRustlyFast), served at [grf.sh](https://grf.sh).

- `src/pages/index.astro` is the landing page.
- `src/content/docs/docs/` holds the documentation, built with [Starlight](https://starlight.astro.build).
- `worker/index.js` runs in front of the static site on Cloudflare. It answers `curl https://grf.sh` with the install script and redirects `/download/VERSION/TARGET` to the matching GitHub release file.

## Working on it

```sh
npm ci
npm run dev        # http://localhost:4321
npm run build
npm run preview    # the built site behind the Worker, http://localhost:8787
```

Corrections to the docs are welcome. Each page has an "Edit page" link at the bottom.

## Endpoints

| Path | Response |
| --- | --- |
| `/` | the landing page, or the install script for curl and wget |
| `/install` | the install script |
| `/latest` | the tag of the newest release |
| `/download/latest/TARGET` | the newest tarball for a target such as `aarch64-apple-darwin` |
| `/download/vX.Y.Z/FILE` | any file attached to that release, such as `SHA256SUMS` |
| `/docs/` | the documentation |

## Deploying

Pushes to `main` build the site and deploy it with `wrangler deploy`. The workflow needs two repository secrets: `CLOUDFLARE_API_TOKEN`, a token with the Workers Scripts and Workers Routes edit permissions for the grf.sh zone, and `CLOUDFLARE_ACCOUNT_ID`.

## License

[MIT](LICENSE)
