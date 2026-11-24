import type { CSSProperties, ReactNode } from 'react';

/** 체크 항목 (cr-check). 체크박스 + 내용. 완료되면 취소선 */
export function CheckItem({ checked, onToggle, label, children, style }: {
  checked: boolean; onToggle: () => void; label: string; children: ReactNode; style?: CSSProperties;
}) {
  return (
    <div className="cr-check" data-done={checked ? 'true' : 'false'} style={style}>
      <input type="checkbox" aria-label={label} checked={checked} onChange={onToggle} style={{ margin: 0 }} />
      {children}
    </div>
  );
}
