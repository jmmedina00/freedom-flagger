import { describe, expect, test, vi } from 'vitest';
import { computed, inject, ref } from 'vue';
import { useSomeConfig } from '../plugin';
import { fireEvent, render } from '@testing-library/vue';
import RenderingAdjustModal from './RenderingAdjustModal.vue';
import {
  RENDERERS,
  RENDERER_DECORATE,
  RENDERER_DIVIDED,
  RENDERER_STANDARD,
} from '@app/components/shared/constant/rendering';
import { CONFIG_RENDERING, HANDLING_CONFIG, MODAL_ACTIVE } from '@app/state';

vi.mock('../plugin');

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
              config: { value: key, test: key.length * 3 + 2 },
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
              '<label :for="id">{{ label }}</label>' +
              '<input name="test" type="radio" :id="id" :value="value" :checked="value === modelValue" ' +
              '@change="$emit(\'update:modelValue\', value)" :disabled="disabled"/>',
          },
          ...autoStubs,
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

  test('should load current state as initial values', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { test: 12 },
    });
    useSomeConfig.mockReturnValue(config);

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

      const { findByLabelText, findByText } = generate();
      const option = await findByLabelText('renderer.' + renderer);
      await fireEvent.click(option);

      await findByText('Renderer: ' + renderer);
      const clickButton = await findByText('Click');
      await fireEvent.click(clickButton);

      const configParagraph = await findByText('Config:', { exact: false });
      expect(configParagraph.innerText).toEqual(
        'Config: ' +
          JSON.stringify({ value: renderer, test: renderer.length * 3 + 2 })
      );
    }
  );

  test('should apply all changes to state and close modal', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_STANDARD,
      params: { test: 12 },
    });
    useSomeConfig.mockReturnValue(config);
    const active = ref(true);

    const { findByLabelText, findByText } = generate(active);
    const option = await findByLabelText('renderer.divided');
    await fireEvent.click(option);

    await findByText('Renderer: ' + RENDERER_DIVIDED);
    const clickButton = await findByText('Click');
    await fireEvent.click(clickButton);

    const applyButton = await findByText('apply');
    await fireEvent.click(applyButton);

    expect(config.value).toEqual({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { value: RENDERER_DIVIDED, test: 23 },
    });
    expect(active.value).toBeFalsy();
  });
});
