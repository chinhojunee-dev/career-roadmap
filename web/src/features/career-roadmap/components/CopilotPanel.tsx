'use client';
import { useEffect, useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';

/** 코파일럿 채팅 패널: 말풍선 영역 + 입력창. children 이 말풍선·추천 칩 영역 */
export function CopilotPanel({ label, title, subtitle, width, placeholder, ariaInput, draft, onDraft, onSend, children }: {
  label: string; title: string; subtitle: string; width?: number; placeholder: string; ariaInput: string;
  draft: string; onDraft: (v: string) => void; onSend: () => void; children: ReactNode;
}) {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight; });
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); onSend(); }   // 한글 조합 중 Enter 는 무시
  };
  return (
    <section className="fs-copilot" aria-label={label} style={width ? { width } : undefined}>
      <div className="fs-cop-head">
        <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--blue-700)' }}>{title}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--neutral-500)' }}>{subtitle}</span>
      </div>
      <div className="chat-body fs-cop-body" ref={body}>{children}</div>
      <div className="chat-input">
        <div className="chat-input-box">
          <input placeholder={placeholder} aria-label={ariaInput} value={draft} onChange={(e) => onDraft(e.target.value)} onKeyDown={onKey} />
          <button type="button" className="es-send metallic-blue" aria-label="보내기" onClick={onSend} style={{ width: 30, height: 30, borderRadius: 999, border: 0, color: '#fff' }}>↑</button>
        </div>
      </div>
    </section>
  );
}

export const Bubble = ({ me, children }: { me?: boolean; children: ReactNode }) => <div className={`chat-bubble${me ? ' user' : ''}`}>{children}</div>;
export const ChatChip = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <button type="button" className="chat-exp-trigger" style={{ margin: 0 }} onClick={onClick}>{children}</button>
);
export type { CSSProperties };
