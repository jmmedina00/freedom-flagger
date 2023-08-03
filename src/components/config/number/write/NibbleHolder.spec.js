import { useUpdatableModel } from '@app/util/testing';
import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import NibbleHolder from './NibbleHolder.vue';
import { useFocus } from '@vueuse/core';

vi.mock('@vueuse/core');

describe('NibbleHolder', () => {
  test('should set current nibble to itself when focused', async () => {
    const focused = ref(false);
    useFocus.mockReturnValue({ focused });

    const { props } = useUpdatableModel('A');
    const admittedChars = 'ABC';
    const position = 3;
    const currentNibble = ref(4);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    focused.value = true;
    await Promise.resolve(); // Induced delay

    expect(currentNibble.value).toEqual(3);
  });

  test('should focus itself when current nibble matches its own position', async () => {
    const focused = ref(false);
    useFocus.mockReturnValue({ focused });

    const { props } = useUpdatableModel('A');
    const admittedChars = 'ABC';
    const position = 3;
    const currentNibble = ref(4);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });
    currentNibble.value = 3;

    await Promise.resolve();
    expect(focused.value).toBeTruthy();
  });

  test("should blur itself when current nibble doesn't match itself", async () => {
    const focused = ref(false);
    useFocus.mockReturnValue({ focused });

    const { props } = useUpdatableModel('A');
    const admittedChars = 'ABC';
    const position = 3;
    const currentNibble = ref(4);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    currentNibble.value = 3;
    await Promise.resolve();
    currentNibble.value = 2;
    await Promise.resolve();

    expect(focused.value).toBeFalsy();
  });

  test('should update model to admitted char to uppercase on keydown and advance current nibble', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('A');
    const admittedChars = 'aBc';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');

    await fireEvent.keyDown(input, { key: 'b' });
    expect(reference.value).toEqual('B');
    expect(input.value).toEqual('B');
    expect(currentNibble.value).toEqual(4);

    await fireEvent.keyDown(input, { key: 'C' });
    expect(reference.value).toEqual('C');
    expect(input.value).toEqual('C');
    expect(currentNibble.value).toEqual(4);
  });

  test('should not update model to unadmitted char on keydown', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('A');
    const admittedChars = 'aBc';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');

    await fireEvent.keyDown(input, { key: 'P' });
    expect(reference.value).toEqual('A');
    expect(input.value).toEqual('A');
    expect(currentNibble.value).toEqual(3);
  });

  test('should not update model on foreign special keys', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('C');
    const admittedChars = 'aBc';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');

    await fireEvent.keyDown(input, {
      key: 'Enter',
      code: 'Enter',
      charCode: 13,
    });
    expect(reference.value).toEqual('C');
    expect(input.value).toEqual('C');
    expect(currentNibble.value).toEqual(3);
  });

  test('should update model to next char on up arrow key', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('A');
    const admittedChars = 'aBc';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');

    await fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(reference.value).toEqual('B');
    expect(input.value).toEqual('B');
  });

  test('should roll model back to first char on up arrow key', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('4');
    const admittedChars = '01234';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');

    await fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(reference.value).toEqual('0');
    expect(input.value).toEqual('0');
  });

  test('should update model to previous char on down arrow key', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('B');
    const admittedChars = 'aBc';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');

    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(reference.value).toEqual('A');
    expect(input.value).toEqual('A');
  });

  test('should roll model forward to last char on down arrow key', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('0');
    const admittedChars = '01234';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');

    await fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(reference.value).toEqual('4');
    expect(input.value).toEqual('4');
  });

  test('should move current nibble forward on right arrow key', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props } = useUpdatableModel('A');
    const admittedChars = 'ABC';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');
    await fireEvent.keyDown(input, { key: 'ArrowRight' });

    expect(currentNibble.value).toEqual(4);
  });

  test('should move current nibble backward on left arrow key', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props } = useUpdatableModel('C');
    const admittedChars = 'ABC';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');
    await fireEvent.keyDown(input, { key: 'ArrowLeft' });

    expect(currentNibble.value).toEqual(2);
  });

  test('should "zero out" current nibble and take the position back one step', async () => {
    const focused = ref(true);
    useFocus.mockReturnValue({ focused });

    const { props, reference } = useUpdatableModel('C');
    const admittedChars = 'ABC';
    const position = 3;
    const currentNibble = ref(3);

    const { container } = render(NibbleHolder, {
      props: { ...props, admittedChars, position, currentNibble },
    });

    const input = container.querySelector('input');
    await fireEvent.keyDown(input, { key: 'Backspace' });

    expect(reference.value).toEqual('A'); // First admitted char is considered "0"
    expect(currentNibble.value).toEqual(2);
  });
});
