'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '../components/AppShell';
import { Bubble, ChatChip, CopilotPanel } from '../components/CopilotPanel';
import { careerApi } from '../api';
import { ACT_TYPES, COVERAGE_SKILLS, INFO_K, STAR_K } from '../model/options';
import type { Activity, Star } from '../model/types';
import { Button } from '@/shared/ui/Button';
import { Card, CardHead } from '@/shared/ui/Card';
import { Chip } from '@/shared/ui/Chip';
import { Field, Input, Textarea } from '@/shared/ui/Field';
import { OptionChip } from '@/shared/ui/OptionChip';

type ChatMsg = { who: 'me' | 'bot'; text: string };
type Info = { title: string; type: string; period: string; role: string };
type Editor = {
  isNew: boolean; idx: number; phase: 'info' | 'star'; infoStep: number; info: Info; star: Star; step: number; chat: ChatMsg[]; editKey: keyof Star | null;
};
const EMPTY_STAR: Star = { s: '', t: '', a: '', r: '' };

export function ActivitiesScreen() {
  const [acts, setActs] = useState<Activity[] | null>(null);
  const [type, setType] = useState('전체');
  const [ed, setEd] = useState<Editor | null>(null);
  const [draft, setDraft] = useState('');
  useEffect(() => { careerApi.listActivities().then(setActs); }, []);
  if (!acts) return <AppShell active="/activities" defaultOpen><span /></AppShell>;

  const list = acts.filter((a) => type === '전체' || a.type === type);
  const commit = (next: Activity[]) => { setActs(next); careerApi.saveActivities(next); };

  /* ── 편집기 시작 ── */
  const startEd = (idx: number): Editor => {
    const a = acts[idx];
    const star = { ...EMPTY_STAR, ...a.star };
    let step = STAR_K.findIndex((q) => !star[q[2]]);
    if (step < 0) step = 0;
    const cur = star[STAR_K[step][2]];
    return {
      isNew: false, idx, phase: 'star', infoStep: 4, info: { title: a.title, type: a.type, period: a.period, role: a.role }, star, step, editKey: null,
      chat: [
        { who: 'bot', text: `‘${a.title}’을(를) STAR로 정리해 볼게요. 편하게 말하면 제가 다듬어 둘게요.` },
        { who: 'bot', text: STAR_K[step][3] + (cur ? ` 지금은 “${cur}”라고 돼 있어요.` : '') },
      ],
    };
  };
  const newEd = (): Editor => ({
    isNew: true, idx: -1, phase: 'info', infoStep: 0, info: { title: '', type: '', period: '', role: '' }, star: { ...EMPTY_STAR }, step: 0, editKey: null,
    chat: [{ who: 'bot', text: '새 활동을 같이 정리해 볼게요. Notion이나 파일이 있으면 아래 버튼으로 가져와도 돼요.' }, { who: 'bot', text: INFO_K[0][2] }],
  });
  const open = (e: Editor) => { setEd(e); setDraft(''); };

  /* ── 채팅 답변 처리 (AI 호출은 careerApi.chat 하나) ── */
  const answer = async (text: string, keep: boolean) => {
    if (!ed) return;
    setDraft('');
    if (ed.phase === 'info') {
      const iq = INFO_K[ed.infoStep];
      const info = { ...ed.info }; if (!keep) (info as Record<string, string>)[iq[0]] = text;
      const nx = ed.infoStep + 1, fin = nx >= INFO_K.length;
      const next = fin ? `이제 STAR로 정리해 볼게요. ${STAR_K[0][3]}` : INFO_K[nx][2];
      const r = await careerApi.chat({ scope: 'activity', mode: 'info', label: iq[1], text, keep, next });
      setEd({ ...ed, info, infoStep: nx, phase: fin ? 'star' : 'info', step: 0, chat: [...ed.chat, { who: 'me', text }, { who: 'bot', text: r.text }] });
      return;
    }
    const q = STAR_K[Math.min(ed.step, 3)];
    const star = { ...ed.star }; if (!keep) star[q[2]] = text;
    const nx = ed.step + 1;
    const r = await careerApi.chat({ scope: 'activity', mode: 'star', label: q[1], text, keep, next: nx < 4 ? STAR_K[nx][3] : null });
    setEd({ ...ed, star, step: Math.min(nx, 4), chat: [...ed.chat, { who: 'me', text }, { who: 'bot', text: r.text }] });
  };
  const send = () => { const v = draft.trim(); if (v) answer(v, false); };
  const importFill = async () => {
    if (!ed) return;
    const d = await careerApi.importActivityDraft();
    setEd({
      ...ed, info: d.info, star: d.star, phase: 'star', infoStep: 4, step: 4,
      chat: [...ed.chat, { who: 'me', text: 'Notion · 파일에서 가져오기' }, { who: 'bot', text: '파일에서 활동 1개를 찾아 STAR로 정리했어요. 오른쪽에서 확인하고 저장해 주세요.' }],
    });
  };
  const save = () => {
    if (!ed) return;
    if (ed.isNew) {
      const i = ed.info;
      commit([{ type: i.type || '기타', title: i.title || '새 활동', period: i.period || '기간 미입력', role: i.role || '역할 미입력', skills: [], star: ed.star }, ...acts]);
      setType('전체');
    } else {
      commit(acts.map((a, i) => (i === ed.idx ? { ...a, star: ed.star } : a)));
    }
    setEd(null);
  };

  /* ═════════ 편집 화면: 왼쪽 채팅 + 오른쪽 정리 결과 ═════════ */
  if (ed) {
    const cur = ed.isNew ? ed.info : acts[ed.idx];
    const filled = `${STAR_K.filter((q) => ed.star[q[2]]).length} / 4`;
    const ph = ed.phase === 'info' ? `${INFO_K[ed.infoStep][1]}을(를) 알려 주세요` : ed.step < 4 ? `${STAR_K[ed.step][1]}을(를) 편하게 적어 주세요` : '고칠 항목을 위에서 눌러 주세요';
    const chips: { label: string; go: () => void }[] =
      ed.phase === 'info'
        ? [{ label: 'Notion · 파일에서 가져오기', go: importFill },
           ...(ed.infoStep === 1 ? ACT_TYPES.map((label) => ({ label, go: () => answer(label, false) })) : []),
           { label: '건너뛰기', go: () => answer('건너뛸게요', true) }]
        : ed.step < 4
          ? [{ label: '지금 내용 그대로 둘게요', go: () => answer('지금 내용 그대로 둘게요', true) },
             { label: '예시 보여 줘', go: () => setEd({ ...ed, chat: [...ed.chat, { who: 'me', text: '예시 보여 줘' }, { who: 'bot', text: STAR_K[ed.step][4] }] }) }]
          : [{ label: '처음부터 다시', go: () => setEd({ ...ed, step: 0, chat: [...ed.chat, { who: 'bot', text: STAR_K[0][3] }] }) }];
    const setInfo = (k: keyof Info, v: string) => setEd({ ...ed, info: { ...ed.info, [k]: v } });

    return (
      <AppShell active="/activities" defaultOpen mainStyle={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
          <CopilotPanel label="STAR 정리 채팅" title="✦ 코파일럿" subtitle="STAR로 정리하기" placeholder={ph} ariaInput="답변 입력" draft={draft} onDraft={setDraft} onSend={send}>
            {ed.chat.map((m, i) => <Bubble key={i} me={m.who === 'me'}>{m.text}</Bubble>)}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {chips.map((c) => <ChatChip key={c.label} onClick={c.go}>{c.label}</ChatChip>)}
            </div>
          </CopilotPanel>

          <section className="fs-work" aria-label="정리 결과">
            <div className="fs-topbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <button type="button" className="cr-link" onClick={() => setEd(null)}>← 활동 목록</button>
                <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--neutral-900)', whiteSpace: 'nowrap' }}>정리 결과</h1>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--neutral-500)' }}>{filled} 채움</span>
                <Button variant="outline" onClick={() => setEd(null)}>취소</Button>
                <Button onClick={save}>✓ 저장</Button>
              </div>
            </div>
            <div className="fs-scroll">
              <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {!ed.isNew && (
                  <Card style={{ gap: 6, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Chip>{cur.type}</Chip><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>{acts[ed.idx].period}</span></div>
                    <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 800, color: 'var(--neutral-900)', letterSpacing: '-0.02em' }}>{cur.title}</h2>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--neutral-700)' }}>역할 · {acts[ed.idx].role}</div>
                  </Card>
                )}
                {ed.isNew && (
                  <Card style={{ gap: 14, padding: '20px 24px' }}>
                    <CardHead><h2 className="cr-card-title" style={{ fontSize: 16 }}>새 활동</h2><span className="cr-sub">채팅으로 답하거나 직접 입력하세요</span></CardHead>
                    <Field label="활동명"><Input placeholder="예: 교내 창업 동아리 기획팀" value={ed.info.title} onChange={(e) => setInfo('title', e.target.value)} /></Field>
                    <Field as="div" label="유형"><div className="cr-opts">{ACT_TYPES.map((t) => <OptionChip key={t} pressed={ed.info.type === t} onClick={() => setInfo('type', t)}>{t}</OptionChip>)}</div></Field>
                    <div className="cr-grid cr-g2">
                      <Field label="기간"><Input placeholder="2026.03 ~ 2026.06" value={ed.info.period} onChange={(e) => setInfo('period', e.target.value)} /></Field>
                      <Field label="역할"><Input placeholder="예: 기획 · 팀장" value={ed.info.role} onChange={(e) => setInfo('role', e.target.value)} /></Field>
                    </div>
                  </Card>
                )}
                {STAR_K.map((q, j) => {
                  const key = q[2];
                  const editing = ed.editKey === key;
                  const active = ed.phase !== 'info' && j === ed.step;
                  const hi = active || editing;
                  const value = ed.star[key];
                  return (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 20px', borderRadius: 'var(--radius)', border: hi ? '1.5px solid var(--blue-500)' : '1px solid var(--border)', background: hi ? 'var(--blue-50)' : 'var(--surface)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 800, color: 'var(--blue-500)', letterSpacing: '0.04em' }}>{q[0]} · {q[1]}</span>
                        {active ? <Chip tone="hot">지금 묻는 중</Chip>
                          : <button type="button" className="cr-link" style={{ fontSize: 12 }} onClick={() => setEd({ ...ed, step: j, phase: 'star', chat: [...ed.chat, { who: 'bot', text: q[3] }] })}>✦ 채팅으로 묻기</button>}
                        <button type="button" className="cr-icon-btn" aria-label={`${q[1]}${editing ? ' 편집 완료' : ' 직접 편집'}`} aria-pressed={editing} title="직접 편집"
                          onClick={() => setEd({ ...ed, editKey: editing ? null : key })}
                          style={editing ? { borderColor: 'var(--blue-500)', color: 'var(--blue-700)', background: 'var(--blue-50)' } : undefined}>
                          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.5 3.5l4 4L6 16H2v-4l8.5-8.5z" /></svg>
                        </button>
                      </div>
                      {!editing && <span style={{ fontSize: 14.5, lineHeight: 1.7, fontWeight: 600, color: value ? 'var(--neutral-900)' : 'var(--neutral-500)' }}>{value || '아직 비어 있어요'}</span>}
                      {editing && (
                        <>
                          <Textarea rows={3} aria-label={`${q[1]} 직접 편집`} value={value} onChange={(e) => setEd({ ...ed, star: { ...ed.star, [key]: e.target.value } })} style={{ resize: 'vertical', fontSize: 14, lineHeight: 1.7 }} />
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><Button variant="outline" onClick={() => setEd({ ...ed, editKey: null })} style={{ padding: '6px 14px' }}>✓ 편집 완료</Button></div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </AppShell>
    );
  }

  /* ═════════ 목록 화면 ═════════ */
  return (
    <AppShell active="/activities" defaultOpen mainStyle={{ overflowY: 'auto' }}>
      <div className="view active cr-view">
        <div className="cr-head"><div className="view-head" style={{ margin: 0 }}><h1>활동 관리</h1></div></div>

        <Card label="역량별 근거 활동">
          <CardHead title="역량별 근거 활동" />
          <div className="cr-cov">
            {COVERAGE_SKILLS.map((name) => {
              const n = acts.filter((a) => a.skills.includes(name)).length;
              const weak = n === 0;
              return (
                <div key={name} style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: weak ? '1.5px dashed var(--blue-400)' : '1px solid var(--border)', background: weak ? 'var(--blue-50)' : 'var(--surface)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>{name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--neutral-900)' }}>{n}</span><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>개</span>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: 'var(--blue-700)', marginTop: 2 }}>{weak ? '보강 필요' : n === 1 ? '1개 더 있으면 좋아요' : '충분해요'}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="cr-opts" role="group" aria-label="활동 유형" style={{ alignItems: 'center' }}>
          {['전체', ...ACT_TYPES].map((t) => (
            <OptionChip key={t} pressed={type === t} onClick={() => setType(t)}>
              {t} <span style={{ opacity: 0.8 }}>{t === '전체' ? acts.length : acts.filter((a) => a.type === t).length}</span>
            </OptionChip>
          ))}
          <Button onClick={() => open(newEd())} style={{ marginLeft: 'auto' }}>+ 활동 추가</Button>
        </div>

        <div className="cr-grid cr-g3">
          {list.map((a) => (
            <Card as="article" key={a.title + a.period} style={{ gap: 10 }}>
              <CardHead><Chip>{a.type}</Chip><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>{a.period}</span></CardHead>
              <h3 className="cr-card-title" style={{ fontSize: 15, lineHeight: 1.45 }}>{a.title}</h3>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--neutral-700)' }}>역할 · {a.role}</div>
              <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--blue-50)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STAR_K.map((q) => (
                  <div key={q[0]} style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                    <span style={{ width: 14, flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 11.5, fontWeight: 800, color: 'var(--blue-500)' }}>{q[0]}</span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.5, fontWeight: 600, color: 'var(--neutral-800)' }}>{a.star[q[2]] || '— 비어 있어요'}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{a.skills.map((k) => <Chip key={k} tone="line">{k}</Chip>)}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <button type="button" className="cr-link" onClick={() => open(startEd(acts.indexOf(a)))}>✎ 편집 · 채팅으로 정리</button>
                <Link className="cr-link" href="/dashboard">내 상황에서 보기 →</Link>
              </div>
            </Card>
          ))}
        </div>
        {list.length === 0 && (
          <div className="cr-card flat" style={{ alignItems: 'center', textAlign: 'center', padding: '36px 22px' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--neutral-900)' }}>아직 {type} 활동이 없어요</div>
            <p className="cr-sub">로드맵에서 추천한 활동을 확인하고, 시작하면 여기에 기록해 보세요.</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}><Button variant="outline" href="/roadmap">추천 활동 보기</Button><Button onClick={() => open(newEd())}>+ 활동 추가</Button></div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
