# gautama source inventory

Retrieved from `https://rectangle-hexaflexagon-g4fb.squarespace.com` on 2026-09-07. The raw HTML for every retained public route is in `source/pages/`.

## Retained routes and copy

- `/` and `/work`: series navigation only: contextual modernism, asiatic, bodhisattva, american vedas.
- `/work/contextual-modernism`: the complete contextual modernism statement, five paragraphs.
- `/work/asiatic`: the complete asiatic statement, eight paragraphs.
- `/work/bodhisattva`: the complete bodhisattva statement, four paragraphs, including `Each image is 30”x40”, Drawing, Mixed Media, and Gold Leaf.`
- `/work/americanvedas`: the complete three paragraph statement.
- `/about`: the complete artist biography and CV text, including exhibitions and education.
- `/contact`: the source contact line is `For project and purchase inquires, please use the contact form below.` The purchase commerce route is excluded from the rebuild as requested; retain this source line only if the contact form remains.

## Images

The crawl found 36 canonical Squarespace image URLs, representing 34 basenames and 35 retained local assets. The two D279 URLs share a filename stem but are separate Squarespace uploads: their downloaded WebP responses have different SHA-256 hashes (`ec0f432d…` for `.jpg`, `014740d6…` for `.jpeg`). `photo_in_progress.jpg` also has three URL prefixes: the asiatic and about URLs are byte-identical (`fc17bfc1…`), while the homepage/work URL is a distinct 2500×1875 JPEG (`4dfe47e5…`) retained as `photo_in_progress_home.jpg`. No canonical URL was dropped. All source assets are mirrored under `src/assets/images/` and referenced by the content collections.

- contextual modernism: 9 images total (hero plus 8 gallery images)
- asiatic: 1 image (`photo_in_progress.jpg`)
- bodhisattva: 18 images total (hero plus `P4020002` through `P4020022`, including the non-sequential filenames)
- american vedas: 4 images
- homepage/work/about shared images: already counted among the above; both `photo_in_progress.jpg` and the distinct `photo_in_progress_home.jpg` are rendered on the asiatic work page, while the shared image covers asiatic/about source usage

Responsive `?format=100w` through `?format=2500w` variants were not duplicated. The downloaded originals remain swappable build inputs. No image from the retained routes was intentionally omitted.

## Excluded

`/purchase` and `/cart` were reachable on the source site and deliberately excluded from the new content and route set. `/writing` and `/series` were not public routes (404 at crawl time).
