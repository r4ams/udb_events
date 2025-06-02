// Home screen inspired by uploaded design
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import api from '../../constants/api';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const {name, token, role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace('/login');
    }
  }, [authLoading, token]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchEvents();
  }, [token]);

  if (authLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.welcome}>Hola {name || 'usuario'},</Text>
          <Text style={styles.welcomeBold}>Bienvenido!</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1144/1144760.png' }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      {/* Sección: Próximos eventos */}
      <Text style={styles.sectionTitle}>Próximos eventos</Text>
      <FlatList
        horizontal
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image
              source={{ uri: `https://picsum.photos/seed/event${item.id}/400/200` }}
              style={styles.eventImage}
            />
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable onPress={() => router.push(`/eventos/${item.id}`)}>
                <Text style={styles.link}>Ver más</Text>
              </Pressable>
              {role === 'organizador' && (
                <Pressable onPress={() => router.push(`/eventos/${item.id}/editar`)}>
                  <Text style={[styles.link, { color: '#FF9500' }]}>Editar</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingLeft: 16, paddingBottom: 16 }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Sección: Eventos destacados (simulado con los mismos eventos) */}
      <Text style={styles.sectionTitle}>Eventos destacados</Text>
      <FlatList
        horizontal
        data={events}
        keyExtractor={(item) => `destacado-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Image
              source={{ uri: `https://picsum.photos/seed/event${item.id}/400/200` }}
              style={styles.eventImage}
            />
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable onPress={() => router.push(`/eventos/${item.id}`)}>
                <Text style={styles.link}>Ver más</Text>
              </Pressable>
              {role === 'organizador' && (
                <Pressable onPress={() => router.push(`/eventos/${item.id}/editar`)}>
                  <Text style={[styles.link, { color: '#FF9500' }]}>Editar</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingLeft: 16, paddingBottom: 16 }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Botón para organizador */}
      {role === 'organizador' && (
        <View style={styles.buttonContainer}>
          <Button title="Agregar evento" onPress={() => router.push('/eventos/new')} color="#007AFF" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerContainer: {
    backgroundColor: '#007AFF',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: { color: '#fff', fontSize: 18 },
  welcomeBold: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 16, marginTop: 24, marginBottom: 8 },
  eventCard: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  eventImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  eventTitle: { fontSize: 16, fontWeight: 'bold' },
  eventDate: { fontSize: 14, color: '#777' },
  link: { color: '#007AFF', marginTop: 6 },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 40,
  },
});
