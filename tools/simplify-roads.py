#!/usr/bin/env python3
"""Build data/*-roads.js from the full-precision extracts in src/.

The OSM extracts carry 7 decimal places (about 1 cm) and every vertex the
survey recorded. two-paths-to-work.html draws them with a fixed fit-to-bounds
projection and offers no zoom or pan, so there is a hard ceiling on how much
of that detail can ever reach a pixel. This drops the rest:

  * Douglas-Peucker in projected space, with the tolerance expressed in
    device pixels at the largest canvas the page can ever get.
  * Coordinates rounded to 5 decimals (~1.1 m), well under a device pixel at
    that same scale.

A simplified polyline is shorter than the surveyed one, and the sidebar
quotes real-world figures off this geometry ("Parang total road length:
128.6 km", "pedestrian network: 4006m"). Shaving a hundred metres off a
published number to save bytes is not a trade worth making, so each road
carries an `m` field: its length in metres, measured on the src/ points
before anything is dropped. analyzeNetwork() prefers that field, and so
reports the surveyed length exactly rather than whatever the drawing
geometry happens to add up to. The page still falls back to measuring the
points when the field is absent, so un-simplified data keeps working.

Road lengths also feed the traffic model (distributeAndCongest), which works
in projected pixels, so the build refuses to run if simplifying moves a
dataset's total by more than MAX_TOTAL_DRIFT, or if any road crosses the
`length > 15` filter the renderer applies.

Reading from src/ rather than from data/ is what makes this idempotent: the
build never consumes its own output, so it cannot simplify twice or
re-measure `m` against points it has already thrown away.

    python3 tools/simplify-roads.py            # rebuild data/*-roads.js
    python3 tools/simplify-roads.py --check    # report, write nothing
"""
import json
import math
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# source (full precision, never edited by this script) -> built output
BUILDS = (
    ("src/orc-roads.full.js", "data/orc-roads.js"),
    ("src/parang-roads.full.js", "data/parang-roads.js"),
)

# Tolerance, in device pixels, at the largest canvas the page can produce.
TOLERANCE_PX = 0.25
DECIMALS = 5

# projectRoads() in two-paths-to-work.html
PAD = 40
# Each map is one of two side-by-side panes. Assume a whole 1920x1080 window
# given to a single pane at devicePixelRatio 2 -- generous by about a factor
# of two horizontally, so the real scale is always smaller than this and the
# real error smaller still.
CANVAS_W, CANVAS_H = 1920, 2160

MAX_TOTAL_DRIFT = 0.005   # 0.5% of a dataset's summed road length
LENGTH_FILTER_PX = 15     # drawVehicles(): shorter roads are not drawn


def load(path):
    with open(path, encoding="utf-8") as fh:
        text = fh.read()
    m = re.match(r"\s*window\.(\w+)\s*=\s*(.*?);?\s*$", text, re.S)
    assert m, "%s: expected a single `window.X = {...};` assignment" % path
    return m.group(1), json.loads(m.group(2))


def scale_for(bounds):
    """Device pixels per degree of latitude, matching projectRoads()."""
    cos_ml = math.cos(math.radians((bounds["minLat"] + bounds["maxLat"]) / 2))
    lon_span = bounds["maxLon"] - bounds["minLon"]
    lat_span = bounds["maxLat"] - bounds["minLat"]
    return min((CANVAS_W - PAD * 2) / (lon_span * cos_ml),
               (CANVAS_H - PAD * 2) / lat_span), cos_ml


def rdp(pts, eps):
    """Douglas-Peucker, iterative so a long road cannot blow the stack."""
    if len(pts) < 3:
        return list(pts)
    keep = [False] * len(pts)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        ax, ay = pts[i]
        bx, by = pts[j]
        dx, dy = bx - ax, by - ay
        den = math.hypot(dx, dy)
        best, best_i = -1.0, -1
        for k in range(i + 1, j):
            px, py = pts[k]
            if den:
                d = abs(dx * (ay - py) - dy * (ax - px)) / den
            else:
                d = math.hypot(px - ax, py - ay)
            if d > best:
                best, best_i = d, k
        if best > eps:
            keep[best_i] = True
            stack.append((i, best_i))
            stack.append((best_i, j))
    return [p for p, k in zip(pts, keep) if k]


