"""맞춤형 커리어 로드맵 생성기 (규칙 기반, 외부 API 없음).

실행: uvicorn main:app --host 0.0.0.0 --port 6000
"""
from datetime import date
from pathlib import Path
from urllib.parse import quote

from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel

BASE = Path(__file__).parent
app = FastAPI()


class Profile(BaseModel):
    school: str = ""
    major: str = ""
    grade: str = ""            # 1~4학년, 졸업예정, 졸업생
    graduation: str = ""       # YYYY-MM
    gpa: float | None = None   # 4.5 만점 기준
    gpa_scale: float = 4.5
    region: str = ""
    hire_when: str = ""        # YYYY-MM
    job: str = ""
    industries: list[str] = []
    companies: list[str] = []
    alt_jobs: list[str] = []


# ---------------------------------------------------------------- 직무 지식
JOBS = {
    "데이터 분석가": {
        "keys": ["데이터 분석", "분석가", "bi", "애널리스트", "데이터분석"],
        "skills": ["SQL (조인·윈도우 함수·서브쿼리)", "Python (pandas, matplotlib)", "통계/A·B 테스트",
                   "시각화 도구 (Tableau·Power BI·Looker)", "지표 설계와 비즈니스 해석"],
        "projects": ["공공/캐글 데이터로 문제 정의 → 분석 → 인사이트 보고서 1건",
                     "서비스 로그 기반 퍼널·리텐션 분석 대시보드", "A/B 테스트 설계·해석 사례 정리"],
        "certs": ["SQLD", "ADsP", "빅데이터분석기사"],
    },
    "데이터 엔지니어": {
        "keys": ["데이터 엔지니어", "엔지니어링", "etl", "파이프라인"],
        "skills": ["SQL 심화·데이터 모델링", "Python + 리눅스/Git", "Airflow 등 워크플로 오케스트레이션",
                   "Spark/배치·스트리밍 처리", "클라우드 (AWS·GCP) 와 Docker"],
        "projects": ["수집 → 적재 → 마트 ETL 파이프라인 구축 (Airflow + DB)", "대용량 데이터 Spark 처리 성능 개선",
                     "데이터 품질 검증 자동화"],
        "certs": ["SQLD", "AWS Cloud Practitioner/SAA", "정보처리기사"],
    },
    "ML/AI 엔지니어": {
        "keys": ["ml", "ai", "머신러닝", "딥러닝", "인공지능", "데이터 사이언티스트", "데이터 과학", "사이언티스트", "nlp", "llm"],
        "skills": ["Python · PyTorch", "선형대수·확률통계 기초", "모델 학습/평가/오류 분석",
                   "MLOps 기초 (실험 관리·서빙)", "LLM/RAG 활용 및 평가"],
        "projects": ["논문/대회 재현 + 개선 실험 1건", "모델을 API 로 서빙한 end-to-end 서비스",
                     "Kaggle/Dacon 상위권 또는 오픈소스 기여"],
        "certs": ["정보처리기사", "AWS ML Specialty (선택)", "빅데이터분석기사"],
    },
    "백엔드 개발자": {
        "keys": ["백엔드", "서버", "backend", "개발자", "소프트웨어"],
        "skills": ["자료구조·알고리즘 (코딩테스트)", "Java/Spring 또는 Python/Node 백엔드 프레임워크",
                   "RDB 설계와 쿼리 튜닝", "REST API·인증·테스트", "Docker·CI/CD·클라우드 배포"],
        "projects": ["인증·결제·게시판이 있는 서비스 배포 (실사용자 확보)", "트래픽/성능 개선 사례 정리",
                     "팀 프로젝트 (협업 PR·코드리뷰 이력)"],
        "certs": ["정보처리기사", "SQLD", "AWS SAA"],
    },
    "프론트엔드 개발자": {
        "keys": ["프론트", "frontend", "웹 개발", "ui"],
        "skills": ["JavaScript/TypeScript", "React 등 컴포넌트 프레임워크", "웹 표준·접근성·성능",
                   "상태 관리·API 연동", "디자인 시스템과 협업 도구"],
        "projects": ["반응형 서비스 1건 배포", "Lighthouse 점수 개선 사례", "오픈소스 UI 라이브러리 기여"],
        "certs": ["정보처리기사"],
    },
    "서비스 기획/PM": {
        "keys": ["기획", "pm", "po", "프로덕트", "서비스 기획"],
        "skills": ["문제 정의·가설 수립", "데이터 기반 의사결정 (SQL 기초, 지표)", "와이어프레임 (Figma)",
                   "PRD·스토리 작성", "이해관계자 커뮤니케이션"],
        "projects": ["기존 앱 개선안 기획서 (문제 → 가설 → 기능 → 지표)", "MVP 기획·출시 경험", "사용자 인터뷰·리서치 리포트"],
        "certs": ["GA4/구글 애널리틱스", "SQLD"],
    },
    "마케터": {
        "keys": ["마케팅", "마케터", "퍼포먼스", "콘텐츠"],
        "skills": ["퍼포먼스 마케팅 (광고 매체·GA4)", "데이터 분석·리포팅", "카피/콘텐츠 기획",
                   "CRM·리텐션 전략", "엑셀/SQL 기초"],
        "projects": ["실제 계정 운영 후 성과 리포트", "브랜드 캠페인 기획안", "공모전 수상 또는 참가"],
        "certs": ["GAIQ", "ADsP", "컴퓨터활용능력 1급"],
    },
}
GENERIC = {
    "skills": ["직무 핵심 도구/언어 1~2개 심화", "엑셀·문서/발표 역량", "직무 관련 데이터 활용 기초", "협업 도구 (Git·Notion·Slack)"],
    "projects": ["직무 관련 포트폴리오 1건 (문제 → 해결 → 성과)", "공모전/대외활동 1건"],
    "certs": ["직무 관련 자격증 (공고에서 우대 사항 확인)"],
}

