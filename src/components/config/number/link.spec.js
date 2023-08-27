import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { useLinkToCurrentNumber } from './link';
import { getNumberAsBase64 } from '@app/util/number';

vi.mock('@app/util/number');

describe('Number link composable', () => {
  beforeEach(() => {
    getNumberAsBase64.mockReturnValue('base64');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('should provide current simple link with number up to date with current', async () => {
    const numbers = ref([27, 43, 16, 92, 59, 58, 25, 53, 53, 70]);
    const link = 'https://test.net';

    vi.stubGlobal('location', { href: link });
    const actual = useLinkToCurrentNumber(numbers);
    const expected = 'https://test.net/?number=base64';

    expect(actual.value).toEqual(expected);
    expect(getNumberAsBase64).toHaveBeenCalledWith([
      27, 43, 16, 92, 59, 58, 25, 53, 53, 70,
    ]);
  });

  test('should provide current complex link with number up to date with current', () => {
    const numbers = ref([41, 116, 178, 162, 159, 32, 31, 247, 81, 38]);
    const link = 'http://foo.com/bar/baz';

    vi.stubGlobal('location', { href: link });
    const actual = useLinkToCurrentNumber(numbers);
    const expected = 'http://foo.com/bar/baz?number=base64';

    expect(actual.value).toEqual(expected);
  });

  test('should remove previously existing query params', () => {
    const numbers = ref([41, 116, 178, 162, 159, 32, 31, 247, 81, 38]);
    const link = 'http://foo.com/bar?lang=fr&foo=bar';

    vi.stubGlobal('location', { href: link });
    const actual = useLinkToCurrentNumber(numbers);
    const expected = 'http://foo.com/bar?number=base64';

    expect(actual.value).toEqual(expected);
  });

  test('should remove language code from URL', () => {
    const numbers = ref([96, 207, 30, 196, 27, 2, 254, 20, 119, 207]);
    const link = 'http://foo.com/en/re';

    vi.stubGlobal('location', { href: link });
    const actual = useLinkToCurrentNumber(numbers);
    const expected = 'http://foo.com/re?number=base64';

    expect(actual.value).toEqual(expected);
  });
});
