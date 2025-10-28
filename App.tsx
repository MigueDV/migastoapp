import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.emoji}>💰</Text>
          <Text style={styles.title}>MiGasto</Text>
          <Text style={styles.subtitle}>
            App de Control de Gastos Personales
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>✅ Configuración Completa</Text>
            <Text style={styles.cardText}>
              • Firebase Authentication configurado{'\n'}
              • Firestore Database listo{'\n'}
              • Almacenamiento local implementado{'\n'}
              • Estructura de proyecto creada{'\n'}
              • Servicios y modelos listos{'\n'}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>👥 Equipo</Text>
            <Text style={styles.cardText}>
              • Integrante 1: Autenticación{'\n'}
              • Integrante 2: CRUD de Gastos{'\n'}
              • Integrante 3: Dashboard{'\n'}
              • Integrante 4: Perfil y Componentes{'\n'}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              🚀 El proyecto está listo para desarrollo
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginTop: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default App;