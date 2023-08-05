import { useFlagAsPngBlob } from '@app/components/render/export/png-flag';

export const useDownloadFlag = async (
  element = document.createElement('div'),
  name = 'flag',
  size
) => {
  const pngFlag = await useFlagAsPngBlob(element, size);
  const url = URL.createObjectURL(pngFlag);

  const link = (element.ownerDocument || element).createElement('a'); // Aids with testing
  link.href = url;
  link.download = `${name}.png`;
  link.rel = 'opener';

  link.click();
  URL.revokeObjectURL(url);
};
