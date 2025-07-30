import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ExpensesProvider } from './src/context/ExpensesContext';
import BottomTabs from './src/navigation/BottomTabs';

export default function App() {
  return (
    <ExpensesProvider>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </ExpensesProvider>
  );
}
