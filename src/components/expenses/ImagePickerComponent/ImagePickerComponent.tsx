import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { styles } from './ImagePickerComponent.styles'

interface ImagePickerComponentProps {
  imagen: string | null;
  cargando: boolean;
  onTomarFoto: () => void;
  onSeleccionarImagen: () => void;
  onQuitarImagen: () => void;
}

export const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({
  imagen,
  cargando,
  onTomarFoto,
  onSeleccionarImagen,
  onQuitarImagen,
}) => {
  /**
   * Mostrar opciones para seleccionar imagen
   */
  const mostrarOpciones = () => {
    Alert.alert(
      'Agregar Recibo',
      'Selecciona una opción',
      [
        {
          text: 'Tomar Foto',
          onPress: onTomarFoto,
        },
        {
          text: 'Elegir de Galería',
          onPress: onSeleccionarImagen,
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto del Recibo (Opcional)</Text>

      {imagen ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imagen }} style={styles.image} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onQuitarImagen}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.changeButton}
            onPress={mostrarOpciones}
          >
            <Text style={styles.changeButtonText}>Cambiar Foto</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={mostrarOpciones}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#007AFF" />
          ) : (
            <>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadText}>Agregar Foto del Recibo</Text>
              <Text style={styles.uploadSubtext}>
                Toca para tomar una foto o seleccionar de galería
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
