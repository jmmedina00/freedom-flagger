import { useUpdatableModel } from '@app/util/testing';
import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import ByteModifier from './ByteModifier.vue';
import { ref } from 'vue';
import {
  FOCUS_END,
  FOCUS_START,
  OUTSIDE_COMMAND,
  POSITION_ADVANCE,
  POSITION_BACK,
} from '../state';

describe('ByteModifier', () => {
  const generate = (props, outsideCommand = ref(null)) =>
    render(ByteModifier, {
      props,
      global: {
        provide: {
          [OUTSIDE_COMMAND]: outsideCommand,
        },
        stubs: {
          IconButton: {
            props: ['icon'],
            template: '<button :class="icon">button</button>',
          },
          NibbleHolder: {
            props: ['modelValue', 'admittedChars', 'position', 'currentNibble'],
            emits: ['update:modelValue'],
            setup: ({ currentNibble, position }) => {
              const nibble = ref(currentNibble);

              const previous = () => {
                nibble.value = -1;
              };

              const next = () => {
                nibble.value = 0xff; // Guaranteed to always go beyond posible index
              };

              const focus = () => {
                nibble.value = position;
              };

              return { previous, next, focus, currentNibble };
            },
            template:
              '<div class="holder">' +
              '<input type="text" :value="modelValue"' +
              ' @input="$emit(\'update:modelValue\', $event.target.value)" @focus="focus"/>' +
              '<span class="chars">{{ admittedChars }}</span>' +
              '<span class="currentIndex">{{ currentNibble }}</span>' +
              '<button @click="previous">Previous</button>' +
              ' <button @click="next">Next</button>' +
              '</div>',
          },
        },
      },
    });

  test('should display model byte as base equivalent', () => {
    const { props } = useUpdatableModel(75);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');

    const values = [...nibbles].map(
      (div) => div.querySelector('.holder input').value
    );
    expect(values).toEqual(['4', 'B']);
  });

  test('should display model byte with as many possible digits in given base', () => {
    const { props } = useUpdatableModel(98);

    const { container } = generate({ ...props, base: 10 });
    const nibbles = container.querySelectorAll('.nibble');

    const values = [...nibbles].map(
      (div) => div.querySelector('.holder input').value
    );
    expect(values).toEqual(['0', '9', '8']);
  });

  test('should change whole number when a nibble is touched', async () => {
    const { reference, props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('input');

    await fireEvent.update(input, '5');
    expect(reference.value).toEqual(0x5b);

    const values = [...nibbles].map(
      (div) => div.querySelector('.holder input').value
    );
    expect(values).toEqual(['5', 'B']);
  });

  test.each([
    [2, '01'],
    [8, '01234567'],
    [16, '0123456789ABCDEF'],
  ])(
    'should provide full valid range of chars for base %d to nibble holder',
    (base, admittedChars) => {
      const { props } = useUpdatableModel(0x4b);

      const { container } = generate({ ...props, base });
      const chars = container.querySelector('.nibble .holder .chars');
      expect(chars.innerText).toEqual(admittedChars);
    }
  );

  test('should have arrows per nibble that allow to modify nibble', async () => {
    const { reference, props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const upArrow = nibbles[0].querySelector('.keyboard_arrow_up');
    const downArrow = nibbles[0].querySelector('.keyboard_arrow_down');

    await fireEvent.click(upArrow);
    expect(reference.value).toEqual(0x5b);

    await fireEvent.click(downArrow);
    expect(reference.value).toEqual(0x4b);
  });

  test('should make arrows roll over start and end of charset', async () => {
    const { props, reference } = useUpdatableModel(0o107);

    const { container } = generate({ ...props, base: 8 });
    const nibbles = container.querySelectorAll('.nibble');
    const upArrow = nibbles[2].querySelector('.keyboard_arrow_up');
    const downArrow = nibbles[2].querySelector('.keyboard_arrow_down');

    await fireEvent.click(upArrow);
    expect(reference.value).toEqual(0o100);

    await fireEvent.click(downArrow);
    expect(reference.value).toEqual(0o107);
  });

  test('should limit itself to 0xFF', async () => {
    const { reference, props } = useUpdatableModel(0o321);

    const { container } = generate({ ...props, base: 8 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('.holder input');

    await fireEvent.update(input, '5'); // Would result in 0o521 => 337 > 255 (0xff)
    expect(reference.value).toEqual(0xff);

    //const values = [...nibbles].map((div) => div.querySelector('input').value);
    //expect(values).toEqual(['3', '7', '7']);
  });

  test('should focus first nibble when getting it communicated', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 16 }, outsideCommand);
    const nibbles = container.querySelector('.nibble .holder .currentIndex');

    outsideCommand.value = FOCUS_START;

    await Promise.resolve(); // Induce delay
    expect(nibbles.innerText).toEqual('0');
  });

  test('should focus last nibble when getting it communicated', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 8 }, outsideCommand);
    const nibbles = container.querySelector('.nibble .holder .currentIndex');

    outsideCommand.value = FOCUS_END;

    await Promise.resolve(); // Induce delay
    expect(nibbles.innerText).toEqual('2');
  });

  test('should announce when the last nibble has been advanced from', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { findAllByText } = generate({ ...props, base: 16 }, outsideCommand);

    const button = (await findAllByText('Next'))[0];
    await fireEvent.click(button);

    expect(outsideCommand.value).toEqual(POSITION_ADVANCE);
  });

  test('should announce when the first nibble gets position jumped back from', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container, findAllByText } = generate(
      { ...props, base: 16 },
      outsideCommand
    );

    const input = container
      .querySelectorAll('.nibble')[1]
      .querySelector('.holder input');
    const button = (await findAllByText('Previous'))[0];
    await fireEvent.focus(input); // Need to make the current nibble defined before backtrack fires
    await fireEvent.click(button);

    expect(outsideCommand.value).toEqual(POSITION_BACK);
  });
});
