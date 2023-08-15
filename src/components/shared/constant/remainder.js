import BorderDecorate from '../decorate/BorderDecorate.vue';
import CornerTriangleDecorate from '../decorate/CornerTriangleDecorate.vue';
import MosaicDecorate from '../decorate/MosaicDecorate.vue';

export const REM_MOSAIC = 'mosaic';
export const REM_BORDER = 'border';
export const REM_TRIANGLE = 'triangle';

export const REMAINDER_COMPONENTS = {
  [REM_MOSAIC]: MosaicDecorate,
  [REM_TRIANGLE]: CornerTriangleDecorate,
  [REM_BORDER]: BorderDecorate,
};

export const REMAINDER_ICONS = {
  mosaic: 'auto_awesome_mosaic',
  triangle: 'rounded_corner',
  border: 'border_style',
};
