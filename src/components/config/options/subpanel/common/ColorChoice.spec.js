import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import ColorChoice from './ColorChoice.vue';
import { ref } from 'vue';
import { HANDLING_CONFIG } from '@app/state';
import { useUpdatableModel } from '@app/util/testing';

describe('ColorChoice', () => {
  const generate = (props, handling = ref({ colorChoices: 2 })) =>
    render(ColorChoice, {
      props,
      global: {
        provide: {
          [HANDLING_CONFIG]: handling,
        },
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
        },
      },
    });

  test('should render span with title', async () => {
    const { props } = useUpdatableModel(0);

    const { findByText } = generate({ ...props, title: 'test' });
    expect(await findByText('config.remainder.test')).toBeTruthy();
  });

  test.each([2, 3, 4, 5, 6])(
    'should render disabled + %i choices from handling color choices',
    async (colorChoices) => {
      const handling = ref({ colorChoices });
      const { props } = useUpdatableModel(0);

      const { findByLabelText, queryAllByLabelText } = generate(
        { ...props, title: 'choice' },
        handling
      );

      const inputs = queryAllByLabelText('options.byte', {
        exact: false,
      });
      expect(inputs.length).toEqual(colorChoices + 1);
    }
  );

  test('should be able to react to options being clicked and sending current as index + 1 (0 = disabled)', async () => {
    const handling = ref({ colorChoices: 3 });
    const { props, reference } = useUpdatableModel(0);

    const { findByLabelText } = generate(props, handling);

    const input0 = await findByLabelText('options.byte.0');
    expect(input0.checked).toBeTruthy();
    const input1 = await findByLabelText('options.byte.1');
    await fireEvent.click(input1);
    expect(reference.value).toEqual(1);

    const input2 = await findByLabelText('options.byte.2');
    await fireEvent.click(input2);
    expect(reference.value).toEqual(2);

    await fireEvent.click(input0);
    expect(reference.value).toEqual(0);
  });

  test('should reset back to 0 when currently selected option becomes unavailable', async () => {
    const handling = ref({ colorChoices: 3 });
    const { props, reference } = useUpdatableModel(0);

    const { findByLabelText } = generate(props, handling);

    const input2 = await findByLabelText('options.byte.3');
    await fireEvent.click(input2);
    expect(reference.value).toEqual(3);

    handling.value = { colorChoices: 2 };
    await Promise.resolve();

    expect(reference.value).toEqual(0);
  });

  test('should keep original value when choices get reduced', async () => {
    const handling = ref({ colorChoices: 3 });
    const { props, reference } = useUpdatableModel(0);

    const { findByLabelText } = generate(props, handling);

    const input2 = await findByLabelText('options.byte.2');
    await fireEvent.click(input2);
    expect(reference.value).toEqual(2);
    await Promise.resolve();

    handling.value = { colorChoices: 2 };
    await Promise.resolve();

    expect(reference.value).toEqual(2);
  });
});
