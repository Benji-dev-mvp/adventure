export type DensityMode = 'comfortable' | 'compact';

export interface DensityTokens {
  fontSizeBase: string; // html base font-size
  lineHeightBase: number; // unitless line-height
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  spaceScale: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    7: string;
    8: string;
  };
  controlHeights: {
    sm: string;
    md: string;
  };
  cardPadding: {
    sm: string;
    md: string;
  };
  rowHeight: string;
}

export const TOKENS: Record<DensityMode, DensityTokens> = {
  comfortable: {
    fontSizeBase: '15px',
    lineHeightBase: 1.5,
    radius: { sm: '6px', md: '8px', lg: '12px' },
    spaceScale: {
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '2rem',
      8: '2.5rem',
    },
    controlHeights: { sm: '34px', md: '40px' },
    cardPadding: { sm: '0.9rem', md: '1.25rem' },
    rowHeight: '44px',
  },
  compact: {
    fontSizeBase: '14px',
    lineHeightBase: 1.45,
    radius: { sm: '5px', md: '7px', lg: '10px' },
    spaceScale: {
      1: '0.22rem',
      2: '0.42rem',
      3: '0.64rem',
      4: '0.85rem',
      5: '1.05rem',
      6: '1.28rem',
      7: '1.7rem',
      8: '2.1rem',
    },
    controlHeights: { sm: '30px', md: '34px' },
    cardPadding: { sm: '0.75rem', md: '1rem' },
    rowHeight: '38px',
  },
};

/**
 * Returns a set of classes tied to CSS variables so Tailwind can consume tokens.
 * Use in shared primitives (Button, Input, Card, Table, Badge) to normalize density.
 */
export const densityClassNames = (mode: DensityMode = 'compact') => {
  const t = TOKENS[mode];
  return {
    // typography
    fontBase: `text-[var(--font-base)]`,
    fontSm: `text-[var(--font-sm)]`,
    fontXs: `text-[var(--font-xs)]`,
    // spacing
    pxSm: `px-[var(--space-3)]`,
    pxMd: `px-[var(--space-4)]`,
    pySm: `py-[var(--space-2)]`,
    pyMd: `py-[var(--space-3)]`,
    gapSm: `gap-[var(--space-2)]`,
    gapMd: `gap-[var(--space-3)]`,
    // controls
    hSm: `h-[var(--control-h-sm)]`,
    hMd: `h-[var(--control-h-md)]`,
    // cards
    cardPadSm: `p-[var(--card-pad-sm)]`,
    cardPadMd: `p-[var(--card-pad-md)]`,
    // table/list row height
    rowH: `h-[var(--row-h)]`,
    // radius
    radiusSm: `rounded-[var(--radius-sm)]`,
    radiusMd: `rounded-[var(--radius-md)]`,
    radiusLg: `rounded-[var(--radius-lg)]`,
  };
};

export const DEFAULT_DENSITY: DensityMode = 'compact';
