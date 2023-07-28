<script setup>
  import { computed, ref } from 'vue';
  import { useNumberAsColors } from './helper/colors';
  import { useFullStateSize } from './helper/size';
  import StandardFlagRenderer from './flag/StandardFlagRenderer.vue';
  import { useSomeConfig } from '../config/options/plugin';
  import { CONFIG_MAX_COLUMNS } from '@app/state';

  const { colors, remainder } = useNumberAsColors();

  const watchedColors = ref(colors);
  const dimensions = useFullStateSize();

  const direction = computed(() =>
    dimensions.value.width >= dimensions.value.height
      ? 'vertical'
      : 'horizontal'
  );

  const getDirection = () => direction;

  const maxColumns = useSomeConfig(CONFIG_MAX_COLUMNS, 12);

  const portions = computed(() => {
    const length = watchedColors.value.length;
    const divideBy = maxColumns.value;
    const hexColors = [...watchedColors.value];

    if (!divideBy || divideBy >= length) {
      return [hexColors];
    }

    const numberPortions = Math.ceil(length / divideBy);

    const limits = new Array(numberPortions)
      .fill(2)
      .map((foo, index) => index * maxColumns.value);

    return limits.map((limit, index) => {
      const slicer =
        index === limits.length - 1 ? [limit] : [limit, limits[index + 1]];

      return hexColors.slice(...slicer);
    });
  });

  const getPortions = () => portions;
</script>

<template>
  <svg
    version="1.1"
    :width="dimensions.width"
    :height="dimensions.height"
    xmlns="http://www.w3.org/2000/svg"
  >
    <StandardFlagRenderer
      :portions="getPortions()"
      :direction="getDirection()"
    />

    <text x="20" y="20">{{ remainder.join(', ') }}</text>
  </svg>
</template>
