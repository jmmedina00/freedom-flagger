import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import StrictNumberInput from './StrictNumberInput.vue';
import { useUpdatableModel } from '@app/util/testing';

describe('StrictNumberInput', () => {
  test('should behave like normal input for numbers', async () => {
    const { props, reference } = useUpdatableModel(100);

    const { findByRole } = render(StrictNumberInput, { props });
    const input = await findByRole('textbox');
    await fireEvent.update(input, 110);

    expect(reference.value).toEqual(110);
  });

  test('should set input to empty when value is effectively zero and model to undefined', async () => {
    const { props, reference } = useUpdatableModel(100);

    const { findByRole } = render(StrictNumberInput, { props });
    const input = await findByRole('textbox');
    await fireEvent.update(input, 0);

    expect(reference.value).toEqual(undefined);
  });

  test('should preserve original value when attempted input is not valid', async () => {
    const { props, reference } = useUpdatableModel(115);

    const { findByRole } = render(StrictNumberInput, { props });
    const input = await findByRole('textbox');
    await fireEvent.update(input, '115a');

    expect(reference.value).toEqual(115);
  });

  test('should disallow decimal numbers', async () => {
    const { props, reference } = useUpdatableModel(123);

    const { findByRole } = render(StrictNumberInput, { props });
    const input = await findByRole('textbox');
    await fireEvent.update(input, 123.45);

    expect(reference.value).toEqual(123);
    expect(input.value).toEqual('123');
  });

  test('should disallow negative numbers', async () => {
    const { props, reference } = useUpdatableModel(42);

    const { findByRole } = render(StrictNumberInput, { props });
    const input = await findByRole('textbox');
    await fireEvent.update(input, -42);

    expect(reference.value).toEqual(42);
  });
});
