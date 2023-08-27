import { SUPPORTED_LOCALES } from '@app/i18n';
import { getNumberAsBase64 } from '@app/util/number';
import { computed, ref } from 'vue';

export const useLinkToCurrentNumber = (number = ref([])) => {
  const url = new URL(location.href);
  const host = url.origin;
  const pathname = url.pathname
    .split('/')
    .filter((element) => !SUPPORTED_LOCALES.includes(element))
    .join('/');

  return computed(() => {
    const usableURL = new URL(host + pathname);
    usableURL.searchParams.set('number', getNumberAsBase64(number.value));

    return usableURL.href;
  });
};
