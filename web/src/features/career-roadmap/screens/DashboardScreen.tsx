'use client';
import Link from 'next/link';
import { AppShell } from '../components/AppShell';
import { careerApi } from '../api';
import { useCareerData } from '../hooks/useCareerData';
import { Button } from '@/shared/ui/Button';
import { Card, CardHead } from '@/shared/ui/Card';
import { Chip } from '@/shared/ui/Chip';
import { ProgressBar } from '@/shared/ui/ProgressBar';
import { ProgressRing } from '@/shared/ui/ProgressRing';

// gap 3+ 매우 부족 · 2 부족 · 1 보통 · 0 충분 — 색이 아니라 명도 + 단어로 구분
const GRADE = (g: number) => (g >= 3 ? { label: '매우 부족', tone: 'hot' } : g === 2 ? { label: '부족', tone: '' } : g === 1 ? { label: '보통', tone: 'line' } : { label: '충분', tone: 'n' }) as { label: string; tone: '' | 'n' | 'hot' | 'line' };

const label = (t: string, s?: React.CSSProperties) => <div className="cr-over" style={s}>{t}</div>;
const val: React.CSSProperties = { fontSize: 15, fontWeight: 800, color: 'var(--neutral-900)', marginTop: 2 };
const Divider = () => <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--border)' }} />;

export function DashboardScreen() {
  const [a] = useCareerData(() => careerApi.getAssessment());
  const [profile] = useCareerData(() => careerApi.getProfile());
  if (!a || !profile) return <AppShell active="/dashboard" defaultOpen><span /></AppShell>;

  const counts = [3, 2, 1, 0].map((g) => ({ ...GRADE(g), n: a.comps.filter((c) => GRADE(c.target - c.cur).label === GRADE(g).label).length }));
  const sorted = [...a.comps].sort((x, y) => (y.target - y.cur) - (x.target - x.cur));
  const top = [...a.comps].sort((x, y) => (y.target - y.cur) * y.w - (x.target - x.cur) * x.w).slice(0, 3);

  return (
    <AppShell active="/dashboard" defaultOpen mainStyle={{ overflowY: 'auto' }}>
      <div className="view active cr-view" style={{ maxWidth: 'none', gap: 14 }}>
        <div className="cr-head">
          <div className="view-head" style={{ margin: 0 }}><h1>현재 내 상황</h1></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Chip tone="n">{profile.goalJob} 기준</Chip>
            <Button variant="outline">✦ 다시 분석</Button>
          </div>
        </div>

        {/* 요약 한 줄 */}
        <Card label="요약" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 28, padding: '16px 22px' }}>
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <ProgressRing value={a.overall} label={`준비도 ${a.overall}퍼센트`} />
              <div>{label('준비도')}<div style={val}>목표까지 절반 전</div></div>
            </div>
            <Divider />
            <div>{label('지금 위치')}<div style={val}>{a.position}</div><div style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>{a.stage}</div></div>
            <Divider />
            <div style={{ display: 'flex', gap: 22 }}>{a.specs.map((p) => <div key={p.k}>{label(p.k)}<div style={val}>{p.v}</div></div>)}</div>
            <Divider />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{counts.map((c) => <Chip key={c.label} tone={c.tone}>{c.label} {c.n}</Chip>)}</div>
          </>
        </Card>

        <div className="cr-dash-grid">
          {/* 역량 비교 */}
          <Card label="역량 현재 수준과 목표 수준">
            <CardHead title="역량 · 현재 vs 목표">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11.5, fontWeight: 700, color: 'var(--neutral-700)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 14, height: 8, borderRadius: 999, background: 'var(--blue-500)' }} />현재</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 3, height: 14, borderRadius: 2, background: 'var(--neutral-900)' }} />목표</span>
              </div>
            </CardHead>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {sorted.map((c) => {
                const g = GRADE(c.target - c.cur);
                return (
                  <div className="cr-comp-row" key={c.name}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>{c.name}</span>
                    <ProgressBar pct={(c.cur / 5) * 100} mark={(c.target / 5) * 100} label={`${c.name} 현재 ${c.cur}, 목표 ${c.target} (5점 만점)`} role="img" />
                    <span style={{ justifySelf: 'end' }}><Chip tone={g.tone}>{g.label}</Chip></span>
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
            {/* 먼저 채울 역량 */}
            <Card label="먼저 채울 역량">
              <CardHead title="먼저 채울 역량"><Link className="cr-link" href="/roadmap">로드맵 보기 →</Link></CardHead>
              {top.map((c, i) => {
                const g = GRADE(c.target - c.cur);
                return (
                  <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <span style={{ width: 24, height: 24, borderRadius: 999, display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 800, background: 'var(--blue-500)', color: '#fff' }}>{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--neutral-900)' }}>{c.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue-700)', marginTop: 2 }}>{c.plan ?? ''}</div>
                    </div>
                    <Chip tone={g.tone}>{g.label}</Chip>
                  </div>
                );
              })}
            </Card>
            {/* 강점 */}
            <Card label="이미 갖춘 강점" style={{ gap: 10 }}>
              <h2 className="cr-card-title">이미 갖춘 강점</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{a.strengths.map((s) => <Chip key={s} tone="line">{s}</Chip>)}</div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
