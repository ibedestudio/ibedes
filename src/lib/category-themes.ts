export type CategoryTheme = {
  key: 'programmer' | 'islamic' | 'life' | 'default';
  label: string;
  colors: {
    bg: string; // background base
    accent: string; // primary accent
    ink: string; // readable light ink
  };
  pattern: 'matrix' | 'stars' | 'paper';
  icon: string; // inline SVG markup
  aliases: string[]; // tag slugs belonging to this theme
};

const THEMES: CategoryTheme[] = [
  {
    key: 'programmer',
    label: 'Programmer',
    colors: {
      bg: '#0b1320',
      accent: '#10b981',
      ink: '#e6fff7',
    },
    pattern: 'matrix',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 4h18v14H3z" opacity=".15"/>
        <path d="M3 2h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 4v12h16V6H4zm3 9h4v2H7v-2zm0-8h10v2H7V7z"/>
      </svg>
    `,
    aliases: [
      'belajar-coding',
      'programming',
      'coding',
      'dev',
      'developer',
      'software',
      'web-development',
      'web-dev',
      'tech',
    ],
  },
  {
    key: 'islamic',
    label: 'Islamic',
    colors: {
      bg: '#0d1f18',
      accent: '#d4af37',
      ink: '#fffbe6',
    },
    pattern: 'stars',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.5 3a7.5 7.5 0 1 0 6.708 10.757A6.5 6.5 0 1 1 12.5 3z"/>
        <path d="M18.5 6.5 17 7l.5-1.5L16 5l1.5-.5L18 3l.5 1.5L20 5l-1.5.5z"/>
      </svg>
    `,
    aliases: [
      'islam',
      'tasawuf',
      'sufistik',
      'spiritual',
      'dzikir',
      'filsafat-islam',
      'syuruk',
      'syuruq',
    ],
  },
  {
    key: 'life',
    label: 'Life & Journal',
    colors: {
      bg: '#231f1b',
      accent: '#f59e0b',
      ink: '#fff8f1',
    },
    pattern: 'paper',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 21c-5-3.5-8-6.5-8-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 3.5-3 6.5-8 10l-1 .7-1-.7z"/>
      </svg>
    `,
    aliases: [
      'refleksi',
      'kehidupan',
      'keluarga',
      'ayah',
      'motivasi',
      'mindset-pemula',
    ],
  },
];

const DEFAULT_THEME: CategoryTheme = {
  key: 'default',
  label: 'Default',
  colors: { bg: '#111827', accent: '#10b981', ink: '#f9fafb' },
  pattern: 'paper',
  icon: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4 4h16v4H4zM4 10h16v10H4z"/>
    </svg>
  `,
  aliases: [],
};

/**
 * Return a theme for a given tag slug.
 * Falls back to DEFAULT_THEME when not matched.
 */
export function getThemeForTagSlug(slug: string): CategoryTheme {
  const s = (slug || '').trim().toLowerCase();
  for (const t of THEMES) {
    if (t.aliases.includes(s)) return t;
  }
  // additionally try partial match (e.g., 'web-development' → programmer)
  if (/dev|code|program|tech/.test(s)) return THEMES[0];
  if (/islam|sufi|dzikir|tasawuf|syur/.test(s)) return THEMES[1];
  if (/refleksi|hidup|keluarga|ayah|motivasi|mindset/.test(s)) return THEMES[2];
  return DEFAULT_THEME;
}

export const CATEGORY_THEMES = THEMES;

