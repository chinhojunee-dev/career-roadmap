'use client';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../components/AppShell';
import { Bubble, ChatChip, CopilotPanel } from '../components/CopilotPanel';
import { careerApi } from '../api';
import { GOAL_CHIPS, GOAL_INIT } from '../model/options';
import type { JobRec, Profile, ProfileRow } from '../model/types';
import { Button } from '@/shared/ui/Button';
import { Card, CardHead } from '@/shared/ui/Card';
import { Chip } from '@/shared/ui/Chip';
import { FLAG, IconTile } from '@/shared/ui/IconTile';

type Msg = { who: 'me' | 'bot'; text: string; recs?: JobRec[] };

export function GoalScreen() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [rows, setRows] = useState<ProfileRow[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>(GOAL_INIT.map((text) => ({ who: 'bot' as const, text })));
  const [draft, setDraft] = useState('');

  const refresh = useCallback(async () => {
    const [p, r] = await Promise.all([careerApi.getProfile(), careerApi.getProfileRows()]);
    setProfile(p); setRows(r);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  if (!profile) return <AppShell active="/goal" defaultOpen={false} mainStyle={{ padding: 0, overflow: 'hidden' }}><span /></AppShell>;
  const goal = profile.goalJob;
  const changed = goal !== profile.baselineJob;

  const ask = async (text: string, key?: string) => {
    setMsgs((m) => [...m, { who: 'me', text }]);
    setDraft('');
    const r = await careerApi.chat({ scope: 'goal', text, key });
    setMsgs((m) => [...m, { who: 'bot', text: r.text, recs: r.recs }]);
  };
  const send = () => { const t = draft.trim(); if (t) ask(t); };

  const setGoal = async (job: string) => {
    await careerApi.saveProfile({ goalJob: job, undecided: false });
    setMsgs((m) => [...m, { who: 'bot', text: `목표를 ‘${job}’(으)로 바꿨어요. 오른쪽에서 로드맵을 다시 채울 수 있어요.` }]);
    refresh();
  };
  const undo = async () => { await careerApi.saveProfile({ goalJob: profile.baselineJob }); refresh(); };

  return (
    <AppShell active="/goal" defaultOpen={false} goal={goal} hireTerm={profile.timing} mainStyle={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
        {/* 진로 채팅 */}
        <CopilotPanel label="진로 코파일럿" title="✦ 진로 코파일럿" subtitle="직무 찾기 · 목표 바꾸기" width={520}
          placeholder="좋아하는 일, 궁금한 직무를 물어보세요" ariaInput="진로 코파일럿에게 보내기" draft={draft} onDraft={setDraft} onSend={send}>
          {msgs.map((m, i) => (
            <Fragment key={i}>
              <Bubble me={m.who === 'me'}>{m.text}</Bubble>
              {m.recs && (
                <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {m.recs.map((r) => (
                    <div key={r.job} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--neutral-900)' }}>{r.job}</span><Chip>적합도 {r.match}%</Chip>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--neutral-700)', marginTop: 3 }}>{r.why}</div>
                      </div>
                      <button type="button" className="cr-opt" aria-pressed={goal === r.job} style={{ flexShrink: 0 }}
                        onClick={() => { if (goal !== r.job) setGoal(r.job); }}>{goal === r.job ? '✓ 현재 목표' : '목표로 설정'}</button>
                    </div>
                  ))}
                </div>
              )}
            </Fragment>
          ))}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
            {GOAL_CHIPS.map((c) => <ChatChip key={c.label} onClick={() => ask(c.label, c.key)}>{c.label}</ChatChip>)}
          </div>
        </CopilotPanel>

        {/* 목표 · 프로필 */}
        <section className="fs-work" aria-label="목표와 프로필">
          <div className="fs-topbar"><h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--neutral-900)' }}>목표 · 프로필</h1></div>
          <div className="fs-scroll">
            <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Card label="현재 목표" style={{ gap: 14 }}>
                <CardHead><span className="cr-over">현재 목표</span>{changed && <Chip tone="hot">방금 바뀜</Chip>}</CardHead>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <IconTile d={FLAG} style={{ width: 44, height: 44, background: 'var(--blue-500)', color: '#fff' }} />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>{goal}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {profile.industries.slice(0, 2).map((i) => <Chip key={i}>{i}</Chip>)}<Chip tone="n">{profile.timing}</Chip>
                    </div>
                  </div>
                </div>
                {changed && (
                  <div className="cr-banner" style={{ padding: '10px 12px' }}>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>새 목표에 맞게 로드맵을 다시 채울까요?</span>
                    <Button variant="outline" onClick={undo}>되돌리기</Button>
                    <Link className="btn btn-jitter" href="/roadmap" onClick={() => careerApi.markRoadmapFilled()}>✦ 로드맵 다시 채우기</Link>
                  </div>
                )}
              </Card>

              <Card label="내 프로필" style={{ gap: 4 }}>
                <CardHead style={{ marginBottom: 6 }}><h2 className="cr-card-title">내 프로필</h2><Link className="cr-link" href="/onboarding">처음부터 다시 입력</Link></CardHead>
                {rows.map((p) => (
                  <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--border)' }}>
                    <span style={{ width: 88, flexShrink: 0, fontSize: 12.5, fontWeight: 800, color: 'var(--neutral-700)' }}>{p.label}</span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 700, color: 'var(--neutral-900)' }}>{p.value}</span>
                    <Link className="cr-opt" href={p.target === 'activities' ? '/activities' : '/onboarding'} style={{ padding: '5px 12px', fontSize: 12 }}>수정</Link>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
