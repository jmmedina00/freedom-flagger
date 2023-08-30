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

    const corners = directions.map((pointers) =>
      pointers.map((p, index) => (p > 0 ? 0 : maxes[index]))
    );

    const primes = directions.map((pointers) =>
      pointers.map((p, index) => (p > 0 ? size : maxes[index] - size))
    );

    return borderDirections
      .map((direction, corner) => {
        const secondCorner = (corner + 1) % corners.length;
        const stretchedCoord = corner % 2; // 0 -> X, 1 -> Y

        const verts = [
          corners[corner],
          corners[secondCorner],
          primes[secondCorner],
          primes[corner],
        ];

        return {
          points: verts
            .map((coords, pointIndex) => {
              const stretchDirection = [0, verts.length - 1].includes(
                pointIndex
              )
                ? -1
                : 1;

              const finalized = coords.map((c, dimensionIndex) =>
                dimensionIndex !== stretchedCoord
                  ? c
                  : c +
                    0.5 *
                      (directions[corner][dimensionIndex] * stretchDirection)
              );
              return makePoint(...finalized);
            })
            .join(' '),
          fill: colors[direction],
        };
      })
      .filter(({ fill }) => !!fill);
  });
</script>

<template>
  <svg v-bind="viewBox">
    <polygon v-for="poly in polygons" v-bind="poly"></polygon>
  </svg>
</template>
