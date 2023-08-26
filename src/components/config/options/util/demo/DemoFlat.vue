<script setup>
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { useAppropriateDemoSize } from './size';

  const sizing = useFullStateSize();
  const dimensions = useAppropriateDemoSize(sizing);
</script>

<template>
  <svg :width="dimensions.width" :height="dimensions.height">
    <rect width="100%" height="100%" fill="#808080"></rect>
  </svg>
</template>
