import type { ItemKind } from './types';

/* 화면 문구 · 선택지 (예시 데이터가 아니라 UI 구성 요소) */
export const NAV = [
  { href: '/goal', title: '목표 · 프로필' },
  { href: '/dashboard', title: '현재 내 상황' },
  { href: '/roadmap', title: '학기별 로드맵' },
  { href: '/activities', title: '활동 관리' },
] as const;

export const THEME_ICON = {
  toLight: 'M9 5.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM9 1.8v1.6M9 14.6v1.6M1.8 9h1.6M14.6 9h1.6M3.9 3.9l1.1 1.1M13 13l1.1 1.1M3.9 14.1 5 13M13 5l1.1-1.1',
  toDark: 'M15 10.2A6.5 6.5 0 1 1 7.8 3 5 5 0 0 0 15 10.2z',
};

/* ① 프로필 입력 */
export const STEPS = ['기본 정보', '희망 진로', '보유 스펙', '활동 경험', '학습 조건', '추가 정보'];
export const COP: string[][] = [
  ['안녕하세요! 커리어 로드맵을 만들기 전에 지금 어디쯤 있는지 알려 주세요.', '입력은 6단계, 3분 정도면 끝나요. 중간에 나가도 자동 저장돼서 이어서 할 수 있어요.'],
  ['어떤 일을 하고 싶은지 알려 주세요. 아직 모르겠다면 ‘아직 정하지 않았어요’를 눌러도 괜찮아요.', '관심 산업을 고르면 같은 직무라도 산업에 맞춰 필요한 역량을 다르게 분석해요.'],
  ['지금 가진 학점, 자격증, 어학 점수를 알려 주세요. 목표 직무 합격자들이 주로 갖춘 스펙과 비교해 드릴게요.', '아직 없는 항목은 비워 둬도 괜찮아요. 무엇을 언제 준비하면 좋을지 로드맵에서 알려 드릴게요.'],
  ['노션 · 파일 · 링크를 올리면 활동별로 정리해 드려요.', '파일이 없으면 여기 채팅으로 편하게 말해 주세요. 제가 알아서 정리할게요.'],
  ['일주일에 낼 수 있는 시간에 맞춰 계획의 양을 조절해요.', '희망 취업 시기에서 거꾸로 계산해 학기별 목표를 정해요.'],
  ['여기부터는 선택이에요. 채울수록 추천이 정교해지지만, 건너뛰어도 로드맵은 만들 수 있어요.'],
];
export const GRADES = ['1학년', '2학년', '3학년', '4학년', '졸업 유예', '졸업생'];
export const INDUSTRIES = ['뷰티 · 패션', '식품 · 유통', 'IT · 플랫폼', '엔터 · 미디어', '금융', '제조', '공공기관', '스타트업'];
export const JOB_CATS: Record<string, string[]> = {
  '인기': ['브랜드 마케터', '퍼포먼스 마케터', '콘텐츠 마케터', '서비스 기획자', '데이터 분석가', '상품 MD', '인사(HR)', '영업 관리'],
  '마케팅 · 광고': ['브랜드 마케터', '퍼포먼스 마케터', '콘텐츠 마케터', 'CRM 마케터', '그로스 마케터', 'SNS 마케터', '광고 기획(AE)', 'PR · 홍보', '제휴 · 파트너십', '트레이드 마케터'],
  '기획 · 전략': ['서비스 기획자', '상품 기획(PM)', '사업 기획 · 개발', '전략 기획', '신사업 기획', '경영 컨설턴트'],
  '영업 · MD': ['B2B 영업', '영업 관리', '해외 영업', '기술 영업', '상품 MD', '바잉 MD', '유통 · 채널 관리'],
  '경영지원': ['인사(HR)', '채용 담당', '조직문화', '총무', '회계', '재무', '법무', '구매 · 조달'],
  '데이터 · IT': ['데이터 분석가', '비즈니스 분석가(BA)', '프론트엔드 개발자', '백엔드 개발자', 'AI · 머신러닝 엔지니어', 'QA 엔지니어'],
  '디자인 · 콘텐츠': ['UX · UI 디자이너', '브랜드 디자이너', '영상 PD', '에디터 · 카피라이터', '크리에이터 매니저'],
  '금융 · 공공': ['은행 · 금융 사무', '증권 · 자산운용', '보험', '공기업 사무', '공무원'],
  '유통 · 서비스': ['매장 관리', '고객 경험(CX)', '물류 · SCM', '호텔 · 관광'],
};
export const ALL_JOBS = Object.values(JOB_CATS).reduce<string[]>((a, l) => a.concat(l.filter((j) => !a.includes(j))), []);
export const normJob = (x: string) => x.replace(/[\s·()]/g, '').toLowerCase();
export const CERT_SUG = ['컴퓨터활용능력 1급', '한국사능력검정 1급', 'ADsP', '구글 애널리틱스 인증(GA4)', '사회조사분석사 2급', '검색광고마케터 1급', '유통관리사 2급', 'MOS Master'];
export const LANG_TESTS = ['TOEIC', 'TOEIC Speaking', 'OPIc', 'TOEFL', 'JLPT', 'HSK', '기타'];
export const GPA_SCALES = ['4.5', '4.3', '4.0'];
export const TOOLS = ['엑셀', 'PPT', '캔바', '포토샵', '일러스트레이터', '피그마', 'GA4', 'SQL', '파이썬', '노션'];
export const SRC_BTNS = [
  { key: 'notion', label: 'Notion', hint: '페이지 공유 링크', url: true, icon: 'M3 2.5h12v13H3zM6.5 12V6l5 6V6' },
  { key: 'file', label: 'PDF · 이력서', hint: '파일 여러 개', url: false, icon: 'M10.5 2H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 16h8a1.5 1.5 0 0 0 1.5-1.5V6L10.5 2zM10.5 2v4h4' },
  { key: 'gdoc', label: 'Google 문서', hint: '문서 링크', url: true, icon: 'M10.5 2H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 16h8a1.5 1.5 0 0 0 1.5-1.5V6L10.5 2zM6.5 9.5h5M6.5 12h5' },
  { key: 'link', label: '웹 링크', hint: '블로그 · 포트폴리오', url: true, icon: 'M7.5 10.5a3 3 0 0 0 4.2 0l2.5-2.5a3 3 0 0 0-4.2-4.2l-.8.8M10.5 7.5a3 3 0 0 0-4.2 0L3.8 10a3 3 0 0 0 4.2 4.2l.8-.8' },
] as const;
export const URL_PLACEHOLDER: Record<string, string> = {
  notion: 'notion.so/… 공유 링크 붙여넣기', gdoc: 'docs.google.com/… 링크 붙여넣기', link: '블로그 · 포트폴리오 주소 붙여넣기',
};
export const SOURCE_LABEL: Record<string, string> = { notion: 'Notion', file: 'PDF', gdoc: 'Google 문서', link: '웹 링크' };
export const CHAT_EX_LABELS = ['서포터즈로 SNS 콘텐츠 만들었어요', '공모전에서 장려상 받았어요'];
export const HOURS = ['5시간 이하', '5~10시간', '10~20시간', '20시간 이상'];
export const TIMINGS = ['2027 하반기', '2028 상반기', '2028 하반기', '2029 이후', '아직 모르겠어요'];
export const STYLES = ['온라인 강의', '책 · 아티클', '스터디', '실전 프로젝트', '멘토링'];
export const CERTAINTY = ['1 · 전혀 모르겠어요', '2', '3 · 반반', '4', '5 · 확실해요'];

