<script setup>
  import { inject, ref } from 'vue';
  import FlagPortion from '../core/FlagPortion.vue';
  import { RENDER_BASICS } from '@app/state';

  const { portions, direction } = inject(RENDER_BASICS, {
    portions: ref([]),
    direction: ref(''),
  });
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
