# deployment

The site is a static Astro build. Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), builds `dist`, uploads it as a GitHub Pages artifact, and deploys it to the `github-pages` environment. The workflow can also be run manually from the Actions tab.

## one-time GitHub setup

Create the GitHub repository and push this project to its `main` branch. The repository owner and name are intentionally not embedded here because no GitHub repository target has been chosen yet. In **Settings → Pages**, set **Source** to **GitHub Actions**. The first successful workflow run will publish the site.

GitHub’s Pages workflow requires `pages: write` and `id-token: write` permissions for the deploy job; those are set in the workflow. See [GitHub’s custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Cloudflare DNS

In the Cloudflare DNS zone for `gautama.io`, add the records GitHub lists for the custom domain:

- apex `@`: GitHub Pages’ four published A records
- `www`: a CNAME to the repository’s GitHub Pages hostname, if `www` is needed

Then, in **Settings → Pages → Custom domain**, enter `gautama.io` and enable HTTPS after DNS has propagated. `public/CNAME` keeps the domain in the source tree; GitHub’s custom-domain setting is still required for an Actions deployment. Follow [GitHub’s custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) and [Cloudflare’s DNS record guide](https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/). Do not change the live DNS zone until the repository and Pages target are selected.

## local verification

```sh
npm install
npm run check
npm run build
npm run preview
```
