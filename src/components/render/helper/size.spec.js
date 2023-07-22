import { describe, expect, vi } from 'vitest';
import { ref } from 'vue';
import { useSomeConfig } from '@app/components/config/options/plugin';
import { useCalculatedSizes } from '@app/components/shared/sizing';
import { useFullStateSize } from './size';
import { CONFIG_SIZING } from '@app/state';

vi.mock('@app/components/config/options/plugin');
vi.mock('@app/components/shared/sizing');

describe('State sizing composable', () => {
  test('should provide sizing calculation on state sizing config', () => {
    const config = ref({
      width: 400,
      aspectRatio: { x: 3, y: 2 },
    });

    const dimensions = ref({ width: 400, height: 250 });

    useSomeConfig.mockReturnValue(config);
    useCalculatedSizes.mockReturnValue(dimensions);

    const foo = useFullStateSize();
    expect(foo.value).toEqual({ width: 400, height: 250 });

    expect(useSomeConfig).toHaveBeenCalledWith(CONFIG_SIZING);
    expect(useCalculatedSizes).toHaveBeenCalledWith(config);
  });
});
