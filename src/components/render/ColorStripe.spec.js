import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import ColorStripe from './ColorStripe.vue';

describe('ColorStripe', () => {
  test('should draw a rect with the defined color', () => {
    const { container } = render(ColorStripe, { props: { color: '#fa357f' } });

    const rect = container.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect.getAttribute('fill')).toEqual('#fa357f');
  });

  test('should figure out correct % position in vertical direction', () => {
    const { container } = render(ColorStripe, {
      props: { index: 2, totalColors: 5, direction: 'vertical' },
    });

    const expectedPosition = ((2 / 5) * 100).toString() + '%';

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('x')).toEqual(expectedPosition);
    expect(rect.getAttribute('y')).toBeFalsy();
  });

  test('should figure out correct % size in vertical direction', () => {
    const { container } = render(ColorStripe, {
      props: { index: 3, totalColors: 7, direction: 'vertical' },
    });

    const expectedSize = ((1 / 7) * 100).toString() + '%';

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('width')).toEqual(expectedSize);
    expect(rect.getAttribute('height')).toEqual('100%');
  });

  test('should figure out correct % position in horizontal direction', () => {
    const { container } = render(ColorStripe, {
      props: { index: 3, totalColors: 4, direction: 'horizontal' },
    });

    const expectedPosition = ((3 / 4) * 100).toString() + '%';

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('y')).toEqual(expectedPosition);
    expect(rect.getAttribute('x')).toBeFalsy();
  });

  test('should figure out correct % size in horizontal direction', () => {
    const { container } = render(ColorStripe, {
      props: { index: 2, totalColors: 12, direction: 'horizontal' },
    });

    const expectedSize = ((1 / 12) * 100).toString() + '%';

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('height')).toEqual(expectedSize);
    expect(rect.getAttribute('width')).toEqual('100%');
  });

  test('should consider 0 as the first index', () => {
    const { container } = render(ColorStripe, {
      props: { index: 0, totalColors: 12 }, // vertical by default
    });

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('x')).toEqual('0%');
  });

  test('should fallback to vertical direction if invalid direction provided', () => {
    const { container } = render(ColorStripe, {
      props: { index: 0, totalColors: 12, direction: 'foo' },
    });

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('x')).toEqual('0%');
    expect(rect.getAttribute('y')).toBeFalsy();
  });
});
