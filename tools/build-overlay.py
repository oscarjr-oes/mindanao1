#!/usr/bin/env python3
"""Build data/landas-overlay.webp from the lossless master in src/.

The overlay is the LANDAS masterplan illustration that two-paths-to-work.html
composites under the Parang road network at 50% opacity. It is never zoomed and
never panned: drawRoads() paints it into a fixed rectangle derived from
sitesData.overlayBox and the Parang projection, so there is a hard ceiling on
how many pixels of it can ever reach a screen. That ceiling -- not the master's
resolution -- is what the shipped file should be sized to.

    python3 tools/build-overlay.py            # write data/landas-overlay.webp
    python3 tools/build-overlay.py --check    # report, write nothing

Reads src/, writes data/. It never consumes its own output, so running it twice
is a no-op; see the ASSERTIONS below, which refuse to write rather than quietly
ship a wrong overlay.
"""

import json
import math
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SRC = "src/landas-overlay.master.webp"
OUT = "data/landas-overlay.webp"

# The shipped size. 896x560 is the smallest round size at or above MAX_DRAWN
# (see below), so the overlay is never upscaled on any display, and is
# downscaled -- which costs nothing visible -- on every realistic one.
OUT_W, OUT_H = 896, 560

# libwebp quality. Measured against the master, composited at 50% opacity over
# the page's own background gradient, q80 costs RMS 1.6/255 at 1920x1080 DPR 2
# and 2.2/255 at the ceiling below. Re-encoding at the master's own size
# already costs 0.9, so most of that is the floor, not the resize.
QUALITY = 80
METHOD = 6  # slowest/densest libwebp search; equivalent to `cwebp -m 6`

# The largest canvas the Parang pane can have: an Apple Pro Display XDR
# (6016x3384, DPR 2 -> 3008x1692 CSS) with the window maximised. The pane is
# half the window wide and everything below the controls tall, which measured
# 1469 CSS px at that height. Anything larger than this does not exist.
MAX_CANVAS_W, MAX_CANVAS_H = 3008, 2938

PAD = 40  # projectRoads() in two-paths-to-work.html

# How far the overlay's aspect ratio may sit from the aspect ratio of the
# geographic box it is stretched across before the two have stopped describing
# the same ground.
ASPECT_TOLERANCE = 0.01


def read_js_object(rel_path, var_hint):
    """Pull the single JSON object out of one of the data/*.js assignments."""
    with open(os.path.join(ROOT, rel_path)) as fh:
        text = fh.read()
    if var_hint not in text:
        raise SystemExit("%s does not look like the expected data file" % rel_path)
    return json.loads(text[text.index("{"):text.rindex("}") + 1])


def max_drawn_size(box, bounds):
    """Overlay size in device pixels at MAX_CANVAS -- projectRoads(), inlined.

    Kept deliberately literal so it can be diffed against the page's own
    function rather than trusted.
    """
    mid_lat = (bounds["minLat"] + bounds["maxLat"]) / 2
    cos_ml = math.cos(math.radians(mid_lat))
    w = MAX_CANVAS_W - PAD * 2
    h = MAX_CANVAS_H - PAD * 2
    lon_span = bounds["maxLon"] - bounds["minLon"]
    lat_span = bounds["maxLat"] - bounds["minLat"]
    scale = min(w / (lon_span * cos_ml), h / lat_span)
    return ((box["E"] - box["W"]) * cos_ml * scale,
            (box["N"] - box["S"]) * scale)


def main():
    check_only = "--check" in sys.argv[1:]

    sites = read_js_object("data/sites.js", "window.sitesData")
    roads = read_js_object("data/parang-roads.js", "window.parangRoads")
    box, bounds = sites["overlayBox"], roads["bounds"]

    src_path = os.path.join(ROOT, SRC)
    out_path = os.path.join(ROOT, OUT)
    master = Image.open(src_path).convert("RGBA")
    mw, mh = master.size

    # -- ASSERTIONS -------------------------------------------------------
    # 1. The source is the master, not a previous build. Without this the
    #    script would happily re-encode its own lossy output and lose a little
    #    more of the illustration on every run.
    assert (mw, mh) > (OUT_W, OUT_H), (
        "%s is %dx%d, no larger than the %dx%d output; it looks like built "
        "output, not the master" % (SRC, mw, mh, OUT_W, OUT_H))

    # 2. The image and the geographic box it is stretched across have to
    #    describe the same ground. drawImage() distorts silently, so a
    #    replacement master that is cropped or re-framed would simply render
    #    the masterplan in the wrong place with nothing to show for it.
    mid_lat = (box["N"] + box["S"]) / 2
    box_aspect = (((box["E"] - box["W"]) * math.cos(math.radians(mid_lat)))
                  / (box["N"] - box["S"]))
    img_aspect = mw / mh
    skew = abs(img_aspect - box_aspect) / box_aspect
    assert skew <= ASPECT_TOLERANCE, (
        "%s is %.4f wide-to-tall but sitesData.overlayBox is %.4f (%.2f%% "
        "apart); the image would be stretched off its own ground. Re-frame "
        "the master, or update overlayBox to match it."
        % (SRC, img_aspect, box_aspect, skew * 100))

    # 3. The output is never smaller than the largest rectangle the page can
    #    draw it into, so no display ever upscales it.
    drawn_w, drawn_h = max_drawn_size(box, bounds)
    assert OUT_W >= drawn_w and OUT_H >= drawn_h, (
        "%dx%d is below the %.0fx%.0f the page can draw at MAX_CANVAS; the "
        "overlay would be upscaled on a large display"
        % (OUT_W, OUT_H, drawn_w, drawn_h))
    # ---------------------------------------------------------------------

    before = os.path.getsize(out_path) if os.path.exists(out_path) else 0
    resized = master.resize((OUT_W, OUT_H), Image.LANCZOS)

    print("master      %s  %dx%d  %d B" % (SRC, mw, mh, os.path.getsize(src_path)))
    print("max drawn   %.0fx%.0f px at a %dx%d canvas"
          % (drawn_w, drawn_h, MAX_CANVAS_W, MAX_CANVAS_H))
    print("headroom    %.2fx wide, %.2fx tall" % (OUT_W / drawn_w, OUT_H / drawn_h))
    print("aspect      image %.4f vs overlayBox %.4f (%.2f%% apart)"
          % (img_aspect, box_aspect, skew * 100))

    if check_only:
        print("--check: nothing written")
        return

    resized.save(out_path, format="WEBP", quality=QUALITY, method=METHOD)
    after = os.path.getsize(out_path)
    print("wrote       %s  %dx%d  q%d  %d B (was %d, %+.1f%%)"
          % (OUT, OUT_W, OUT_H, QUALITY, after, before,
             (after - before) / before * 100 if before else 0))


if __name__ == "__main__":
    main()
