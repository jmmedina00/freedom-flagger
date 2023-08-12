<script setup>
  import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
  import { computed, inject, ref } from 'vue';

  const config = inject(DECORATE_CONFIG, ref({}));
  const sizing = inject(DECORATE_SIZE, ref({ width: 0, height: 0 }));

  const completedConfig = computed(() => ({
    size: 0,
    colors: [''],
    component: '',
    ...config.value,
  }));

  const stats = computed(() => {
    const { width, height } = sizing.value;
    return {
      max: Math.max(width, height),
      min: Math.min(width, height),
      isVertical: width < height,
    };
  });

  const shapeAttributes = computed(() => {
    const { max, min, isVertical } = stats.value;
    const { colors, size } = completedConfig.value;

    const [moving, stable] = isVertical ? ['y', 'x'] : ['x', 'y'];

    const centerChunk = max / (colors.length + 1);
    const stablePosition = min / 2;

    return colors.map((fill, index) => ({
      fill,
      size,
      [moving]: centerChunk * (index + 1),
      [stable]: stablePosition,
    }));
  });
</script>

<template>
  <svg :width="sizing.width" :height="sizing.height">
    <component
      :is="completedConfig.component"
      v-for="attrs in shapeAttributes"
      v-bind="attrs"
    />
  </svg>
</template>
