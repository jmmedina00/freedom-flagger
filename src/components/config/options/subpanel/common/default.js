import { HANDLING_CONFIG } from '@app/state';
import { computed, inject, ref } from 'vue';

export const useDefaultedConfig = (
  name = '',
  defaultValue = {},
  essential = {}
) => {
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

  handling.value = { ...handling.value, ...essential };

  if (!decorate.value || handling.value.component !== name) {
    handling.value.component = name;
    decorate.value = { ...defaultValue };
  }

  return decorate;
};
