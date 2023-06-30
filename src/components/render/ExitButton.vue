<script setup>
  import { inject } from 'vue';
  import { FULL_FLAG_DISPLAY } from '@app/state';
  import DiscreteIcon from '../shared/DiscreteIcon.vue';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);

  const exitFlagDisplay = () => {
    fullFlagDisplay.value = false;
  };
</script>

<template>
  <button
    class="fullscreen-only button"
    v-if="fullFlagDisplay"
    @click="exitFlagDisplay"
  >
    <DiscreteIcon icon="close" />
  </button>
</template>

<style scoped>
  .full-display .fullscreen-only {
    display: block !important;
  }
</style>
