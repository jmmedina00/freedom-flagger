import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import ColorStripe from './ColorStripe.vue';
import { usePortionSizeAndPosition } from '../helper/portion';
import { useDirectionHolds } from '../helper/direction';

vi.mock('../helper/portion');
vi.mock('../helper/direction');

describe('ColorStripe', () => {
  test('should draw a rect with the defined color', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('0'),
      position: ref('0'),
    });
    useDirectionHolds.mockReturnValue({
      positionHold: ref('position'),
      sizeHold: ref('size'),
      stretchHold: ref('stretch'),
    });

    const { container } = render(ColorStripe, { props: { color: '#fa357f' } });

    const rect = container.querySelector('rect');
    expect(rect).toBeTruthy();
    expect(rect.getAttribute('fill')).toEqual('#fa357f');
  });

  test('should place size and position according to direction holds', () => {
    usePortionSizeAndPosition.mockReturnValue({
      size: ref('12%'),
      position: ref('24%'),
    });
    useDirectionHolds.mockReturnValue({
      positionHold: ref('position'),
      sizeHold: ref('size'),
      stretchHold: ref('stretch'),
    });

    const { container } = render(ColorStripe, {
      props: { index: 3, totalColors: 6, direction: 'vertical' },
    });

    const rect = container.querySelector('rect');
    expect(rect.getAttribute('position')).toEqual('24%');
    expect(rect.getAttribute('size')).toEqual('12%');
    expect(rect.getAttribute('stretch')).toEqual('100%');

    expect(usePortionSizeAndPosition.mock.lastCall[0].value).toEqual({
      index: 3,
      total: 6,
    });
    expect(useDirectionHolds.mock.lastCall[0].value).toEqual('vertical');
  });
});
