/* ──────────────────────────────────────────────────────────────
   예시 데이터 (시안의 PLAN · COMPS · ACTS · RECS · SRC · DETAIL 등)
   실제 서비스에서는 서버 응답으로 바뀌는 부분이다. `[예시]` 표시는 가짜 데이터.
   ────────────────────────────────────────────────────────────── */
import type { Activity, Competency, ImportedActivity, JobRec, Profile, RoadmapDetail, RoadmapYear } from '../../model/types';

export const START_GOAL = '브랜드 마케터';

export const DEFAULT_PROFILE: Profile = {
  school: '[예시] 한국대학교', major: '경영학과', grade: '3학년',
  goalJob: START_GOAL, baselineJob: START_GOAL, undecided: false,
  industries: ['뷰티 · 패션', '식품 · 유통'],
  gpa: '3.8', gpaScale: '4.5', noGpa: false,
  certs: [{ name: '컴퓨터활용능력 2급', date: '2025.08' }],
  langs: [{ test: 'TOEIC', score: '780' }], langTest: 'TOEIC',
  tools: ['엑셀', 'PPT', '캔바'],
  importedActs: [],
  hours: '5~10시간', timing: '2028 상반기',
  graduation: '', company: '', region: '', budget: '', altJob: '',
  styles: ['실전 프로젝트'], certainty: '4',
};

/* ── 직무 추천 ── */
export const RECS: Record<string, JobRec[]> = {
  fit: [
    { job: '브랜드 마케터', match: 92, why: '경영 전공 · SNS 운영 경험과 잘 맞아요' },
    { job: '콘텐츠 마케터', match: 88, why: '콘텐츠 제작 경험을 바로 살릴 수 있어요' },
    { job: 'CRM 마케터', match: 74, why: '데이터 분석만 채우면 강점이 돼요' },
  ],
  num: [
    { job: '퍼포먼스 마케터', match: 90, why: '광고 성과를 숫자로 키우는 일이에요' },
    { job: '데이터 분석가', match: 82, why: 'ADsP 준비와 바로 이어져요' },
    { job: 'CRM 마케터', match: 80, why: '고객 데이터로 재구매를 늘려요' },
  ],
  people: [
    { job: '제휴 · 파트너십', match: 86, why: '학회 · 서포터즈 협업 경험이 강점이에요' },
    { job: 'PR · 홍보', match: 84, why: '브랜드 이야기를 밖으로 알리는 일이에요' },
    { job: 'B2B 영업', match: 78, why: '사람을 만나 성과를 내는 일이에요' },
  ],
};
export const GOAL_REPLIES: Record<string, string> = {
  fit: '전공과 지금까지 활동을 보면 이 직무들이 잘 맞아요.',
  num: '숫자로 성과를 보는 마케팅 · 분석 직무를 골라 봤어요.',
  people: '사람과 관계를 만드는 직무예요.',
  '': '브랜드 마케터는 ‘어떻게 기억될지’를, 퍼포먼스 마케터는 ‘얼마나 팔릴지’를 숫자로 다뤄요. 지금 경험은 브랜드 쪽에 더 가까워요.',
};

/* ── 현재 내 상황 ── */
export const COMPS: Competency[] = [
  { name: '데이터 분석', cur: 1, target: 4, w: 1.0, plan: 'ADsP · GA4 — 이번 학기' },
  { name: '브랜드 전략 기획', cur: 2, target: 4, w: 1.0, plan: '브랜드 공모전 — 4학년 1학기' },
  { name: '시장 · 소비자 조사', cur: 2, target: 4, w: 0.9, plan: '포지셔닝 분석 — 이번 학기' },
  { name: '콘텐츠 기획 · 카피', cur: 3, target: 4, w: 0.8 },
  { name: '디자인 툴', cur: 2, target: 3, w: 0.5 },
  { name: '영어', cur: 2, target: 3, w: 0.4 },
  { name: 'SNS 채널 운영', cur: 4, target: 4, w: 0.7 },
  { name: '협업 · 커뮤니케이션', cur: 4, target: 4, w: 0.8 },
];

