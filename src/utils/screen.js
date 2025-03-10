export const screen = (width) => {
  if (width < 576) return "sm";
  if (width < 768) return "md";
  if (width < 992) return "lg";
  if (width < 1200) return "xl";
  return "xxl";
};
