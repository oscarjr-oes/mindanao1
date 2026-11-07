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

The deployed page is **static HTML**. It carries no design runtime and no framework: the
whole body is in the served markup, and about 50 lines of inline vanilla JS handle the
contact modal, the copy-to-clipboard button and the reveal-on-scroll animation.

Rebuilding after a re-export is two stages:

```
python3 tools/build-index.py "<export>/Oscar Sarmiento.dc.html" tools/fonts.css build.html
python3 tools/prerender.py build.html index.html
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
   scanner reads `src` before the runtime can substitute `{{ heroSrc }}`, so leaving the
   placeholder there costs a wasted 404 request on every single page load.

`tools/prerender.py` then removes the runtime entirely. It resolves the remaining `{{ }}`
bindings to the only values they can take (accent `#2f6b3d`, modal closed, copy label
"Copy"), turns the 19 `style-hover` attributes into real CSS `:hover` rules, converts the
`ref=` and `onClick=` bindings into ids and `data-act` hooks, unwraps `<x-dc>` and
`<helmet>`, and swaps the component class for the inline script. It asserts on every
substitution — including that exactly 19 hover attributes were rewritten and that no
`{{ }}` binding survives — so a changed export fails loudly.

The e-mail address is still assembled in JS (`['oscar.jr', 'pssarmiento.com'].join('@')`)
and never appears in the served HTML. That is deliberate, and pre-rendering preserves it.

### Supporting files

| Path | What it is |
|---|---|
| `assets/*.webp`, `assets/logo.png` | images resized to the dimensions they are actually displayed at. The originals live in the design project; never re-compress these, re-export instead. |
| `assets/fonts/*.woff2` | Latin and Latin-Ext subsets only, 14 files for 22 faces (several weights share one variable file). |
| `assets/banwag.mp4` | the hero video. |
| `tools/extract-fonts.py` | how `tools/fonts.css` and `assets/fonts/` were produced from the old bundled build; kept for reference. |

A fresh export ships its own `support.js`, and the runtime wants React and ReactDOM
(a single-file export bundles them in; the unpacked project fetches them from unpkg.com).
None of it is deployed any more — `tools/prerender.py` makes all three unnecessary. Do not
copy them back in.

**Only one hero video ships.** The design project has a `heroVideo` prop offering
"Banwag I" and "Banwag II", but shipping both would put 5.3 MB in the repository that no
visitor ever downloads. The build pins the source to `assets/banwag.mp4` ("Banwag I"). To
switch, copy `assets/banwag2.mp4` out of the design project and change that one line.

## How `barmm-fiscal-flows.html` is built

The page comes out of the design tool as a **single-file export**: a loader in the outer
head, one long line of JSON holding every script and font gzipped and base64'd, and one
long line holding the real page as a JSON-encoded HTML string with each asset referenced
by a bare UUID. At load the loader decodes everything, mints `blob:` URLs, substitutes the
UUIDs and replaces `document.documentElement`.

None of that is needed on a web server, so `tools/build-barmm.py` does the substitution at
build time instead:

```
python3 tools/build-barmm.py src/barmm-fiscal-flows.bundle.html barmm-fiscal-flows.html
```

The export itself is kept at `src/barmm-fiscal-flows.bundle.html` — it is the only source
this page has, so do not delete it. Nothing links to it, so no visitor downloads it.
Re-export over that file and re-run the build; never hand-edit `barmm-fiscal-flows.html`.

**Never run `sed`, `awk` or a line-based regex against the bundle.** Two of its lines are
hundreds of thousands of characters of JSON. Parse the JSON, change it, re-serialize it —
and when you do, escape `</` as `<\/`, or a literal `</script>` inside the data will end
the script element and break the file. Find the lines by content, never by line number.

What the build does: writes the ten assets into `assets/barmm/` under stable names derived
from the `@font-face` rules and the script positions (the UUIDs change on every export),
rewrites the references, strips the SRI hashes that belonged to the CDN copies, and folds
the outer head's social and analytics tags into the one head the page now has.

**`window.__resources` must come before the runtime script.** The dc-runtime resolves React
and ReactDOM through that object and falls back to unpkg.com when it is missing, so it is
injected directly after `<meta charset>` — ahead of `<script src="assets/barmm/dc-runtime.js">`.
Put it at the end of `<head>` and the page silently starts loading React from a CDN again.
The build asserts the ordering.

Result: the document drops from 231,547 to 42,050 bytes gzipped. First visit falls about
10% (207,947 B, since the assets still have to arrive once); every later visit, and every
future edit of the page, costs 42 KB instead of 232 KB because the assets are cached.

| Path | What it is |
|---|---|
| `src/barmm-fiscal-flows.bundle.html` | the design tool's export — the source. Not linked from anywhere. |
| `assets/barmm/dc-runtime.js` | the design-component runtime (69 KB). |
| `assets/barmm/design-system.js` | the `MindanaoDesignSystem_94fd56` component bundle (34 KB). |
| `assets/barmm/react-*.min.js` | React and ReactDOM 18.3.1, served from this origin. |
| `assets/barmm/*.woff2` | Karla and Marcellus, latin and latin-ext subsets. Five of the six load on a typical visit. |

`two-paths-to-work.html` is ordinary hand-written HTML and can be edited normally.

## Deploying

GitHub Pages serves the `main` branch from the repository root. Push to `main` and the
site rebuilds within about a minute. `.nojekyll` is present so Pages serves the files
as-is instead of running them through Jekyll.

## Known remaining work

- `barmm-fiscal-flows.html` keeps its React runtime — it is a real dashboard, not a static
  page, so the landing page's pre-render treatment does not apply. Only its delivery was
  changed. Its design source has never been located; `src/barmm-fiscal-flows.bundle.html`
  is all there is.
- `two-paths-to-work.html` has had no optimization pass.
