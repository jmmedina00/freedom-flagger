export const placeColorsOnIndexes = (
  data = {},
  { fields = [''], colors = [''] }
) => {
  const entries = Object.entries(data);

  const transformed =
    colors.length === 0
      ? [...entries]
      : entries.map(([key, value]) => {
          if (!fields.includes(key)) return [key, value];

          const index = parseInt(value);
          const color =
            index > 0 && index <= colors.length ? colors[index - 1] : undefined;

          return [key, color];
        });

  return Object.fromEntries(transformed);
};
