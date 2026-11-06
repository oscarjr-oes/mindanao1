# Mindanao One

Personal site of Oscar Sarmiento, Jr. — Chief Operations Officer for Mindanao at the
PS Group of Companies — plus a small set of interactive project pages on Mindanao and
the Bangsamoro region.

**Live:** https://oscarjr-oes.github.io/mindanao1/

## Pages

| File | What it is |
|---|---|
| `index.html` | Landing page: profile, project cards, video and contact links. |
| `two-paths-to-work.html` | Traffic-flow visualization comparing the existing ORC compound in Cotabato City against the proposed Landas 15-minute community in Parang. Reads the `data/*.js` files below. |
| `barmm-fiscal-flows.html` | Dashboard tracing Bangsamoro public money from national block grant through to local spending. |

## Data

| File | Used by | Contents |
|---|---|---|
| `data/parang-roads.js` | `two-paths-to-work.html` | `window.parangRoads` — road geometry and bounds for Parang. |
| `data/orc-roads.js` | `two-paths-to-work.html` | `window.orcRoads` — road geometry for the Cotabato City compound. |
| `data/sites.js` | `two-paths-to-work.html` | `window.sitesData` — site polygons plus `overlayBox`, the lat/lon corners the Landas masterplan image is georeferenced to. |
| `data/landas-overlay.webp` | `two-paths-to-work.html` | Landas masterplan render, drawn on the Parang map at 50% opacity beneath the road network. |

## How `index.html` is built — read this first

`index.html` is **generated**, not hand-written. Its source is the Claude Design project
*PS Group Mindanao Landing Page* (`project/Oscar Sarmiento.dc.html` inside the migrated
canvas). Hand-edits here are lost the next time the page is exported — change the design
project, re-export, and rebuild.

To rebuild after a re-export:

```
python3 tools/build-index.py "<export>/Oscar Sarmiento.dc.html" tools/fonts.css index.html
```

The script asserts on every substitution it makes, so it fails loudly rather than
silently producing a half-patched page. It does six things the raw export does not:

1. injects the `<title>`, description, canonical, icons, Open Graph / Twitter cards and
   the GA4 tag into the real `<head>` — none of these exist in the design export;
2. replaces the Google Fonts `<link>` with the self-hosted `@font-face` block in
   `tools/fonts.css`, so the page makes no third-party font request;
3. points the image references at the optimized `.webp` files in `assets/`;
4. marks the below-the-fold images `loading="lazy"`;
5. pins the hero video to `assets/banwag.mp4` (see below);
6. resolves the hero `<source>` in the markup. This one matters: the browser's preload
   scanner reads `src` before `support.js` can substitute `{{ heroSrc }}`, so leaving the
   placeholder there costs a wasted 404 request on every single page load.

### Supporting files

| Path | What it is |
|---|---|
| `support.js` | the design runtime — renders the `<x-dc>` element, `{{ }}` bindings and `style-hover` attributes. Patched to load React from `vendor/` instead of unpkg.com. |
| `vendor/react-18.3.1.min.js`, `vendor/react-dom-18.3.1.min.js` | vendored so the site has no runtime CDN dependency. Re-apply this patch to `support.js` after a re-export. |
| `assets/*.webp`, `assets/logo.png` | images resized to the dimensions they are actually displayed at. The originals live in the design project; never re-compress these, re-export instead. |
| `assets/fonts/*.woff2` | Latin and Latin-Ext subsets only, 14 files for 22 faces (several weights share one variable file). |
| `assets/banwag.mp4` | the hero video. |
| `tools/extract-fonts.py` | how `tools/fonts.css` and `assets/fonts/` were produced from the old bundled build; kept for reference. |

**Only one hero video ships.** The design project has a `heroVideo` prop offering
"Banwag I" and "Banwag II", but shipping both would put 5.3 MB in the repository that no
visitor ever downloads. The build pins the source to `assets/banwag.mp4` ("Banwag I"). To
switch, copy `assets/banwag2.mp4` out of the design project and change that one line.

### `barmm-fiscal-flows.html` is still a bundle

It remains a **single-file export from a design tool**: a normal `<head>` and unpacking
script, then one very long line holding a JSON asset map, then one very long line holding
the real page as a JSON-encoded HTML string with assets referenced by bare UUID. On load
the script decodes each asset into a `blob:` URL and replaces `document.documentElement`.

Two consequences:

1. **Never run `sed`, `awk` or line-based regex against those two long lines.** Parse the
   JSON, mutate it, re-serialize it — and when you re-serialize, escape `</` as `<\/`, or a
   literal `</script>` in the data will terminate the script element and break the page.
   Locate the lines by content, not by a hardcoded line number.
2. Anything that must survive the unpack — the `<title>`, favicon links — has to exist in
   **both** the outer head and the inner page's head. Open Graph tags only need the outer
   head, since scrapers read the served HTML and never run the script.

`two-paths-to-work.html` is ordinary hand-written HTML and can be edited normally.

## Deploying

GitHub Pages serves the `main` branch from the repository root. Push to `main` and the
site rebuilds within about a minute. `.nojekyll` is present so Pages serves the files
as-is instead of running them through Jekyll.

## Known remaining work

- The landing page is still rendered in the browser by `support.js`, so the served HTML
  carries no body content for crawlers. Link previews work (Open Graph tags are static),
  but a pre-rendered body would be better for search.
- `barmm-fiscal-flows.html` is still a 463 KB single-file bundle.
- `support.js` keeps a lazy reference to `@babel/standalone` on unpkg.com. It is never
  requested by this page, which uses plain JS rather than JSX, but a future export that
  introduces JSX would reintroduce a CDN dependency.
