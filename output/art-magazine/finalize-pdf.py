"""Set portfolio metadata and check the exported PDF. Requires PyMuPDF and Pillow."""
from pathlib import Path
import json
import re
import pymupdf as fitz
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
PDF = HERE / 'gautama-selected-work.pdf'
doc = fitz.open(PDF)
assert len(doc) == 13, f'Unexpected page count: {len(doc)}'
for page in doc:
    assert tuple(page.rect) == (0, 0, 648, 864), page.rect

metadata = doc.metadata
metadata.update({
    'title': 'gautama — Sacred images, synthetic futures',
    'author': 'gautama',
    'subject': 'Selected work, artist biography, exhibitions and education',
    'keywords': 'gautama, Bodhisattva, Asiatic, Contextual Modernism, contemporary art, drawing',
    'creator': 'gautama — Selected Work',
})
doc.set_metadata(metadata)
doc.set_toc([
    [1, 'Cover', 1], [1, 'Contents', 2], [1, 'The artist', 3],
    [1, 'Bodhisattva', 4], [2, 'Selected work — graphite and gold', 5],
    [2, 'Selected work — color', 6], [2, 'The marks of making', 7],
    [2, 'At the threshold', 8],
    [1, 'Asiatic', 9], [2, 'Installation studies', 10],
    [1, 'Contextual Modernism', 11],
    [2, 'Installation view', 12],
    [1, 'Exhibitions, education & contact', 13],
])
contents = doc[1]
for link in contents.get_links():
    if link.get('nameddest', '').startswith('page-'):
        contents.update_link({
            'kind': fitz.LINK_GOTO, 'xref': link['xref'], 'from': link['from'],
            'page': int(link['nameddest'].split('-')[1]) - 1, 'to': fitz.Point(0, 0),
        })
doc.saveIncr()
doc.close()
doc = fitz.open(PDF)

def normalize(s):
    return re.sub(r'\s+', '', s).casefold().replace('’', "'").replace('—', '-').replace('–', '-')

all_text = normalize(' '.join(page.get_text() for page in doc))
checked = []
assert 'americanvedas' not in all_text
for source in [ROOT / 'src/content/bio/bio.md', *(ROOT / f'src/content/series/{name}.md' for name in ['asiatic', 'bodhisattva', 'contextual-modernism'])]:
    body = re.sub(r'^---[\s\S]*?---\s*', '', source.read_text()).strip()
    for paragraph in re.split(r'\n\s*\n', body):
        # The medium/dimensions are typeset separately with expanded units.
        if paragraph.startswith('Mixed media and gold leaf'):
            assert '30×40in.' in all_text
        else:
            assert normalize(paragraph) in all_text, f'Missing source paragraph in {source.name}: {paragraph}'
    checked.append(source.name)

fonts = {f[0]: f for page in doc for f in page.get_fonts()}
missing_fonts = [f[3] for xref, f in fonts.items() if not doc.extract_font(xref)[3]]
assert not missing_fonts, f'Fonts not embedded: {missing_fonts}'
series_spans = [span for page in doc for block in page.get_text('dict')['blocks']
                for line in block.get('lines', []) for span in line['spans']
                if re.search(r'\b(bodhisattva|asiatic|contextual|modernism)\b', span['text'], re.I)]
assert series_spans, 'No series titles found'
assert all(span['flags'] & 2 for span in series_spans), 'Series title is not italic'
links = [link for page in doc for link in page.get_links()]
assert len(links) == 8
assert sum(link['kind'] == fitz.LINK_GOTO for link in links) == 5
assert [link['page'] for link in doc[1].get_links()] == [2, 3, 8, 10, 12]
assert sum(link['kind'] == fitz.LINK_URI for link in links) == 3

previews = HERE / 'previews'
overview = Image.new('RGB', (928, ((len(doc) + 3) // 4) * 312 + 4), '#deded6')
draw = ImageDraw.Draw(overview)
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(1.333333333, 1.333333333), alpha=False)
    preview_path = previews / f'pdf-page-{i+1:02}.png'
    pix.save(preview_path)
    thumb = Image.open(preview_path).convert('RGB').resize((216, 288), Image.Resampling.LANCZOS)
    x, y = (i % 4) * 232 + 8, (i // 4) * 312 + 8
    overview.paste(thumb, (x, y))
    draw.text((x + 101, y + 292), f'{i+1:02}', fill='#42433b')
overview.save(previews / 'overview.jpg', quality=93)
report = {
    'pages': len(doc), 'page_size_inches': [9, 12],
    'all_fonts_embedded': True, 'series_titles_italic': True, 'source_text_verified': checked,
    'contents_links': 5, 'contact_links': 3, 'bookmarks': len(doc.get_toc()),
    'bytes': PDF.stat().st_size,
}
(HERE / 'pdf-check.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps(report, indent=2))
