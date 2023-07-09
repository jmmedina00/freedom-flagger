import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import NumberSummary from './NumberSummary.vue';
import { ref } from 'vue';
import { NUMBER_BYTES } from '@app/state';

describe('NumberSummary', () => {
  const generate = (number) =>
    render(NumberSummary, {
      global: {
        provide: { [NUMBER_BYTES]: number },
        stubs: {
          NumberEditor: {
            props: ['position'],
            template:
              '<span @click="$emit(\'delete\')">Position: {{ position }}</span>',
          },
          IconButton: {
            template: '<button>Icon</button>',
          },
        },
      },
    });

  test('should display all bytes via the number editor', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const { findByText } = generate(number);

    const expectedPositions = [0, 1, 2, 3, 4, 5].map(
      (pos) => 'Position: ' + pos
    );

    for (const text of expectedPositions) {
      const element = await findByText(text);
      expect(element).toBeTruthy();
    }
  });

  test('should react appropriately to a byte being deleted', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const { findByText } = generate(number);
    await fireEvent.click(await findByText('Position: 2'));

    expect(number.value).toEqual([145, 200, 99, 11, 22]);
  });

  test('should add a new byte into the number', async () => {
    const number = ref([145, 200, 56, 99, 11, 22]);

    const { findByText } = generate(number);
    await fireEvent.click(await findByText('Icon'));

    expect(number.value).toEqual([145, 200, 56, 99, 11, 22, 0]);
  });
});
