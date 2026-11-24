import type { CSSProperties, ReactNode } from 'react';

/** 18×18 선 아이콘. path 는 d 문자열 배열 */
export function Icon({ d, size, stroke = 1.6, style }: { d: string | string[]; size?: number; stroke?: number; style?: CSSProperties }) {
  const list = Array.isArray(d) ? d : [d];
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true" width={size} height={size} style={style}
      {...(size ? { fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' } : {})}>
      {list.map((x, i) => <path key={i} d={x} />)}
    </svg>
  );
}
export const Raw = ({ children }: { children: ReactNode }) => <svg viewBox="0 0 18 18" aria-hidden="true">{children}</svg>;
