import InfiniteDecorate from '../decorate/InfiniteDecorate.vue';
import MosaicDecorate from '../decorate/MosaicDecorate.vue';
import ShapeSeriesDecorate from '../decorate/ShapeSeriesDecorate.vue';
import CircleShape from '../shape/CircleShape.vue';
import SquareShape from '../shape/SquareShape.vue';

export const RENDERER_STANDARD = 'standard';
export const RENDERER_DIVIDED = 'divided';
export const RENDERER_DECORATE = 'decorated';

export const DECORATE_MOSAIC = 'mosaic';
export const DECORATE_INFINITE = 'infinite';
export const DECORATE_SHAPE = 'shape';

export const SHAPE_CIRCLE = 'circle';
export const SHAPE_SQUARE = 'square';

export const DECORATE_COMPONENTS = {
  [DECORATE_MOSAIC]: MosaicDecorate,
  [DECORATE_INFINITE]: InfiniteDecorate,
  [DECORATE_SHAPE]: ShapeSeriesDecorate,
};

export const SHAPE_COMPONENTS = {
  [SHAPE_CIRCLE]: CircleShape,
  [SHAPE_SQUARE]: SquareShape,
};
