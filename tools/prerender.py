#!/usr/bin/env python3
"""Turn the built index.html into static HTML that needs no design runtime.

Second stage after tools/build-index.py. The design export renders in the browser:
<x-dc> plus support.js plus React build the body at runtime, so the served HTML has
an empty shell and crawlers see nothing. The component's logic is small and fully
known, so instead of shipping a framework to produce that markup we resolve it here
and hand the few interactive bits to ~50 lines of vanilla JS.

Removes, per page load: support.js (54 KB) + React and ReactDOM (143 KB).

Every substitution asserts, so a changed export fails loudly instead of silently
producing a half-converted page.
"""
import io, re, sys

src, out = sys.argv[1], sys.argv[2]
s = io.open(src, encoding='utf-8').read()

def once(hay, needle, repl, label):
    n = hay.count(needle)
    assert n == 1, f'{label}: expected 1 occurrence, found {n}'
    return hay.replace(needle, repl, 1)

assert 'class=' not in s, 'source gained class attributes; the hover rewrite assumes none'
assert '<x-dc>' in s, 'not a design export — nothing to pre-render'

# ---- 1. resolve the remaining template bindings to their only possible values ----
# accent: prop "Bamboo green" (the default, and what is deployed) -> #2f6b3d
s = once(s, '--accent: {{ accentColor }}', '--accent: #2f6b3d', 'accentColor')
# the contact modal starts closed
s = once(s, 'display: {{ contactDisplay }}', 'display: none', 'contactDisplay')
s = once(s, '{{ copyLabel }}', 'Copy', 'copyLabel')

# ---- 2. refs and handlers become ids and data-act hooks ----
for old, new, label in [
    (' ref="{{ rootRef }}"',  '',                            'rootRef'),
    (' ref="{{ nameRef }}"',  ' id="dc-name"',               'nameRef'),
    (' ref="{{ msgRef }}"',   ' id="dc-msg"',                'msgRef'),
    (' ref="{{ emailRef }}"', ' id="dc-email"',              'emailRef'),
    ('<form onSubmit="{{ submitContact }}">', '<form id="dc-form">', 'form'),
    (' onClick="{{ openContact }}"', ' data-act="open"',      'openContact'),
    (' onClick="{{ copyEmail }}"',   ' id="dc-copy" data-act="copy"', 'copyEmail'),
]:
    s = once(s, old, new, label)
n = s.count(' onClick="{{ closeContact }}"')
assert n == 2, f'closeContact: expected 2, found {n}'
s = s.replace(' onClick="{{ closeContact }}"', ' data-act="close"')
# the modal shell itself, so the script can show and hide it
s = once(s, '<div style="position:fixed; inset:0; z-index:60; display: none;',
            '<div id="dc-contact" style="position:fixed; inset:0; z-index:60; display: none;', 'modal id')

left = re.findall(r'\{\{[^}]*\}\}', s)
assert not left, f'unresolved bindings remain: {left}'

# ---- 3. style-hover="..." -> a real CSS class, since nothing rewrites it at runtime ----
hover_rules, counter = [], [0]
def to_class(m):
    counter[0] += 1
    cls = f'dh{counter[0]}'
    hover_rules.append(f'.{cls}:hover{{{m.group(3)}}}')
    return f'<{m.group(1)} class="{cls}"{m.group(2)}{m.group(4)}>'
s, nsub = re.subn(r'<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)\s*style-hover="([^"]*)"([^>]*?)>', to_class, s)
assert nsub == 19, f'style-hover: expected 19 rewrites, got {nsub}'
assert 'style-hover' not in s

# ---- 4. unwrap the custom elements; the helmet styles move into the real head ----
helmet = re.search(r'<helmet>(.*?)</helmet>\s*', s, re.S)
assert helmet, 'no <helmet> block'
s = s.replace(helmet.group(0), '')
s = once(s, '<x-dc>\n', '', 'x-dc open')
s = once(s, '</x-dc>', '', 'x-dc close')

# ---- 5. drop the runtime and the component, add the vanilla replacement ----
s = once(s, '<script src="support.js"></script>', '', 'support.js tag')
comp = re.search(r'<script type="text/x-dc".*?</script>\s*', s, re.S)
assert comp, 'no component script'
s = s.replace(comp.group(0), '')

RUNTIME = '''<script>
// Replaces the design runtime: the same behaviour the component had, without React.
(function () {
  // Assembled rather than written out, so the address is never in the served HTML.
  var EMAIL = ['oscar.jr', 'pssarmiento.com'].join('@');
  var modal = document.getElementById('dc-contact');
  var emailEl = document.getElementById('dc-email');
  var copyBtn = document.getElementById('dc-copy');
  if (emailEl) emailEl.textContent = EMAIL;

  function setOpen(on) {
    if (modal) modal.style.display = on ? 'flex' : 'none';
    if (!on && copyBtn) copyBtn.textContent = 'Copy';
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
    if (!t) return;
    var act = t.getAttribute('data-act');
    if (act === 'open') { e.preventDefault(); setOpen(true); }
    else if (act === 'close') { setOpen(false); }
    else if (act === 'copy') {
      try { if (navigator.clipboard) navigator.clipboard.writeText(EMAIL); } catch (err) {}
      t.textContent = 'Copied!';
    }
  });

  var form = document.getElementById('dc-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nameEl = document.getElementById('dc-name');
    var msgEl = document.getElementById('dc-msg');
    var name = ((nameEl && nameEl.value) || '').trim();
    var msg = ((msgEl && msgEl.value) || '').trim();
    var subject = encodeURIComponent('Hello from pssarmiento.com' + (name ? ' \\u2014 ' + name : ''));
    var body = encodeURIComponent(msg + (name ? '\\n\\n\\u2014 ' + name : ''));
    window.location.href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
  });

  // Reveal on scroll, same thresholds the design runtime used. Content is in the
  // HTML either way, so without JS or IntersectionObserver it simply stays visible.
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length || !('IntersectionObserver' in window)) return;
  Array.prototype.forEach.call(els, function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(26px)';
    el.style.transition = 'opacity .85s cubic-bezier(.2,.7,.2,1), transform .85s cubic-bezier(.2,.7,.2,1)';
    el.style.willChange = 'opacity, transform';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.style.transitionDelay = (el.getAttribute('data-reveal-delay') || 0) + 'ms';
      el.style.opacity = '1';
      el.style.transform = 'none';
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  Array.prototype.forEach.call(els, function (el) { io.observe(el); });
})();
</script>
'''
s = once(s, '</body>', RUNTIME + '</body>', 'runtime insert')

# ---- 6. put the page's own styles, and the hover rules, in the head ----
head_css = helmet.group(1).strip() + '\n<style>\n' + '\n'.join(hover_rules) + '\n</style>\n'
s = once(s, '</head>', head_css + '</head>', 'head css')

s = re.sub(r'\n{3,}', '\n\n', s)
io.open(out, 'w', encoding='utf-8').write(s)
print(f'wrote {out}  ({len(s.encode())} bytes)  hover rules: {len(hover_rules)}')
