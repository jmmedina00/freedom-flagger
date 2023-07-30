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
  POSITION_SELECTED,
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
        },
      },
    });

  test('should display model byte as base equivalent', () => {
    const { props } = useUpdatableModel(75);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');

    const values = [...nibbles].map((div) => div.querySelector('input').value);
    expect(values).toEqual(['4', 'B']);
  });

  test('should display model byte with as many possible digits in given base', () => {
    const { props } = useUpdatableModel(98);

    const { container } = generate({ ...props, base: 10 });
    const nibbles = container.querySelectorAll('.nibble');

    const values = [...nibbles].map((div) => div.querySelector('input').value);
    expect(values).toEqual(['0', '9', '8']);
  });

  test('should change whole number when a nibble is touched', async () => {
    const { reference, props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('input');

    await fireEvent.keyDown(input, { key: '5' });
    expect(reference.value).toEqual(0x5b);

    const values = [...nibbles].map((div) => div.querySelector('input').value);
    expect(values).toEqual(['5', 'B']);
  });

  test('should admit letters as nibbles higher than 9', async () => {
    const { reference, props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[1].querySelector('input');

    await fireEvent.keyDown(input, { key: 'd' });
    expect(reference.value).toEqual(0x4d);

    const values = [...nibbles].map((div) => div.querySelector('input').value);
    expect(values).toEqual(['4', 'D']);
  });

  test('should not admit letters outside base range', async () => {
    const { reference, props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('input');

    await fireEvent.keyDown(input, { key: 'K' });
    expect(reference.value).toEqual(0x4b);

    const values = [...nibbles].map((div) => div.querySelector('input').value);
    expect(values).toEqual(['4', 'B']);
  });

  test('should not admit special keys', async () => {
    const { reference, props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('input');

    await fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(reference.value).toEqual(0x4b);

    const values = [...nibbles].map((div) => div.querySelector('input').value);
    expect(values).toEqual(['4', 'B']);
  });

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

  test('should have disabled up arrow when reaching base max', () => {
    const { props } = useUpdatableModel(0o107);

    const { container } = generate({ ...props, base: 8 });
    const nibbles = container.querySelectorAll('.nibble');
    const upArrow = nibbles[2].querySelector('.keyboard_arrow_up');

    expect(upArrow.disabled).toBeTruthy();
  });

  test('should have disabled down arrow when reaching 0', () => {
    const { props } = useUpdatableModel(0o107);

    const { container } = generate({ ...props, base: 8 });
    const nibbles = container.querySelectorAll('.nibble');
    const downArrow = nibbles[1].querySelector('.keyboard_arrow_down');

    expect(downArrow.disabled).toBeTruthy();
  });

  test('should limit itself to 0xFF', async () => {
    const { reference, props } = useUpdatableModel(0o321);

    const { container } = generate({ ...props, base: 8 });
    const nibbles = container.querySelectorAll('.nibble');
    const upArrow = nibbles[0].querySelector('input');

    await fireEvent.keyDown(upArrow, { key: '5' }); // Would result in 0o521 => 337 > 255 (0xff)
    expect(reference.value).toEqual(0xff);

    const values = [...nibbles].map((div) => div.querySelector('input').value);
    expect(values).toEqual(['3', '7', '7']);
  });

  test('should focus first nibble when getting it communicated', () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 16 }, outsideCommand);
    const nibbles = container.querySelectorAll('.nibble');

    outsideCommand.value = FOCUS_START;
    expect(nibbles[0].querySelector('.focused')).toBeTruthy();
  });

  test('should focus last nibble when getting it communicated', () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 8 }, outsideCommand);
    const nibbles = container.querySelectorAll('.nibble');

    outsideCommand.value = FOCUS_END;
    expect(nibbles[2].querySelector('.focused')).toBeTruthy();
  });

  test('should announce when any of the nibbles has been focused', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 16 }, outsideCommand);

    const nibble = container.querySelector('.nibble');
    await fireEvent.focus(nibble.querySelector('input'));
    expect(outsideCommand.value).toEqual(POSITION_SELECTED);
  });

  test('should move focus from nibble to nibble as byte is written with keyboard', async () => {
    const { props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('input');

    await fireEvent.keyDown(input, { key: 'd' });
    expect(nibbles[1].querySelector('input')).toBeTruthy();
  });

  test('should announce when the last nibble has been advanced from', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 16 }, outsideCommand);
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[1].querySelector('input');

    await fireEvent.focus(input);
    await fireEvent.keyDown(input, { key: 'd' });
    expect(outsideCommand.value).toEqual(POSITION_ADVANCE);
  });

  test('should announce when the first nibble gets position jumped back from', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 16 }, outsideCommand);
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('input');

    await fireEvent.focus(input);
    await fireEvent.keyDown(input, { key: 'ArrowLeft' });
    expect(outsideCommand.value).toEqual(POSITION_BACK);
  });

  test('should move nibble value up and down with arrow keys', async () => {
    const { reference, props } = useUpdatableModel(0x4b);

    const { container } = generate({ ...props, base: 16 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[0].querySelector('input');

    await fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(reference.value).toEqual(0x5b);

    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(reference.value).toEqual(0x4b);
  });

  test('should limit arrow keys the same as arrow buttons', async () => {
    const { reference, props } = useUpdatableModel(0b10);

    const { container } = generate({ ...props, base: 2 });
    const nibbles = container.querySelectorAll('.nibble');
    const input = nibbles[7].querySelector('input');

    await fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(reference.value).toEqual(0b11);
    await fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(reference.value).toEqual(0b11);
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(reference.value).toEqual(0b10);
    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(reference.value).toEqual(0b10);
  });

  test('should move position forward with arrow key', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 8 }, outsideCommand);
    const nibbles = container.querySelectorAll('.nibble');

    await fireEvent.keyDown(nibbles[1].querySelector('input'), {
      key: 'ArrowRight',
    });
    expect(nibbles[2].querySelector('.focused')).toBeTruthy();
  });

  test('should move position backward with arrow key', async () => {
    const { props } = useUpdatableModel(0x4b);
    const outsideCommand = ref(null);

    const { container } = generate({ ...props, base: 8 }, outsideCommand);
    const nibbles = container.querySelectorAll('.nibble');

    await fireEvent.keyDown(nibbles[1].querySelector('input'), {
      key: 'ArrowLeft',
    });
    expect(nibbles[0].querySelector('.focused')).toBeTruthy();
  });
});
