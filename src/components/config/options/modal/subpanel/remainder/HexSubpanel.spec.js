import { describe, test, vi } from 'vitest';
import { ref } from 'vue';
import { useDefaultedConfig } from '../default';
import { fireEvent, render } from '@testing-library/vue';
import HexSubpanel from './HexSubpanel.vue';

vi.mock('../default');

describe('HexSubpanel', () => {
  test('should be able to modify both parameters', async () => {
    const config = ref({ size: 30, margin: 10 });

    useDefaultedConfig.mockReturnValue(config);

    const { container } = render(HexSubpanel, {
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

    const newValues = [20, 35];
    const inputs = [...container.querySelectorAll('p input')];

    expect(inputs.length).toEqual(2);

    for (const [index, input] of inputs.entries()) {
      await fireEvent.update(input, newValues[index]);
    }

    expect(config.value).toEqual({ size: 20, margin: 35 });
  });
});
