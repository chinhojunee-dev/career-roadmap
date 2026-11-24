'use client';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { careerApi } from '../api';
import { useCareerData } from '../hooks/useCareerData';

/**
 * 모든 화면의 바깥 틀: 사이드바 + 메인.
 * overlay 는 메인 위에 덮는 패널(상세 서랍 등). goal/hireTerm 을 주면 그 값을 쓰고, 없으면 프로필에서 읽는다.
 */
export function AppShell({ active, defaultOpen, goal, hireTerm, mainStyle, overlay, children }: {
  active: string; defaultOpen: boolean; goal?: string; hireTerm?: string;
  mainStyle?: CSSProperties; overlay?: ReactNode; children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [profile] = useCareerData(() => careerApi.getProfile());
  return (
    <div className="cr-root">
      <div className="pf-root" data-pf="">
        <div className="stage-outer"><div className="stage">
          <div className="screen active" id="screen-app">
            <div className={`app-shell ${open ? '' : 'side-collapsed'}`.trim()}>
              <Sidebar active={active} goal={goal ?? profile?.goalJob ?? ''} hireTerm={hireTerm ?? profile?.timing ?? ''} open={open} onToggle={() => setOpen(!open)} />
              <main className="app-main" style={mainStyle}>{children}</main>
            </div>
          </div>
        </div></div>
      </div>
      {overlay}
    </div>
  );
}

/** 메인 위에 덮는 레이어 (시안의 두 번째 pf-root) */
export function Overlay({ children }: { children: ReactNode }) {
  return <div className="pf-root" data-pf="" style={{ position: 'absolute', inset: 0, zIndex: 40 }}>{children}</div>;
}
