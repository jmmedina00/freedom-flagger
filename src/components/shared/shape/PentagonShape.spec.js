import { describe, expect, test, vi } from 'vitest';
import { getOriginPointsForPolygon } from './polygon';
import { render } from '@testing-library/vue';
import PentagonShape from './PentagonShape.vue';

vi.mock('./polygon');

describe('PentagonShape', () => {
  test('should draw fetched points from 5-sided polygon sequentially', () => {
    getOriginPointsForPolygon.mockReturnValue([
      [12, 34],
      [34, 56],
      [56, 67],
      [67, 78],
      [78, 89],
    ]);

    const { container } = render(PentagonShape, {
      props: {
        x: 45,
        y: 112,
        size: 40,
      },
    });

    const polygon = container.querySelector('polygon');

    expect(polygon.getAttribute('points')).toEqual(
      `57,146 79,168 101,179 112,190 123,201`
    );
    expect(getOriginPointsForPolygon).toHaveBeenCalledWith(5, 40);
  });
});
