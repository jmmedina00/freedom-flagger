import { computed, ref } from 'vue';

export const useCalculatedSizes = (
  sizing = ref({
    width: 300,
    height: undefined,
    aspectRatio: { x: 3, y: 2 },
  })
) =>
  computed(() => {
    const { width, height, aspectRatio } = sizing.value;

    if (!!width && !!height) {
      return { width, height };
    }

    const { x, y } = aspectRatio;

    const numericRatio = !!width ? y / x : x / y;
    const missingDimension = Math.floor((width ?? height) * numericRatio);

    return !!width
      ? { width, height: missingDimension }
      : { width: missingDimension, height };
  });
