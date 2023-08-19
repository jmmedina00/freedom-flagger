export const getViewboxForSizing = ({ width, height }) => ({
  width: '100%',
  height: '100%',
  viewBox: `0 0 ${width} ${height}`,
});
