<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    name: String,
    color: { type: String, default: 'primary' },
  });

  const mainClasses = computed(() => [
    'is-flex',
    'is-justify-content-space-between',
    `has-background-${props.color}`,
    `has-text-${props.color}-dark`,
    'px-4',
    'py-3',
  ]);
</script>

<template>
  <div :class="mainClasses">
    <h3 class="has-text-light m-0">{{ name }}</h3>
    <div class="button-collection is-flex is-align-items-center">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
  .icon.clickable:hover {
    color: white;
  }

  .button-collection {
    gap: 1em;
  }
</style>
