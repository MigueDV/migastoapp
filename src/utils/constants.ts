import { Category } from '../models/Category';

export const CATEGORIAS: Category[] = [
  { id: 'comida', nombre: 'Comida', icono: '🍔', color: '#FF6B6B' },
  { id: 'transporte', nombre: 'Transporte', icono: '🚗', color: '#4ECDC4' },
  { id: 'entretenimiento', nombre: 'Entretenimiento', icono: '🎬', color: '#FFE66D' },
  { id: 'compras', nombre: 'Compras', icono: '🛍️', color: '#A8E6CF' },
  { id: 'salud', nombre: 'Salud', icono: '💊', color: '#FF8B94' },
  { id: 'servicios', nombre: 'Servicios', icono: '💡', color: '#C7CEEA' },
  { id: 'otros', nombre: 'Otros', icono: '📌', color: '#B4B4B4' },
];

export const PRESUPUESTO_DEFAULT = 2000;
export const MONEDA_DEFAULT = '$';

export const FILTROS_FECHA = {
  HOY: 'hoy',
  SEMANA: 'semana',
  MES: 'mes',
  TODOS: 'todos',
};