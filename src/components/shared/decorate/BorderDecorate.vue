<script setup>
  import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
  import { computed, inject, ref } from 'vue';
  import { getViewboxForSizing } from './viewbox';
  import { directions } from './corner';

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

  const makePoint = (x, y) => `${x},${y}`;

  const polygons = computed(() => {
    const borderDirections = ['top', 'right', 'bottom', 'left'];
    const { size, ...colors } = completedConfig.value;
    const { width, height } = sizing.value;
    const maxes = [width, height];

    const corners = directions.map((pointers) => {
      const params = pointers.map((p, index) => (p > 0 ? 0 : maxes[index]));
      return makePoint(...params);
    });

    const primes = directions.map((pointers) => {
      const params = pointers.map((p, index) =>
        p > 0 ? size : maxes[index] - size
      );
      return makePoint(...params);
    });

    return borderDirections
      .map((direction, corner) => {
        const secondCorner = (corner + 1) % corners.length;

        const verts = [
          corners[corner],
          corners[secondCorner],
          primes[secondCorner],
          primes[corner],
        ];

        return { points: verts.join(' '), fill: colors[direction] };
      })
      .filter(({ fill }) => !!fill);
  });
</script>

<template>
  <svg v-bind="viewBox">
    <polygon v-for="poly in polygons" v-bind="poly"></polygon>
  </svg>
</template>
