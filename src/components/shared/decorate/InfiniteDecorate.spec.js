import { describe, expect, test } from 'vitest';
import InfiniteDecorateVue from './InfiniteDecorate.vue';
import { BOTTOM_LEFT, BOTTOM_RIGHT, TOP_LEFT, TOP_RIGHT } from './corner';
import { render } from '@testing-library/vue';
import { ref } from 'vue';
import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';

const attributes = ['width', 'height', 'x', 'y', 'fill'];

describe('InfiniteDecorate', () => {
  const generate = (size, config) =>
    render(InfiniteDecorateVue, {
      global: {
        provide: { [DECORATE_SIZE]: ref(size), [DECORATE_CONFIG]: ref(config) },
      },
    });

  const getAttributes = (rect) => {
    const entries = attributes.map((attr) => [attr, rect.getAttribute(attr)]);
    return Object.fromEntries(entries);
  };

  test('should be an SVG of the size provided', () => {
    const { container } = generate({ width: 250, height: 300 });

    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toEqual('250');
    expect(svg.getAttribute('height')).toEqual('300');
  });

  test('should generate rects with percent sizes and positions plus specified colors on the top-left', () => {
    const { container } = generate(
      { width: 250, height: 300 },
      { size: 10, colors: ['#cc6632', '#7ced08', '#d68f44'], corner: TOP_LEFT }
    );

    const rects = [...container.querySelectorAll('svg rect')];

    const expected = [
      {
        width: '30%',
        height: '30%',
        x: '0%',
        y: '0%',
        fill: '#cc6632',
      },
      {
        width: '20%',
        height: '20%',
        x: '0%',
        y: '0%',
        fill: '#7ced08',
      },
      {
        width: '10%',
        height: '10%',
        x: '0%',
        y: '0%',
        fill: '#d68f44',
      },
    ];

    expect(rects.map(getAttributes)).toEqual(expected);
  });

  test('should generate rects with percent sizes and positions plus specified colors on the top-right', () => {
    const { container } = generate(
      { width: 300, height: 400 },
      { size: 25, colors: ['#439e3d', '#2b6813'], corner: TOP_RIGHT }
    );

    const rects = [...container.querySelectorAll('svg rect')];

    const expected = [
      {
        width: '50%',
        height: '50%',
        x: '50%',
        y: '0%',
        fill: '#439e3d',
      },
      {
        width: '25%',
        height: '25%',
        x: '75%',
        y: '0%',
        fill: '#2b6813',
      },
    ];

    expect(rects.map(getAttributes)).toEqual(expected);
  });

  test('should generate rects with percent sizes and positions plus specified colors on the bottom-right', () => {
    const { container } = generate(
      { width: 300, height: 300 },
      {
        size: 5,
        colors: ['#996128', '#0cf344', '#c69c0a', '#b0fee8'],
        corner: BOTTOM_RIGHT,
      }
    );

    const rects = [...container.querySelectorAll('svg rect')];

    const expected = [
      {
        width: '20%',
        height: '20%',
        x: '80%',
        y: '80%',
        fill: '#996128',
      },
      {
        width: '15%',
        height: '15%',
        x: '85%',
        y: '85%',
        fill: '#0cf344',
      },
      {
        width: '10%',
        height: '10%',
        x: '90%',
        y: '90%',
        fill: '#c69c0a',
      },
      {
        width: '5%',
        height: '5%',
        x: '95%',
        y: '95%',
        fill: '#b0fee8',
      },
    ];

    expect(rects.map(getAttributes)).toEqual(expected);
  });

  test('should generate rects with percent sizes and positions plus specified colors on the bottom-left', () => {
    const { container } = generate(
      { width: 500, height: 300 },
      { size: 30, colors: ['#439e3d', '#2b6813'], corner: BOTTOM_LEFT }
    );

    const rects = [...container.querySelectorAll('svg rect')];

    const expected = [
      {
        width: '60%',
        height: '60%',
        x: '0%',
        y: '40%',
        fill: '#439e3d',
      },
      {
        width: '30%',
        height: '30%',
        x: '0%',
        y: '70%',
        fill: '#2b6813',
      },
    ];

    expect(rects.map(getAttributes)).toEqual(expected);
  });
});
