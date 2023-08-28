<script setup>
  import { computed, inject, provide, ref, watch } from 'vue';
  import { NUMBER_BYTES } from '@app/state';
  import ByteModifier from './ByteModifier.vue';
  import {
    CURRENT_POSITION,
    FOCUS_END,
    FOCUS_START,
    OUTSIDE_COMMAND,
    POSITION_ADVANCE,
    POSITION_BACK,
    POSITION_SELECTED,
  } from '../state';

  const props = defineProps({
    base: { type: Number, default: 16 },
    maxValue: { type: Number, default: 15 },
    position: Number,
  });

  const command = ref(null);
  const currentPosition = inject(CURRENT_POSITION, ref(-1));
  const number = inject(NUMBER_BYTES, ref([0]));

  provide(OUTSIDE_COMMAND, command);

  const byte = computed({
    get: () => number.value[props.position],
    set: (setByte) => {
      number.value[props.position] = setByte;
    },
  });

  watch(command, (next) => {
    const possibleAddendums = {
      [POSITION_SELECTED]: 0,
      [POSITION_ADVANCE]: 1,
      [POSITION_BACK]: -1,
    };

    const addendum = possibleAddendums[next];
    if (addendum === undefined) return;
    currentPosition.value = props.position + addendum;
  });

  watch(currentPosition, (next, previous) => {
    if (next !== props.position || command.value === POSITION_SELECTED) return;

    const nextCommand = next > previous ? FOCUS_START : FOCUS_END;
    command.value = nextCommand;
  });
</script>

<template>
  <span class="is-flex is-align-items-center">
    <!-- <input class="nibble" type="number" min="0" max="255" v-model="byte" /> -->
    <ByteModifier :base="base" v-model="byte" />
    <button class="delete mx-1" @click="$emit('delete')"></button>
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
