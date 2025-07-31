import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ExpenseItemData {
  id: string;
  description: string;
  payer: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income';
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

  return (
    <Container 
      style={[defaultStyles.expenseItem, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
    >
      <View style={defaultStyles.expenseIcon}>
        <Text style={defaultStyles.expenseIconText}>{item.icon}</Text>
      </View>
      <View style={defaultStyles.expenseContent}>
        <Text style={[defaultStyles.expenseDescription, { color: colors.text }]}>
          {item.description}
        </Text>
        <Text style={[defaultStyles.expensePayer, { color: colors.textSecondary }]}>
          {item.payer}
        </Text>
      </View>
      <Text style={[
        defaultStyles.expenseAmount, 
        { 
          color: item.type === 'income' ? colors.success : colors.text 
        }
      ]}>
        {item.type === 'income' ? '+' : '-'}{item.currency}{item.amount.toFixed(2)}
      </Text>
    </Container>
  );
};

const defaultStyles = StyleSheet.create({
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseIconText: {
    fontSize: 20,
  },
  expenseContent: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  expensePayer: {
    fontSize: 14,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right', // Ensure right alignment
    minWidth: 80, // Give consistent width for alignment
  },
});

export default ExpenseItem; 