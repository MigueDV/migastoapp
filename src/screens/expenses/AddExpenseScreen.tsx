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
import { MainTabParamList } from '../../navigation/types';
import {ExpenseForm} from '../../components/expenses/ExpenseForm/ExpenseForm';
import { useForm } from '../../viewmodels/hooks/useForm';
import { validadores } from '../../utils/validators';
import { useAuth } from '../../viewmodels/hooks/useAuth';
import expenseService from '../../services/expenseService';
import { CreateExpenseDTO } from '../../models/Expense';
import { useCurrency } from '../../viewmodels/hooks/useCurrency';

type AddExpenseScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'AddExpense'
>;

interface Props {
  navigation: AddExpenseScreenNavigationProp;
}

interface ExpenseFormValues {
  monto: string;
  categoria: string;
  descripcion: string;
  fecha: Date;
}

const AddExpenseScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(false);
  const { convertir, divisa } = useCurrency();
  const [imagenRecibo, setImagenRecibo] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, validate, reset } =
    useForm<ExpenseFormValues>(
      {
        monto: '',
        categoria: '',
        descripcion: '',
        fecha: new Date(),
      },
      {
        monto: (value: string) =>
          validadores.numeroPositivo('Monto')(parseFloat(value) || 0),
        categoria: validadores.requerido('Categoría'),
        descripcion: validadores.requerido('Descripción'),
      }
    );

  /**
   * Guardar gasto
   */
  const handleGuardar = async () => {
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
  
      const nuevoGasto: CreateExpenseDTO = {
        monto: montoEnUSD,
        categoria: values.categoria,
        descripcion: values.descripcion.trim(),
        fecha: values.fecha,
        imagenRecibo: imagenRecibo || undefined,
      };
  
      await expenseService.crearGasto(user.uid, nuevoGasto);
  
      Alert.alert('¡Éxito!', 'Gasto registrado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            reset();
            setImagenRecibo(null);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error: any) {
      console.error('Error al guardar gasto:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar el gasto');
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
          errors={errors}
          touched={touched}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, cargando && styles.buttonDisabled]}
            onPress={handleGuardar}
            disabled={cargando}
          >
            {cargando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>💾 Guardar Gasto</Text>
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

export default AddExpenseScreen;
