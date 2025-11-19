import { useContext } from 'react';

import { ExpenseContext } from '../../viewmodels/context/ExpenseContext'

/**
 * Hook para acceder al contexto de gastos
 */
export const useExpenses = () => {
  const context = useContext(ExpenseContext);

  if (!context) {
    throw new Error('useExpenses debe usarse dentro de ExpenseProvider');
  }

  return context;
};