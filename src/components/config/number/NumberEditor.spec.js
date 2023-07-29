import { fireEvent, render } from '@testing-library/vue';
import { describe, expect } from 'vitest';
import { ref } from 'vue';
import NumberEditor from './NumberEditor.vue';
import { NUMBER_BYTES } from '@app/state';

describe('NumberEditor', () => {
  const generate = (injectedNumber, position) =>
    render(NumberEditor, {
      global: {
        provide: { [NUMBER_BYTES]: injectedNumber },
        stubs: {
          ByteModifier: {
            props: ['base', 'modelValue'],
            emits: ['update:modelValue'],
            template:
              '<input type="number" min="0" max="255" :value="modelValue" @input="$emit(\'update:modelValue\', parseInt($event.target.value))" />',
          },
        },
      },
      props: { position },
    });

  test('should display interesting byte within input', () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const { container } = generate(injectedNumber, 3);

    const input = container.querySelector('input');
    expect(input.value).toEqual(180);
  });

  test('should modify interesting byte by changing input value', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const { container } = generate(injectedNumber, 1);

    const byteInput = container.querySelector('input');
    await fireEvent.update(byteInput, 6);
    expect(injectedNumber.value).toEqual([123, 6, 250, 180, 125]);
  });

  test('should fire delete event', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);

    const { findByRole, emitted } = generate(injectedNumber, 1);

    const deleteButton = await findByRole('button');
    await fireEvent.click(deleteButton);

    expect(emitted()['delete']).toBeTruthy();
  });
});
