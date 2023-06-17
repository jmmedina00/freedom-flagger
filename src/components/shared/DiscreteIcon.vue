<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    icon: String,
  });

  const isOriginalIcon = computed(() => {
    const icon = props.icon || '';
    return icon.includes('/') || icon.includes('.');
  });
</script>

<template>
  <span class="icon">
    <img :src="icon" v-if="isOriginalIcon" />
    <span class="material-icons" v-else>{{ icon }}</span>
  </span>
</template>
