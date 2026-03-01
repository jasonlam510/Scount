import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks";

interface BadgeProps {
  label: string;
}

export default function Badge({ label }: BadgeProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.badge, { backgroundColor: colors.primary }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 34,
    height: 24,
    borderRadius: 8,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
