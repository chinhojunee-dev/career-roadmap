'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { THEME_KEY } from '../model/constants';
export type Theme = 'light' | 'dark';

const Ctx = createContext<{ theme: Theme; mounted: boolean; toggle: () => void }>({ theme: 'light', mounted: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // 하이드레이션이 <html> 속성을 지울 수 있어서, 마운트 후 저장값 → 시스템 설정 순으로 다시 적용한다.
  useEffect(() => {
    let t: Theme | null = null;
    try { const v = localStorage.getItem(THEME_KEY); if (v === 'dark' || v === 'light') t = v; } catch { /* 저장소 접근 불가 */ }
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
    setTheme(t);
    setMounted(true);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* 저장 불가 환경은 무시 */ }
    setTheme(next);
  }, [theme]);

  return <Ctx.Provider value={{ theme, mounted, toggle }}>{children}</Ctx.Provider>;
}

export const useTheme = () => useContext(Ctx);
