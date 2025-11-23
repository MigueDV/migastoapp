import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { CATEGORIAS } from '../../../utils/constants';
import { formatearMoneda } from '../../../utils/formatters';
import { styles } from './CategoryChart.styles';

interface CategoryChartProps {
  totalesPorCategoria: Record<string, number>;
}

export const CategoryChart: React.FC<CategoryChartProps> = ({
  totalesPorCategoria,
}) => {
  /**
   * Preparar datos para el gráfico
   */
  const obtenerDatosGrafico = () => {
    const datos = Object.entries(totalesPorCategoria)
      .filter(([_, total]) => total > 0)
      .map(([categoriaId, total]) => {
        const categoria = CATEGORIAS.find((cat) => cat.id === categoriaId);
        return {
          name: categoria?.nombre || 'Otros',
          total: total,
          color: categoria?.color || '#B4B4B4',
          legendFontColor: '#666',
          legendFontSize: 12,
        };
      })
      .sort((a, b) => b.total - a.total);

    return datos;
  };

  const datosGrafico = obtenerDatosGrafico();
  const totalGeneral = datosGrafico.reduce((sum, item) => sum + item.total, 0);

  if (datosGrafico.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Gastos por Categoría</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📊</Text>
          <Text style={styles.emptySubtext}>
            No hay gastos en este período
          </Text>
        </View>
      </View>
    );
  }

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gastos por Categoría</Text>

      <PieChart
        data={datosGrafico}
        width={screenWidth - 48}
        height={200}
        chartConfig={chartConfig}
        accessor="total"
        backgroundColor="transparent"
        paddingLeft="0"
        absolute
      />

      {/* Lista de Categorías */}
      <View style={styles.categoryList}>
        {datosGrafico.map((item, index) => {
          const porcentaje = ((item.total / totalGeneral) * 100).toFixed(1);
          return (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <View
                  style={[styles.colorDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.categoryName}>{item.name}</Text>
              </View>
              <View style={styles.categoryAmount}>
                <Text style={styles.categoryValue}>
                  {formatearMoneda(item.total)}
                </Text>
                <Text style={styles.categoryPercent}>{porcentaje}%</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};