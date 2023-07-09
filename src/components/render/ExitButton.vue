<script setup>
  import { inject } from 'vue';
  import { FULL_FLAG_DISPLAY } from '@app/state';
  import IconButton from '../shared/IconButton.vue';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);

  const exitFlagDisplay = () => {
    fullFlagDisplay.value = false;
  };
</script>

<template>
  <IconButton
    icon="close"
    v-if="fullFlagDisplay"
    class="fullscreen-only has-text-grey-lighter"
    @click="exitFlagDisplay"
  />
</template>

<style scoped>
  .full-display .fullscreen-only {
    display: block !important;
  }
</style>
