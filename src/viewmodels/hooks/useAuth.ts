import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Hook para acceder al contexto de autenticación

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
};
