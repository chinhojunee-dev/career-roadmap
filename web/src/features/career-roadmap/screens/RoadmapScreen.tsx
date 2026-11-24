'use client';
import { useEffect, useState } from 'react';
import { AppShell, Overlay } from '../components/AppShell';
import { careerApi } from '../api';
import { useCareerData } from '../hooks/useCareerData';
import { CHECK_PATH, IC, KIND, LEGEND, TERMS } from '../model/options';
import type { CellStatus, ItemKind, Roadmap, RoadmapDetail } from '../model/types';
import { Button } from '@/shared/ui/Button';
import { Card, CardHead } from '@/shared/ui/Card';
import { CheckItem } from '@/shared/ui/CheckItem';
import { Chip } from '@/shared/ui/Chip';
import { FLAG, IconTile } from '@/shared/ui/IconTile';
import { Icon } from '@/shared/ui/Svg';
import { ProgressBar } from '@/shared/ui/ProgressBar';

const BADGE: Record<CellStatus, { t: string; tone: '' | 'n' | 'hot' | 'line' } | null> = { done: { t: '✓', tone: 'n' }, now: { t: '지금', tone: 'hot' }, todo: null };
const CHIP: Record<CellStatus, { t: string; tone: '' | 'n' | 'hot' | 'line' }> = { done: { t: '완료', tone: 'n' }, now: { t: '지금', tone: 'hot' }, todo: { t: '예정', tone: 'line' } };
type Open = { t: string; k: ItemKind; term: string; past: boolean };

