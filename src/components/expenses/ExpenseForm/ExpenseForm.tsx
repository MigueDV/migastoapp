import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CATEGORIAS } from '../../../utils/constants';
import { ImagePickerComponent } from '../ImagePickerComponent/ImagePickerComponent';
import { useImagePicker } from '../../../viewmodels/hooks/useImagePicker';
import { styles } from './ExpenseForm.styles';

interface ExpenseFormProps {
  monto: string;
  categoria: string;
  descripcion: string;
  fecha: Date;
  onMontoChange: (text: string) => void;
  onCategoriaChange: (categoria: string) => void;
  onDescripcionChange: (text: string) => void;
  onFechaChange: (fecha: Date) => void;
  onImagenChange: (uri: string | null) => void;
  imagenInicial?: string | null;
  errors?: {
    monto?: string;
    categoria?: string;
    descripcion?: string;
  };
  touched?: {
    monto?: boolean;
    categoria?: boolean;
    descripcion?: boolean;
  };
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  monto,
  categoria,
  descripcion,
  fecha,
  onMontoChange,
  onCategoriaChange,
  onDescripcionChange,
  onFechaChange,
  onImagenChange,
  imagenInicial,
  errors,
  touched,
}) => {
  const [mostrarDatePicker, setMostrarDatePicker] = React.useState(false);
  const { imagen, cargando, seleccionarImagen, tomarFoto, quitarImagen, setImagen } =
    useImagePicker();

  // Inicializar imagen si hay una inicial
  React.useEffect(() => {
    if (imagenInicial) {
      setImagen(imagenInicial);
    }
  }, [imagenInicial]);

  // Notificar cambios de imagen al padre
  React.useEffect(() => {
    onImagenChange(imagen);
  }, [imagen]);

  /**
   * Manejar cambio de fecha
   */
  const handleFechaChange = (event: any, selectedDate?: Date) => {
    setMostrarDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onFechaChange(selectedDate);
    }
  };

  /**
   * Formatear fecha para mostrar
   */
  const formatearFecha = (date: Date): string => {
    const opciones: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', opciones);
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Monto */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Monto *</Text>
        <View style={styles.montoInputContainer}>
          <Text style={styles.montoSymbol}>$</Text>
          <TextInput
            style={[
              styles.montoInput,
              touched?.monto && errors?.monto && styles.inputError,
            ]}
            placeholder="0.00"
            value={monto}
            onChangeText={onMontoChange}
            keyboardType="decimal-pad"
          />
        </View>
        {touched?.monto && errors?.monto && (
          <Text style={styles.errorText}>{errors.monto}</Text>
        )}
      </View>

      {/* Categoría */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Categoría *</Text>
        <View style={styles.categoriaContainer}>
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoriaButton,
                categoria === cat.id && styles.categoriaButtonActive,
              ]}
              onPress={() => onCategoriaChange(cat.id)}
            >
              <Text style={styles.categoriaIcon}>{cat.icono}</Text>
              <Text
                style={[
                  styles.categoriaText,
                  categoria === cat.id && styles.categoriaTextActive,
                ]}
              >
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {touched?.categoria && errors?.categoria && (
          <Text style={styles.errorText}>{errors.categoria}</Text>
        )}
      </View>

      {/* Descripción */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción *</Text>
        <TextInput
          style={[
            styles.textArea,
            touched?.descripcion && errors?.descripcion && styles.inputError,
          ]}
          placeholder="¿En qué gastaste?"
          value={descripcion}
          onChangeText={onDescripcionChange}
          multiline
          numberOfLines={3}
          maxLength={200}
        />
        <Text style={styles.charCount}>{descripcion.length}/200</Text>
        {touched?.descripcion && errors?.descripcion && (
          <Text style={styles.errorText}>{errors.descripcion}</Text>
        )}
      </View>

      {/* Fecha */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Fecha *</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setMostrarDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>📅 {formatearFecha(fecha)}</Text>
        </TouchableOpacity>

        {mostrarDatePicker && (
          <DateTimePicker
            value={fecha}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleFechaChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      {/* Imagen del Recibo */}
      <ImagePickerComponent
        imagen={imagen}
        cargando={cargando}
        onTomarFoto={tomarFoto}
        onSeleccionarImagen={seleccionarImagen}
        onQuitarImagen={quitarImagen}
      />
    </ScrollView>
  );
};
