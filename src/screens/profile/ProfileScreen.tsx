import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/types';
import { useAuth } from '../../viewmodels/hooks/useAuth';
import { useExpenses } from '../../viewmodels/hooks/useExpenses';
import { useImagePicker } from '../../viewmodels/hooks/useImagePicker';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { formatearMoneda } from '../../utils/formatters';
import userService from '../../services/userService';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'Profile'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { gastos, obtenerGastosMes } = useExpenses();
  const { imagen, seleccionarImagen, tomarFoto, setImagen } = useImagePicker();

  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(user?.displayName || '');
  const [editandoPresupuesto, setEditandoPresupuesto] = useState(false);
  const [nuevoPresupuesto, setNuevoPresupuesto] = useState(
    user?.monthlyBudget?.toString() || '2000'
  );
  const [cargando, setCargando] = useState(false);

  React.useEffect(() => {
    if (user?.photoURL) {
      setImagen(user.photoURL);
    }
  }, [user?.photoURL]);

  /**
   * Cambiar foto de perfil
   */
  const handleCambiarFoto = () => {
    Alert.alert('Cambiar Foto', 'Selecciona una opción', [
      { text: 'Tomar Foto', onPress: tomarFoto },
      { text: 'Elegir de Galería', onPress: seleccionarImagen },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  /**
   * Guardar foto de perfil
   */
  const handleGuardarFoto = async () => {
    if (!imagen || !user) return;

    try {
      setCargando(true);
      await userService.actualizarFotoPerfil(imagen, user.uid);
      Alert.alert('Éxito', 'Foto de perfil actualizada');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Guardar nombre
   */
  const handleGuardarNombre = async () => {
    if (!nuevoNombre.trim()) {
      Alert.alert('Error', 'Ingresa un nombre válido');
      return;
    }

    try {
      setCargando(true);
      await userService.actualizarNombre(nuevoNombre.trim());
      setEditandoNombre(false);
      Alert.alert('Éxito', 'Nombre actualizado');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Guardar presupuesto
   */
  const handleGuardarPresupuesto = async () => {
    const presupuesto = parseFloat(nuevoPresupuesto);
    if (isNaN(presupuesto) || presupuesto <= 0) {
      Alert.alert('Error', 'Ingresa un presupuesto válido');
      return;
    }

    if (!user) return;

    try {
      setCargando(true);
      await userService.actualizarPresupuestoMensual(user.uid, presupuesto);
      setEditandoPresupuesto(false);
      Alert.alert('Éxito', 'Presupuesto actualizado');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setCargando(false);
    }
  };

  /**
   * Cerrar sesión
   */
  const handleCerrarSesion = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  // Calcular estadísticas
  const totalGastos = gastos.length;
  const totalHistorico = gastos.reduce((sum, g) => sum + g.monto, 0);
  const totalMes = obtenerGastosMes();
  const promedioMensual = totalGastos > 0 ? totalHistorico / totalGastos : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Foto de Perfil */}
      <Card variant="elevated" style={styles.profileCard}>
        <View style={styles.photoContainer}>
          <TouchableOpacity onPress={handleCambiarFoto}>
            {imagen ? (
              <Image source={{ uri: imagen }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>
                  {user?.displayName?.charAt(0).toUpperCase() || '👤'}
                </Text>
              </View>
            )}
            <View style={styles.photoEditBadge}>
              <Text style={styles.photoEditText}>📷</Text>
            </View>
          </TouchableOpacity>

          {imagen !== user?.photoURL && (
            <Button
              title="Guardar Foto"
              onPress={handleGuardarFoto}
              loading={cargando}
              size="small"
              style={styles.savePhotoButton}
            />
          )}
        </View>

        <Text style={styles.email}>{user?.email}</Text>
      </Card>

      {/* Información Personal */}
      <Card variant="elevated" style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        {editandoNombre ? (
          <View>
            <Input
              label="Nombre Completo"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
              placeholder="Tu nombre"
            />
            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => {
                  setNuevoNombre(user?.displayName || '');
                  setEditandoNombre(false);
                }}
                style={styles.halfButton}
              />
              <Button
                title="Guardar"
                onPress={handleGuardarNombre}
                loading={cargando}
                style={styles.halfButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre</Text>
              <Text style={styles.infoValue}>{user?.displayName}</Text>
            </View>
            <TouchableOpacity onPress={() => setEditandoNombre(true)}>
              <Text style={styles.editButton}>✏️ Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {/* Presupuesto Mensual */}
      <Card variant="elevated" style={styles.section}>
        <Text style={styles.sectionTitle}>Presupuesto Mensual</Text>

        {editandoPresupuesto ? (
          <View>
            <Input
              label="Presupuesto"
              value={nuevoPresupuesto}
              onChangeText={setNuevoPresupuesto}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => {
                  setNuevoPresupuesto(user?.monthlyBudget?.toString() || '2000');
                  setEditandoPresupuesto(false);
                }}
                style={styles.halfButton}
              />
              <Button
                title="Guardar"
                onPress={handleGuardarPresupuesto}
                loading={cargando}
                style={styles.halfButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Límite Mensual</Text>
              <Text style={styles.infoValue}>
                {formatearMoneda(user?.monthlyBudget || 0)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setEditandoPresupuesto(true)}>
              <Text style={styles.editButton}>✏️ Editar</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>

      {/* Estadísticas */}
      <Card variant="elevated" style={styles.section}>
        <Text style={styles.sectionTitle}>Mis Estadísticas</Text>

        <View style={styles.statGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalGastos}</Text>
            <Text style={styles.statLabel}>Total Gastos</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatearMoneda(totalHistorico)}
            </Text>
            <Text style={styles.statLabel}>Histórico</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatearMoneda(totalMes)}</Text>
            <Text style={styles.statLabel}>Este Mes</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {formatearMoneda(promedioMensual)}
            </Text>
            <Text style={styles.statLabel}>Promedio</Text>
          </View>
        </View>
      </Card>

      {/* Cerrar Sesión */}
      <Button
        title="Cerrar Sesión"
        variant="danger"
        onPress={handleCerrarSesion}
        fullWidth
        style={styles.logoutButton}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>MiGasto v1.0.0</Text>
        <Text style={styles.footerText}>
          Miembro desde {new Date(user?.createdAt || '').getFullYear()}
        </Text>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoEditText: {
    fontSize: 16,
  },
  savePhotoButton: {
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  editButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
});

export default ProfileScreen;