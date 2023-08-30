import { useDark } from '@vueuse/core';
import { describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { useDarkAlternate } from './dark';

vi.mock('@vueuse/core');

describe('Dark mode alternating composable', () => {
  test('should be able to return light version of input', () => {
    useDark.mockReturnValue(ref(false));

    const current = useDarkAlternate('one', 'two');
    expect(current.value).toEqual('one');
  });

  test('should be able to return dark version of input', () => {
    useDark.mockReturnValue(ref(true));

    const current = useDarkAlternate('one', 'two');
    expect(current.value).toEqual('two');
  });

  test('should be able to work with ref data', () => {
    useDark.mockReturnValue(ref(true));

    const current = useDarkAlternate(ref('one'), ref(['two']));
    expect(current.value).toEqual(['two']);
  });

  test('should make up a dark version of text if none is provided', () => {
    useDark.mockReturnValue(ref(true));

    const current = useDarkAlternate('one');
    expect(current.value).toEqual('one-dark');
  });

  test('should make up a dark version by removing "-dark" if present', () => {
    useDark.mockReturnValue(ref(true));

    const current = useDarkAlternate('one-light');
    expect(current.value).toEqual('one');
  });

  test('should make up dark versions of text items if none is provided', () => {
    useDark.mockReturnValue(ref(true));

    const current = useDarkAlternate(['one', 'two-light', 'three']);
    expect(current.value).toEqual(['one-dark', 'two', 'three-dark']);
  });

  test('should not work with objects', () => {
    useDark.mockReturnValue(ref(true));

    expect(() => {
      const current = useDarkAlternate({ thisis: 'wrong' }).value; // Get the value to have it trigger
    }).toThrowError();
  });
});
