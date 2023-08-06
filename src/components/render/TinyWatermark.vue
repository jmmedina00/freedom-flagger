<script setup>
  import { computed } from 'vue';
  import { useFullStateSize } from './helper/size';

  const props = defineProps(['path', 'proportion']);
  const sizing = useFullStateSize();

  const proportion = Math.min(parseFloat(props.proportion) || 0.25, 1);

  const dimension = computed(() => {
    const { width, height } = sizing.value;
    return Math.min(width, height) * proportion;
  });

  const x = computed(() => sizing.value.width - dimension.value);
  const y = computed(() => sizing.value.height - dimension.value);
</script>

<template>
  <image
    class="invisible"
    :href="path"
    :width="dimension"
    :height="dimension"
    :x="x"
    :y="y"
  />
</template>

<style scoped>
  .invisible {
    display: none; /* Doesn't reach PNG rendered, thus hides it only on browser view */
  }
</style>
