import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const out = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(out, '../..');
await fs.mkdir(path.join(out, 'assets'), { recursive: true });
const files = {
  cover: 'bodhisattva/G-2.jpeg',
  portrait: 'about/gautama-portrait.jpg',
  mono: 'bodhisattva/bodhisattva_I_ful.jpg',
  color: 'bodhisattva/P4020006_copy.jpg',
  gold: 'bodhisattva/P4020003.JPG',
  skull: 'bodhisattva/P4020022.JPG',
  mono2: 'bodhisattva/P4020015_copy.jpg',
  color2: 'bodhisattva/P4020018.JPG',
  audience1: 'bodhisattva/G-3-1.jpeg',
  audience2: 'bodhisattva/G-3-2.jpeg',
  asiatic: 'asiatic/asiatic-straight-v6.png',
  contextual: 'contextual-modernism/P1011099-gallery-lighting-v3.png',
};
for (const [key, file] of Object.entries(files)) {
  await sharp(path.join(root, 'src/assets/images', file)).rotate()
    .resize({ width: 2800, height: 3200, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 94, mozjpeg: true }).toFile(path.join(out, 'assets', `${key}.jpg`));
}
const esc = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const readParagraphs = async name => (await fs.readFile(path.join(root, `src/content/${name}.md`), 'utf8'))
  .replace(/^---[\s\S]*?---\s*/, '').trim().split(/\n\s*\n/).map(s => s.replace(/\n/g, ' '));
const bio = await readParagraphs('bio/bio');
const bodhi = await readParagraphs('series/bodhisattva');
const asia = await readParagraphs('series/asiatic');
const context = await readParagraphs('series/contextual-modernism');
const p = (text, cls = '') => `<p class="${cls}">${esc(text)}</p>`;
const img = (key, cls = '', alt = '') => `<img class="${cls}" src="assets/${key}.jpg" alt="${esc(alt || key)}">`;
const label = (text, cls = '') => `<div class="label ${cls}">${text}</div>`;
const caption = text => `<div class="caption">${text}</div>`;
const pages = [];
const add = (name, cls, body, section = '') => {
  const n = pages.length + 1;
  pages.push(`<section class="page ${cls}" id="page-${n}" aria-label="${name}">
    ${n > 1 ? `<header class="running">${label('gautama')} ${label(section || name)}</header>` : ''}
    ${body}
    ${n > 1 ? `<footer class="folio">${label('Selected work')}<span>${String(n).padStart(2, '0')}</span></footer>` : ''}
  </section>`);
};

add('Cover', 'cover', `
  <div class="cover-top">${label('An artist portfolio')}${label('Seattle · 2026')}</div>
  <h1 class="masthead">gautama</h1>
  ${img('cover', 'cover-image', 'Two Bodhisattva works installed side by side')}
  <div class="cover-bottom"><h2>Sacred images,<br>synthetic futures.</h2>
  <div>${label('Selected work / 01')}<p>Drawing, devotion<br>and the images we inherit.</p></div></div>
  <a class="cover-site" href="https://gautama.io" aria-label="Visit gautama.io"><span>gautama.io</span><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a>
`);

add('Contents', 'contents', `
  ${label('Inside the portfolio', 'eyebrow')}
  <h2 class="display">Images<br>in transit.</h2>
  <div class="intro-grid">
    <p class="serif lead">What survives when an image crosses from one world into another?</p>
    <div class="body">${p('Across three bodies of work, gautama follows sacred figures through cultural exchange and the recursive passage between hand and machine. Graphite, gold, spectral color, and digital distortion become ways of asking what we inherit—and what we will choose to worship next.')}</div>
  </div>
  <nav class="contents-list" aria-label="Contents">
    ${[['03','The artist','Bio'],['04','Bodhisattva','Drawing / devotion'],['09','Asiatic','An imagined deity'],['11','Contextual Modernism','An image across cultures'],['13','Exhibitions & education','CV / contact']].map(([n,t,d])=>`<a href="#page-${+n}"><span>${n}</span><strong>${t}</strong><em>${d}</em></a>`).join('')}
  </nav>
  <div class="contents-note">${label('On the cover')}<p>Bodhisattva, installation view.<br>Mixed media and gold leaf on paper.</p></div>
`, 'Contents');

