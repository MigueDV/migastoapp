import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList, ExpenseStackParamList } from './types';
import { Text } from 'react-native';

// Pantallas
import HomeScreen from '../screens/home/HomeScreen';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';
import ExpenseListScreen from '../screens/expenses/ExpenseListScreen';
import ExpenseDetailScreen from '../screens/expenses/ExpenseDetailScreen';
import EditExpenseScreen from '../screens/expenses/EditExpenseScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<ExpenseStackParamList>();

/**
 * Stack Navigator para Gastos (incluye detalle y edición)
 */
const ExpenseStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExpenseListMain"
        component={ExpenseListScreen}
        options={{ headerShown: false }}
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
  );
};

/**
 * Navegación principal con Bottom Tabs
 */
const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          headerShown: true,
          headerTitle: '💰 MiGasto',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          title: 'Agregar',
          headerShown: true,
          headerTitle: 'Nuevo Gasto',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24 }}>➕</Text>
          ),
        }}
      />
      <Tab.Screen
        name="ExpenseList"
        component={ExpenseStack}
        options={{
          title: 'Gastos',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24 }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerShown: true,
          headerTitle: 'Mi Perfil',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;