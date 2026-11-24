// ds/introtyche/tokens.json → src/styles/tokens.css
// 색·폰트·간격·라운드·그림자는 이 파일에서 만든 CSS 변수만 쓴다. (직접 값 금지)
import { readFileSync, writeFileSync } from 'node:fs';

const src = JSON.parse(readFileSync(new URL('../ds/introtyche/tokens.json', import.meta.url), 'utf8'));
const ref = (v) => v.replace(/\{([a-z0-9-]+)\}/g, 'var(--$1)');
const light = [];
const dark = [];

for (const t of src.color.tokens) {
  if (typeof t.value === 'string') {
    light.push(`  --${t.name}: ${ref(t.value)};`);
  } else {
    light.push(`  --${t.name}: ${ref(t.value.light)};`);
    if (t.value.dark !== t.value.light) dark.push(`  --${t.name}: ${ref(t.value.dark)};`);
  }
}
for (const [k, v] of Object.entries(src.type.families)) light.push(`  --font-${k}: ${v};`);
for (const t of src.spacing.tokens) light.push(`  --${t.name}: ${t.value};`);
for (const t of src.radius.tokens) light.push(`  --${t.name}: ${t.value};`);
for (const t of src.shadow.tokens) light.push(`  --${t.name}: ${t.value};`);

const css = `/* 자동 생성 파일 — 직접 고치지 마세요. 원본: ds/introtyche/tokens.json (npm run tokens) */
:root {
  color-scheme: light;
${light.join('\n')}
}
:root[data-theme="dark"] {
  color-scheme: dark;
${dark.join('\n')}
}
`;
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), css);
console.log(`tokens.css: light ${light.length} · dark overrides ${dark.length}`);
