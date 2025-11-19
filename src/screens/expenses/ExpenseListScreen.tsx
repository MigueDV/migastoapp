import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { FilterBar } from '../../components/expenses/FilterBar';
import { ExpenseCard } from '../../components/expenses/ExpenseCard';
import { useExpenses } from '../../viewmodels/hooks/useExpenses';
import { formatearMoneda } from '../../utils/formatters';

type ExpenseListScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'ExpenseList'
>;

interface Props {
  navigation: ExpenseListScreenNavigationProp;
}

const ExpenseListScreen: React.FC<Props> = ({ navigation }) => {
  const {
    gastosFiltrados,
    cargando,
    categoriaSeleccionada,
    filtroFechaSeleccionado,
    setCategoriaSeleccionada,
    setFiltroFechaSeleccionado,
    refrescarGastos,
    obtenerTotalGastos,
  } = useExpenses();

  const totalFiltrado = obtenerTotalGastos();

  /**
   * Renderizar item de la lista
   */
  const renderItem = ({ item }: any) => (
    <ExpenseCard
      gasto={item}
      onPress={() =>
        navigation.navigate('ExpenseDetail', { expenseId: item.id })
      }
    />
  );

  /**
   * Renderizar header de la lista
   */
  const renderHeader = () => (
    <>
      <FilterBar
        categoriaSeleccionada={categoriaSeleccionada}
        filtroFechaSeleccionado={filtroFechaSeleccionado}
        onCategoriaChange={setCategoriaSeleccionada}
        onFiltroFechaChange={setFiltroFechaSeleccionado}
      />

      {/* Total Filtrado */}
      {gastosFiltrados.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>{formatearMoneda(totalFiltrado)}</Text>
        </View>
      )}
    </>
  );

  /**
   * Renderizar lista vacía
   */
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>📭</Text>
      <Text style={styles.emptySubtext}>
        No hay gastos con estos filtros
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={gastosFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={refrescarGastos} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    paddingBottom: 24,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default ExpenseListScreen;