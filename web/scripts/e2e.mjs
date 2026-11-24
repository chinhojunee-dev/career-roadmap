// 시안의 상호작용이 실제로 동작하는지 브라우저로 확인한다.  node scripts/e2e.mjs [baseUrl]
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://127.0.0.1:3100';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage(); const errors = [];
p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
p.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
let pass = 0, fail = 0;
const t = async (name, fn) => { try { const r = await fn(); if (r === false) throw new Error('false'); pass++; console.log('  ✓', name); } catch (e) { fail++; console.log('  ✗', name, '—', String(e.message).split('\n')[0]); } };
const go = async (path) => { await p.goto(base + path, { waitUntil: 'networkidle' }); await p.waitForTimeout(250); };
const txt = (s) => p.locator(`text=${s}`).first();
const has = async (s) => (await p.locator(`text=${s}`).count()) > 0;

console.log('공통 · 사이드바 · 테마');
await go('/roadmap');
await t('사이드바 → 현재 내 상황', async () => { await p.click('a.app-nav-item[href$="/dashboard"]'); await p.waitForURL('**/dashboard'); return has('역량 · 현재 vs 목표'); });
await t('사이드바 → 목표 · 프로필', async () => { await p.click('a.app-nav-item[href$="/goal"]'); await p.waitForURL('**/goal'); await p.waitForSelector('text=내 프로필'); return true; });
await t('사이드바 → 활동 관리', async () => { await p.click('a.app-nav-item[href$="/activities"]'); await p.waitForURL('**/activities'); await p.waitForSelector('text=역량별 근거 활동'); return true; });
await t('사이드바 → 학기별 로드맵', async () => { await p.click('a.app-nav-item[href$="/roadmap"]'); await p.waitForURL('**/roadmap'); await p.waitForSelector('text=이 구간 목표'); return true; });
await t('사이드바 접기/펼치기', async () => { const sh = p.locator('.app-shell'); await p.click('.side-toggle'); const c = await sh.evaluate((e) => e.classList.contains('side-collapsed')); await p.click('.side-toggle'); return c && !(await sh.evaluate((e) => e.classList.contains('side-collapsed'))); });
await t('다크모드 토글 + 새로고침 후 유지', async () => {
  await p.click('.app-nav-bottom .app-nav-item:first-child'); const d = await p.evaluate(() => document.documentElement.dataset.theme);
  await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(250);
  const d2 = await p.evaluate(() => document.documentElement.dataset.theme);
  await p.click('.app-nav-bottom .app-nav-item:first-child'); const d3 = await p.evaluate(() => document.documentElement.dataset.theme);
  return d === 'dark' && d2 === 'dark' && d3 === 'light'; });

console.log('④ 학기별 로드맵');
await go('/roadmap');
await t('셀 클릭 → 해당 학기 상세', async () => { await p.click('button[aria-label="4학년 1학기"]'); return has('브랜드 기획 경험 증명') && (await has('4학년 1학기')); });
await t('활동 체크 → 완료 카운트 · 그리드 ✓ 아이콘', async () => {
  await p.click('button[aria-label="3학년 2학기"]'); await p.waitForTimeout(100);
  await p.check('input[aria-label="ADsP 준비 완료"]'); const cnt = await has('2 / 3 완료'); return cnt; });
await t('체크 해제', async () => { await p.uncheck('input[aria-label="ADsP 준비 완료"]'); return has('1 / 3 완료'); });
await t('활동 이름 클릭 → 상세 서랍(왜 하나요·목표 결과·기간·시간·추천 자료·다음 연결)', async () => {
  await p.click('button[aria-label="ADsP 준비 자세히 보기"]'); await p.waitForSelector('.cr-drawer');
  const ok = await Promise.all(['왜 하나요', '목표 결과', '기간', '시간', '추천 자료', '→'].map(has)); return ok.every(Boolean); });
