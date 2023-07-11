<script setup>
  import { computed } from 'vue';

  const DIR_VERTICAL = 'vertical';
  const DIR_HORIZONTAL = 'horizontal';
  const SIZE_VERTICAL = 'width';
  const SIZE_HORIZONTAL = 'height';

  const props = defineProps({
    color: { type: String, default: '#000000' },
    index: { type: Number, default: 0 },
    totalColors: { type: Number, default: 10 },
    direction: { type: String, default: DIR_VERTICAL },
  });

  const validDirections = [DIR_VERTICAL, DIR_HORIZONTAL];
  const directionIndex = computed(() =>
    validDirections.findIndex((dir) => dir === props.direction)
  );
  const direction = computed(
    () => validDirections[Math.max(0, directionIndex.value)]
  );

  const getPercentage = (chunk = 0, total = 10) =>
    ((chunk / total) * 100).toString() + '%';

  const size = computed(() => getPercentage(1, props.totalColors));
  const position = computed(() =>
    getPercentage(props.index, props.totalColors)
  );

  const rectParameterPlaces = computed(() =>
    direction.value === DIR_VERTICAL
      ? ['x', SIZE_VERTICAL]
      : ['y', SIZE_HORIZONTAL]
  );

  const attributes = computed(() => {
    const [positionHold, sizeHold] = rectParameterPlaces.value;
    const [toStretch] = [SIZE_HORIZONTAL, SIZE_VERTICAL].filter(
      (sizeProp) => sizeProp !== sizeHold
    );

    return {
      fill: props.color,
      [positionHold]: position.value,
      [sizeHold]: size.value,
      [toStretch]: '100%',
    };
  });
</script>

<template>
  <rect v-bind="attributes"></rect>
</template>
