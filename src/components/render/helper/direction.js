import { computed, ref } from 'vue';

const DIR_VERTICAL = 'vertical';
const DIR_HORIZONTAL = 'horizontal';
const SIZE_VERTICAL = 'width';
const SIZE_HORIZONTAL = 'height';
const POSITION_VERTICAL = 'x';
const POSITION_HORIZONTAL = 'y';

const validDirections = [DIR_VERTICAL, DIR_HORIZONTAL];
const sizes = [SIZE_VERTICAL, SIZE_HORIZONTAL];

export const useDirectionHolds = (directionParam = ref('')) => {
  const sanitizedDirection = computed(() =>
    directionParam.value?.toLowerCase()
  );
  const directionIndex = computed(() =>
    validDirections.findIndex((dir) => dir === sanitizedDirection.value)
  );

  const direction = computed(
    () => validDirections[Math.max(0, directionIndex.value)]
  );

  const rectParameterPlaces = computed(() =>
    direction.value === DIR_VERTICAL
      ? [POSITION_VERTICAL, SIZE_VERTICAL]
      : [POSITION_HORIZONTAL, SIZE_HORIZONTAL]
  );

  const positionHold = computed(() => rectParameterPlaces.value[0]);
  const sizeHold = computed(() => rectParameterPlaces.value[1]);
  const stretchHold = computed(() =>
    sizes.find((pos) => pos !== sizeHold.value)
  );

  return { positionHold, sizeHold, stretchHold };
};
