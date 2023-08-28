import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import {
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  TOP_LEFT,
  TOP_RIGHT,
} from '@app/components/shared/decorate/corner';
import { useDefaultedConfig } from './common/default';
import { DECORATE_INFINITE } from '@app/components/shared/constant/rendering';
import InfiniteSubpanel from './InfiniteSubpanel.vue';

vi.mock('vue-i18n');
vi.mock('./common/default');

describe('InfiniteSubpanel', () => {
  const generate = () =>
    render(InfiniteSubpanel, {
      global: {
        mocks: {
          $t: (foo) => foo,
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
          LimitedSliderNumber: {
            props: ['min', 'max', 'modelValue'],
            emits: ['update:modelValue'],
            template:
              '<input class="slider" :value="modelValue" @input="$emit(\'update:modelValue\', parseInt($event.target.value))">',
          },
        },
      },
    });

  beforeEach(() => {
    useI18n.mockReturnValue({ t: (foo) => foo });
  });

  test('should allow to set size', async () => {
    const config = ref({ size: 17, corner: TOP_RIGHT });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();

    const input = container.querySelector('p input');
    await fireEvent.update(input, 36);

    expect(config.value).toEqual({ size: 36, corner: TOP_RIGHT });
    expect(useDefaultedConfig).toHaveBeenCalledWith(
      DECORATE_INFINITE,
      expect.anything(),
      expect.anything()
    );
  });

  test('should allow to set corner from properly defined icon labels', async () => {
    const config = ref({ size: 17, corner: TOP_RIGHT });
    useDefaultedConfig.mockReturnValue(config);

    const cornerLabels = {
      [TOP_LEFT]: 'Common.direction.top common.direction.left',
      [TOP_RIGHT]: 'Common.direction.top common.direction.right',
      [BOTTOM_RIGHT]: 'Common.direction.bottom common.direction.right',
      [BOTTOM_LEFT]: 'Common.direction.bottom common.direction.left',
    };

    const { findByLabelText } = generate();

    for (const [corner, label] of Object.entries(cornerLabels)) {
      const input = await findByLabelText(label);
      await fireEvent.click(input);

      expect(config.value).toEqual({ size: 17, corner });
    }
  });
});
