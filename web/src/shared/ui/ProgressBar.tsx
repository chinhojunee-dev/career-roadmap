import type { CSSProperties } from 'react';

/** 진행 바(cr-bar). mark 를 주면 목표 눈금이 함께 그려진다 (퍼센트) */
export function ProgressBar({ pct, mark, thin, label, style, ...aria }: {
  pct: number; mark?: number; thin?: boolean; label?: string; style?: CSSProperties; role?: string;
  'aria-valuemin'?: number; 'aria-valuemax'?: number; 'aria-valuenow'?: number;
}) {
  return (
    <div className={`cr-bar${thin ? ' thin' : ''}`} aria-label={label} style={style} {...aria}>
      <i style={{ width: `${pct}%` }} />
      {mark !== undefined && <b style={{ left: `${mark}%` }} />}
    </div>
  );
}
