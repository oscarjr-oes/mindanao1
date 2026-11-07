#!/usr/bin/env python3
"""Turn the single-file BARMM bundle into an ordinary page plus real asset files.

The export from the design tool is one 463 KB HTML file: every script and font is
gzipped, base64'd and parked in a `__bundler/manifest` script, and a loader in the
outer page decodes them at runtime, mints blob: URLs, substitutes the bare UUIDs in
the inner page, then swaps the whole document.

Nothing about that is needed when the page is served from a normal web server. This
script does the same substitutions at build time and writes the assets out as files,
so the browser fetches them in parallel and caches them.

    python3 tools/build-barmm.py src/barmm-fiscal-flows.bundle.html barmm-fiscal-flows.html

Every substitution asserts. If a fresh export changes shape, this fails loudly
rather than publishing a half-converted page.
"""
import base64, gzip, io, json, os, re, sys

ASSET_DIR = "assets/barmm"

def once(hay, needle, repl, label):
    n = hay.count(needle)
    assert n == 1, f"{label}: expected 1 occurrence, found {n}"
    return hay.replace(needle, repl, 1)

def block(html, kind):
    m = re.search(r'<script type="__bundler/%s"[^>]*>(.*?)</script>' % kind, html, re.S)
    return json.loads(m.group(1)) if m else None

def decode(entry):
    raw = base64.b64decode(entry["data"])
    if entry.get("compressed"):
        raw = gzip.decompress(raw)
    return raw

def font_names(template):
    """uuid -> karla-italic-latin-ext.woff2, from the @font-face blocks themselves."""
    names = {}
    for m in re.finditer(r"@font-face\s*\{(.*?)\}", template, re.S):
        b = m.group(1)
        fam = re.search(r"font-family\s*:\s*'([^']+)'", b)
        url = re.search(r'url\("([0-9a-f-]{36})"\)', b)
        rng = re.search(r"unicode-range\s*:\s*([^;]+);", b)
        if not (fam and url):
            continue
        italic = "italic" in (re.search(r"font-style\s*:\s*([^;]+);", b) or [None, ""])[1]
        # The latin subset starts at U+0000; everything else here is latin-ext.
        subset = "latin" if rng and rng.group(1).strip().startswith("U+0000") else "latin-ext"
        name = "%s%s-%s.woff2" % (fam.group(1).lower(), "-italic" if italic else "", subset)
        prev = names.get(url.group(1))
        assert prev in (None, name), f"font {url.group(1)[:8]} named both {prev} and {name}"
        names[url.group(1)] = name
    return names

