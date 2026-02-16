import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedSwitch } from "@/components";
import { useTheme } from "@/hooks";

interface SwitchRowProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void | Promise<void>;
}

export default function SwitchRow({
  label,
  value,
  onValueChange,
}: SwitchRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <ThemedSwitch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  rowLabel: {
    fontSize: 17,
  },
});
