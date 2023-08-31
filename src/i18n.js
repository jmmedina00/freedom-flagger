import { createI18n } from 'vue-i18n';

// Adapted from https://vue-i18n.intlify.dev/guide/advanced/lazy.html
// I'm NOT installing the router just for this

export const SUPPORTED_LOCALES = ['en', 'es', 'fr'];

export const setupI18n = async (options = { locale: 'en' }) => {
  const messageEntries = await Promise.all(
    SUPPORTED_LOCALES.map(async (locale) => [
      locale,
      await loadLocaleMessages(locale),
    ])
  );

  const messages = Object.fromEntries(messageEntries);

  const i18n = createI18n({
    ...options,
    messages,
  });
  setI18nLanguage(i18n, options.locale);
  return i18n;
};

export const setI18nLanguage = (i18n, locale) => {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }

  document.querySelector('html').setAttribute('lang', locale);
};

export const loadLocaleMessages = async (locale) => {
  const messages = await import(`./assets/i18n/${locale}.json`);
  return messages.default; // I'd rather take the L and forfeit lazy-loading here
};
