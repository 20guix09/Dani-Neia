import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'dist');
const context = { window: {} };
vm.runInNewContext(await readFile(path.join(root, 'js/config.js'), 'utf8'), context);
const config = { ...context.window.DANI_CONFIG };
const urlArg = process.argv.find(arg => arg.startsWith('--url='));
if (urlArg) config.canonicalUrl = urlArg.slice(6);
if (config.canonicalUrl) {
  const url = new URL(config.canonicalUrl);
  if (url.protocol !== 'https:') throw new Error('A URL pública precisa usar HTTPS.');
  if (url.search || url.hash) throw new Error('Use uma URL sem parâmetros ou fragmentos.');
  config.canonicalUrl = url.href.replace(/\/?$/, '/');
}
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'obrigado.html', 'css', 'js', 'assets']) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}
await writeFile(path.join(output, 'js/config.js'), `window.DANI_CONFIG = Object.freeze(${JSON.stringify(config, null, 2)});\n`);
let html = await readFile(path.join(output, 'index.html'), 'utf8');
if (config.canonicalUrl) {
  const escapeAttr = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  const canonical = escapeAttr(config.canonicalUrl);
  const image = escapeAttr(new URL('assets/images/dani-neia-enhanced.webp', config.canonicalUrl).href);
  html = html.replace('content="assets/images/dani-neia-enhanced.webp"', `content="${image}"`);
  html = html.replace('</head>', `  <link rel="canonical" href="${canonical}">\n  <meta property="og:url" content="${canonical}">\n</head>`);
  await writeFile(path.join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonical}</loc></url></urlset>\n`);
}
const structuredData = {
  '@context': 'https://schema.org', '@type': 'BeautySalon', name: config.name,
  description: 'Estética facial e corporal em Maringá, Paraná.',
  address: { '@type': 'PostalAddress', streetAddress: 'Av. Dr. Alexandre Rasgulaeff, 3342', addressLocality: 'Maringá', addressRegion: 'PR', addressCountry: 'BR' },
  sameAs: [config.instagram]
};
if (config.canonicalUrl) structuredData.url = config.canonicalUrl;
if (/^55\d{10,11}$/.test(config.whatsapp)) structuredData.telephone = '+' + config.whatsapp;
html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>\n</head>`);
await writeFile(path.join(output, 'index.html'), html);
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\n${config.canonicalUrl ? 'Sitemap: ' + new URL('sitemap.xml', config.canonicalUrl).href + '\n' : ''}`);
console.log('Site preparado em dist/. Nenhum arquivo foi publicado.');
