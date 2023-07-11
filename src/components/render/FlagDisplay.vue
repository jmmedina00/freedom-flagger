<script setup>
  import { computed, inject, ref } from 'vue';
  import { CONFIG } from '../../state';
  import { useNumberAsColors } from './colors';
  import ColorStripe from './ColorStripe.vue';

  const config = inject(CONFIG);

  const { colors, remainder } = useNumberAsColors();
  const amountColors = computed(() => colors.value.length);

  const watchedColors = ref(colors);
</script>

<template>
  <svg
    version="1.1"
    width="300"
    height="200"
    xmlns="http://www.w3.org/2000/svg"
  >
    <svg width="100%" height="100%">
      <ColorStripe
        v-for="(color, index) in watchedColors"
        :color="color"
        :index="index"
        :total-colors="amountColors"
      />
    </svg>

    <text x="20" y="20">{{ remainder.join(', ') }}</text>
  </svg>
</template>
