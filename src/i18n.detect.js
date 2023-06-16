import { SUPPORTED_LOCALES } from './i18n';

export const getLocaleFromLocalStorage = () => {
  if (!localStorage) return null;

  return localStorage.getItem('lang');
};

export const getLocaleFromQuery = () => {
  const url = new URL(location.href);
  const parameters = url.searchParams;
  const lang = parameters.get('lang');

  return SUPPORTED_LOCALES.includes(lang) ? lang : null;
};

export const getLocaleFromPath = () => {
  const url = new URL(location.href);
  const path = url.pathname;
  const lang = path.split('/').find((foo) => SUPPORTED_LOCALES.includes(foo));

  return lang;
};

export const getLocaleFromBrowser = () => {
  if (!navigator) return null;

  return navigator.language.split('-')[0];
};
