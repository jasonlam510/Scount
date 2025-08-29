import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { IDataProvider } from '../services/interfaces/IDataProvider';
import { DataProvider } from '../services/providers/DataProvider';

const DataProviderContext = createContext<IDataProvider | undefined>(undefined);

interface DataProviderProviderProps {
  children: ReactNode;
}

export const DataProviderProvider: React.FC<DataProviderProviderProps> = ({ children }) => {
  const [dataProvider, setDataProvider] = useState<IDataProvider | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeProvider = async () => {
      try {
        console.log('🚀 Initializing Data Provider...');
        const provider = new DataProvider();
        
        // Initialize the provider
        await provider.initialize();
        
        setDataProvider(provider);
        setIsInitialized(true);
        console.log('✅ Data Provider initialized successfully');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('❌ Failed to initialize Data Provider:', err);
      }
    };

    initializeProvider();

    // Cleanup on unmount
    return () => {
      if (dataProvider) {
        dataProvider.cleanup().catch(console.error);
      }
    };
  }, []);

  if (error) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h3>Failed to initialize app</h3>
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!isInitialized || !dataProvider) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h3>Initializing app...</h3>
        <p>Please wait while we set up your data...</p>
      </div>
    );
  }

  return (
    <DataProviderContext.Provider value={dataProvider}>
      {children}
    </DataProviderContext.Provider>
  );
};

export const useDataProvider = (): IDataProvider => {
  const context = useContext(DataProviderContext);
  if (context === undefined) {
    throw new Error('useDataProvider must be used within a DataProviderProvider');
  }
  return context;
};

