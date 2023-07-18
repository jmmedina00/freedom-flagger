import { ref } from 'vue';

export const useUpdatableModel = (initialValue = '') => {
  const reference = ref(initialValue);
  const props = {
    modelValue: reference.value,
    'onUpdate:modelValue': (e) => {
      reference.value = e;
    },
  };

  return { reference, props };
};