/* ② 목표 · 프로필 */
export const GOAL_CHIPS = [
  { label: '내 경험에 맞는 직무 추천', key: 'fit' },
  { label: '숫자 다루는 일이 좋아요', key: 'num' },
  { label: '사람 만나는 일이 좋아요', key: 'people' },
  { label: '브랜드 vs 퍼포먼스 마케터', key: '' },
];
export const GOAL_INIT = [
  '어떤 일이 잘 맞을지 같이 찾아봐요. 좋아하는 것, 잘하는 것 뭐든 말해 주세요.',
  '마음에 드는 직무가 있으면 ‘목표로 설정’을 누르세요. 로드맵이 새 목표에 맞게 바뀌어요.',
];

/* ④ 학기별 로드맵 */
export const IC: Record<ItemKind, string> = {
  cert: 'M5 2.5h8v10l-4-2-4 2z',
  study: 'M3 3.5h12v11H3zM9 3.5v11',
  proj: 'M3 4.5h12v9H3zM6.5 9h5',
  act: 'M9 2.5l1.9 3.9 4.3.6-3.1 3 .7 4.3L9 12.3l-3.8 2 .7-4.3-3.1-3 4.3-.6z',
  intern: 'M3 6h12v8.5H3zM6.5 6V4h5v2',
  lang: 'M3 4h12v8H8l-3 2.5V12H3z',
  goal: 'M4 16V2.5M4 3h9.5l-2 3 2 3H4',
};
export const CHECK_PATH = 'M3.5 9.5l3.5 3.5 7.5-8';
export const LEGEND: [ItemKind, string][] = [['cert', '자격증'], ['study', '수업 · 강의'], ['proj', '프로젝트'], ['act', '대외활동 · 공모전'], ['intern', '인턴'], ['lang', '어학'], ['goal', '지원']];
export const TERMS = ['1학기', '여름방학', '2학기', '겨울방학'];
export const KIND: Record<ItemKind, string> = { cert: '자격증', study: '수업 · 강의', proj: '프로젝트', act: '대외활동', intern: '인턴', lang: '어학', goal: '지원' };

/* ⑤ 활동 관리 */
export const ACT_TYPES = ['교내 활동', '대외활동', '공모전', '프로젝트', '인턴십', '수상'];
export const COVERAGE_SKILLS = ['데이터 분석', '브랜드 전략', '시장 조사', '콘텐츠 기획', 'SNS 운영', '협업'];
export const STAR_K: [string, string, 's' | 't' | 'a' | 'r', string, string][] = [
  ['S', '상황', 's', '어떤 상황이었나요? 언제, 어디서, 어떤 문제가 있었는지 알려 주세요.', '예: 신제품 홍보 SNS 반응이 낮았어요'],
  ['T', '과제', 't', '그때 맡은 역할이나 목표는 무엇이었나요?', '예: 콘텐츠 담당으로 저장 수 2배가 목표였어요'],
  ['A', '행동', 'a', '목표를 위해 구체적으로 무엇을 했나요?', '예: 타깃 설문 후 릴스 포맷을 바꿔 주 3회 올렸어요'],
  ['R', '결과', 'r', '결과는 어땠나요? 숫자로 말할 수 있으면 더 좋아요.', '예: 4주 만에 저장 수가 2.3배 늘었어요'],
];
export const INFO_K: [string, string, string][] = [
  ['title', '활동명', '어떤 활동이었나요? 활동 이름을 알려 주세요.'],
  ['type', '유형', '어떤 종류의 활동이에요? 아래에서 골라도 돼요.'],
  ['period', '기간', '언제 했나요? (예: 2026.03 ~ 2026.06)'],
  ['role', '역할', '그 활동에서 맡은 역할은 무엇이었나요?'],
];
