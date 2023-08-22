import { describe, expect, vi } from 'vitest';
import { useDefaultedConfig } from './common/default';
import { ref } from 'vue';
import { fireEvent, render } from '@testing-library/vue';
import MosaicSubpanel from './MosaicSubpanel.vue';

vi.mock('./common/default');

describe('MosaicSubpanel', () => {
  test('should allow to modify all 3 parameters', async () => {
    const config = ref({ squareRows: 30, rows: 3, offset: 2 });

    useDefaultedConfig.mockReturnValue(config);

    const { container } = render(MosaicSubpanel, {
      global: {
        stubs: {
          LimitedSliderNumber: {
            props: ['min', 'max', 'modelValue'],
            emits: ['update:modelValue'],
            template:
              '<input class="slider" :value="modelValue" @input="$emit(\'update:modelValue\', parseInt($event.target.value))">',
          },
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

    const newValues = [40, 2, 6];
    const inputs = [...container.querySelectorAll('p input')];

    expect(inputs.length).toEqual(3);

    for (const [index, input] of inputs.entries()) {
      await fireEvent.update(input, newValues[index]);
    }

    expect(config.value).toEqual({ squareRows: 40, rows: 2, offset: 6 });
  });
});
