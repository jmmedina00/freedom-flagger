<script setup>
  import { ref } from 'vue';
  import FlagPortion from '../core/FlagPortion.vue';

  const props = defineProps(['portions', 'direction']);

  const portions = ref(props.portions);
  const direction = ref(props.direction);
</script>

<template>
  <FlagPortion
    v-for="(portion, index) in portions"
    :key="portion.toString() + '-' + index + '-' + direction"
    :colors="portion"
    :index="index"
    :total="portions.length"
    :direction="direction"
  />
</template>
