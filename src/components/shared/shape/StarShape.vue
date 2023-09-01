<script setup>
  import { computed } from 'vue';
  import { getOriginPointsForPolygon } from './polygon';

  const props = defineProps(['size', 'x', 'y']);

  const points = computed(() =>
    getOriginPointsForPolygon(5, props.size)
      .map((_, index, list) => list[(index * 2) % list.length])
      .map(([x, y]) => `${x + props.x},${y + props.y}`)
      .join(' ')
  );
</script>

<template>
  <polygon :points="points"></polygon>
</template>
