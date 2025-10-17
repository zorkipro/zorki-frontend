/**
 * BREAKPOINTS - Точки адаптива
 *
 * Все breakpoints для responsive дизайна
 */

export const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Media queries
 */
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,

  // Max-width queries
  maxXs: `@media (max-width: ${breakpoints.xs})`,
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
  maxXl: `@media (max-width: ${breakpoints.xl})`,
  max2xl: `@media (max-width: ${breakpoints['2xl']})`,
} as const;

/**
 * Semantic breakpoints
 */
export const semanticBreakpoints = {
  mobile: breakpoints.xs,
  tablet: breakpoints.md,
  desktop: breakpoints.lg,
  wide: breakpoints.xl,
} as const;

// Типы для TypeScript
export type Breakpoints = typeof breakpoints;
export type MediaQueries = typeof mediaQueries;
