export const placeColorsOnIndexes = (
  data = {},
  { fields = [''], colors = [''], scaled = [''], scaleRatio = 0 }
) => {
  const entries = Object.entries(data);

  const transformed =
    colors.length === 0
      ? [...entries]
      : fields.length === 0
      ? [...entries, ['colors', colors]]
      : entries.map(([key, value]) => {
          if (!fields.includes(key) && !scaled.includes(key))
            return [key, value];

          const parsed = parseInt(value);
          const converted = fields.includes(key)
            ? parsed > 0 && parsed <= colors.length
              ? colors[parsed - 1]
              : undefined
            : parsed * scaleRatio || parsed;

          return [key, converted];
        });

  return Object.fromEntries(transformed);
};