await t('서랍에서 완료 표시 ↔ 완료 취소', async () => { await p.click('text=✓ 완료로 표시'); const a = await has('완료 취소'); await p.click('text=완료 취소'); return a && (await has('✓ 완료로 표시')); });
await t('Esc 로 서랍 닫기', async () => { await p.keyboard.press('Escape'); await p.waitForTimeout(100); return (await p.locator('.cr-drawer').count()) === 0; });
await t('체크 상태가 화면 이동 후에도 유지(세션)', async () => {
  await p.check('input[aria-label="ADsP 준비 완료"]'); await p.click('a.app-nav-item[href$="/dashboard"]'); await p.waitForURL('**/dashboard');
  await p.click('a.app-nav-item[href$="/roadmap"]'); await p.waitForURL('**/roadmap'); await p.waitForTimeout(250);
  return p.locator('input[aria-label="ADsP 준비 완료"]').isChecked(); });

console.log('② 목표 · 프로필');
await go('/goal');
await t('추천 칩 → 직무 추천 카드(적합도 %)', async () => { await p.click('button.chat-exp-trigger:has-text("숫자 다루는 일이 좋아요")'); return (await has('퍼포먼스 마케터')) && (await has('적합도 90%')); });
await t('목표로 설정 → "방금 바뀜" 배너', async () => { await p.click('.fs-copilot button.cr-opt:has-text("목표로 설정") >> nth=0'); return (await has('방금 바뀜')) && (await has('새 목표에 맞게 로드맵을 다시 채울까요?')); });
await t('되돌리기', async () => { await p.click('text=되돌리기'); await p.waitForTimeout(150); return (await p.locator('text=방금 바뀜').count()) === 0; });
await t('자유 입력 전송(Enter)', async () => { await p.fill('.chat-input-box input', '사람들과 일하는 게 좋아요'); await p.press('.chat-input-box input', 'Enter'); return has('말씀해 주신 내용과 프로필을 함께 보고 찾아봤어요.'); });
await t('프로필 행 · 수정 링크', async () => (await p.locator('.fs-work a.cr-opt:has-text("수정")').count()) === 6);

console.log('① 커리어 프로필 입력');
await go('/onboarding');
await t('6단계 표시 클릭 이동', async () => { await p.click('.cr-stepbtn:nth-child(3)'); return has('지금 가진 스펙을 알려 주세요'); });
await t('다음 / 이전 버튼', async () => { await p.click('button:has-text("다음 — 활동 경험")'); const a = await has('어떤 활동을 해 왔나요?'); await p.click('button:has-text("← 이전")'); return a && (await has('지금 가진 스펙을 알려 주세요')); });
await t('학점 없음 토글 → 입력 비활성', async () => { await p.click('button:has-text("아직 학점이 없어요")'); const d = await p.locator('input[aria-label="현재 학점"]').isDisabled(); await p.click('button:has-text("아직 학점이 없어요")'); return d; });
await t('자격증 추가(입력 + 추천 칩) · 삭제', async () => {
  await p.fill('input[aria-label="자격증 이름"]', 'SQLD'); await p.click('button:has-text("+ 추가") >> nth=0'); const a = await has('SQLD');
  await p.click('button:has-text("+ ADsP")'); const c = await has('3개'); await p.click('button[aria-label="SQLD 삭제"]'); return a && c && (await p.locator('button[aria-label="SQLD 삭제"]').count()) === 0; });
