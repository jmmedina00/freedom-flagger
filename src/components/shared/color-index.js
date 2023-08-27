export const placeColorsOnIndexes = (
  data = {},
  { fields = [], colors = [], scaled = [], scaleRatio = 0 }
) => {
  const entries = Object.entries(data);

  const transformed = entries.map(([key, value]) => {
    if (!fields.includes(key) && !scaled.includes(key)) return [key, value];

    const parsed = parseInt(value);
    const scaledValue = scaled.includes(key)
      ? parsed * scaleRatio || value
      : value;

    const shouldAdapt =
      fields.length > 0 && fields.includes(key) && colors.length > 0;
    const hasValidAdaptIndex = parsed > 0 && parsed <= colors.length;

    const converted = shouldAdapt
      ? hasValidAdaptIndex
        ? colors[parsed - 1]
        : undefined
      : scaledValue;
    return [key, converted];
  });

  const allEntries =
    fields.length > 0 ? transformed : [...transformed, ['colors', colors]];
  return Object.fromEntries(allEntries);
};
