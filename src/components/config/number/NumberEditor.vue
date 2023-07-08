<script setup>
  import { computed, inject, ref } from 'vue';
  import { NUMBER_BYTES } from '@app/state';

  const props = defineProps({
    base: { type: Number, default: 16 },
    maxValue: { type: Number, default: 15 },
    position: Number,
  });

  const number = inject(NUMBER_BYTES, ref([0]));

  const byte = computed({
    get: () => number.value[props.position],
    set: (setByte) => {
      number.value[props.position] = setByte;
    },
  });
</script>

<template>
  <span>
    <input class="nibble" type="number" min="0" max="255" v-model="byte" />
    <button class="delete" @click="$emit('delete')"></button>
  </span>
</template>

<style scoped>
  .nibble {
    width: 3.9em;
    height: 2em;
  }

  .delete {
    vertical-align: middle;
  }
</style>
