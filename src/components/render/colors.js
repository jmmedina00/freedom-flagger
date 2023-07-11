import { computed, inject, ref } from 'vue';
import { NUMBER_BYTES } from '@app/state';

export const useNumberAsColors = () => {
  const number = inject(NUMBER_BYTES, ref([0]));

  const colorAmount = computed(() => Math.floor(number.value.length / 3));
  const colors = computed(() =>
    new Array(colorAmount.value).fill('').map((_, index) => {
      const startIndex = index * 3;
      const endIndex = startIndex + 3;
      return (
        '#' +
        number.value
          .slice(startIndex, endIndex)
          .map((x) => x.toString(16).padStart(2, '0'))
          .join('')
      );
    })
  );

  const remainderSlice = computed(() => (number.value.length % 3) * -1);
  const remainder = computed(() =>
    remainderSlice.value === 0 ? [] : number.value.slice(remainderSlice.value)
  );
  return { colors, remainder };
};
