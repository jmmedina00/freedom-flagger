import { describe, expect, test } from 'vitest';
import { ref } from 'vue';
import { useCalculatedSizes } from './sizing';

describe('Sizing composable', () => {
  test('should return width and height as-is if both are defined', () => {
    const size = ref({
      width: 300,
      height: 400,
      aspectRatio: { x: 3, y: 2 },
    });

    const calculated = useCalculatedSizes(size);
    expect(calculated.value).toEqual({ width: 300, height: 400 });
  });

  test('should update according to its base ref', () => {
    const size = ref({
      width: 300,
      height: 400,
      aspectRatio: { x: 3, y: 2 },
    });

    const calculated = useCalculatedSizes(size);
    expect(calculated.value).toEqual({ width: 300, height: 400 });

    size.value = {
      width: 500,
      height: 400,
      aspectRatio: { x: 3, y: 2 },
    };

    expect(calculated.value).toEqual({ width: 500, height: 400 });
  });

  test('should calculate width according to provided height and proportions', () => {
    const size = ref({
      width: 300,
      height: undefined,
      aspectRatio: { x: 3, y: 2 },
    });

    const calculated = useCalculatedSizes(size);
    expect(calculated.value).toEqual({ width: 300, height: 200 });
  });

  test('should calculate height according to provided width and proportions', () => {
    const size = ref({
      width: undefined,
      height: 300,
      aspectRatio: { x: 3, y: 2 },
    });

    const calculated = useCalculatedSizes(size);
    expect(calculated.value).toEqual({ width: 450, height: 300 });
  });

  test('should remove decimal places, no rounding to be made', () => {
    const size = ref({
      width: 300,
      height: undefined,
      aspectRatio: { x: 16, y: 9 },
    });

    const calculated = useCalculatedSizes(size);
    expect(calculated.value).toEqual({ width: 300, height: 168 }); // actual height = 168.75
  });
});
