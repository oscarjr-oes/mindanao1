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

## Editing `index.html` and `barmm-fiscal-flows.html` — read this first

These two are **single-file exports from a design tool**, not hand-written HTML. Each one
is a self-contained bundle:

- a normal `<head>` and an unpacking script at the top — safe to edit by hand;
- **one very long line holding a JSON asset map**, `{"<uuid>": {"mime", "compressed", "data": "<base64>"}}`;
- **one very long line holding the real page**, as a JSON-encoded HTML string, where assets
  are referenced by bare UUID (`src="1f1e8aee-…"`).

On load the script decodes each asset into a `blob:` URL, rewrites those UUID references,
and replaces `document.documentElement` with the unpacked page.

Two consequences:

1. **Never run `sed`, `awk` or line-based regex against those two long lines.** Parse the
   JSON, mutate it, re-serialize it. Locate the lines by content (longest line; the line
   beginning `"<!DOCTYPE html>`), not by a hardcoded line number — a re-export moves them.
2. Anything that must survive the unpack — the `<title>`, favicon links — has to exist in
   **both** the outer head and the inner page's head. Open Graph tags only need to be in
   the outer head, since scrapers read the served HTML and never run the script.

`two-paths-to-work.html` is ordinary hand-written HTML and can be edited normally.

## Deploying

GitHub Pages serves the `main` branch from the repository root. Push to `main` and the
site rebuilds within about a minute. `.nojekyll` is present so Pages serves the files
as-is instead of running them through Jekyll.

## Known remaining work

See `MINDANAO1_OPTIMIZATION_PLAN.md` notes, if you have them, or in short:

- `index.html` still embeds ~4.4 MB of media; both hero videos download although only one
  is shown. Moving media to real files would cut first-view transfer to roughly 2.0–2.5 MB.
- About 120 KB of Cyrillic, Greek and Vietnamese font subsets are embedded and unused.
- The page is built in the browser, so the served HTML carries no body content for
  crawlers or link-preview scrapers.
