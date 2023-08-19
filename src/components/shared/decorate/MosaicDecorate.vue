<script setup>
  import { DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
  import { computed, inject, ref } from 'vue';
  import { getViewboxForSizing } from './viewbox';

  const config = inject(DECORATE_CONFIG, ref({}));
  const sizing = inject(DECORATE_SIZE, ref({ width: 0, height: 0 }));

  const viewBox = computed(() => getViewboxForSizing(sizing.value));

  const completedConfig = computed(() => ({
    colors: ['#000000', '#ffffff'],
    squareRows: 25,
    rows: 2,
    offset: 1,
    ...config.value,
  }));

  const getColor = (index) => {
    const { colors } = completedConfig.value;
    return colors[index % colors.length];
  };

  const squaresPerRow = computed(() => completedConfig.value.squareRows);

  const direction = computed(() => {
    const { width, height } = sizing.value;
    return width < height ? 'vertical' : 'horizontal';
  });

  const largestDimension = computed(
    () => sizing.value[direction.value === 'vertical' ? 'height' : 'width']
  );
  const smallestDimension = computed(
    () => sizing.value[direction.value === 'vertical' ? 'width' : 'height']
  );

  const squareSize = computed(
    () => largestDimension.value / squaresPerRow.value
  );

  const rowOffsets = computed(() => {
    const { rows, offset } = completedConfig.value;

    const upperRows = new Array(rows).fill('0').map((_, index) => ({
      position: index * squareSize.value,
      offset: index * offset,
    }));

    const lowerRows = new Array(rows).fill('0').map((_, index) => ({
      offset: index * offset,
      position: smallestDimension.value - (rows - index) * squareSize.value,
    }));

    return [...upperRows, ...lowerRows];
  });

  const rectParameters = computed(() =>
    rowOffsets.value.flatMap(({ position, offset }) => {
      const [dynamic, fixed] =
        direction.value === 'horizontal' ? ['x', 'y'] : ['y', 'x'];

      return new Array(squaresPerRow.value).fill('0').map((_, index) => ({
        width: squareSize.value,
        height: squareSize.value,
        [dynamic]: index * squareSize.value,
        [fixed]: position,
        fill: getColor(index + offset),
      }));
    })
  );
</script>
<template>
  <svg v-bind="viewBox">
    <rect v-for="params in rectParameters" v-bind="params"></rect>
  </svg>
</template>
