
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Expense } from '../../../models/Expense';
import { CATEGORIAS } from '../../../utils/constants';
import { formatearFechaCorta } from '../../../utils/formatters';
import { styles } from './ExpenseCard.styles';
import { useCurrency } from '../../../viewmodels/hooks/useCurrency';

interface ExpenseCardProps {
  gasto: Expense;
  onPress: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ gasto, onPress }) => {
  /**
   * Obtener información de la categoría
   */
  const obtenerCategoria = () => {
    return CATEGORIAS.find((cat) => cat.id === gasto.categoria);
  };
  const { formatear } = useCurrency();
  const categoria = obtenerCategoria();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Imagen o Icono */}
      <View style={styles.leftSection}>
        {gasto.imagenUrl ? (
          <Image source={{ uri: gasto.imagenUrl }} style={styles.image} />
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: categoria?.color }]}>
            <Text style={styles.icon}>{categoria?.icono}</Text>
          </View>
        )}
      </View>

      {/* Información */}
      <View style={styles.centerSection}>
        <Text style={styles.description} numberOfLines={1}>
          {gasto.descripcion}
        </Text>
        <View style={styles.metaInfo}>
          <Text style={styles.category}>{categoria?.nombre}</Text>
          <Text style={styles.date}>
            • {formatearFechaCorta(new Date(gasto.fecha))}
          </Text>
        </View>
      </View>

      {/* Monto */}
      <View style={styles.rightSection}>
        <Text style={styles.amount}>{formatear(gasto.monto)}</Text>
      </View>
    </TouchableOpacity>
  );
};