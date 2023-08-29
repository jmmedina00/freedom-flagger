import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import NumberSummary from './NumberSummary.vue';
import { inject, ref } from 'vue';
import { NUMBER_BYTES } from '@app/state';
import { CURRENT_POSITION } from '../state';

describe('NumberSummary', () => {
  const generate = (number) => {
    let position;

    const rendered = render(NumberSummary, {
      global: {
        provide: { [NUMBER_BYTES]: number },
        stubs: {
          NumberEditor: {
            props: ['position', 'base'],
            setup: () => {
              position = inject(CURRENT_POSITION);
            },
            template:
              '<span @click="$emit(\'delete\')">Position: {{ position }}</span>',
          },
          IconButton: {
            template: '<button>Icon</button>',
          },
          TabPicker: {
            props: ['values', 'modelValue'],
            emits: ['update:modelValue'],
            template: `<span>Base: {{ modelValue }}</span><p v-for="[value, label] in values">
            <label :for="value" v-bind="$attrs">{{ label }}</label>
            <input name="test" type="radio" :id="value" :value="value" :checked="value === modelValue"
            @change="$emit(\'update:modelValue\', value)"/>
            </p>`,
          },
        },
      },
    });

    return { rendered, position };
  };

  test('should display all bytes via the number editor', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      rendered: { findByText },
    } = generate(number);

    const expectedPositions = [0, 1, 2, 3, 4, 5].map(
      (pos) => 'Position: ' + pos
    );

    for (const text of expectedPositions) {
      const element = await findByText(text);
      expect(element).toBeTruthy();
    }
  });

  test('should react appropriately to a byte being deleted and refresh the component', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      rendered: { findByText },
    } = generate(number);
    const kept = await findByText('Position: 1');
    await fireEvent.click(await findByText('Position: 2'));

    expect(number.value).toEqual([145, 200, 99, 11, 22]);
    expect(kept.isConnected).toBeFalsy();
  });

  test('should add a new byte into the number', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      rendered: { findByText },
    } = generate(number);
    await fireEvent.click(await findByText('Icon'));

    expect(number.value).toEqual([145, 200, 56, 99, 11, 22, 0]);
  });

  test('should provide a current position as "nothing selected"', () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      rendered: { findByText },
      position,
    } = generate(number);

    expect(position.value).toEqual(-1);
  });

  test('should keep position in place if still existing after a deletion', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      rendered: { findByText },
      position,
    } = generate(number);
    position.value = 2;

    await fireEvent.click(await findByText('Position: 2'));
    expect(position.value).toEqual(2);
  });

  test('should move position back to last number if deletion causes position to stop existing', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      rendered: { findByText },
      position,
    } = generate(number);
    position.value = 5;

    await fireEvent.click(await findByText('Position: 2')); // Delete an item
    expect(position.value).toEqual(4);
  });

  test('should add new number if position advances to number array length', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      position,
      rendered: { findByText },
    } = generate(number);
    position.value = 6;

    await findByText('Position: 2'); // Delay assertion just long enough

    expect(number.value).toEqual([145, 200, 56, 99, 11, 22, 0]);
  });

  test('should allow to change display base', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const {
      rendered: { findByText, findByLabelText },
    } = generate(number);

    const baseText = await findByText('Base: 16');

    const binButton = await findByLabelText('number.bin');
    await fireEvent.click(binButton);
    expect(baseText.innerText).toEqual('Base: 2');

    const decButton = await findByLabelText('number.dec');
    await fireEvent.click(decButton);
    expect(baseText.innerText).toEqual('Base: 10');
  });
});
