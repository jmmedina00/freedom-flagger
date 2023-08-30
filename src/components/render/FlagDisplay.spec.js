import { render } from '@testing-library/vue';
import { computed, inject, ref } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import FlagDisplay from './FlagDisplay.vue';
import { useNumberAsColors } from './helper/colors';
import { useFullStateSize } from './helper/size';
import { useSomeConfig } from '../config/options/plugin';
import {
  CONFIG_RENDERING,
  DECORATE_SIZE,
  RENDER_BASICS,
  RENDER_PARAMS,
} from '@app/state';
import {
  RENDERERS,
  RENDERER_DECORATE,
  RENDERER_DIVIDED,
  RENDERER_STANDARD,
} from '../shared/constant/rendering';
import { getViewboxForSizing } from '../shared/decorate/viewbox';

vi.mock('./helper/colors');
vi.mock('./helper/size');
vi.mock('../config/options/plugin');
vi.mock('../shared/decorate/viewbox');

describe('FlagDisplay', () => {
  const infiniteColors = [
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#800080',
    '#FFA500',
    '#008080',
    '#FFC0CB',
    '#00FFFF',
    '#FF6347',
    '#7CFC00',
    '#FF00FF',
    '#FF4500',
    '#32CD32',
    '#800000',
  ];
  const colorDivisionCases = [
    [
      12,
      5,
      RENDERER_STANDARD,
      { asd: '123', qwe: 'asd' },
      {
        portions: [
          ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#800080'],
          ['#FFA500', '#008080', '#FFC0CB', '#00FFFF', '#FF6347'],
          ['#7CFC00', '#FF00FF'],
        ],
        asd: '123',
        qwe: 'asd',
      },
    ],
    [
      9,
      3,
      RENDERER_DIVIDED,
      { done: true },
      {
        portions: [
          ['#FF0000', '#00FF00', '#0000FF'],
          ['#FFFF00', '#800080', '#FFA500'],
          ['#008080', '#FFC0CB', '#00FFFF'],
        ],
        done: true,
      },
    ],
    [
      3,
      5,
      RENDERER_DECORATE,
      { first: 123, second: 345, third: 'whatever' },
      {
        portions: [['#FF0000', '#00FF00', '#0000FF']],
        first: 123,
        second: 345,
        third: 'whatever',
      },
    ],
  ];

  const autoStubs = Object.fromEntries(
    Object.entries(RENDERERS).map(([key, component]) => [
      component.__name,
      {
        setup: (props) => {
          const { portions, direction } = inject(RENDER_BASICS, {
            portions: ref([]),
            direction: ref(''),
          });

          const renderParams = inject(RENDER_PARAMS, ref({}));
          const params = computed(() => ({
            portions: portions.value,
            ...renderParams.value,
          }));

          return {
            direction,
            params: computed(() => JSON.stringify(params.value)),
          };
        },
        template: `<p>Direction: {{ direction }}</p>
        <p>Params: {{ params }}</p>
        <p>Component: ${key}</p>`,
      },
    ])
  );

  const generate = () =>
    render(FlagDisplay, {
      global: {
        stubs: {
          RemainderHandler: {
            props: ['bytes'],
            setup: () => {
              const size = inject(DECORATE_SIZE);
              return { size };
            },
            template:
              '<p>Bytes: {{ bytes.join(", ") }}</p><p>Size: {{ size?.width }} x {{ size?.height }}</p>',
          },
          ...autoStubs,
        },
      },
    });

  test('should provide dimensions from state to both SVG and decorates', async () => {
    getViewboxForSizing.mockReturnValue({ viewBox: 'boxyboxed' });
    useNumberAsColors.mockReturnValue({
      colors: ref(['foo', 'bar', 'baz']),
      remainder: ref([1, 2, 3]),
    });
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
    useSomeConfig.mockReturnValue(
      ref({
        columnsLimited: true,
        columnsMax: 12,
        renderer: RENDERER_STANDARD,
        params: {},
      })
    );

    const { container, findByText } = generate();

    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toEqual('200');
    expect(svg.getAttribute('height')).toEqual('300');
    expect(svg.getAttribute('viewBox')).toEqual('boxyboxed');

    const sizeParagraph = await findByText('Size: ', { exact: false });
    expect(sizeParagraph.innerText).toEqual('Size: 200 x 300');

    expect(useSomeConfig).toHaveBeenCalledWith(
      CONFIG_RENDERING,
      expect.anything()
    );
  });

  describe('Color division', () => {
    test.each(colorDivisionCases)(
      'should divide %i colors by column limit of %i and provide them %s along with other params',
      async (
        numberColors,
        columnsMax,
        renderer,
        providedParams,
        expectedParams
      ) => {
        const colors = infiniteColors.slice(0, numberColors);
        const config = ref({
          columnsLimited: true,
          columnsMax,
          renderer,
          params: providedParams,
        });

        useNumberAsColors.mockReturnValue({
          colors: ref(colors),
          remainder: ref([]),
        });
        useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
        useSomeConfig.mockReturnValue(config);

        const { findByText } = generate();

        const rendererParagraph = await findByText('Component:', {
          exact: false,
        });
        expect(rendererParagraph.innerText).toEqual('Component: ' + renderer);

        const paramsParagraph = await findByText('Params:', { exact: false });
        expect(paramsParagraph.innerText).toEqual(
          'Params: ' + JSON.stringify(expectedParams)
        );
      }
    );

    test('should provide single row if column limiting is disabled', async () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#800080']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
      useSomeConfig.mockReturnValue(
        ref({
          columnsLimited: false,
          columnsMax: 3,
          renderer: RENDERER_STANDARD,
          params: {},
        })
      );

      const { findByText } = generate();
      const expectedParams = {
        portions: [['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#800080']],
      };

      const paramsParagraph = await findByText('Params:', { exact: false });
      expect(paramsParagraph.innerText).toEqual(
        'Params: ' + JSON.stringify(expectedParams)
      );
    });
  });

  describe('Direction provision', () => {
    test('should provide direction as vertical if width is higher than height', async () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['foo', 'bar', 'baz']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 300, height: 200 }));
      useSomeConfig.mockReturnValue(
        ref({
          columnsLimited: false,
          columnsMax: 3,
          renderer: RENDERER_STANDARD,
          params: {},
        })
      );

      const { findByText } = generate();
      const paragraph = await findByText('Direction:', { exact: false });
      expect(paragraph.innerText).toEqual('Direction: vertical');
    });

    test('should provide direction as vertical if width and height are equal', async () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['foo', 'bar', 'baz']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 300, height: 300 }));
      useSomeConfig.mockReturnValue(
        ref({
          columnsLimited: false,
          columnsMax: 3,
          renderer: RENDERER_STANDARD,
          params: {},
        })
      );

      const { findByText } = generate();
      const paragraph = await findByText('Direction:', { exact: false });
      expect(paragraph.innerText).toEqual('Direction: vertical');
    });

    test('should provide direction as horizontal if width is lower than height', async () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['foo', 'bar', 'baz']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
      useSomeConfig.mockReturnValue(
        ref({
          columnsLimited: false,
          columnsMax: 3,
          renderer: RENDERER_STANDARD,
          params: {},
        })
      );

      const { findByText } = generate();
      const paragraph = await findByText('Direction:', { exact: false });
      expect(paragraph.innerText).toEqual('Direction: horizontal');
    });
  });

  test('should provide remainder bytes to remainder handler', async () => {
    useNumberAsColors.mockReturnValue({
      colors: ref(['foo', 'bar', 'baz']),
      remainder: ref([1, 2, 3]),
    });
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
    useSomeConfig.mockReturnValue(
      ref({
        columnsLimited: false,
        columnsMax: 3,
        renderer: RENDERER_STANDARD,
        params: {},
      })
    );

    const { findByText } = generate();
    const paragraph = await findByText('Bytes: ', { exact: false });

    expect(paragraph.innerText).toEqual('Bytes: 1, 2, 3');
  });

  test('should not display remainder handler unless there is a remainder to handle', () => {
    useNumberAsColors.mockReturnValue({
      colors: ref(['foo', 'bar', 'baz']),
      remainder: ref([]),
    });
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
    useSomeConfig.mockReturnValue(
      ref({
        columnsLimited: false,
        columnsMax: 3,
        renderer: RENDERER_STANDARD,
        params: {},
      })
    );

    const { queryByText } = generate();
    const paragraph = queryByText('Bytes:', { exact: false });

    expect(paragraph).toBeFalsy();
  });
});
