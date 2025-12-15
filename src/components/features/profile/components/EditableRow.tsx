import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useI18n } from "@/hooks";

interface EditableRowProps {
  label: string;
  value?: string | null;
  onPress: () => void;
}

export default function EditableRow({
  label,
  value,
  onPress,
}: EditableRowProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.rowValueContainer}>
        <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
          {value}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
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
  rowValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowValue: {
    fontSize: 17,
    marginRight: 5,
  },
});
