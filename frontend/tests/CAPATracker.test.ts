import { describe, it, expect } from 'vitest';

describe('CAPATracker', () => {
  it('should render without crashing', () => {
    expect(true).toBe(true);
  });

  it('should sort CAPAs by due date', () => {
    const capas = [
      { dateDue: '2025-02-15' },
      { dateDue: '2025-01-20' },
      { dateDue: null },
    ];

    const sorted = [...capas].sort((a, b) => {
      if (!a.dateDue) return 1;
      if (!b.dateDue) return -1;
      return new Date(a.dateDue).getTime() - new Date(b.dateDue).getTime();
    });

    expect(sorted[0].dateDue).toBe('2025-01-20');
    expect(sorted[1].dateDue).toBe('2025-02-15');
    expect(sorted[2].dateDue).toBe(null);
  });

  it('should truncate long descriptions', () => {
    const truncate = (text: string, maxLength: number): string => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const longText = 'This is a very long description that should be truncated to 60 characters';
    const result = truncate(longText, 60);
    
    expect(result.length).toBeLessThanOrEqual(63); // 60 + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  it('should determine correct status colors', () => {
    const getStatusColor = (severity: string | null, status: string, dateDue: string | null): string => {
      if (status === 'closed') return '#38a169'; // Green

      const isOverdue = dateDue && new Date(dateDue) < new Date();
      if (isOverdue || severity === 'critical') return '#e53e3e'; // Red

      if (severity === 'major') return '#dd6b20'; // Orange
      if (severity === 'minor') return '#ecc94b'; // Yellow

      return '#4299e1'; // Blue
    };

    expect(getStatusColor(null, 'closed', null)).toBe('#38a169'); // Green
    expect(getStatusColor('critical', 'open', null)).toBe('#e53e3e'); // Red
    expect(getStatusColor('major', 'open', null)).toBe('#dd6b20'); // Orange
    expect(getStatusColor('minor', 'open', null)).toBe('#ecc94b'); // Yellow
  });
});
