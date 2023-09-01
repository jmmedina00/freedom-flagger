import StandardFlagRenderer from '@app/components/render/flag/StandardFlagRenderer.vue';
import InfiniteDecorate from '../decorate/InfiniteDecorate.vue';
import MosaicDecorate from '../decorate/MosaicDecorate.vue';
import ShapeSeriesDecorate from '../decorate/ShapeSeriesDecorate.vue';
import CircleShape from '../shape/CircleShape.vue';
import SquareShape from '../shape/SquareShape.vue';
import RhombusShape from '../shape/RhombusShape.vue';
import PentagonShape from '../shape/PentagonShape.vue';
import HexagonShape from '../shape/HexagonShape.vue';
import StarShape from '../shape/StarShape.vue';
import DividedFlagRenderer from '@app/components/render/flag/DividedFlagRenderer.vue';
import DecoratedFlagRenderer from '@app/components/render/flag/DecoratedFlagRenderer.vue';

export const RENDERER_STANDARD = 'standard';
export const RENDERER_DIVIDED = 'divided';
export const RENDERER_DECORATE = 'decorated';

export const DECORATE_MOSAIC = 'mosaic';
export const DECORATE_INFINITE = 'infinite';
export const DECORATE_SHAPE = 'shape';

export const SHAPE_CIRCLE = 'circle';
export const SHAPE_SQUARE = 'square';
export const SHAPE_RHOMBUS = 'rhombus';
export const SHAPE_PENTAGON = 'pentagon';
export const SHAPE_HEXAGON = 'hexagon';
export const SHAPE_STAR = 'star';

export const RENDERERS = {
  [RENDERER_STANDARD]: StandardFlagRenderer,
  [RENDERER_DIVIDED]: DividedFlagRenderer,
  [RENDERER_DECORATE]: DecoratedFlagRenderer,
};

export const RENDERER_ICONS = {
  [RENDERER_STANDARD]: 'icons/render-standard.svg',
  [RENDERER_DIVIDED]: 'icons/render-divided.svg',
  [RENDERER_DECORATE]: 'icons/render-decorated.svg',
};

export const DECORATE_COMPONENTS = {
  [DECORATE_MOSAIC]: MosaicDecorate,
  [DECORATE_INFINITE]: InfiniteDecorate,
  [DECORATE_SHAPE]: ShapeSeriesDecorate,
};

export const SHAPE_COMPONENTS = {
  [SHAPE_CIRCLE]: CircleShape,
  [SHAPE_SQUARE]: SquareShape,
  [SHAPE_RHOMBUS]: RhombusShape,
  [SHAPE_PENTAGON]: PentagonShape,
  [SHAPE_HEXAGON]: HexagonShape,
  [SHAPE_STAR]: StarShape,
};
