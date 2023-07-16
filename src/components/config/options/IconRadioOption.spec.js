import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import IconRadioOption from './IconRadioOption.vue';
import { ref } from 'vue';

describe('IconRadioOption', () => {
  const generate = (props) =>
    render(IconRadioOption, {
      props,
      global: {
        mocks: { $t: (foo) => foo },
        stubs: {
          DiscreteIcon: {
            props: ['icon'],
            template: '<span>{{icon}} - </span>',
          },
        },
      },
    });

  const useUpdatableModel = (initialValue = '') => {
    const reference = ref(initialValue);
    const props = {
      modelValue: reference.value,
      'onUpdate:modelValue': (e) => {
        reference.value = e;
      },
    };

    return { reference, props };
  };

  test('should be checked if provided v-model matches value', async () => {
    const { props } = useUpdatableModel('foo');

    const { findByLabelText } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 'foo',
    });

    const radio = await findByLabelText('bar - baz'); // Asserts icon and
    expect(radio.checked).toBeTruthy();
    expect(radio.disabled).toBeFalsy();
  });

  test('should not be checked if provided v-model does not match value', async () => {
    const { props } = useUpdatableModel('foo');

    const { findByLabelText } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 're',
    });

    const radio = await findByLabelText('bar - baz');
    expect(radio.checked).toBeFalsy();
  });

  test('should be able to be checked and update v-model accordingly', async () => {
    const { reference, props } = useUpdatableModel('foo');

    const { findByLabelText } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 're',
    });

    const radio = await findByLabelText('bar - baz');
    await fireEvent.click(radio);

    expect(reference.value).toEqual('re');
  });

  test('should be able to pass disabled', async () => {
    const { reference, props } = useUpdatableModel('foo');

    const { findByLabelText, container } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 're',
      disabled: true,
    });

    const radio = await findByLabelText('bar - baz');
    expect(radio.disabled).toBeTruthy();
  });
});
