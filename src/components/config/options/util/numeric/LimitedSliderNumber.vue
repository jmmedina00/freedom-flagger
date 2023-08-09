<script setup>
  import { computed } from 'vue';
  import StrictNumberInput from './StrictNumberInput.vue';

  const props = defineProps({
    min: Number,
    max: Number,
    modelValue: Number,
    color: String,
  });
  const emit = defineEmits(['update:modelValue']);

  const model = computed({
    get: () => props.modelValue,
    set: (value) => {
      const numeric = parseInt(value);
      const emitted =
        numeric < props.min
          ? props.min
          : numeric > props.max
          ? props.max
          : numeric;

      emit('update:modelValue', emitted);
    },
  });
</script>

<template>
  <StrictNumberInput class="input numeric" v-model="model" />
  <input
    type="range"
    class="slider is-primary"
    v-model="model"
    :min="min"
    :max="max"
  />
</template>

<style scoped lang="scss">
  .numeric {
    width: 3.5rem;
  }

  input[type='range'].slider {
    margin: 0.55rem 0;
  }
</style>
