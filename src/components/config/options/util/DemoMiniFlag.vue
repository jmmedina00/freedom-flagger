<script setup>
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { DECORATE_SIZE } from '@app/state';
  import { computed, provide } from 'vue';

  const MAX_DIMENSION = 200;
  const getProportion = (a1 = 1, b1 = 0) => (b1 * MAX_DIMENSION) / a1;

  const props = defineProps(['component']);
  const sizing = useFullStateSize();

  const dimensions = computed(() => {
    const { width, height } = sizing.value;

    return {
      width: Math.min(MAX_DIMENSION, getProportion(height, width)),
      height: Math.min(MAX_DIMENSION, getProportion(width, height)),
    };
  });

  provide(DECORATE_SIZE, dimensions);
</script>

<template>
  <svg :width="dimensions.width" :height="dimensions.height">
    <rect width="100%" height="100%" fill="#808080"></rect>
    <component v-if="component" :is="component"></component>
  </svg>
</template>
