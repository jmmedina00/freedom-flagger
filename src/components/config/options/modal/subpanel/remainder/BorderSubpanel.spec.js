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
          IconOption: {
            props: ['id', 'icon', 'label', 'value', 'modelValue', 'disabled'],
            emits: ['update:modelValue'],
            template:
              '<label :for="id">{{ label }}</label>' +
              '<input name="test" type="radio" :id="id" :value="value" :checked="value === modelValue" ' +
              '@change="$emit(\'update:modelValue\', value)" :disabled="disabled"/>',
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
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
      },
      expect.anything()
    );
  });

  test('should allow to freely set size', async () => {
    const config = ref({
      size: 20,
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
    });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();
    const sizeSlider = container.querySelector('.slider');

    await fireEvent.update(sizeSlider, 45);

    expect(config.value).toEqual({
      size: 45,
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
    });
  });

  test('should allow to set and unset corner remainder bytes', async () => {
    const config = ref({
      size: 20,
      top: '0',
      bottom: '0',
      left: '0',
      right: '0',
    });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();
    const top3 = container.querySelector('#top-3');
    const bottom2 = container.querySelector('#bottom-2');
    const left3 = container.querySelector('#left-3');
    const right2 = container.querySelector('#right-2');

    const left1 = container.querySelector('#left-1');

    await Promise.all(
      [top3, bottom2, left3, right2].map((radio) => fireEvent.click(radio))
    );

    expect(config.value).toEqual({
      size: 20,
      top: '2',
      bottom: '1',
      left: '2',
      right: '1',
    });

    await fireEvent.click(left1);

    expect(config.value).toEqual({
      size: 20,
      top: '2',
      bottom: '1',
      left: '0',
      right: '1',
    });
  });
});
