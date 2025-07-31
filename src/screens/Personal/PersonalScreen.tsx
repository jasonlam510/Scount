import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExpenses } from '../../context/ExpensesContext';
import { useTheme } from '../../context/ThemeContext';

const PersonalScreen: React.FC = () => {
  const { expenses, addExpense } = useExpenses();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState(0); // 0 for expenses, 1 for balances

  // Mock data for the design with dates
  const mockExpenses = [
    { id: '1', description: 'Three fish', payer: 'Paid by Shirley', amount: 'HK$57.60', icon: '💶', date: '27 Jul 2025' },
    { id: '2', description: 'Fish skin', payer: 'Paid by Shirley', amount: 'HK$7.20', icon: '💶', date: '27 Jul 2025' },
    { id: '3', description: 'Fishotto', payer: 'Paid by Shirley', amount: 'HK$187.20', icon: '💶', date: '27 Jul 2025' },
    { id: '4', description: 'Three dish', payer: 'Paid by Shirley', amount: 'HK$63.20', icon: '💶', date: '27 Jul 2025' },
    { id: '5', description: 'Carbonara', payer: 'Paid by Shirley', amount: 'HK$166.40', icon: '🚗', date: '27 Jul 2025' },
    { id: '6', description: 'Poke bowl', payer: 'Paid by Shirley', amount: 'HK$50.00', icon: '💶', date: '27 Jul 2025' },
    { id: '7', description: 'Lunch', payer: 'Paid by Shirley', amount: 'HK$186.40', icon: '💶', date: '27 Jul 2025' },
    { id: '8', description: 'Coffee', payer: 'Paid by Shirley', amount: 'HK$25.00', icon: '☕', date: '26 Jul 2025' },
    { id: '9', description: 'Dinner', payer: 'Paid by Shirley', amount: 'HK$120.00', icon: '🍽️', date: '26 Jul 2025' },
  ];

  // Group expenses by date
  const groupedExpenses = mockExpenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, typeof mockExpenses>);

  const myExpenses = 1182.30;
  const totalIncome = 9525.90;

  const renderExpenseItem = ({ item }: { item: any }) => (
    <View style={[styles.expenseItem, { backgroundColor: colors.surface }]}>
      <View style={styles.expenseIcon}>
        <Text style={styles.expenseIconText}>{item.icon}</Text>
      </View>
      <View style={styles.expenseContent}>
        <Text style={[styles.expenseDescription, { color: colors.text }]}>{item.description}</Text>
        <Text style={[styles.expensePayer, { color: colors.textSecondary }]}>{item.payer}</Text>
      </View>
      <Text style={[styles.expenseAmount, { color: colors.text }]}>{item.amount}</Text>
    </View>
  );

  const renderBalancesItem = ({ item }: { item: any }) => (
    <View style={[styles.balanceItem, { backgroundColor: colors.surface }]}>
      <View style={styles.balanceContent}>
        <Text style={[styles.balanceDescription, { color: colors.text }]}>{item.description}</Text>
        <Text style={[styles.balancePayer, { color: colors.textSecondary }]}>{item.payer}</Text>
      </View>
      <Text style={[styles.balanceAmount, { color: colors.text }]}>{item.amount}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.text === '#ffffff' ? 'light-content' : 'dark-content'} />
      
      {/* Navigation Header */}
      <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.background }]}>
        <View style={styles.headerLeft} />
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <SegmentedControl
          values={['Expenses', 'Balances']}
          selectedIndex={activeTab}
          onChange={(event) => setActiveTab(event.nativeEvent.selectedSegmentIndex)}
          style={styles.segmentedControl}
          appearance={colors.text === '#ffffff' ? 'dark' : 'light'}
        />
      </View>

      {/* Summary Section - Only show for Expenses tab */}
      {activeTab === 0 && (
        <>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expense</Text>
              <Text style={[styles.summaryAmount, { color: colors.text }]}>HK${myExpenses.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Income</Text>
              <Text style={[styles.summaryAmount, { color: colors.text }]}>HK${totalIncome.toLocaleString()}</Text>
            </View>
          </View>
        </>
      )}

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Content List */}
        {activeTab === 0 ? (
          Object.entries(groupedExpenses).map(([date, expenses]) => (
            <View key={date}>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>{date}</Text>
              {expenses.map((item) => (
                <View key={item.id}>
                  {renderExpenseItem({ item })}
                </View>
              ))}
            </View>
          ))
        ) : (
          // Balances content would go here
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No balances to show</Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, { backgroundColor: colors.primary }]}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.fabLabel, { color: colors.textSecondary }]}>Add Expense</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  tabContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  segmentedControl: {
    height: 32,
    marginHorizontal: 0,
  },
  summaryContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
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
  },
  balanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  balanceContent: {
    flex: 1,
  },
  balanceDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  balancePayer: {
    fontSize: 14,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginBottom: 8,
  },
  fabLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default PersonalScreen; 