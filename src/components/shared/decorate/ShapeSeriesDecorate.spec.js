import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import ShapeSeriesDecorate from './ShapeSeriesDecorate.vue';
import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
import { ref } from 'vue';

describe('ShapeSeriesDecorate', () => {
  const generate = (size, config) =>
    render(ShapeSeriesDecorate, {
      global: {
        provide: {
          [DECORATE_SIZE]: ref(size),
          [DECORATE_CONFIG]: ref({ ...config, component: 'MyShape' }),
        },
        stubs: {
          MyShape: {
            props: ['size', 'x', 'y'],
            template: '<p>{{ size }} - {{ x }}, {{ y }}</p>',
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

  test('should be an SVG of the size provided', () => {
    const { container } = generate({ width: 250, height: 300 });

    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toEqual('250');
    expect(svg.getAttribute('height')).toEqual('300');
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
});