const over = (t: string) => <div className="cr-over">{t}</div>;
const box: React.CSSProperties = { padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' };
const boxVal: React.CSSProperties = { fontSize: 13, fontWeight: 800, color: 'var(--neutral-900)', marginTop: 3 };

export function RoadmapScreen() {
  const [loaded] = useCareerData(() => careerApi.getRoadmap());
  const [rm, setRm] = useState<Roadmap | null>(null);
  const [open, setOpen] = useState<Open | null>(null);
  const [detail, setDetail] = useState<RoadmapDetail | null>(null);
  useEffect(() => { if (loaded) setRm(loaded); }, [loaded]);

  useEffect(() => {                                  // 상세 서랍: 열릴 때 상세 불러오기, Esc 로 닫기
    if (!open) { setDetail(null); return; }
    let alive = true;
    careerApi.getRoadmapItem(open.t, open.k).then((d) => { if (alive) setDetail(d); });
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', esc);
    return () => { alive = false; window.removeEventListener('keydown', esc); };
  }, [open]);

  if (!rm) return <AppShell active="/roadmap" defaultOpen><span /></AppShell>;

  const isDone = (title: string, past: boolean) => rm.doneItems[title] ?? past;
  const setDone = (title: string, done: boolean) => {
    setRm({ ...rm, doneItems: { ...rm.doneItems, [title]: done } });
    careerApi.setItemDone(title, done);
  };
  const pick = (key: string) => { setRm({ ...rm, selected: key }); careerApi.setRoadmapSelected(key); };

  let total = 0, doneN = 0, left = 0;
  rm.plan.forEach((y) => y.cells.forEach((c) => { total += c.items.length; if (c.st === 'done') doneN += c.items.length; else left += 1; }));

  const [selYear, selIdx] = [rm.selected.split('-')[0], Number(rm.selected.split('-')[1])];
  const cell = rm.plan.find((y) => y.year === selYear)!.cells[selIdx];
  const past = cell.st === 'done';
  const doneCount = cell.items.filter((it) => isDone(it.title, past)).length;

  const drawerDone = open ? isDone(open.t, open.past) : false;
  const overlay = open && (
    <Overlay>
      <div className="cr-scrim" onClick={() => setOpen(null)} />
      <aside className="cr-drawer" role="dialog" aria-modal="true" aria-label={`${open.t} 상세`}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Chip>{KIND[open.k]}</Chip><Chip tone="n">{open.term}</Chip>{drawerDone && <Chip tone="hot">✓ 완료</Chip>}
            </div>
            <h2 style={{ margin: '10px 0 0', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--neutral-900)' }}>{open.t}</h2>
          </div>
          <button type="button" className="cr-icon-btn" aria-label="닫기" onClick={() => setOpen(null)}>✕</button>
        </div>
        {detail && (
          <>
            <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--blue-50)' }}>
              {over('왜 하나요')}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginTop: 6 }}>
                <Chip tone="line">{detail.skill}</Chip><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>{detail.why}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
              <div style={box}>{over('목표 결과')}<div style={boxVal}>{detail.result}</div></div>
              <div style={box}>{over('기간')}<div style={boxVal}>{detail.period}</div></div>
              <div style={box}>{over('시간')}<div style={boxVal}>{detail.hours}</div></div>
            </div>
            <div>{over('추천 자료')}<div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>{detail.res.map((r) => <Chip key={r} tone="n">{r}</Chip>)}</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--blue-300)' }}>
              <span style={{ color: 'var(--blue-500)', fontWeight: 800 }}>→</span><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>{detail.next}</span>
            </div>
          </>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <Button variant="outline" style={{ flex: 1, justifyContent: 'center' }}>다른 활동으로 바꾸기</Button>
          <Button onClick={() => setDone(open.t, !drawerDone)} style={{ flex: 1, justifyContent: 'center' }}>{drawerDone ? '완료 취소' : '✓ 완료로 표시'}</Button>
        </div>
      </aside>
    </Overlay>
  );

  return (
    <AppShell active="/roadmap" defaultOpen goal={rm.goal} hireTerm={rm.hireTerm} mainStyle={{ overflowY: 'auto' }} overlay={overlay}>
      <div className="view active cr-view" style={{ maxWidth: 'none', gap: 14 }}>
        <div className="cr-head">
          <div className="view-head" style={{ margin: 0 }}><h1>학기별 로드맵</h1></div>
          <Button variant="outline">✦ 다시 채우기</Button>
        </div>

        {/* 목표 */}
        <Card label="목표" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 28, padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconTile d="M4 16V2.5M4 3h9.5l-2 3 2 3H4" style={{ background: 'var(--blue-500)', color: '#fff' }} />
            <div>{over('목표')}<div style={{ fontSize: 17, fontWeight: 800, color: 'var(--neutral-900)' }}>{rm.goal}</div></div>
          </div>
          <div>{over('취업 시점')}<div style={{ fontSize: 15, fontWeight: 800, color: 'var(--neutral-900)' }}>{rm.hireTerm}</div></div>
          <div>{over('남은 구간')}<div style={{ fontSize: 15, fontWeight: 800, color: 'var(--neutral-900)' }}>{left}개 구간</div></div>
          <div style={{ flex: '1 1 200px', minWidth: 160 }}>
            {over('계획 진행')}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <ProgressBar thin pct={Math.round((doneN / total) * 100)} style={{ flex: 1 }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--neutral-900)', fontFamily: 'var(--font-mono)' }}>{doneN} / {total}</span>
            </div>
          </div>
          <Button variant="outline" href="/goal">목표 바꾸기</Button>
        </Card>

        <div className="crg-wrap">
          {/* 학년 × 학기 그리드 */}
          <Card label="학년별 학기 계획" style={{ gap: 10, padding: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {LEGEND.map(([k, t]) => <span key={k} className="crg-item" style={{ color: 'var(--neutral-700)' }}><Icon d={IC[k]} />{t}</span>)}
            </div>
            <div className="crg crg-head" aria-hidden="true"><span />{TERMS.map((t) => <span key={t} className="crg-h">{t}</span>)}</div>
            {rm.plan.map((y) => (
              <div className="crg" key={y.year}>
                <span className="crg-y">{y.year}</span>
                {y.cells.map((c, i) => {
                  const key = `${y.year}-${i}`;
                  const badge = BADGE[c.st];
                  return (
                    <button key={key} type="button" className={`crg-cell ${c.st}`} aria-pressed={rm.selected === key} aria-label={`${y.year} ${TERMS[i]}`} onClick={() => pick(key)}>
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                        <span className="crg-term">{TERMS[i]}</span>{badge && <Chip tone={badge.tone}>{badge.t}</Chip>}
                      </span>
                      {c.items.map((it) => (
                        <span className="crg-item" key={it.title}>
                          <Icon d={c.st !== 'done' && isDone(it.title, false) ? CHECK_PATH : IC[it.kind]} /><span>{it.title}</span>
                        </span>
                      ))}
                    </button>
                  );
                })}
              </div>
            ))}
          </Card>

          {/* 선택한 학기 상세 */}
          <Card as="aside" label="선택한 학기 계획" style={{ gap: 14 }}>
            <CardHead><h2 className="cr-card-title" style={{ fontSize: 17 }}>{selYear} {TERMS[selIdx]}</h2><Chip tone={CHIP[cell.st].tone}>{CHIP[cell.st].t}</Chip></CardHead>
            <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--blue-50)' }}>
              {over('이 구간 목표')}<div style={{ fontSize: 14, fontWeight: 800, color: 'var(--neutral-900)', marginTop: 2 }}>{cell.goal || '완료한 구간이에요'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="cr-over">활동</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--neutral-700)', fontFamily: 'var(--font-mono)' }}>{doneCount} / {cell.items.length} 완료</span>
              </div>
              {cell.items.map((it) => {
                const on = isDone(it.title, past);
                return (
                  <CheckItem key={it.title} checked={on} label={`${it.title} 완료`} onToggle={() => setDone(it.title, !on)} style={{ padding: '9px 10px', alignItems: 'center', cursor: 'default' }}>
                    <button type="button" aria-label={`${it.title} 자세히 보기`} onClick={() => setOpen({ t: it.title, k: it.kind, term: `${selYear} ${TERMS[selIdx]}`, past })}
                      style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, border: 0, background: 'transparent', padding: 0, font: 'inherit', cursor: 'pointer', textAlign: 'left', color: 'inherit' }}>
                      <span className="cr-check-t" style={{ flex: 1, minWidth: 0, fontSize: 13.5 }}>{it.title}</span><Chip tone="n">{KIND[it.kind]}</Chip>
                      <span aria-hidden="true" style={{ color: 'var(--neutral-500)', fontWeight: 800 }}>›</span>
                    </button>
                  </CheckItem>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{(cell.skills ?? []).map((k) => <Chip key={k} tone="line">{k}</Chip>)}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 2 }}><Button variant="outline" style={{ flex: 1, justifyContent: 'center' }}>+ 활동 추가</Button></div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
