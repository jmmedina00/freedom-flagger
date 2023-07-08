import { fireEvent, render } from '@testing-library/vue';
import { describe, expect } from 'vitest';
import { ref } from 'vue';
import NumberEditor from './NumberEditor.vue';
import { NUMBER_BYTES } from '@app/state';

describe('NumberEditor', () => {
  test('should display interesting byte within input', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);

    const { findByDisplayValue } = render(NumberEditor, {
      global: { provide: { [NUMBER_BYTES]: injectedNumber } },
      props: { position: 3 },
    });

    const byteInput = await findByDisplayValue('180');
    expect(byteInput).toBeTruthy();
  });

  test('should modify interesting byte by changing input value', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);

    const { findByDisplayValue } = render(NumberEditor, {
      global: { provide: { [NUMBER_BYTES]: injectedNumber } },
      props: { position: 1 },
    });

    const byteInput = await findByDisplayValue('45');
    // https://vuejs.org/guide/components/v-model.html
    await fireEvent.update(byteInput, 6);
    expect(injectedNumber.value).toEqual([123, 6, 250, 180, 125]);
  });

  test('should fire delete event', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);

    const { findByRole, emitted } = render(NumberEditor, {
      global: { provide: { [NUMBER_BYTES]: injectedNumber } },
      props: { position: 1 },
    });

    const deleteButton = await findByRole('button');
    await fireEvent.click(deleteButton);

    expect(emitted()['delete']).toBeTruthy();
  });
});
