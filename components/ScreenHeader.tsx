import { Box, Text } from "@gluestack-ui/themed";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";

interface ScreenHeaderProps {
  title: string;
}

export function ScreenHeader({ title }: ScreenHeaderProps) {
  return (
    <Box
      mt="$6"
      mb="$4"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      {/* badge à esquerda */}
      <LinearGradient
        colors={["#2E7D32", "#66BB6A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.badgeOuter}
      >
        <Box
          bg="$backgroundLight0"
          borderRadius={999}
          px="$3"
          py="$1"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="$xs" fontWeight="$semibold" color="$emerald700">
            school helper
          </Text>
        </Box>
      </LinearGradient>

      {/* título menor à direita */}
      <Text fontSize="$lg" fontWeight="$bold" color="$emerald700">
        {title}
      </Text>
    </Box>
  );
}

const styles = StyleSheet.create({
  badgeOuter: {
    borderRadius: 999,
    padding: 2,
    alignSelf: "flex-start",
  },
});
