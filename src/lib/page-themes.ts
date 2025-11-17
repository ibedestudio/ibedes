export type PageTheme = {
  key: string;
  label: string;
  colors: { bg: string; accent: string; ink: string };
  pattern: 'retro' | 'studio' | 'grid';
};

const THEMES: Record<string, PageTheme> = {
  default: {
    key: 'default',
    label: 'Default',
    colors: { bg: '#0f172a', accent: '#10b981', ink: '#f8fafc' },
    pattern: 'grid',
  },
  home: {
    key: 'home',
    label: 'Home Retro',
    colors: { bg: '#0b1220', accent: '#22d3ee', ink: '#e5f9ff' },
    pattern: 'retro',
  },
  studio: {
    key: 'studio',
    label: 'Studio Clean',
    colors: { bg: '#0c1a14', accent: '#10b981', ink: '#ecfdf5' },
    pattern: 'studio',
  },
};

export function getPageTheme(key?: string): PageTheme {
  if (!key) return THEMES.default;
  return THEMES[key] ?? THEMES.default;
}

