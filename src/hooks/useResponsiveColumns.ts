import { useWindowDimensions } from "react-native";

export function useResponsiveColumns() {
  const { width } = useWindowDimensions();

  if (width >= 900) return 3;
  if (width >= 600) return 2;
  return 1;
}
