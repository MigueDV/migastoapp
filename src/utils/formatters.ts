// src/utils/formatters.ts

/**
 * Formatear número como moneda
 * @param monto - Número a formatear
 * @returns String formateado como moneda ($1,234.56)
 */
export const formatearMoneda = (monto: number): string => {
  if (isNaN(monto)) {
    return '$0.00';
  }
  
  return `$${monto.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
};

/**
 * Formatear fecha completa
 * @param fecha - Fecha a formatear
 * @returns String con formato "15 dic 2024"
 */
export const formatearFecha = (fecha: Date): string => {
  if (!fecha || !(fecha instanceof Date)) {
    return '';
  }

  const opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
};

/**
 * Formatear fecha corta
 * @param fecha - Fecha a formatear
 * @returns String con formato "15 dic"
 */
export const formatearFechaCorta = (fecha: Date): string => {
  if (!fecha || !(fecha instanceof Date)) {
    return '';
  }

  const opciones: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
};

/**
 * Formatear fecha y hora
 * @param fecha - Fecha a formatear
 * @returns String con formato "15 dic 2024, 14:30"
 */
export const formatearFechaHora = (fecha: Date): string => {
  if (!fecha || !(fecha instanceof Date)) {
    return '';
  }

  const opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
};

/**
 * Capitalizar primera letra de un texto
 * @param texto - Texto a capitalizar
 * @returns String con primera letra mayúscula
 */
export const capitalizarPrimera = (texto: string): string => {
  if (!texto) {
    return '';
  }
  
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Formatear número como porcentaje
 * @param valor - Número entre 0 y 100
 * @returns String con formato "75.5%"
 */
export const formatearPorcentaje = (valor: number): string => {
  if (isNaN(valor)) {
    return '0%';
  }
  
  return `${valor.toFixed(1)}%`;
};