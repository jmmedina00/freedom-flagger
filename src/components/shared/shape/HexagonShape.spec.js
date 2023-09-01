import { describe, test, vi } from 'vitest';
import { getOriginPointsForPolygon } from './polygon';
import { render } from '@testing-library/vue';
import HexagonShape from './HexagonShape.vue';

vi.mock('./polygon');

describe('HexagonShape', () => {
  test('should draw fetched points from 6-sided polygon sequentially', () => {
    getOriginPointsForPolygon.mockReturnValue([
      [12, 34],
      [34, 45],
      [45, 56],
      [56, 67],
      [67, 78],
      [78, 89],
    ]);

    const { container } = render(HexagonShape, {
      props: {
        x: 212,
        y: 6,
        size: 61,
      },
    });

    const polygon = container.querySelector('polygon');

    expect(polygon.getAttribute('points')).toEqual(
      `224,40 246,51 257,62 268,73 279,84 290,95`
    );
    expect(getOriginPointsForPolygon).toHaveBeenCalledWith(6, 61, 90);
  });
});
