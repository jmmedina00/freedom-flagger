import { describe } from 'vitest';
import CornerTriangleDecorate from './CornerTriangleDecorate.vue';
import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
import { ref } from 'vue';
import { render } from '@testing-library/vue';

describe('CornerTriangleDecorate', () => {
  const generate = (size, config) =>
    render(CornerTriangleDecorate, {
      global: {
        provide: { [DECORATE_SIZE]: ref(size), [DECORATE_CONFIG]: ref(config) },
      },
    });

  const parameters = [
    ['topLeft', 46, '#694051', '0,0 46,0 0,46'],
    ['topRight', 65, '#e9b421', '500,0 435,0 500,65'],
    ['bottomRight', 28, '#86f7a9', '500,300 472,300 500,272'],
    ['bottomLeft', 9, '#5eb872', '0,300 9,300 0,291'],
  ];

  test('should be an SVG of the size provided', () => {
    const { container } = generate({ width: 250, height: 300 });

    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toEqual('250');
    expect(svg.getAttribute('height')).toEqual('300');
  });

  test.each(parameters)(
    'should draw a border on the %s side with size %i and color %s',
    (side, size, color, expected) => {
      const { container } = generate(
        { width: 500, height: 300 },
        { size, [side]: color }
      );

      const polygon = container.querySelector('svg polygon');
      expect(polygon.getAttribute('fill')).toEqual(color);
      expect(polygon.getAttribute('points')).toEqual(expected);
    }
  );

  test('should draw borders on several sides with different colors but same size', () => {
    const { container } = generate(
      { width: 200, height: 400 },
      { size: 15, topLeft: '#70a01b', bottomRight: '#013194' }
    );

    const polygons = [...container.querySelectorAll('svg polygon')];
    const pointSets = polygons.map((poly) => poly.getAttribute('points'));

    expect(pointSets.sort()).toEqual(
      ['0,0 15,0 0,15', '200,400 185,400 200,385'].sort()
    );
  });

  test('should draw borders on several sides with different colors but same size II', () => {
    const { container } = generate(
      { width: 1280, height: 720 },
      {
        size: 100,
        topRight: '#013194',
        bottomRight: '#70a01b',
        bottomLeft: '#84da8a',
      }
    );

    const polygons = [...container.querySelectorAll('svg polygon')];
    const pointSets = polygons.map((poly) => poly.getAttribute('points'));

    expect(pointSets.sort()).toEqual(
      [
        '1280,0 1180,0 1280,100',
        '1280,720 1180,720 1280,620',
        '0,720 100,720 0,620',
      ].sort()
    );
  });
});
