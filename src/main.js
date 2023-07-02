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
import { notification } from './components/notification/plugin';
import { config } from './components/config/options/plugin';

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
  app.use(notification);
  app.use(config);
  app.mount('#app');
})();
