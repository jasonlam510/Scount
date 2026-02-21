import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/hooks";
import type { Currency } from "@/utils/currency";

const ROW_HEIGHT = 36;

export interface CurrencyRowProps {
  currency: Currency;
}

export default function CurrencyRow({ currency }: CurrencyRowProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { minHeight: ROW_HEIGHT }]}>
      <Text style={styles.emoji} numberOfLines={1}>
        {currency.emoji}
      </Text>
      <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
        {currency.name}
      </Text>
      <Text
        style={[styles.code, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {currency.code}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 0,
  },
  emoji: {
    fontSize: 20,
  },
  name: {
    flex: 1,
    fontSize: 16,
    minWidth: 0,
  },
  code: {
    fontSize: 13,
  },
});
