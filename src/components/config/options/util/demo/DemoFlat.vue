<script setup>
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { useAppropriateDemoSize } from './size';
  import { COLOR_BG_PRIMARY } from './color';

  const sizing = useFullStateSize();
  const dimensions = useAppropriateDemoSize(sizing);
</script>

<template>
  <svg :width="dimensions.width" :height="dimensions.height">
    <rect width="100%" height="100%" :fill="COLOR_BG_PRIMARY"></rect>
  </svg>
</template>
