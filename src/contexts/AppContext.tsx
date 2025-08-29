
import React, { createContext, useContext, ReactNode } from 'react';

// App-wide state interface (minimal)
interface AppState {
  // App lifecycle
  isAppReady: boolean;
  
  // Future: Electric client state
  // electricClient: ElectricClient | null;
  // isElectricConnected: boolean;
  
  // Future: App-wide error handling
  // globalError: string | null;
}

// App actions interface
interface AppActions {
  // App lifecycle
  setAppReady: (ready: boolean) => void;
  
  // Future: Electric client actions
  // setElectricClient: (client: ElectricClient | null) => void;
  // setElectricConnection: (connected: boolean) => void;
  
  // Future: Global error handling
  // setGlobalError: (error: string | null) => void;
}

// Combined context type
type AppContextType = AppState & AppActions;

// Default state
const defaultAppState: AppState = {
  isAppReady: false,
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider props
interface AppProviderProps {
  children: ReactNode;
}

// App provider component
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // For now, just provide basic app state
  // This will be expanded when you add Electric
  const value: AppContextType = {
    ...defaultAppState,
    setAppReady: () => {}, // Placeholder for now
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use app context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export context for direct access if needed
export { AppContext }; 