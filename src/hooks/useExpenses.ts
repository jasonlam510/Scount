import { useState, useEffect } from 'react';
import { useDataProvider } from '../contexts/DataProviderContext';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, ExpenseFilters } from '../services/types';

export const useExpenses = () => {
  const { expenses } = useDataProvider();
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to real-time updates (works with both mock and ElectricSQL)
    const unsubscribe = expenses.subscribe((updatedExpenses) => {
      setExpenseList(updatedExpenses);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, [expenses]);

  const addExpense = async (expense: CreateExpenseRequest) => {
    try {
      setLoading(true);
      await expenses.create(expense);
      // No need to manually update state - subscription will handle it
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add expense';
      setError(errorMessage);
      console.error('Failed to add expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, updates: UpdateExpenseRequest) => {
    try {
      setLoading(true);
      await expenses.update(id, updates);
      // No need to manually update state - subscription will handle it
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update expense';
      setError(errorMessage);
      console.error('Failed to update expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setLoading(true);
      await expenses.delete(id);
      // No need to manually update state - subscription will handle it
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete expense';
      setError(errorMessage);
      console.error('Failed to delete expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const getExpenseById = async (id: string) => {
    try {
      return await expenses.getById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get expense';
      setError(errorMessage);
      console.error('Failed to get expense:', err);
      return null;
    }
  };

  const getExpensesByCategory = async (category: string) => {
    try {
      setLoading(true);
      const categoryExpenses = await expenses.getByCategory(category);
      return categoryExpenses;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get expenses by category';
      setError(errorMessage);
      console.error('Failed to get expenses by category:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getExpensesByDateRange = async (startDate: string, endDate: string) => {
    try {
      setLoading(true);
      const dateRangeExpenses = await expenses.getByDateRange(startDate, endDate);
      return dateRangeExpenses;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get expenses by date range';
      setError(errorMessage);
      console.error('Failed to get expenses by date range:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = async (filters?: ExpenseFilters) => {
    try {
      return await expenses.getTotalAmount(filters);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get total amount';
      setError(errorMessage);
      console.error('Failed to get total amount:', err);
      return 0;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    expenses: expenseList,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    getExpensesByCategory,
    getExpensesByDateRange,
    getTotalAmount,
    clearError,
  };
};

