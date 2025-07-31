import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { ExpensesProvider } from './src/context/ExpensesContext';
import BottomTabs from './src/navigation/BottomTabs';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ExpensesProvider>
          <NavigationContainer>
            <BottomTabs />
          </NavigationContainer>
        </ExpensesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
