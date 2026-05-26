import { describe, it, expect } from 'vitest';
import { truncateLastLine } from '@/utils/pdfUtils';

// Simple getTextWidth mock: each character = 1 unit
const mockGetTextWidth = (text: string) => text.length;

describe('truncateLastLine', () => {
  it('returns empty array unchanged', () => {
    expect(truncateLastLine([], 100, mockGetTextWidth)).toEqual([]);
  });

  it('truncates last line with ellipsis removing 3 chars for long lines', () => {
    const lines = ['Short', 'ThisIsAVeryLongLine'];
    const result = truncateLastLine(lines, 10, mockGetTextWidth);
    // 'ThisIsAVeryLongLine' (19 chars) → remove 3 + '...' = 19 chars → too long
    // Keeps truncating until fits within 10
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('Short');
    expect(result[1]).toContain('...');
    expect(mockGetTextWidth(result[1])).toBeLessThanOrEqual(10);
  });

  it('appends ellipsis to short lines (<=3 chars)', () => {
    const lines = ['Header', 'AB'];
    const result = truncateLastLine(lines, 3, mockGetTextWidth);
    // 'AB' → 'AB...' = 5 → too wide → '...' = 3 ✓
    expect(result[1]).toBe('...');
  });

  it('preserves all lines except the last one', () => {
    const lines = ['Line1', 'Line2', 'VeryLongLineThatExceedsWidth'];
    const result = truncateLastLine(lines, 10, mockGetTextWidth);
    expect(result[0]).toBe('Line1');
    expect(result[1]).toBe('Line2');
    expect(result[2]).toContain('...');
  });

  it('never produces a line shorter than just the ellipsis', () => {
    const lines = ['A'.repeat(50)];
    const result = truncateLastLine(lines, 5, mockGetTextWidth);
    expect(mockGetTextWidth(result[0])).toBeLessThanOrEqual(5);
    expect(result[0].length).toBeGreaterThanOrEqual(3); // at least '...'
  });

  it('handles maxWidth that exactly fits truncated line', () => {
    // 'Hello' = 5 chars, truncate: 'He...' = 5 chars, maxWidth = 5
    const lines = ['Hello'];
    const result = truncateLastLine(lines, 5, mockGetTextWidth);
    expect(mockGetTextWidth(result[0])).toBeLessThanOrEqual(5);
    expect(result[0]).toContain('...');
  });

  it('works with a single line', () => {
    const lines = ['A very long single line that exceeds'];
    const result = truncateLastLine(lines, 8, mockGetTextWidth);
    expect(result).toHaveLength(1);
    expect(result[0]).toContain('...');
    expect(mockGetTextWidth(result[0])).toBeLessThanOrEqual(8);
  });

  it('handles maxWidth = minimum (just ellipsis)', () => {
    const lines = ['Something'];
    const result = truncateLastLine(lines, 3, mockGetTextWidth);
    // Only '...' fits in 3 chars
    expect(result[0]).toBe('...');
  });

  it('truncates progressively when initial truncation is still too wide', () => {
    const lines = ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    const result = truncateLastLine(lines, 8, mockGetTextWidth);
    // Remove 3 → 'ABCDEFGHIJKLMNOPQRS...' = 26 - 3 + 3 = 23, still too wide
    // Keeps truncating: each iteration removes 1 char + keeps '...'
    expect(mockGetTextWidth(result[0])).toBeLessThanOrEqual(8);
    expect(result[0]).toContain('...');
  });
});
