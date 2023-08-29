<script setup>
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { computed, ref } from 'vue';
  import { useAppropriateDemoSize } from './size';
  import { useDirectionHolds } from '@app/components/render/helper/direction';
  import { COLOR_BG_PRIMARY, COLOR_BG_SECONDARY } from './color';

  const COLORS = [COLOR_BG_PRIMARY, COLOR_BG_SECONDARY];

  const props = defineProps(['percent']);
  const percent = computed(() => props.percent);

  const sizing = useFullStateSize();
  const dimensions = useAppropriateDemoSize(sizing);

  const direction = computed(() => {
    const { width, height } = dimensions.value;
    return width >= height ? 'vertical' : 'horizontal';
  });
  const { sizeHold, stretchHold, positionHold } = useDirectionHolds(direction);

  const rectsAttrs = computed(() => {
    const mainPortion = parseInt(percent.value);
    const remainderPortion = Math.max(100 - mainPortion, 0);
    const percents = [0, mainPortion, remainderPortion].map((n) => `${n}%`);

    return COLORS.map((color, index) => ({
      fill: color,
      [sizeHold.value]: percents[index + 1],
      [positionHold.value]: percents[index],
      [stretchHold.value]: '100%',
    }));
  });
</script>

<template>
  <svg :width="dimensions.width" :height="dimensions.height">
    <rect v-for="attrs in rectsAttrs" v-bind="attrs"></rect>
  </svg>
</template>
