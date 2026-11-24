'use client';
import Link from 'next/link';
import { NAV, THEME_ICON } from '../model/options';
import { useTheme } from '../hooks/useTheme';
import { Icon, Raw } from '@/shared/ui/Svg';
import { FLAG } from '@/shared/ui/IconTile';

const NAV_ICON: Record<string, React.ReactNode> = {
  '/goal': <Raw><circle cx="9" cy="9" r="6.5" /><circle cx="9" cy="9" r="3" /><path d="M9 9h.01" /></Raw>,
  '/dashboard': <Raw><circle cx="9" cy="7" r="2.6" /><path d="M9 16s-5-4.3-5-8.5a5 5 0 0 1 10 0C14 11.7 9 16 9 16z" /></Raw>,
  '/roadmap': <Icon d={FLAG} />,
  '/activities': <Icon d={['M9 2 2 5.5 9 9l7-3.5L9 2z', 'M2 9l7 3.5L16 9', 'M2 12.5l7 3.5 7-3.5']} />,
};

export function Sidebar({ active, goal, hireTerm, open, onToggle }: {
  active: string; goal: string; hireTerm: string; open: boolean; onToggle: () => void;
}) {
  const { theme, mounted, toggle } = useTheme();
  const sideLabel = open ? '사이드바 접기' : '사이드바 펼치기';
  // 마운트 전에는 서버 렌더와 같은 값(라이트 기준)으로 맞춰 hydration 오류를 피한다
  const dark = mounted && theme === 'dark';
  const themeLabel = dark ? '라이트모드' : '다크모드';
  return (
    <aside className="app-sidebar">
      <div className="side-top">
        <Link className="app-brand" href="/roadmap" title="학기별 로드맵으로 이동">
          <span className="cr-ico" style={{ width: 28, height: 28, background: 'var(--blue-500)', color: '#fff', flexShrink: 0 }}><Icon d={FLAG} /></span> 커리어 로드맵
        </Link>
        <button type="button" className="side-toggle" aria-label={sideLabel} title={sideLabel} aria-expanded={open} onClick={onToggle}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="3" width="13" height="12" rx="2" /><path d="M7 3v12" /></svg>
        </button>
      </div>
      <div className="app-nav">
        {NAV.map((n) => (
          <Link key={n.href} className={`app-nav-item${n.href === active ? ' active' : ''}`} href={n.href} title={n.title}>{NAV_ICON[n.href]}{n.title}</Link>
        ))}
      </div>
      <div className="app-nav-recents">
        <div className="app-nav-recents-label">목표 직무</div>
        <Link className="app-nav-recent" href="/goal"><span className="co">{goal}</span><span className="role">{hireTerm} 취업 목표</span></Link>
      </div>
      <div className="app-nav-bottom">
        <button type="button" className="app-nav-item" title={themeLabel} onClick={toggle}><Icon d={dark ? THEME_ICON.toLight : THEME_ICON.toDark} />{themeLabel}</button>
        <button type="button" className="app-nav-item" title="설정">
          <Raw><circle cx="9" cy="9" r="3.2" /><path d="M13.5 9h1.9M2.6 9h1.9M9 13.5v1.9M9 2.6v1.9M12.18 12.18l1.35 1.35M4.47 4.47l1.35 1.35M5.82 12.18l-1.35 1.35M13.53 4.47l-1.35 1.35" /></Raw>설정
        </button>
      </div>
    </aside>
  );
}
