export const getCardWidth = (screens) => {
  if (screens.xxl) return "18%";
  if (screens.xl) return "22%";
  if (screens.lg) return "30%";
  if (screens.md) return "45%";
  if (screens.sm) return "90%";
  return "100%";
};
