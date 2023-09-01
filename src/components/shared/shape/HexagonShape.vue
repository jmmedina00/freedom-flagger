<script setup>
  import { computed } from 'vue';
  import { getOriginPointsForPolygon } from './polygon';

  const props = defineProps(['size', 'x', 'y']);

  const points = computed(() =>
    getOriginPointsForPolygon(6, props.size, 90)
      .map(([x, y]) => `${x + props.x},${y + props.y}`)
      .join(' ')
  );
</script>

<template>
  <polygon :points="points"></polygon>
</template>
