import { render } from '@testing-library/vue';
import { ref } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import FlagPortion from './FlagPortion.vue';
import { usePortionSizeAndPosition } from '../helper/portion';
import { useDirectionHolds } from '../helper/direction';

vi.mock('../helper/portion');
vi.mock('../helper/direction');

describe('FlagPortion', () => {
  const generate = (props) =>
    render(FlagPortion, {
      props,
      global: {
        stubs: {
          ColorStripe: {
            props: ['color', 'index', 'totalColors', 'direction'],
            template:
              '<rect>{{color}} - {{index}} - {{totalColors}} - {{direction}}</rect>',
          },
        },
      },
    });

  test('should display colors inside a brand new SVG element', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('12%'),
      position: ref('34%'),
    });
    useDirectionHolds.mockReturnValue({
      sizeHold: ref('size'),
      positionHold: ref('position'),
      stretchHold: ref('stretch'),
    });

    const { container } = generate({
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#800080'],
      index: 2,
      total: 4,
      direction: 'horizontal',
    });

    const colors = [...container.querySelectorAll('svg rect')].map(
      (el) => el.innerHTML
    );

    expect(colors).toEqual([
      '#FF0000 - 0 - 5 - horizontal',
      '#00FF00 - 1 - 5 - horizontal',
      '#0000FF - 2 - 5 - horizontal',
      '#FFFF00 - 3 - 5 - horizontal',
      '#800080 - 4 - 5 - horizontal',
    ]);
  });

  test('should place size and direction according to direction holds', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('12%'),
      position: ref('34%'),
    });
    useDirectionHolds.mockReturnValue({
      sizeHold: ref('size'),
      positionHold: ref('position'),
      stretchHold: ref('stretch'),
    });

    const { container } = generate({
      colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#800080'],
      index: 2,
      total: 4,
      direction: 'horizontal',
    });

    const wrapper = container.querySelector('svg');
    expect(wrapper.getAttribute('position')).toEqual('34%');
    expect(wrapper.getAttribute('size')).toEqual('12%');
    expect(wrapper.getAttribute('stretch')).toEqual('100%');

    expect(usePortionSizeAndPosition.mock.lastCall[0].value).toEqual({
      index: 2,
      total: 4,
    });
    expect(useDirectionHolds.mock.lastCall[0].value).toEqual('horizontal');
  });
});
