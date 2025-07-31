import React from 'react';
import { View, Text, ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ExpenseItem from './ExpenseItem';
import DailyTotal from '../DailyTotal';

interface ExpenseData {
  id: string;
  description: string;
  payer: string;
  amount: number;
  currency: string;
  type: 'expense' | 'income';
  icon: string;
  date: string;
}

interface SmartListProps {
  data: ExpenseData[];
  groupBy?: 'date' | 'category' | 'payer';
  renderItem?: (item: ExpenseData) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const SmartList: React.FC<SmartListProps> = ({
  data,
  groupBy = 'date',
  renderItem,
  style,
  contentContainerStyle,
}) => {
  const { colors } = useTheme();

  // Group data by the specified field
  const groupedData = data.reduce((groups, item) => {
    const key = item[groupBy as keyof ExpenseData] as string;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, ExpenseData[]>);

  // Calculate daily totals
  const calculateDailyTotal = (items: ExpenseData[]) => {
    return items.reduce((sum, item) => {
      return item.type === 'expense' ? sum - item.amount : sum + item.amount;
    }, 0);
  };

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const renderExpenseItem = (item: ExpenseData) => {
    if (renderItem) {
      return renderItem(item);
    }
    return <ExpenseItem key={item.id} item={item} />;
  };

  return (
    <ScrollView 
      style={[defaultStyles.scrollContainer, style]}
      contentContainerStyle={[defaultStyles.scrollContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    >
      {sortedDates.map((date) => {
        const items = groupedData[date];
        const dailyTotal = calculateDailyTotal(items);

        return (
          <View key={date} style={defaultStyles.dateGroup}>
            <View style={defaultStyles.dateHeader}>
              <Text style={[defaultStyles.dateText, { color: colors.textSecondary }]}>
                {date}
              </Text>
              <DailyTotal total={dailyTotal} currency="HK$" />
            </View>
            {items.map((item) => (
              <View key={item.id}>
                {renderExpenseItem(item)}
              </View>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};

const defaultStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  dateGroup: {
    marginBottom: 10,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
  },
});

export default SmartList; 