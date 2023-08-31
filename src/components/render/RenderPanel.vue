<script setup>
  import { computed, ref } from 'vue';
  import { useElementSize } from '@vueuse/core';
  import ExitButton from './ExitButton.vue';
  import FlagDisplay from './FlagDisplay.vue';
  import { useFullStateSize } from './helper/size';
  import { useCalculatedSizes } from '../shared/sizing';
  import { useDarkAlternate } from '@app/util/dark';

  const dimensions = useFullStateSize();

  const el = ref(null);
  const { width, height } = useElementSize(el);

  const assembledDimensionQuery = computed(() => ({
    width: width.value,
    aspectRatio: {
      x: dimensions.value.width,
      y: dimensions.value.height,
    },
  }));

  const fullDimensions = useCalculatedSizes(assembledDimensionQuery);

  const isHorizontalAdequate = computed(
    () => height.value >= fullDimensions.value.height
  );

  const displayClass = computed(() => {
    return {
      horizontal: isHorizontalAdequate.value,
      vertical: !isHorizontalAdequate.value,
    };
  });

  const alternateClass = useDarkAlternate(
    'has-background-grey-lighter',
    'has-background-black-ter'
  );
</script>

<template>
  <div
    class="is-flex is-flex-grow-1 is-align-items-center is-justify-content-center anchor"
    :class="alternateClass"
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
