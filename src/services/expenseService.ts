import { where, orderBy, Timestamp } from 'firebase/firestore';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO } from '../models/Expense';
import firestoreService from './firebase/firestoreService';
import storageService from './firebase/storageService';

const NOMBRE_COLECCION = 'gastos';

class ExpenseService {
  /*Crear nuevo gasto*/
  async crearGasto(
    userId: string,
    datosGasto: CreateExpenseDTO
  ): Promise<string> {
    try {
      let imagenUrl: string | undefined;

      // Guardar imagen localmente si existe
      if (datosGasto.imagenRecibo) {
        imagenUrl = await storageService.subirRecibo(
          datosGasto.imagenRecibo,
          userId
        );
      }

      const gasto = {
        userId,
        monto: datosGasto.monto,
        categoria: datosGasto.categoria,
        descripcion: datosGasto.descripcion,
        fecha: Timestamp.fromDate(datosGasto.fecha),
        imagenUrl,
      };

      return await firestoreService.crearDocumento(NOMBRE_COLECCION, gasto);
    } catch (error) {
      console.error('Error al crear gasto:', error);
      throw new Error('Error al crear el gasto');
    }
  }

  /*Obtener gastos del usuario*/
  async obtenerGastosUsuario(userId: string): Promise<Expense[]> {
    try {
      return await firestoreService.consultarDocumentos<Expense>(
        NOMBRE_COLECCION,
        [where('userId', '==', userId), orderBy('fecha', 'desc')]
      );
    } catch (error) {
      console.error('Error al obtener gastos:', error);
      throw new Error('Error al obtener los gastos');
    }
  }

  /*Obtener gasto por ID*/
  async obtenerGastoPorId(idGasto: string): Promise<Expense | null> {
    try {
      return await firestoreService.obtenerDocumento<Expense>(
        NOMBRE_COLECCION,
        idGasto
      );
    } catch (error) {
      console.error('Error al obtener gasto:', error);
      throw new Error('Error al obtener el gasto');
    }
  }

  /*Actualizar gasto*/
  async actualizarGasto(
    idGasto: string,
    userId: string,
    datos: UpdateExpenseDTO
  ): Promise<void> {
    try {
      const datosActualizar: any = {};

      if (datos.monto !== undefined) datosActualizar.monto = datos.monto;
      if (datos.categoria !== undefined)
        datosActualizar.categoria = datos.categoria;
      if (datos.descripcion !== undefined)
        datosActualizar.descripcion = datos.descripcion;
      if (datos.fecha !== undefined)
        datosActualizar.fecha = Timestamp.fromDate(datos.fecha);

      // Manejar nueva imagen
      if (datos.imagenRecibo) {
        const imagenUrl = await storageService.subirRecibo(
          datos.imagenRecibo,
          userId
        );
        datosActualizar.imagenUrl = imagenUrl;
      }

      await firestoreService.actualizarDocumento(
        NOMBRE_COLECCION,
        idGasto,
        datosActualizar
      );
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
      throw new Error('Error al actualizar el gasto');
    }
  }

  /*Eliminar gasto*/
  async eliminarGasto(gasto: Expense): Promise<void> {
    try {
      // Eliminar imagen local si existe
      if (gasto.imagenUrl) {
        await storageService.eliminarImagen(gasto.imagenUrl);
      }

      await firestoreService.eliminarDocumento(NOMBRE_COLECCION, gasto.id);
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
      throw new Error('Error al eliminar el gasto');
    }
  }

  /*Calcular total de gastos*/
  calcularTotal(gastos: Expense[]): number {
    return gastos.reduce((total, gasto) => total + gasto.monto, 0);
  }

  /*Agrupar gastos por categoría*/
  agruparPorCategoria(gastos: Expense[]): Record<string, Expense[]> {
    return gastos.reduce((acumulador, gasto) => {
      const categoria = gasto.categoria;
      if (!acumulador[categoria]) {
        acumulador[categoria] = [];
      }
      acumulador[categoria].push(gasto);
      return acumulador;
    }, {} as Record<string, Expense[]>);
  }

  /*Filtrar por categoría*/
  filtrarPorCategoria(gastos: Expense[], idCategoria: string): Expense[] {
    if (idCategoria === 'todos') return gastos;
    return gastos.filter((gasto) => gasto.categoria === idCategoria);
  }

  /*Filtrar por rango de fechas*/
  filtrarPorRangoFechas(
    gastos: Expense[],
    fechaInicio: Date,
    fechaFin: Date
  ): Expense[] {
    return gastos.filter((gasto) => {
      const fechaGasto = new Date(gasto.fecha);
      return fechaGasto >= fechaInicio && fechaGasto <= fechaFin;
    });
  }
}

export default new ExpenseService();