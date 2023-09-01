export const getOriginPointsForPolygon = (
  sides = 0,
  radius = 0,
  offsetInDegrees = 0
) => {
  const [baseX, baseY] = [0, -radius];
  const offsetAngle = (offsetInDegrees * Math.PI) / 180;

  return new Array(sides).fill('0').map((_, index) => {
    const angle = ((2 * Math.PI) / sides) * index + offsetAngle;

    const x = baseX * Math.cos(angle) - baseY * Math.sin(angle);
    const y = baseX * Math.sin(angle) + baseY * Math.cos(angle);
    return [x, y];
  });
};
