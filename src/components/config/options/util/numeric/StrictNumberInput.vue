<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);

  const isEmpty = (value = '') => value.toString().length === 0;
  const isProperNumber = (value = '') => /^\d+$/.test(value);

  const el = ref(null);

  const forceItBackToPrevious = () => {
    emit('update:modelValue', 0);
    emit('update:modelValue', props.modelValue);
    el.value.value = props.modelValue;
  };

  const model = computed({
    get: () => props.modelValue || '',
    set: (value) => {
      if (isEmpty(value)) {
        emit('update:modelValue', undefined);
        return;
      }

      if (!isProperNumber(value)) {
        forceItBackToPrevious();
        return;
      }

      const parsed = parseInt(value);
      const emitted = parsed || undefined; // Send undefined rather than 0
      emit('update:modelValue', emitted);
    },
  });
</script>

<template>
  <input ref="el" type="text" v-model="model" />
</template>

<style scoped>
  .input {
    border-color: hsl(0, 0%, 86%);
  }
</style>
