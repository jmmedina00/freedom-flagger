import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import RenderingOptions from './RenderingOptions.vue';
import { useSomeConfig } from './plugin';
import { ref } from 'vue';
import { CONFIG_RENDERING } from '@app/state';
import {
  RENDERER_DECORATE,
  RENDERER_DIVIDED,
} from '@app/components/shared/constant/rendering';

vi.mock('./plugin');

describe('RenderingOptions', () => {
  const generate = () =>
    render(RenderingOptions, {
      global: {
        stubs: {
          LimitedSliderNumber: {
            emits: ['update:modelValue'],
            props: ['modelValue', 'min', 'max'],
            template: `<label for="number">slider</label>
            <input id="number" type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">`,
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

  test('should respect changes anywhere else in state when max columns are changed', async () => {
    const config = ref({
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DIVIDED,
      params: { test: 12 },
    });

    useSomeConfig.mockReturnValue(config);

    const { queryByLabelText } = generate();
    const slider = queryByLabelText('slider');

    config.value = {
      columnsLimited: true,
      columnsMax: 5,
      renderer: RENDERER_DECORATE,
      params: { bar: 'baz' },
    };

    await fireEvent.update(slider, 13);

    expect(config.value).toEqual({
      columnsLimited: true,
      columnsMax: 13,
      renderer: RENDERER_DECORATE,
      params: { bar: 'baz' },
    });
  });
});
