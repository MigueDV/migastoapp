import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { CATEGORIAS, FILTROS_FECHA } from '../../../utils/constants';
import { styles } from './FilterBar.styles';

interface FilterBarProps {
  categoriaSeleccionada: string;
  filtroFechaSeleccionado: string;
  onCategoriaChange: (categoria: string) => void;
  onFiltroFechaChange: (filtro: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categoriaSeleccionada,
  filtroFechaSeleccionado,
  onCategoriaChange,
  onFiltroFechaChange,
}) => {
  const opcionesFecha = [
    { id: 'todos', label: 'Todo' },
    { id: FILTROS_FECHA.HOY, label: 'Hoy' },
    { id: FILTROS_FECHA.SEMANA, label: 'Semana' },
    { id: FILTROS_FECHA.MES, label: 'Mes' },
  ];

  return (
    <View style={styles.container}>
      {/* Filtros de Fecha */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Período</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {opcionesFecha.map((opcion) => (
            <TouchableOpacity
              key={opcion.id}
              style={[
                styles.filterChip,
                filtroFechaSeleccionado === opcion.id && styles.filterChipActive,
              ]}
              onPress={() => onFiltroFechaChange(opcion.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filtroFechaSeleccionado === opcion.id &&
                    styles.filterChipTextActive,
                ]}
              >
                {opcion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Filtros de Categoría */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categoría</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              categoriaSeleccionada === 'todos' && styles.filterChipActive,
            ]}
            onPress={() => onCategoriaChange('todos')}
          >
            <Text
              style={[
                styles.filterChipText,
                categoriaSeleccionada === 'todos' && styles.filterChipTextActive,
              ]}
            >
              Todas
            </Text>
          </TouchableOpacity>

          {CATEGORIAS.map((categoria) => (
            <TouchableOpacity
              key={categoria.id}
              style={[
                styles.filterChip,
                categoriaSeleccionada === categoria.id && styles.filterChipActive,
              ]}
              onPress={() => onCategoriaChange(categoria.id)}
            >
              <Text style={styles.categoryIcon}>{categoria.icono}</Text>
              <Text
                style={[
                  styles.filterChipText,
                  categoriaSeleccionada === categoria.id &&
                    styles.filterChipTextActive,
                ]}
              >
                {categoria.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Limpiar Filtros */}
      {(categoriaSeleccionada !== 'todos' || filtroFechaSeleccionado !== 'todos') && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            onCategoriaChange('todos');
            onFiltroFechaChange('todos');
          }}
        >
          <Text style={styles.clearButtonText}>✕ Limpiar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};