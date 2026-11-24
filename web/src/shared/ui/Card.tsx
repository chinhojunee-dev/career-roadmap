import type { CSSProperties, ReactNode } from 'react';

type Props = { as?: 'section' | 'article' | 'aside' | 'div'; flat?: boolean; tint?: boolean; label?: string; style?: CSSProperties; children: ReactNode };

export function Card({ as: Tag = 'section', flat, tint, label, style, children }: Props) {
  return <Tag className={`cr-card${flat ? ' flat' : ''}${tint ? ' tint' : ''}`} aria-label={label} style={style}>{children}</Tag>;
}
export function CardHead({ title, titleStyle, children, style }: { title?: string; titleStyle?: CSSProperties; children?: ReactNode; style?: CSSProperties }) {
  return <div className="cr-card-head" style={style}>{title && <h2 className="cr-card-title" style={titleStyle}>{title}</h2>}{children}</div>;
}
