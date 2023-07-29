import { useUpdatableModel } from '@app/util/testing';
import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import ByteModifier from './ByteModifier.vue';

describe('ByteModifier', () => {
  const generate = (props) =>
    render(ByteModifier, {
      props,
      global: {
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
});
