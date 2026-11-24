import type { CareerApi } from '../CareerApi';
import type { Activity, Assessment, ChatReply, ImportedActivity, Profile, Roadmap } from '../../model/types';
import { KIND, TERMS } from '../../model/options';
import { load, loadRaw, save } from '../session';
import {
  ACTS, CHAT_EX, COMPS, DEFAULT_DONE, DEFAULT_PROFILE, DEFAULT_SELECTED, DETAIL, GENERIC_DETAIL,
  GOAL_REPLIES, IMPORT_EX, PLAN, RECS, SRC,
} from './data';

const K = { profile: 'cr.profile', acts: 'cr.acts', rm: 'cr.roadmap' };
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const GUESS = (t: string) =>
  /공모전|대회/.test(t) ? '공모전' : /인턴/.test(t) ? '인턴십' : /프로젝트|팀플/.test(t) ? '프로젝트'
  : /학회|동아리|학생회/.test(t) ? '교내 활동' : /수상|상을|상 받/.test(t) ? '수상' : '대외활동';
const shortCert = (n: string) => n.replace('컴퓨터활용능력', '컴활');
const shortIndustry = (i: string) => i.split(' · ')[0];

const acts = () => loadRaw<Activity[]>(K.acts, ACTS);
const rmState = () => loadRaw<{ selected: string; doneItems: Record<string, boolean> }>(K.rm, { selected: DEFAULT_SELECTED, doneItems: DEFAULT_DONE });

export const mockCareerApi: CareerApi = {
  async getProfile() { return load<Profile>(K.profile, DEFAULT_PROFILE); },

  async saveProfile(patch) {
    const next = { ...load<Profile>(K.profile, DEFAULT_PROFILE), ...patch };
    save(K.profile, next);
    if (patch.importedActs) {            // 가져온 활동은 활동 관리에도 쌓는다 (같은 제목은 건너뜀)
      const list = acts();
      for (const a of patch.importedActs) {
        if (!list.some((x) => x.title === a.title)) {
          list.push({ type: a.type, title: a.title, period: a.period, role: '역할 미입력', skills: a.skills, star: { s: '', t: '', a: '', r: a.result } });
        }
      }
      save(K.acts, list);
    }
    return next;
  },

  async getProfileRows() {
    const p = load<Profile>(K.profile, DEFAULT_PROFILE);
    const spec = [
      p.noGpa ? '' : p.gpa && `학점 ${p.gpa}`, ...p.certs.map((c) => shortCert(c.name)), ...p.langs.map((l) => `${l.test} ${l.score}`),
    ].filter(Boolean).join(' · ');
    const extra = [p.graduation, p.company, p.region, p.budget, p.altJob].filter(Boolean).join(' · ');
    const inds = p.industries.map(shortIndustry).join('/');
    return [
      { label: '기본 정보', value: `${p.school} · ${p.major} · ${p.grade}`, target: 'onboarding' as const },
      { label: '희망 진로', value: `${p.undecided ? '아직 정하지 않았어요' : p.goalJob}${inds ? ' · ' + inds : ''}`, target: 'onboarding' as const },
      { label: '보유 스펙', value: spec || '입력 전', target: 'onboarding' as const },
      { label: '활동 경험', value: `${acts().length}개`, target: 'activities' as const },
      { label: '학습 조건', value: `주 ${p.hours} · ${p.timing}`, target: 'onboarding' as const },
      { label: '추가 정보', value: extra || '선택 입력', target: 'onboarding' as const },
    ];
  },

  /* ── AI (지금은 정해진 예시 응답) ── */
  async chat(req): Promise<ChatReply> {
    if (req.scope === 'onboarding') {
      if (req.step === 4) {
        const item = CHAT_EX[req.text] ?? {
          type: GUESS(req.text), title: req.text.length > 24 ? req.text.slice(0, 24) + '…' : req.text,
          period: '기간 확인 필요', result: '채팅으로 정리됨', skills: [],
        };
        return { text: `‘${item.type}’ 활동으로 정리했어요. 언제 했던 활동인지 알려 주면 기간도 채워 둘게요.`, activity: item };
      }
      return { text: '입력한 정보는 학기별 로드맵을 짜는 데만 쓰이고, 목표 · 프로필 화면에서 언제든 바꿀 수 있어요.' };
    }
    if (req.scope === 'goal') {
      if (req.key === undefined) return { text: '말씀해 주신 내용과 프로필을 함께 보고 찾아봤어요.', recs: RECS.fit };
      return { text: GOAL_REPLIES[req.key], recs: req.key ? RECS[req.key] : undefined };
    }
    // activity (STAR · 기본 정보 정리)
    if (req.mode === 'info') return { text: (req.keep ? '' : `‘${req.label}’ 적어 뒀어요. `) + (req.next ?? '') };
    return { text: `‘${req.label}’${req.keep ? '은 그대로 둘게요.' : '에 정리했어요.'}${req.next ? ' ' + req.next : ' STAR 정리가 끝났어요. 확인하고 저장해 주세요.'}` };
  },

  async importActivities({ source }): Promise<ImportedActivity[]> {
    await wait(1400);                     // 읽고 정리하는 시간 흉내
    const s = SRC[source];
    return s.items.map((it) => ({ ...it, src: s.label + '에서' }));
  },

  async importActivityDraft() { await wait(300); return structuredClone(IMPORT_EX); },

  async getAssessment(): Promise<Assessment> {
    const p = load<Profile>(K.profile, DEFAULT_PROFILE);
    const rm = await this.getRoadmap();
    let position = '', stage = '기초 역량 단계';
    rm.plan.forEach((y) => y.cells.forEach((c, i) => { if (c.st === 'now') position = `${y.year} ${TERMS[i]}`; }));
    const lang = p.langs[0];
    return {
      overall: 42, position, stage,
      specs: [
        { k: '학점', v: p.noGpa ? '-' : p.gpa || '-' }, { k: '자격증', v: `${p.certs.length}개` },
        { k: lang ? lang.test : '어학', v: lang ? lang.score : '-' }, { k: '활동', v: `${acts().length}개` },
      ],
      comps: COMPS, strengths: COMPS.filter((c) => c.cur >= c.target).map((c) => c.name),
    };
  },

  /* ── 로드맵 ── */
  async getRoadmap(): Promise<Roadmap> {
    const p = load<Profile>(K.profile, DEFAULT_PROFILE);
    const st = rmState();
    return { goal: p.goalJob, hireTerm: p.timing, selected: st.selected, plan: PLAN, doneItems: st.doneItems };
  },
  async getRoadmapItem(title, kind) { return DETAIL[title] ?? GENERIC_DETAIL(title, KIND[kind]); },
  async setRoadmapSelected(key) { save(K.rm, { ...rmState(), selected: key }); },
  async setItemDone(title, done) { const st = rmState(); save(K.rm, { ...st, doneItems: { ...st.doneItems, [title]: done } }); },
  async markRoadmapFilled() {
    const p = load<Profile>(K.profile, DEFAULT_PROFILE);
    save(K.profile, { ...p, baselineJob: p.goalJob });
  },

  /* ── 활동 ── */
  async listActivities() { return acts(); },
  async saveActivities(list) { save(K.acts, list); },
};
