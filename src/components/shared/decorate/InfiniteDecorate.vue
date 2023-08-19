<script setup>
  import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
  import { computed, inject, ref } from 'vue';
  import { TOP_LEFT, directions } from './corner';
  import { getViewboxForSizing } from './viewbox';

  const config = inject(DECORATE_CONFIG, ref({}));
  const sizing = inject(DECORATE_SIZE, ref({ width: 0, height: 0 }));

  const viewBox = computed(() => getViewboxForSizing(sizing.value));

  const completedConfig = computed(() => ({
    size: 0,
    colors: [''],
    corner: TOP_LEFT,
    ...config.value,
  }));

  const rectAttributes = computed(() => {
    const { size, colors, corner } = completedConfig.value;

    const [multiX, multiY] = directions[corner];

    return colors.map((fill, index) => {
      const multiplier = colors.length - index;
      const multipledSize = size * multiplier;
      const percentSize = multipledSize + '%';

      return {
        fill,
        width: percentSize,
        height: percentSize,
        x: multiX === 1 ? '0%' : `${100 - multipledSize}%`,
        y: multiY === 1 ? '0%' : `${100 - multipledSize}%`,
      };
    });
  });
</script>

<template>
  <svg v-bind="viewBox">
    <rect v-for="attrs in rectAttributes" v-bind="attrs"></rect>
  </svg>
</template>
