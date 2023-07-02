import { ref } from 'vue';

export const provideDefault = (key = 'INJECT', value = 'whatever mutable') => ({
  install: (app) => {
    app.provide(key, ref(value));
  },
});
