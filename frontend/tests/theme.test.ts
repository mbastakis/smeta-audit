import { describe, it, expect } from 'vitest';
import { theme } from '../src/theme';

describe('Theme Configuration', () => {
  it('should have navy primary color', () => {
    expect(theme.palette.primary.main).toBe('#1a365d');
  });

  it('should have green secondary color', () => {
    expect(theme.palette.secondary.main).toBe('#38a169');
  });

  it('should have light background', () => {
    expect(theme.palette.background.default).toBe('#f7fafc');
  });

  it('should use Roboto font family', () => {
    expect(theme.typography.fontFamily).toContain('Roboto');
  });

  it('should have h4 with fontWeight 600', () => {
    expect(theme.typography.h4?.fontWeight).toBe(600);
  });
});
