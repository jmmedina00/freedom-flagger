<script setup>
  import DiscreteIcon from './DiscreteIcon.vue';

  const props = defineProps(['icon']);
</script>

<template>
  <button class="invisible">
    <DiscreteIcon class="clickable" :icon="icon" />
  </button>
</template>

<style scoped>
  .invisible {
    padding: 0;
    background: none;
    border: none;
    color: inherit;

    line-height: 1;
    height: 24px;
  }
</style>
