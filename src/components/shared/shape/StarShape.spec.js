import { describe, test } from 'vitest';
import { getOriginPointsForPolygon } from './polygon';
import { render } from '@testing-library/vue';
import StarShape from './StarShape.vue';

vi.mock('./polygon');

describe('StarShape', () => {
  test('should draw fetched from 5-sided polygon, sides defined by every second point', () => {
    getOriginPointsForPolygon.mockReturnValue([
      [12, 34],
      [34, 56],
      [56, 67],
      [67, 78],
      [78, 89],
    ]);

    const { container } = render(StarShape, {
      props: {
        x: 45,
        y: 112,
        size: 40,
      },
    });

    const polygon = container.querySelector('polygon');

    expect(polygon.getAttribute('points')).toEqual(
      `57,146 101,179 123,201 79,168 112,190`
    );
    expect(getOriginPointsForPolygon).toHaveBeenCalledWith(5, 40);
  });
});
