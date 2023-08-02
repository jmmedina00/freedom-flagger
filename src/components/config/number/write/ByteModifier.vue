<script setup>
  import IconButton from '@app/components/shared/IconButton.vue';
  import { computed, inject, ref, watch } from 'vue';
  import {
    FOCUS_END,
    FOCUS_START,
    OUTSIDE_COMMAND,
    POSITION_ADVANCE,
    POSITION_BACK,
  } from '../state';
  import NibbleHolder from './NibbleHolder.vue';

  const ADMITTED_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const props = defineProps(['base', 'modelValue']);
  const emit = defineEmits(['update:modelValue']);
  const outsideCommand = inject(OUTSIDE_COMMAND, ref(null));

  const focusedIndex = ref(-1);
  const getCurrentNibble = () => focusedIndex;

  const base = props.base;
  const byteLength = (0xff).toString(base).length;
  const acceptableChars = ADMITTED_CHARS.slice(0, base);

  const current = ref(props.modelValue);
  const model = computed({
    get: () => current.value,
    set: (value) => {
      emit('update:modelValue', value);
      current.value = value;
    },
  });

  const converted = computed({
    get: () =>
      parseInt(model.value || '0')
        .toString(base)
        .padStart(byteLength, '0')
        .toUpperCase(),
    set: (value) => {
      const parsed = parseInt(value, base);
      model.value = Math.min(parsed, 0xff);
    },
  });

  const updateNibble = (index, value) => {
    const newValue = converted.value
      .split('')
      .map((nib, otherIndex) => (otherIndex === index ? value : nib))
      .join('');

    converted.value = newValue;
  };

  const addToNibble = (index, increment) => {
    const char = converted.value[index];
    const charIndex = ADMITTED_CHARS.indexOf(char);

    if (charIndex === -1) {
      return;
    }

    const incrementedIndex =
      (acceptableChars.length + charIndex + increment) % acceptableChars.length;
    const newChar = acceptableChars[incrementedIndex];

    updateNibble(index, newChar);
  };

  watch(outsideCommand, (command) => {
    const watchedCommands = {
      [FOCUS_START]: 0,
      [FOCUS_END]: byteLength - 1,
    };

    const newPos = watchedCommands[command];
    focusedIndex.value = newPos ?? focusedIndex.value;
  });

  watch(focusedIndex, (index) => {
    const nextCommand =
      index < 0 ? POSITION_BACK : index >= byteLength ? POSITION_ADVANCE : null;

    if (!!nextCommand) outsideCommand.value = nextCommand;
  });
</script>

<template>
  <div class="is-inline-flex">
    <div class="nibble" v-for="n in byteLength">
      <IconButton icon="keyboard_arrow_up" @click="addToNibble(n - 1, 1)" />
      <NibbleHolder
        :model-value="converted[n - 1]"
        @update:model-value="(v) => updateNibble(n - 1, v)"
        :admitted-chars="acceptableChars"
        :position="n - 1"
        :current-nibble="getCurrentNibble()"
      />
      <IconButton icon="keyboard_arrow_down" @click="addToNibble(n - 1, -1)" />
    </div>
  </div>
</template>

<style scoped>
  .nibble,
  .nibble > * {
    width: 24px;
    max-width: 24px;
    text-align: center;
  }
</style>
