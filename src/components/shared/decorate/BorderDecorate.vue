<script setup>
  import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
  import { computed, inject, ref } from 'vue';
  import { getViewboxForSizing } from './viewbox';

  const config = inject(DECORATE_CONFIG, ref({}));
  const sizing = inject(DECORATE_SIZE, ref({ width: 0, height: 0 }));

  const viewBox = computed(() => getViewboxForSizing(sizing.value));

  const completedConfig = computed(() => ({
    size: 0,
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
    ...config.value,
  }));

  const size = computed(() => completedConfig.value.size);
  const width = computed(() => sizing.value.width);
  const height = computed(() => sizing.value.height);

  const makePoint = (x, y) => `${x},${y}`;

  const cornerPoints = computed(() => {
    const vWidth = width.value;
    const vHeight = height.value;

    return [
      '0,0',
      makePoint(vWidth, 0),
      makePoint(vWidth, vHeight),
      makePoint(0, vHeight),
    ];
  });

  const primePoints = computed(() => {
    const vSize = size.value;
    const vWidth = width.value;
    const vHeight = height.value;

    return [
      makePoint(vSize, vSize),
      makePoint(vWidth - vSize, vSize),
      makePoint(vWidth - vSize, vHeight - vSize),
      makePoint(vSize, vHeight - vSize),
    ];
  });

  const polygons = computed(() => {
    const points = cornerPoints.value;
    const primes = primePoints.value;

    return new Array(4).fill('0').map((_, corner) => {
      const secondCorner = (corner + 1) % points.length;

      const verts = [
        points[corner],
        points[secondCorner],
        primes[secondCorner],
        primes[corner],
      ];

      return verts.join(' ');
    });
  });
</script>

<template>
  <svg v-bind="viewBox">
    <polygon
      v-if="completedConfig.top"
      :fill="completedConfig.top"
      :points="polygons[0]"
    ></polygon>
    <polygon
      v-if="completedConfig.right"
      :fill="completedConfig.right"
      :points="polygons[1]"
    ></polygon>
    <polygon
      v-if="completedConfig.bottom"
      :fill="completedConfig.bottom"
      :points="polygons[2]"
    ></polygon>
    <polygon
      v-if="completedConfig.left"
      :fill="completedConfig.left"
      :points="polygons[3]"
    ></polygon>
  </svg>
</template>
