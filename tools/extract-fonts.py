import json, re, os, sys, base64
src = sys.argv[1]; out = sys.argv[2]
lines = open(src, encoding='utf-8', errors='replace').read().split('\n')
ai = pi = None
for i,l in enumerate(lines):
    t = l.lstrip()
    if ai is None and t.startswith('{"') and '"compressed"' in t: ai = i
    if pi is None and t.startswith('"<!DOCTYPE html>'): pi = i
amap = json.loads(lines[ai]); page = json.loads(lines[pi])
print('assets:', len(amap), 'page chars:', len(page))
faces = re.findall(r'@font-face\s*\{.*?\}', page, re.S)
print('@font-face rules:', len(faces))
UU = re.compile(r'[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}|[0-9a-f]{32}')
os.makedirs(os.path.join(out,'assets','fonts'), exist_ok=True)
seen = {}
css = []
for f in faces:
    fam = re.search(r"font-family:\s*['\"]?([^;'\"]+)", f).group(1).strip()
    wt  = (re.search(r'font-weight:\s*([^;]+)', f) or [None,'400'])[1].strip()
    sty = (re.search(r'font-style:\s*([^;]+)', f) or [None,'normal'])[1].strip()
    ur  = (re.search(r'unicode-range:\s*([^;}]+)', f) or [None,''])[1].strip()
    ids = UU.findall(f)
    if not ids: print('  !! no asset in face', fam, wt, sty); continue
    aid = ids[0]
    if aid not in amap: print('  !! missing asset', aid); continue
    if aid not in seen:
        ent = amap[aid]
        data = base64.b64decode(ent['data'])
        if ent.get('compressed'):
            import gzip, zlib
            try: data = gzip.decompress(data)
            except Exception: data = zlib.decompress(data)
        slug = re.sub(r'[^a-z0-9]+','-', fam.lower()).strip('-')
        n = sum(1 for k,v in seen.items() if v.startswith(slug))
        name = f'{slug}-{len(seen):02d}.woff2'
        open(os.path.join(out,'assets','fonts',name),'wb').write(data)
        seen[aid] = name
        print(f'  wrote assets/fonts/{name:34} {len(data):7} B   {fam} {wt} {sty}')
    rule = "@font-face{font-family:'%s';font-style:%s;font-weight:%s;font-display:swap;src:url('assets/fonts/%s') format('woff2');" % (fam, sty, wt, seen[aid])
    if ur: rule += 'unicode-range:%s;' % ur
    css.append(rule + '}')
open(os.path.join(out,'fonts.css'),'w').write('\n'.join(css)+'\n')
print('faces written:', len(css), 'distinct files:', len(seen))
print('total font bytes:', sum(os.path.getsize(os.path.join(out,'assets','fonts',n)) for n in set(seen.values())))