await t('어학 점수 추가', async () => { await p.click('.cr-seg button:has-text("OPIc")'); await p.fill('input[aria-label="점수 또는 등급"]', 'IM2'); await p.click('button:has-text("+ 추가") >> nth=1'); return has('IM2'); });
await t('툴 다중 선택', async () => { await p.click('.cr-opts[aria-label="다룰 수 있는 툴"] button:has-text("SQL")'); return (await p.locator('.cr-opts[aria-label="다룰 수 있는 툴"] button[aria-pressed="true"]').count()) === 4; });
await t('2단계: 직군 탭 → 직무 선택', async () => { await p.click('.cr-stepbtn:nth-child(2)'); await p.click('.cr-seg button:has-text("데이터 · IT")'); await p.click('.cr-opts[aria-label="직무 목록"] button:has-text("데이터 분석가")'); return (await p.locator('.cr-chip.hot:has-text("데이터 분석가")').count()) === 1; });
await t('2단계: 검색 필터 + Enter 직접 입력', async () => {
  await p.fill('input[aria-label="직무 검색 또는 직접 입력"]', 'CRM'); const a = await has('CRM 마케터');
  await p.fill('input[aria-label="직무 검색 또는 직접 입력"]', '우주 마케터'); const m = await has('목록에 없는 직무예요'); await p.press('input[aria-label="직무 검색 또는 직접 입력"]', 'Enter');
  return a && m && (await p.locator('.cr-chip.hot:has-text("우주 마케터")').count()) === 1; });
await t('2단계: ‘아직 정하지 않았어요’ → 코파일럿 안내', async () => { await p.click('.cr-pick'); return has('잘 맞는 직무 3개를 추천해 드릴게요'); });
await t('4단계: Notion 링크 → 가져와서 정리 → 카드 추가', async () => {
  await p.click('.cr-stepbtn:nth-child(4)'); await p.click('.exp-import-btn:has-text("Notion")'); await p.fill('input[aria-label="가져올 링크"]', 'notion.so/test');
  await p.click('text=✦ 가져와서 정리'); const l = await has('내용을 읽고 활동별로 정리하는 중'); await p.waitForSelector('text=정리된 활동 3개', { timeout: 4000 }); return l; });
await t('4단계: PDF 는 링크 없이 바로 정리', async () => { await p.click('.exp-import-btn:has-text("PDF")'); await p.waitForSelector('text=정리된 활동 5개', { timeout: 4000 }); return true; });
await t('4단계: 채팅으로 활동 추가(추천 칩)', async () => { await p.click('button.chat-exp-trigger:has-text("공모전에서 장려상 받았어요")'); await p.waitForSelector('text=정리된 활동 6개'); return has('‘공모전’ 활동으로 정리했어요'); });
await t('4단계: 직접 입력 채팅 → 유형 추정', async () => { await p.fill('.chat-input-box input', '학회에서 발표했어요'); await p.press('.chat-input-box input', 'Enter'); await p.waitForSelector('text=정리된 활동 7개'); return has('‘교내 활동’ 활동으로 정리했어요'); });
await t('4단계: 활동 삭제', async () => { await p.click('button[aria-label^="학회에서 발표했어요 삭제"]'); return has('정리된 활동 6개'); });
await t('5단계: 취업 시기 선택 → 안내 문구', async () => { await p.click('.cr-stepbtn:nth-child(5)'); await p.click('.cr-opts[aria-label="희망 취업 시기"] button:has-text("2028 하반기")'); return has('2028 하반기 취업을 목표로'); });
await t('6단계: 추가 입력 · 완료 버튼 링크', async () => { await p.click('.cr-stepbtn:nth-child(6)'); await p.fill('input[placeholder="예: 2028.02"]', '2028.02'); return (await p.locator('a.btn:has-text("✦ 학기별 로드맵 만들기")').getAttribute('href')).endsWith('/roadmap'); });
await t('자동 저장: 새로고침 후에도 입력 유지', async () => { await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(250); await p.click('.cr-stepbtn:nth-child(6)'); return (await p.inputValue('input[placeholder="예: 2028.02"]')) === '2028.02'; });
await t('목표·프로필 화면에 입력한 직무 반영', async () => { await go('/goal'); return has('우주 마케터'); });

console.log('③ 현재 내 상황');
await go('/dashboard');
await t('준비도 · 위치 · 스펙 · 역량 8행 · TOP 3', async () => (await has('42%')) && (await has('3학년 2학기')) && (await p.locator('.cr-comp-row').count()) === 8 && (await has('먼저 채울 역량')));
await t('로드맵 보기 링크', async () => { await p.click('text=로드맵 보기 →'); await p.waitForURL('**/roadmap'); return true; });

