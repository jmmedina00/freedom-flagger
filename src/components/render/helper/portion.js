import { computed, ref } from 'vue';

const getPercentage = (chunk = 0, total = 10) => (chunk / total) * 100;

export const usePortionSizeAndPosition = (
  params = ref({ index: 0, total: 10 })
) => {
  const size = computed(
    () =>
      getPercentage(1, params.value.total) +
      (params.value.index < params.value.total - 1) +
      '%'
  );
  const position = computed(
    () => getPercentage(params.value.index, params.value.total) + '%'
  );

  return { size, position };
};
