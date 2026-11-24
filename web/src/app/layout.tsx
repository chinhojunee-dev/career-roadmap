import type { Metadata } from 'next';
import 'pretendard/dist/web/variable/pretendardvariable.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
import '@/styles/tokens.css';
import '@/styles/tokens-overrides.css';
import '@/styles/design.css';
import '@/styles/app.css';
import { ThemeProvider } from '@/features/career-roadmap/hooks/useTheme';
import { THEME_KEY } from '@/features/career-roadmap/model/constants';

export const metadata: Metadata = { title: '커리어 로드맵', description: '목표 직무에 닿는 학기별 계획' };

// 첫 페인트 전에 data-theme 을 정해 깜빡임을 막는다. (저장값 → 시스템 설정 → 라이트)
const themeScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','light')}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
