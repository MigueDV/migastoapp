import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/viewmodels/context/AuthContext';
import { ExpenseProvider } from './src/viewmodels/context/ExpenseContext';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Componente principal de la aplicación
 */
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <ExpenseProvider>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <AppNavigator />
          </ExpenseProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;