import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import RenderingOptions from './RenderingOptions.vue';
import { useSomeConfig } from './plugin';
import { computed, inject, ref } from 'vue';
import { CONFIG_RENDERING, HANDLING_CONFIG } from '@app/state';
import {
  RENDERERS,
  RENDERER_DECORATE,
  RENDERER_DIVIDED,
  RENDERER_STANDARD,
} from '@app/components/shared/constant/rendering';

vi.mock('./plugin');

describe('RenderingOptions', () => {
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

  const generate = () =>
    render(RenderingOptions, {
      global: {
        stubs: {
          ...autoStubs,
          LimitedSliderNumber: {
            emits: ['update:modelValue'],
            props: ['modelValue', 'min', 'max'],
            template: `<label for="number">slider</label>
            <input id="number" type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">`,
          },
          IconOption: {
            props: ['id', 'icon', 'label', 'value', 'modelValue', 'disabled'],
            emits: ['update:modelValue'],
            template:
              '<label :for="id">{{ label }}</label>' +
              '<input name="test" type="radio" :id="id" :value="value" :checked="value === modelValue" ' +
              '@change="$emit(\'update:modelValue\', value)" :disabled="disabled"/>',
          },
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

  test('should have toggle enabled and display current config properly when columnsLimited set to true', async () => {
    useSomeConfig.mockReturnValue(
      ref({
        columnsLimited: true,
        columnsMax: 5,
        renderer: RENDERER_DIVIDED,
        params: { test: 12 },
      })
    );

    const { findByRole, queryByLabelText, findByLabelText } = generate();
    const toggle = await findByRole('checkbox');
    expect(toggle.checked).toBeTruthy();

    const slider = queryByLabelText('slider');
    expect(slider).toBeTruthy();
    expect(slider.value).toEqual(5);

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

  test('should have toggle disabled at first and nothing else when columnsLimited set to false', async () => {
    useSomeConfig.mockReturnValue(
      ref({
        columnsLimited: false,
        columnsMax: 7,
        renderer: RENDERER_DECORATE,
        params: { qwe: 'asd' },
      })
    );

    const { findByRole, queryByLabelText, queryAllByLabelText } = generate();
    const toggle = await findByRole('checkbox');
    expect(toggle.checked).toBeFalsy();

    expect(queryByLabelText('slider')).toBeFalsy();
    const radioOptions = queryAllByLabelText('config.render.renderer.', {
      exact: false,
    });
    expect(radioOptions.length).toEqual(0);
  });

  test('should disable configuration while keeping current data intact', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 7,
      renderer: RENDERER_DECORATE,
      params: { qwe: 'asd' },
    });

    useSomeConfig.mockReturnValue(config);

    const { findByRole } = generate();
    const toggle = await findByRole('checkbox');

    await fireEvent.click(toggle);
    expect(config.value).toEqual({
      columnsLimited: false,
      columnsMax: 7,
      renderer: RENDERER_DECORATE,
      params: expect.anything(),
    });
  });

  test('should allow to change max columns', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { test: 12 },
    });

    useSomeConfig.mockReturnValue(config);

    const { queryByLabelText } = generate();
    const slider = queryByLabelText('slider');

    await fireEvent.update(slider, 13);

    expect(config.value).toEqual({
      columnsLimited: true,
      columnsMax: 13,
      renderer: RENDERER_DIVIDED,
      params: expect.anything(),
    });
  });

  test('should allow to pick renderer with the icon options', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { test: 12 },
    });

    useSomeConfig.mockReturnValue(config);

    const { findByLabelText } = generate();
    const options = await Promise.all(
      possibleRenderers.map((renderer) =>
        findByLabelText('renderer.' + renderer)
      )
    );

    for (const [index, option] of Object.entries(options)) {
      await fireEvent.click(option);
      expect(config.value.renderer).toEqual(possibleRenderers[index]);
    }
  });

  test('should blank params and render no component for standard renderer', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { test: 12 },
    });

    useSomeConfig.mockReturnValue(config);

    const { findByLabelText, queryByText } = generate();
    const option = await findByLabelText('renderer.' + RENDERER_STANDARD);
    await fireEvent.click(option);

    expect(queryByText('Renderer: ' + RENDERER_STANDARD)).toBeFalsy();
    expect(config.value).toEqual({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_STANDARD,
      params: {},
    });
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

      expect(config.value).toEqual({
        columnsLimited: true,
        columnsMax: 5,
        renderer,
        params: { value: renderer, test: renderer.length * 3 + 2 },
      });
    }
  );
});
