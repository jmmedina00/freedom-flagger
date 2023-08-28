import {
  DECORATE_SHAPE,
  SHAPE_CIRCLE,
  SHAPE_COMPONENTS,
} from '@app/components/shared/constant/rendering';
import { expect, test, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/vue';
import { ref } from 'vue';
import { useDefaultedConfig } from './common/default';
import ShapeSubpanel from './ShapeSubpanel.vue';

vi.mock('./common/default');

describe('ShapeSubpanel', () => {
  const generate = () =>
    render(ShapeSubpanel, {
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

  test('should allow to set size', async () => {
    const config = ref({ size: 24, component: SHAPE_CIRCLE });
    useDefaultedConfig.mockReturnValue(config);

    const { container } = generate();

    const input = container.querySelector('p input');
    await fireEvent.update(input, 36);

    expect(config.value).toEqual({ size: 36, component: SHAPE_CIRCLE });
    expect(useDefaultedConfig).toHaveBeenCalledWith(
      DECORATE_SHAPE,
      expect.anything(),
      expect.anything()
    );
  });

  test('should allow to set any existing shape', async () => {
    const config = ref({ size: 52, component: SHAPE_CIRCLE });
    useDefaultedConfig.mockReturnValue(config);

    const shapes = Object.keys(SHAPE_COMPONENTS);
    const { container, findByLabelText } = generate();

    for (const shape of shapes) {
      const input = await findByLabelText('shape.' + shape);
      await fireEvent.click(input);

      expect(config.value).toEqual({ size: 52, component: shape });
    }
  });
});
