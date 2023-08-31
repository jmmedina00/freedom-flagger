<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    icon: String,
    size: {
      type: Number,
      default: 24,
    },
  });

  const isOriginalIcon = computed(() => {
    const icon = props.icon || '';
    return icon.includes('/') || icon.includes('.');
  });

  const style = computed(() => ({
    mask: `url(${props.icon})`,
    'mask-image': `url(${props.icon})`,
    'mask-size': 'contain',
  })); // Can't shove it in the styles unfortunately

  const pxSize = computed(() => props.size + 'px');
</script>

<template>
  <span class="icon">
    <span class="original" v-if="isOriginalIcon" :style="style"></span>
    <span class="material-icons" v-else>{{ icon }}</span>
  </span>
</template>

<style scoped>
  .icon {
    user-select: none;

    width: v-bind('pxSize');
    height: v-bind('pxSize');
  }

  .icon .material-icons {
    font-size: v-bind('pxSize');
  }

  .icon .original {
    width: v-bind('pxSize') !important;
    height: v-bind('pxSize') !important;

    background: currentColor;
    flex-shrink: 0;
  }

  .icon.clickable:hover {
    color: gray !important;
    cursor: pointer;
  }
</style>
