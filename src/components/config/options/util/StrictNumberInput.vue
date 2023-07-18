<script setup>
  import { computed, ref } from 'vue';

  const props = defineProps(['modelValue']);
  const emit = defineEmits(['update:modelValue']);

  const isEmpty = (value = '') => value.toString().length === 0;
  const isPotentiallyDecimal = (value = '') => value.toString().includes('.');
  const isPotentiallyNegative = (value = '') => value.toString().includes('-');

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

      if (isPotentiallyDecimal(value) || isPotentiallyNegative(value)) {
        forceItBackToPrevious();
        return;
      }

      const parsed = parseInt(value);

      if (isNaN(parsed)) {
        forceItBackToPrevious();
        return;
      }

      const emitted = parsed || undefined; // Send undefined rather than 0
      emit('update:modelValue', emitted);
    },
  });
</script>

<template>
  <input ref="el" type="text" v-model="model" />
</template>
