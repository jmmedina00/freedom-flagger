import { useFlagAsPngBlob } from '@app/components/render/export/png-flag';
import { afterAll, describe, expect, test, vi } from 'vitest';
import { useDownloadFlag } from './download';

vi.mock('@app/components/render/export/png-flag');

describe('Download flag composable', () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test('should do it with a link, the old-style way, with provided download name', async () => {
    useFlagAsPngBlob.mockResolvedValue({ content: 'foo', type: 'image/png' });

    const create = vi.fn().mockReturnValue('link');
    const revoke = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke });

    const click = vi.fn();
    const contents = { click };
    const element = document.createElement('div');
    vi.spyOn(document, 'createElement').mockReturnValue(contents);

    await useDownloadFlag(element, 'bandera', {
      width: 256,
      height: 300,
    });

    expect(useFlagAsPngBlob).toHaveBeenCalledWith(element, {
      width: 256,
      height: 300,
    });

    expect(create).toHaveBeenCalledWith({ content: 'foo', type: 'image/png' });
    expect(revoke).toHaveBeenCalledWith('link');

    expect(click).toHaveBeenCalledOnce();
    expect(contents).toEqual({
      click,
      href: 'link',
      download: 'bandera.png',
      rel: 'opener',
    });
  });
});
