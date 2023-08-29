import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import NumberCarousel from './NumberCarousel.vue';
import { ref } from 'vue';
import { NUMBER_BYTES } from '@app/state';

describe('NumberCarousel', () => {
  test('should be able to alternate between hex, decimal and binary display', async () => {
    const number = ref([0, 1, 2]);

    const { findByLabelText, findByText } = render(NumberCarousel, {
      global: {
        mocks: { $t: (foo) => foo },
        stubs: {
          NumberDisplay: {
            props: ['base', 'number'],
            template:
              '<span>Base {{ base }}, number {{ number.value.toString() }}</span>',
          },
          TabPicker: {
            props: ['values', 'modelValue'],
            emits: ['update:modelValue'],
            template: `<p v-for="[value, label] in values">
            <label :for="value" v-bind="$attrs">{{ label }}</label>
            <input name="test" type="radio" :id="value" :value="value" :checked="value === modelValue"
            @change="$emit(\'update:modelValue\', value)"/>
            </p>`,
          },
        },
        provide: {
          [NUMBER_BYTES]: number,
        },
      },
    });

    const hex = await findByLabelText('number.hex');
    const oct = await findByLabelText('number.oct');
    const dec = await findByLabelText('number.dec');
    expect(hex.checked).toBeTruthy();
    expect(oct.checked).toBeFalsy();
    expect(dec.checked).toBeFalsy();

    expect(await findByText('Base 16, number 0,1,2')).toBeTruthy();

    await fireEvent.click(oct);
    expect(hex.checked).toBeFalsy();
    expect(dec.checked).toBeFalsy();

    number.value = [1, 2, 3];
    expect(await findByText('Base 8, number 1,2,3')).toBeTruthy();

    await fireEvent.click(dec);
    expect(hex.checked).toBeFalsy();
    expect(oct.checked).toBeFalsy();

    number.value = [2, 4, 6];
    expect(await findByText('Base 10, number 2,4,6')).toBeTruthy();
  });
});
