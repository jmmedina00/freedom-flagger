import { describe, expect, test } from 'vitest';
import { createApp } from 'vue';
import { getViewboxForSizing } from './viewbox';

describe('Viewbox generation', () => {
  const dimensions = [
    { width: 300, height: 200 },
    { width: 200, height: 800 },
    { width: 1280, height: 720 },
    { width: 500, height: 500 },
    { width: 480, height: 720 },
  ];

  test.each(dimensions)(
    'should generate attributes for SVG at max size based of decorate sizing %s',
    (sizing) => {
      const { width, height } = sizing;

      const expected = {
        width: '100%',
        height: '100%',
        viewBox: `0 0 ${width} ${height}`,
      };

      const actual = getViewboxForSizing(sizing);
      expect(actual).toEqual(expected);
    }
  );
});
