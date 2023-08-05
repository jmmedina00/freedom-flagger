import { afterAll, describe, expect, test, vi } from 'vitest';
import { useExportToClipboard } from './clipboard';
import { useFlagAsPngBlob } from '@app/components/render/export/png-flag';

vi.mock('@app/components/render/export/png-flag');

describe('Export to clipboard composable', () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test('should fetch PNG contents and write them to clipboard', async () => {
    useFlagAsPngBlob.mockResolvedValue({ content: 'foo', type: 'image/png' });

    const item = vi.fn();
    const write = vi.fn();

    const clipboard = { write };
    const navigator = { clipboard };

    vi.stubGlobal('navigator', navigator);
    vi.stubGlobal('ClipboardItem', item);

    const element = document.createElement('div');
    await useExportToClipboard(element, { width: 256, height: 300 });

    expect(useFlagAsPngBlob).toHaveBeenCalledWith(element, {
      width: 256,
      height: 300,
    });
    expect(item).toHaveBeenCalledWith({
      'image/png': { content: 'foo', type: 'image/png' },
    });
    expect(write).toHaveBeenCalledWith([expect.anything()]);
  });
});
