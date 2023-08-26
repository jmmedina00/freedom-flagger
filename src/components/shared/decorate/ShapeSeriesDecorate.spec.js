import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import ShapeSeriesDecorate from './ShapeSeriesDecorate.vue';
import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
import { ref } from 'vue';
import { getViewboxForSizing } from './viewbox';
import { SHAPE_CIRCLE } from '../constant/rendering';

vi.mock('./viewbox');

describe('ShapeSeriesDecorate', () => {
  const generate = (size, config, shape = 'MyShape') =>
    render(ShapeSeriesDecorate, {
      global: {
        provide: {
          [DECORATE_SIZE]: ref(size),
          [DECORATE_CONFIG]: ref({ ...config, component: shape }),
        },
        stubs: {
          MyShape: {
            props: ['size', 'x', 'y'],
            template: '<p>{{ size }} - {{ x }}, {{ y }}</p>',
          },
          CircleShape: {
            props: ['size', 'x', 'y'],
            template: '<p>{{ x }}, {{ y }} - {{ size }}</p>',
          },
        },
      },
    });

  const parameters = [
    [
      46,
      300,
      200,
      ['#24354f', '#7bbeb0', '#8065e8'],
      ['46 - 75, 100', '46 - 150, 100', '46 - 225, 100'], // Across X when width is higher
    ],
    [
      25,
      200,
      300,
      ['#1ec100', '#698860', '#9fdefa', '#8f3601', '#3b034a'],
      [
        '25 - 100, 50',
        '25 - 100, 100',
        '25 - 100, 150',
        '25 - 100, 200',
        '25 - 100, 250',
      ], // Across Y when height is higher
    ],
    [75, 640, 480, ['#7646a3'], ['75 - 320, 240']],
    [
      100,
      1000,
      1500,
      ['#E95014', '#614fae'],
      ['100 - 500, 500', '100 - 500, 1000'],
    ],
    [
      15,
      500,
      500,
      ['#2C05DE', '#7D49C9', '#0C00FF', '#502A48'],
      ['15 - 100, 250', '15 - 200, 250', '15 - 300, 250', '15 - 400, 250'],
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

  test.each(parameters)(
    'should create shape components of size %s in a %i by %i SVG',
    (shapeSize, width, height, colors, expectedText = []) => {
      const expected = expectedText.map((text, index) => ({
        text,
        fill: colors[index],
      }));

      const { container } = generate(
        { width, height },
        { colors, size: shapeSize }
      );

      const paragraphs = [...container.querySelectorAll('svg p')];
      const actual = paragraphs.map((p) => ({
        fill: p.getAttribute('fill'),
        text: p.innerText,
      }));

      expect(actual).toEqual(expected);
    }
  );

  test('should render a well-know shape, given its key', () => {
    const test = [
      15,
      500,
      500,
      ['#2C05DE', '#7D49C9', '#0C00FF', '#502A48'],
      ['15 - 100, 250', '15 - 200, 250', '15 - 300, 250', '15 - 400, 250'],
    ];

    const { container } = generate(
      { width: 500, height: 500 },
      { colors: ['#2C05DE', '#7D49C9', '#0C00FF', '#502A48'], size: 15 },
      SHAPE_CIRCLE
    );

    const paragraphs = [...container.querySelectorAll('svg p')];
    const texts = paragraphs.map((p) => p.innerText);

    expect(texts).toEqual([
      '100, 250 - 15',
      '200, 250 - 15',
      '300, 250 - 15',
      '400, 250 - 15',
    ]);
  });
});
