<script setup>
  import { computed, ref } from 'vue';
  import { usePortionSizeAndPosition } from '../helper/portion';
  import { useDirectionHolds } from '../helper/direction';

  const props = defineProps({
    color: { type: String, default: '#000000' },
    index: { type: Number, default: 0 },
    totalColors: { type: Number, default: 10 },
    direction: { type: String, default: 'vertical' },
  });
  const direction = ref(props.direction);
  const index = ref(props.index);
  const total = ref(props.totalColors);

  const positionParams = computed(() => ({
    index: index.value,
    total: total.value,
  }));

  const { size, position } = usePortionSizeAndPosition(positionParams);
  const { sizeHold, positionHold, stretchHold } = useDirectionHolds(direction);

  const attributes = computed(() => ({
    fill: props.color,
    [positionHold.value]: position.value,
    [sizeHold.value]: size.value,
    [stretchHold.value]: '100%',
  }));
</script>

<template>
  <rect v-bind="attributes"></rect>
</template>