HIRING_SEASON = {
    "대기업/제조": "상반기 공채 3~5월, 하반기 공채 8~10월 (인턴 → 전환형이 많음)",
    "IT/플랫폼": "수시 채용 중심. 코딩테스트·과제 전형이 많고 인턴 전환이 흔함",
    "금융": "상·하반기 공채 + 디지털/IT 직군 수시. 자격증 가산점 확인",
    "공공/공기업": "NCS 필기 + 전공. 상·하반기 공고, 청년인턴 병행",
    "스타트업": "상시 수시 채용. 포트폴리오와 즉시 투입 가능한 실무 역량이 핵심",
}


def job_links(q: str) -> list[dict]:
    """채용 사이트 검색 결과로 바로 가는 링크 (검색어만 URL 인코딩, 외부 호출 없음)."""
    e = quote(q)
    return [
        {"site": "사람인", "url": f"https://www.saramin.co.kr/zf_user/search/recruit?searchword={e}"},
        {"site": "잡코리아", "url": f"https://www.jobkorea.co.kr/Search/?stext={e}"},
        {"site": "원티드", "url": f"https://www.wanted.co.kr/search?query={e}&tab=position"},
        {"site": "점핏", "url": f"https://www.jumpit.co.kr/search?keyword={e}"},
    ]


def match_job(text: str) -> tuple[str, dict]:
    t = text.lower().strip()
    if not t:
        return "", GENERIC
    for name, d in JOBS.items():
        if name.lower() == t or any(k in t for k in d["keys"]):
            return name, d
    return text, GENERIC


def parse_ym(s: str) -> date | None:
    try:
        y, m = s.split("-")[:2]
        return date(int(y), int(m), 1)
    except Exception:
        return None


