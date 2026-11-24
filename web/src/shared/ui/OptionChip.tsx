import type { CSSProperties, ReactNode } from 'react';

export function OptionChip({ pressed, onClick, children, style }: { pressed?: boolean; onClick: () => void; children: ReactNode; style?: CSSProperties }) {
  return <button type="button" className="cr-opt" aria-pressed={pressed ?? false} onClick={onClick} style={style}>{children}</button>;
}
/** 선택 칩 묶음. multi 면 여러 개 선택 */
export function OptionGroup({ options, value, onChange, label, multi }: {
  options: string[]; value: string | string[]; onChange: (v: string) => void; label?: string; multi?: boolean;
}) {
  const on = (o: string) => (multi ? (value as string[]).includes(o) : value === o);
  return (
    <div className="cr-opts" role="group" aria-label={label}>
      {options.map((o) => <OptionChip key={o} pressed={on(o)} onClick={() => onChange(o)}>{o}</OptionChip>)}
    </div>
  );
}
