<script setup>
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { DECORATE_SIZE } from '@app/state';
  import { provide } from 'vue';
  import { useAppropriateDemoSize } from './size';

  const props = defineProps(['component']);
  const sizing = useFullStateSize();
  const dimensions = useAppropriateDemoSize(sizing);

  provide(DECORATE_SIZE, dimensions);
</script>

<template>
  <svg :width="dimensions.width" :height="dimensions.height">
    <rect width="100%" height="100%" fill="#808080"></rect>
    <component v-if="component" :is="component"></component>
  </svg>
</template>
