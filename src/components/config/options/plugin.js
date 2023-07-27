import { useStorage } from '@vueuse/core';
import { CONFIG } from '@app/state';
import { computed, inject } from 'vue';

export const config = {
  install: (app) => {
    app.provide(CONFIG, useStorage(CONFIG, {}));
  },
};

export const unsetConfig = (key = '') => {
  const config = inject(CONFIG);
  config.value[key] = undefined;
};

export const useWhetherSomeConfigPresent = (key = '') => {
  const config = inject(CONFIG);
  return computed(() => !!config.value[key]);
};

export const useSomeConfig = (key = '', defaultValue) => {
  const config = inject(CONFIG);

  const interestingConfig = computed({
    get: () => config.value[key],
    set: (value) => {
      config.value = { ...config.value, [key]: value };
    },
  });

  if (defaultValue && !interestingConfig.value) {
    interestingConfig.value = defaultValue;
  }

  return interestingConfig;
};
