<script setup>
  import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
  import { computed, inject, ref } from 'vue';
  import { directions } from './corner';
  import { getViewboxForSizing } from './viewbox';

  const config = inject(DECORATE_CONFIG, ref({}));
  const sizing = inject(DECORATE_SIZE, ref({ width: 0, height: 0 }));

  const viewBox = computed(() => getViewboxForSizing(sizing.value));

  const completedConfig = computed(() => ({
    size: 0,
    topLeft: undefined,
    topRight: undefined,
    bottomRight: undefined,
    bottomLeft: undefined,
    ...config.value,
  }));

  const makePoint = (x, y) => `${x},${y}`;

  const triangles = computed(() => {
    const { width, height } = sizing.value;
    const { size, topLeft, topRight, bottomRight, bottomLeft } =
      completedConfig.value;

    return [topLeft, topRight, bottomRight, bottomLeft]
      .map((fill, index) => {
        const [multiX, multiY] = directions[index];

        const baseX = multiX === 1 ? 0 : width;
        const baseY = multiY === 1 ? 0 : height;

        const corner = makePoint(baseX, baseY);
        const horizontalVert = makePoint(Math.abs(baseX - size), baseY);
        const verticalVert = makePoint(baseX, Math.abs(baseY - size));

        return {
          fill,
          points: [corner, horizontalVert, verticalVert].join(' '),
        };
      })
      .filter(({ fill }) => !!fill);
  });
</script>

<template>
  <svg v-bind="viewBox">
    <polygon v-for="triangle in triangles" v-bind="triangle"></polygon>
  </svg>
</template>
