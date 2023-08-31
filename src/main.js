import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import { setupI18n } from './i18n';
import {
  getLocaleFromBrowser,
  getLocaleFromLocalStorage,
  getLocaleFromPath,
  getLocaleFromQuery,
} from './i18n.detect';
import { config } from './components/config/options/plugin';
import { provideDefault } from './components/shared/provide';
import { NOTIFICATION, NUMBER_BYTES } from './state';
import { getNumberStartingValue } from './util/number';

(async () => {
  const locale =
    getLocaleFromQuery() ||
    getLocaleFromPath() ||
    getLocaleFromLocalStorage() ||
    getLocaleFromBrowser();
  const app = createApp(App);
  const i18n = await setupI18n({ locale, legacy: false });

  app.use(i18n);
  app.use(provideDefault(NOTIFICATION, null));
  app.use(provideDefault(NUMBER_BYTES, getNumberStartingValue()));
  app.use(config);
  app.mount('#app');
})();
