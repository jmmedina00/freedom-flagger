<script setup>
  import { computed } from 'vue';

  const props = defineProps(['size', 'x', 'y']);

  const side = computed(() => props.size * 2);
  const x = computed(() => props.x - props.size);
  const y = computed(() => props.y - props.size);
</script>

<template>
  <rect :height="side" :width="side" :x="x" :y="y"></rect>
</template>
