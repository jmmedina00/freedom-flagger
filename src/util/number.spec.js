import { afterEach, describe, expect, test, vi } from 'vitest';
import { getNumberStartingValue } from './number';
import { NUMBER_DEFAULT } from '@app/state';

describe('Number default fetching', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('should get number from Base64 query param', () => {
    vi.stubGlobal('location', {
      href: 'http://foo.com/bar?number=VGhpcyBpcyBhIHRlc3Q', // This is a test
    });

    const number = getNumberStartingValue();
    expect(number).toEqual([
      0x54, 0x68, 0x69, 0x73, 0x20, 0x69, 0x73, 0x20, 0x61, 0x20, 0x74, 0x65,
      0x73, 0x74,
    ]); // This is a test
  });

  test('should throw error when provided with something other than Base64', () => {
    vi.stubGlobal('location', {
      href: 'http://foo.com/bar?number=%C3%A1lav%C3%ADe',
    });

    expect(() => {
      const number = getNumberStartingValue();
    }).toThrowError();
  });

  test('should provide default if no query param is present', () => {
    const number = getNumberStartingValue();
    const converted = number.map((char) => String.fromCharCode(char)).join('');

    expect(converted).toEqual(NUMBER_DEFAULT);
  });
});
