'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import {
  ALL_JOBS, CERT_SUG, CERTAINTY, GPA_SCALES, GRADES, HOURS, INDUSTRIES, JOB_CATS, LANG_TESTS, normJob, SRC_BTNS,
  STYLES, TIMINGS, TOOLS, URL_PLACEHOLDER,
} from '../../model/options';
import type { ImportedActivity, Profile } from '../../model/types';
import { Button } from '@/shared/ui/Button';
import { Chip, Req } from '@/shared/ui/Chip';
import { Field, Input } from '@/shared/ui/Field';
import { IconTile } from '@/shared/ui/IconTile';
import { OptionChip, OptionGroup } from '@/shared/ui/OptionChip';
import { Segmented } from '@/shared/ui/Segmented';
import { Icon, Raw } from '@/shared/ui/Svg';

export type Update = (patch: Partial<Profile>) => void;
const pad: CSSProperties = { padding: '28px 32px' };
const Step = ({ gap, children }: { gap: number; children: ReactNode }) => <div className="cr-card" style={{ ...pad, gap }}>{children}</div>;
const Title = ({ children, optional }: { children: ReactNode; optional?: boolean }) => (
  <h2 className="cr-section-title">{children} <Req optional={optional}>{optional ? '선택' : '필수'}</Req></h2>
);
const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const rowBox: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)' };

/* 1. 기본 정보 */
export function Step1({ p, update }: { p: Profile; update: Update }) {
  return (
    <Step gap={20}>
      <div><Title>지금 어디에서 공부하고 있나요?</Title></div>
      <div className="cr-grid cr-g2">
        <Field label="현재 학교"><Input placeholder="학교 이름" value={p.school} onChange={(e) => update({ school: e.target.value })} /></Field>
        <Field label="전공"><Input placeholder="예: 경영학과" value={p.major} onChange={(e) => update({ major: e.target.value })} /></Field>
      </div>
      <Field as="div" label="학년"><OptionGroup label="학년" options={GRADES} value={p.grade} onChange={(v) => update({ grade: v })} /></Field>
    </Step>
  );
}

/* 2. 희망 진로 */
export function Step2({ p, update }: { p: Profile; update: Update }) {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('인기');
  const query = q.trim();
  const pick = (job: string) => { update({ goalJob: job, undecided: false }); setQ(''); };
  const results = query ? ALL_JOBS.filter((j) => normJob(j).includes(normJob(query))).slice(0, 12) : [];
  const jobChip = (label: string) => <OptionChip key={label} pressed={p.goalJob === label} onClick={() => pick(label)}>{label}</OptionChip>;
  return (
    <Step gap={20}>
      <div><Title>어떤 일을 하고 싶나요?</Title></div>
      {!p.undecided && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field as="div" label="희망 직무">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, minHeight: 44, boxSizing: 'border-box', padding: '8px 12px', border: '1px solid var(--blue-300)', borderRadius: 'var(--radius-sm)', background: 'var(--blue-50)' }}>
              <span className="cr-over">선택한 직무</span>
              {p.goalJob
                ? <span className="cr-chip hot" style={{ fontSize: 12.5, padding: '5px 6px 5px 12px' }}>{p.goalJob}
                    <button type="button" aria-label="선택한 직무 지우기" onClick={() => update({ goalJob: '' })} style={{ border: 0, background: 'transparent', color: 'inherit', cursor: 'pointer', font: 'inherit', padding: '0 4px', marginLeft: 2 }}>✕</button></span>
                : <span className="cr-sub">아래에서 고르거나 직접 입력해 주세요</span>}
            </div>
          </Field>
          <div style={{ position: 'relative' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--neutral-500)' }}><circle cx="8" cy="8" r="5" /><path d="M12 12l3.5 3.5" /></svg>
            <Input aria-label="직무 검색 또는 직접 입력" placeholder="직무 검색 또는 직접 입력 (예: CRM 마케터, 브랜드 매니저)" value={q} style={{ paddingLeft: 36 }}
              onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && query && !e.nativeEvent.isComposing) { e.preventDefault(); pick(query); } }} />
          </div>
          {query ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="cr-sub">{results.length ? `검색 결과 ${results.length}개` : '목록에 없는 직무예요. 입력한 그대로 선택할 수 있어요.'}</span>
              <div className="cr-opts" role="group" aria-label="검색 결과">
                {results.map(jobChip)}
                {!ALL_JOBS.includes(query) && <button type="button" className="cr-opt" onClick={() => pick(query)} style={{ borderStyle: 'dashed', color: 'var(--blue-700)', borderColor: 'var(--blue-400)' }}>{`+ ‘${query}’ 직접 입력으로 선택`}</button>}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Segmented label="직군" options={Object.keys(JOB_CATS)} value={cat} onChange={setCat} style={{ alignSelf: 'flex-start' }} />
              <div className="cr-opts" role="group" aria-label="직무 목록">{JOB_CATS[cat].map(jobChip)}</div>
              <span className="cr-sub">찾는 직무가 없으면 위 검색창에 그대로 적고 Enter를 눌러 주세요.</span>
            </div>
          )}
        </div>
      )}
      <button type="button" className="cr-pick" aria-pressed={p.undecided} onClick={() => update({ undecided: !p.undecided })}>
        <IconTile d={['M7.2 7a1.9 1.9 0 1 1 2.6 1.8c-.5.2-.8.6-.8 1.1v.4', 'M9 12.6v.1']} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: 'var(--neutral-900)' }}>아직 정하지 않았어요</span>
          <span style={{ display: 'block', marginTop: 2, fontSize: 12.5, fontWeight: 600, color: 'var(--neutral-700)' }}>입력을 마치면 AI가 나에게 맞는 직무를 추천해 드려요</span>
        </span>
        <Chip>{p.undecided ? '✓ 선택됨' : 'AI 직무 추천'}</Chip>
      </button>
      <Field as="div" label={<>관심 산업 <Req>여러 개 선택</Req></>}>
        <OptionGroup multi label="관심 산업" options={INDUSTRIES} value={p.industries} onChange={(v) => update({ industries: toggle(p.industries, v) })} />
      </Field>
    </Step>
  );
}