/* ── 학기별 로드맵 ── */
export const PLAN: RoadmapYear[] = [
  { year: '1학년', cells: [
    { st: 'done', items: [{ kind: 'study', title: '경영학원론' }, { kind: 'act', title: '마케팅 동아리' }] },
    { st: 'done', items: [{ kind: 'lang', title: '토익 기초 강의' }] },
    { st: 'done', items: [{ kind: 'study', title: '마케팅원론' }] },
    { st: 'done', items: [{ kind: 'cert', title: '컴활 2급' }] },
  ] },
  { year: '2학년', cells: [
    { st: 'done', items: [{ kind: 'study', title: '소비자행동론' }] },
    { st: 'done', items: [{ kind: 'act', title: '봉사 · 서포터즈 탐색' }] },
    { st: 'done', items: [{ kind: 'proj', title: '브랜드 리뉴얼 팀플' }] },
    { st: 'done', items: [{ kind: 'lang', title: 'TOEIC 780' }] },
  ] },
  { year: '3학년', cells: [
    { st: 'done', items: [{ kind: 'act', title: '마케팅 학회' }, { kind: 'act', title: '마케팅 서포터즈' }] },
    { st: 'done', items: [{ kind: 'act', title: '서포터즈 콘텐츠' }, { kind: 'study', title: '캔바 익히기' }] },
    { st: 'now', goal: '데이터 분석 기초 갖추기', skills: ['데이터 분석', '브랜드 전략'],
      items: [{ kind: 'cert', title: 'ADsP 준비' }, { kind: 'study', title: 'GA4 인증' }, { kind: 'proj', title: '포지셔닝 분석' }],
      months: [['11월', ['ADsP 1과목 끝내기', 'GA4 인증 취득']], ['12월', ['ADsP 2과목 · 기출 1회', '관심 브랜드 포지셔닝 맵']]] },
    { st: 'todo', goal: '첫 실전 성과 만들기', skills: ['데이터 분석', 'SNS 운영'],
      items: [{ kind: 'cert', title: 'ADsP 응시' }, { kind: 'proj', title: 'SNS 그로스 실험' }, { kind: 'lang', title: 'TOEIC 850' }],
      months: [['1월', ['SNS 계정 그로스 실험 시작', 'TOEIC 응시']], ['2월', ['ADsP 응시', '그로스 실험 결과 정리']]] },
  ] },
  { year: '4학년', cells: [
    { st: 'todo', goal: '브랜드 기획 경험 증명', skills: ['브랜드 전략', '시장 조사'],
      items: [{ kind: 'act', title: '브랜드 공모전' }, { kind: 'act', title: '소비재 서포터즈' }, { kind: 'cert', title: '검색광고마케터' }],
      months: [['3~4월', ['서포터즈 지원', '공모전 팀 구성']], ['5~6월', ['공모전 제출', '검색광고마케터 응시']]] },
    { st: 'todo', goal: '현업 경험 쌓기', skills: ['실무 경험'],
      items: [{ kind: 'intern', title: '마케팅 인턴' }, { kind: 'proj', title: '포트폴리오 완성' }],
      months: [['7~8월', ['마케팅 인턴', '포트폴리오 3건 정리']]] },
    { st: 'todo', goal: '서류 · 면접 준비', skills: ['자소서', '면접'],
      items: [{ kind: 'goal', title: '목표 기업 정리' }, { kind: 'goal', title: '자소서 · 면접 스터디' }],
      months: [['9~10월', ['목표 기업 10곳 정리', '자소서 초안 3개']], ['11~12월', ['직무 면접 스터디', '포트폴리오 피드백']]] },
    { st: 'todo', goal: '2028 상반기 공채 지원', skills: ['최종 목표'],
      items: [{ kind: 'goal', title: '상반기 공채 지원' }],
      months: [['1~2월', ['공채 일정 확인 · 지원', '최종 면접 대비']]] },
  ] },
];
export const DEFAULT_SELECTED = '3학년-2';
export const DEFAULT_DONE: Record<string, boolean> = { 'GA4 인증': true };

