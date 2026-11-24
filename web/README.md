# 커리어 로드맵 (web)

시안(`career-roadmap-handoff`)을 구현한 Next.js 15 + TypeScript + React 앱. 화면 5개: 프로필 입력 · 목표/프로필 · 현재 내 상황 · 학기별 로드맵 · 활동 관리.

## 실행
```bash
npm install
npm run dev                      # 개발 (토큰 CSS 자동 생성)
npm run build && npm start       # 운영 (루트 경로)
```

### 수원대 실습 서버 (6000번 포트, https://ahnbi4.suwon.ac.kr:5400/<아이디>/)
프록시가 `/<아이디>` 를 떼고 전달하므로, 접두사로 빌드하고 `server.mjs` 로 띄운다.
```bash
BASE_PATH=/$JUPYTERHUB_USER npm run build
nohup env BASE_PATH=/$JUPYTERHUB_USER PORT=6000 node server.mjs > web.log 2>&1 &
```
이전 FastAPI 앱(`../main.py`, `../static/`)은 그대로 있다: `cd .. && python3 -m uvicorn main:app --host 0.0.0.0 --port 6000`

## 구조
- `ds/introtyche/tokens.json` → `npm run tokens` → `src/styles/tokens.css` (색·폰트·간격·라운드·그림자 변수)
- `src/styles/tokens-overrides.css` 시안 `links.css` 가 덮어쓰던 값(라운드 14px, 다크 색). 지우면 tokens.json 원래 값
- `src/styles/design.css` 시안 CSS 중 쓰는 규칙만 이식 (`scripts/port-css.py`)
- `src/shared/ui/` 공통 컴포넌트 · `src/features/career-roadmap/` 화면·API·mock
- 데이터는 `api/CareerApi.ts` 인터페이스로만 접근. 지금은 `api/mock/` (sessionStorage). AI 호출: `chat` · `importActivities` · `getAssessment`

## 검증
`node scripts/shot.mjs <out>` 시안 캡처 조건으로 촬영 · `node scripts/e2e.mjs [baseUrl]` 상호작용 49개 확인 (Playwright 필요)
