const TASAS_DE_CAMBIO: Record<string, number> = {
    USD: 1,
    EUR: 0.85,
    MXN: 18.5,
    COP: 4200,
    ARS: 350,
    PEN: 3.7,
  };
  
  export const convertirMoneda = (
    monto: number,
    de: string,
    a: string
  ): number => {
    if (de === a) return monto;
    const tasaDe = TASAS_DE_CAMBIO[de] || 1;
    const tasaA = TASAS_DE_CAMBIO[a] || 1;
    const montoEnUSD = monto / tasaDe;
    return montoEnUSD * tasaA;
  };
  
  export const formatearMonedaConDivisa = (
    monto: number,
    divisa: string
  ): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: divisa,
    }).format(monto);
  };