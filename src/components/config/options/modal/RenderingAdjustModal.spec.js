import { afterEach, describe, expect, test, vi } from 'vitest';
import { computed, inject, ref } from 'vue';
import { useSomeConfig } from '../plugin';
import { fireEvent, render } from '@testing-library/vue';
import RenderingAdjustModal from './RenderingAdjustModal.vue';
import {
  DECORATE_INFINITE,
  RENDERERS,
  RENDERER_DECORATE,
  RENDERER_DIVIDED,
  RENDERER_STANDARD,
} from '@app/components/shared/constant/rendering';
import {
  CONFIG_RENDERING,
  DECORATE_CONFIG,
  HANDLING_CONFIG,
  MODAL_ACTIVE,
} from '@app/state';
import { placeColorsOnIndexes } from '@app/components/shared/color-index';
import { useFullStateSize } from '@app/components/render/helper/size';
import InfiniteDecorate from '@app/components/shared/decorate/InfiniteDecorate.vue';

vi.mock('../plugin');
vi.mock('@app/components/shared/color-index');
vi.mock('@app/components/render/helper/size');

describe('RenderingAdjustModal', () => {
  const possibleRenderers = Object.keys(RENDERERS);

  const otherThanStandard = possibleRenderers.filter(
    (renderer) => renderer !== RENDERER_STANDARD
  );

  const EXISTING_PANELS = {
    [RENDERER_DIVIDED]: 'DivideLineSubpanel',
    [RENDERER_DECORATE]: 'DecorateSubpanel',
  };

  const autoStubs = Object.fromEntries(
    Object.entries(EXISTING_PANELS).map(([key, component]) => [
      component,
      {
        setup: (props) => {
          const handling = inject(HANDLING_CONFIG, ref({}));

          const setValue = () => {
            handling.value = {
              ...handling.value,
              config: {
                value: key,
                test: key.length * 3 + 2,
                // Test data for the demo displays
                mainFlagPercent: 45,
                decorate: DECORATE_INFINITE,
                decorateConfig: { foo: 'bar' },
                scale: ['test'],
              },
              garbage: 'value',
            };
          };

          return {
            config: computed(() => JSON.stringify(handling.value?.config)),
            setValue,
          };
        },
        template: `<p>Renderer: ${key}</p><p>Config: {{ config }}</p><button @click="setValue">Click</button>`,
      },
    ])
  );

  const generate = (active = ref(true)) =>
    render(RenderingAdjustModal, {
      global: {
        provide: {
          [MODAL_ACTIVE]: active,
        },
        stubs: {
          IconOption: {
            props: ['id', 'icon', 'label', 'value', 'modelValue', 'disabled'],
            emits: ['update:modelValue'],
            template:
              '<label :for="id" v-bind="$attrs">{{ label }}</label>' +
              '<input name="test" type="radio" :id="id" :value="value" :checked="value === modelValue" ' +
              '@change="$emit(\'update:modelValue\', value)" :disabled="disabled"/>',
          },
          DemoFlat: {
            template: '<p>Test</p>',
          },
          DemoSplit: {
            props: ['percent'],
            template: '<p>Info: "{{ percent }}"</p>',
          },
          DemoMiniFlag: {
            props: ['component'],
            setup: () => {
              const config = inject(DECORATE_CONFIG, ref({}));
              return { config: computed(() => JSON.stringify(config.value)) };
            },
            template:
              '<p>Info: {{ JSON.stringify(component) }}</p><p>Decorate: {{ config }}</p>',
          },
          LimitedSliderNumber: {
            emits: ['update:modelValue'],
            props: ['modelValue', 'min', 'max'],
            template: `<label for="number">slider</label>
            <input id="number" type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">`,
          },
          ...autoStubs,
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

  afterEach(() => {
    placeColorsOnIndexes.mockReset();
    useSomeConfig.mockReset();
    useFullStateSize.mockReset();
  });

  test('should load current state as initial values', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { test: 12 },
    });
    useSomeConfig.mockReturnValue(config);
    useFullStateSize.mockReturnValue(ref({ width: 800, height: 500 }));

    const { findByLabelText } = generate();

    const selected = await findByLabelText('renderer.' + RENDERER_DIVIDED);
    expect(selected.checked).toBeTruthy();

    const unselected = await Promise.all(
      possibleRenderers
        .filter((renderer) => renderer !== RENDERER_DIVIDED)
        .map((renderer) => findByLabelText('renderer.' + renderer))
    );

    for (const radio of unselected) {
      expect(radio.checked).toBeFalsy();
    }

    expect(useSomeConfig).toHaveBeenCalledWith(
      CONFIG_RENDERING,
      expect.anything()
    );
  });

  test('should allow to pick renderer with the icon options', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { test: 12 },
    });

    useSomeConfig.mockReturnValue(config);
    useFullStateSize.mockReturnValue(ref({ width: 800, height: 500 }));

    const { findByLabelText, queryByText } = generate();

    const options = await Promise.all(
      possibleRenderers.map((renderer) =>
        findByLabelText('renderer.' + renderer)
      )
    );

    for (const [index, option] of Object.entries(options)) {
      await fireEvent.click(option);

      if (possibleRenderers[index] === RENDERER_STANDARD) {
        expect(queryByText('Renderer: ' + RENDERER_STANDARD)).toBeFalsy();
      } else {
        expect(
          queryByText('Renderer: ' + possibleRenderers[index])
        ).toBeDefined();
      }
    }
  });

  test.each(otherThanStandard)(
    'should switch to and take parameters from subpanels for non-standard renderers',
    async (renderer) => {
      const config = ref({
        columnsLimited: true,
        columnsMax: 5,
        renderer: RENDERER_STANDARD,
        params: { test: 12 },
      });

      useSomeConfig.mockReturnValue(config);
      useFullStateSize.mockReturnValue(ref({ width: 800, height: 500 }));

      const { findByLabelText, findByText } = generate();
      const option = await findByLabelText('renderer.' + renderer);
      await fireEvent.click(option);

      await findByText('Renderer: ' + renderer);
      const clickButton = await findByText('Click');
      await fireEvent.click(clickButton);

      const configParagraph = await findByText('Config:', { exact: false });
      expect(configParagraph.innerText).toEqual(
        'Config: ' +
          JSON.stringify({
            value: renderer,
            test: renderer.length * 3 + 2,
            mainFlagPercent: 45,
            decorate: DECORATE_INFINITE,
            decorateConfig: { foo: 'bar' },
            scale: ['test'],
          })
      );
    }
  );

  test.each([
    [RENDERER_DIVIDED, '45'],
    [RENDERER_DECORATE, InfiniteDecorate],
  ])(
    'should provide %s demo component with relevant information',
    async (summonedBy, expectedInformation) => {
      const config = ref({
        columnsLimited: true,
        columnsMax: 5,
        renderer: RENDERER_STANDARD,
        params: { test: 12 },
      });

      useSomeConfig.mockReturnValue(config);
      useFullStateSize.mockReturnValue(ref({ width: 800, height: 500 }));

      const { findByLabelText, findByText } = generate();
      const option = await findByLabelText('renderer.' + summonedBy);
      await fireEvent.click(option);

      const clickButton = await findByText('Click');
      await fireEvent.click(clickButton);

      const info = await findByText('Info:', { exact: false });
      expect(info.innerText).toEqual(
        'Info: ' + JSON.stringify(expectedInformation)
      );
    }
  );

  test('should provide mini flag on decorate renderer with prepared decorate config with test colors as well', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_STANDARD,
      params: { test: 12 },
    });

    useSomeConfig.mockReturnValue(config);
    placeColorsOnIndexes.mockReturnValue({ re: 'la', shi: 'baz' });
    useFullStateSize.mockReturnValue(ref({ width: 800, height: 500 }));

    const { findByLabelText, findByText } = generate();
    const option = await findByLabelText('renderer.' + RENDERER_DECORATE);
    await fireEvent.click(option);

    const clickButton = await findByText('Click');
    await fireEvent.click(clickButton);

    const info = await findByText('Decorate:', { exact: false });
    expect(info.innerText).toEqual(
      'Decorate: ' + JSON.stringify({ re: 'la', shi: 'baz' })
    );

    expect(placeColorsOnIndexes).toHaveBeenCalledWith(
      { foo: 'bar' },
      {
        scaled: ['test'],
        scaleRatio: 1 / 4,
        fields: [],
        colors: expect.anything(),
      }
    );
  });

  test('should apply all changes to state and close modal WITHOUT scaling info', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_STANDARD,
      params: { test: 12 },
    });
    useSomeConfig.mockReturnValue(config);
    useFullStateSize.mockReturnValue(ref({ width: 800, height: 500 }));
    const active = ref(true);

    const { findByLabelText, findByText } = generate(active);
    const option = await findByLabelText('renderer.divided');
    await fireEvent.click(option);

    await findByText('Renderer: ' + RENDERER_DIVIDED);
    const clickButton = await findByText('Click');
    await fireEvent.click(clickButton);

    const applyButton = await findByText('common.apply');
    await fireEvent.click(applyButton);

    expect(config.value).toEqual({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: {
        value: RENDERER_DIVIDED,
        test: 23,
        mainFlagPercent: 45,
        decorate: DECORATE_INFINITE,
        decorateConfig: { foo: 'bar' },
      },
    });
    expect(active.value).toBeFalsy();
  });
});
