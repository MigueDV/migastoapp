// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/viewmodels/context/AuthContext';
import AuthNavigator from './src/navigation/AuthNavigator';

/**
 * Componente principal de la aplicación
 * Versión temporal para probar autenticación
 */
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
          <AuthNavigator />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;