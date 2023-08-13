import { HANDLING_CONFIG } from '@app/state';
import { computed, inject, ref } from 'vue';

export const useDefaultedConfig = (name = '', defaultValue = {}) => {
  const handling = inject(
    HANDLING_CONFIG,
    ref({ component: name, config: null })
  );

  const decorate = computed({
    get: () => handling.value.config,
    set: (newConfig = {}) => {
      handling.value.config = newConfig;
    },
  });

  if (!decorate.value || handling.value.component !== name) {
    handling.value.component = name;
    decorate.value = { ...defaultValue };
  }

  return decorate;
};

export const useProportionalFields = (fields = []) => {
  const handling = inject(
    HANDLING_CONFIG,
    ref({ proportional: ['one', 'two'] })
  );

  handling.value.proportional = [...fields];
};
