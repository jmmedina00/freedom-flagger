import { describe, expect, test } from 'vitest';
import BorderDecorate from './BorderDecorate.vue';
import { render } from '@testing-library/vue';
import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
import { ref } from 'vue';
import { getViewboxForSizing } from './viewbox';

vi.mock('./viewbox');

describe('BorderDecorate', () => {
  const generate = (size, config) =>
    render(BorderDecorate, {
      global: {
        provide: { [DECORATE_SIZE]: ref(size), [DECORATE_CONFIG]: ref(config) },
      },
    });

  const parameters = [
    ['left', 50, '#694051', '0,300.5 0,-0.5 50,49.5 50,250.5'],
    ['right', 37, '#e9b421', '500,-0.5 500,300.5 463,263.5 463,36.5'],
    ['top', 10, '#86f7a9', '-0.5,0 500.5,0 490.5,10 9.5,10'],
    ['bottom', 22, '#5eb872', '500.5,300 -0.5,300 21.5,278 478.5,278'],
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
      { size: 15, left: '#70a01b', bottom: '#013194' }
    );

    const polygons = [...container.querySelectorAll('svg polygon')];
    const pointSets = polygons.map((poly) => poly.getAttribute('points'));

    expect(pointSets.sort()).toEqual(
      [
        '0,400.5 0,-0.5 15,14.5 15,385.5',
        '200.5,400 -0.5,400 14.5,385 185.5,385',
      ].sort()
    );
  });

  test('should draw borders on several sides with different colors but same size II', () => {
    const { container } = generate(
      { width: 1280, height: 720 },
      { size: 100, right: '#70a01b', top: '#013194', bottom: '#84da8a' }
    );

    const polygons = [...container.querySelectorAll('svg polygon')];
    const pointSets = polygons.map((poly) => poly.getAttribute('points'));

    expect(pointSets.sort()).toEqual(
      [
        '1280,-0.5 1280,720.5 1180,620.5 1180,99.5',
        '-0.5,0 1280.5,0 1180.5,100 99.5,100',
        '1280.5,720 -0.5,720 99.5,620 1180.5,620',
      ].sort()
    );
  });
});
