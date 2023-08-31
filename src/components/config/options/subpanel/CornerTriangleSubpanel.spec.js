import { fireEvent, render } from '@testing-library/vue';
import { beforeAll, describe, expect, test, vi } from 'vitest';
import CornerTriangleSubpanel from './CornerTriangleSubpanel.vue';
import { useDefaultedConfig } from './common/default';
import { ref } from 'vue';
import { REM_TRIANGLE } from '@app/components/shared/constant/remainder';
import { useI18n } from 'vue-i18n';

vi.mock('vue-i18n');
vi.mock('./common/default');

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

  beforeAll(() => {
    useI18n.mockReturnValue({ t: (foo) => foo });
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
      [
        'Common.direction.top common.direction.left',
        'Common.direction.top common.direction.right',
        'Common.direction.bottom common.direction.right',
        'Common.direction.bottom common.direction.left',
      ].map(findByText)
    );

    await Promise.all(buttons.map((button) => fireEvent.click(button)));

    expect(config.value).toEqual({
      size: 20,
      topLeft: 7 + 1 + 17 * 2,
      topRight: 8 + 1 + 17 * 2,
      bottomRight: 11 + 1 + 17 * 2,
      bottomLeft: 10 + 1 + 17 * 2,
    });
  });
});
