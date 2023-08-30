import { useDark } from '@vueuse/core';
import { computed, unref } from 'vue';

const isAcceptable = (value) =>
  Array.isArray(value) || typeof value === 'string' || !value;

const lightRegex = /^(.+)(-light)$/;

const darkify = (value = '') =>
  lightRegex.test(value) ? value.replace(lightRegex, '$1') : value + '-dark';

export const useDarkAlternate = (light, dark) => {
  const isNowDark = useDark();
  return computed(() => {
    const actualLight = unref(light);
    const actualDark = unref(dark);

    if (
      !actualLight ||
      !isAcceptable(actualLight) ||
      !isAcceptable(actualDark)
    ) {
      throw 'No objects allowed';
    }

    const currentWanted = !isNowDark.value
      ? actualLight
      : actualDark ||
        (Array.isArray(actualLight)
          ? actualLight.map(darkify)
          : darkify(actualLight));

    return unref(currentWanted);
  });
};
