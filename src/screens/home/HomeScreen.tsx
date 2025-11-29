import React from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { SummaryCard } from '../../components/expenses/SummaryCard';
import { CategoryChart } from '../../components/expenses/CategoryChart';
import { ExpenseCard } from '../../components/expenses/ExpenseCard';
import { useExpenses } from '../../viewmodels/hooks/useExpenses';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    gastos,
    cargando,
    refrescarGastos,
    obtenerGastosMes,
    obtenerGastosHoy,
    obtenerTotalesPorCategoria,
  } = useExpenses();

  const totalMes = obtenerGastosMes();
  const totalHoy = obtenerGastosHoy();
  const totalesPorCategoria = obtenerTotalesPorCategoria();

  // Obtener últimos 5 gastos
  const ultimosGastos = gastos.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={cargando} onRefresh={refrescarGastos} />
      }
    >
      {/* Resumen */}
      <SummaryCard
        totalMes={totalMes}
        totalHoy={totalHoy}
        cantidadGastos={gastos.length}
      />

      {/* Gráfico de Categorías */}
      <CategoryChart totalesPorCategoria={totalesPorCategoria} />

      {/* Últimos Gastos */}
      <View style={styles.recentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gastos Recientes</Text>
          <Text
            style={styles.seeAll}
            onPress={() =>
              navigation.navigate('ExpenseList', {
                screen: 'ExpenseListMain',
              })
            }
          >
            Ver todos
          </Text>
        </View>

        {ultimosGastos.length > 0 ? (
          ultimosGastos.map((gasto) => (
            <ExpenseCard
              key={gasto.id}
              gasto={gasto}
              onPress={() =>
                navigation.navigate('ExpenseList', {
                  screen: 'ExpenseDetail',
                  params: { expenseId: gasto.id },
                })
              }
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📝</Text>
            <Text style={styles.emptySubtext}>
              No hay gastos registrados aún
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  recentSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default HomeScreen;