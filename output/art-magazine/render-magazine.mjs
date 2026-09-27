import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const out = path.dirname(fileURLToPath(import.meta.url));
const port = process.env.MAGAZINE_CHROME_PORT || '9344';
const expectedPages = 13;
const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
const ws = new WebSocket(tabs.find(tab => tab.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r);
let id = 0;
const pending = new Map();
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id) { pending.get(m.id)?.(m); pending.delete(m.id); }
};
const call = (method, params = {}) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`${method} timed out`)), 60000);
  pending.set(++id, m => { clearTimeout(timer); m.error ? reject(m.error) : resolve(m.result); });
  ws.send(JSON.stringify({ id, method, params }));
});
const evaluate = async expression => {
  const value = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (value.exceptionDetails) throw new Error(JSON.stringify(value.exceptionDetails));
  return value.result.value;
};
try {
  await call('Page.enable');
  await call('Emulation.setDeviceMetricsOverride', { width: 864, height: 1152, deviceScaleFactor: 1, mobile: false });
  await call('Emulation.setEmulatedMedia', { media: 'print' });
  await call('Page.navigate', { url: pathToFileURL(path.join(out, 'gautama-selected-work.html')).href });
  for (let i = 0; i < 100; i++) {
    if (await evaluate(`document.readyState === 'complete' && document.querySelectorAll('.page').length === ${expectedPages}`)) break;
    await new Promise(r => setTimeout(r, 100));
  }
  await evaluate(`Promise.all([document.fonts.ready, ...[...document.images].map(i=>i.decode())]).then(()=>true)`);
  const audit = await evaluate(`([...document.querySelectorAll('.page')].map(page => {
    const r = page.getBoundingClientRect();
    const bad = [...page.querySelectorAll('p,h1,h2,h3,blockquote,img,.caption,.label,.cv-entry,.colophon')].flatMap(e => {
      const b = e.getBoundingClientRect();
      const issue = b.left < r.left-1 || b.right > r.right+1 || b.top < r.top-1 || b.bottom > r.bottom+1;
      const footer = !e.closest('footer') && b.bottom > r.bottom-66;
      return issue || footer ? [{element:e.tagName, text:e.textContent.slice(0,70), bottom:Math.round(b.bottom-r.top), issue, footer}] : [];
    });
    return {page:page.id, name:page.getAttribute('aria-label'), issues:bad};
  }))`);
  const broken = await evaluate(`[...document.images].filter(i=>!i.complete || !i.naturalWidth).map(i=>i.src)`);
  await fs.writeFile(path.join(out, 'layout-check.json'), JSON.stringify({ pages: audit, brokenImages: broken }, null, 2));
  console.log('Layout audit:', JSON.stringify(audit.filter(a=>a.issues.length)));
  if (broken.length) throw new Error(`Broken images: ${broken.join(', ')}`);
  if (audit.length !== expectedPages) throw new Error(`Expected ${expectedPages} pages; found ${audit.length}`);
  if (audit.some(page => page.issues.length)) throw new Error('Page content overflows; see layout-check.json');
  const pdf = await call('Page.printToPDF', {
    printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false,
    marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
    generateTaggedPDF: true, generateDocumentOutline: true,
    transferMode: 'ReturnAsStream',
  });
  const pdfChunks = [];
  while (true) {
    const chunk = await call('IO.read', { handle: pdf.stream, size: 1024 * 1024 });
    pdfChunks.push(Buffer.from(chunk.data, chunk.base64Encoded ? 'base64' : 'utf8'));
    if (chunk.eof) break;
  }
  await call('IO.close', { handle: pdf.stream });
  await fs.writeFile(path.join(out, 'gautama-selected-work.pdf'), Buffer.concat(pdfChunks));
  await fs.mkdir(path.join(out, 'previews'), { recursive: true });
  const composites = [];
  for (let i = 0; i < expectedPages; i++) {
    const rect = await evaluate(`(()=>{const r=document.querySelectorAll('.page')[${i}].getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height,scale:1}})()`);
    const shot = await call('Page.captureScreenshot', { format: 'png', clip: rect, captureBeyondViewport: true });
    const buffer = Buffer.from(shot.data, 'base64');
    await fs.writeFile(path.join(out, 'previews', `page-${String(i+1).padStart(2,'0')}.png`), buffer);
    composites.push({ input: await sharp(buffer).resize(216,288).png().toBuffer(), left: (i%4)*232+8, top: Math.floor(i/4)*312+8 });
    const svg = Buffer.from(`<svg width="216" height="16"><text x="108" y="12" text-anchor="middle" font-family="Arial" font-size="11" fill="#42433b">${String(i+1).padStart(2,'0')}</text></svg>`);
    composites.push({ input: svg, left:(i%4)*232+8, top:Math.floor(i/4)*312+298 });
  }
  await sharp({ create: { width: 928, height: Math.ceil(expectedPages / 4) * 312 + 4, channels: 3, background: '#deded6' } }).composite(composites).jpeg({quality: 92}).toFile(path.join(out, 'previews', 'overview.jpg'));
  const stat = await fs.stat(path.join(out, 'gautama-selected-work.pdf'));
  console.log(`Rendered ${expectedPages} pages; PDF ${(stat.size/1024/1024).toFixed(1)} MB. Previews saved.`);
} finally { ws.close(); }
