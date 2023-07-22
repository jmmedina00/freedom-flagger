import { computed, ref } from 'vue';

const getPercentage = (chunk = 0, total = 10) =>
  ((chunk / total) * 100).toString() + '%';

export const usePortionSizeAndPosition = (
  params = ref({ index: 0, total: 10 })
) => {
  const index = ref(params.value.index);
  const total = ref(params.value.total);

  const size = computed(() => getPercentage(1, total.value));
  const position = computed(() => getPercentage(index.value, total.value));

  return { size, position };
};
