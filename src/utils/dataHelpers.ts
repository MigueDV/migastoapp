// src/utils/dateHelpers.ts

/**
 * Obtener inicio del día actual (00:00:00)
 * @returns Date con hora en 00:00:00
 */
export const obtenerInicioDeHoy = (): Date => {
  const fecha = new Date();
  fecha.setHours(0, 0, 0, 0);
  return fecha;
};

/**
 * Obtener fin del día actual (23:59:59)
 * @returns Date con hora en 23:59:59
 */
export const obtenerFinDeHoy = (): Date => {
  const fecha = new Date();
  fecha.setHours(23, 59, 59, 999);
  return fecha;
};

/**
 * Obtener inicio de la semana actual (Lunes 00:00:00)
 * @returns Date del lunes de la semana actual
 */
export const obtenerInicioDeSemana = (): Date => {
  const fecha = new Date();
  const dia = fecha.getDay();
  const diferencia = fecha.getDate() - dia + (dia === 0 ? -6 : 1);
  const lunes = new Date(fecha.setDate(diferencia));
  lunes.setHours(0, 0, 0, 0);
  return lunes;
};

/**
 * Obtener fin de la semana actual (Domingo 23:59:59)
 * @returns Date del domingo de la semana actual
 */
export const obtenerFinDeSemana = (): Date => {
  const inicio = obtenerInicioDeSemana();
  const domingo = new Date(inicio);
  domingo.setDate(inicio.getDate() + 6);
  domingo.setHours(23, 59, 59, 999);
  return domingo;
};

/**
 * Obtener inicio del mes actual (día 1 a las 00:00:00)
 * @returns Date del primer día del mes
 */
export const obtenerInicioDeMes = (): Date => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1, 0, 0, 0, 0);
};

/**
 * Obtener fin del mes actual (último día a las 23:59:59)
 * @returns Date del último día del mes
 */
export const obtenerFinDeMes = (): Date => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0, 23, 59, 59, 999);
};

/**
 * Obtener inicio del año actual
 * @returns Date del 1 de enero
 */
export const obtenerInicioDeAnio = (): Date => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), 0, 1, 0, 0, 0, 0);
};

/**
 * Obtener fin del año actual
 * @returns Date del 31 de diciembre
 */
export const obtenerFinDeAnio = (): Date => {
  const fecha = new Date();
  return new Date(fecha.getFullYear(), 11, 31, 23, 59, 59, 999);
};

/**
 * Verificar si una fecha es hoy
 * @param fecha - Fecha a verificar
 * @returns true si la fecha es hoy
 */
export const esHoy = (fecha: Date): boolean => {
  if (!fecha || !(fecha instanceof Date)) {
    return false;
  }

  const hoy = new Date();
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
};

/**
 * Verificar si una fecha está en el mes actual
 * @param fecha - Fecha a verificar
 * @returns true si la fecha está en el mes actual
 */
export const esMesActual = (fecha: Date): boolean => {
  if (!fecha || !(fecha instanceof Date)) {
    return false;
  }

  const hoy = new Date();
  return (
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
};

/**
 * Verificar si una fecha está en la semana actual
 * @param fecha - Fecha a verificar
 * @returns true si la fecha está en la semana actual
 */
export const esSemanaActual = (fecha: Date): boolean => {
  if (!fecha || !(fecha instanceof Date)) {
    return false;
  }

  const inicioSemana = obtenerInicioDeSemana();
  const finSemana = obtenerFinDeSemana();
  
  return fecha >= inicioSemana && fecha <= finSemana;
};

/**
 * Obtener número de días entre dos fechas
 * @param fecha1 - Primera fecha
 * @param fecha2 - Segunda fecha
 * @returns Número de días de diferencia
 */
export const obtenerDiasEntre = (fecha1: Date, fecha2: Date): number => {
  const unDia = 24 * 60 * 60 * 1000; // milisegundos en un día
  const diferencia = Math.abs(fecha1.getTime() - fecha2.getTime());
  return Math.round(diferencia / unDia);
};