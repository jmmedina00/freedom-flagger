import { NUMBER_DEFAULT } from '@app/state';

export const getNumberStartingValue = () => {
  const url = new URL(location.href);
  const parameters = url.searchParams;
  const encoded = (parameters.get('number') || '')
    .replaceAll('-', '+')
    .replaceAll('_', '/');

  const decoded = encoded ? atob(encoded) : NUMBER_DEFAULT;

  return [...Uint8Array.from(decoded, (m) => m.codePointAt(0))];
};

export const getNumberAsBase64 = (number = []) =>
  btoa(number.map((n) => String.fromCodePoint(n)).join(''))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
