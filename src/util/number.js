import { NUMBER_DEFAULT } from '@app/state';

export const getNumberStartingValue = () => {
  const url = new URL(location.href);
  const parameters = url.searchParams;
  const encoded = parameters.get('number');

  const decoded = encoded ? atob(encoded) : NUMBER_DEFAULT;

  return [...Uint8Array.from(decoded, (m) => m.codePointAt(0))];
};
