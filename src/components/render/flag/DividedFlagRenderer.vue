<script setup>
  import { computed, inject, ref } from 'vue';
  import { useDirectionHolds } from '../helper/direction';
  import { RENDER_BASICS, RENDER_PARAMS } from '@app/state';
  import FlagPortion from '../core/FlagPortion.vue';

  const props = defineProps(['portions', 'direction', 'mainFlagPercent']);

  const { portions, direction } = inject(RENDER_BASICS, {
    portions: ref([]),
    direction: ref(''),
  });

  const params = inject(RENDER_PARAMS, ref({ mainFlagPercent: 50 }));
  const mainFlagPercent = computed(() => params.value?.mainFlagPercent);
  const oppositeDirection = computed(
    () => ['vertical', 'horizontal'].filter((a) => a !== direction.value)[0]
  );

  const { sizeHold, positionHold, stretchHold } = useDirectionHolds(direction);

  const wrappers = computed(() => {
    const vPortions = portions.value;
    const parts = new Set(vPortions.map((x) => x.length)).size;
    const portionSets =
      parts === 1 ? [vPortions] : [vPortions.slice(0, -1), [vPortions.at(-1)]];

    const mainPercent = +mainFlagPercent.value;
    const percents =
      parts === 1
        ? [0, 100]
        : [0, Math.min(100, mainPercent), Math.max(100 - mainPercent, 0)];

    const possibleDirections = [direction.value, oppositeDirection.value];

    return portionSets.map((pSet, index) => ({
      bind: {
        [positionHold.value]: percents[index] + '%',
        [sizeHold.value]: percents[index + 1] + '%',
        [stretchHold.value]: '100%',
      },
      portions: pSet.map((colors, portionIndex) => ({
        colors,
        key:
          colors.toString() +
          '-' +
          portionIndex +
          '-' +
          possibleDirections[index],
        index: portionIndex,
        total: pSet.length,
        direction: possibleDirections[index],
      })),
    }));
  });
</script>

<template>
  <svg v-for="wrapper in wrappers" v-bind="wrapper.bind">
    <FlagPortion v-for="portion in wrapper.portions" v-bind="portion" />
  </svg>
</template>
