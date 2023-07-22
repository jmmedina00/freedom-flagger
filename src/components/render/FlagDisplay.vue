<script setup>
  import { computed, ref } from 'vue';
  import { useNumberAsColors } from './helper/colors';
  import ColorStripe from './ColorStripe.vue';
  import { useFullStateSize } from './helper/size';

  const { colors, remainder } = useNumberAsColors();
  const amountColors = computed(() => colors.value.length);

  const watchedColors = ref(colors);
  const dimensions = useFullStateSize();
</script>

<template>
  <svg
    version="1.1"
    :width="dimensions.width"
    :height="dimensions.height"
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
