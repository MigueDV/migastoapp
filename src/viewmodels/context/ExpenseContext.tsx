import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO } from '../../models/Expense';
import expensesService from '../../services/expenseService';
//import { useAuth } from '../hooks/useAuth';
import {
  obtenerInicioDeHoy,
  obtenerFinDeHoy,
  obtenerInicioDeSemana,
  obtenerInicioDeMes,
  obtenerFinDeMes,
} from '../../utils/dateHelpers';

interface ExpenseContextData {
  gastos: Expense[];
  gastosFiltrados: Expense[];
  cargando: boolean;
  error: string | null;
  categoriaSeleccionada: string;
  filtroFechaSeleccionado: string;
  agregarGasto: (gasto: CreateExpenseDTO) => Promise<void>;
  actualizarGasto: (id: string, datos: UpdateExpenseDTO) => Promise<void>;
  eliminarGasto: (gasto: Expense) => Promise<void>;
  refrescarGastos: () => Promise<void>;
  setCategoriaSeleccionada: (categoria: string) => void;
  setFiltroFechaSeleccionado: (filtro: string) => void;
  obtenerTotalGastos: () => number;
  obtenerGastosHoy: () => number;
  obtenerGastosMes: () => number;
  obtenerTotalesPorCategoria: () => Record<string, number>;
}

export const ExpenseContext = createContext<ExpenseContextData>(
  {} as ExpenseContextData
);

interface ExpenseProviderProps {
  children: ReactNode;
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [gastos, setGastos] = useState<Expense[]>([]);
  const [gastosFiltrados, setGastosFiltrados] = useState<Expense[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [filtroFechaSeleccionado, setFiltroFechaSeleccionado] = useState('todos');

  useEffect(() => {
    if (user) {
      cargarGastos();
    } else {
      setGastos([]);
      setGastosFiltrados([]);
    }
  }, [user]);

  useEffect(() => {
    aplicarFiltros();
  }, [gastos, categoriaSeleccionada, filtroFechaSeleccionado]);

  /**
   * Cargar gastos del usuario
   */
  const cargarGastos = async () => {
    if (!user) return;

    try {
      setCargando(true);
      setError(null);
      const datos = await expensesService.obtenerGastosUsuario(user.uid);
      setGastos(datos);
    } catch (err: any) {
      setError(err.message || 'Error al cargar gastos');
      console.error('Error al cargar gastos:', err);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Aplicar filtros a los gastos
   */
  const aplicarFiltros = () => {
    let filtrados = [...gastos];

    // Filtrar por categoría
    if (categoriaSeleccionada !== 'todos') {
      filtrados = expensesService.filtrarPorCategoria(
        filtrados,
        categoriaSeleccionada
      );
    }

    // Filtrar por fecha
    if (filtroFechaSeleccionado !== 'todos') {
      let fechaInicio: Date;
      let fechaFin = new Date();

      switch (filtroFechaSeleccionado) {
        case 'hoy':
          fechaInicio = obtenerInicioDeHoy();
          fechaFin = obtenerFinDeHoy();
          break;
        case 'semana':
          fechaInicio = obtenerInicioDeSemana();
          break;
        case 'mes':
          fechaInicio = obtenerInicioDeMes();
          fechaFin = obtenerFinDeMes();
          break;
        default:
          fechaInicio = new Date(0);
      }

      filtrados = expensesService.filtrarPorRangoFechas(
        filtrados,
        fechaInicio,
        fechaFin
      );
    }

    setGastosFiltrados(filtrados);
  };

  /**
   * Agregar nuevo gasto
   */
  const agregarGasto = async (datosGasto: CreateExpenseDTO) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      setCargando(true);
      setError(null);
      await expensesService.crearGasto(user.uid, datosGasto);
      await cargarGastos();
    } catch (err: any) {
      setError(err.message || 'Error al agregar gasto');
      throw err;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Actualizar gasto existente
   */
  const actualizarGasto = async (id: string, datos: UpdateExpenseDTO) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      setCargando(true);
      setError(null);
      await expensesService.actualizarGasto(id, user.uid, datos);
      await cargarGastos();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar gasto');
      throw err;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Eliminar gasto
   */
  const eliminarGasto = async (gasto: Expense) => {
    try {
      setCargando(true);
      setError(null);
      await expensesService.eliminarGasto(gasto);
      await cargarGastos();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar gasto');
      throw err;
    } finally {
      setCargando(false);
    }
  };

  /**
   * Refrescar lista de gastos
   */
  const refrescarGastos = async () => {
    await cargarGastos();
  };

  /**
   * Obtener total de gastos filtrados
   */
  const obtenerTotalGastos = (): number => {
    return expensesService.calcularTotal(gastosFiltrados);
  };

  /**
   * Obtener total de gastos de hoy
   */
  const obtenerGastosHoy = (): number => {
    const gastosHoy = expensesService.filtrarPorRangoFechas(
      gastos,
      obtenerInicioDeHoy(),
      obtenerFinDeHoy()
    );
    return expensesService.calcularTotal(gastosHoy);
  };

  /**
   * Obtener total de gastos del mes
   */
  const obtenerGastosMes = (): number => {
    const gastosMes = expensesService.filtrarPorRangoFechas(
      gastos,
      obtenerInicioDeMes(),
      obtenerFinDeMes()
    );
    return expensesService.calcularTotal(gastosMes);
  };

  /**
   * Obtener totales agrupados por categoría (del mes actual)
   */
  const obtenerTotalesPorCategoria = (): Record<string, number> => {
    const gastosMes = expensesService.filtrarPorRangoFechas(
      gastos,
      obtenerInicioDeMes(),
      obtenerFinDeMes()
    );

    const agrupados = expensesService.agruparPorCategoria(gastosMes);
    const totales: Record<string, number> = {};

    Object.keys(agrupados).forEach((categoria) => {
      totales[categoria] = expensesService.calcularTotal(agrupados[categoria]);
    });

    return totales;
  };

  return (
    <ExpenseContext.Provider
      value={{
        gastos,
        gastosFiltrados,
        cargando,
        error,
        categoriaSeleccionada,
        filtroFechaSeleccionado,
        agregarGasto,
        actualizarGasto,
        eliminarGasto,
        refrescarGastos,
        setCategoriaSeleccionada,
        setFiltroFechaSeleccionado,
        obtenerTotalGastos,
        obtenerGastosHoy,
        obtenerGastosMes,
        obtenerTotalesPorCategoria,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};