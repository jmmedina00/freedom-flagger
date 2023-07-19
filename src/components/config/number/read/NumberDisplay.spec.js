import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import NumberDisplay from './NumberDisplay.vue';

describe('NumberDisplay', () => {
  const generate = (number, base) =>
    render(NumberDisplay, {
      props: { base, number },
    });

  test('should display all bytes in base 10 - default', () => {
    const number = [123, 255, 2, 13, 67, 28, 199];

    const { container } = generate(number, 10);
    expect(container.innerText).toEqual('123 255 002 013 067 028 199');
  });

  test.each([
    [
      16,
      [123, 255, 2, 13, 67, 28, 199],
      ['7B', 'FF', '02', '0D', '43', '1C', 'C7'],
    ],
    [8, [56, 88, 4, 13, 228], ['070', '130', '004', '015', '344']],
    [
      2,
      [45, 3, 125, 10, 249],
      ['00101101', '00000011', '01111101', '00001010', '11111001'],
    ],
    [
      23,
      [125, 46, 220, 22, 3, 19, 109, 249],
      ['5A', '20', '9D', '0M', '03', '0J', '4H', 'AJ'],
    ],
  ])('should display in base %d bytes %s', (base, bytes, expectedStrings) => {
    const { container } = generate(bytes, base);
    const expectedText = [...expectedStrings].join(' ');
    expect(container.innerText).toEqual(expectedText);
  });

  test('should default to base 16 when no base is provided', () => {
    const number = [123, 255, 2, 13, 67, 28, 199];
    const expected = '7B FF 02 0D 43 1C C7';

    const { container } = render(NumberDisplay, {
      props: { number },
    });
    expect(container.innerText).toEqual(expected);
  });
});
