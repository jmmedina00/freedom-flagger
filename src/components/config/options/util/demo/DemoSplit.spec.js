import { render } from '@testing-library/vue';
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { ref } from 'vue';
import { useFullStateSize } from '@app/components/render/helper/size';
import { useDirectionHolds } from '@app/components/render/helper/direction';
import { useAppropriateDemoSize } from './size';
import DemoSplit from './DemoSplit.vue';

vi.mock('@app/components/render/helper/size');
vi.mock('@app/components/render/helper/direction');
vi.mock('./size');

describe('DemoSplit', () => {
  beforeEach(() => {
    useFullStateSize.mockReturnValue(ref({ width: 640, height: 480 }));
    useDirectionHolds.mockReturnValue({
      positionHold: ref('position'),
      sizeHold: ref('size'),
      stretchHold: ref('stretch'),
    });
  });

  afterEach(() => {
    useDirectionHolds.mockReset();
  });

  test('should wrap everything in an SVG with scaled size', () => {
    useAppropriateDemoSize.mockReturnValue(ref({ width: 300, height: 200 }));

    const { container } = render(DemoSplit, {
      props: { percent: 30 },
    });

    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toEqual('300');
    expect(svg.getAttribute('height')).toEqual('200');
  });

  test.each([
    [42, 58],
    [60, 40],
    [22, 78],
    [33, 67],
    [87, 13],
  ])(
    'should create two rects that follow direction holds; given %i, then that and %i',
    (percent, secondExpected) => {
      useAppropriateDemoSize.mockReturnValue(ref({ width: 300, height: 200 }));

      const { container } = render(DemoSplit, {
        props: { percent },
      });

      const rects = [...container.querySelectorAll('svg rect')];
      const params = rects.map((rect) => ({
        position: rect.getAttribute('position'),
        size: rect.getAttribute('size'),
      }));

      const percentText = `${percent}%`;
      const secondPercentText = `${secondExpected}%`;

      expect(params).toEqual([
        { position: '0%', size: percentText },
        { position: percentText, size: secondPercentText },
      ]);

      expect(useAppropriateDemoSize.mock.calls[0][0].value).toEqual({
        width: 640,
        height: 480,
      });
    }
  );

  test.each([
    ['vertical', 640, 480],
    ['horizontal', 200, 300],
    ['vertical', 400, 400],
  ])(
    'should call %s direction holds for scaled size %i x %i',
    (direction, width, height) => {
      useAppropriateDemoSize.mockReturnValue(ref({ width, height }));

      const { container } = render(DemoSplit, {
        props: { percent: 30 },
      });

      expect(useDirectionHolds.mock.calls[0][0].value).toEqual(direction);
    }
  );
});
