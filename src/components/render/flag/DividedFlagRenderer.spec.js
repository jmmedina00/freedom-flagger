import { render } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { useDirectionHolds } from '../helper/direction';
import { ref } from 'vue';
import { RENDER_BASICS, RENDER_PARAMS } from '@app/state';
import DividedFlagRenderer from './DividedFlagRenderer.vue';

vi.mock('../helper/direction');

describe('DividedFlagRenderer', () => {
  const checkedAttributes = ['size', 'position', 'stretch'];

  const generate = (provide) =>
    render(DividedFlagRenderer, {
      global: {
        provide,
        stubs: {
          FlagPortion: {
            props: ['colors', 'index', 'total', 'direction'],
            template:
              '<rect>{{ colors.toString() }} - {{ index }} - {{ total }} - {{ direction }}</rect>',
          },
        },
      },
    });

  beforeEach(() => {
    useDirectionHolds.mockReturnValue({
      sizeHold: ref('size'),
      positionHold: ref('position'),
      stretchHold: ref('stretch'),
    });
  });

  afterEach(() => {
    useDirectionHolds.mockReset();
  });

  test.each([
    ['vertical', 'horizontal'],
    ['horizontal', 'vertical'],
  ])(
    'should draw complete rows in %s direction, and incomplete one in %s direction',
    (direction, opposite) => {
      const portions = [
        ['abc', 'cde', 'efg'],
        ['qwe', 'asd', 'tre'],
        ['poi', 'lkj', 'mnb'],
        ['wut', 'is'],
      ];

      const provide = {
        [RENDER_BASICS]: { portions: ref(portions), direction: ref(direction) },
        [RENDER_PARAMS]: ref({ mainFlagPercent: 50 }),
      };
      const { container } = generate(provide);

      const divides = [...container.querySelectorAll('svg')];
      expect(divides.length).toEqual(2);

      const expected = [
        [
          `abc,cde,efg - 0 - 3 - ${direction}`,
          `qwe,asd,tre - 1 - 3 - ${direction}`,
          `poi,lkj,mnb - 2 - 3 - ${direction}`,
        ],
        [`wut,is - 0 - 1 - ${opposite}`],
      ];
      const actual = divides.map((svg) =>
        [...svg.querySelectorAll('rect')].map((rect) => rect.innerHTML)
      );

      expect(actual).toEqual(expected);
    }
  );

  test.each([
    [34, 66],
    [50, 50],
    [80, 20],
    [11, 89],
    [69, 31],
  ])(
    'should divide portions depending on main flag percent (%i)',
    (percent, other) => {
      const portions = [
        ['abc', 'cde', 'efg'],
        ['qwe', 'asd', 'tre'],
        ['wut', 'is'],
      ];

      const provide = {
        [RENDER_BASICS]: {
          portions: ref(portions),
          direction: ref('vertical'),
        },
        [RENDER_PARAMS]: ref({ mainFlagPercent: percent }),
      };
      const { container } = generate(provide);
      const divides = [...container.querySelectorAll('svg')];

      const expected = [
        {
          size: percent + '%',
          position: '0%',
          stretch: '100%',
        },
        {
          size: other + '%',
          position: percent + '%',
          stretch: '100%',
        },
      ];

      const actual = divides.map((svg) =>
        Object.fromEntries(
          checkedAttributes.map((attr) => [attr, svg.getAttribute(attr)])
        )
      );

      expect(actual).toEqual(expected);
      expect(useDirectionHolds.mock.lastCall[0].value).toEqual('vertical');
    }
  );

  test('should draw full flag as normal if all portions are equal', () => {
    const portions = [
      ['abc', 'cde', 'efg'],
      ['qwe', 'asd', 'tre'],
      ['wut', 'is', 'this'],
    ];

    const provide = {
      [RENDER_BASICS]: {
        portions: ref(portions),
        direction: ref('horizontal'),
      },
      [RENDER_PARAMS]: ref({ mainFlagPercent: 30 }),
    };
    const { container } = generate(provide);

    const divides = [...container.querySelectorAll('svg')];
    const expectedAttrs = [
      {
        size: '100%',
        position: '0%',
        stretch: '100%',
      },
    ];

    const actualAttrs = divides.map((svg) =>
      Object.fromEntries(
        checkedAttributes.map((attr) => [attr, svg.getAttribute(attr)])
      )
    );
    expect(actualAttrs).toEqual(expectedAttrs);
    expect(useDirectionHolds.mock.lastCall[0].value).toEqual('horizontal');

    const expectedFlagPortions = [
      [
        `abc,cde,efg - 0 - 3 - horizontal`,
        `qwe,asd,tre - 1 - 3 - horizontal`,
        `wut,is,this - 2 - 3 - horizontal`,
      ],
    ];

    const actualFlagPortions = divides.map((svg) =>
      [...svg.querySelectorAll('rect')].map((rect) => rect.innerHTML)
    );
    expect(actualFlagPortions).toEqual(expectedFlagPortions);
  });

  test('should draw full flag as normal if there is only one portion', () => {
    const portions = [['abd', 'cde', 'efg', 'qwe', 'asd', 'tre']];

    const provide = {
      [RENDER_BASICS]: {
        portions: ref(portions),
        direction: ref('vertical'),
      },
      [RENDER_PARAMS]: ref({ mainFlagPercent: 60 }),
    };
    const { container } = generate(provide);

    const divides = [...container.querySelectorAll('svg')];
    const expectedFlagPortions = [
      [`abd,cde,efg,qwe,asd,tre - 0 - 1 - vertical`],
    ];

    const actualFlagPortions = divides.map((svg) =>
      [...svg.querySelectorAll('rect')].map((rect) => rect.innerHTML)
    );
    expect(actualFlagPortions).toEqual(expectedFlagPortions);
  });
});
