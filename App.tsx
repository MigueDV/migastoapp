import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './src/viewmodels/context/AuthContext';
import { ExpenseProvider } from './src/viewmodels/context/ExpenseContext';
import HomeScreen from './src/screens/home/HomeScreen';
import ExpenseListScreen from './src/screens/expenses/ExpenseListScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <ExpenseProvider>
          <Tab.Navigator>
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ title: 'Inicio' }}
            />
            <Tab.Screen 
              name="ExpenseList" 
              component={ExpenseListScreen}
              options={{ title: 'Gastos' }}
            />
          </Tab.Navigator>
        </ExpenseProvider>
      </AuthProvider>
    </NavigationContainer>
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
