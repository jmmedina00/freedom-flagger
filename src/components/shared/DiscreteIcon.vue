<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    icon: String,
  });

  const isOriginalIcon = computed(() => {
    const icon = props.icon || '';
    return icon.includes('/') || icon.includes('.');
  });

  const style = computed(() => ({
    mask: `url(${props.icon})`,
    'mask-size': 'contain',
  }));
</script>

<template>
  <span class="icon">
    <span class="original" v-if="isOriginalIcon" :style="style"></span>
    <span class="material-icons" v-else>{{ icon }}</span>
  </span>
</template>

<style>
  .icon .original {
    width: 24px;
    height: 24px;
    background: currentColor;
  }

  .icon.clickable:hover {
    color: gray;
    cursor: pointer;
  }
</style>
