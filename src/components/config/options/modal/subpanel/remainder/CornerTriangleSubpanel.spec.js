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

  test('should initialize with all needed corners', () => {
    useDefaultedConfig.mockReturnValue(ref({}));

    const { container } = generate();

    expect(useDefaultedConfig).toHaveBeenCalledWith(REM_TRIANGLE, {
      size: 20,
      topLeft: '0',
      topRight: '0',
      bottomRight: '0',
      bottomLeft: '0',
    });
  });

  test('should allow to freely set size', async () => {
    const config = ref({
      size: 20,
      topLeft: '0',
      topRight: '0',
      bottomRight: '0',
      bottomLeft: '0',
    });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();
    const sizeSlider = container.querySelector('.slider');

    await fireEvent.update(sizeSlider, 45);

    expect(config.value).toEqual({
      size: 45,
      topLeft: '0',
      topRight: '0',
      bottomRight: '0',
      bottomLeft: '0',
    });
  });

  test('should allow to set and unset corner remainder bytes', async () => {
    const config = ref({
      size: 20,
      topLeft: '0',
      topRight: '0',
      bottomRight: '0',
      bottomLeft: '0',
    });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();
    const topLeft2 = container.querySelector('#topLeft-2');
    const topRight3 = container.querySelector('#topRight-3');
    const bottomRight3 = container.querySelector('#bottomRight-3');
    const bottomLeft2 = container.querySelector('#bottomLeft-2');

    const topRight1 = container.querySelector('#topRight-1');

    await Promise.all(
      [topLeft2, topRight3, bottomRight3, bottomLeft2].map((radio) =>
        fireEvent.click(radio)
      )
    );

    expect(config.value).toEqual({
      size: 20,
      topLeft: '1',
      topRight: '2',
      bottomRight: '2',
      bottomLeft: '1',
    });

    await fireEvent.click(topRight1);

    expect(config.value).toEqual({
      size: 20,
      topLeft: '1',
      topRight: '0',
      bottomRight: '2',
      bottomLeft: '1',
    });
  });
});