def add_months(d: date, n: int) -> date:
    i = d.year * 12 + d.month - 1 + n
    return date(i // 12, i % 12 + 1, 1)


def months_between(a: date, b: date) -> int:
    return (b.year - a.year) * 12 + b.month - a.month


def fmt(d: date) -> str:
    return f"{d.year}.{d.month:02d}"


def industry_kind(ind: str) -> str | None:
    for k in HIRING_SEASON:
        if any(p in ind for p in k.replace("/", " ").split()) or ind in k:
            return k
    m = {"반도체": "대기업/제조", "자동차": "대기업/제조", "제조": "대기업/제조", "게임": "IT/플랫폼", "it": "IT/플랫폼",
         "플랫폼": "IT/플랫폼", "핀테크": "금융", "은행": "금융", "보험": "금융", "증권": "금융", "공공": "공공/공기업"}
    low = ind.lower()
    for key, v in m.items():
        if key in low:
            return v
    return None


def semester_plan(today: date, hire: date, sub: str, jd: dict, grad: date | None) -> list[dict]:
    """오늘 ~ 입사 목표 사이를 학기/방학 단위로 쪼개 준비 항목을 만든다. (3~6월 1학기, 7~8월 여름방학, 9~12월 2학기, 1~2월 겨울방학)"""
    def seg_key(d: date):
        m = d.month
        if 3 <= m <= 6:
            return (d.year, "1학기")
        if 7 <= m <= 8:
            return (d.year, "여름방학")
        if 9 <= m <= 12:
            return (d.year, "2학기")
        return (d.year - 1, "겨울방학")

    segs: list[dict] = []
    d = today
    while d < hire and len(segs) < 10:
        key = seg_key(d)
        if not segs or segs[-1]["key"] != key:
            segs.append({"key": key, "start": d, "end": d})
        segs[-1]["end"] = add_months(d, 1)
        d = add_months(d, 1)

    skills, projects, certs = jd["skills"], jd["projects"], jd["certs"]
    out = []
    for i, sg in enumerate(segs):
        year, kind = sg["key"]
        vac = kind.endswith("방학")
        left = months_between(sg["start"], hire)
        stage = "기초" if left >= 12 else "경험" if left >= 6 else "지원"
        label = f"{year}-{str(year + 1)[2:]} 겨울방학" if kind == "겨울방학" else f"{year}년 {kind}"
        sk = skills[i % len(skills)]
        pj = projects[i % len(projects)]
        t: list[str] = []
        tip = ""
        if stage == "기초":
            if vac:
                t += [f"집중 학습: {sk}", f"자격증 1개 집중 준비: {', '.join(certs[:2])}" if certs else "관련 온라인 강의 1개 완주",
                      f"{sub} 현직자 커피챗 2건, 채용공고 10건 분석"]
            else:
                t += [f"{sub}와 연관된 전공 과목 우선 수강, 과제를 포트폴리오로 기록", f"주 3시간 자기주도 학습: {sk}",
                      "학점 관리 + 학과 연구실·학회·동아리 탐색"]
        elif stage == "경험":
            if vac:
                t += [f"인턴·부트캠프·공모전 중 1개 참여 (채용연계형 우선)", f"프로젝트: {pj}", "포트폴리오(GitHub/노션) 초안 작성"]
            else:
                t += [f"팀 프로젝트로 연결: {pj}", f"학습 병행: {sk}", "프로젝트별 '문제-행동-성과' 정리, 학점 방어"]
        else:
            if vac:
                t += ["이력서·자소서 마스터본 완성, 공고별 맞춤 수정", "목표 공고 주 5건 이상 지원 + 모의 면접 주 1회",
                      "채용연계형 인턴·계약직 지원 병행"]
            else:
                t += ["수강 부담 최소화(필수 과목 위주), 지원·면접 시간 확보", "지원 현황 스프레드시트 관리, 포트폴리오 막판 보완",
                      "직무 면접 기출·프로젝트 3분 설명 연습"]
        months = {add_months(sg["start"], k).month for k in range(max(months_between(sg["start"], sg["end"]), 1))}
        if months & {9, 10, 11}:
            tip = "하반기 공채 시즌(9~11월)이에요. 대기업·금융권 지원서 마감을 캘린더에 먼저 넣으세요."
        elif months & {3, 4, 5, 6}:
            tip = "상반기 공채·수시채용 시즌(3~6월)이에요. 공고 알림을 켜 두세요."
        if grad and sg["start"] <= grad < sg["end"]:
            tip = (tip + " " if tip else "") + "이 시기에 졸업 예정이에요. 졸업 요건(학점·필수 과목·영어 등)을 미리 확인하세요."
        out.append({"label": label, "kind": "방학" if vac else "학기", "stage": stage,
                    "period": f"{fmt(sg['start'])} ~ {fmt(min(sg['end'], hire))}", "tasks": t, "tip": tip})
    return out


# ---------------------------------------------------------------- 생성
@app.post("/api/roadmap")
def roadmap(p: Profile):
    today = date.today().replace(day=1)
    hire = parse_ym(p.hire_when)
    grad = parse_ym(p.graduation)
    job_name, jd = match_job(p.job)

    notes: list[str] = []   # 진단
    warns: list[str] = []

    # ---- 기간
    if not hire:
        hire = add_months(today, 8)
        warns.append("취업 희망 시기가 없어 8개월 뒤로 가정했어요.")
    total = max(months_between(today, hire), 1)

    # ---- 진단: 시기
    if grad:
        gap = months_between(grad, hire)
        if gap < 0:
            notes.append(f"졸업({fmt(grad)}) 전에 입사({fmt(hire)})하는 일정이에요. 조기 채용·채용연계형 인턴, 학점 이수 일정 조율이 필요해요.")
        elif gap == 0:
            notes.append("졸업과 입사 시기가 같아요. 졸업 6개월 전부터 지원이 시작된다고 보고 일정을 짰어요.")
        elif gap > 6:
            notes.append(f"졸업 후 {gap}개월 뒤 입사 계획이에요. 졸업 후 공백이 길어지지 않도록 인턴·계약직·프로젝트로 경력 공백을 메우세요.")
    if total <= 3:
        warns.append(f"남은 기간이 {total}개월로 짧아요. 새 기술 학습보다 기존 경험 정리와 지원에 집중하는 압축 일정으로 짰어요.")

    # ---- 진단: 학점
    if p.gpa is not None and p.gpa_scale:
        r = p.gpa / p.gpa_scale
        s45 = r * 4.5
        if r >= 0.89:
            notes.append(f"학점 {p.gpa}/{p.gpa_scale} 는 강점이에요. 서류에서 적극 어필하고 장학·우수 성적을 부각하세요.")
        elif s45 >= 3.0:
            notes.append(f"학점 {p.gpa}/{p.gpa_scale} 는 대부분의 서류 기준(4.5 만점 환산 3.0 안팎)을 통과하는 수준이에요. 학점보다 프로젝트·직무 경험으로 차별화하세요.")
        else:
            notes.append(f"학점 {p.gpa}/{p.gpa_scale} (4.5 환산 {s45:.2f}) 는 학점 컷이 있는 공채·공기업에서 불리할 수 있어요. "
                         "남은 학기 성적 상승, 학점 무관 수시채용·스타트업·중견 우선 지원, 포트폴리오 강화가 필요해요.")

    # ---- 진단: 전공 vs 직무
    if p.major and job_name and job_name in JOBS:
        related = any(k in p.major for k in ["데이터", "컴퓨터", "소프트", "통계", "수학", "정보", "AI", "인공지능", "산업공학"])
        if job_name in ("데이터 분석가", "데이터 엔지니어", "ML/AI 엔지니어", "백엔드 개발자", "프론트엔드 개발자"):
            if related:
                notes.append(f"{p.major} 전공은 {job_name} 직무와 직결돼요. 전공 수업의 프로젝트·과제를 포트폴리오로 바로 전환할 수 있어요.")
            else:
                notes.append(f"{p.major} 전공에서 {job_name} 로 가려면 전공 연관성을 보완해야 해요. 부트캠프·학점은행제·프로젝트로 학습 이력을 증명하세요.")

    # ---- 지역
    if p.region:
        notes.append(f"거주지({p.region}) 기준으로 통근 가능한 지역과 이주 가능 여부를 정해 두면 지원 범위를 정리하기 쉬워요. "
                     "해당 지역 일자리센터·대학 취업지원센터·지자체 청년 프로그램도 확인하세요.")

    # ---- 단계 분할
    phases = []
    if total <= 3:
        cuts = [(0, max(total - 2, 0) or 1, "정리", "경험 정리 & 포트폴리오 보완"),
                (max(total - 2, 0) or 1, total, "지원", "집중 지원 & 면접")]
    else:
        a = max(round(total * 0.35), 1)
        b = max(round(total * 0.35), 1)
        a2 = min(a, total - 2)
        b2 = min(a2 + b, total - 1)
        cuts = [(0, a2, "기초", "기초 역량 다지기"), (a2, b2, "경험", "프로젝트 & 실전 경험"), (b2, total, "지원", "지원 & 면접 집중")]

    skills = jd["skills"]
    projects = jd["projects"]
    certs = jd["certs"]
    sub = job_name or "희망 직무"

    for i, (s, e, tag, title) in enumerate(cuts):
        s_d, e_d = add_months(today, s), add_months(today, e)
        item = {"tag": tag, "title": title, "period": f"{fmt(s_d)} ~ {fmt(e_d)}", "months": e - s, "tasks": []}
        t = item["tasks"]
        if tag == "기초":
            t.append(f"{sub} 채용공고 10건 이상을 분석해 요구 역량 빈도표 만들기")
            t += [f"학습: {x}" for x in skills[: max(3, len(skills) // 2 + 1)]]
            if certs:
                t.append(f"자격증 일정 확인 및 1개 취득 목표: {', '.join(certs[:2])}")
            t.append("현직자 커피챗/직무 인터뷰 2건 (대학 선배, LinkedIn, 취업지원센터)")
        elif tag == "경험":
            t += [f"프로젝트: {x}" for x in projects[:2]]
            t += [f"심화 학습: {x}" for x in skills[max(3, len(skills) // 2 + 1):]] or []
            t.append("인턴·공모전·연구실 참여 중 1개 이상 지원 (채용연계형 우선)")
            t.append("GitHub/노션 포트폴리오 초안 + 프로젝트별 '문제-행동-성과' 정리")
        elif tag == "지원":
            t.append("이력서·자소서 마스터본 완성 후 공고별로 맞춤 수정")
            t.append("목표 공고 주 5건 이상 지원, 지원 현황 스프레드시트로 관리")
            t.append("모의 면접 주 1회 (직무 면접 + 인성 면접), 프로젝트 설명 3분 버전 준비")
            if jd is not GENERIC and ("개발" in sub or "엔지니어" in sub):
                t.append("코딩테스트 주 3회 (프로그래머스/백준)")
            if jd is not GENERIC and "분석" in sub:
                t.append("SQL·통계 면접 기출 정리, 케이스 분석 과제 연습")
        elif tag == "정리":
            t.append("보유 경험·프로젝트를 이력서 문장으로 재정리 (성과 수치화)")
            t.append("포트폴리오 보완 1건 (가장 약한 부분 위주)")
        else:
            t.append("목표 공고 주 7건 이상 지원 + 면접 준비 병행")
        phases.append(item)

    # ---- 산업 / 기업
    targets = []
    for ind in p.industries:
        k = industry_kind(ind)
        msg = HIRING_SEASON.get(k, f"'{ind}' 분야는 아래 검색 링크로 현재 올라온 공고의 채용 시기와 요구 역량을 바로 확인할 수 있어요.")
        targets.append({"name": ind, "type": "산업", "advice": msg, "links": job_links(f"{ind} {p.job}".strip())})
    for c in p.companies:
        targets.append({"name": c, "type": "기업",
                        "advice": "채용 홈페이지 알림 설정, 최근 3년 채용공고·기술블로그·IR 자료 읽기, "
                                  "합격 후기로 전형 단계 파악. 같은 산업의 대체 기업 3곳을 함께 지원 리스트에 넣기",
                        "links": job_links(f"{c} {p.job}".strip())})

    # ---- 대체 직무
    alts = []
    for a in p.alt_jobs:
        an, ad = match_job(a)
        common = [s for s in ad["skills"] if any(w in " ".join(skills) for w in s.split()[:1])]
        add = [s for s in ad["skills"] if s not in skills][:3]
        alts.append({
            "name": an,
            "overlap": common[:3],
            "extra": add,
            "advice": f"{sub} 준비와 겹치는 역량은 그대로 쓰고, 추가로 위 항목만 보완하면 병행 지원이 가능해요. "
                      "지원 비중은 1순위 70 : 대체 30 정도로 시작해 보세요."})

    # ---- 주간 루틴
    routine = ["평일 2시간: 학습/프로젝트", "주말 4시간: 포트폴리오·지원서", "매주 일요일: 지원 현황·학습 회고 15분"]

    return {
        "summary": {
            "headline": f"{p.school or '내'} {p.major or ''} {p.grade or ''} → {sub} ({fmt(hire)} 입사 목표)".replace("  ", " "),
            "total_months": total,
            "start": fmt(today),
            "end": fmt(hire),
        },
        "notes": notes, "warnings": warns, "phases": phases,
        "skills": skills, "projects": projects, "certs": certs,
        "targets": targets, "alts": alts, "routine": routine,
        "semesters": semester_plan(today, hire, sub, jd, grad),
    }


@app.get("/")
def index():
    return FileResponse(BASE / "static" / "index.html")
