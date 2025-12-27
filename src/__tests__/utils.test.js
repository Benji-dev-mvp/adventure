import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateURL } from '../lib/validation';
import { formatDate, formatCurrency, truncateText } from '../lib/utils';

describe('Validation Functions', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('validates correct phone numbers', () => {
      expect(validatePhone('123-456-7890')).toBe(true);
      expect(validatePhone('(123) 456-7890')).toBe(true);
    });

    it('rejects invalid phone numbers', () => {
      expect(validatePhone('12345')).toBe(false);
      expect(validatePhone('abcd')).toBe(false);
    });
  });

  describe('validateURL', () => {
    it('validates correct URLs', () => {
      expect(validateURL('https://example.com')).toBe(true);
      expect(validateURL('http://sub.domain.com')).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(validateURL('not a url')).toBe(false);
      expect(validateURL('example')).toBe(false);
    });
  });
});

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const date = new Date('2024-01-15');
      const formatted = formatDate(date);
      expect(formatted).toContain('2024');
      expect(formatted).toContain('15');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency values', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('truncateText', () => {
    it('truncates long text', () => {
      const text = 'This is a very long text that should be truncated';
      const truncated = truncateText(text, 20);
      expect(truncated.length).toBeLessThanOrEqual(23); // 20 + '...'
      expect(truncated).toContain('...');
    });

    it('does not truncate short text', () => {
      const text = 'Short text';
      const truncated = truncateText(text, 20);
      expect(truncated).toBe(text);
    });
  });
});
