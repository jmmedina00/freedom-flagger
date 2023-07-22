<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    name: String,
    color: String,
  });

  const isColorAvailable = computed(() => !!props.color);

  const mainClasses = computed(() => {
    const baseClasses = [
      'is-flex',
      'is-justify-content-space-between',
      'px-4',
      'py-3',
    ];

    const additionalClasses = isColorAvailable.value
      ? [`has-background-${props.color}`, `has-text-${props.color}-dark`]
      : [];

    return [...baseClasses, ...additionalClasses];
  });
</script>

<template>
  <div :class="mainClasses">
    <h3 class="m-0" :class="isColorAvailable ? ['has-text-light'] : []">
      {{ $t(name) }}
    </h3>
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
