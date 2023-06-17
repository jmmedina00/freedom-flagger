<script setup>
  import { inject } from 'vue';
  import { FULL_FLAG_DISPLAY } from '../../../state';
  import DiscreteIcon from '../../shared/DiscreteIcon.vue';

  const fullFlagDisplay = inject(FULL_FLAG_DISPLAY);

  const enterFlagDisplay = () => {
    fullFlagDisplay.value = true;
  };
</script>

<template>
  <div>
    <button class="button is-white" @click="enterFlagDisplay">
      <DiscreteIcon icon="icons/flag-stripes.svg" />
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
