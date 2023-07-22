import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import ColorStripe from './ColorStripe.vue';
import { usePortionSizeAndPosition } from './helper/portion';
import { ref } from 'vue';

vi.mock('./helper/portion');

describe('ColorStripe', () => {
  test('should draw a rect with the defined color', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('0'),
      position: ref('0'),
    });

    const { container } = render(ColorStripe, { props: { color: '#fa357f' } });

    const rect = container.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect.getAttribute('fill')).toEqual('#fa357f');
  });

  test('should place size and position correctly for vertical direction', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('12%'),
      position: ref('24%'),
    });

    const { container } = render(ColorStripe, {
      props: { index: 3, totalColors: 6, direction: 'vertical' },
    });

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('x')).toEqual('24%');
    expect(rect.getAttribute('y')).toBeFalsy();
    expect(rect.getAttribute('width')).toEqual('12%');
    expect(rect.getAttribute('height')).toEqual('100%');

    expect(usePortionSizeAndPosition.mock.lastCall[0].value).toEqual({
      index: 3,
      total: 6,
    });
  });

  test('should place size and position correctly for horizontal direction', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('24%'),
      position: ref('36%'),
    });

    const { container } = render(ColorStripe, {
      props: { index: 2, totalColors: 5, direction: 'horizontal' },
    });

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('y')).toEqual('36%');
    expect(rect.getAttribute('x')).toBeFalsy();
    expect(rect.getAttribute('height')).toEqual('24%');
    expect(rect.getAttribute('width')).toEqual('100%');

    expect(usePortionSizeAndPosition.mock.lastCall[0].value).toEqual({
      index: 2,
      total: 5,
    });
  });

  test('should fallback to vertical direction if invalid direction provided', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('24%'),
      position: ref('58%'),
    });

    const { container } = render(ColorStripe, {
      props: { index: 0, totalColors: 12, direction: 'foo' },
    });

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('x')).toEqual('58%');
    expect(rect.getAttribute('y')).toBeFalsy();
    expect(rect.getAttribute('width')).toEqual('24%');
    expect(rect.getAttribute('height')).toEqual('100%');
  });
});