export const DETAIL: Record<string, RoadmapDetail> = {
  'ADsP 준비': { skill: '데이터 분석', why: '마케팅 공고에서 자주 보는 데이터 활용 능력을 증명해요', result: '1 · 2과목 완주', period: '11월 ~ 12월', hours: '주 4시간', steps: [['1주', '강의 · 교재 고르기'], ['2~4주', '1과목 데이터 이해'], ['5~7주', '2과목 분석 기획'], ['8주', '기출 1회']], res: ['[예시] ADsP 온라인 강의', '[예시] 기출 문제집'], next: '겨울방학 ‘ADsP 응시’로 이어져요' },
  'GA4 인증': { skill: '데이터 분석', why: '웹 · 앱 유입 데이터를 읽는 기본기를 보여 줘요', result: 'GA 인증 취득', period: '11월', hours: '주 2시간', steps: [['1주', '구글 Skillshop 과정 시작'], ['2주', '데모 계정으로 실습'], ['3주', '인증 시험 응시']], res: ['구글 Skillshop', 'GA4 데모 계정'], next: '겨울방학 SNS 그로스 실험에서 바로 써요' },
  '포지셔닝 분석': { skill: '시장 · 소비자 조사', why: '브랜드를 경쟁사와 비교해 보는 연습이에요', result: '포지셔닝 맵 1장', period: '12월', hours: '주 2시간', steps: [['1주', '브랜드 1곳 · 경쟁사 3곳 고르기'], ['2주', '소비자 리뷰 50개 정리'], ['3주', '맵 · 인사이트 정리']], res: ['[예시] 브랜드 사례 아티클'], next: '4학년 1학기 공모전 기획의 바탕이 돼요' },
  'ADsP 응시': { skill: '데이터 분석', why: '준비한 내용을 자격증으로 남겨요', result: 'ADsP 합격', period: '2월 (시행처 일정 확인)', hours: '시험 전 2주 집중', steps: [['4주 전', '원서 접수'], ['2주 전', '기출 3회'], ['시험 주', '오답 정리']], res: ['[예시] 기출 문제집'], next: '데이터 분석이 ‘활용’ 수준으로 올라가요' },
  'SNS 그로스 실험': { skill: 'SNS 운영 · 데이터', why: '이미 강한 SNS 역량에 숫자 성과를 붙여요', result: '8주 실험 리포트', period: '1월 ~ 2월', hours: '주 5시간', steps: [['1주', '목표 지표 · 가설 정하기'], ['2~7주', '주 3회 업로드 · 포맷 실험'], ['8주', '결과 리포트 작성']], res: ['인스타그램 인사이트', 'GA4'], next: '포트폴리오 첫 번째 사례가 돼요' },
  'TOEIC 850': { skill: '영어', why: '대기업 서류 기준을 여유 있게 넘겨요', result: 'TOEIC 850+', period: '1월 ~ 2월', hours: '주 4시간', steps: [['1~4주', 'LC 파트 2 · 3 집중'], ['5~6주', 'RC 실전 모의고사'], ['7주', '응시']], res: ['[예시] 실전 모의고사'], next: '4학년 지원 서류에 써요' },
  '브랜드 공모전': { skill: '브랜드 전략 기획', why: '브랜드 전략을 기획서로 증명할 수 있어요', result: '제출 · 본선 진출', period: '3월 ~ 6월', hours: '주 6시간', steps: [['3월', '팀 구성 · 공모전 고르기'], ['4월', '시장 조사 · 콘셉트'], ['5월', '기획서 · 발표 자료'], ['6월', '제출']], res: ['[예시] 공모전 정보 사이트'], next: '포트폴리오 · 자소서 소재가 돼요' },
  '마케팅 인턴': { skill: '실무 경험', why: '현업 경험은 서류 · 면접에서 가장 강한 근거예요', result: '인턴 6~8주 수료', period: '7월 ~ 8월', hours: '풀타임', steps: [['4월', '이력서 · 포트폴리오 정리'], ['5월', '10곳 이상 지원'], ['7~8월', '근무 · 성과 기록']], res: ['[예시] 채용 플랫폼 인턴 공고'], next: '4학년 2학기 서류 준비로 이어져요' },
};
export const GENERIC_DETAIL = (title: string, kindLabel: string): RoadmapDetail => ({
  skill: kindLabel, why: '목표 직무에 필요한 경험을 쌓아요', result: title + ' 완료', period: '해당 학기', hours: '주 3~4시간',
  steps: [['시작', '정보 찾기 · 계획 세우기'], ['중간', '진행 · 기록 남기기'], ['마무리', '결과 정리']], res: ['AI 추천 자료 준비 중'], next: '다음 학기 계획에 반영돼요',
});

