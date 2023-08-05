import { Canvg, presets } from 'canvg';

const preset = presets.offscreen();

export const useFlagAsPngBlob = async (
  element = document.createElement('div'),
  { width = 0, height = 0 }
) => {
  const svg = element.querySelector('.main div svg');

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const v = await Canvg.from(ctx, svg.outerHTML, preset);
  await v.render();

  return canvas.convertToBlob();
};