def geo_length_m(pts):
    """Metres along a lon/lat polyline -- computeGeoLength() in the page."""
    total = 0.0
    for (alon, alat), (blon, blat) in zip(pts, pts[1:]):
        dlat = (blat - alat) * 111320
        dlon = (blon - alon) * 111320 * math.cos(math.radians(blat))
        total += math.hypot(dlat, dlon)
    return total


def polyline_px(pts, scale):
    return sum(math.hypot(b[0] - a[0], b[1] - a[1])
               for a, b in zip(pts, pts[1:])) * scale


def build(src_rel, out_rel, check_only):
    src = os.path.join(ROOT, src_rel)
    out = os.path.join(ROOT, out_rel)
    var, data = load(src)
    bounds = data["bounds"]
    scale, cos_ml = scale_for(bounds)
    eps = TOLERANCE_PX / scale

    assert not any("m" in r for r in data["roads"]), \
        "%s already carries `m`; it looks like built output, not a source" % src_rel

    roads_out = []
    before_total = after_total = 0.0
    n_before = n_after = 0
    crossed = []
    for road in data["roads"]:
        # Projected space, so the tolerance really is pixels.
        flat = [(lon * cos_ml, lat) for lon, lat in road["pts"]]
        kept = rdp(flat, eps)
        rounded = [[round(x / cos_ml, DECIMALS), round(y, DECIMALS)]
                   for x, y in kept]
        assert len(rounded) >= min(2, len(road["pts"])), \
            "a road was reduced below two points"
        roads_out.append({
            "type": road["type"],
            # The surveyed length, measured before any point is dropped.
            "m": round(geo_length_m(road["pts"]), 1),
            "pts": rounded,
        })

        final = [(lon * cos_ml, lat) for lon, lat in rounded]
        lb = polyline_px(flat, scale)
        la = polyline_px(final, scale)
        before_total += lb
        after_total += la
        n_before += len(road["pts"])
        n_after += len(rounded)
        if (lb > LENGTH_FILTER_PX) != (la > LENGTH_FILTER_PX):
            crossed.append((road["type"], lb, la))

    drift = (after_total - before_total) / before_total
    assert abs(drift) <= MAX_TOTAL_DRIFT, \
        "%s: total road length moved %.3f%%, over the %.1f%% ceiling" % (
            out_rel, 100 * drift, 100 * MAX_TOTAL_DRIFT)
    assert not crossed, \
        "%s: %d road(s) crossed the length>%d render filter: %r" % (
            out_rel, len(crossed), LENGTH_FILTER_PX, crossed[:3])

    js = "window.%s = %s;\n" % (var, json.dumps(
        {"bounds": bounds, "roads": roads_out}, separators=(",", ":")))

    old = os.path.getsize(out) if os.path.exists(out) else 0
    print("%-22s -> %-22s %5d -> %5d pts (-%2.0f%%)  %7d -> %7d B  "
          "length %+.3f%%  %.2f px at %.0f px/deg"
          % (src_rel, out_rel, n_before, n_after,
             100 * (1 - n_after / n_before), old, len(js.encode()),
             100 * drift, TOLERANCE_PX, scale))
    if not check_only:
        with open(out, "w", encoding="utf-8") as fh:
            fh.write(js)


def main():
    check_only = "--check" in sys.argv[1:]
    for src_rel, out_rel in BUILDS:
        build(src_rel, out_rel, check_only)
    print("checked only, nothing written" if check_only else "written")


if __name__ == "__main__":
    main()
