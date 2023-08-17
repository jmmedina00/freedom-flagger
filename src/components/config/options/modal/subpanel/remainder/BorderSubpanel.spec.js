import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import { useDefaultedConfig } from '../default';
import { ref } from 'vue';
import { REM_BORDER } from '@app/components/shared/constant/remainder';
import BorderSubpanel from './BorderSubpanel.vue';

vi.mock('../default');

describe('BorderSubpanel', () => {
  const generate = () =>
    render(BorderSubpanel, {
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

  test('should initialize with all needed sides', () => {
    useDefaultedConfig.mockReturnValue(ref({}));

    const { container } = generate();

    expect(useDefaultedConfig).toHaveBeenCalledWith(
      REM_BORDER,
      {
        size: 20,
        top: 1,
        bottom: 0,
        left: 0,
        right: 0,
      },
      expect.anything()
    );
  });

  test('should allow to freely set size', async () => {
    const config = ref({
      size: 20,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();
    const sizeSlider = container.querySelector('.slider');
    await fireEvent.update(sizeSlider, 45);

    expect(config.value).toEqual({
      size: 45,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
  });

  test('should allow to set and unset corner remainder bytes', async () => {
    const config = ref({
      size: 20,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    });
    useDefaultedConfig.mockReturnValue(config);

    const { findByText } = generate();
    const buttons = await Promise.all(
      ['top', 'bottom', 'left', 'right'].map(findByText)
    );

    await Promise.all(buttons.map((button) => fireEvent.click(button)));

    expect(config.value).toEqual({
      size: 20,
      top: 3,
      bottom: 6,
      left: 4,
      right: 5,
    });
  });
});
