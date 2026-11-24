export type Level = 1 | 2 | 3 | 4 | 5;

/* ── 프로필 ───────────────────────────── */
export interface Cert { name: string; date: string }
export interface Lang { test: string; score: string }
export type ImportSource = 'notion' | 'file' | 'gdoc' | 'link' | 'chat';
export interface ImportedActivity {
  type: string; title: string; period: string; result: string; skills: string[]; src: string;
}
export interface Profile {
  school: string; major: string; grade: string;
  goalJob: string;            // 현재 목표 직무
  baselineJob: string;        // 로드맵을 마지막으로 채운 시점의 목표 (바뀌면 '다시 채우기' 안내)
  undecided: boolean;
  industries: string[];
  gpa: string; gpaScale: string; noGpa: boolean;
  certs: Cert[]; langs: Lang[]; langTest: string; tools: string[];
  importedActs: ImportedActivity[];
  hours: string; timing: string;
  graduation: string; company: string; region: string; budget: string; altJob: string;
  styles: string[]; certainty: string;
}
export interface ProfileRow { label: string; value: string; target: 'onboarding' | 'activities' }

/* ── 직무 추천 · 채팅 ─────────────────── */
export interface JobRec { job: string; match: number; why: string }
export type ChatRequest =
  | { scope: 'onboarding'; step: number; text: string }
  | { scope: 'goal'; text: string; key?: string }
  | { scope: 'activity'; mode: 'star' | 'info'; label: string; text: string; keep: boolean; next: string | null };
export interface ChatReply { text: string; recs?: JobRec[]; activity?: Omit<ImportedActivity, 'src'> }

/* ── 현재 내 상황 ─────────────────────── */
export interface Competency { name: string; cur: Level; target: Level; w: number; plan?: string }
export interface Assessment {
  overall: number; position: string; stage: string;
  specs: { k: string; v: string }[]; comps: Competency[]; strengths: string[];
}

/* ── 학기별 로드맵 ────────────────────── */
export type ItemKind = 'cert' | 'study' | 'proj' | 'act' | 'intern' | 'lang' | 'goal';
export type CellStatus = 'done' | 'now' | 'todo';
export interface RoadmapItem { kind: ItemKind; title: string }
export interface RoadmapCell {
  st: CellStatus; goal?: string; skills?: string[]; items: RoadmapItem[];
  months?: [string, string[]][];
}
export interface RoadmapYear { year: string; cells: RoadmapCell[] }
export interface RoadmapDetail {
  skill: string; why: string; result: string; period: string; hours: string;
  steps: [string, string][]; res: string[]; next: string;
}
export interface Roadmap {
  goal: string; hireTerm: string; selected: string;
  plan: RoadmapYear[]; doneItems: Record<string, boolean>;
}

/* ── 활동 관리 ────────────────────────── */
export interface Star { s: string; t: string; a: string; r: string }
export interface Activity {
  type: string; title: string; period: string; role: string; skills: string[]; star: Star;
}
export interface ActivityDraft {
  info: { title: string; type: string; period: string; role: string };
  star: Star;
}
