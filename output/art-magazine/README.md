# gautama — Selected Work

A 13-page, 9 × 12 inch artist portfolio with a Colossal-inspired editorial direction: warm paper, large sans-serif headlines, serif text, mint accents, and generous artwork views. The cover features the Bodhisattva installation, page 4 pairs two gallery photographs, and all series titles are italicized. The portfolio includes Bodhisattva, Asiatic, and Contextual Modernism.

Page 8 uses an asymmetric composition with a larger color work on the left and a smaller graphite work above the text on the right. Large decorative chapter numerals are omitted. The contents introduction avoids a single-word final line, and the closing artist name shares the cover masthead typography.

- `gautama-selected-work.pdf` — finished PDF, with embedded fonts, searchable text, bookmarks, linked contents, and contact links.
- `previews/overview.jpg` — contact sheet of all 13 exported PDF pages.
- `gautama-selected-work.html` — editable browser layout.
- `magazine.css` — typography, color, and page layout.
- `build-magazine.mjs` — assembles the layout from the site's biography, series statements, CV, and artwork.
- `render-magazine.mjs` — exports the PDF and browser previews using Chrome's local debugging endpoint.
- `finalize-pdf.py` — adds PDF metadata/bookmarks and verifies source text, embedded fonts, page count, and links; also renders the PDF previews.

The artwork comes from `src/assets/images`; biography and series statements come from `src/content`. Source images are preserved. Export assets are resized only when needed and encoded as JPEGs. Editorial crops are used on the cover, detail photographs, artist portrait, and Asiatic installation image. The framed works and full installation plate retain their proportions.

## Rebuild

From the repository root, run `node output/art-magazine/build-magazine.mjs`.

Start a separate headless Chrome instance with `--remote-debugging-port=9344` and a temporary `--user-data-dir`. Run `node output/art-magazine/render-magazine.mjs`; set `MAGAZINE_CHROME_PORT` if using another port. Chrome uses the locally installed Helvetica Neue, Arial Black, and Iowan Old Style fonts and embeds them in the PDF.

Run `python output/art-magazine/finalize-pdf.py` in a Python environment with PyMuPDF and Pillow. The verification reports are `layout-check.json` and `pdf-check.json`.

Visual reference: https://www.thisiscolossal.com/

## Asiatic installation studies

Page 10 adds two generated closeups based on the artist’s original head and torso TIFFs from Downloads and the existing installation photograph. The views show the work as installed, including paper edges, white frames, depth and gallery wall shadows. Contextual Modernism now starts on page 11; the CV is on page 13. Contents links, folios, bookmarks and preview grids reflect the added page.

- `generated/asiatic-head-installed.png` and `generated/asiatic-torso-installed.png` — original built-in image_gen outputs.
- `assets/asiatic-head-installed.jpg` and `assets/asiatic-torso-installed.jpg` — print-layout assets.
- `references/asiatic-head.jpg` and `references/asiatic-torso.jpg` — reduced JPEG references converted from the source TIFFs; originals remain unchanged in Downloads.
- `generation-prompts.json` — complete prompts and generation mode.

The tail TIFF was still an incomplete download when these images were made, so only the complete head and torso files were used. Generated detail assets are retained during the normal rebuild.
