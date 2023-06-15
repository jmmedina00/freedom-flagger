<script setup>
  import FlagDisplay from './FlagDisplay.vue';
</script>

<template>
  <div class="has-background-link is-flex is-flex-grow-1 is-align-items-center">
    <FlagDisplay class="full" />
  </div>
</template>

<style scoped>
  .full {
    width: 100%;
    height: auto;
  }
</style>
