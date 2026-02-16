import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
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
      <Switch
        trackColor={{ false: "#767577", true: colors.success }}
        thumbColor={value ? "#ffffff" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
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
