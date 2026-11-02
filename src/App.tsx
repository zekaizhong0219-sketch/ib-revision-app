import { lazy, Suspense, useEffect, useState } from 'react';
import { useStore } from './store';
import { href, navigate, useRoute, type RoutePath } from './router';
import { Icon } from './components/ui';
import { ShortcutHelp } from './components/Shortcuts';
import Dashboard from './views/Dashboard';
import type { ThemePref } from './types';

const Review = lazy(() => import('./views/Review'));
const Practice = lazy(() => import('./views/Practice'));
const Cards = lazy(() => import('./views/Cards'));
const Exams = lazy(() => import('./views/Exams'));
const Settings = lazy(() => import('./views/Settings'));

const NAV: { path: RoutePath; label: string; icon: string; key: string }[] = [
  { path: '/', label: 'Home', icon: 'home', key: 'd' },
  { path: '/review', label: 'Review', icon: 'cards', key: 'r' },
  { path: '/practice', label: 'Practice', icon: 'timer', key: 'p' },
  { path: '/cards', label: 'Library', icon: 'library', key: 'c' },
  { path: '/exams', label: 'Exams', icon: 'calendar', key: 'e' },
  { path: '/settings', label: 'Settings', icon: 'settings', key: 's' },
];

const NEXT_THEME: Record<ThemePref, ThemePref> = { system: 'light', light: 'dark', dark: 'system' };

function useTheme(pref: ThemePref) {
  useEffect(() => {
    const root = document.documentElement;
    if (pref === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', pref);
    const dark = pref === 'dark' || (pref === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f1115' : '#1f4fd1');
  }, [pref]);
}

export default function App() {
  const route = useRoute();
  const { data, updateSettings } = useStore();
  const [help, setHelp] = useState(false);
  useTheme(data.settings.theme);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '?') {
        setHelp((h) => !h);
        return;
      }
      if (e.key === 'Escape' && help) {
        setHelp(false);
        return;
      }
      if (e.key === 't') {
        updateSettings({ theme: NEXT_THEME[data.settings.theme] });
        return;
      }
      const item = NAV.find((n) => n.key === e.key);
      if (item) navigate(item.path);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [help, data.settings.theme, updateSettings]);

  const themeIcon = data.settings.theme === 'dark' ? 'moon' : data.settings.theme === 'light' ? 'sun' : 'auto';
  const nav = (cls: string) => (
    <nav className={cls} aria-label="Main">
      {NAV.map((n) => (
        <a key={n.path} href={href(n.path)} className={route.path === n.path ? 'active' : ''} aria-current={route.path === n.path ? 'page' : undefined}>
          <Icon name={n.icon} />
          <span>{n.label}</span>
        </a>
      ))}
    </nav>
  );

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href={href('/')} style={{ color: 'inherit', textDecoration: 'none' }}>
          <span className="brand-badge">IB</span> Revision
        </a>
        {nav('nav')}
        <div className="topbar-actions" style={{ marginLeft: 'auto' }}>
          <button className="btn ghost icon-btn kbd-hint" onClick={() => setHelp(true)} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)">
            <Icon name="keyboard" />
          </button>
          <button
            className="btn ghost icon-btn"
            onClick={() => updateSettings({ theme: NEXT_THEME[data.settings.theme] })}
            aria-label={`Theme: ${data.settings.theme}. Click to change.`}
            title={`Theme: ${data.settings.theme} (t)`}
          >
            <Icon name={themeIcon} />
          </button>
        </div>
      </header>
      <main>
        <Suspense fallback={<div className="empty">Loading…</div>}>
          {route.path === '/' && <Dashboard />}
          {route.path === '/review' && <Review route={route} />}
          {route.path === '/practice' && <Practice route={route} />}
          {route.path === '/cards' && <Cards />}
          {route.path === '/exams' && <Exams />}
          {route.path === '/settings' && <Settings />}
        </Suspense>
      </main>
      {nav('bottom-nav')}
      {help && <ShortcutHelp onClose={() => setHelp(false)} />}
    </div>
  );
}
