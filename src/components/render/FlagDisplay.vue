<script setup>
  import { computed, provide, ref } from 'vue';
  import { useNumberAsColors } from './helper/colors';
  import { useFullStateSize } from './helper/size';
  import { useSomeConfig } from '../config/options/plugin';
  import {
    CONFIG_RENDERING,
    DECORATE_SIZE,
    RENDER_BASICS,
    RENDER_PARAMS,
  } from '@app/state';
  import TinyWatermark from './TinyWatermark.vue';
  import RemainderHandler from './flag/RemainderHandler.vue';
  import { RENDERERS, RENDERER_STANDARD } from '../shared/constant/rendering';
  import { getViewboxForSizing } from '../shared/decorate/viewbox';

  const { colors, remainder } = useNumberAsColors();

  const watchedColors = ref(colors);
  const dimensions = useFullStateSize();
  provide(DECORATE_SIZE, dimensions);

  const direction = computed(() =>
    dimensions.value.width >= dimensions.value.height
      ? 'vertical'
      : 'horizontal'
  );

  const renderingConfig = useSomeConfig(
    CONFIG_RENDERING,
    ref({
      columnsLimited: false,
      columnsMax: 12,
      renderer: RENDERER_STANDARD,
      params: {},
    })
  );

  const component = computed(() => RENDERERS[renderingConfig.value.renderer]);

  const portions = computed(() => {
    const length = watchedColors.value.length;
    const { columnsLimited, columnsMax } = renderingConfig.value;
    const hexColors = [...watchedColors.value];

    if (!columnsLimited || columnsMax >= length) {
      return [hexColors];
    }

    const numberPortions = Math.ceil(length / columnsMax);

    const limits = new Array(numberPortions)
      .fill(2)
      .map((foo, index) => index * columnsMax);

    return limits.map((limit, index) => {
      const slicer =
        index === limits.length - 1 ? [limit] : [limit, limits[index + 1]];

      return hexColors.slice(...slicer);
    });
  });

  const viewBox = computed(() => getViewboxForSizing(dimensions.value).viewBox);

  provide(RENDER_BASICS, { direction, portions });
  provide(
    RENDER_PARAMS,
    computed(() => ({ ...renderingConfig.value.params }))
  );
</script>

<template>
  <svg
    version="1.1"
    :width="dimensions.width"
    :height="dimensions.height"
    :viewBox="viewBox"
    xmlns="http://www.w3.org/2000/svg"
  >
    <component :is="component" />
    <RemainderHandler v-if="remainder.length > 0" :bytes="remainder" />
    <TinyWatermark path="watermark.svg" fill-opacity="0.5" proportion="0.3" />
  </svg>
</template>