def main(src_path, out_path):
    root = os.path.dirname(os.path.abspath(out_path)) or "."
    html = io.open(src_path, encoding="utf-8").read()

    manifest = block(html, "manifest")
    template = block(html, "template")
    ext = block(html, "ext_resources") or []
    pages = block(html, "page_order")
    assert manifest and template, "manifest/template not found"
    assert not pages, f"nested page bundles are not handled: {pages}"

    fonts = font_names(template)
    ext_by_uuid = {e["uuid"]: e["id"] for e in ext}

    # The script in <head> is the dc-runtime; the one further down is the design
    # system bundle. Name them by where they appear rather than by UUID, which
    # changes with every export.
    head_end = template.lower().index("</head>")
    srcs = [m.group(1) for m in re.finditer(r'<script src="([0-9a-f-]{36})"', template)]
    assert len(srcs) == 2, f"expected 2 bundled scripts, found {len(srcs)}"
    in_head = [u for u in srcs if template.index(u) < head_end]
    assert len(in_head) == 1, "expected exactly one script in <head>"
    script_names = {in_head[0]: "dc-runtime.js",
                    [u for u in srcs if u != in_head[0]][0]: "design-system.js"}

    os.makedirs(os.path.join(root, ASSET_DIR), exist_ok=True)
    written, paths = [], {}
    for uuid, entry in manifest.items():
        if uuid in fonts:
            name = fonts[uuid]
        elif uuid in script_names:
            name = script_names[uuid]
        elif uuid in ext_by_uuid:
            # https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js
            #   -> react-dom-18.3.1.min.js
            u = ext_by_uuid[uuid]
            pkg = re.search(r"/((?:@[\w.-]+/)?[\w.-]+)@([\w.-]+)/", u)
            assert pkg, f"cannot name external resource {u}"
            name = "%s-%s.min.js" % (pkg.group(1).replace("@", "").replace("/", "-"), pkg.group(2))
        else:
            raise AssertionError(f"asset {uuid} ({entry.get('mime')}) is referenced by nothing")
        data = decode(entry)
        with open(os.path.join(root, ASSET_DIR, name), "wb") as f:
            f.write(data)
        paths[uuid] = "%s/%s" % (ASSET_DIR, name)
        written.append((name, len(data)))

    # 1. UUID references -> real paths, exactly as the loader did with blob: URLs.
    for uuid, path in paths.items():
        if uuid in ext_by_uuid:
            continue          # reached through window.__resources, not the markup
        n = template.count(uuid)
        assert n > 0, f"{paths[uuid]} is in the manifest but never referenced"
        template = template.replace(uuid, path)

    # 2. The runtime loads React through window.__resources, falling back to
    #    unpkg.com when a URL is not listed. List both, so it never leaves the origin.
    resources = {ext_by_uuid[u]: paths[u] for u in ext_by_uuid}
    res_script = ('<script>window.__resources = %s;</script>'
                  % json.dumps(resources, ensure_ascii=True).replace("</", "<\\/"))

    # 3. SRI hashes belong to the unpkg copies, not ours.
    template = re.sub(r'\s+integrity="[^"]*"', "", template)
    template = re.sub(r'\s+crossorigin="[^"]*"', "", template)

    # 4. The social/analytics tags lived in the bundle's OUTER head, which the
    #    loader threw away once the page rendered. There is only one head now.
    outer_head = html[:html.lower().index("</head>")]
    keep = [t for t in re.findall(r'<meta (?:property|name)="(?:og:|twitter:|description)[^>]*>', outer_head)]
    keep += re.findall(r'<link rel="canonical"[^>]*>', outer_head)
    gtag = re.search(r'<!-- Google tag \(gtag\.js\) -->.*?</script>\s*<script>.*?</script>', outer_head, re.S)
    assert gtag, "GA4 snippet not found in the bundle's outer head"
    assert keep, "no social tags found in the bundle's outer head"
    head_add = "\n" + "\n".join(keep) + "\n" + gtag.group(0) + "\n"
    template = once(template, "</head>", head_add + "</head>", "head injection")

    # 4b. window.__resources must be set BEFORE the dc-runtime script runs: the
    #     runtime reads it when it loads React, and falls back to unpkg.com when
    #     it is missing. Injecting at the end of <head> is too late — the runtime
    #     script is the first thing in there.
    #     It goes after <meta charset> so the encoding declaration stays first.
    anchor = re.search(r"<head[^>]*>\s*<meta charset=[^>]*>", template, re.I) or \
             re.search(r"<head[^>]*>", template, re.I)
    assert anchor, "no <head> in the template"
    i = anchor.end()
    template = template[:i] + "\n" + res_script + template[i:]
    assert template.index(res_script) < template.index('<script src="' + ASSET_DIR), \
        "__resources must come before the runtime script"

    # 5. Nothing may still point at a bare UUID or at the CDN.
    left = re.findall(r'["\(/]([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})["\)]', template)
    assert not left, f"unsubstituted asset references remain: {sorted(set(left))}"
    assert "__bundler" not in template, "bundler scaffolding leaked into the page"
    assert "unpkg.com" not in template.replace(res_script, ""), "a CDN URL survives outside __resources"

    io.open(out_path, "w", encoding="utf-8").write(template)

    total = sum(n for _, n in written)
    print("wrote %s (%d B, was %d B)" % (out_path, len(template.encode()), len(html.encode())))
    print("%d assets, %d B, in %s/:" % (len(written), total, ASSET_DIR))
    for name, n in sorted(written, key=lambda r: -r[1]):
        print("  %-28s %8d" % (name, n))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
