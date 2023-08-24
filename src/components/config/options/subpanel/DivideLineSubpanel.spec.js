import { describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { useDefaultedConfig } from './common/default';
import { fireEvent, render } from '@testing-library/vue';
import DivideLineSubpanel from './DivideLineSubpanel.vue';

vi.mock('./common/default');

describe('DivideLineSubpanel', () => {
  test('should allow to freely set percent', async () => {
    const config = ref({ mainFlagPercent: 15 });

    useDefaultedConfig.mockReturnValue(config);

    const { container } = render(DivideLineSubpanel, {
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

    const inputs = [...container.querySelectorAll('p input')];
    expect(inputs.length).toEqual(1);

    await fireEvent.update(inputs[0], 60);
    expect(config.value).toEqual({ mainFlagPercent: 60 });
  });
});
