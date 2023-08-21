import { render } from '@testing-library/vue';
import { inject, ref } from 'vue';
import { describe, expect, test, vi } from 'vitest';
import FlagDisplay from './FlagDisplay.vue';
import { useNumberAsColors } from './helper/colors';
import { useFullStateSize } from './helper/size';
import { useSomeConfig } from '../config/options/plugin';
import { CONFIG_MAX_COLUMNS, DECORATE_SIZE } from '@app/state';

vi.mock('./helper/colors');
vi.mock('./helper/size');
vi.mock('../config/options/plugin');

describe('FlagDisplay', () => {
  const generate = () =>
    render(FlagDisplay, {
      global: {
        stubs: {
          StandardFlagRenderer: {
            props: ['portions', 'direction'],
            setup: (props) => {
              const pretty = props.portions.value
                .map((row) => '[' + row.join(',') + ']')
                .join(',');

              return { direction: props.direction, pretty };
            },
            template: '<span>{{ pretty }} - {{ direction }}</span>',
          },
          RemainderHandler: {
            props: ['bytes'],
            setup: () => {
              const size = inject(DECORATE_SIZE);
              return { size };
            },
            template:
              '<p>Bytes: {{ bytes.join(", ") }}</p><p>Size: {{ size?.width }} x {{ size?.height }}</p>',
          },
        },
      },
    });

  test('should provide dimensions from state to both SVG and decorates', async () => {
    useNumberAsColors.mockReturnValue({
      colors: ref(['foo', 'bar', 'baz']),
      remainder: ref([1, 2, 3]),
    });
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
    useSomeConfig.mockReturnValue(ref(5));

    const { container, findByText } = generate();

    const svg = container.querySelector('svg');
    expect(svg.getAttribute('width')).toEqual('200');
    expect(svg.getAttribute('height')).toEqual('300');

    const sizeParagraph = await findByText('Size: ', { exact: false });
    expect(sizeParagraph.innerText).toEqual('Size: 200 x 300');
  });

  describe('Color division', () => {
    test('should divide provided colors by column limit and provide them to renderer', () => {
      useNumberAsColors.mockReturnValue({
        colors: ref([
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#800080',
          '#FFA500',
          '#00FFFF',
          '#FFC0CB',
          '#008080',
          '#FF6347',
          '#800000',
          '#FF00FF',
        ]),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
      useSomeConfig.mockReturnValue(ref(5));

      const { container } = generate();

      const span = container.querySelector('svg span');
      expect(span.innerHTML).toContain(
        '[#FF0000,#00FF00,#0000FF,#FFFF00,#800080],' +
          '[#FFA500,#00FFFF,#FFC0CB,#008080,#FF6347],[#800000,#FF00FF]'
      );
      expect(useSomeConfig).toHaveBeenCalledWith(
        CONFIG_MAX_COLUMNS,
        expect.anything()
      );
    });

    test('should provide equally sized, non-empty rows when total is divisible by max', () => {
      useNumberAsColors.mockReturnValue({
        colors: ref([
          '#FF0000',
          '#00FF00',
          '#0000FF',
          '#FFFF00',
          '#800080',
          '#FFA500',
          '#00FFFF',
          '#FFC0CB',
          '#008080',
        ]),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
      useSomeConfig.mockReturnValue(ref(3));

      const { container } = generate();

      const span = container.querySelector('svg span');
      expect(span.innerHTML).toContain(
        '[#FF0000,#00FF00,#0000FF],[#FFFF00,#800080,#FFA500],' +
          '[#00FFFF,#FFC0CB,#008080]'
      );
    });

    test('should provide single row if columns are equal or lower than max', () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['#FF0000', '#00FF00', '#0000FF']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
      useSomeConfig.mockReturnValue(ref(5));

      const { container } = generate();

      const span = container.querySelector('svg span');
      expect(span.innerHTML).toContain('[#FF0000,#00FF00,#0000FF]');
    });

    test('should provide single row if columns are equal or lower than max', () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#800080']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
      useSomeConfig.mockReturnValue(ref(null));

      const { container } = generate();

      const span = container.querySelector('svg span');
      expect(span.innerHTML).toContain(
        '[#FF0000,#00FF00,#0000FF,#FFFF00,#800080]'
      );
    });
  });

  describe('Direction provision', () => {
    test('should provide direction as vertical if width is higher than height', () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['foo', 'bar', 'baz']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 300, height: 200 }));
      useSomeConfig.mockReturnValue(ref(5));

      const { container } = generate();
      const span = container.querySelector('svg span');
      expect(span.innerHTML).toEqual('[foo,bar,baz] - vertical');
    });

    test('should provide direction as vertical if width and height are equal', () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['foo', 'bar', 'baz']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 300, height: 300 }));
      useSomeConfig.mockReturnValue(ref(5));

      const { container } = generate();
      const span = container.querySelector('svg span');
      expect(span.innerHTML).toEqual('[foo,bar,baz] - vertical');
    });

    test('should provide direction as horizontal if width is lower than height', () => {
      useNumberAsColors.mockReturnValue({
        colors: ref(['foo', 'bar', 'baz']),
        remainder: ref([1, 2, 3]),
      });
      useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
      useSomeConfig.mockReturnValue(ref(5));

      const { container } = generate();
      const span = container.querySelector('svg span');
      expect(span.innerHTML).toEqual('[foo,bar,baz] - horizontal');
    });
  });

  test('should provide remainder bytes to remainder handler', async () => {
    useNumberAsColors.mockReturnValue({
      colors: ref(['foo', 'bar', 'baz']),
      remainder: ref([1, 2, 3]),
    });
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
    useSomeConfig.mockReturnValue(ref(5));

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
    useSomeConfig.mockReturnValue(ref(5));

    const { container } = generate();
    const paragraph = container.querySelector('svg p');

    expect(paragraph).toBeFalsy();
  });

  /* Remaining to implement + test:
      - Renderer picking / handling
   */
});
