<script setup>
  import { computed, inject, ref } from 'vue';
  import { getViewboxForSizing } from './viewbox';
  import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';

  const config = inject(DECORATE_CONFIG, ref({}));
  const sizing = inject(DECORATE_SIZE, ref({ width: 0, height: 0 }));

  const completedConfig = computed(() => ({
    margin: 20,
    size: 20,
    bytes: [0],
    ...config.value,
  }));

  const viewBox = computed(() => getViewboxForSizing(sizing.value));

  const textParameters = computed(() => {
    const { margin } = completedConfig.value;
    const { width, height } = sizing.value;

    return {
      x: width - margin,
      y: height - margin,
    };
  });

  const displayedText = computed(() => {
    const { bytes } = completedConfig.value;

    return bytes.length > 0
      ? '+ ' +
          completedConfig.value.bytes
            .map((x) => x.toString(16).padStart(2, '0').toUpperCase())
            .join(' ')
      : '';
  });

  const fontSize = computed(() => {
    const { size } = completedConfig.value;
    return `${size}px`;
  });
</script>

<template>
  <svg v-bind="viewBox">
    <defs></defs>

    <text
      text-anchor="end"
      font-family="'JetBrains Mono', monospace"
      :font-size="fontSize"
      v-bind="textParameters"
    >
      {{ displayedText }}
    </text>
  </svg>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono&family=Roboto:wght@400;700;900&display=swap');
</style>