add('The artist', 'bio', `
  <div class="bio-heading"><h2>The artist.</h2>${label('Seattle, Washington')}</div>
  ${img('portrait', 'portrait', 'gautama seated in front of two works')}
  ${caption('gautama, with his work.')}
  <div class="bio-copy"><h3>${esc(bio[0])}</h3><div class="body">${bio.slice(1).map(t=>p(t)).join('')}</div></div>
`, 'The artist');

add('Bodhisattva', 'bodhi-open', `
  <div class="section-heading">${label('01 / Drawing & devotion')}<h2>Bodhisattva</h2></div>
  ${p(bodhi[0], 'serif standfirst')}
  <div class="audience-pair">${img('audience1', '', 'A visitor looking at Bodhisattva works in the gallery')}${img('audience2', '', 'Two visitors looking at Bodhisattva works in the gallery')}</div>
  <div class="below-image">${caption('Bodhisattva. Installation views.')}${caption('Mixed media and gold leaf on paper<br>30 × 40 in. / 76.2 × 101.6 cm')}</div>
  <div class="section-bottom">${label('Hand → Scan → Print → Hand')}<span class="serif">An image carried between two worlds.</span></div>
`, 'Bodhisattva');

add('Bodhisattva — graphite and gold', 'plate mono-plate', `
  ${img('mono', 'full-plate', 'Bodhisattva, graphite and gold figure in a wooden frame')}
  <div class="plate-caption">${caption('<em>Bodhisattva.</em> Mixed media and gold leaf on paper. 30 × 40 in.')}${label('01 / Selected work')}</div>
`, 'Bodhisattva / Selected work');

add('Bodhisattva — color', 'plate color-plate', `
  ${img('color', 'full-plate', 'Bodhisattva figure with layered cyan, magenta, yellow, graphite, and gold')}
  <div class="plate-caption">${caption('<em>Bodhisattva.</em> Mixed media and gold leaf on paper. 30 × 40 in.')}${label('01 / Selected work')}</div>
`, 'Bodhisattva / Selected work');

add('The marks of making', 'process', `
  ${label('A closer look', 'eyebrow')}
  <h2 class="display">The marks<br>of making.</h2>
  <div class="detail-pair">${img('gold', '', 'Detail of a graphite face with gold leaf')}${img('skull', '', 'Detail of a skull beneath layered color')}</div>
  <div class="process-copy">${caption('Bodhisattva.<br>Details of graphite, gold, and layered color.')}<div class="body">${p(bodhi[1])}</div></div>
  <div class="process-line">${label('Draw')}<span>→</span>${label('Scan')}<span>→</span>${label('Print')}<span>→</span>${label('Draw again')}</div>
`, 'Bodhisattva / Process');

add('At the threshold', 'threshold', `
  ${label('Inheritance & transformation', 'eyebrow')}
  <h2>At the threshold.</h2>
  <div class="threshold-layout">
    <figure class="threshold-color">${img('color2', '', 'Bodhisattva, second layered color work')}
      <figcaption class="caption">Bodhisattva. Mixed media and gold leaf on paper.<br>Each 30 × 40 in.</figcaption>
    </figure>
    <div class="threshold-aside">${img('mono2', '', 'Bodhisattva, second graphite and gold work')}
      <div class="body">${p(bodhi[2])}</div>
    </div>
  </div>
`, 'Bodhisattva / Selected work');

add('Asiatic', 'asiatic', `
  <div class="section-heading">${label('02 / An imagined deity')}<h2>Asiatic</h2></div>
  ${img('asiatic', 'asiatic-image', 'gautama beside the three-panel Asiatic drawing')}
  ${caption('Asiatic. Installation view, with the artist.')}
  <div class="asia-copy"><h3>The shape of<br>a future god.</h3><div class="body">${asia.map((t,i)=>p(i===0?t[0].toUpperCase()+t.slice(1):t)).join('')}</div></div>
`, 'Asiatic');

