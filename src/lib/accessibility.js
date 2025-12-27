/**
 * Accessibility utilities and ARIA helpers
 * Ensures WCAG 2.1 AA compliance
 */

/**
 * Keyboard navigation helpers
 */
export const KeyCodes = {
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  TAB: 9,
  HOME: 36,
  END: 35,
};

/**
 * Check if element is focusable
 */
export function isFocusable(element) {
  if (!element) return false;
  
  const focusableTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
  const isFocusableTag = focusableTags.includes(element.tagName);
  const hasTabIndex = element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1';
  const isDisabled = element.hasAttribute('disabled');
  
  return (isFocusableTag || hasTabIndex) && !isDisabled;
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container) {
  if (!container) return [];
  
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  return Array.from(container.querySelectorAll(selector));
}

/**
 * Trap focus within a container (for modals, dialogs)
 */
export function trapFocus(container, event) {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.key !== 'Tab') return;
  
  if (event.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement?.focus();
    }
  } else {
    // Tab
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement?.focus();
    }
  }
}

/**
 * Generate unique ID for ARIA attributes
 */
let idCounter = 0;
export function generateId(prefix = 'id') {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Date.now()}`;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Color contrast checker (WCAG 2.1 AA requires 4.5:1 for normal text)
 */
export function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getRelativeLuminance(rgb) {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function meetsContrastRequirements(color1, color2, level = 'AA', size = 'normal') {
  const ratio = getContrastRatio(color1, color2);
  
  if (level === 'AA') {
    return size === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
  // AAA
  return size === 'large' ? ratio >= 4.5 : ratio >= 7;
}

/**
 * ARIA live region helper
 */
export class LiveRegion {
  constructor(priority = 'polite') {
    this.element = document.createElement('div');
    this.element.setAttribute('role', 'status');
    this.element.setAttribute('aria-live', priority);
    this.element.setAttribute('aria-atomic', 'true');
    this.element.className = 'sr-only';
    document.body.appendChild(this.element);
  }
  
  announce(message) {
    this.element.textContent = message;
  }
  
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Screen reader only CSS class
 * Add this to your global styles:
 */
export const srOnlyStyles = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

/**
 * ARIA attributes builder
 */
export function buildAriaAttributes(config) {
  const attrs = {};
  
  if (config.label) attrs['aria-label'] = config.label;
  if (config.labelledBy) attrs['aria-labelledby'] = config.labelledBy;
  if (config.describedBy) attrs['aria-describedby'] = config.describedBy;
  if (config.expanded !== undefined) attrs['aria-expanded'] = String(config.expanded);
  if (config.selected !== undefined) attrs['aria-selected'] = String(config.selected);
  if (config.pressed !== undefined) attrs['aria-pressed'] = String(config.pressed);
  if (config.checked !== undefined) attrs['aria-checked'] = String(config.checked);
  if (config.disabled !== undefined) attrs['aria-disabled'] = String(config.disabled);
  if (config.hidden !== undefined) attrs['aria-hidden'] = String(config.hidden);
  if (config.live) attrs['aria-live'] = config.live;
  if (config.role) attrs['role'] = config.role;
  
  return attrs;
}

/**
 * Focus management utility
 */
export class FocusManager {
  constructor() {
    this.previousFocus = null;
  }
  
  saveFocus() {
    this.previousFocus = document.activeElement;
  }
  
  restoreFocus() {
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
  }
  
  moveFocusToFirstElement(container) {
    const focusable = getFocusableElements(container);
    focusable[0]?.focus();
  }
  
  moveFocusToLastElement(container) {
    const focusable = getFocusableElements(container);
    focusable[focusable.length - 1]?.focus();
  }
}

/**
 * Keyboard navigation handler for lists
 */
export function handleListNavigation(event, items, currentIndex, onSelect) {
  let newIndex = currentIndex;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      newIndex = Math.min(currentIndex + 1, items.length - 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      newIndex = Math.max(currentIndex - 1, 0);
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = items.length - 1;
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      if (onSelect && items[currentIndex]) {
        onSelect(items[currentIndex]);
      }
      return currentIndex;
    default:
      return currentIndex;
  }
  
  return newIndex;
}

/**
 * Skip to content link helper
 */
export function createSkipLink(targetId, text = 'Skip to main content') {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'skip-link';
  skipLink.textContent = text;
  
  skipLink.style.cssText = `
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.cssText = `
      position: static;
      width: auto;
      height: auto;
    `;
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.cssText = `
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
  });
  
  return skipLink;
}

/**
 * Validate ARIA attributes
 */
export function validateAriaAttributes(element) {
  const warnings = [];
  
  // Check for aria-label or aria-labelledby on interactive elements
  const role = element.getAttribute('role');
  const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'option'];
  
  if (interactiveRoles.includes(role) || ['BUTTON', 'A'].includes(element.tagName)) {
    const hasLabel = element.hasAttribute('aria-label');
    const hasLabelledBy = element.hasAttribute('aria-labelledby');
    const hasTextContent = element.textContent.trim().length > 0;
    
    if (!hasLabel && !hasLabelledBy && !hasTextContent) {
      warnings.push('Interactive element missing accessible label');
    }
  }
  
  // Check for proper aria-expanded usage
  if (element.hasAttribute('aria-expanded')) {
    const value = element.getAttribute('aria-expanded');
    if (value !== 'true' && value !== 'false') {
      warnings.push('aria-expanded must be "true" or "false"');
    }
  }
  
  return warnings;
}
