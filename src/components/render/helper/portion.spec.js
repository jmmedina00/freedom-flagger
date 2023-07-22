import { describe, expect, test } from 'vitest';
import { usePortionSizeAndPosition } from './portion';
import { ref } from 'vue';

describe('Portion sizing composable', () => {
  test('should provide size as 1 divided by "total" percent', () => {
    const { size } = usePortionSizeAndPosition(ref({ index: 3, total: 7 }));
    expect(size.value).toEqual(((1 / 7) * 100).toString() + '%');
  });

  test('should provide position as "index" by "total" percent', () => {
    const { position } = usePortionSizeAndPosition(ref({ index: 3, total: 7 }));
    expect(position.value).toEqual(((3 / 7) * 100).toString() + '%');
  });

  test('should provide 0% if "index" is 0', () => {
    const { position } = usePortionSizeAndPosition(ref({ index: 0, total: 7 }));
    expect(position.value).toEqual('0%');
  });
});
