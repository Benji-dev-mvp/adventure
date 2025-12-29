/**
 * Color Utilities - Render Safety
 * 
 * Validates and sanitizes colors to prevent canvas rendering crashes.
 * All color inputs are validated before use in canvas operations.
 */

// Valid CSS color regex patterns
const HEX_COLOR_REGEX = /^#([0-9A-F]{3}){1,2}$/i;
const RGB_COLOR_REGEX = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i;
const RGBA_COLOR_REGEX = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/i;
const HSL_COLOR_REGEX = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/i;
const HSLA_COLOR_REGEX = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*[\d.]+\s*\)$/i;

// Safe default color (neutral gray)
const DEFAULT_SAFE_COLOR = '#6B7280';

// Named CSS colors that are safe to use
const NAMED_COLORS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black',
  'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
  'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
  'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
  'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon',
  'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
  'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick',
  'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod',
  'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo',
  'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue',
  'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
  'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray',
  'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta',
  'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
  'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue',
  'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab',
  'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
  'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple',
  'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown',
  'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey',
  'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet',
  'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen', 'transparent'
]);

/**
 * Validates if a string is a valid CSS color
 */
export function isValidColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }

  const trimmedColor = color.trim().toLowerCase();

  // Check named colors
  if (NAMED_COLORS.has(trimmedColor)) {
    return true;
  }

  // Check hex colors
  if (HEX_COLOR_REGEX.test(trimmedColor)) {
    return true;
  }

  // Check rgb/rgba
  if (RGB_COLOR_REGEX.test(trimmedColor) || RGBA_COLOR_REGEX.test(trimmedColor)) {
    return true;
  }

  // Check hsl/hsla
  if (HSL_COLOR_REGEX.test(trimmedColor) || HSLA_COLOR_REGEX.test(trimmedColor)) {
    return true;
  }

  return false;
}

/**
 * Sanitizes a color string, returning a safe default if invalid
 */
export function sanitizeColor(color: string, fallback: string = DEFAULT_SAFE_COLOR): string {
  if (isValidColor(color)) {
    return color.trim();
  }

  // If fallback is also invalid, use the default safe color
  if (!isValidColor(fallback)) {
    return DEFAULT_SAFE_COLOR;
  }

  return fallback;
}

/**
 * Sanitizes an array of colors
 */
export function sanitizeColors(colors: string[], fallback: string = DEFAULT_SAFE_COLOR): string[] {
  return colors.map(color => sanitizeColor(color, fallback));
}

/**
 * Adds alpha channel to a color (hex or rgb)
 * Returns sanitized color with alpha or fallback
 */
export function addAlpha(color: string, alpha: number): string {
  const sanitized = sanitizeColor(color);
  
  // Clamp alpha between 0 and 1
  const clampedAlpha = Math.max(0, Math.min(1, alpha));

  // Convert hex to rgba
  if (sanitized.startsWith('#')) {
    const hex = sanitized.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${clampedAlpha})`;
  }

  // Convert rgb to rgba
  if (sanitized.startsWith('rgb(')) {
    return sanitized.replace('rgb(', 'rgba(').replace(')', `, ${clampedAlpha})`);
  }

  // If already rgba, update alpha
  if (sanitized.startsWith('rgba(')) {
    return sanitized.replace(/,\s*[\d.]+\s*\)$/, `, ${clampedAlpha})`);
  }

  // Fallback: return the color as is
  return sanitized;
}

/**
 * Adjusts color brightness (lightens or darkens)
 * @param color - Base color
 * @param amount - Amount to adjust (-255 to 255)
 * @returns Adjusted color or fallback if invalid
 */
export function adjustBrightness(color: string, amount: number): string {
  const sanitized = sanitizeColor(color);

  // Only works with hex colors
  if (!sanitized.startsWith('#')) {
    return sanitized;
  }

  const hex = sanitized.replace('#', '');
  const r = Math.max(0, Math.min(255, parseInt(hex.substring(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substring(2, 4), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substring(4, 6), 16) + amount));

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Creates a safe gradient string for canvas
 */
export function createGradient(
  colors: string[],
  fallback: string = DEFAULT_SAFE_COLOR
): string[] {
  return sanitizeColors(colors, fallback);
}

/**
 * Validates and returns a color, throwing error if invalid (for development)
 */
export function assertValidColor(color: string, context?: string): string {
  if (!isValidColor(color)) {
    const message = context 
      ? `Invalid color "${color}" in ${context}` 
      : `Invalid color "${color}"`;
    console.error(message);
    
    // In development, throw error; in production, return safe fallback
    if (import.meta.env.DEV) {
      throw new Error(message);
    }
    
    return DEFAULT_SAFE_COLOR;
  }
  return color.trim();
}
