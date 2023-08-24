<script setup>
  import {
    DECORATE_SHAPE,
    SHAPE_CIRCLE,
    SHAPE_COMPONENTS,
    SHAPE_SQUARE,
  } from '@app/components/shared/constant/rendering';
  import { useDefaultedConfig } from './common/default';
  import IconOption from '../util/icon/IconOption.vue';
  import LimitedSliderNumber from '../util/numeric/LimitedSliderNumber.vue';

  const SHAPES = Object.keys(SHAPE_COMPONENTS);
  const SHAPE_ICONS = {
    [SHAPE_CIRCLE]: 'lens',
    [SHAPE_SQUARE]: 'square',
  };

  const config = useDefaultedConfig(
    DECORATE_SHAPE,
    {
      size: 10,
      component: SHAPE_CIRCLE,
    },
    { proportional: [], adapted: [] }
  );
</script>

<template>
  <p>
    <span>{{ $t('common.size') }}</span>
    <LimitedSliderNumber :min="1" :max="50" v-model="config.size" />
  </p>
  <h6>{{ $t('options.corner') }}</h6>
  <p>
    <IconOption
      v-for="shape in SHAPES"
      :id="shape"
      :value="shape"
      :label="'shape.' + shape"
      :icon="SHAPE_ICONS[shape]"
      v-model="config.component"
    />
  </p>
</template>
