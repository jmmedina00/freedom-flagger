<script setup>
  import { useFullStateSize } from '@app/components/render/helper/size';
  import { computed } from 'vue';

  const pointSequence = [{ y: -1 }, { x: 1 }, { y: 1 }, { x: -1 }];

  const props = defineProps(['size', 'x', 'y']);
  const sizing = useFullStateSize();

  const verticalRhombus = computed(
    () => sizing.value.width >= sizing.value.height
  );

  const points = computed(() => {
    const size = parseFloat(props.size);
    const [factorX, factorY] = verticalRhombus.value
      ? [size, size * 2]
      : [size * 2, size];

    return pointSequence
      .map(({ x, y }) =>
        [props.x + factorX * (x || 0), props.y + factorY * (y || 0)].join(',')
      )
      .join(' ');
  });
</script>

<template>
  <polygon :points="points"></polygon>
</template>
