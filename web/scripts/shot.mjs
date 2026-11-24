// 시안 캡처(1440×900 @2x)와 같은 조건으로 화면을 찍는다.  node scripts/shot.mjs <outDir> [baseUrl]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
const out = process.argv[2]; const base = process.argv[3] || 'http://127.0.0.1:3100';
mkdirSync(out, { recursive: true });
const SHOTS = [['1_profile-input', '/onboarding'], ['2_goal-profile', '/goal'], ['3_current-status', '/dashboard'], ['4_semester-roadmap', '/roadmap'], ['5_activities', '/activities']];
const browser = await chromium.launch();
for (const theme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await ctx.addInitScript((t) => { try { localStorage.setItem('cr-theme', t); sessionStorage.clear(); } catch {} }, theme);
  const page = await ctx.newPage();
  // 시안 캡처는 Pretendard 가 없는 환경에서 찍혀 Noto Sans KR 폴백으로 보인다. 비교용으로만 같은 조건을 만든다.
  for (const [name, path] of SHOTS) {
    await page.goto(base + path, { waitUntil: 'networkidle' });
    if (process.env.NO_PRETENDARD) {
      // 시안 번들이 불러오던 Google Fonts 의 Noto Sans KR 로 맞춘다 (비교용)
      await page.addStyleTag({ content: "@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap'); :root{--font-sans:'Noto Sans KR',sans-serif !important}" });
      await page.waitForTimeout(1500);
    }
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${name}_${theme}.png` });
  }
  await ctx.close();
}
await browser.close();
console.log('done');
