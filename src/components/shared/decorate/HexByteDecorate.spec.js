import { describe, expect, vi } from 'vitest';
import HexByteDecorate from './HexByteDecorate.vue';
import { render } from '@testing-library/vue';
import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
import { ref } from 'vue';
import { getViewboxForSizing } from './viewbox';

vi.mock('./viewbox');

describe('HexByteDecorate', () => {
  const generate = (size, config) =>
    render(HexByteDecorate, {
      global: {
        provide: { [DECORATE_SIZE]: ref(size), [DECORATE_CONFIG]: ref(config) },
      },
    });

  const testParameters = [
    [
      [0x45, 0xfa, 0x3f],
      20,
      { width: 200, height: 300 },
      {
        x: '180',
        y: '280',
        text: '+ 45 FA 3F',
      },
    ],
    [
      [123],
      45,
      { width: 640, height: 480 },
      {
        x: '595',
        y: '435',
        text: '+ 7B',
      },
    ],
    [
      [0xa2, 28],
      10,
      { width: 500, height: 500 },
      {
        x: '490',
        y: '490',
        text: '+ A2 1C',
      },
    ],
    [
      [0x99, 0xaf],
      150,
      { width: 300, height: 1000 },
      {
        x: '150',
        y: '850',
        text: '+ 99 AF',
      },
    ],
    [
      [0x0a, 0xaf],
      150,
      { width: 300, height: 1000 },
      {
        x: '150',
        y: '850',
        text: '+ 0A AF',
      },
    ],
    [
      [],
      150,
      { width: 300, height: 1000 },
      {
        x: '150',
        y: '850',
        text: '',
      },
    ],
  ];

  test('should be an SVG with a viewbox of size provided', () => {
    getViewboxForSizing.mockReturnValue({ foo: 'bar', bar: 'baz' });
    const { container } = generate({ width: 250, height: 300 });

    const svg = container.querySelector('svg');
    expect(svg.getAttribute('foo')).toEqual('bar');
    expect(svg.getAttribute('bar')).toEqual('baz');
    expect(getViewboxForSizing).toHaveBeenCalledWith({
      width: 250,
      height: 300,
    });
  });

  test.each(testParameters)(
    'should display + and provided bytes %s in HEXADECIMAL around margin %d',
    (bytes, margin, sizing, expected) => {
      const { container } = generate(sizing, { bytes, margin });

      const text = container.querySelector('svg text');

      const actual = {
        x: text.getAttribute('x'),
        y: text.getAttribute('y'),
        text: text.innerText,
      };

      expect(actual).toEqual(expected);
    }
  );
});
