import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ExpensesContextType {
  expenses: string[];
  addExpense: (item: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

interface ExpensesProviderProps {
  children: ReactNode;
}

export const ExpensesProvider: React.FC<ExpensesProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<string[]>([]);

  const addExpense = (item: string) => {
    setExpenses(prevExpenses => [...prevExpenses, item]);
  };

  const value: ExpensesContextType = {
    expenses,
    addExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = (): ExpensesContextType => {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
}; 