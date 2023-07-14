<script setup>
  import DiscreteIcon from './DiscreteIcon.vue';

  const props = defineProps({
    icon: {
      type: String,
    },
    size: { type: Number, default: 24 },
  });
</script>

<template>
  <button class="invisible">
    <DiscreteIcon class="clickable" :icon="icon" :size="size" />
  </button>
</template>

<style scoped>
  .invisible {
    padding: 0;
    background: none;
    border: none;
    color: inherit;

    line-height: 1;
  }
</style>
