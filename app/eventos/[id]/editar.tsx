import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../../../constants/api';
import { useAuth } from '../../context/AuthContext';

export default function EditarEventoScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace('/login');
    }
  }, [authLoading, token]);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        const event = res.data;
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setDate(event.date);
        setTime(event.time);
      } catch (error) {
        console.error('Error al cargar el evento:', error);
        Alert.alert('Error', 'No se pudo cargar el evento');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadEvent();
    }
  }, [id, token]);

  const handleUpdate = async () => {
    if (!title || !description || !location || !date || !time) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await api.put(`/events/${id}`, {
        title,
        description,
        location,
        date,
        time,
      });
      Alert.alert('Éxito', 'Evento actualizado correctamente');
      router.replace(`/eventos/${id}`);
    } catch (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar el evento');
    }
  };

  if (authLoading || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace(`/eventos`)}>
          <Ionicons name="arrow-back" size={24} color="#fff" style={{ marginRight: 12 }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar evento</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput style={styles.input} placeholder="Título" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} multiline />
        <TextInput style={styles.input} placeholder="Ubicación" value={location} onChangeText={setLocation} />
        <TextInput style={styles.input} placeholder="Fecha (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <TextInput style={styles.input} placeholder="Hora (HH:MM)" value={time} onChangeText={setTime} />

        <Button title="Guardar cambios" onPress={handleUpdate} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: {
    backgroundColor: '#007AFF',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
