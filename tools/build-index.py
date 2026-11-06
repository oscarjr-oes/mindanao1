import io, os, re, sys
src, fontcss, out = sys.argv[1], sys.argv[2], sys.argv[3]
s = io.open(src, encoding='utf-8').read()
css = io.open(fontcss, encoding='utf-8').read().strip()

def once(hay, needle, repl, label):
    n = hay.count(needle)
    assert n == 1, f'{label}: expected 1 occurrence, found {n}'
    return hay.replace(needle, repl, 1)

# ---- 1. real <head>: title, meta, GA4, icons, social cards, self-hosted fonts ----
DESC = ('Oscar Sarmiento, Jr. — Chief Operations Officer for Mindanao, strategist and '
        'dreamer for what the region can become. Projects, writing and video on Mindanao and BARMM.')
BASE = 'https://oscarjr-oes.github.io/mindanao1/'
head = f'''<title>Oscar Sarmiento, Jr. — Mindanao One</title>
<meta name="description" content="{DESC}">
<link rel="canonical" href="{BASE}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta property="og:site_name" content="Mindanao One">
<meta property="og:title" content="Oscar Sarmiento, Jr. — Mindanao One">
<meta property="og:description" content="{DESC}">
<meta property="og:type" content="website">
<meta property="og:url" content="{BASE}">
<meta property="og:image" content="{BASE}og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Banwag, a bamboo geodesic dome in Mindanao, backlit by the sun">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Oscar Sarmiento, Jr. — Mindanao One">
<meta name="twitter:description" content="{DESC}">
<meta name="twitter:image" content="{BASE}og-image.jpg">

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-VR211482VE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-VR211482VE');
</script>

<!-- Fonts are self-hosted (Latin + Latin-Ext only) so the page makes no third-party
     font request and starts loading them before support.js runs. -->
<style>
{css}
</style>
<script src="support.js"></script>'''
s = once(s, '<script src="./support.js"></script>', head, 'head injection')

# ---- 2. drop the Google Fonts request from <helmet> (now self-hosted above) ----
s = once(s,
 '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
''', '', 'google fonts link')

# ---- 3. jpg -> webp ----
for n in ['portrait', 'dome-exterior', 'dome-ceiling-1', 'dome-ceiling-2']:
    s = s.replace(f'assets/{n}.jpg', f'assets/{n}.webp')
assert 'assets/' not in s or not re.search(r'assets/[^"\')]*\.jpg', s), 'an assets/*.jpg reference survived'

# ---- 4. lazy-load everything below the fold ----
for marker in ['<img src="assets/portrait.webp"',
               '<img src="assets/dome-ceiling-1.webp"',
               '<img src="assets/dome-exterior.webp"']:
    s = once(s, marker, marker.replace('<img ', '<img loading="lazy" decoding="async" '), 'lazy ' + marker)
# footer logo (second of the two) — the header one must stay eager
i = s.rindex('<img src="assets/logo.png"')
s = s[:i] + '<img loading="lazy" decoding="async" ' + s[i+len('<img '):]

# ---- 5. only one hero video ships, so pin both branches to it ----
s = once(s,
 "const heroSrc = (this.props.heroVideo === 'Banwag II') ? 'assets/banwag2.mp4' : 'assets/banwag.mp4';",
 "// Only Banwag I ships with the site: assets/banwag2.mp4 lives in the design project\n"
 "    // but is not deployed, so both prop values resolve to the one asset that exists.\n"
 "    // To switch, copy assets/banwag2.mp4 out of the design project and change this line.\n"
 "    const heroSrc = 'assets/banwag.mp4';",
 'heroSrc pin')


# ---- 6. resolve the hero <source> in the markup itself. The browser's preload
#         scanner reads src before support.js can substitute {{ heroSrc }}, so a
#         template placeholder there costs a wasted 404 on every single load.
s = once(s, '<source src="{{ heroSrc }}" type="video/mp4">',
            '<source src="assets/banwag.mp4" type="video/mp4">', 'hero source literal')

io.open(out, 'w', encoding='utf-8').write(s)
print('wrote', out, os.path.getsize(out), 'bytes')
