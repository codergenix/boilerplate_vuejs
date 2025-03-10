import AppThemes from '@/utils/themes';
import { computed } from 'vue'
// ---
export const themeColor = computed(() => {
  const themeName = AppThemes.selectedTheme;
  if (themeName.includes("blue")) return "#028bc9";
  if (themeName.includes("lime")) return "#b8c723";
  if (themeName.includes("orange")) return "#f1582c";
  if (themeName.includes("purple")) return "#7d1f8d";
  if (themeName.includes("teal")) return "#009688";
  return "#F1582C";
});
// ---
