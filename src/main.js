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

(async () => {
  const locale =
    getLocaleFromQuery() ||
    getLocaleFromPath() ||
    getLocaleFromLocalStorage() ||
    getLocaleFromBrowser();
  const app = createApp(App);
  const i18n = await setupI18n({ locale, legacy: false });

  console.log(i18n);

  app.use(i18n);
  app.use(provideDefault(NOTIFICATION, null));
  app.use(
    provideDefault(
      NUMBER_BYTES,
      [
        100, 105, 115, 32, 105, 115, 32, 97, 32, 108, 111, 116, 32, 111, 102,
        32, 102, 114, 101, 101, 100, 111, 109,
      ] // dis is a lot of freedom
    )
  );
  app.use(config);
  app.mount('#app');
})();
