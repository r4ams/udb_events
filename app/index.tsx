import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from './context/AuthContext';

export default function ProfileScreen() {
  const { token, name, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace('/login');
    }
  }, [loading, token]);

  if (loading || !token) return null;

  return (
    <View style={styles.container}>
      {/* Encabezado igual al de eventos */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Hola {name},</Text>
          <Text style={styles.bold}>Bienvenido!</Text>
        </View>
        <Ionicons name="person-circle-outline" size={36} color="#fff" />
      </View>

      {/* Contenido de perfil */}
      <View style={styles.content}>
        <Text style={styles.title}>👤 Perfil</Text>
        <Button title="Cerrar sesión" color="#FF3B30" onPress={logout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: { color: '#fff', fontSize: 18 },
  bold: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 22, marginBottom: 20 },
});
