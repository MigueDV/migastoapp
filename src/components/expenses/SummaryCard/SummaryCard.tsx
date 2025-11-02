import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './SummaryCard.styles';
//import { formatearMoneda } from '../../../utils/formatters';
//import { useAuth } from '../../../viewmodels/hooks/useAuth';

interface SummaryCardProps {
  totalMes: number;
  totalHoy: number;
  cantidadGastos: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  totalMes,
  totalHoy,
  cantidadGastos,
}) => {
  const { user } = useAuth();
  const presupuesto = user?.monthlyBudget || 0;
  const restante = presupuesto - totalMes;
  const porcentajeGastado = presupuesto > 0 ? (totalMes / presupuesto) * 100 : 0;

  /**
   * Obtener color según porcentaje gastado
   */
  const obtenerColorProgreso = (): string => {
    if (porcentajeGastado >= 90) return '#FF3B30';
    if (porcentajeGastado >= 70) return '#FF9500';
    return '#34C759';
  };

  return (
    <View style={styles.container}>
      {/* Total del Mes */}
      <View style={styles.mainAmount}>
        <Text style={styles.label}>Total del Mes</Text>
        <Text style={styles.amount}>{formatearMoneda(totalMes)}</Text>
      </View>

      {/* Barra de Progreso */}
      {presupuesto > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(porcentajeGastado, 100)}%`,
                  backgroundColor: obtenerColorProgreso(),
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {porcentajeGastado.toFixed(0)}% del presupuesto
          </Text>
        </View>
      )}

      {/* Información Adicional */}
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Presupuesto</Text>
          <Text style={styles.infoValue}>{formatearMoneda(presupuesto)}</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Restante</Text>
          <Text
            style={[
              styles.infoValue,
              { color: restante >= 0 ? '#34C759' : '#FF3B30' },
            ]}
          >
            {formatearMoneda(restante)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Stats Adicionales */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Hoy</Text>
          <Text style={styles.statValue}>{formatearMoneda(totalHoy)}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Gastos</Text>
          <Text style={styles.statValue}>{cantidadGastos}</Text>
        </View>
      </View>
    </View>
  );
};