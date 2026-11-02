import { useEffect, useState } from 'react';

export type RoutePath = '/' | '/review' | '/practice' | '/mock' | '/listening' | '/sources' | '/writing' | '/cards' | '/exams' | '/settings';
export const ROUTES: RoutePath[] = ['/', '/review', '/practice', '/mock', '/listening', '/sources', '/writing', '/cards', '/exams', '/settings'];

export interface Route {
  path: RoutePath;
  params: URLSearchParams;
}

export function parseHash(hash: string): Route {
  const raw = hash.replace(/^#/, '') || '/';
  const [p, q = ''] = raw.split('?');
  const path = (ROUTES as string[]).includes(p) ? (p as RoutePath) : '/';
  return { path, params: new URLSearchParams(q) };
}

export function href(path: RoutePath, params?: Record<string, string | string[] | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) {
    if (v === undefined) continue;
    if (Array.isArray(v)) {
      if (v.length) sp.set(k, v.join(','));
    } else sp.set(k, v);
  }
  const q = sp.toString();
  return `#${path}${q ? `?${q}` : ''}`;
}

export function navigate(path: RoutePath, params?: Record<string, string | string[] | undefined>): void {
  window.location.hash = href(path, params);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const on = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