add('Asiatic — installation studies', 'asiatic-details', `
  ${label('A closer look', 'eyebrow')}
  <h2>Anatomy of a deity.</h2>
  <figure class="asiatic-head-detail">
    ${img('asiatic-head-installed', '', 'Generated installation closeup of the Asiatic skull, showing layered color, paper and the white frame')}
    <figcaption class="caption">Asiatic. Skull and saber teeth.</figcaption>
  </figure>
  <figure class="asiatic-torso-detail">
    ${img('asiatic-torso-installed', '', 'Generated installation closeup of the Asiatic rib cage, with the paper edge, frame and wall shadow')}
    <figcaption class="caption">Rib cage and forelimb.</figcaption>
  </figure>
`, 'Asiatic / Details');

add('Contextual Modernism', 'context-opener', `
  ${label('03 / An image across cultures', 'eyebrow')}
  <h2 class="display series-title">Contextual<br>Modernism</h2>
  <div class="context-intro">${p(context[0], 'serif lead')}</div>
  <div class="context-body">${label('Culture<br>in translation')}<div class="body">${context.slice(1,3).map(t=>p(t)).join('')}</div></div>
  <blockquote>${esc(context[3])}</blockquote>
  <div class="next-caption">${label('Following page →')}${caption('Contextual Modernism. Installation view.')}</div>
`, 'Contextual Modernism');

add('Contextual Modernism — installation', 'context-plate', `
  ${img('contextual', 'context-image', 'Contextual Modernism: two veiled figures shown in a gallery installation')}
  <div class="plate-caption">${caption('<em>Contextual Modernism.</em> Installation view.')}${label('03 / Selected work')}</div>
`, 'Contextual Modernism / Installation');

// Preserve the CV entries exactly as published on the site.
const cvSource = await fs.readFile(path.join(root, 'src/content/cv.yaml'), 'utf8');
const cv = [];
let section, entry;
for (const line of cvSource.split('\n')) {
  let m;
  if ((m = line.match(/^- id: (.+)/))) { section = { entries: [] }; cv.push(section); }
  else if ((m = line.match(/^  heading: (.+)/))) section.heading = m[1];
  else if ((m = line.match(/^    - year: "(.+)"/))) { entry = { year: m[1] }; section.entries.push(entry); }
  else if ((m = line.match(/^      (title|detail): (.+)/))) entry[m[1]] = m[2];
}
add('Exhibitions, education & contact', 'cv-page', `
  <div class="cv-heading"><h2>Selected<br>history.</h2>${label('Exhibitions<br>& education')}</div>
  <div class="cv-list">${cv.map(s=>`<div class="cv-section">${label(s.heading)}<div>${s.entries.map(e=>`<div class="cv-entry"><span class="cv-year">${e.year.replace('-', '–')}</span><p>${e.title?`<em>${esc(e.title)}</em><br>`:''}${esc(e.detail)}</p></div>`).join('')}</div></div>`).join('')}</div>
  <div class="contact"><div><h3 class="masthead">gautama</h3>${label('Artist / Seattle')}</div><div><a href="https://gautama.io">gautama.io</a><a href="mailto:gautacharya@gmail.com">gautacharya@gmail.com</a><a href="https://www.instagram.com/gautama_studio/">@gautama_studio</a></div></div>
  <div class="colophon">Text and artwork from the artist’s website, gautama.io.<br>Selected work · September 2026</div>
`, 'Exhibitions & contact');

const css = await fs.readFile(path.join(out, 'magazine.css'), 'utf8');
// Style series names in visible text, preserving attributes and link targets.
const body = pages.join('\n').replace(/^[ \t]+$/gm, '').split(/(<[^>]+>)/g).map(part => part.startsWith('<') ? part : part.replace(/\b(Bodhisattva|Asiatic|Contextual Modernism)\b/gi, '<i class="series-title">$1</i>')).join('');
await fs.writeFile(path.join(out, 'gautama-selected-work.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="author" content="gautama"><meta name="description" content="Sacred images, synthetic futures. Selected work by Seattle-based artist gautama."><title>gautama — Selected Work</title><style>${css}</style></head><body>${body}</body></html>`);
console.log(`Built ${pages.length} pages in ${out}`);
