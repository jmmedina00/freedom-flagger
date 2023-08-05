import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { useFlagAsPngBlob } from './png-flag';
import { Canvg } from 'canvg';

vi.mock('../helper/size');

describe('Flag conversion to PNG composable', () => {
  const canvas = vi.fn().mockReturnValue({
    getContext: () => ({}),
    convertToBlob: async () => 'converted',
  });

  beforeAll(() => {
    vi.stubGlobal('OffscreenCanvas', canvas); // new Canvas() = Canvas() :)
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test('should provide SVG document from flag directly to Canvg', async () => {
    vi.spyOn(Canvg, 'from').mockResolvedValue({
      render: () => Promise.resolve(),
    });

    const element = document.createElement('div');
    element.innerHTML =
      '<div class="main"><span>Test</span>' +
      '<div><svg foo="bar"><span>Cap this too</span></svg></div></div>';

    const svgBlob = await useFlagAsPngBlob(element, {
      width: 256,
      height: 300,
    });
    expect(svgBlob).toEqual('converted');

    const expectedSvg = '<svg foo="bar"><span>Cap this too</span></svg>';
    const actualSvg = Canvg.from.mock.calls[0][1];
    expect(actualSvg).toEqual(expectedSvg);

    expect(canvas).toHaveBeenCalledWith(256, 300);
  });
});
