import { describe, expect, test } from 'vitest';
import { parseAsIntOrNothing } from './numeric';

describe('Numeric parsing', () => {
  test('should provide expected number assuming everything goes right', () => {
    expect(parseAsIntOrNothing('123')).toEqual(123);
  });

  test('should disallow decimal numbers', () => {
    expect(parseAsIntOrNothing('123.45')).toBeUndefined();
  });

  test('should return undefined for anything that is not a number', () => {
    expect(parseAsIntOrNothing('wh4tt15th15')).toBeUndefined();
  });

  test('should return 0 for empty string', () => {
    expect(parseAsIntOrNothing('')).toEqual(0);
  });
});
