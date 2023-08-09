import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import IconOption from './IconOption.vue';
import { useUpdatableModel } from '@app/util/testing';

describe('IconOption', () => {
  const generate = (props) =>
    render(IconOption, {
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

  test('should be able to be checked by pressing the Space key', async () => {
    const { reference, props } = useUpdatableModel('foo');

    const { container } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 're',
    });

    const radio = container.querySelector('label'); // Need to explicitly find the label
    await fireEvent.keyDown(radio, { code: 'Space' });

    expect(reference.value).toEqual('re');
  });

  test('should be able to checked by pressing the Enter key', async () => {
    const { reference, props } = useUpdatableModel('foo');

    const { container } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 're',
    });

    const radio = container.querySelector('label'); // Need to explicitly find the label
    await fireEvent.keyDown(radio, { code: 'Enter' });

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

  test('should be able to act as a checkbox that can be unchecked', async () => {
    const { reference, props } = useUpdatableModel(['re', 'la']);

    const { findByLabelText } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 're',
      type: 'checkbox',
    });

    const check = await findByLabelText('bar - baz');
    expect(check.checked).toBeTruthy();
    await fireEvent.click(check);

    expect(reference.value.includes('re')).toBeFalsy();
    expect(check.checked).toBeFalsy();
  });

  test('should be able to act as a checkbox that can be checked', async () => {
    const { reference, props } = useUpdatableModel(['la']);

    const { findByLabelText } = generate({
      ...props,
      icon: 'bar',
      label: 'baz',
      value: 're',
      type: 'checkbox',
    });

    const check = await findByLabelText('bar - baz');
    expect(check.checked).toBeFalsy();
    await fireEvent.click(check);

    expect(reference.value.includes('re')).toBeTruthy();
    expect(check.checked).toBeTruthy();
  });
});
