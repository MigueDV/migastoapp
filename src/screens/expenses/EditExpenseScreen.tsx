import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ExpenseStackParamList } from '../../navigation/types';
import { ExpenseForm } from '../../components/expenses/ExpenseForm';
import { useForm } from '../../viewmodels/hooks/useForm';
import { validadores } from '../../utils/validators';
import { useAuth } from '../../viewmodels/hooks/useAuth';
import expenseService from '../../services/expenseService';
import { UpdateExpenseDTO } from '../../models/Expense';
import { useCurrency } from '../../viewmodels/hooks/useCurrency';

type EditExpenseScreenNavigationProp = NativeStackNavigationProp<
  ExpenseStackParamList,
  'EditExpense'
>;

type EditExpenseScreenRouteProp = RouteProp<
  ExpenseStackParamList,
  'EditExpense'
>;

interface Props {
  navigation: EditExpenseScreenNavigationProp;
  route: EditExpenseScreenRouteProp;
}

interface ExpenseFormValues {
  monto: string;
  categoria: string;
  descripcion: string;
  fecha: Date;
}

const EditExpenseScreen: React.FC<Props> = ({ navigation, route }) => {
  const { expense } = route.params;
  const { user } = useAuth();
  const { convertir, divisa } = useCurrency();
  const [cargando, setCargando] = useState(false);
  const [imagenRecibo, setImagenRecibo] = useState<string | null>(
    expense.imagenUrl || null
  );

  const { values, errors, touched, handleChange, validate } =
    useForm<ExpenseFormValues>(
      {
        monto: convertir(expense.monto, 'USD').toString(),
        categoria: expense.categoria,
        descripcion: expense.descripcion,
        fecha: expense.fecha,
      },
      {
        monto: (value: string) =>
          validadores.numeroPositivo('Monto')(parseFloat(value) || 0),
        categoria: validadores.requerido('Categoría'),
        descripcion: validadores.requerido('Descripción'),
      }
    );

  /**
   * Actualizar gasto
   */
  const handleActualizar = async () => {
    if (!validate()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No hay usuario autenticado');
      return;
    }

    try {
      setCargando(true);

      const montoEnUSD = convertir(parseFloat(values.monto), divisa, 'USD');

      const datosActualizar: UpdateExpenseDTO = {
        monto: montoEnUSD,
        categoria: values.categoria,
        descripcion: values.descripcion.trim(),
        fecha: values.fecha,
      };

      // Solo agregar imagen si cambió
      if (imagenRecibo !== expense.imagenUrl) {
        datosActualizar.imagenRecibo = imagenRecibo || undefined;
      }

      await expenseService.actualizarGasto(expense.id, user.uid, datosActualizar);

      Alert.alert('¡Éxito!', 'Gasto actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error('Error al actualizar gasto:', error);
      Alert.alert('Error', error.message || 'No se pudo actualizar el gasto');
    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <ExpenseForm
          monto={values.monto}
          categoria={values.categoria}
          descripcion={values.descripcion}
          fecha={values.fecha}
          onMontoChange={(text) => handleChange('monto', text)}
          onCategoriaChange={(cat) => handleChange('categoria', cat)}
          onDescripcionChange={(text) => handleChange('descripcion', text)}
          onFechaChange={(date) => handleChange('fecha', date)}
          onImagenChange={setImagenRecibo}
          imagenInicial={expense.imagenUrl}
          errors={errors}
          touched={touched}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, cargando && styles.buttonDisabled]}
            onPress={handleActualizar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>💾 Actualizar Gasto</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  button: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default EditExpenseScreen;
