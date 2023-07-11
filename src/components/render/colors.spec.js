import { describe, test } from 'vitest';
import { createApp, ref } from 'vue';
import { useNumberAsColors } from './colors';
import { NUMBER_BYTES } from '@app/state';

describe('Color composable', () => {
  test('should provide number bytes merged into RGB hexadecimal colors', () => {
    let reference;
    const number = ref([
      0, 15, 81, 56, 86, 159, 93, 50, 171, 109, 195, 96, 71, 142, 55, 17, 201,
      243,
    ]);

    const app = createApp({
      setup: () => {
        reference = useNumberAsColors();
        return () => {};
      },
    });

    app.provide(NUMBER_BYTES, number);
    app.mount(document.createElement('div'));

    const { colors, remainder } = reference;
    expect(colors.value).toEqual([
      '#000f51',
      '#38569f',
      '#5d32ab',
      '#6dc360',
      '#478e37',
      '#11c9f3',
    ]);
    expect(remainder.value).toEqual([]);

    app.unmount();
  });

  test('should cut off remainder bytes missing a color to a separate computed', () => {
    let reference;
    const number = ref([
      31, 151, 228, 110, 124, 43, 86, 116, 108, 181, 233, 226, 33, 48, 35, 253,
      176, 216, 111, 166, 196, 56,
    ]);

    const app = createApp({
      setup: () => {
        reference = useNumberAsColors();
        return () => {};
      },
    });

    app.provide(NUMBER_BYTES, number);
    app.mount(document.createElement('div'));

    const { colors, remainder } = reference;
    expect(colors.value).toEqual([
      '#1f97e4',
      '#6e7c2b',
      '#56746c',
      '#b5e9e2',
      '#213023',
      '#fdb0d8',
      '#6fa6c4',
    ]);
    expect(remainder.value).toEqual([56]);

    app.unmount();
  });
});
