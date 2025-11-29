import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ExpenseStackParamList } from '../../navigation/types';
import { CATEGORIAS } from '../../utils/constants';
import { formatearFecha } from '../../utils/formatters';
import expenseService from '../../services/expenseService';
import { useCurrency } from '../../viewmodels/hooks/useCurrency';

type ExpenseDetailScreenNavigationProp = NativeStackNavigationProp<
  ExpenseStackParamList,
  'ExpenseDetail'
>;

type ExpenseDetailScreenRouteProp = RouteProp<
  ExpenseStackParamList,
  'ExpenseDetail'
>;

interface Props {
  navigation: ExpenseDetailScreenNavigationProp;
  route: ExpenseDetailScreenRouteProp;
}

const ExpenseDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { expenseId } = route.params;
  const { formatear } = useCurrency();
  const [cargando, setCargando] = useState(false);
  const [gasto, setGasto] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = expenseService.escucharGastoPorId(expenseId, (nuevoGasto) => {
      if (!nuevoGasto) {
        Alert.alert('Gasto no encontrado');
        navigation.goBack();
        return;
      }
      setGasto(nuevoGasto);
      setCargando(false);
    });
  
    return () => unsubscribe();
  }, [expenseId]);

  /**
   * Cargar datos del gasto
   */
  const cargarGasto = async () => {
    try {
      setCargando(true);
      const datos = await expenseService.obtenerGastoPorId(expenseId);
      setGasto(datos);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el gasto');
      navigation.goBack();
    } finally {
      setCargando(false);
    }
  };

  /**
   * Eliminar gasto
   */
  const handleEliminar = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setCargando(true);
              await expenseService.eliminarGasto(gasto);
              Alert.alert('Éxito', 'Gasto eliminado', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            } finally {
              setCargando(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Obtener categoría
   */
  const obtenerCategoria = () => {
    return CATEGORIAS.find((cat) => cat.id === gasto?.categoria);
  };

  if (cargando || !gasto) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const categoria = obtenerCategoria();

  return (
    <ScrollView style={styles.container}>
      {/* Imagen del recibo */}
      {gasto.imagenUrl && (
        <Image source={{ uri: gasto.imagenUrl }} style={styles.image} />
      )}

      {/* Información del gasto */}
      <View style={styles.content}>
        {/* Categoría */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryIcon}>{categoria?.icono}</Text>
          <Text style={styles.categoryName}>{categoria?.nombre}</Text>
        </View>

        {/* Monto */}
        <Text style={styles.amount}>{formatear(gasto.monto)}</Text>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{gasto.descripcion}</Text>
        </View>

        {/* Fecha */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha</Text>
          <Text style={styles.dateText}>
            📅 {formatearFecha(
                  gasto.fecha instanceof Date
                    ? gasto.fecha
                    : new Date(gasto.fecha || Date.now())
                )}
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditExpense', { expense: gasto })}
          >
            <Text style={styles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleEliminar}
          >
            <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#F0F0F0',
  },
  content: {
    padding: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  editButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ExpenseDetailScreen;
