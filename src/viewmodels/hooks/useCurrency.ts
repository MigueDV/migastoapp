import { useAuth } from './useAuth';
import { convertirMoneda, formatearMonedaConDivisa } from '../../services/currencyService';

export const useCurrency = () => {
  const { user } = useAuth();
  const divisa = user?.currency || 'USD';

  const convertir = (monto: number, de: string = 'USD') => {
    return convertirMoneda(monto, de, divisa);
  };

  const formatear = (monto: number, de: string = 'USD') => {
    const convertido = convertir(monto, de);
    return formatearMonedaConDivisa(convertido, divisa);
  };

  return { divisa, convertir, formatear };
};