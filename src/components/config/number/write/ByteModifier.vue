<script setup>
  import IconButton from '@app/components/shared/IconButton.vue';
  import { computed, ref } from 'vue';

  const ADMITTED_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const props = defineProps(['base', 'modelValue']);
  const emit = defineEmits(['update:modelValue']);

  const base = props.base;
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
    const acceptableChars = ADMITTED_CHARS.slice(0, base);
    if (key.length !== 1 || !acceptableChars.includes(key.toUpperCase())) {
      return;
    }

    updateNibble(index, key);
  };

  const addToNibble = (index, increment) => {
    const char = nibbles.value[index];
    const charIndex = ADMITTED_CHARS.indexOf(char);

    if (charIndex === -1) {
      return;
    }

    updateNibble(index, ADMITTED_CHARS[charIndex + increment]);
  }; // TODO - handle focus swaps + keyboard stuff
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
        readonly
        :value="nibble"
        @keydown="(e) => handleKeyStroke(index, e)"
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
