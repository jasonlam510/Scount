import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks";

interface ExpenseItemData {
  id: string;
  description: string;
  payer: string;
  amount: number;
  currency: string;
  type: "expense" | "income";
  icon: string;
}

interface ExpenseItemProps {
  item: ExpenseItemData;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ item, onPress, style }) => {
  const { colors } = useTheme();

  const Container = onPress ? TouchableOpacity : View;
  const hasPayer = Boolean(item.payer?.trim());

  return (
    <Container
      style={[
        defaultStyles.expenseItem,
        { backgroundColor: colors.surface },
        style,
      ]}
      onPress={onPress}
    >
      <View style={defaultStyles.expenseIcon}>
        <Text style={defaultStyles.expenseIconText}>{item.icon}</Text>
      </View>
      <View
        style={[
          defaultStyles.expenseContent,
          !hasPayer && defaultStyles.expenseContentCentered,
        ]}
      >
        <Text
          style={[
            defaultStyles.expenseDescription,
            { color: colors.text },
            !hasPayer && defaultStyles.expenseDescriptionSolo,
          ]}
        >
          {item.description}
        </Text>
        {hasPayer && (
          <Text
            style={[
              defaultStyles.expensePayer,
              { color: colors.textSecondary },
            ]}
          >
            {item.payer}
          </Text>
        )}
      </View>
      <Text
        style={[
          defaultStyles.expenseAmount,
          {
            color: item.type === "income" ? colors.success : colors.text,
          },
        ]}
      >
        {item.type === "income" ? "+" : "-"}
        {item.currency}
        {item.amount.toFixed(2)}
      </Text>
    </Container>
  );
};

const defaultStyles = StyleSheet.create({
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    minHeight: 64,
  },
  expenseIcon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  expenseIconText: {
    fontSize: 28,
  },
  expenseContent: {
    flex: 1,
  },
  expenseContentCentered: {
    justifyContent: "center",
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  expenseDescriptionSolo: {
    marginBottom: 0,
  },
  expensePayer: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right", // Ensure right alignment
    minWidth: 80, // Give consistent width for alignment
  },
});

export default ExpenseItem;
