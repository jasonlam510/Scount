import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme, useI18n } from "@/hooks";

interface EmptyGroupStateProps {
  message?: string;
}

export default function EmptyGroupState({ message }: EmptyGroupStateProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  const displayMessage = message || t("group.noGroups");

  return (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        {displayMessage}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
