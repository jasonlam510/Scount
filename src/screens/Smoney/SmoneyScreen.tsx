import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExpenses } from '../../context/ExpensesContext';
import { useTheme } from '../../context/ThemeContext';

const SmoneyScreen: React.FC = () => {
  const { expenses, addExpense } = useExpenses();
  const [newExpense, setNewExpense] = useState('');
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const handleAddExpense = () => {
    if (newExpense.trim()) {
      addExpense(newExpense.trim());
      setNewExpense('');
    } else {
      Alert.alert('Error', 'Please enter an expense description');
    }
  };

  const renderExpenseItem = ({ item }: { item: string }) => (
    <View style={[styles.expenseItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.expenseText, { color: colors.text }]}>{item}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Smoney</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Track your personal expenses</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text
          }]}
          value={newExpense}
          onChangeText={setNewExpense}
          placeholder="Enter expense description"
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={handleAddExpense}
        />
        <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.primary }]} onPress={handleAddExpense}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        <Text style={[styles.listTitle, { color: colors.text }]}>Your Expenses</Text>
        {expenses.length > 0 ? (
          <FlatList
            style={styles.list}
            data={expenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No expenses yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Add your first expense above</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  list: {
    flex: 1,
  },
  expenseItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  expenseText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
});

export default SmoneyScreen; 