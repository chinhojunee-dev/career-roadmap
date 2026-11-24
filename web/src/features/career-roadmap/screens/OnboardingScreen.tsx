'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { Bubble, ChatChip, CopilotPanel } from '../components/CopilotPanel';
import { careerApi } from '../api';
import { CHAT_EX_LABELS, COP, SOURCE_LABEL, STEPS } from '../model/options';
import type { Profile } from '../model/types';
import { Button } from '@/shared/ui/Button';
import { Step1, Step2, Step3, Step4, Step5, Step6 } from './onboarding/steps';

type Msg = { who: 'me' | 'bot'; text: string };

export function OnboardingScreen() {
  const [p, setP] = useState<Profile | null>(null);
  const [step, setStep] = useState(1);
  const [chat, setChat] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const latest = useRef<Profile | null>(null);
  useEffect(() => { careerApi.getProfile().then((x) => { latest.current = x; setP(x); }); }, []);

  /** 입력 즉시 화면에 반영하고 자동 저장 */
  const update = useCallback((patch: Partial<Profile>) => {
    if (!latest.current) return;
    latest.current = { ...latest.current, ...patch };
    setP(latest.current);
    careerApi.saveProfile(patch);
  }, []);

  if (!p) return <AppShell active="/goal" defaultOpen={false} mainStyle={{ padding: 0, overflow: 'hidden' }}><span /></AppShell>;

  /* ── 채팅 (AI 호출은 careerApi.chat 하나) ── */
  const addActivity = (a: Profile['importedActs'][number]) => update({ importedActs: [...(latest.current?.importedActs ?? []), a] });
  const sendChat = async (txt?: string) => {
    const t = (txt ?? draft).trim();
    if (!t) return;
    setDraft('');
    setChat((c) => [...c, { who: 'me', text: t }]);
    const r = await careerApi.chat({ scope: 'onboarding', step, text: t });
    if (r.activity) addActivity({ ...r.activity, src: '채팅' });
    setChat((c) => [...c, { who: 'bot', text: r.text }]);
  };
  const runImport = async (source: 'notion' | 'file' | 'gdoc' | 'link', url: string) => {
    setLoading(SOURCE_LABEL[source]);
    const items = await careerApi.importActivities({ source, url });
    update({ importedActs: [...(latest.current?.importedActs ?? []), ...items] });
    setLoading(null);
    setChat((c) => [...c, { who: 'bot', text: `${SOURCE_LABEL[source]}에서 활동 ${items.length}개를 찾아 정리했어요. 다른 부분이 있으면 말해 주세요.` }]);
  };

  const pct = Math.round((step / 6) * 100);
  const chips = step === 4 ? CHAT_EX_LABELS : ['이 정보는 어디에 쓰여요?', '나중에 바꿀 수 있어요?'];

  return (
    <AppShell active="/goal" defaultOpen={false} goal={p.goalJob} hireTerm={p.timing} mainStyle={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
        <CopilotPanel label="코파일럿" title="✦ 코파일럿" subtitle={`커리어 프로필 · ${STEPS[step - 1]}`}
          placeholder={step === 4 ? '했던 활동을 편하게 말해 주세요' : '입력하다 막히면 물어보세요'} ariaInput="코파일럿에게 보내기"
          draft={draft} onDraft={setDraft} onSend={() => sendChat()}>
          {COP[step - 1].map((t) => <Bubble key={t}>{t}</Bubble>)}
          {step === 2 && p.undecided && <Bubble>괜찮아요! 입력을 마치면 전공·보유 역량·활동을 바탕으로 잘 맞는 직무 3개를 추천해 드릴게요. 추천 직무 중 하나를 골라 로드맵을 만들 수 있어요.</Bubble>}
          {chat.map((m, i) => <Bubble key={i} me={m.who === 'me'}>{m.text}</Bubble>)}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, marginTop: 4 }}>
            {chips.map((c) => <ChatChip key={c} onClick={() => sendChat(c)}>{c}</ChatChip>)}
          </div>
        </CopilotPanel>

        <section className="fs-work" aria-label="커리어 프로필 입력">
          <div className="fs-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--neutral-900)', whiteSpace: 'nowrap' }}>커리어 프로필</h1>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--neutral-500)', whiteSpace: 'nowrap' }}>✓ 자동 저장됨</span>
          </div>
          <div className="fs-scroll">
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <nav className="cr-steprow" aria-label="입력 단계">
                {STEPS.map((label, i) => {
                  const n = i + 1;
                  return (
                    <button key={label} type="button" className="cr-stepbtn" data-state={n < step ? 'done' : n === step ? 'now' : 'todo'} aria-current={n === step ? 'step' : 'false'} onClick={() => setStep(n)}>
                      <span className="n">{n < step ? '✓' : String(n)}</span><span className="l">{label}</span>
                    </button>
                  );
                })}
              </nav>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--neutral-700)' }}>{step} / 6 단계 · 필수 {Math.min(step - 1, 5)}/5 완료</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--blue-700)' }}>남은 시간 약 {Math.max(1, Math.round((6 - step + 1) * 0.5))}분</span>
                </div>
                <div className="cr-bar" role="progressbar" aria-label="입력 진행률" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><i style={{ width: `${pct}%` }} /></div>
              </div>

              {step === 1 && <Step1 p={p} update={update} />}
              {step === 2 && <Step2 p={p} update={update} />}
              {step === 3 && <Step3 p={p} update={update} />}
              {step === 4 && <Step4 p={p} loading={loading} onImport={runImport} onRemove={(i) => update({ importedActs: p.importedActs.filter((_, j) => j !== i) })} />}
              {step === 5 && <Step5 p={p} update={update} />}
              {step === 6 && <Step6 p={p} update={update} />}

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>← 이전</Button>}
                {step === 1 && <Button variant="outline" href="/dashboard">나중에 할게요</Button>}
                {step < 6 && <Button onClick={() => setStep(step + 1)}>다음 — {STEPS[step]}</Button>}
                {step === 6 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Button variant="outline" href="/roadmap">건너뛰고 로드맵 만들기</Button>
                    <Button href="/roadmap">✦ 학기별 로드맵 만들기</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