/* 3. 보유 스펙 */
export function Step3({ p, update }: { p: Profile; update: Update }) {
  const [certName, setCertName] = useState('');
  const [certDate, setCertDate] = useState('');
  const [langScore, setLangScore] = useState('');
  const addCert = () => { const n = certName.trim(); if (!n) return; update({ certs: [...p.certs, { name: n, date: certDate.trim() }] }); setCertName(''); setCertDate(''); };
  const addLang = () => { const v = langScore.trim(); if (!v) return; update({ langs: [...p.langs, { test: p.langTest, score: v }] }); setLangScore(''); };
  const sugs = CERT_SUG.filter((n) => !p.certs.some((c) => c.name === n)).slice(0, 6);
  return (
    <Step gap={24}>
      <div><Title>지금 가진 스펙을 알려 주세요</Title></div>

      <Field as="div" label="학점">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <Input aria-label="현재 학점" placeholder="3.8" value={p.gpa} disabled={p.noGpa} onChange={(e) => update({ gpa: e.target.value })} style={{ width: 110, textAlign: 'center' }} />
          <span style={{ fontWeight: 800, color: 'var(--neutral-700)' }}>/</span>
          <Segmented label="만점 기준" options={GPA_SCALES} value={p.gpaScale} onChange={(v) => update({ gpaScale: v })} />
          <button type="button" className="cr-opt" aria-pressed={p.noGpa} onClick={() => update({ noGpa: !p.noGpa })} style={{ marginLeft: 'auto' }}>아직 학점이 없어요</button>
        </div>
      </Field>

      <Field as="div" label={<>보유 자격증 <Req optional>{p.certs.length}개</Req></>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p.certs.map((c, i) => (
            <div key={c.name + i} style={rowBox}>
              <IconTile d={['M5 2.5h8v9.5l-4-2-4 2zM7 6h4']} style={{ width: 28, height: 28 }} />
              <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 800, color: 'var(--neutral-900)' }}>{c.name}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>{c.date || '취득일 미입력'}</span>
              <button type="button" className="cr-icon-btn" aria-label={`${c.name} 삭제`} onClick={() => update({ certs: p.certs.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          {p.certs.length === 0 && <div className="cr-sub" style={{ padding: '10px 12px', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-sm)' }}>아직 없어도 괜찮아요. 목표 직무에 맞는 자격증을 로드맵에서 추천해 드릴게요.</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Input aria-label="자격증 이름" placeholder="자격증 이름 (예: 컴퓨터활용능력 1급)" value={certName} onChange={(e) => setCertName(e.target.value)} style={{ flex: '2 1 220px' }} />
            <Input aria-label="취득일" placeholder="취득일 (2026.05)" value={certDate} onChange={(e) => setCertDate(e.target.value)} style={{ flex: '1 1 120px' }} />
            <Button variant="outline" onClick={addCert} style={{ flexShrink: 0 }}>+ 추가</Button>
          </div>
          <div className="cr-opts" aria-label="자주 찾는 자격증">
            {sugs.map((n) => <OptionChip key={n} onClick={() => update({ certs: [...p.certs, { name: n, date: '' }] })}>{`+ ${n}`}</OptionChip>)}
          </div>
        </div>
      </Field>

      <Field as="div" label="어학 점수">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p.langs.map((l, i) => (
            <div key={l.test + i} style={rowBox}>
              <Chip>{l.test}</Chip>
              <span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 800, color: 'var(--neutral-900)' }}>{l.score}</span>
              <button type="button" className="cr-icon-btn" aria-label={`${l.test} 삭제`} onClick={() => update({ langs: p.langs.filter((_, j) => j !== i) })}>✕</button>
            </div>
          ))}
          <Segmented label="시험 종류" options={LANG_TESTS} value={p.langTest} onChange={(v) => update({ langTest: v })} style={{ alignSelf: 'flex-start' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <Input aria-label="점수 또는 등급" placeholder="점수 또는 등급 (예: 850, IM2, N2)" value={langScore} onChange={(e) => setLangScore(e.target.value)} style={{ flex: 1 }} />
            <Button variant="outline" onClick={addLang} style={{ flexShrink: 0 }}>+ 추가</Button>
          </div>
        </div>
      </Field>

      <Field as="div" label={<>다룰 수 있는 툴 <Req optional>선택 · 여러 개</Req></>}>
        <OptionGroup multi label="다룰 수 있는 툴" options={TOOLS} value={p.tools} onChange={(v) => update({ tools: toggle(p.tools, v) })} />
      </Field>
    </Step>
  );
}

/* 4. 활동 경험 */
export function Step4({ p, loading, onImport, onRemove }: {
  p: Profile; loading: string | null; onImport: (src: 'notion' | 'file' | 'gdoc' | 'link', url: string) => void; onRemove: (i: number) => void;
}) {
  const [srcOpen, setSrcOpen] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const acts: ImportedActivity[] = p.importedActs;
  const run = (key: 'notion' | 'file' | 'gdoc' | 'link') => { onImport(key, url); setSrcOpen(null); setUrl(''); };
  return (
    <Step gap={16}>
      <Title>어떤 활동을 해 왔나요?</Title>
      <div className="cr-src">
        {SRC_BTNS.map((b) => (
          <button key={b.key} type="button" className="exp-import-btn" aria-pressed={srcOpen === b.key}
            style={srcOpen === b.key ? { borderColor: 'var(--blue-500)', background: 'var(--blue-50)' } : undefined}
            onClick={() => (b.url ? (setSrcOpen(srcOpen === b.key ? null : b.key), setUrl('')) : run(b.key))}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={b.icon} /></svg>
            <span><b style={{ display: 'block', fontSize: 13 }}>{b.label}</b><i style={{ display: 'block', fontStyle: 'normal', fontSize: 11.5, fontWeight: 600, color: 'var(--neutral-700)', marginTop: 2 }}>{b.hint}</i></span>
          </button>
        ))}
      </div>
      {srcOpen && (
        <div style={{ display: 'flex', gap: 8 }}>
          <Input aria-label="가져올 링크" placeholder={URL_PLACEHOLDER[srcOpen]} value={url} onChange={(e) => setUrl(e.target.value)} style={{ flex: 1 }} />
          <Button onClick={() => run(srcOpen as 'notion')} style={{ flexShrink: 0 }}>✦ 가져와서 정리</Button>
        </div>
      )}
      {loading && (
        <div className="cr-banner" style={{ padding: '10px 14px' }}>
          <IconTile d="M9 2.5l1.6 4 4 1.6-4 1.6L9 13.7l-1.6-4-4-1.6 4-1.6z" style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--neutral-900)' }}>{loading} 내용을 읽고 활동별로 정리하는 중…</span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
        <span className="cr-over">정리된 활동 {acts.length}개</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue-700)' }}>✦ 왼쪽 채팅으로 말해도 정리돼요</span>
      </div>
      {acts.length === 0 && !loading && (
        <div style={{ padding: 22, textAlign: 'center', border: '1.5px dashed var(--border-strong)', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 700, color: 'var(--neutral-700)' }}>파일 · 링크를 올리거나 채팅으로 말하면 여기에 정리돼요</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {acts.map((a, i) => (
          <div key={a.title + i} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', background: 'var(--surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Chip>{a.type}</Chip><span style={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 800, color: 'var(--neutral-900)' }}>{a.title}</span>
              <Chip tone="n">{a.src}</Chip>
              <button type="button" className="cr-icon-btn" aria-label={`${a.title} 삭제`} onClick={() => onRemove(i)}>✕</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 12px', fontSize: 12, fontWeight: 700, color: 'var(--neutral-700)' }}>
              <span>{a.period}</span><span>· {a.result}</span>{a.skills.map((k) => <Chip key={k} tone="line">{k}</Chip>)}
            </div>
          </div>
        ))}
      </div>
    </Step>
  );
}

/* 5. 학습 조건 */
export function Step5({ p, update }: { p: Profile; update: Update }) {
  const note = p.timing === '아직 모르겠어요' ? '졸업 예정 시기를 기준으로 계획을 잡고, 나중에 바꿀 수 있어요.' : `${p.timing} 취업을 목표로, 지금부터 학기별로 거꾸로 계획을 짤게요.`;
  return (
    <Step gap={22}>
      <div><Title>얼마나, 언제까지 준비할까요?</Title></div>
      <Field as="div" label="주간 학습 가능 시간"><OptionGroup label="주간 학습 가능 시간" options={HOURS} value={p.hours} onChange={(v) => update({ hours: v })} /></Field>
      <Field as="div" label="희망 취업 시기"><OptionGroup label="희망 취업 시기" options={TIMINGS} value={p.timing} onChange={(v) => update({ timing: v })} /></Field>
      <div className="cr-banner">
        <span className="cr-ico"><Raw><rect x="2.5" y="3.5" width="13" height="12" rx="2" /><path d="M2.5 7.5h13M6 2v3M12 2v3" /></Raw></span>
        <span className="cr-sub" style={{ flex: 1 }}>{note}</span>
      </div>
    </Step>
  );
}

/* 6. 추가 정보 (선택) */
export function Step6({ p, update }: { p: Profile; update: Update }) {
  const f = (label: string, key: 'graduation' | 'company' | 'region' | 'budget' | 'altJob', ph: string) => (
    <Field label={label}><Input placeholder={ph} value={p[key]} onChange={(e) => update({ [key]: e.target.value })} /></Field>
  );
  return (
    <Step gap={20}>
      <div><Title optional>조금 더 알려 주실래요?</Title></div>
      <div className="cr-grid cr-g3">
        {f('졸업 예정일', 'graduation', '예: 2028.02')}{f('희망 기업', 'company', '예: 화장품·식품 대기업')}{f('희망 취업 지역', 'region', '예: 서울 · 경기')}
        {f('자기계발 예산 (월)', 'budget', '예: 10만 원')}{f('대체 희망 직무', 'altJob', '예: 콘텐츠 마케터')}
      </div>
      <Field as="div" label={<>선호 학습 방식 <Req optional>여러 개 선택</Req></>}>
        <OptionGroup multi options={STYLES} value={p.styles} onChange={(v) => update({ styles: toggle(p.styles, v) })} />
      </Field>
      <Field as="div" label="진로 확신도">
        <OptionGroup label="진로 확신도" options={CERTAINTY} value={CERTAINTY.find((c) => c.startsWith(p.certainty)) ?? ''} onChange={(v) => update({ certainty: v[0] })} />
      </Field>
    </Step>
  );
}
