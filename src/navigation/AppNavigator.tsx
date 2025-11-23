import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../viewmodels/hooks/useAuth';
import { LoadingScreen } from '../components/common/Loading';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegador raíz de la aplicación
 * Decide si mostrar Auth o Main según estado de autenticación
 */
const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Usuario autenticado → Mostrar app principal
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        // Usuario NO autenticado → Mostrar login/registro
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;