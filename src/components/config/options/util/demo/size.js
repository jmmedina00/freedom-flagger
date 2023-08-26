import { computed, ref } from 'vue';

const MAX_DIMENSION = 200;
const getProportion = (a1 = 1, b1 = 0) => (b1 * MAX_DIMENSION) / a1;

export const useAppropriateDemoSize = (sizing = ref({ width: 1, height: 1 })) =>
  computed(() => {
    const { width, height } = sizing.value;

    return {
      width: Math.min(MAX_DIMENSION, getProportion(height, width)),
      height: Math.min(MAX_DIMENSION, getProportion(width, height)),
    };
  });
