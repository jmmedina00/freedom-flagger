import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import SquareShape from './SquareShape.vue';

describe('SquareShape', () => {
  test('should create a square of side "size" times 2, starting position offset from "center"', () => {
    const { container } = render(SquareShape, {
      props: {
        x: 100,
        y: 75,
        size: 60,
      },
    });

    const square = container.querySelector('rect');

    expect(square.getAttribute('x')).toEqual('40');
    expect(square.getAttribute('y')).toEqual('15');
    expect(square.getAttribute('width')).toEqual('120');
    expect(square.getAttribute('height')).toEqual('120');
  });
});
