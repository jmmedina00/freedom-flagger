import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import CornerTriangleSubpanel from './CornerTriangleSubpanel.vue';
import { useDefaultedConfig } from '../default';
import { ref } from 'vue';
import { REM_TRIANGLE } from '@app/components/shared/constant/remainder';

vi.mock('../default');

describe('CornerTriangleSubpanel', () => {
  const generate = () =>
    render(CornerTriangleSubpanel, {
      global: {
        mocks: { $t: (foo) => foo },
        stubs: {
          LimitedSliderNumber: {
            props: ['min', 'max', 'modelValue'],
            emits: ['update:modelValue'],
            template:
              '<input class="slider" :value="modelValue" @input="$emit(\'update:modelValue\', parseInt($event.target.value))">',
          },
          ColorChoice: {
            props: ['title', 'modelValue'],
            emits: ['update:modelValue'],
            template:
              '<button @click="$emit(\'update:modelValue\', title.length)">{{ title }}</button>',
          },
        },
      },
    });

  test('should initialize with all needed corners', () => {
    useDefaultedConfig.mockReturnValue(ref({}));

    const { container } = generate();

    expect(useDefaultedConfig).toHaveBeenCalledWith(
      REM_TRIANGLE,
      {
        size: 20,
        topLeft: 1,
        topRight: 0,
        bottomRight: 0,
        bottomLeft: 0,
      },
      expect.anything()
    );
  });

  test('should allow to freely set size', async () => {
    const config = ref({
      size: 20,
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();
    const sizeSlider = container.querySelector('.slider');

    await fireEvent.update(sizeSlider, 45);

    expect(config.value).toEqual({
      size: 45,
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    });
  });

  test('should allow to set and unset corner remainder bytes', async () => {
    const config = ref({
      size: 20,
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    });
    useDefaultedConfig.mockReturnValue(config);

    const { findByText } = generate();
    const buttons = await Promise.all(
      ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'].map(findByText)
    );

    await Promise.all(buttons.map((button) => fireEvent.click(button)));

    expect(config.value).toEqual({
      size: 20,
      topLeft: 7,
      topRight: 8,
      bottomRight: 11,
      bottomLeft: 10,
    });
  });
});
