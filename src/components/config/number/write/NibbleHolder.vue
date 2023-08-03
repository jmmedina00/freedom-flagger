<script setup>
  import { useFocus } from '@vueuse/core';
  import { computed, ref, watch } from 'vue';

  const emit = defineEmits(['update:modelValue']);
  const props = defineProps({
    modelValue: null,
    admittedChars: String,
    position: Number,
    currentNibble: null,
  });

  const input = ref();
  const { focused } = useFocus(input, { initialValue: false });

  const admittedChars = ref(props.admittedChars ?? '');
  const currentNibble = ref(props.currentNibble);

  const currentValue = ref(props.modelValue);
  const model = computed({
    get: () => currentValue.value,
    set: (value) => {
      currentValue.value = value;
      emit('update:modelValue', value);
    },
  });

  const handleKeyStroke = ({ key = '' }) => {
    const chars = admittedChars.value.split('').map((c) => c.toUpperCase());
    const currentIndex = Math.max(chars.indexOf(model.value), 0);

    const arrowKeyHandling = {
      ArrowUp: () => {
        const nextChar = chars[(currentIndex + 1) % chars.length];
        model.value = nextChar;
      },
      ArrowDown: () => {
        const nextChar =
          chars[(chars.length + currentIndex - 1) % chars.length];
        model.value = nextChar;
      },
      ArrowLeft: () => {
        currentNibble.value = props.position - 1;
      },
      ArrowRight: () => {
        currentNibble.value = props.position + 1;
      },
      Backspace: () => {
        model.value = admittedChars.value[0];
        currentNibble.value = props.position - 1;
      },
    };

    const specialHandler = arrowKeyHandling[key];
    if (specialHandler) {
      specialHandler();
      return;
    }

    const inputKey = key.toUpperCase();
    const index = chars.indexOf(inputKey);

    if (index !== -1) {
      model.value = inputKey;
      currentNibble.value = props.position + 1;
    }
  };

  watch(currentNibble, (nibble) => {
    focused.value = nibble === props.position;
  });

  watch(focused, (isFocused) => {
    if (isFocused) {
      currentNibble.value = props.position;
    }
  });
</script>

<template>
  <input
    type="text"
    readonly
    v-model="model"
    @keydown="handleKeyStroke"
    ref="input"
  />
</template>
