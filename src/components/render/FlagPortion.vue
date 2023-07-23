<script setup>
  import { computed, ref } from 'vue';
  import ColorStripe from './ColorStripe.vue';
  import { usePortionSizeAndPosition } from './helper/portion';
  import { useDirectionHolds } from './helper/direction';

  const props = defineProps({
    colors: Array,
    index: Number,
    total: Number,
    direction: String,
  });

  const direction = ref(props.direction);
  const index = ref(props.index);
  const total = ref(props.total);

  const positionParams = computed(() => ({
    index: index.value,
    total: total.value,
  }));

  const { size, position } = usePortionSizeAndPosition(positionParams);
  const { sizeHold, positionHold, stretchHold } = useDirectionHolds(direction);

  const attributes = computed(() => ({
    [positionHold.value]: position.value,
    [sizeHold.value]: size.value,
    [stretchHold.value]: '100%',
  }));
</script>

<template>
  <svg v-bind="attributes">
    <ColorStripe
      v-for="(color, index) in colors"
      :key="color + '-' + index + '-' + colors.length"
      :color="color"
      :index="index"
      :total-colors="colors.length"
      :direction="direction"
    />
  </svg>
</template>
