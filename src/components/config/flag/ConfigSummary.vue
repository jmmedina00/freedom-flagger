<script setup>
  import { inject } from 'vue';
  import { FULL_FLAG_DISPLAY } from '../../../state';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);

  const enterFlagDisplay = () => {
    fullFlagDisplay.value = true;
  };
</script>

<template>
  <div>
    <button class="button is-white" @click="enterFlagDisplay">
      <span class="icon">
        <span class="material-icons">face</span>
      </span>
      <span>Test</span>
    </button>
  </div>
</template>

<style scoped>
  .button {
    width: 100%;
    padding: 2em 0;
  }
</style>
