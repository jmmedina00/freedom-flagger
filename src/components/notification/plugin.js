import { ref } from 'vue';
import { NOTIFICATION } from '../../state';

export const notification = {
  install: (app) => {
    app.provide(NOTIFICATION, ref(null));
  },
};
