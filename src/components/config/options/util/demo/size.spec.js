import { describe, expect, test } from 'vitest';
import { useAppropriateDemoSize } from './size';
import { ref } from 'vue';

describe('Demo size composable', () => {
  test('should scale horizontal size to 200 x (Y < 200)', () => {
    const size = ref({ width: 500, height: 300 });
    const scaled = useAppropriateDemoSize(size);

    expect(scaled.value).toEqual({ width: 200, height: 120 });
  });

  test('should scale vertical size to (X < 200) by 200', () => {
    const size = ref({ width: 400, height: 1000 });
    const scaled = useAppropriateDemoSize(size);

    expect(scaled.value).toEqual({ width: 80, height: 200 });
  });

  test('should scale square size to 200 x 200', () => {
    const size = ref({ width: 555, height: 555 });
    const scaled = useAppropriateDemoSize(size);

    expect(scaled.value).toEqual({ width: 200, height: 200 });
  });
});
