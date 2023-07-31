import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import { inject, ref } from 'vue';
import NumberEditor from './NumberEditor.vue';
import {
  CURRENT_POSITION,
  FOCUS_END,
  FOCUS_START,
  OUTSIDE_COMMAND,
  POSITION_ADVANCE,
  POSITION_BACK,
  POSITION_SELECTED,
} from './state';
import { NUMBER_BYTES } from '@app/state';

describe('NumberEditor', () => {
  const generate = (providers, props) => {
    const provide = {
      [CURRENT_POSITION]: ref(props.position || 0),
      ...providers,
    };
    let command;

    const rendered = render(NumberEditor, {
      global: {
        provide,
        stubs: {
          ByteModifier: {
            props: ['base', 'modelValue'],
            emits: ['update:modelValue'],
            setup: () => {
              command = inject(OUTSIDE_COMMAND, ref(null));
            },
            template:
              '<input type="number" min="0" max="255" :value="modelValue" @input="$emit(\'update:modelValue\', parseInt($event.target.value))" />',
          },
        },
      },
      props,
    });

    return { rendered, command };
  };

  test('should display interesting byte within input', () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const {
      rendered: { container },
    } = generate({ [NUMBER_BYTES]: injectedNumber }, { position: 3 });

    const input = container.querySelector('input');
    expect(input.value).toEqual(180);
  });

  test('should modify interesting byte by changing input value', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const {
      rendered: { container },
    } = generate({ [NUMBER_BYTES]: injectedNumber }, { position: 1 });

    const byteInput = container.querySelector('input');
    await fireEvent.update(byteInput, 6);
    expect(injectedNumber.value).toEqual([123, 6, 250, 180, 125]);
  });

  test('should fire delete event', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);

    const {
      rendered: { findByRole, emitted },
    } = generate({ [NUMBER_BYTES]: injectedNumber }, { position: 1 });

    const deleteButton = await findByRole('button');
    await fireEvent.click(deleteButton);

    expect(emitted()['delete']).toBeTruthy();
  });

  test("should set current position to itself when byte announces it's focused", async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const position = ref(2);

    const {
      command,
      rendered: { findByRole },
    } = generate(
      { [NUMBER_BYTES]: injectedNumber, [CURRENT_POSITION]: position },
      { position: 3 }
    );

    command.value = POSITION_SELECTED;

    await findByRole('button'); // Delay assertions

    expect(position.value).toEqual(3);
    expect(command.value).toEqual(POSITION_SELECTED);
  });

  test('should advance current position when told so by byte', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const position = ref(3);

    const {
      command,
      rendered: { findByRole },
    } = generate(
      { [NUMBER_BYTES]: injectedNumber, [CURRENT_POSITION]: position },
      { position: 3 }
    );

    command.value = POSITION_ADVANCE;

    await findByRole('button'); // Delay assertions

    expect(position.value).toEqual(4);
  });

  test('should take current position back when told so by byte', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const position = ref(3);

    const {
      command,
      rendered: { findByRole },
    } = generate(
      { [NUMBER_BYTES]: injectedNumber, [CURRENT_POSITION]: position },
      { position: 3 }
    );

    command.value = POSITION_BACK;

    await findByRole('button'); // Delay assertions
    expect(position.value).toEqual(2);
  });

  test('should tell byte to focus by start when previous byte is done', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const position = ref(2);

    const {
      command,
      rendered: { findByRole },
    } = generate(
      { [NUMBER_BYTES]: injectedNumber, [CURRENT_POSITION]: position },
      { position: 3 }
    );

    position.value = 3;

    await findByRole('button'); // Delay assertions
    expect(command.value).toEqual(FOCUS_START);
  });

  test('should tell byte to focus by end when next byte is rolled back', async () => {
    const injectedNumber = ref([123, 45, 250, 180, 125]);
    const position = ref(4);

    const {
      command,
      rendered: { findByRole },
    } = generate(
      { [NUMBER_BYTES]: injectedNumber, [CURRENT_POSITION]: position },
      { position: 3 }
    );

    position.value = 3;

    await findByRole('button'); // Delay assertions
    expect(command.value).toEqual(FOCUS_END);
  });
});
