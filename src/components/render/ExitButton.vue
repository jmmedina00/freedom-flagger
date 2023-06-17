<script setup>
  import { inject } from 'vue';
  import { FULL_FLAG_DISPLAY } from '../../state';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);

  const exitFlagDisplay = () => {
    fullFlagDisplay.value = false;
  };
</script>

<template>
  <button
    class="fullscreen-only"
    v-if="fullFlagDisplay"
    @click="exitFlagDisplay"
  >
    {{ $t('exit') }}
  </button>
</template>

<style scoped>
  .full-display .fullscreen-only {
    display: block !important;
  }
</style>
