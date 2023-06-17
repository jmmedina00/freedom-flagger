<script setup>
  import { computed, ref } from 'vue';
  import { useElementSize } from '@vueuse/core';
  import ExitButton from './ExitButton.vue';
  import FlagDisplay from './FlagDisplay.vue';

  const baseDimensions = { width: 300, height: 200 }; // To fetch from state

  const el = ref(null);
  const { width, height } = useElementSize(el); // TODO: test this?

  const minAppropriateHeight = computed(
    () => (width.value * baseDimensions.height) / baseDimensions.width
  );

  const isHorizontalAdequate = computed(
    () => height.value >= minAppropriateHeight.value
  );

  const displayClass = computed(() => {
    return {
      horizontal: isHorizontalAdequate.value,
      vertical: !isHorizontalAdequate.value,
    };
  });
</script>

<template>
  <div
    class="has-background-link is-flex is-flex-grow-1 is-align-items-center is-justify-content-center anchor"
    ref="el"
  >
    <FlagDisplay :class="displayClass" />
    <ExitButton class="overlay" />
  </div>
</template>

<style scoped>
  .anchor {
    position: relative;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
  }

  .horizontal {
    width: 100%;
    height: auto;
  }

  .vertical {
    height: 100%;
    width: auto;
  }
</style>
