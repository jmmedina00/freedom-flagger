import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import CircleShape from './CircleShape.vue';

describe('CircleShape', () => {
  test('should create a circle with given center coordinates and radius size', () => {
    const { container } = render(CircleShape, {
      props: {
        x: 25,
        y: 50,
        size: 38,
      },
    });

    const circle = container.querySelector('circle');
    expect(circle.getAttribute('cx')).toEqual('25');
    expect(circle.getAttribute('cy')).toEqual('50');
    expect(circle.getAttribute('r')).toEqual('38');
  });
});