console.log('⑤ 활동 관리');
await go('/activities');
await t('유형 필터(프로젝트만 표시)', async () => { await p.click('.cr-opts[aria-label="활동 유형"] button:has-text("프로젝트")'); const n = await p.locator('article.cr-card').count(); const other = await p.locator('article.cr-card .cr-card-head .cr-chip:not(:has-text("프로젝트"))').count(); return n >= 2 && other === 0; });
await t('빈 상태(인턴십 0)', async () => { await p.click('.cr-opts[aria-label="활동 유형"] button:has-text("인턴십")'); return has('아직 인턴십 활동이 없어요'); });
await t('편집 → 왼쪽 채팅 + 오른쪽 정리 결과(분할)', async () => { await p.click('.cr-opts[aria-label="활동 유형"] button:has-text("전체")'); await p.click('text=✎ 편집 · 채팅으로 정리 >> nth=5'); return (await has('정리 결과')) && (await has('STAR로 정리하기')) && (await has('지금 묻는 중')); });
await t('채팅 답변 → 결과에 반영 + 다음 질문', async () => { await p.fill('.chat-input-box input', '월 12만 조회, 릴스 20건'); await p.press('.chat-input-box input', 'Enter'); await p.waitForTimeout(200); return (await has('에 정리했어요')) || (await has('STAR 정리가 끝났어요')); });
await t('‘채팅으로 묻기’ · 예시 보여 줘', async () => { await p.click('text=✦ 채팅으로 묻기 >> nth=0'); await p.click('button.chat-exp-trigger:has-text("예시 보여 줘")'); return has('예:'); });
await t('✎ 직접 편집 → 텍스트 수정 → 편집 완료', async () => { await p.click('button[aria-label="상황 직접 편집"]'); await p.fill('textarea[aria-label="상황 직접 편집"]', '직접 고친 상황'); await p.click('text=✓ 편집 완료'); return has('직접 고친 상황'); });
await t('저장 → 목록 카드에 반영', async () => { await p.click('button:has-text("✓ 저장")'); await p.waitForSelector('text=활동 관리'); return has('직접 고친 상황'); });
await t('+ 활동 추가 → 단계별 질문(활동명→유형 칩→기간→역할→STAR)', async () => {
  await p.click('button:has-text("+ 활동 추가")'); await p.fill('.chat-input-box input', '교내 해커톤'); await p.press('.chat-input-box input', 'Enter');
  await p.click('button.chat-exp-trigger:has-text("공모전")'); await p.fill('.chat-input-box input', '2026.05'); await p.press('.chat-input-box input', 'Enter');
  await p.fill('.chat-input-box input', '기획'); await p.press('.chat-input-box input', 'Enter'); await p.waitForTimeout(200);
  return has('이제 STAR로 정리해 볼게요'); });
await t('새 활동 저장 → 목록 맨 앞에 추가', async () => { await p.click('button:has-text("✓ 저장")'); await p.waitForSelector('text=교내 해커톤'); return (await p.locator('article.cr-card h3').first().innerText()) === '교내 해커톤'; });
await t('Notion · 파일에서 가져오기 칩', async () => { await p.click('button:has-text("+ 활동 추가")'); await p.click('button.chat-exp-trigger:has-text("Notion · 파일에서 가져오기")'); await p.waitForSelector('text=4 / 4 채움'); return (await p.inputValue('input[placeholder="예: 교내 창업 동아리 기획팀"]')) === '[예시] 교내 창업 동아리 기획팀'; });
await t('취소 → 목록 복귀', async () => { await p.click('button:has-text("취소")'); return has('역량별 근거 활동'); });

console.log(`\n결과: ${pass} 통과 / ${fail} 실패 · 브라우저 오류 ${errors.length}건`);
if (errors.length) console.log(errors.slice(0, 5).join('\n'));
await b.close(); process.exit(fail ? 1 : 0);
