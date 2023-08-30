import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import MosaicDecorate from './MosaicDecorate.vue';
import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
import { ref } from 'vue';
import { getViewboxForSizing } from './viewbox';

vi.mock('./viewbox');

const attributes = ['width', 'height', 'x', 'y', 'fill'];

describe('MosaicDecorate', () => {
  const generate = (size, config) =>
    render(MosaicDecorate, {
      global: {
        provide: { [DECORATE_SIZE]: ref(size), [DECORATE_CONFIG]: ref(config) },
      },
    });

  const getAttributes = (rect) => {
    const entries = attributes.map((attr) => [attr, rect.getAttribute(attr)]);
    return Object.fromEntries(entries);
  };

  const getPattern = (
    coords,
    amount = 20,
    size = 2,
    colors = [],
    data = { offset: 0, excess: true }
  ) =>
    new Array(amount).fill('0').map((_, index) => {
      const [row, column] = coords.y
        ? ['width', 'height']
        : ['height', 'width'];

      return {
        fill: colors[(index + data.offset) % colors.length],
        [row]: `${size + (index < amount - 1)}`,
        [column]: `${size + !!data.excess}`,
        x: `${size * index}`,
        y: `${size * index}`,
        ...coords,
      };
    });

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

  test('should render x squares of size y across width z (z / x = y) at start and end of height with colors', () => {
    const { container } = generate(
      { width: 300, height: 200 },
      {
        colors: ['#ff0000', '#00ff00', '#0000ff'],
        squareRows: 10,
        rows: 1,
        offset: 0,
      }
    );

    const rects = [...container.querySelectorAll('svg rect')];
    const actual = rects.map(getAttributes);

    const expected = [
      ...getPattern({ y: '0' }, 10, 30, ['#ff0000', '#00ff00', '#0000ff'], {
        excess: false,
        offset: 0,
      }),
      ...getPattern({ y: '170' }, 10, 30, ['#ff0000', '#00ff00', '#0000ff'], {
        excess: false,
        offset: 0,
      }),
    ];

    expect(actual).toEqual(expected);
  });

  test('should render x squares of size y across height z (z / x = y) at start and end of width with colors', () => {
    const { container } = generate(
      { width: 200, height: 300 },
      {
        colors: ['#ffff00', '#800080'],
        squareRows: 16,
        rows: 1,
        offset: 0,
      }
    );

    const rects = [...container.querySelectorAll('svg rect')];
    const actual = rects.map(getAttributes);

    const expected = [
      ...getPattern({ x: '0' }, 16, 18.75, ['#ffff00', '#800080'], {
        excess: false,
        offset: 0,
      }),
      ...getPattern({ x: '181.25' }, 16, 18.75, ['#ffff00', '#800080'], {
        excess: false,
        offset: 0,
      }),
    ];

    expect(actual).toEqual(expected);
  });

  test('should render the squares across width when width and height are equal', () => {
    const { container } = generate(
      { width: 400, height: 400 },
      {
        colors: ['#ffa500', '#00ffff', '#ffc0cb', '#008080'],
        squareRows: 20,
        rows: 1,
        offset: 0,
      }
    );

    const rects = [...container.querySelectorAll('svg rect')];
    const actual = rects.map(getAttributes);

    const expected = [
      ...getPattern(
        { y: '0' },
        20,
        20,
        ['#ffa500', '#00ffff', '#ffc0cb', '#008080'],
        {
          excess: false,
          offset: 0,
        }
      ),
      ...getPattern(
        { y: '380' },
        20,
        20,
        ['#ffa500', '#00ffff', '#ffc0cb', '#008080'],
        {
          excess: false,
          offset: 0,
        }
      ),
    ];

    expect(actual).toEqual(expected);
  });

  test('should render x rows of squares per side with an y offset for the colors', () => {
    const { container } = generate(
      { width: 500, height: 400 },
      {
        colors: ['#ffff00', '#800080'],
        squareRows: 5,
        rows: 3,
        offset: 2,
      }
    );

    const rects = [...container.querySelectorAll('svg rect')];
    const actual = rects.map(getAttributes);

    const expected = [
      ...getPattern({ y: '0' }, 5, 100, ['#ffff00', '#800080']),
      ...getPattern({ y: '100' }, 5, 100, ['#ffff00', '#800080'], {
        offset: 2,
        excess: true,
      }),
      ...getPattern({ y: '200' }, 5, 100, ['#ffff00', '#800080'], {
        offset: 4,
        excess: false,
      }),

      ...getPattern({ y: '100' }, 5, 100, ['#ffff00', '#800080']),
      ...getPattern({ y: '200' }, 5, 100, ['#ffff00', '#800080'], {
        offset: 2,
        excess: true,
      }),
      ...getPattern({ y: '300' }, 5, 100, ['#ffff00', '#800080'], {
        offset: 4,
        excess: false,
      }),
    ];

    expect(actual).toEqual(expected);
  });

  test('should default to 25 squares per row, 2 rows and offset of 1', () => {
    const { container } = generate(
      { width: 200, height: 300 },
      {
        colors: ['#ffff00', '#800080'],
      }
    );

    const rects = [...container.querySelectorAll('svg rect')];
    const actual = rects.map(getAttributes);

    const expected = [
      ...getPattern({ x: '0' }, 25, 12, ['#ffff00', '#800080']),
      ...getPattern({ x: '12' }, 25, 12, ['#ffff00', '#800080'], {
        offset: 1,
        excess: false,
      }),

      ...getPattern({ x: '176' }, 25, 12, ['#ffff00', '#800080']),
      ...getPattern({ x: '188' }, 25, 12, ['#ffff00', '#800080'], {
        offset: 1,
        excess: false,
      }),
    ];

    expect(actual).toEqual(expected);
  });
});
