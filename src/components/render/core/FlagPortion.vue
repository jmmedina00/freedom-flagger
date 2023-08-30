<script setup>
  import { computed, ref } from 'vue';
  import ColorStripe from './ColorStripe.vue';
  import { usePortionSizeAndPosition } from '../helper/portion';
  import { useDirectionHolds } from '../helper/direction';
  import { useFullStateSize } from '../helper/size';

  const props = defineProps({
    colors: Array,
    index: Number,
    total: Number,
    direction: String,
  });

  const backConvert = (heldDimension, percentString) =>
    heldDimension * (parseFloat(percentString.replace('%', '')) / 100);

  const trueSizing = useFullStateSize();

  const direction = ref(props.direction);
  const adoptedDirection = computed(
    () => ['vertical', 'horizontal'].filter((a) => a !== direction.value)[0]
  );
  const index = ref(props.index);
  const total = ref(props.total);

  const positionParams = computed(() => ({
    index: index.value,
    total: total.value,
  }));

  const { size, position } = usePortionSizeAndPosition(positionParams);
  const { sizeHold, positionHold, stretchHold } =
    useDirectionHolds(adoptedDirection);

  const attributes = computed(() => {
    const heldDimension = trueSizing.value[sizeHold.value];

    const backConvertedPosition = backConvert(heldDimension, position.value);
    const backConvertedSize = backConvert(heldDimension, size.value); // What you make me do, canvg

    return {
      [positionHold.value]: backConvertedPosition,
      [sizeHold.value]: backConvertedSize,
      [stretchHold.value]: '100%',
    };
  });
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
