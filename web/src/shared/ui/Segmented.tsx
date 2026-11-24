import type { CSSProperties } from 'react';

export function Segmented({ options, value, onChange, label, style }: {
  options: string[]; value: string; onChange: (v: string) => void; label?: string; style?: CSSProperties;
}) {
  return (
    <div className="cr-seg" role="group" aria-label={label} style={style}>
      {options.map((o) => <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>)}
    </div>
  );
}
