import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import { useFullStateSize } from '@app/components/render/helper/size';
import { ref } from 'vue';
import RhombusShape from './RhombusShape.vue';

vi.mock('@app/components/render/helper/size');

describe('RhombusShape', () => {
  test('should create a diamond shape that is oriented vertically if the flag is horizontal', () => {
    useFullStateSize.mockReturnValue(ref({ width: 300, height: 200 }));

    const { container } = render(RhombusShape, {
      props: {
        x: 200,
        y: 145,
        size: 80,
      },
    });

    const diamond = container.querySelector('polygon');
    const expected = '200,-15 280,145 200,305 120,145';

    expect(diamond.getAttribute('points')).toEqual(expected);
  });

  test('should create a diamond shape that is oriented horizontally if the flag is vertical', () => {
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));

    const { container } = render(RhombusShape, {
      props: {
        x: 150,
        y: 222,
        size: 24,
      },
    });

    const diamond = container.querySelector('polygon');
    const expected = '150,198 198,222 150,246 102,222';

    expect(diamond.getAttribute('points')).toEqual(expected);
  });

  test('should create a diamond shape that is oriented vertically if the flag is square', () => {
    useFullStateSize.mockReturnValue(ref({ width: 300, height: 300 }));

    const { container } = render(RhombusShape, {
      props: {
        x: 55,
        y: 270,
        size: 59,
      },
    });

    const diamond = container.querySelector('polygon');
    const expected = '55,152 114,270 55,388 -4,270';

    expect(diamond.getAttribute('points')).toEqual(expected);
  });
});