/* ── 활동 ── */
export const ACTS: Activity[] = [
  { type: '교내 활동', title: '[예시] 경영학과 마케팅 학회', period: '2025.09 ~ 진행 중', role: '리서치 팀원', skills: ['브랜드 전략', '협업'], star: { s: '매 학기 브랜드 사례를 분석해 발표해요', t: '리서치 팀원으로 자료 조사 담당', a: '경쟁사 3곳의 SNS · 리뷰를 비교 정리', r: '발표 3회, 학기 말 우수 발표 선정' } },
  { type: '대외활동', title: '[예시] 대학생 마케팅 서포터즈', period: '2026.03 ~ 2026.06', role: '콘텐츠 제작', skills: ['콘텐츠 기획', 'SNS 운영'], star: { s: '대학생 타깃 신제품 홍보가 필요했어요', t: '팀 인스타그램 콘텐츠 제작 담당', a: '릴스 · 카드뉴스 12건 기획 · 제작', r: '팀 내 반응 1위 콘텐츠' } },
  { type: '프로젝트', title: '[예시] 브랜드 리뉴얼 제안 팀 프로젝트', period: '2025.09 ~ 2025.12', role: '기획 · 발표', skills: ['브랜드 전략', '협업'], star: { s: '오래된 브랜드 이미지를 바꾸는 수업 과제', t: '기획 · 발표 담당', a: '타깃 설문 후 리브랜딩 방향 제안', r: '수업 우수 팀 선정' } },
  { type: '공모전', title: '[예시] 캠퍼스 마케팅 아이디어 공모전', period: '2025.11', role: '팀장', skills: ['시장 조사', '협업'], star: { s: '캠퍼스 마케팅 아이디어 공모전 참가', t: '팀장으로 방향 설정', a: '설문 120명으로 타깃 재정의', r: '장려상 수상' } },
  { type: '수상', title: '[예시] 캠퍼스 마케팅 아이디어 공모전 장려상', period: '2025.12', role: '팀장', skills: ['시장 조사'], star: { s: '공모전 본선 발표', t: '팀 대표 발표', a: '설문 데이터로 발표 구성', r: '장려상' } },
  { type: '프로젝트', title: '[예시] 개인 뷰티 리뷰 SNS 계정 운영', period: '2024.07 ~ 진행 중', role: '1인 운영', skills: ['SNS 운영', '콘텐츠 기획'], star: { s: '뷰티 제품 리뷰 계정 운영', t: '기획 · 촬영 · 편집 1인 담당', a: '주 2회 업로드, 릴스 포맷 실험', r: '' } },
];
export const IMPORT_EX = {
  info: { title: '[예시] 교내 창업 동아리 기획팀', type: '교내 활동', period: '2025.03 ~ 2025.12', role: '기획 팀원' },
  star: { s: '창업 아이디어를 학생들에게 알릴 행사가 필요했어요', t: '팝업 행사 기획 담당', a: '부스 3개 구성 · SNS 사전 홍보 기획', r: '[예시] 방문객 300명' },
};

/* ── 가져오기 결과 (Notion · PDF · Google 문서 · 링크) ── */
export const SRC: Record<string, { label: string; items: Omit<ImportedActivity, 'src'>[] }> = {
  notion: { label: 'Notion', items: [
    { type: '교내 활동', title: '[예시] 경영학과 마케팅 학회', period: '2025.09 ~ 진행 중', result: '브랜드 분석 발표 3회', skills: ['브랜드 전략', '협업'] },
    { type: '대외활동', title: '[예시] 대학생 마케팅 서포터즈', period: '2026.03 ~ 2026.06', result: 'SNS 콘텐츠 12건 제작', skills: ['콘텐츠 기획', 'SNS 운영'] },
    { type: '공모전', title: '[예시] 캠퍼스 마케팅 아이디어 공모전', period: '2025.11', result: '설문 120명 · 장려상', skills: ['시장 조사'] },
  ] },
  file: { label: 'PDF', items: [
    { type: '프로젝트', title: '[예시] 브랜드 리뉴얼 제안 팀 프로젝트', period: '2025.09 ~ 2025.12', result: '수업 우수 팀 선정', skills: ['브랜드 전략'] },
    { type: '수상', title: '[예시] 공모전 장려상', period: '2025.12', result: '4인 팀 대표 수상', skills: ['시장 조사'] },
  ] },
  gdoc: { label: 'Google 문서', items: [
    { type: '교내 활동', title: '[예시] 교내 창업 동아리 기획팀', period: '2025.03 ~ 2025.12', result: '팝업 행사 기획 · 운영', skills: ['기획', '협업'] },
  ] },
  link: { label: '웹 링크', items: [
    { type: '프로젝트', title: '[예시] 개인 뷰티 리뷰 SNS 계정', period: '2024.07 ~ 진행 중', result: '주 2회 업로드 · 릴스 실험', skills: ['SNS 운영', '콘텐츠 기획'] },
  ] },
};
export const CHAT_EX: Record<string, Omit<ImportedActivity, 'src'>> = {
  '서포터즈로 SNS 콘텐츠 만들었어요': { type: '대외활동', title: '대학생 서포터즈 SNS 콘텐츠 제작', period: '기간 확인 필요', result: '콘텐츠 제작', skills: ['콘텐츠 기획', 'SNS 운영'] },
  '공모전에서 장려상 받았어요': { type: '공모전', title: '마케팅 공모전 장려상', period: '기간 확인 필요', result: '장려상 수상', skills: ['시장 조사'] },
};
