<script setup>
  import {
    DECORATE_SHAPE,
    SHAPE_CIRCLE,
    SHAPE_COMPONENTS,
    SHAPE_HEXAGON,
    SHAPE_PENTAGON,
    SHAPE_RHOMBUS,
    SHAPE_SQUARE,
    SHAPE_STAR,
  } from '@app/components/shared/constant/rendering';
  import { useDefaultedConfig } from './common/default';
  import IconOption from '../util/icon/IconOption.vue';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';

  const SHAPES = Object.keys(SHAPE_COMPONENTS);
  const SHAPE_ICONS = {
    [SHAPE_CIRCLE]: 'lens',
    [SHAPE_SQUARE]: 'square',
    [SHAPE_RHOMBUS]: 'icons/rhombus.svg',
    [SHAPE_PENTAGON]: 'pentagon',
    [SHAPE_HEXAGON]: 'hexagon',
    [SHAPE_STAR]: 'star',
  };

  const config = useDefaultedConfig(
    DECORATE_SHAPE,
    {
      size: 10,
      component: SHAPE_CIRCLE,
    },
    { proportional: ['size'], adapted: [] }
  );
</script>

<template>
  <p class="is-flex is-align-items-center">
    <span class="mr-2">{{ $t('common.size') }}</span>
    <LimitedSliderNumber :min="1" :max="50" v-model="config.size" />
  </p>
  <h6>{{ $t('options.corner') }}</h6>
  <p class="flexi-paragraph">
    <IconOption
      v-for="shape in SHAPES"
      :id="shape"
      :value="shape"
      :label="'shape.' + shape"
      :icon="SHAPE_ICONS[shape]"
      v-model="config.component"
      class="mr-3"
    />
    <span class="ml-3 is-align-self-center has-text-weight-bold">
      {{ $t('shape.' + config.component) }}
    </span>
  </p>
</template>
