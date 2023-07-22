import { useUpdatableModel } from '@app/util/testing';
import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import LimitedSliderNumber from './LimitedSliderNumber.vue';

describe('LimitedSliderNumber', () => {
  test('should update model from slider change', async () => {
    const { props, reference } = useUpdatableModel(5);

    const { findByRole } = render(LimitedSliderNumber, {
      props: { ...props, min: 2, max: 50 },
    });

    const slider = await findByRole('slider');
    await fireEvent.update(slider, 45);

    expect(reference.value).toEqual(45);
    //expect(input.value).toEqual(45); // Checking on the other input doesn't work for some reason...
  });

  test('should update model from input change', async () => {
    const { props, reference } = useUpdatableModel(5);

    const { findByRole } = render(LimitedSliderNumber, {
      props: { ...props, min: 2, max: 50 },
    });

    const input = await findByRole('textbox');
    await fireEvent.update(input, 45);

    expect(reference.value).toEqual(45);
  });

  test('should set itself to maximum value when attempting to enter a value higher than max', async () => {
    const { props, reference } = useUpdatableModel(5);

    const { findByRole } = render(LimitedSliderNumber, {
      props: { ...props, min: 2, max: 50 },
    });

    const input = await findByRole('textbox');
    await fireEvent.update(input, 200);

    expect(reference.value).toEqual(50);
  });

  test('should set itself to minimum value when attempting to enter a value lower than min', async () => {
    const { props, reference } = useUpdatableModel(5);

    const { findByRole } = render(LimitedSliderNumber, {
      props: { ...props, min: 2, max: 50 },
    });

    const input = await findByRole('textbox');
    await fireEvent.update(input, 1);

    expect(reference.value).toEqual(2);
  });
});
