<script setup>
  import IconButton from '@app/components/shared/IconButton.vue';
  import { computed, inject, ref, watch } from 'vue';
  import {
    FOCUS_END,
    FOCUS_START,
    OUTSIDE_COMMAND,
    POSITION_ADVANCE,
    POSITION_BACK,
    POSITION_SELECTED,
  } from '../state';

  const ADMITTED_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const props = defineProps(['base', 'modelValue']);
  const emit = defineEmits(['update:modelValue']);
  const outsideCommand = inject(OUTSIDE_COMMAND, ref(null));

  const inputs = ref([]);
  const focusedIndex = ref(-1);
  const isFocused = (index) => computed(() => index === focusedIndex.value);

  const base = props.base;
  const acceptableChars = ADMITTED_CHARS.slice(0, base);
  const lastChar = ADMITTED_CHARS.charAt(base - 1);
  const fromModel = ref(props.modelValue);
  const model = computed({
    get: () => fromModel.value,
    set: (value) => {
      emit('update:modelValue', value);
      fromModel.value = value;
    },
  });

  const nibbles = computed({
    get: () => {
      const byteLength = (0xff).toString(base).length;
      return parseInt(model.value || '0')
        .toString(base)
        .padStart(byteLength, '0')
        .toUpperCase()
        .split('');
    },
    set: (value = []) => {
      const joined = value.join('');
      const number = parseInt(joined, props.base);
      model.value = Math.min(number, 0xff);
    },
  });

  const updateNibble = (index, value) => {
    const newNibbles = [...nibbles.value];
    newNibbles[index] = value;
    nibbles.value = [...newNibbles];
  };

  const handleKeyStroke = (index, { key = '' }) => {
    if (['ArrowUp', 'ArrowDown'].includes(key)) {
      const increment = key === 'ArrowUp' ? 1 : -1;
      addToNibble(index, increment);
      return;
    }

    if (['ArrowLeft', 'ArrowRight'].includes(key)) {
      const increment = key === 'ArrowRight' ? 1 : -1;
      focusedIndex.value += increment;
      return;
    }

    if (key.length !== 1 || !acceptableChars.includes(key.toUpperCase())) {
      return;
    }

    updateNibble(index, key);
    focusedIndex.value += 1;
  };

  const addToNibble = (index, increment) => {
    const char = nibbles.value[index];
    const charIndex = ADMITTED_CHARS.indexOf(char);

    if (charIndex === -1) {
      return;
    }

    const newChar = acceptableChars[charIndex + increment];
    if (!newChar) {
      return;
    }

    updateNibble(index, newChar);
  };

  const announceFocus = (index) => {
    focusedIndex.value = index;
    outsideCommand.value = POSITION_SELECTED;
  };

  watch(outsideCommand, (command) => {
    const watchedCommands = {
      [FOCUS_START]: 0,
      [FOCUS_END]: inputs.value.length - 1,
    };

    const newPos = watchedCommands[command];
    if (!!newPos) focusedIndex.value = newPos;
  });

  watch(focusedIndex, (index) => {
    const focused = inputs.value[index];
    if (!!focused) focused.focus(); // If triggered by announcement, causes announcement to happen twice - shouldn't be a problem...?

    const outOfScope = {
      [-1]: POSITION_BACK,
      [inputs.value.length]: POSITION_ADVANCE,
    };

    const nextCommand = outOfScope[index];
    if (!!nextCommand) outsideCommand.value = nextCommand;
  });
</script>

<template>
  <div class="is-inline-flex">
    <div class="nibble" v-for="(nibble, index) in nibbles">
      <IconButton
        icon="keyboard_arrow_up"
        :disabled="nibble === lastChar"
        @click="addToNibble(index, 1)"
      />
      <input
        type="text"
        :class="{ focused: isFocused(index) }"
        readonly
        :value="nibble"
        @keydown="(e) => handleKeyStroke(index, e)"
        @focus="announceFocus(index)"
        ref="inputs"
      />
      <IconButton
        icon="keyboard_arrow_down"
        :disabled="nibble === '0'"
        @click="addToNibble(index, -1)"
      />
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
