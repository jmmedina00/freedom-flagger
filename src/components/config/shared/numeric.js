export const parseAsIntOrNothing = (value = '') => {
  if (value.includes('.')) return undefined;
  if (value.length === 0) return 0;

  const numeric = parseInt(value);
  return isNaN(numeric) ? undefined : numeric;
};
