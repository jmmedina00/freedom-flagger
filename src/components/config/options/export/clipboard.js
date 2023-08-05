import { useFlagAsPngBlob } from '@app/components/render/export/png-flag';

export const useExportToClipboard = async (
  element = document.createElement('div'),
  size
) => {
  const pngFlag = await useFlagAsPngBlob(element, size);
  const clipboardData = [new ClipboardItem({ [pngFlag.type]: pngFlag })];
  await navigator.clipboard.write(clipboardData);
};
