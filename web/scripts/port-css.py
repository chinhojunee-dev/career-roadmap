"""시안 CSS(bundle/links/career-roadmap) 중 5개 화면에서 실제로 쓰는 규칙만 골라 src/styles/design.css 로 옮긴다.
토큰(:root/.pf-root 의 --변수 정의)은 tokens.css 가 원본이므로 여기서는 제거한다."""
import re, sys, json, pathlib
H = pathlib.Path(sys.argv[1]); OUT = pathlib.Path(sys.argv[2])

def blocks(css):
    """top-level 블록 리스트 [(prelude, body or None)]"""
    out, i, n = [], 0, len(css)
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
    n = len(css)
    while i < n:
        while i < n and css[i].isspace(): i += 1
        if i >= n: break
        j = i
        while j < n and css[j] not in '{;': j += 1
        if j >= n: break
        if css[j] == ';':
            out.append((css[i:j].strip(), None)); i = j + 1; continue
        d, k = 1, j + 1
        while k < n and d:
            if css[k] == '{': d += 1
            elif css[k] == '}': d -= 1
            k += 1
        out.append((css[i:j].strip(), css[j + 1:k - 1])); i = k
    return out

# 사용 클래스: 시안 화면 10개 파일에 등장하는 단어 중 css 에 클래스로 있는 것
src_html = ''.join((H / f).read_text(encoding='utf-8') for f in H.glob('CR_*.dc.html') for f in [f.name])
words = set(re.findall(r'[A-Za-z][A-Za-z0-9_-]*', src_html))
EXTRA = {'pf-root'}
used = words | EXTRA
SKIP = re.compile(r'\b(sup|doc-status|draft|q0|lp|jobs|kanban|mindmap|exp-list|tbl|modal|essay)')

def ok_sel(sel):
    cls = re.findall(r'\.([A-Za-z_][\w-]*)', sel)
    if any(SKIP.match(c) for c in cls): return False
    return all(c in used for c in cls)

def filt_rule(prelude, body):
    sels = [s.strip() for s in re.split(r',(?![^(]*\))', prelude)]
    keep = [s for s in sels if ok_sel(s)]
    if not keep: return None
    # 토큰 정의(--변수) 제거
    decl = re.sub(r'(^|;)\s*--[\w-]+\s*:[^;]+', r'\1', body).strip().strip(';').strip()
    if not decl: return None
    return ',\n'.join(keep) + ' {\n  ' + re.sub(r'\s*;\s*', ';\n  ', decl).strip() + ';\n}' if not decl.endswith(';') else ',\n'.join(keep) + ' {\n  ' + decl + '\n}'

kf_used = set()
parts = []
for fn in ['ds/introtyche/components/bundle.css', 'links.css', 'career-roadmap.css']:
    parts.append(f'/* ── {fn} ── */')
    for pre, body in blocks((H / fn).read_text(encoding='utf-8')):
        if body is None or pre.startswith('@import'): continue
        if pre.startswith('@keyframes'):
            parts.append(('KF', pre, body)); continue
        if pre.startswith('@font-face'): continue
        if pre.startswith('@media') or pre.startswith('@supports'):
            inner = []
            for p2, b2 in blocks(body):
                if b2 is None: continue
                r = filt_rule(p2, b2)
                if r: inner.append('  ' + r.replace('\n', '\n  '))
            if inner: parts.append(pre + ' {\n' + '\n'.join(inner) + '\n}')
            continue
        r = filt_rule(pre, body)
        if r: parts.append(r)

text_rules = [p for p in parts if isinstance(p, str)]
joined = '\n'.join(text_rules)
kf = []
for p in parts:
    if isinstance(p, tuple):
        name = p[1].split()[1]
        if re.search(r'animation[^;]*\b' + re.escape(name) + r'\b', joined): kf.append(f'{p[1]} {{{p[2]}}}')
css = '/* 자동 생성 — scripts/port-css.py (시안 CSS 중 사용 규칙만). 색·간격은 tokens.css 변수를 참조합니다. */\n' + joined + '\n' + '\n'.join(kf) + '\n'

# ── 색 리터럴 → 토큰 치환 (토큰과 같은 값이거나 가장 가까운 토큰). 흰색(#fff, oklch(100% 0 0 / a))은 토큰이 없어 유지.
MIX = lambda tok, a: f'color-mix(in oklch, var(--{tok}) {a}%, transparent)'
SUBS = {
  'oklch(70% 0.02 250 / 0.4)': MIX('neutral-500', 40), 'oklch(70% 0.02 250 / 0.22)': MIX('neutral-500', 22),
  'oklch(70% 0.02 250 / 0.45)': MIX('neutral-500', 45), 'oklch(70% 0.02 250 / 0.42)': MIX('neutral-500', 42),
  'oklch(63% 0.03 250 / 0.6)': MIX('neutral-500', 60),
  'oklch(62% 0.19 253 / 0.45)': MIX('selected', 45), 'oklch(62% 0.19 253)': 'var(--selected)',
  'oklch(23% 0.006 260)': 'var(--surface-2)', 'oklch(92% 0.004 260)': 'var(--neutral-900)',
  'oklch(70% 0.15 253)': 'var(--blue-400)', 'oklch(70% 0.01 260)': 'var(--neutral-500)', 'oklch(55% 0.01 260)': 'var(--neutral-500)',
  'oklch(28% 0.008 260 / 0.7)': MIX('border', 70), 'oklch(37% 0.008 260 / 0.6)': MIX('border-strong', 60),
  'oklch(83% 0.09 248 / 0.30)': MIX('blue-200', 30), 'oklch(82% 0.03 250 / 0.5)': MIX('border-strong', 50),
  'oklch(70% 0.15 248)': 'var(--blue-300)', 'oklch(20% 0.05 250 / 0.4)': MIX('blue-1000', 40),
  'oklch(20% 0.02 250 / 0.38)': MIX('blue-1000', 38),
}
for k, v in SUBS.items(): css = css.replace(k, v)
OUT.write_text(css, encoding='utf-8')
print(len(css), 'bytes', len(text_rules), 'rules', len(kf), 'keyframes')
