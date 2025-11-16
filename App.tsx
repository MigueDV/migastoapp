

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

/* Prueba del funcionamiento del crud

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/viewmodels/hooks/context/AuthContext';
import AddExpenseScreen from './src/screens/expenses/AddExpenseScreen';
import ExpenseDetailScreen from './src/screens/expenses/ExpenseDetailScreen';
import EditExpenseScreen from './src/screens/expenses/EditExpenseScreen';
import { ExpenseStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<ExpenseStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator>
          <Stack.Screen 
            name="AddExpense" 
            component={AddExpenseScreen}
            options={{ title: 'Agregar Gasto' }}
          />
          <Stack.Screen 
            name="ExpenseDetail" 
            component={ExpenseDetailScreen}
            options={{ title: 'Detalle del Gasto' }}
          />
          <Stack.Screen 
            name="EditExpense" 
            component={EditExpenseScreen}
            options={{ title: 'Editar Gasto' }}
          />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}

export default App;*/
