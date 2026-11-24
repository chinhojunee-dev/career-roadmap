export function ProgressRing({ value, size = 76, label }: { value: number; size?: number; label: string }) {
  const C = 2 * Math.PI * 36;
  return (
    <div className="cr-ring" role="img" aria-label={label} style={{ width: size, height: size }}>
      <svg viewBox="0 0 88 88" aria-hidden="true">
        <circle cx="44" cy="44" r="36" fill="none" stroke="var(--neutral-100)" strokeWidth="9" />
        <circle cx="44" cy="44" r="36" fill="none" stroke="var(--blue-500)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(C * value / 100).toFixed(1)} ${C.toFixed(1)}`} />
      </svg>
      <div><span style={{ fontSize: 19, fontWeight: 800, color: 'var(--neutral-900)' }}>{value}%</span></div>
    </div>
  );
}
