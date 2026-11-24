import type { CSSProperties, ReactNode } from 'react';

/** cr-chip: 기본(연파랑) · n(회색) · hot(진한 남색) · line(테두리) */
export function Chip({ tone = '', children, style }: { tone?: '' | 'n' | 'hot' | 'line'; children: ReactNode; style?: CSSProperties }) {
  return <span className={`cr-chip ${tone}`.trim()} style={style}>{children}</span>;
}
/** 필수/선택 표시 (cr-req) */
export function Req({ optional, children }: { optional?: boolean; children: ReactNode }) {
  return <span className={`cr-req${optional ? ' opt' : ''}`}>{children}</span>;
}
